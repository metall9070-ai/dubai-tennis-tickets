"""
Admin configuration for orders app.
"""

from django.contrib import admin
from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    """Inline display of order items."""
    model = OrderItem
    extra = 0
    readonly_fields = ['event', 'category', 'quantity', 'unit_price', 'subtotal',
                       'event_title', 'category_name', 'venue']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin configuration for Order model."""
    
    list_display = ['order_number', 'name', 'email', 'total_amount', 
                    'status', 'total_tickets', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['order_number', 'name', 'email', 'phone']
    ordering = ['-created_at']
    readonly_fields = ['id', 'order_number', 'total_amount', 'created_at', 
                       'updated_at', 'paid_at', 'user']
    inlines = [OrderItemInline]
    
    fieldsets = (
        ('Order Information', {
            'fields': ('id', 'order_number', 'status', 'user')
        }),
        ('Customer', {
            'fields': ('name', 'email', 'phone', 'comments')
        }),
        ('Payment', {
            'fields': ('total_amount', 'paid_at')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def total_tickets(self, obj):
        return obj.total_tickets
    total_tickets.short_description = 'Tickets'


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """Admin configuration for OrderItem model."""
    
    list_display = ['order', 'event_title', 'category_name', 'quantity', 
                    'unit_price', 'subtotal']
    list_filter = ['order__status', 'event']
    search_fields = ['order__order_number', 'event_title', 'category_name']
    readonly_fields = ['order', 'event', 'category', 'quantity', 'unit_price', 
                       'subtotal', 'event_title', 'category_name', 'venue',
                       'event_date', 'event_month', 'event_day', 'event_time']
