"""
Custom User model for the Tennis Tickets system.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.
    Adds phone number field for customer contact.
    """
    
    phone = models.CharField(
        max_length=20, 
        blank=True, 
        null=True,
        help_text='Phone number for order confirmations and updates'
    )
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email or self.username
    
    def get_full_name(self):
        """Return first_name plus last_name, or username if not set."""
        full_name = f'{self.first_name} {self.last_name}'.strip()
        return full_name if full_name else self.username
