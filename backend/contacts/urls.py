"""
URL configuration for contacts app.
"""

from django.urls import path
from .views import ContactMessageCreateView

urlpatterns = [
    path('contact/', ContactMessageCreateView.as_view(), name='contact_create'),
]
