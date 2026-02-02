"""
Factory classes for creating test data.
Uses factory_boy for clean, reusable test fixtures.
"""

import factory
from factory.django import DjangoModelFactory
from decimal import Decimal
import datetime

from events.models import Tournament, Event, Category
from orders.models import Order, OrderItem, SalesChannel


class TournamentFactory(DjangoModelFactory):
    """Factory for Tournament model."""

    class Meta:
        model = Tournament

    name = factory.Sequence(lambda n: f'Test Tournament {n}')
    type = 'WTA'
    year = 2026
    venue = 'Test Stadium'
    is_active = True


class EventFactory(DjangoModelFactory):
    """Factory for Event model."""

    class Meta:
        model = Event

    tournament = factory.SubFactory(TournamentFactory)
    title = factory.Sequence(lambda n: f'Test Event {n}')
    date = '15'
    day = 'Sat'
    month = 'FEB'
    time = '7:00 PM'
    event_date = datetime.date(2026, 2, 15)
    min_price = Decimal('100.00')
    is_active = True


class CategoryFactory(DjangoModelFactory):
    """Factory for Category model."""

    class Meta:
        model = Category

    event = factory.SubFactory(EventFactory)
    name = factory.Sequence(lambda n: f'Category {n}')
    price = Decimal('150.00')
    color = '#1e824c'
    seats_total = 100
    seats_available = 100
    sort_order = 0
    is_active = True
    show_on_frontend = True


class SalesChannelFactory(DjangoModelFactory):
    """Factory for SalesChannel model."""

    class Meta:
        model = SalesChannel

    name = factory.Sequence(lambda n: f'Channel {n}')
    domain = factory.Sequence(lambda n: f'channel{n}.example.com')
    currency = 'USD'
    is_active = True


class OrderFactory(DjangoModelFactory):
    """Factory for Order model."""

    class Meta:
        model = Order

    name = 'Test Customer'
    email = factory.Sequence(lambda n: f'customer{n}@example.com')
    phone = '+971501234567'
    status = 'pending'
    currency = 'USD'
    total_amount = Decimal('0.00')


class OrderItemFactory(DjangoModelFactory):
    """Factory for OrderItem model."""

    class Meta:
        model = OrderItem

    order = factory.SubFactory(OrderFactory)
    event = factory.SubFactory(EventFactory)
    category = factory.SubFactory(CategoryFactory)
    quantity = 1
    unit_price = Decimal('150.00')
    event_title = 'Test Event'
    event_date = '15'
    event_month = 'FEB'
    event_day = 'Sat'
    event_time = '7:00 PM'
    category_name = 'Test Category'
    venue = 'Test Stadium'
