"""
Models for orders and order items.
"""

import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator

from events.models import Event, Category


class Order(models.Model):
    """
    Represents a customer order.
    Supports both guest and authenticated user checkout.
    """
    
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=20, unique=True, editable=False)
    
    # Customer information (for both guest and authenticated users)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='orders'
    )
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    comments = models.TextField(blank=True)
    
    # Order details
    total_amount = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0
    )
    status = models.CharField(
        max_length=20, 
        choices=ORDER_STATUS, 
        default='pending'
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
    
    def __str__(self):
        return f"Order {self.order_number} - {self.name}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            self.order_number = self._generate_order_number()
        super().save(*args, **kwargs)
    
    def _generate_order_number(self):
        """Generate unique order number in format DT/1001, DT/1002, etc."""
        from django.db.models import Max

        # Get the highest existing order number
        last_order = Order.objects.filter(
            order_number__startswith='DT/'
        ).aggregate(
            max_number=Max('order_number')
        )

        if last_order['max_number']:
            # Extract the numeric part and increment
            try:
                last_num = int(last_order['max_number'].split('/')[1])
                new_num = last_num + 1
            except (IndexError, ValueError):
                new_num = 1001
        else:
            # Start from 1001
            new_num = 1001

        return f"DT/{new_num}"
    
    def calculate_total(self):
        """Recalculate total from order items."""
        self.total_amount = sum(item.subtotal for item in self.items.all())
        self.save(update_fields=['total_amount'])
        return self.total_amount
    
    @property
    def total_tickets(self):
        """Get total number of tickets in order."""
        return sum(item.quantity for item in self.items.all())


class OrderItem(models.Model):
    """
    Represents an individual line item in an order.
    Maps to the frontend's CartItem interface.
    """
    
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name='items'
    )
    event = models.ForeignKey(
        Event, 
        on_delete=models.PROTECT,
        related_name='order_items'
    )
    category = models.ForeignKey(
        Category, 
        on_delete=models.PROTECT,
        related_name='order_items'
    )
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        default=1
    )
    unit_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    subtotal = models.DecimalField(
        max_digits=12, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    
    # Snapshot of event/category data at time of order
    event_title = models.CharField(max_length=200)
    event_date = models.CharField(max_length=10)
    event_month = models.CharField(max_length=10)
    event_day = models.CharField(max_length=10)
    event_time = models.CharField(max_length=20)
    category_name = models.CharField(max_length=100)
    venue = models.CharField(max_length=200)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['created_at']
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'
    
    def __str__(self):
        return f"{self.quantity}x {self.category_name} for {self.event_title}"
    
    def save(self, *args, **kwargs):
        # Calculate subtotal
        self.subtotal = self.unit_price * self.quantity
        
        # Snapshot event/category data if not set
        if not self.event_title:
            self.event_title = self.event.title
            self.event_date = self.event.date
            self.event_month = self.event.month
            self.event_day = self.event.day
            self.event_time = self.event.time
            self.venue = self.event.venue
        if not self.category_name:
            self.category_name = self.category.name
        if not self.unit_price:
            self.unit_price = self.category.price
        
        super().save(*args, **kwargs)
