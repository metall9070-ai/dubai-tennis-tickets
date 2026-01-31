"""
Admin configuration for orders app.

FINANCIAL IMMUTABILITY (B6):
All financial fields (prices, quantities, totals) are READ-ONLY in admin.
This prevents accidental modification of historical order data.

Catalog prices (in TicketCategory) can be changed freely.
Order prices (in OrderItem) are FROZEN at creation time.

CURRENCY ARCHITECTURE:
- SalesChannel.currency determines order currency (Variant 1)
- Order.currency is FROZEN at creation and cannot be changed
- Order.stripe_amount_cents is FROZEN and used for Stripe validation
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import Order, OrderItem, SalesChannel


# =============================================================================
# SALES CHANNEL ADMIN
# =============================================================================

@admin.register(SalesChannel)
class SalesChannelAdmin(admin.ModelAdmin):
    """
    Admin configuration for SalesChannel model.

    Currency can be changed for future orders but will NOT affect existing orders.
    """

    list_display = ['name', 'domain', 'currency', 'is_active', 'created_at']
    list_filter = ['currency', 'is_active']
    search_fields = ['name', 'domain']
    ordering = ['name']

    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Channel Information', {
            'fields': ('name', 'domain', 'is_active'),
        }),
        ('Currency Configuration', {
            'fields': ('currency',),
            'description': format_html(
                '<strong>Note:</strong> Changing currency here affects FUTURE orders only. '
                'Existing orders retain their original currency (immutable).'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# =============================================================================
# ORDER ITEM INLINE
# =============================================================================


class OrderItemInline(admin.TabularInline):
    """
    Inline display of order items.

    ALL FIELDS ARE READ-ONLY (B6):
    Financial data is frozen at order creation time.
    """
    model = OrderItem
    extra = 0

    # ALL fields are readonly - no edits allowed
    readonly_fields = [
        'event', 'category',
        # FROZEN FINANCIAL FIELDS
        'quantity', 'unit_price', 'subtotal',
        # FROZEN SNAPSHOT FIELDS
        'event_title', 'category_name', 'venue',
        'event_date', 'event_month', 'event_day', 'event_time',
        'created_at'
    ]

    # Prevent any modifications
    can_delete = False

    def has_add_permission(self, request, obj=None):
        """Prevent adding items to existing orders via admin."""
        return False

    def has_change_permission(self, request, obj=None):
        """Allow viewing but fields are readonly anyway."""
        return True


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """
    Admin configuration for Order model.

    IMMUTABLE FIELDS (B6):
    - total_amount: Frozen financial total
    - currency: Frozen ISO 4217 currency code
    - stripe_amount_cents: Frozen amount for Stripe
    - order_number: Unique identifier
    - All OrderItem data (via inline)

    EDITABLE FIELDS:
    - status: Can be updated (pending -> confirmed -> paid)
    - Customer contact info (for corrections)
    """

    list_display = [
        'order_number', 'name', 'email', 'total_amount_display',
        'currency', 'status', 'total_tickets', 'created_at'
    ]
    list_filter = ['status', 'currency', 'sales_channel', 'created_at']
    search_fields = ['order_number', 'name', 'email', 'phone']
    ordering = ['-created_at']

    # FROZEN: These fields cannot be modified
    readonly_fields = [
        'id', 'order_number', 'sales_channel',
        'total_amount', 'currency', 'stripe_amount_cents',  # B6: FROZEN financial data
        'created_at', 'updated_at', 'paid_at',
        'user', 'total_tickets_display'
    ]

    inlines = [OrderItemInline]

    fieldsets = (
        ('Order Information', {
            'fields': ('id', 'order_number', 'status', 'sales_channel', 'user'),
            'description': 'Order identifier and status. Status can be updated.'
        }),
        ('Customer', {
            'fields': ('name', 'email', 'phone', 'comments'),
            'description': 'Customer contact information. Can be corrected if needed.'
        }),
        ('Financial Summary (FROZEN - B6)', {
            'fields': ('total_amount', 'currency', 'stripe_amount_cents', 'total_tickets_display', 'paid_at'),
            'description': format_html(
                '<strong style="color: #c00;">WARNING:</strong> '
                'Financial data (amount, currency) is FROZEN at order creation. '
                'Cannot be changed. Used for Stripe validation.'
            )
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def total_tickets(self, obj):
        return obj.total_tickets
    total_tickets.short_description = 'Tickets'

    def total_tickets_display(self, obj):
        return f"{obj.total_tickets} tickets"
    total_tickets_display.short_description = 'Total Tickets'

    def total_amount_display(self, obj):
        """Display total with currency code."""
        return f"{obj.currency} {obj.total_amount:,.2f}"
    total_amount_display.short_description = 'Total'
    total_amount_display.admin_order_field = 'total_amount'

    def has_delete_permission(self, request, obj=None):
        """
        Prevent deletion of paid orders.
        Only pending/cancelled orders can be deleted.
        """
        if obj and obj.status in ['paid', 'confirmed']:
            return False
        return super().has_delete_permission(request, obj)


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    """
    Admin configuration for OrderItem model.

    ALL FIELDS ARE READ-ONLY (B6):
    Order item data represents the frozen financial agreement.
    No modifications are allowed after creation.
    """

    list_display = [
        'order', 'event_title', 'category_name',
        'quantity', 'unit_price_display', 'subtotal_display'
    ]
    list_filter = ['order__status', 'event']
    search_fields = ['order__order_number', 'event_title', 'category_name']
    ordering = ['-created_at']

    # ALL fields are readonly - complete immutability
    readonly_fields = [
        'order', 'event', 'category',
        # FROZEN FINANCIAL FIELDS
        'quantity', 'unit_price', 'subtotal',
        # FROZEN SNAPSHOT FIELDS
        'event_title', 'category_name', 'venue',
        'event_date', 'event_month', 'event_day', 'event_time',
        'created_at'
    ]

    fieldsets = (
        ('Order Reference', {
            'fields': ('order',)
        }),
        ('Frozen Financial Data (B6)', {
            'fields': ('quantity', 'unit_price', 'subtotal'),
            'description': format_html(
                '<strong style="color: #c00;">IMMUTABLE:</strong> '
                'These values were captured at order creation and cannot be changed. '
                'They represent the binding financial agreement with the customer.'
            )
        }),
        ('Event Snapshot (Frozen)', {
            'fields': ('event', 'event_title', 'event_date', 'event_month',
                      'event_day', 'event_time', 'venue'),
            'description': 'Event details as they were at the time of purchase.'
        }),
        ('Category Snapshot (Frozen)', {
            'fields': ('category', 'category_name'),
            'description': 'Category details as they were at the time of purchase.'
        }),
        ('Metadata', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )

    def unit_price_display(self, obj):
        return f"${obj.unit_price:,.2f}"
    unit_price_display.short_description = 'Unit Price'
    unit_price_display.admin_order_field = 'unit_price'

    def subtotal_display(self, obj):
        return f"${obj.subtotal:,.2f}"
    subtotal_display.short_description = 'Subtotal'
    subtotal_display.admin_order_field = 'subtotal'

    def has_add_permission(self, request):
        """Prevent creating order items directly - use Order creation flow."""
        return False

    def has_change_permission(self, request, obj=None):
        """Allow viewing but all fields are readonly."""
        return True

    def has_delete_permission(self, request, obj=None):
        """
        Prevent deletion of items from paid orders.
        This would corrupt financial records.
        """
        if obj and obj.order.status in ['paid', 'confirmed']:
            return False
        return super().has_delete_permission(request, obj)
