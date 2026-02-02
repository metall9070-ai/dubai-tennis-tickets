"""
Tests for Stripe webhook handling.
Covers: checkout.session.completed processing, idempotency, error cases.
"""

import json
import pytest
from decimal import Decimal
from unittest.mock import patch, MagicMock
from django.test import override_settings

from orders.models import Order, SalesChannel
from .factories import OrderFactory, OrderItemFactory, CategoryFactory


@pytest.fixture
def default_sales_channel(db):
    """Ensure default sales channel exists."""
    return SalesChannel.get_default()


@pytest.fixture
def pending_order(db, default_sales_channel):
    """Create a pending order with stripe_amount_cents set."""
    category = CategoryFactory(price=Decimal('200.00'))
    order = OrderFactory(
        status='pending',
        total_amount=Decimal('400.00'),
        currency='USD',
        stripe_amount_cents=40000,  # $400.00 in cents
    )
    # Create order item
    OrderItemFactory(
        order=order,
        category=category,
        event=category.event,
        quantity=2,
        unit_price=Decimal('200.00'),
    )
    return order


def build_checkout_session_completed_event(order, payment_intent_id='pi_test_123'):
    """
    Build a mock Stripe checkout.session.completed event.

    Args:
        order: Order instance
        payment_intent_id: Stripe payment intent ID

    Returns:
        dict: Mock Stripe event structure
    """
    return {
        'id': 'evt_test_123',
        'type': 'checkout.session.completed',
        'data': {
            'object': {
                'id': 'cs_test_123',
                'payment_intent': payment_intent_id,
                'payment_status': 'paid',
                'amount_total': order.stripe_amount_cents,
                'currency': order.currency.lower(),
                'metadata': {
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                },
            }
        }
    }


@pytest.mark.django_db
class TestStripeWebhookSuccess:
    """Tests for successful webhook processing."""

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_marks_order_as_paid(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Webhook successfully marks order as paid.

        Verifies:
        - Order status changes from 'pending' to 'paid'
        - payment_intent_id is saved
        - paid_at timestamp is set
        - notify_order_paid is called exactly once
        """
        payment_intent_id = 'pi_test_successful_payment'
        event = build_checkout_session_completed_event(
            pending_order, payment_intent_id
        )
        mock_construct_event.return_value = event

        # Call webhook endpoint
        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        assert response.status_code == 200

        # Reload order from DB
        pending_order.refresh_from_db()

        # Verify order is marked as paid
        assert pending_order.status == 'paid'
        assert pending_order.payment_intent_id == payment_intent_id
        assert pending_order.paid_at is not None

        # Verify notification was called exactly once
        mock_notify.assert_called_once()
        notified_order = mock_notify.call_args[0][0]
        assert str(notified_order.id) == str(pending_order.id)

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_idempotency_duplicate_webhook(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Same webhook sent twice should only process once.

        Verifies idempotency:
        - First webhook marks order as paid
        - Second webhook with same payment_intent_id is acknowledged (200)
        - notify_order_paid is called only once (not twice)
        """
        payment_intent_id = 'pi_test_idempotent'
        event = build_checkout_session_completed_event(
            pending_order, payment_intent_id
        )
        mock_construct_event.return_value = event

        # First webhook call
        response1 = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )
        assert response1.status_code == 200

        # Second webhook call (same event)
        response2 = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )
        assert response2.status_code == 200

        # Reload order
        pending_order.refresh_from_db()

        # Order should still be paid
        assert pending_order.status == 'paid'
        assert pending_order.payment_intent_id == payment_intent_id

        # Notification should only be called ONCE (not twice)
        assert mock_notify.call_count == 1


