"""
Stripe integration views for payment processing.

PAYMENT FLOW:
1. POST /api/checkout/create-session/
   - Validates cart items
   - Creates Order with status='pending'
   - Sends CREATED notifications (Telegram + Admin Email)
   - Creates Stripe Checkout Session
   - Returns session URL for redirect

2. POST /api/stripe/webhook/
   - Receives checkout.session.completed event
   - Validates signature with STRIPE_WEBHOOK_SECRET
   - Updates Order status to 'paid'
   - Sends PAID notifications (Telegram + Customer Email)

CRITICAL:
- Order is created BEFORE Stripe redirect (Phase 1)
- Order is marked PAID only via webhook (Phase 2)
- NEVER trust success page or query params for payment confirmation
"""

import logging
import stripe
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Order, OrderItem
from .services import OrderService, OrderItemRequest, InsufficientSeatsError
from .notifications import notify_order_created, notify_order_paid

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


# =============================================================================
# PHASE 1: CREATE ORDER + STRIPE SESSION
# =============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_checkout_session(request):
    """
    Create order and Stripe Checkout Session.

    POST /api/checkout/create-session/
    {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+971501234567",
        "comments": "Optional comments",
        "items": [
            {"event_id": 14, "category_id": 1, "quantity": 2}
        ]
    }

    Returns:
    {
        "order_id": "uuid",
        "order_number": "DT/1001",
        "checkout_url": "https://checkout.stripe.com/..."
    }

    FLOW:
    1. Validate input
    2. Create Order with status='pending'
    3. Send CREATED notifications
    4. Create Stripe Checkout Session
    5. Return checkout URL
    """
    # Check Stripe configuration
    if not settings.STRIPE_SECRET_KEY:
        logger.error("Stripe is not configured")
        return Response(
            {'error': 'payment_unavailable', 'message': 'Payment system is not configured'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    data = request.data

    # Validate required fields
    required_fields = ['name', 'email', 'phone', 'items']
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return Response(
            {'error': 'validation_error', 'message': f'Missing required fields: {", ".join(missing)}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate items
    items_data = data.get('items', [])
    if not items_data:
        return Response(
            {'error': 'validation_error', 'message': 'Order must contain at least one item'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Step 1: Validate items using existing service
        validated_items = OrderService.validate_items(items_data)

        # Step 2: Create order with atomic seat reservation
        order = OrderService.create_order(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            items=validated_items,
            user=request.user if request.user.is_authenticated else None,
            comments=data.get('comments', '')
        )

        logger.info(f"Order {order.order_number} created, preparing Stripe session")

        # Step 3: Send CREATED notifications (already handled in OrderService.create_order)
        # The notify_new_order is already called there, but we want the new format
        # Since OrderService calls notify_new_order which now calls notify_order_created,
        # notifications are already sent. No additional call needed.

        # Step 4: Build line items for Stripe
        line_items = []
        for item in order.items.all():
            line_items.append({
                'price_data': {
                    'currency': order.currency.lower(),
                    'unit_amount': int(item.unit_price * 100),  # Stripe uses cents
                    'product_data': {
                        'name': f"{item.event_title} - {item.category_name}",
                        'description': f"{item.event_date} {item.event_month} | {item.event_time} | {item.venue}",
                    },
                },
                'quantity': item.quantity,
            })

        # Step 5: Create Stripe Checkout Session
        frontend_url = settings.FRONTEND_URL.rstrip('/')
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url=f"{frontend_url}/checkout/{order.id}?status=success",
            cancel_url=f"{frontend_url}/checkout/{order.id}?status=cancelled",
            customer_email=order.email,
            metadata={
                'order_id': str(order.id),
                'order_number': order.order_number,
            },
            payment_intent_data={
                'metadata': {
                    'order_id': str(order.id),
                    'order_number': order.order_number,
                }
            }
        )

        logger.info(f"Stripe session created for order {order.order_number}: {checkout_session.id}")

        return Response({
            'order_id': str(order.id),
            'order_number': order.order_number,
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id,
        }, status=status.HTTP_201_CREATED)

    except InsufficientSeatsError as e:
        logger.warning(f"Insufficient seats: {e.message}")
        return Response(
            {'error': 'insufficient_seats', 'message': e.message, 'details': e.details},
            status=status.HTTP_400_BAD_REQUEST
        )
    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {e}")
        return Response(
            {'error': 'payment_error', 'message': 'Payment system error. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    except Exception as e:
        logger.exception(f"Unexpected error creating checkout session: {e}")
        return Response(
            {'error': 'server_error', 'message': 'An unexpected error occurred'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =============================================================================
# PHASE 2: STRIPE WEBHOOK (payment confirmation)
# =============================================================================

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def stripe_webhook(request):
    """
    Handle Stripe webhook events.

    POST /api/stripe/webhook/

    ONLY processes: checkout.session.completed

    CRITICAL SECURITY:
    - Validates webhook signature using STRIPE_WEBHOOK_SECRET
    - NEVER trust any other source for payment confirmation
    - Idempotent: safe to receive same event multiple times
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

    # Verify webhook secret is configured
    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.error("STRIPE_WEBHOOK_SECRET is not configured")
        return HttpResponse(status=500)

    # Verify webhook signature
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        logger.error(f"Invalid webhook payload: {e}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Invalid webhook signature: {e}")
        return HttpResponse(status=400)

    # Log all events for debugging
    logger.info(f"Received Stripe webhook: {event['type']}")

    # Only process checkout.session.completed
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        return handle_checkout_completed(session)

    # Acknowledge other events without processing
    return HttpResponse(status=200)


def handle_checkout_completed(session: dict) -> HttpResponse:
    """
    Handle successful checkout completion.

    Called when Stripe confirms payment via webhook.
    Updates order status and sends notifications.

    Args:
        session: Stripe Checkout Session object

    Returns:
        HttpResponse with appropriate status
    """
    # Extract order_id from metadata
    order_id = session.get('metadata', {}).get('order_id')
    payment_intent_id = session.get('payment_intent')

    if not order_id:
        logger.error(f"Webhook missing order_id in metadata: {session.get('id')}")
        return HttpResponse(status=400)

    logger.info(f"Processing payment for order {order_id}, payment_intent: {payment_intent_id}")

    try:
        with transaction.atomic():
            # Find and lock the order
            order = Order.objects.select_for_update().get(id=order_id)

            # Idempotency check: already paid with same payment_intent
            if order.status == 'paid' and order.payment_intent_id == payment_intent_id:
                logger.info(f"Order {order.order_number} already marked as paid (idempotent)")
                return HttpResponse(status=200)

            # Check if order is already paid with different payment
            if order.status == 'paid':
                logger.warning(
                    f"Order {order.order_number} already paid with different payment_intent. "
                    f"Existing: {order.payment_intent_id}, New: {payment_intent_id}"
                )
                return HttpResponse(status=200)  # Still return 200 to acknowledge

            # Check if order can be paid
            if order.status not in ('pending', 'confirmed'):
                logger.warning(
                    f"Cannot mark order {order.order_number} as paid. Current status: {order.status}"
                )
                return HttpResponse(status=200)

            # Update order status
            order.status = 'paid'
            order.payment_intent_id = payment_intent_id
            order.paid_at = timezone.now()
            order.save(update_fields=['status', 'payment_intent_id', 'paid_at', 'updated_at'])

            logger.info(f"Order {order.order_number} marked as PAID")

        # Send PAID notifications (outside transaction to avoid blocking)
        try:
            # Prefetch items for notification
            order = Order.objects.prefetch_related('items').get(id=order_id)
            notify_order_paid(order)
        except Exception as e:
            # Don't fail the webhook if notifications fail
            logger.error(f"Failed to send PAID notifications for {order.order_number}: {e}")

        return HttpResponse(status=200)

    except Order.DoesNotExist:
        logger.error(f"Order not found for webhook: {order_id}")
        return HttpResponse(status=404)
    except Exception as e:
        logger.exception(f"Error processing webhook for order {order_id}: {e}")
        return HttpResponse(status=500)


# =============================================================================
# ORDER STATUS ENDPOINT (for frontend to check payment status)
# =============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def check_order_status(request, order_id):
    """
    Check order payment status.

    GET /api/checkout/{order_id}/status/

    Used by frontend to poll for payment completion.
    Does NOT confirm payment - only returns current status.

    Returns:
    {
        "order_id": "uuid",
        "order_number": "DT/1001",
        "status": "pending|paid|cancelled",
        "paid_at": "2024-01-30T12:00:00Z" or null
    }
    """
    try:
        order = Order.objects.get(id=order_id)
        return Response({
            'order_id': str(order.id),
            'order_number': order.order_number,
            'status': order.status,
            'paid_at': order.paid_at.isoformat() if order.paid_at else None,
            'total_amount': str(order.total_amount),
            'currency': order.currency,
        })
    except Order.DoesNotExist:
        return Response(
            {'error': 'not_found', 'message': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )
