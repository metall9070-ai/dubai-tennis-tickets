"""
Tests for OrderService.
Covers: validation, order creation, seat reservation, error handling.
"""

import pytest
from decimal import Decimal
from concurrent.futures import ThreadPoolExecutor, as_completed

from django.db import transaction

from orders.services import (
    OrderService,
    OrderServiceError,
    EventNotFoundError,
    CategoryNotFoundError,
    CategoryEventMismatchError,
    CategoryNotAvailableError,
    InsufficientSeatsError,
)
from orders.models import SalesChannel
from .factories import (
    TournamentFactory,
    EventFactory,
    CategoryFactory,
)


@pytest.fixture
def default_sales_channel(db):
    """Ensure default sales channel exists."""
    return SalesChannel.get_default()


@pytest.mark.django_db
class TestOrderServiceValidation:
    """Tests for OrderService.validate_items()"""

    def test_validate_items_success(self):
        """Valid items should pass validation."""
        category = CategoryFactory(
            price=Decimal('200.00'),
            seats_available=50,
            is_active=True,
            show_on_frontend=True
        )

        items_data = [{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 2
        }]

        validated = OrderService.validate_items(items_data)

        assert len(validated) == 1
        assert validated[0].event == category.event
        assert validated[0].category == category
        assert validated[0].quantity == 2

    def test_validate_items_event_not_found(self):
        """Non-existent event should raise EventNotFoundError."""
        category = CategoryFactory()

        items_data = [{
            'event_id': 99999,  # Non-existent
            'category_id': category.id,
            'quantity': 1
        }]

        with pytest.raises(EventNotFoundError) as exc_info:
            OrderService.validate_items(items_data)

        assert exc_info.value.code == 'event_not_found'
        assert '99999' in exc_info.value.message

    def test_validate_items_inactive_event(self):
        """Inactive event should raise EventNotFoundError."""
        event = EventFactory(is_active=False)
        category = CategoryFactory(event=event)

        items_data = [{
            'event_id': event.id,
            'category_id': category.id,
            'quantity': 1
        }]

        with pytest.raises(EventNotFoundError):
            OrderService.validate_items(items_data)

    def test_validate_items_category_not_found(self):
        """Non-existent category should raise CategoryNotFoundError."""
        event = EventFactory()

        items_data = [{
            'event_id': event.id,
            'category_id': 99999,  # Non-existent
            'quantity': 1
        }]

        with pytest.raises(CategoryNotFoundError) as exc_info:
            OrderService.validate_items(items_data)

        assert exc_info.value.code == 'category_not_found'

    def test_validate_items_category_event_mismatch(self):
        """Category from different event should raise CategoryEventMismatchError."""
        event_a = EventFactory()
        event_b = EventFactory()
        category = CategoryFactory(event=event_a)

        items_data = [{
            'event_id': event_b.id,  # Wrong event!
            'category_id': category.id,
            'quantity': 1
        }]

        with pytest.raises(CategoryEventMismatchError) as exc_info:
            OrderService.validate_items(items_data)

        assert exc_info.value.code == 'category_event_mismatch'
        assert exc_info.value.details['category_event_id'] == event_a.id
        assert exc_info.value.details['requested_event_id'] == event_b.id

    def test_validate_items_category_inactive(self):
        """Inactive category should raise CategoryNotAvailableError."""
        category = CategoryFactory(is_active=False)

        items_data = [{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 1
        }]

        with pytest.raises(CategoryNotAvailableError) as exc_info:
            OrderService.validate_items(items_data)

        assert exc_info.value.code == 'category_not_available'
        assert 'closed' in exc_info.value.details['reason']

    def test_validate_items_category_not_on_frontend(self):
        """Category with show_on_frontend=False should raise error."""
        category = CategoryFactory(show_on_frontend=False)

        items_data = [{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 1
        }]

        with pytest.raises(CategoryNotAvailableError) as exc_info:
            OrderService.validate_items(items_data)

        assert 'sold out' in exc_info.value.details['reason']

    def test_validate_items_insufficient_seats(self):
        """Request for more seats than available should raise error."""
        category = CategoryFactory(seats_available=5)

        items_data = [{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 10  # More than available
        }]

        with pytest.raises(InsufficientSeatsError) as exc_info:
            OrderService.validate_items(items_data)

        assert exc_info.value.code == 'insufficient_seats'
        assert exc_info.value.details['available'] == 5
        assert exc_info.value.details['requested'] == 10

    def test_validate_items_multiple_items_success(self):
        """Multiple valid items from different events should pass."""
        category1 = CategoryFactory()
        category2 = CategoryFactory()

        items_data = [
            {
                'event_id': category1.event.id,
                'category_id': category1.id,
                'quantity': 1
            },
            {
                'event_id': category2.event.id,
                'category_id': category2.id,
                'quantity': 2
            }
        ]

        validated = OrderService.validate_items(items_data)

        assert len(validated) == 2


