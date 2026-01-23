"""
URL configuration for events app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import TournamentViewSet, EventViewSet, CategoryViewSet

router = DefaultRouter()
router.register(r'tournaments', TournamentViewSet, basename='tournament')
router.register(r'events', EventViewSet, basename='event')
router.register(r'categories', CategoryViewSet, basename='category')

urlpatterns = [
    path('', include(router.urls)),
]
