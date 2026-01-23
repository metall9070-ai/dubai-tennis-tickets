"""
Views for contact form submissions.
"""

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class ContactMessageCreateView(generics.CreateAPIView):
    """
    Submit a contact form message.
    
    POST /api/contact/
    """
    
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        message = serializer.save()
        
        return Response(
            {
                'message': 'Thank you for your message. We will get back to you within 24 hours.',
                'contact_id': message.id
            },
            status=status.HTTP_201_CREATED
        )
