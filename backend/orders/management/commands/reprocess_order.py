"""
Management command для ручного reprocess заказов.

Синхронизирует статус заказа с реальным состоянием в Stripe API.

БЕЗОПАСНОСТЬ:
- Только READ из Stripe API
- Не создаёт PaymentIntent
- Не инициирует оплату
- Идемпотентен

USAGE:
    # Reprocess одного заказа по UUID
    python manage.py reprocess_order 550e8400-e29b-41d4-a716-446655440000

    # Reprocess по order_number
    python manage.py reprocess_order --order-number DT/1001

    # Reprocess всех pending заказов старше 1 часа
    python manage.py reprocess_order --pending --older-than 60

    # Dry run (показать что будет сделано)
    python manage.py reprocess_order --pending --dry-run
"""

from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta

from orders.models import Order
from orders.services_reprocess import reprocess_order, ReprocessAction


class Command(BaseCommand):
    help = 'Reprocess orders to sync status with Stripe'

    def add_arguments(self, parser):
        # Один заказ
        parser.add_argument(
            'order_id',
            nargs='?',
            type=str,
            help='Order UUID to reprocess'
        )
        parser.add_argument(
            '--order-number',
            type=str,
            help='Order number (e.g., DT/1001)'
        )

        # Batch режим
        parser.add_argument(
            '--pending',
            action='store_true',
            help='Reprocess all pending orders'
        )
        parser.add_argument(
            '--older-than',
            type=int,
            default=60,
            help='Only process orders older than N minutes (default: 60)'
        )
        parser.add_argument(
            '--limit',
            type=int,
            default=100,
            help='Maximum number of orders to process (default: 100)'
        )

        # Options
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without actually doing it'
        )

    def handle(self, *args, **options):
        order_id = options.get('order_id')
        order_number = options.get('order_number')
        pending = options.get('pending')
        older_than = options.get('older_than')
        limit = options.get('limit')
        dry_run = options.get('dry_run')

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN - no changes will be made"))

        # Режим одного заказа
        if order_id:
            self._reprocess_single(order_id, dry_run)
            return

        if order_number:
            try:
                order = Order.objects.get(order_number=order_number)
                self._reprocess_single(str(order.id), dry_run)
            except Order.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Order not found: {order_number}"))
            return

        # Batch режим
        if pending:
            self._reprocess_pending(older_than, limit, dry_run)
            return

        self.stdout.write(self.style.ERROR(
            "Please specify order_id, --order-number, or --pending"
        ))

    def _reprocess_single(self, order_id: str, dry_run: bool):
        """Reprocess одного заказа."""
        try:
            order = Order.objects.get(id=order_id)
        except Order.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"Order not found: {order_id}"))
            return

        self.stdout.write(f"Order: {order.order_number}")
        self.stdout.write(f"  Current status: {order.status}")
        self.stdout.write(f"  Payment Intent: {order.payment_intent_id or 'None'}")

        if dry_run:
            self.stdout.write(self.style.WARNING("  [DRY RUN] Would reprocess this order"))
            return

        result = reprocess_order(order_id)
        self._print_result(result)

    def _reprocess_pending(self, older_than: int, limit: int, dry_run: bool):
        """Reprocess всех pending заказов."""
        cutoff_time = timezone.now() - timedelta(minutes=older_than)

        orders = Order.objects.filter(
            status='pending',
            created_at__lt=cutoff_time,
            payment_intent_id__isnull=False  # Только те что были в Stripe
        ).order_by('created_at')[:limit]

        count = orders.count()
        self.stdout.write(f"Found {count} pending orders older than {older_than} minutes")

        if count == 0:
            self.stdout.write(self.style.SUCCESS("No orders to reprocess"))
            return

        if dry_run:
            self.stdout.write(self.style.WARNING("[DRY RUN] Would reprocess:"))
            for order in orders:
                self.stdout.write(f"  - {order.order_number} (created {order.created_at})")
            return

        stats = {
            'synced': 0,
            'noop': 0,
            'error': 0,
            'cannot': 0,
        }

        for order in orders:
            self.stdout.write(f"\nProcessing {order.order_number}...")
            result = reprocess_order(str(order.id))
            self._print_result(result)

            if result.action == ReprocessAction.STATUS_SYNCED:
                stats['synced'] += 1
            elif result.action == ReprocessAction.NOOP:
                stats['noop'] += 1
            elif result.action == ReprocessAction.CANNOT_REPROCESS:
                stats['cannot'] += 1
            else:
                stats['error'] += 1

        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(self.style.SUCCESS(f"Synced: {stats['synced']}"))
        self.stdout.write(f"Already in sync: {stats['noop']}")
        self.stdout.write(f"Cannot reprocess: {stats['cannot']}")
        if stats['error'] > 0:
            self.stdout.write(self.style.ERROR(f"Errors: {stats['error']}"))

    def _print_result(self, result):
        """Вывод результата reprocess."""
        if result.action == ReprocessAction.STATUS_SYNCED:
            self.stdout.write(self.style.SUCCESS(
                f"  ✓ Status synced: {result.before_status} → {result.after_status}"
            ))
        elif result.action == ReprocessAction.NOOP:
            self.stdout.write(f"  ○ Already in sync (status={result.before_status})")
        elif result.action == ReprocessAction.CANNOT_REPROCESS:
            self.stdout.write(self.style.WARNING(f"  ⚠ Cannot reprocess: {result.message}"))
        elif result.action == ReprocessAction.NOT_FOUND:
            self.stdout.write(self.style.ERROR(f"  ✗ Order not found"))
        else:
            self.stdout.write(self.style.ERROR(f"  ✗ Error: {result.message}"))
