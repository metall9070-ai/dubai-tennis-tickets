"""
Management command to remove or deactivate Courtside-type categories.

These categories are obsolete and must not exist in the active catalog.
Categories with existing orders are deactivated (not deleted) to preserve
historical order data.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from events.models import Category


# Patterns to match obsolete Courtside categories (case-insensitive)
OBSOLETE_PATTERNS = [
    'courtside',
    'premium courtside',
]


class Command(BaseCommand):
    help = 'Remove or deactivate obsolete Courtside-type categories'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))

        self.stdout.write('')
        self.stdout.write('=' * 60)
        self.stdout.write('REMOVING COURTSIDE-TYPE CATEGORIES')
        self.stdout.write('=' * 60)
        self.stdout.write(f'Patterns: {OBSOLETE_PATTERNS}')
        self.stdout.write('')

        # Find all Courtside-type categories (case-insensitive)
        courtside_categories = Category.objects.filter(
            name__icontains='courtside'
        ).select_related('event', 'event__tournament')

        if not courtside_categories.exists():
            self.stdout.write(self.style.SUCCESS('No Courtside categories found. Nothing to do.'))
            return

        self.stdout.write(f'Found {courtside_categories.count()} Courtside-type categories')
        self.stdout.write('-' * 60)

        deleted_count = 0
        deactivated_count = 0
        skipped_count = 0
        affected_events = set()

        for cat in courtside_categories:
            result = self.process_category(cat, dry_run)
            if result == 'deleted':
                deleted_count += 1
                affected_events.add(cat.event)
            elif result == 'deactivated':
                deactivated_count += 1
                affected_events.add(cat.event)
            else:
                skipped_count += 1

        # Recalculate min_price for affected events
        if not dry_run and affected_events:
            self.stdout.write('')
            self.stdout.write('Recalculating min_price for affected events...')
            for event in affected_events:
                event.recalculate_min_price()
                self.stdout.write(f'  {event.title}: min_price = ${event.min_price}')

        # Summary
        self.stdout.write('')
        self.stdout.write('=' * 60)
        self.stdout.write('SUMMARY')
        self.stdout.write('=' * 60)
        self.stdout.write(f'Deleted:     {deleted_count} (no orders)')
        self.stdout.write(f'Deactivated: {deactivated_count} (has orders)')
        self.stdout.write(f'Skipped:     {skipped_count} (already inactive)')
        self.stdout.write(f'Events affected: {len(affected_events)}')

        if dry_run:
            self.stdout.write('')
            self.stdout.write(self.style.WARNING('DRY RUN - No actual changes were made'))
            self.stdout.write('Run without --dry-run to apply changes')
        else:
            self.stdout.write('')
            self.stdout.write(self.style.SUCCESS('Courtside categories cleanup complete.'))

    @transaction.atomic
    def process_category(self, cat, dry_run):
        """
        Process a single Courtside category.

        Returns: 'deleted', 'deactivated', or 'skipped'
        """
        event_name = cat.event.title
        has_orders = cat.order_items.exists()
        order_count = cat.order_items.count() if has_orders else 0

        if has_orders:
            # Cannot delete - must deactivate to preserve order history
            if cat.is_active:
                if not dry_run:
                    cat.is_active = False
                    cat.save(update_fields=['is_active', 'updated_at'])
                self.stdout.write(
                    self.style.WARNING(
                        f'  DEACTIVATED: "{cat.name}" | Event: {event_name} | '
                        f'Reason: has {order_count} order(s)'
                    )
                )
                return 'deactivated'
            else:
                # Already inactive
                self.stdout.write(
                    f'  SKIPPED: "{cat.name}" | Event: {event_name} | '
                    f'Reason: already inactive (has {order_count} order(s))'
                )
                return 'skipped'
        else:
            # Safe to delete - no orders
            if not dry_run:
                cat.delete()
            self.stdout.write(
                self.style.ERROR(
                    f'  DELETED: "{cat.name}" | Event: {event_name} | '
                    f'Reason: no orders'
                )
            )
            return 'deleted'
