"""
Admin configuration for events app.
"""

from django.contrib import admin
from .models import Tournament, Event, Category


class EventInline(admin.TabularInline):
    """Inline display of events within tournament admin."""
    model = Event
    extra = 0
    fields = ['title', 'slug', 'date', 'month', 'day', 'time', 'min_price', 'is_active']
    readonly_fields = ['min_price', 'slug']


class CategoryInline(admin.TabularInline):
    """Inline display of categories within event admin."""
    model = Category
    extra = 0
    fields = ['name', 'price', 'color', 'seats_total', 'seats_available', 'is_active', 'show_on_frontend']


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    """Admin configuration for Tournament model."""

    list_display = ['name', 'slug', 'type', 'year', 'venue', 'is_active', 'created_at']
    list_filter = ['type', 'year', 'is_active']
    search_fields = ['name', 'slug', 'venue']
    ordering = ['-year', 'type']
    inlines = [EventInline]
    prepopulated_fields = {}  # Slug is auto-generated, not prepopulated

    fieldsets = (
        (None, {
            'fields': ('name', 'type', 'year')
        }),
        ('SEO & URL', {
            'fields': ('slug',),
            'description': (
                'WARNING: Changing the slug will break external links and bookmarks. '
                'Only modify if absolutely necessary.'
            )
        }),
        ('Details', {
            'fields': ('description', 'venue', 'is_active')
        }),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin configuration for Event model."""

    list_display = ['title', 'slug', 'tournament', 'date', 'month', 'day', 'time',
                    'min_price', 'is_active']
    list_filter = ['tournament__type', 'is_active', 'event_date']
    search_fields = ['title', 'slug', 'tournament__name']
    ordering = ['event_date', 'time']
    inlines = [CategoryInline]
    readonly_fields = ['min_price']  # Auto-calculated from categories

    fieldsets = (
        (None, {
            'fields': ('tournament', 'title')
        }),
        ('SEO & URL', {
            'fields': ('slug',),
            'description': (
                'WARNING: Changing the slug will break external links and bookmarks. '
                'Only modify if absolutely necessary.'
            )
        }),
        ('Schedule', {
            'fields': ('event_date', 'date', 'month', 'day', 'time')
        }),
        ('Pricing (Auto-calculated)', {
            'fields': ('min_price',),
            'description': 'min_price is automatically calculated from active category prices.'
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""

    list_display = ['name', 'event', 'price', 'seats_available', 'seats_total',
                    'is_active', 'show_on_frontend']
    list_filter = ['event__tournament__type', 'is_active', 'show_on_frontend']
    search_fields = ['name', 'event__title']
    ordering = ['event__event_date', 'sort_order']

    fieldsets = (
        (None, {
            'fields': ('event', 'name', 'sort_order')
        }),
        ('Pricing', {
            'fields': ('price', 'color')
        }),
        ('Availability', {
            'fields': ('seats_total', 'seats_available')
        }),
        ('Status & Visibility', {
            'fields': ('is_active', 'show_on_frontend'),
            'description': (
                'is_active: False = SOLD OUT (visible but not purchasable). '
                'show_on_frontend: False = Legacy category, hidden from UI entirely.'
            )
        }),
    )
