"""
Admin configuration for events app.
"""

from django.contrib import admin
from .models import Tournament, Event, Category


class EventInline(admin.TabularInline):
    """Inline display of events within tournament admin."""
    model = Event
    extra = 0
    fields = ['title', 'date', 'month', 'day', 'time', 'min_price', 'is_active']
    readonly_fields = ['min_price']


class CategoryInline(admin.TabularInline):
    """Inline display of categories within event admin."""
    model = Category
    extra = 0
    fields = ['name', 'price', 'color', 'seats_total', 'seats_available', 'is_active']


@admin.register(Tournament)
class TournamentAdmin(admin.ModelAdmin):
    """Admin configuration for Tournament model."""
    
    list_display = ['name', 'type', 'year', 'venue', 'is_active', 'created_at']
    list_filter = ['type', 'year', 'is_active']
    search_fields = ['name', 'venue']
    ordering = ['-year', 'type']
    inlines = [EventInline]
    
    fieldsets = (
        (None, {
            'fields': ('name', 'type', 'year')
        }),
        ('Details', {
            'fields': ('description', 'venue', 'is_active')
        }),
    )


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    """Admin configuration for Event model."""
    
    list_display = ['title', 'tournament', 'date', 'month', 'day', 'time', 
                    'min_price', 'is_active']
    list_filter = ['tournament__type', 'is_active', 'event_date']
    search_fields = ['title', 'tournament__name']
    ordering = ['event_date', 'time']
    inlines = [CategoryInline]
    
    fieldsets = (
        (None, {
            'fields': ('tournament', 'title')
        }),
        ('Schedule', {
            'fields': ('event_date', 'date', 'month', 'day', 'time')
        }),
        ('Pricing', {
            'fields': ('min_price',)
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Admin configuration for Category model."""
    
    list_display = ['name', 'event', 'price', 'seats_available', 'seats_total', 
                    'is_active']
    list_filter = ['event__tournament__type', 'is_active']
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
        ('Status', {
            'fields': ('is_active',)
        }),
    )
