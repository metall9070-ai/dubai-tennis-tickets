"""
Models for events, tournaments, and ticket categories.
"""

from decimal import Decimal
from django.db import models
from django.db.models import Min
from django.db.models.signals import post_delete
from django.dispatch import receiver
from django.core.validators import MinValueValidator
from django.utils.text import slugify


def generate_unique_slug(model_class, base_slug, instance=None):
    """
    Generate a unique slug for a model instance.
    Appends -2, -3, etc. if slug already exists.
    """
    slug = base_slug
    counter = 2

    while True:
        # Check if slug exists (excluding current instance if updating)
        qs = model_class.objects.filter(slug=slug)
        if instance and instance.pk:
            qs = qs.exclude(pk=instance.pk)

        if not qs.exists():
            return slug

        slug = f"{base_slug}-{counter}"
        counter += 1


class Tournament(models.Model):
    """
    Represents a tennis tournament (e.g., WTA 1000, ATP 500).
    """

    TOURNAMENT_TYPES = [
        ('WTA', 'WTA 1000'),
        ('ATP', 'ATP 500'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        help_text='SEO-friendly URL slug. Auto-generated on first save.'
    )
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

    def save(self, *args, **kwargs):
        """
        Auto-generate slug on FIRST save only.
        Slug format: {name}-{year} (e.g., 'wta-1000-dubai-2026')
        """
        # Only generate slug if this is a new record (no pk) and slug is empty
        if not self.pk and not self.slug:
            base_slug = slugify(f"{self.name}-{self.year}")
            self.slug = generate_unique_slug(Tournament, base_slug, self)

        super().save(*args, **kwargs)


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
    slug = models.SlugField(
        max_length=255,
        unique=True,
        blank=True,
        help_text='SEO-friendly URL slug. Auto-generated on first save.'
    )
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

    def save(self, *args, **kwargs):
        """
        Auto-generate slug on FIRST save only.
        Slug format: {title}-{month}-{date} (e.g., 'womens-day-1-feb-15')
        """
        # Only generate slug if this is a new record (no pk) and slug is empty
        if not self.pk and not self.slug:
            base_slug = slugify(f"{self.title}-{self.month}-{self.date}")
            self.slug = generate_unique_slug(Event, base_slug, self)

        # Check if we need to trigger min_price recalculation
        # (This is handled separately from slug generation)
        super().save(*args, **kwargs)

    @property
    def type(self):
        """Return tournament type for frontend compatibility."""
        return self.tournament.type

    @property
    def venue(self):
        """Return venue from tournament."""
        return self.tournament.venue

    def recalculate_min_price(self):
        """
        Recalculate min_price from purchasable categories.

        Called automatically when:
        - A Category is created/updated/deleted
        - A Category is activated/deactivated

        Only considers categories where:
        - is_active=True (available for purchase)
        - show_on_frontend=True (visible in UI)
        - seats_available > 0 (has seats left)

        Returns 0 if no qualifying categories exist.
        """
        result = self.categories.filter(
            is_active=True,
            show_on_frontend=True,
            seats_available__gt=0
        ).aggregate(min_price=Min('price'))
        self.min_price = result['min_price'] if result['min_price'] is not None else Decimal('0.00')
        self.save(update_fields=['min_price', 'updated_at'])


class Category(models.Model):
    """
    Represents a seating category for an event.
    Maps to the frontend's Category interface.

    VISIBILITY RULES:
    - show_on_frontend: Controls whether category appears in UI at all
      - True = Show on frontend (may be SOLD OUT or available)
      - False = Legacy category, hidden from UI entirely (keeps order history)
    - is_active: Controls whether category can be purchased
      - True = Available for purchase (if seats > 0)
      - False = SOLD OUT (shown but not purchasable)
    - seats_available: Number of seats left
      - 0 = SOLD OUT (shown but not purchasable)

    NEVER DELETE CATEGORIES - use show_on_frontend=False for legacy ones.
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
    is_active = models.BooleanField(
        default=True,
        help_text='False = SOLD OUT (visible but not purchasable)'
    )
    show_on_frontend = models.BooleanField(
        default=True,
        help_text='False = Legacy category, hidden from UI entirely (keeps order history)'
    )
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

    def save(self, *args, **kwargs):
        """
        Save category and recalculate parent event's min_price.

        Triggers recalculation when:
        - Category is created
        - Price is updated
        - is_active status changes
        """
        # Check if price or is_active changed (for existing records)
        price_or_status_changed = True
        if self.pk:
            update_fields = kwargs.get('update_fields')
            if update_fields:
                # Only recalculate if price or is_active is being updated
                price_or_status_changed = 'price' in update_fields or 'is_active' in update_fields
            # If no update_fields specified, assume full save - check for changes
            else:
                try:
                    original = Category.objects.get(pk=self.pk)
                    price_or_status_changed = (
                        original.price != self.price or
                        original.is_active != self.is_active
                    )
                except Category.DoesNotExist:
                    pass

        super().save(*args, **kwargs)

        # Recalculate event min_price if needed
        if price_or_status_changed and self.event_id:
            self.event.recalculate_min_price()


@receiver(post_delete, sender=Category)
def recalculate_event_min_price_on_category_delete(sender, instance, **kwargs):
    """Recalculate event min_price when a category is deleted."""
    if instance.event_id:
        try:
            instance.event.recalculate_min_price()
        except Event.DoesNotExist:
            pass  # Event was also deleted
