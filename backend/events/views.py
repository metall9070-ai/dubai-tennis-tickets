"""
Views for events, tournaments, and categories.
Optimized with proper query prefetching.
Includes safety mechanisms for frontend integration.
Supports lookup by slug OR id for SEO-friendly URLs.
"""

import logging

from django.shortcuts import get_object_or_404
from django.http import HttpResponsePermanentRedirect
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Tournament, Event, Category
from .redirects import get_new_slug
from .serializers import (
    TournamentSerializer,
    EventSerializer,
    EventListSerializer,
    CategorySerializer,
    CategoryAvailabilitySerializer
)
from .safety import SafeAPIViewMixin

logger = logging.getLogger(__name__)


class SlugOrIdLookupMixin:
    """
    Mixin that allows lookup by slug OR id.

    - Try slug first (SEO-friendly URLs)
    - Fall back to id if not a valid slug
    - Response includes both slug and id for frontend redirect logic
    - Supports 301 redirect for legacy slugs
    """

    def get_object(self):
        """
        Override get_object to support slug or id lookup.
        """
        queryset = self.filter_queryset(self.get_queryset())
        lookup_value = self.kwargs.get(self.lookup_field)

        # Try slug lookup first
        obj = queryset.filter(slug=lookup_value).first()

        if obj is None:
            # Check if this is a legacy slug that needs redirect
            new_slug = get_new_slug(lookup_value)
            if new_slug:
                # Store redirect info for retrieve() to handle
                self._legacy_redirect_slug = new_slug
                # Try to find by new slug
                obj = queryset.filter(slug=new_slug).first()

            if obj is None:
                # Fall back to id lookup if it looks like an integer
                try:
                    pk = int(lookup_value)
                    obj = get_object_or_404(queryset, pk=pk)
                except (ValueError, TypeError):
                    # Not a valid integer, try slug one more time (404 if not found)
                    obj = get_object_or_404(queryset, slug=lookup_value)

        self.check_object_permissions(self.request, obj)
        return obj


class TournamentViewSet(SlugOrIdLookupMixin, SafeAPIViewMixin, viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving tournaments.

    GET /api/tournaments/ - List all tournaments
    GET /api/tournaments/{slug}/ - Get tournament details by slug
    GET /api/tournaments/{id}/ - Get tournament details by id (fallback)

    Supports lookup by slug (preferred) or id (fallback).
    """

    queryset = Tournament.objects.filter(is_active=True).prefetch_related(
        'events'
    )
    serializer_class = TournamentSerializer
    permission_classes = [AllowAny]
    lookup_field = 'pk'  # DRF uses pk, our mixin handles slug/id


class EventViewSet(SlugOrIdLookupMixin, SafeAPIViewMixin, viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving events.

    GET /api/events/ - List all events
    GET /api/events/{slug}/ - Get event by slug (preferred)
    GET /api/events/{id}/ - Get event by id (fallback)
    GET /api/events/wta/ - List WTA events only
    GET /api/events/atp/ - List ATP events only

    Supports lookup by slug (preferred) or id (fallback).
    """

    permission_classes = [AllowAny]
    lookup_field = 'pk'  # DRF uses pk, our mixin handles slug/id
    
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

    def list(self, request, *args, **kwargs):
        """Override list to add price logging."""
        response = super().list(request, *args, **kwargs)
        # Log each event price for debugging
        for event in response.data.get('results', response.data) if isinstance(response.data, dict) else response.data:
            print(f"[API PRICE] Event {event.get('id')} \"{event.get('title')}\" min_price={event.get('min_price')}")
        return response

    def retrieve(self, request, *args, **kwargs):
        """
        Override retrieve to:
        - Handle 301 redirect for legacy slugs
        - Add price logging
        """
        # Reset redirect flag
        self._legacy_redirect_slug = None

        # get_object() may set _legacy_redirect_slug
        instance = self.get_object()

        # If legacy slug was used, return 301 redirect
        if hasattr(self, '_legacy_redirect_slug') and self._legacy_redirect_slug:
            # Build new URL with same query params
            new_url = request.build_absolute_uri().replace(
                self.kwargs.get(self.lookup_field),
                self._legacy_redirect_slug
            )
            logger.info(f"301 Redirect: {self.kwargs.get(self.lookup_field)} -> {self._legacy_redirect_slug}")
            return HttpResponsePermanentRedirect(new_url)

        serializer = self.get_serializer(instance)
        event = serializer.data
        print(f"[API PRICE] Event {event.get('id')} \"{event.get('title')}\" min_price={event.get('min_price')}")
        return Response(event)
    
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
        """
        Get ALL categories for a specific event.

        CRITICAL: Returns ALL categories including:
        - Active categories (is_active=True)
        - Inactive categories (is_active=False) -> shown as SOLD OUT
        - Zero-seat categories (seats_available=0) -> shown as SOLD OUT

        DO NOT filter by is_active or seats_available here.
        Frontend determines SOLD OUT display based on these fields.
        """
        event = self.get_object()
        # Return ALL categories - frontend handles SOLD OUT display
        categories = event.categories.all().order_by('sort_order', 'price')
        serializer = CategorySerializer(categories, many=True)

        # Log each category price for debugging
        for cat in serializer.data:
            print(f"[API PRICE] Category {cat.get('id')} \"{cat.get('name')}\" price={cat.get('price')} (event: {event.title})")

        return Response(serializer.data)


class CategoryViewSet(SafeAPIViewMixin, viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for listing and retrieving categories.

    GET /api/categories/ - List all categories (including inactive/sold out)
    GET /api/categories/{id}/ - Get category with availability

    CRITICAL: Returns ALL categories - frontend determines SOLD OUT display.
    DO NOT filter by is_active or seats_available here.
    """

    # Return ALL categories - frontend handles SOLD OUT display
    queryset = Category.objects.select_related(
        'event',
        'event__tournament'
    ).order_by('event__event_date', 'sort_order', 'price')
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
