"""
Admin configuration for contacts app.
"""

from django.contrib import admin
from .models import ContactMessage


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    """Admin configuration for ContactMessage model."""
    
    list_display = ['subject', 'name', 'email', 'is_read', 'is_replied', 'created_at']
    list_filter = ['is_read', 'is_replied', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    ordering = ['-created_at']
    readonly_fields = ['name', 'email', 'subject', 'message', 'created_at']
    
    fieldsets = (
        ('Message Details', {
            'fields': ('name', 'email', 'subject', 'message', 'created_at')
        }),
        ('Status', {
            'fields': ('is_read', 'is_replied', 'notes')
        }),
    )
    
    actions = ['mark_as_read', 'mark_as_replied']
    
    @admin.action(description='Mark selected messages as read')
    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} messages marked as read.')
    
    @admin.action(description='Mark selected messages as replied')
    def mark_as_replied(self, request, queryset):
        updated = queryset.update(is_replied=True, is_read=True)
        self.message_user(request, f'{updated} messages marked as replied.')