@pytest.mark.django_db
class TestStripeWebhookValidation:
    """Tests for webhook validation and error cases."""

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_invalid_signature(self, mock_construct_event, api_client):
        """Invalid webhook signature returns 400."""
        import stripe
        mock_construct_event.side_effect = stripe.error.SignatureVerificationError(
            'Invalid signature', 'sig_header'
        )

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='invalid_signature',
        )

        assert response.status_code == 400

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_payment_not_paid_status(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Webhook with payment_status != 'paid' is acknowledged but not processed.
        """
        event = build_checkout_session_completed_event(pending_order)
        # Modify payment_status
        event['data']['object']['payment_status'] = 'unpaid'
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        # Acknowledged
        assert response.status_code == 200

        # Order should still be pending
        pending_order.refresh_from_db()
        assert pending_order.status == 'pending'

        # Notification should NOT be called
        mock_notify.assert_not_called()

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_amount_mismatch(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Webhook with mismatched amount is acknowledged but not processed.

        SECURITY: This could indicate fraud - attempting to pay less than owed.
        """
        event = build_checkout_session_completed_event(pending_order)
        # Modify amount to be different
        event['data']['object']['amount_total'] = 10000  # $100 instead of $400
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        # Acknowledged (to prevent Stripe retries)
        assert response.status_code == 200

        # Order should still be pending
        pending_order.refresh_from_db()
        assert pending_order.status == 'pending'

        # Notification should NOT be called
        mock_notify.assert_not_called()

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_currency_mismatch(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Webhook with mismatched currency is acknowledged but not processed.

        SECURITY: This could indicate fraud - paying in a different currency.
        """
        event = build_checkout_session_completed_event(pending_order)
        # Modify currency
        event['data']['object']['currency'] = 'eur'  # Different from USD
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        # Acknowledged
        assert response.status_code == 200

        # Order should still be pending
        pending_order.refresh_from_db()
        assert pending_order.status == 'pending'

        # Notification should NOT be called
        mock_notify.assert_not_called()

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_order_not_found(self, mock_construct_event, api_client, db):
        """Webhook for non-existent order returns 404."""
        event = {
            'id': 'evt_test_123',
            'type': 'checkout.session.completed',
            'data': {
                'object': {
                    'id': 'cs_test_123',
                    'payment_intent': 'pi_test_123',
                    'payment_status': 'paid',
                    'amount_total': 10000,
                    'currency': 'usd',
                    'metadata': {
                        'order_id': '00000000-0000-0000-0000-000000000000',
                        'order_number': 'DT/0000',
                    },
                }
            }
        }
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        assert response.status_code == 404

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_order_already_paid_different_payment_intent(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Webhook for already paid order with different payment_intent is acknowledged.

        SECURITY: This could indicate duplicate payment attempts.
        """
        # First, mark order as paid with one payment intent
        pending_order.status = 'paid'
        pending_order.payment_intent_id = 'pi_original_payment'
        pending_order.save()

        # Now send webhook with different payment intent
        event = build_checkout_session_completed_event(
            pending_order, payment_intent_id='pi_different_payment'
        )
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        # Acknowledged
        assert response.status_code == 200

        # Order should keep original payment_intent_id
        pending_order.refresh_from_db()
        assert pending_order.payment_intent_id == 'pi_original_payment'

        # Notification should NOT be called
        mock_notify.assert_not_called()

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_unhandled_event_type(self, mock_construct_event, api_client, db):
        """Unhandled event types are acknowledged without processing."""
        event = {
            'id': 'evt_test_123',
            'type': 'payment_intent.created',  # Not checkout.session.completed
            'data': {
                'object': {}
            }
        }
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        # Should acknowledge
        assert response.status_code == 200

    @override_settings(STRIPE_WEBHOOK_SECRET='')
    def test_webhook_secret_not_configured(self, api_client, db):
        """Webhook returns 500 if STRIPE_WEBHOOK_SECRET is not configured."""
        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='any_signature',
        )

        assert response.status_code == 500


@pytest.mark.django_db
class TestStripeWebhookOrderStatus:
    """Tests for order status transitions via webhook."""

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_confirmed_order_can_be_paid(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Orders with status='confirmed' can also be marked as paid.
        """
        # Set order to confirmed status
        pending_order.status = 'confirmed'
        pending_order.save()

        event = build_checkout_session_completed_event(pending_order)
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        assert response.status_code == 200

        pending_order.refresh_from_db()
        assert pending_order.status == 'paid'
        mock_notify.assert_called_once()

    @override_settings(STRIPE_WEBHOOK_SECRET='whsec_test_secret')
    @patch('orders.stripe_views.notify_order_paid')
    @patch('stripe.Webhook.construct_event')
    def test_webhook_cancelled_order_cannot_be_paid(
        self, mock_construct_event, mock_notify, api_client, pending_order
    ):
        """
        Orders with status='cancelled' cannot be marked as paid.
        """
        # Set order to cancelled status
        pending_order.status = 'cancelled'
        pending_order.save()

        event = build_checkout_session_completed_event(pending_order)
        mock_construct_event.return_value = event

        response = api_client.post(
            '/api/stripe/webhook/',
            data=json.dumps({}),
            content_type='application/json',
            HTTP_STRIPE_SIGNATURE='valid_signature',
        )

        # Acknowledged
        assert response.status_code == 200

        # Order should remain cancelled
        pending_order.refresh_from_db()
        assert pending_order.status == 'cancelled'

        # Notification should NOT be called
        mock_notify.assert_not_called()
