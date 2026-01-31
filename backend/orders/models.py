"""
Models for orders and order items.

FINANCIAL IMMUTABILITY GUARANTEE (B6):
Once an order is created, the following fields are FROZEN and must NEVER change:
- OrderItem.unit_price (price at time of purchase)
- OrderItem.quantity (number of tickets)
- OrderItem.subtotal (unit_price * quantity)
- Order.total_amount (sum of all item subtotals)
- Order.currency (ISO 4217 currency code)
- Order.stripe_amount_cents (amount in smallest currency unit)

These fields represent the binding financial agreement with the customer.
Future catalog price changes MUST NOT affect existing orders.

CURRENCY ARCHITECTURE (Variant 1 - Site-level):
- Each SalesChannel has a fixed currency
- Order.currency is set from SalesChannel at creation time
- Order.stripe_amount_cents = total_amount * 100 (for USD/EUR/etc)
- Stripe uses these frozen values for checkout and webhook validation
"""

import uuid
from decimal import Decimal
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, RegexValidator
from django.core.exceptions import ValidationError

from events.models import Event, Category


# =============================================================================
# SALES CHANNEL MODEL (Site-level currency configuration)
# =============================================================================

class SalesChannel(models.Model):
    """
    Represents a sales channel/site with fixed currency.

    Variant 1 Architecture:
    - Each site has ONE currency (no multi-currency UI)
    - Currency is determined at site level, not ticket level
    - Future Variant 2 can add ticket-level currency override

    For dubaitennistickets.com: currency = "USD"
    """

    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('EUR', 'Euro'),
        ('GBP', 'British Pound'),
        ('AED', 'UAE Dirham'),
    ]

    name = models.CharField(
        max_length=100,
        unique=True,
        help_text='Human-readable name (e.g., "Dubai Tennis Tickets")'
    )
    domain = models.CharField(
        max_length=255,
        unique=True,
        help_text='Domain name (e.g., "dubaitennistickets.com")'
    )
    currency = models.CharField(
        max_length=3,
        choices=CURRENCY_CHOICES,
        default='USD',
        validators=[RegexValidator(r'^[A-Z]{3}$', 'Must be 3-letter ISO 4217 code')],
        help_text='ISO 4217 currency code. FROZEN for all orders from this channel.'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Sales Channel'
        verbose_name_plural = 'Sales Channels'

    def __str__(self):
        return f"{self.name} ({self.currency})"

    @classmethod
    def get_default(cls):
        """
        Get the default sales channel.
        Creates one if it doesn't exist (for dubaitennistickets.com).
        """
        channel, created = cls.objects.get_or_create(
            domain='dubaitennistickets.com',
            defaults={
                'name': 'Dubai Tennis Tickets',
                'currency': 'USD',
                'is_active': True,
            }
        )
        return channel


# =============================================================================
# ORDER MODEL
# =============================================================================


class Order(models.Model):
    """
    Represents a customer order.
    Supports both guest and authenticated user checkout.

    IMMUTABLE FIELDS (after creation):
    - total_amount: Frozen financial total, derived from OrderItem.subtotal
    - currency: ISO 4217 currency code from SalesChannel
    - stripe_amount_cents: Amount in smallest currency unit for Stripe
    - order_number: Unique identifier, never changes
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

    # Sales channel reference (for currency determination)
    sales_channel = models.ForeignKey(
        SalesChannel,
        on_delete=models.PROTECT,
        null=True,  # Allow null for backwards compatibility with existing orders
        blank=True,
        related_name='orders',
        help_text='Sales channel that originated this order'
    )

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

    # Order details - FROZEN after creation (B6)
    total_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        default=0,
        help_text='FROZEN: Total amount at time of order creation. Never recalculate from catalog.'
    )
    currency = models.CharField(
        max_length=3,
        default='USD',
        validators=[RegexValidator(r'^[A-Z]{3}$', 'Must be 3-letter ISO 4217 code')],
        help_text='FROZEN: ISO 4217 currency code. Set from SalesChannel at creation.'
    )
    stripe_amount_cents = models.PositiveIntegerField(
        default=0,
        help_text='FROZEN: Amount in smallest currency unit (cents). Used for Stripe validation.'
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

    # Payment tracking (for webhook idempotency)
    payment_intent_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        unique=True,
        help_text='Stripe PaymentIntent ID. Used for idempotency checks.'
    )

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

    def calculate_total_on_creation(self):
        """
        Calculate total from order items - ONLY call during initial order creation.

        WARNING (B6): This should NEVER be called on existing orders.
        The total_amount is frozen at order creation time.
        """
        self.total_amount = sum(item.subtotal for item in self.items.all())
        self.stripe_amount_cents = self._calculate_stripe_amount_cents()
        self.save(update_fields=['total_amount', 'stripe_amount_cents'])
        return self.total_amount

    def _calculate_stripe_amount_cents(self) -> int:
        """
        Calculate amount in smallest currency unit for Stripe.

        For USD, EUR, GBP, AED: multiply by 100 (cents).
        For zero-decimal currencies (JPY, etc): no multiplication needed.

        Returns:
            Amount in smallest currency unit (integer)
        """
        # Zero-decimal currencies (no cents)
        ZERO_DECIMAL_CURRENCIES = {'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF',
                                   'KRW', 'MGA', 'PYG', 'RWF', 'UGX', 'VND',
                                   'VUV', 'XAF', 'XOF', 'XPF'}

        if self.currency.upper() in ZERO_DECIMAL_CURRENCIES:
            return int(self.total_amount)

        # Standard currencies: multiply by 100
        return int(self.total_amount * 100)

    @property
    def total_tickets(self):
        """Get total number of tickets in order."""
        return sum(item.quantity for item in self.items.all())


class OrderItem(models.Model):
    """
    Represents an individual line item in an order.
    Maps to the frontend's CartItem interface.

    IMMUTABLE FIELDS (B6 - FROZEN after creation):
    - unit_price: The exact price customer agreed to pay, NEVER changes
    - quantity: Number of tickets, NEVER changes after order
    - subtotal: unit_price * quantity, NEVER changes
    - event_title, event_date, etc.: Snapshot of event at purchase time
    - category_name: Snapshot of category at purchase time

    These fields capture the binding financial agreement.
    Future catalog changes must NOT affect existing orders.
    """

    # Frozen fields that must never change after creation
    FROZEN_FINANCIAL_FIELDS = ['unit_price', 'quantity', 'subtotal']
    FROZEN_SNAPSHOT_FIELDS = ['event_title', 'event_date', 'event_month',
                              'event_day', 'event_time', 'category_name', 'venue']

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

    # FROZEN FINANCIAL FIELDS (B6) - NEVER modify after creation
    quantity = models.PositiveIntegerField(
        validators=[MinValueValidator(1)],
        default=1,
        help_text='FROZEN: Number of tickets at order time'
    )
    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='FROZEN: Price per ticket at order time. Never recalculate from catalog.'
    )
    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='FROZEN: unit_price * quantity at order time'
    )

    # FROZEN SNAPSHOT FIELDS - Event/category data at time of order
    event_title = models.CharField(max_length=200, help_text='FROZEN: Event title at order time')
    event_date = models.CharField(max_length=10, help_text='FROZEN: Event date at order time')
    event_month = models.CharField(max_length=10, help_text='FROZEN: Event month at order time')
    event_day = models.CharField(max_length=10, help_text='FROZEN: Event day at order time')
    event_time = models.CharField(max_length=20, help_text='FROZEN: Event time at order time')
    category_name = models.CharField(max_length=100, help_text='FROZEN: Category name at order time')
    venue = models.CharField(max_length=200, help_text='FROZEN: Venue at order time')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity}x {self.category_name} for {self.event_title}"

    def clean(self):
        """
        Validate that frozen fields are not being modified on existing records.

        B6 IMMUTABILITY GUARD: Prevents accidental modification of financial data.
        """
        if self.pk:  # Existing record
            try:
                original = OrderItem.objects.get(pk=self.pk)

                # Check frozen financial fields
                for field in self.FROZEN_FINANCIAL_FIELDS:
                    original_value = getattr(original, field)
                    new_value = getattr(self, field)
                    if original_value != new_value:
                        raise ValidationError({
                            field: f'Cannot modify frozen field "{field}" on existing order. '
                                   f'Original: {original_value}, Attempted: {new_value}'
                        })

                # Check frozen snapshot fields
                for field in self.FROZEN_SNAPSHOT_FIELDS:
                    original_value = getattr(original, field)
                    new_value = getattr(self, field)
                    if original_value != new_value:
                        raise ValidationError({
                            field: f'Cannot modify frozen snapshot field "{field}" on existing order.'
                        })

            except OrderItem.DoesNotExist:
                pass  # New record, allow all fields

    def save(self, *args, **kwargs):
        """
        Save order item with immutability protection.

        On creation:
        - Captures unit_price from category (if not explicitly set)
        - Snapshots event/category data
        - Calculates subtotal

        On update:
        - Validates frozen fields via clean()
        - Only status-related updates allowed
        """
        is_new = self.pk is None

        if is_new:
            # NEW ITEM: Capture price and snapshot data

            # Capture unit_price from category ONLY if not explicitly provided
            # Use 'is None' check, not 'if not', to allow price of 0 (free tickets)
            if self.unit_price is None:
                self.unit_price = self.category.price

            # Calculate subtotal from frozen unit_price
            self.subtotal = Decimal(str(self.unit_price)) * self.quantity

            # Snapshot event data (frozen at order time)
            if not self.event_title:
                self.event_title = self.event.title
            if not self.event_date:
                self.event_date = self.event.date
            if not self.event_month:
                self.event_month = self.event.month
            if not self.event_day:
                self.event_day = self.event.day
            if not self.event_time:
                self.event_time = self.event.time
            if not self.venue:
                self.venue = self.event.venue

            # Snapshot category data (frozen at order time)
            if not self.category_name:
                self.category_name = self.category.name
        else:
            # EXISTING ITEM: Validate immutability (B6)
            self.full_clean()

        super().save(*args, **kwargs)

    @classmethod
    def create_from_cart_item(cls, order, event, category, quantity, unit_price=None):
        """
        Factory method to create OrderItem with proper price capture.

        Args:
            order: Parent Order instance
            event: Event instance
            category: Category instance
            quantity: Number of tickets
            unit_price: Override price (optional, uses category.price if None)

        Returns:
            OrderItem with frozen financial data
        """
        return cls.objects.create(
            order=order,
            event=event,
            category=category,
            quantity=quantity,
            unit_price=unit_price if unit_price is not None else category.price,
            # Snapshot fields are auto-populated in save()
        )
