"""
Serializers for contact messages.
"""

from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for creating contact messages."""
    
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']
    
    def validate_message(self, value):
        """Ensure message is not too short."""
        if len(value.strip()) < 10:
            raise serializers.ValidationError(
                'Message must be at least 10 characters long.'
            )
        return value