@pytest.mark.django_db
class TestOrderServiceCreation:
    """Tests for OrderService.create_order()"""

    def test_create_order_success(self, default_sales_channel):
        """Successfully create order with seat reservation."""
        category = CategoryFactory(
            price=Decimal('200.00'),
            seats_available=50
        )

        validated_items = OrderService.validate_items([{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 2
        }])

        order = OrderService.create_order(
            name='John Doe',
            email='john@example.com',
            phone='+971501234567',
            items=validated_items,
        )

        assert order.name == 'John Doe'
        assert order.email == 'john@example.com'
        assert order.status == 'pending'
        assert order.total_amount == Decimal('400.00')  # 2 x $200
        assert order.items.count() == 1

        # Check seats were reserved
        category.refresh_from_db()
        assert category.seats_available == 48  # 50 - 2

    def test_create_order_reserves_seats_atomically(self, default_sales_channel):
        """Seats should be reserved atomically during order creation."""
        category = CategoryFactory(seats_available=10)

        validated_items = OrderService.validate_items([{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 3
        }])

        order = OrderService.create_order(
            name='Test',
            email='test@example.com',
            phone='+971501234567',
            items=validated_items,
        )

        category.refresh_from_db()
        assert category.seats_available == 7

    def test_create_order_multi_item(self, default_sales_channel):
        """Order with multiple items from different events."""
        cat1 = CategoryFactory(price=Decimal('100.00'), seats_available=20)
        cat2 = CategoryFactory(price=Decimal('200.00'), seats_available=20)

        validated_items = OrderService.validate_items([
            {
                'event_id': cat1.event.id,
                'category_id': cat1.id,
                'quantity': 2
            },
            {
                'event_id': cat2.event.id,
                'category_id': cat2.id,
                'quantity': 1
            }
        ])

        order = OrderService.create_order(
            name='Multi Buyer',
            email='multi@example.com',
            phone='+971501234567',
            items=validated_items,
        )

        assert order.items.count() == 2
        assert order.total_amount == Decimal('400.00')  # (2 x $100) + (1 x $200)

        cat1.refresh_from_db()
        cat2.refresh_from_db()
        assert cat1.seats_available == 18
        assert cat2.seats_available == 19

    def test_create_order_snapshot_data(self, default_sales_channel):
        """OrderItem should store snapshot of event/category data."""
        category = CategoryFactory(
            name='Premium Section',
            price=Decimal('500.00')
        )
        category.event.title = 'Women\'s Finals'
        category.event.save()

        validated_items = OrderService.validate_items([{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 1
        }])

        order = OrderService.create_order(
            name='Test',
            email='test@example.com',
            phone='+971501234567',
            items=validated_items,
        )

        item = order.items.first()
        assert item.event_title == 'Women\'s Finals'
        assert item.category_name == 'Premium Section'
        assert item.unit_price == Decimal('500.00')

    def test_create_order_fails_if_seats_taken(self, default_sales_channel):
        """Order should fail if seats become unavailable between validation and creation."""
        category = CategoryFactory(seats_available=2)

        # Validate with 2 seats available
        validated_items = OrderService.validate_items([{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 2
        }])

        # Simulate another order taking the seats
        category.seats_available = 0
        category.save()

        with pytest.raises(InsufficientSeatsError):
            OrderService.create_order(
                name='Late Customer',
                email='late@example.com',
                phone='+971501234567',
                items=validated_items,
            )


@pytest.mark.django_db
class TestOrderServiceCancellation:
    """Tests for OrderService.cancel_order()"""

    def test_cancel_order_releases_seats(self, default_sales_channel):
        """Cancelling order should release reserved seats."""
        category = CategoryFactory(seats_available=50)

        validated_items = OrderService.validate_items([{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 5
        }])

        order = OrderService.create_order(
            name='To Cancel',
            email='cancel@example.com',
            phone='+971501234567',
            items=validated_items,
        )

        category.refresh_from_db()
        assert category.seats_available == 45

        # Cancel the order
        OrderService.cancel_order(order)

        category.refresh_from_db()
        assert category.seats_available == 50  # Seats released
        assert order.status == 'cancelled'

    def test_cancel_already_cancelled_order(self, default_sales_channel):
        """Cancelling already cancelled order should be idempotent."""
        category = CategoryFactory(seats_available=50)

        validated_items = OrderService.validate_items([{
            'event_id': category.event.id,
            'category_id': category.id,
            'quantity': 5
        }])

        order = OrderService.create_order(
            name='Test',
            email='test@example.com',
            phone='+971501234567',
            items=validated_items,
        )

        # Cancel twice
        OrderService.cancel_order(order)
        OrderService.cancel_order(order)

        category.refresh_from_db()
        assert category.seats_available == 50  # Seats released only once


@pytest.mark.django_db
@pytest.mark.slow
@pytest.mark.skipif(
    'sqlite' in str(__import__('django.conf', fromlist=['settings']).settings.DATABASES.get('default', {}).get('ENGINE', '')),
    reason="SQLite doesn't support concurrent transactions properly"
)
class TestOrderServiceConcurrency:
    """Tests for concurrent order creation (race conditions)."""

    def test_concurrent_orders_no_oversell(self, default_sales_channel):
        """
        Two simultaneous orders for last seat - one must fail.
        This tests the SELECT FOR UPDATE locking mechanism.
        """
        category = CategoryFactory(seats_available=1)

        def create_order_for_last_seat():
            """Attempt to create order for the last seat."""
            try:
                validated_items = OrderService.validate_items([{
                    'event_id': category.event.id,
                    'category_id': category.id,
                    'quantity': 1
                }])

                order = OrderService.create_order(
                    name='Concurrent User',
                    email='concurrent@example.com',
                    phone='+971501234567',
                    items=validated_items,
                )
                return ('success', order.id)
            except InsufficientSeatsError:
                return ('failed', None)
            except Exception as e:
                return ('error', str(e))

        # Run two orders concurrently
        results = []
        with ThreadPoolExecutor(max_workers=2) as executor:
            futures = [
                executor.submit(create_order_for_last_seat),
                executor.submit(create_order_for_last_seat)
            ]
            for future in as_completed(futures):
                results.append(future.result())

        # Count results
        successes = sum(1 for r in results if r[0] == 'success')
        failures = sum(1 for r in results if r[0] == 'failed')

        # Exactly one should succeed
        assert successes == 1, f"Expected 1 success, got {successes}. Results: {results}"
        assert failures == 1, f"Expected 1 failure, got {failures}. Results: {results}"

        # Verify no oversell
        category.refresh_from_db()
        assert category.seats_available == 0
