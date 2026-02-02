"""
Tests for Order API endpoints.
Covers: order creation, validation errors, serializer validation.
"""

import pytest
from decimal import Decimal
from rest_framework import status
from rest_framework.test import APIClient

from orders.models import Order, SalesChannel
from .factories import CategoryFactory


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def default_sales_channel(db):
    """Ensure default sales channel exists."""
    return SalesChannel.get_default()


@pytest.mark.django_db
class TestOrderCreateAPI:
    """Tests for POST /api/orders/"""

    def test_create_order_success(self, api_client, default_sales_channel):
        """Successfully create order via API."""
        category = CategoryFactory(
            price=Decimal('200.00'),
            seats_available=50
        )

        payload = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 2
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert 'order' in response.data
        assert response.data['order']['name'] == 'John Doe'
        assert response.data['order']['total_amount'] == '400.00'

        # Verify order exists in DB
        assert Order.objects.filter(email='john@example.com').exists()

    def test_create_order_validation_name_required(self, api_client, default_sales_channel):
        """Name is required."""
        category = CategoryFactory()

        payload = {
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data.get('details', response.data)

    def test_create_order_validation_email_format(self, api_client, default_sales_channel):
        """Email must be valid format."""
        category = CategoryFactory()

        payload = {
            'name': 'Test User',
            'email': 'invalid-email',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data.get('details', response.data)

    def test_create_order_validation_phone_e164(self, api_client, default_sales_channel):
        """Phone must be E.164 format."""
        category = CategoryFactory()

        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '501234567',  # Missing + and country code
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'phone' in response.data.get('details', response.data)

    def test_create_order_validation_name_not_email(self, api_client, default_sales_channel):
        """Name should not be an email address."""
        category = CategoryFactory()

        payload = {
            'name': 'test@example.com',  # Email in name field
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data.get('details', response.data)

    def test_create_order_validation_name_not_phone(self, api_client, default_sales_channel):
        """Name should not be a phone number."""
        category = CategoryFactory()

        payload = {
            'name': '+971501234567',  # Phone in name field
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'name' in response.data.get('details', response.data)

    def test_create_order_validation_empty_items(self, api_client, default_sales_channel):
        """Order must have at least one item."""
        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': []
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'items' in response.data.get('details', response.data)

    def test_create_order_validation_event_not_found(self, api_client, default_sales_channel):
        """Non-existent event should return validation error."""
        category = CategoryFactory()

        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': 99999,  # Non-existent
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'items' in response.data.get('details', response.data)

    def test_create_order_validation_category_event_mismatch(self, api_client, default_sales_channel):
        """Category from different event should return validation error."""
        category = CategoryFactory()
        other_event = CategoryFactory().event  # Different event

        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': other_event.id,  # Wrong event!
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        details = response.data.get('details', response.data)
        assert 'items' in details
        assert 'mismatch' in str(details['items']).lower() or 'belongs to' in str(details['items']).lower()

    def test_create_order_validation_category_inactive(self, api_client, default_sales_channel):
        """Inactive category should return validation error."""
        category = CategoryFactory(is_active=False)

        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'items' in response.data.get('details', response.data)

    def test_create_order_validation_insufficient_seats(self, api_client, default_sales_channel):
        """Request for more seats than available should return error."""
        category = CategoryFactory(seats_available=2)

        payload = {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 10  # More than available
            }]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'items' in response.data.get('details', response.data)

    def test_create_order_multi_event(self, api_client, default_sales_channel):
        """Order with items from multiple events should succeed."""
        cat1 = CategoryFactory(price=Decimal('100.00'))
        cat2 = CategoryFactory(price=Decimal('200.00'))

        payload = {
            'name': 'Multi Event Buyer',
            'email': 'multi@example.com',
            'phone': '+971501234567',
            'items': [
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
            ]
        }

        response = api_client.post('/api/orders/', payload, format='json')

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['order']['total_amount'] == '400.00'  # (2x100) + (1x200)


@pytest.mark.django_db
class TestOrderRetrieveAPI:
    """Tests for GET /api/orders/{id}/"""

    def test_retrieve_order_by_id(self, api_client, default_sales_channel):
        """Can retrieve order by UUID."""
        category = CategoryFactory()

        # Create order first
        create_response = api_client.post('/api/orders/', {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '+971501234567',
            'items': [{
                'event_id': category.event.id,
                'category_id': category.id,
                'quantity': 1
            }]
        }, format='json')

        order_id = create_response.data['order']['id']

        # Retrieve order
        response = api_client.get(f'/api/orders/{order_id}/')

        assert response.status_code == status.HTTP_200_OK
        assert response.data['name'] == 'Test User'
        assert 'items' in response.data

    def test_retrieve_order_not_found(self, api_client):
        """Non-existent order returns 404."""
        response = api_client.get('/api/orders/00000000-0000-0000-0000-000000000000/')

        assert response.status_code == status.HTTP_404_NOT_FOUND
