"""
Admin configuration for users app.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    """Admin configuration for CustomUser model."""
    
    list_display = ['username', 'email', 'first_name', 'last_name', 'phone', 
                    'is_staff', 'is_active', 'date_joined']
    list_filter = ['is_staff', 'is_superuser', 'is_active', 'date_joined']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']
    ordering = ['-date_joined']
    
    fieldsets = UserAdmin.fieldsets + (
        ('Contact Information', {'fields': ('phone',)}),
    )
    
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Contact Information', {'fields': ('phone',)}),
    )
