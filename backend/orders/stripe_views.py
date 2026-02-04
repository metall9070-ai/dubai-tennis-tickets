"""
Stripe integration views for payment processing.

PAYMENT FLOW:
1. Order is created (via /api/checkout/create-session/ or other means)
2. Stripe Checkout Session is created for the order
3. User completes payment on Stripe
4. Webhook receives checkout.session.completed
5. Order is marked as PAID (ONLY via webhook)

ENDPOINTS:
- POST /api/checkout/create-session/ - Creates order + Stripe session (legacy)
- POST /api/stripe/create-checkout-session/ - Creates Stripe session for existing order
- POST /api/stripe/webhook/ - Handles Stripe webhooks
- GET /api/checkout/{order_id}/status/ - Check order status

CRITICAL SECURITY:
- Order is created BEFORE Stripe redirect
- Order is marked PAID ONLY via webhook
- NEVER trust success page or query params for payment confirmation
- Webhook signature is ALWAYS validated
- Amount is validated: session.amount_total == order.stripe_amount_cents
- Currency is validated: session.currency == order.currency

CURRENCY ARCHITECTURE (Variant 1):
- Currency is set from SalesChannel at order creation
- order.currency and order.stripe_amount_cents are FROZEN
- Stripe checkout uses these frozen values
- Webhook validates BOTH amount AND currency match
"""

import logging
import stripe
import sentry_sdk
from decimal import Decimal

from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle


class CheckoutSessionThrottle(AnonRateThrottle):
    """Rate limit for checkout session creation to prevent abuse."""
    rate = '10/minute'

from .models import Order, OrderItem
from .services import OrderService, OrderItemRequest, InsufficientSeatsError
from .notifications import notify_order_created, notify_order_paid

logger = logging.getLogger(__name__)

# Initialize Stripe
# TODO(platform): Stripe credentials may vary per client
stripe.api_key = settings.STRIPE_SECRET_KEY


def _create_stripe_session_for_order(order: Order) -> stripe.checkout.Session:
    """
    Create Stripe Checkout Session for an existing order.

    Uses idempotency key to prevent duplicate sessions.
    Prices are taken from server-side order data ONLY.
    Currency and amount are from FROZEN order fields.

    Args:
        order: Order model instance with items prefetched

    Returns:
        Stripe Checkout Session object

    Raises:
        stripe.error.StripeError: If Stripe API fails
    """
    # Build line items from ORDER data (never trust client)
    # Currency is FROZEN from order creation (set by SalesChannel)
    line_items = []
    for item in order.items.all():
        line_items.append({
            'price_data': {
                'currency': order.currency.lower(),  # FROZEN currency
                'unit_amount': int(item.unit_price * 100),  # Stripe uses cents
                'product_data': {
                    'name': f"{item.event_title} - {item.category_name}",
                    'description': f"{item.event_date} {item.event_month} | {item.event_time} | {item.venue}",
                },
            },
            'quantity': item.quantity,
        })

    # TODO(platform): frontend URL may vary per client
    frontend_url = settings.FRONTEND_URL.rstrip('/')

    # Create Stripe Checkout Session with idempotency key
    # Idempotency key ensures same order doesn't create multiple sessions
    checkout_session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=line_items,
        mode='payment',
        success_url=f"{frontend_url}/checkout/{order.id}?status=success&session_id={{CHECKOUT_SESSION_ID}}",
        cancel_url=f"{frontend_url}/checkout/{order.id}?status=cancelled",
        customer_email=order.email,
        metadata={
            'order_id': str(order.id),
            'order_number': order.order_number,
            # Store FROZEN values for webhook verification
            'expected_amount_cents': str(order.stripe_amount_cents),
            'expected_currency': order.currency,
        },
        payment_intent_data={
            'metadata': {
                'order_id': str(order.id),
                'order_number': order.order_number,
            },
            'receipt_email': order.email,  # Send Stripe receipt to customer
        },
        # Idempotency key: same order_id = same session
        idempotency_key=f"checkout_session_order_{order.id}",
    )

    return checkout_session


