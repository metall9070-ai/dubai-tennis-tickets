"""
Models for events, tournaments, and ticket categories.
"""

from django.db import models
from django.core.validators import MinValueValidator


class Tournament(models.Model):
    """
    Represents a tennis tournament (e.g., WTA 1000, ATP 500).
    """
    
    TOURNAMENT_TYPES = [
        ('WTA', 'WTA 1000'),
        ('ATP', 'ATP 500'),
    ]
    
    name = models.CharField(max_length=200)
    type = models.CharField(max_length=3, choices=TOURNAMENT_TYPES)
    year = models.PositiveIntegerField(default=2026)
    description = models.TextField(blank=True)
    venue = models.CharField(max_length=200, default='Dubai Duty Free Tennis Stadium')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['type', 'year']
        verbose_name = 'Tournament'
        verbose_name_plural = 'Tournaments'
    
    def __str__(self):
        return f"{self.name} ({self.get_type_display()}) {self.year}"


class Event(models.Model):
    """
    Represents an individual match day/session within a tournament.
    Maps to the frontend's Event interface.
    """
    
    tournament = models.ForeignKey(
        Tournament, 
        on_delete=models.CASCADE, 
        related_name='events'
    )
    title = models.CharField(max_length=200)
    date = models.CharField(max_length=10, help_text='Day of month, e.g., "15"')
    day = models.CharField(max_length=10, help_text='Day name, e.g., "Sun"')
    month = models.CharField(max_length=10, help_text='Month abbrev, e.g., "FEB"')
    time = models.CharField(max_length=20, help_text='Event time, e.g., "11:00 AM"')
    event_date = models.DateField(help_text='Actual date for sorting and filtering')
    min_price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='Minimum ticket price for this event'
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['event_date', 'time']
        verbose_name = 'Event'
        verbose_name_plural = 'Events'
    
    def __str__(self):
        return f"{self.title} - {self.date} {self.month}"
    
    @property
    def type(self):
        """Return tournament type for frontend compatibility."""
        return self.tournament.type
    
    @property
    def venue(self):
        """Return venue from tournament."""
        return self.tournament.venue
    
    def update_min_price(self):
        """Update min_price based on lowest category price."""
        min_cat_price = self.categories.filter(is_active=True).aggregate(
            models.Min('price')
        )['price__min']
        if min_cat_price is not None:
            self.min_price = min_cat_price
            self.save(update_fields=['min_price'])


class Category(models.Model):
    """
    Represents a seating category for an event.
    Maps to the frontend's Category interface.
    """
    
    event = models.ForeignKey(
        Event, 
        on_delete=models.CASCADE, 
        related_name='categories'
    )
    name = models.CharField(max_length=100)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    color = models.CharField(
        max_length=20, 
        default='#1e824c',
        help_text='Hex color code for UI display'
    )
    seats_total = models.PositiveIntegerField(default=100)
    seats_available = models.PositiveIntegerField(default=100)
    sort_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['sort_order', 'price']
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
    
    def __str__(self):
        return f"{self.name} - ${self.price} ({self.event.title})"
    
    @property
    def seats_left(self):
        """Alias for frontend compatibility."""
        return self.seats_available
    
    def reserve_seats(self, quantity):
        """
        Reserve seats for an order.
        Returns True if successful, False if not enough seats.
        """
        if quantity <= self.seats_available:
            self.seats_available -= quantity
            self.save(update_fields=['seats_available'])
            return True
        return False
    
    def release_seats(self, quantity):
        """Release seats back to available (e.g., for cancelled orders)."""
        self.seats_available = min(self.seats_total, self.seats_available + quantity)
        self.save(update_fields=['seats_available'])
