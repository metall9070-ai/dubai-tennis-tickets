"""
Test email flow command.
Creates a test order and sends both CREATED and PAID notifications.

Usage:
    python manage.py test_email_flow --email=ivan-efr87@mail.ru
    python manage.py test_email_flow --email=ivan-efr87@mail.ru --paid-only
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from decimal import Decimal

from orders.models import Order, OrderItem
from orders.notifications import notify_order_created, notify_order_paid
from events.models import Event, Category


class Command(BaseCommand):
    help = 'Test email notification flow with a test order'

    def add_arguments(self, parser):
        parser.add_argument(
            '--email',
            type=str,
            required=True,
            help='Customer email address for test'
        )
        parser.add_argument(
            '--name',
            type=str,
            default='Test Customer',
            help='Customer name'
        )
        parser.add_argument(
            '--paid-only',
            action='store_true',
            help='Only send PAID notification (skip CREATED)'
        )
        parser.add_argument(
            '--order-id',
            type=str,
            help='Use existing order ID instead of creating new one'
        )

    def handle(self, *args, **options):
        email = options['email']
        name = options['name']
        paid_only = options['paid_only']
        order_id = options.get('order_id')

        self.stdout.write(f"Testing email flow for: {email}")

        if order_id:
            # Use existing order
            try:
                order = Order.objects.prefetch_related('items').get(id=order_id)
                self.stdout.write(f"Using existing order: {order.order_number}")
            except Order.DoesNotExist:
                self.stderr.write(f"Order not found: {order_id}")
                return
        else:
            # Create test order
            order = self._create_test_order(email, name)
            self.stdout.write(self.style.SUCCESS(f"Created test order: {order.order_number}"))

        # Step 1: Send CREATED notification
        if not paid_only:
            self.stdout.write("\n--- STEP 1: ORDER CREATED ---")
            results = notify_order_created(order)
            self._print_results(results, "CREATED")

        # Step 2: Mark as PAID and send notification
        self.stdout.write("\n--- STEP 2: ORDER PAID ---")
        order.status = 'paid'
        order.paid_at = timezone.now()
        order.payment_intent_id = 'pi_test_' + timezone.now().strftime('%Y%m%d%H%M%S')
        order.save()
        self.stdout.write(f"Order marked as PAID at {order.paid_at}")

        # Refresh to get updated data
        order = Order.objects.prefetch_related('items').get(id=order.id)
        results = notify_order_paid(order)
        self._print_results(results, "PAID")

        self.stdout.write(self.style.SUCCESS(f"\nTest complete! Check email: {email}"))

    def _create_test_order(self, email: str, name: str) -> Order:
        """Create a test order with one item."""
        # Get first available event and category
        event = Event.objects.first()
        if not event:
            raise ValueError("No events in database")

        category = Category.objects.filter(event=event, is_active=True).first()
        if not category:
            raise ValueError(f"No active categories for event {event.title}")

        # Create order
        order = Order.objects.create(
            name=name,
            email=email,
            phone='+971501234567',
            status='pending',
            total_amount=category.price,
            currency='USD',
            comments='Test order for email verification'
        )

        # Create order item
        OrderItem.objects.create(
            order=order,
            event=event,
            category=category,
            event_title=event.title,
            event_date=event.date,
            event_month=event.month,
            event_day=event.day,
            event_time=event.time,
            venue=event.venue,
            category_name=category.name,
            unit_price=category.price,
            quantity=1,
            subtotal=category.price
        )

        return Order.objects.prefetch_related('items').get(id=order.id)

    def _print_results(self, results: dict, phase: str):
        """Print notification results."""
        for key, value in results.items():
            status = self.style.SUCCESS("OK") if value else self.style.ERROR("FAILED")
            self.stdout.write(f"  {key}: {status}")
