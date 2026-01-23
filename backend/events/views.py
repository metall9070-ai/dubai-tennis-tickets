"""
Views for events, tournaments, and categories.
Optimized with proper query prefetching.
"""

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Tournament, Event, Category
from .serializers import (
    TournamentSerializer, 
    EventSerializer, 
    EventListSerializer,
    CategorySerializer,
    CategoryAvailabilitySerializer
)


class TournamentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving tournaments.
    
    GET /api/tournaments/ - List all tournaments
    GET /api/tournaments/{id}/ - Get tournament details with events
    """
    
    queryset = Tournament.objects.filter(is_active=True).prefetch_related(
        'events'
    )
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving events.
    
    GET /api/events/ - List all events
    GET /api/events/{id}/ - Get event with categories
    GET /api/events/wta/ - List WTA events only
    GET /api/events/atp/ - List ATP events only
    """
    
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        """
        Return optimized queryset based on action.
        - List: select_related for tournament only
        - Retrieve: prefetch categories for nested serializer
        """
        base_queryset = Event.objects.filter(is_active=True).select_related('tournament')
        
        if self.action == 'retrieve':
            # Prefetch categories for detail view to avoid N+1
            return base_queryset.prefetch_related(
                'categories'
            )
        
        # Filter by tournament type if specified in query params
        event_type = self.request.query_params.get('type', None)
        if event_type:
            base_queryset = base_queryset.filter(tournament__type=event_type.upper())
        
        return base_queryset.order_by('event_date', 'time')
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EventSerializer
        return EventListSerializer
    
    @action(detail=False, methods=['get'], url_path='wta')
    def wta_events(self, request):
        """Get all WTA tournament events."""
        events = self.get_queryset().filter(tournament__type='WTA')
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='atp')
    def atp_events(self, request):
        """Get all ATP tournament events."""
        events = self.get_queryset().filter(tournament__type='ATP')
        serializer = EventListSerializer(events, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='categories')
    def categories(self, request, pk=None):
        """Get all categories for a specific event."""
        event = self.get_object()
        # Categories are already prefetched, just filter
        categories = [c for c in event.categories.all() if c.is_active]
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving categories.
    
    GET /api/categories/ - List all categories
    GET /api/categories/{id}/ - Get category with availability
    """
    
    queryset = Category.objects.filter(is_active=True).select_related(
        'event', 
        'event__tournament'
    )
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CategoryAvailabilitySerializer
        return CategorySerializer
    
    @action(detail=True, methods=['get'], url_path='availability')
    def availability(self, request, pk=None):
        """Get availability for a specific category."""
        category = self.get_object()
        serializer = CategoryAvailabilitySerializer(category)
        return Response(serializer.data)
