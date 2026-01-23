"""
Models for contact form submissions.
"""

from django.db import models


class ContactMessage(models.Model):
    """
    Stores contact form submissions from the website.
    Maps to the frontend's ContactsPage form fields.
    """
    
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=300)
    message = models.TextField()
    
    is_read = models.BooleanField(default=False)
    is_replied = models.BooleanField(default=False)
    notes = models.TextField(blank=True, help_text='Internal notes')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Contact Message'
        verbose_name_plural = 'Contact Messages'
    
    def __str__(self):
        return f"{self.subject} - {self.name} ({self.email})"
    
    def mark_as_read(self):
        """Mark message as read."""
        if not self.is_read:
            self.is_read = True
            self.save(update_fields=['is_read', 'updated_at'])
