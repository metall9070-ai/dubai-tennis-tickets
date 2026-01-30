"""
Serializers for events, tournaments, and categories.
"""

from rest_framework import serializers
from .models import Tournament, Event, Category


class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for ticket categories.

    Includes show_on_frontend field for frontend filtering:
    - show_on_frontend=True: Display in UI (may be SOLD OUT or available)
    - show_on_frontend=False: Legacy category, hide from UI entirely
    """

    seats_left = serializers.IntegerField(source='seats_available', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'price', 'color',
            'seats_total', 'seats_available', 'seats_left',
            'is_active', 'show_on_frontend'
        ]
        read_only_fields = ['id', 'seats_left']


class EventSerializer(serializers.ModelSerializer):
    """Serializer for events with categories."""

    type = serializers.CharField(source='tournament.type', read_only=True)
    venue = serializers.CharField(read_only=True)
    categories = CategorySerializer(many=True, read_only=True)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tournament_slug = serializers.SlugField(source='tournament.slug', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'slug', 'title', 'date', 'day', 'month', 'time',
            'event_date', 'min_price', 'type', 'venue',
            'tournament_slug', 'categories', 'is_active'
        ]
        read_only_fields = ['id', 'slug', 'type', 'venue', 'tournament_slug']


class EventListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for event listing (without categories)."""

    type = serializers.CharField(source='tournament.type', read_only=True)
    venue = serializers.CharField(read_only=True)
    min_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    tournament_slug = serializers.SlugField(source='tournament.slug', read_only=True)

    class Meta:
        model = Event
        fields = [
            'id', 'slug', 'title', 'date', 'day', 'month', 'time',
            'min_price', 'type', 'venue', 'tournament_slug'
        ]


class TournamentSerializer(serializers.ModelSerializer):
    """Serializer for tournaments."""

    events = EventListSerializer(many=True, read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)

    class Meta:
        model = Tournament
        fields = [
            'id', 'slug', 'name', 'type', 'type_display', 'year',
            'description', 'venue', 'is_active', 'events'
        ]
        read_only_fields = ['id', 'slug', 'type_display']


class CategoryAvailabilitySerializer(serializers.ModelSerializer):
    """Serializer for checking category availability."""

    event_slug = serializers.SlugField(source='event.slug', read_only=True)
    event_title = serializers.CharField(source='event.title', read_only=True)
    event_date = serializers.CharField(source='event.date', read_only=True)
    event_month = serializers.CharField(source='event.month', read_only=True)
    event_day = serializers.CharField(source='event.day', read_only=True)
    event_time = serializers.CharField(source='event.time', read_only=True)
    venue = serializers.CharField(source='event.venue', read_only=True)
    seats_left = serializers.IntegerField(source='seats_available', read_only=True)

    class Meta:
        model = Category
        fields = [
            'id', 'name', 'price', 'color',
            'seats_available', 'seats_left', 'seats_total',
            'is_active', 'show_on_frontend',
            'event_slug', 'event_title', 'event_date', 'event_month',
            'event_day', 'event_time', 'venue'
        ]