# =============================================================================
# ENDPOINT 1: CREATE ORDER + STRIPE SESSION (combined flow)
# =============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([CheckoutSessionThrottle])
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
        "checkout_url": "https://checkout.stripe.com/...",
        "session_id": "cs_..."
    }

    FLOW:
    1. Validate input
    2. Create Order with status='pending'
    3. Send CREATED notifications (via OrderService)
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
        # OrderService.create_order() also sends CREATED notifications
        order = OrderService.create_order(
            name=data['name'],
            email=data['email'],
            phone=data['phone'],
            items=validated_items,
            user=request.user if request.user.is_authenticated else None,
            comments=data.get('comments', '')
        )

        logger.info(f"Order {order.order_number} created, preparing Stripe session")

        # Step 3: Create Stripe Checkout Session
        checkout_session = _create_stripe_session_for_order(order)

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
# ENDPOINT 2: CREATE STRIPE SESSION FOR EXISTING ORDER
# =============================================================================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_stripe_session_for_order(request):
    """
    Create Stripe Checkout Session for an existing order.

    POST /api/stripe/create-checkout-session/
    {
        "order_id": "uuid"
    }

    Returns:
    {
        "order_id": "uuid",
        "order_number": "DT/1001",
        "checkout_url": "https://checkout.stripe.com/...",
        "session_id": "cs_..."
    }

    SECURITY:
    - Only orders with status='pending' or 'confirmed' can be paid
    - Prices are taken from server-side order data ONLY
    - Idempotency key prevents duplicate sessions
    """
    # Check Stripe configuration
    if not settings.STRIPE_SECRET_KEY:
        logger.error("Stripe is not configured")
        return Response(
            {'error': 'payment_unavailable', 'message': 'Payment system is not configured'},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    order_id = request.data.get('order_id')
    if not order_id:
        return Response(
            {'error': 'validation_error', 'message': 'order_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Load order with items
        order = Order.objects.prefetch_related('items').get(id=order_id)
    except Order.DoesNotExist:
        return Response(
            {'error': 'not_found', 'message': 'Order not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    # Validate order status - only pending/confirmed orders can be paid
    if order.status not in ('pending', 'confirmed'):
        return Response(
            {'error': 'invalid_status',
             'message': f'Order cannot be paid. Current status: {order.status}'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate order has items
    if not order.items.exists():
        return Response(
            {'error': 'invalid_order', 'message': 'Order has no items'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Create Stripe Checkout Session
        checkout_session = _create_stripe_session_for_order(order)

        logger.info(f"Stripe session created for existing order {order.order_number}: {checkout_session.id}")

        return Response({
            'order_id': str(order.id),
            'order_number': order.order_number,
            'checkout_url': checkout_session.url,
            'session_id': checkout_session.id,
        }, status=status.HTTP_200_OK)

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error for order {order.order_number}: {e}")
        return Response(
            {'error': 'payment_error', 'message': 'Payment system error. Please try again.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


# =============================================================================
# STRIPE WEBHOOK (payment confirmation - SINGLE SOURCE OF TRUTH)
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
    - Validates payment_status == 'paid'
    - Validates amount matches order total
    - NEVER trust any other source for payment confirmation
    - Idempotent: safe to receive same event multiple times
    """
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE', '')

    # Verify webhook secret is configured
    if not settings.STRIPE_WEBHOOK_SECRET:
        logger.error("STRIPE_WEBHOOK_SECRET is not configured")
        return HttpResponse(status=500)

    # Verify webhook signature - CRITICAL SECURITY
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
    logger.info(f"Received Stripe webhook: {event['type']} (id: {event['id']})")

    # Only process checkout.session.completed
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        return handle_checkout_completed(session, event['id'])

    # Acknowledge other events without processing
    return HttpResponse(status=200)


def handle_checkout_completed(session: dict, event_id: str) -> HttpResponse:
    """
    Handle successful checkout completion.

    Called when Stripe confirms payment via webhook.
    Updates order status and sends notifications.

    SECURITY VALIDATIONS:
    1. Order exists and is in valid status
    2. payment_status == 'paid'
    3. Amount matches order.stripe_amount_cents (FROZEN)
    4. Currency matches order.currency (FROZEN)
    5. Idempotency: already paid orders are skipped

    Args:
        session: Stripe Checkout Session object
        event_id: Stripe event ID for logging

    Returns:
        HttpResponse with appropriate status
    """
    # Extract data from session
    order_id = session.get('metadata', {}).get('order_id')
    payment_intent_id = session.get('payment_intent')
    payment_status = session.get('payment_status')
    amount_total = session.get('amount_total')  # In cents
    session_currency = session.get('currency', 'usd').upper()

    if not order_id:
        logger.error(f"Webhook missing order_id in metadata: session={session.get('id')}, event={event_id}")
        return HttpResponse(status=400)

    logger.info(
        f"Processing webhook for order {order_id}: "
        f"payment_intent={payment_intent_id}, status={payment_status}, "
        f"amount={amount_total}, currency={session_currency}, event={event_id}"
    )

    # CRITICAL: Verify payment is actually completed
    if payment_status != 'paid':
        logger.warning(
            f"Webhook received but payment_status is not 'paid': {payment_status} "
            f"(order={order_id}, event={event_id})"
        )
        # Return 200 to acknowledge but don't process
        return HttpResponse(status=200)

    try:
        with transaction.atomic():
            # Find and lock the order
            order = Order.objects.select_for_update().get(id=order_id)

            # IDEMPOTENCY CHECK 1: Already paid with same payment_intent
            if order.status == 'paid' and order.payment_intent_id == payment_intent_id:
                logger.info(f"Order {order.order_number} already paid (idempotent), event={event_id}")
                return HttpResponse(status=200)

            # IDEMPOTENCY CHECK 2: Already paid with different payment
            if order.status == 'paid':
                logger.warning(
                    f"Order {order.order_number} already paid with different payment_intent. "
                    f"Existing: {order.payment_intent_id}, New: {payment_intent_id}, event={event_id}"
                )
                return HttpResponse(status=200)

            # STATUS CHECK: Order must be in payable status
            if order.status not in ('pending', 'confirmed'):
                logger.warning(
                    f"Cannot mark order {order.order_number} as paid. "
                    f"Current status: {order.status}, event={event_id}"
                )
                return HttpResponse(status=200)

            # CURRENCY VALIDATION: Verify currency matches order (FROZEN)
            if session_currency != order.currency:
                logger.error(
                    f"CURRENCY MISMATCH for order {order.order_number}! "
                    f"Expected: {order.currency}, Received: {session_currency}, event={event_id}"
                )
                # SECURITY: Do NOT mark as paid - this could indicate fraud
                return HttpResponse(status=200)

            # AMOUNT VALIDATION: Verify amount matches order.stripe_amount_cents (FROZEN)
            # Use stripe_amount_cents if available, fallback for existing orders
            expected_amount = order.stripe_amount_cents if order.stripe_amount_cents else int(order.total_amount * 100)
            if amount_total != expected_amount:
                logger.error(
                    f"AMOUNT MISMATCH for order {order.order_number}! "
                    f"Expected: {expected_amount}, Received: {amount_total}, event={event_id}"
                )
                # SECURITY: Do NOT mark as paid - this could indicate fraud
                return HttpResponse(status=200)

            # ALL CHECKS PASSED - Update order status
            order.status = 'paid'
            order.payment_intent_id = payment_intent_id
            order.paid_at = timezone.now()
            order.save(update_fields=['status', 'payment_intent_id', 'paid_at', 'updated_at'])

            logger.info(
                f"Order {order.order_number} marked as PAID "
                f"({order.currency} {order.total_amount}), event={event_id}"
            )

        # Send PAID notifications (outside transaction to avoid blocking)
        try:
            # Reload with items for notification
            order = Order.objects.prefetch_related('items').get(id=order_id)
            notify_order_paid(order)
            logger.info(f"PAID notifications sent for order {order.order_number}")
        except Exception as e:
            # Don't fail the webhook if notifications fail
            logger.error(f"Failed to send PAID notifications for {order.order_number}: {e}")
            sentry_sdk.capture_exception(e)

        return HttpResponse(status=200)

    except Order.DoesNotExist:
        logger.error(f"Order not found for webhook: {order_id}, event={event_id}")
        return HttpResponse(status=404)
    except Exception as e:
        logger.exception(f"Error processing webhook for order {order_id}, event={event_id}: {e}")
        sentry_sdk.capture_exception(e)
        return HttpResponse(status=500)


# =============================================================================
# ORDER STATUS ENDPOINT (for frontend to poll payment status)
# =============================================================================

@api_view(['GET'])
@permission_classes([AllowAny])
def check_order_status(request, order_id):
    """
    Check order payment status.

    GET /api/checkout/{order_id}/status/

    Used by frontend to poll for payment completion.
    Does NOT confirm payment - only returns current status from DB.

    SECURITY: This endpoint NEVER marks an order as paid.

    Returns:
    {
        "order_id": "uuid",
        "order_number": "DT/1001",
        "status": "pending|paid|cancelled",
        "paid_at": "2024-01-30T12:00:00Z" or null,
        "total_amount": "500.00",
        "currency": "USD"
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
