"""
Management command to ensure all seating map categories exist for every event.

CRITICAL DATA INTEGRITY RULE:
- Seating categories must NEVER be deleted
- Availability is controlled ONLY via is_active and seats_available
- Missing categories are created as SOLD OUT (is_active=False, seats_available=0)

This command ensures the frontend seating map always has matching categories.
"""

from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction
from events.models import Event, Category


# ============================================================================
# SEATING MAP CATEGORY DEFINITIONS
# These MUST match the frontend StaticSeatingMap.tsx mappings
# ============================================================================

# WTA (Women's) events have 3 category types
WTA_CATEGORIES = [
    {
        'name': 'Grandstand',
        'color': '#4A69BD',
        'sort_order': 1,
        'default_price': Decimal('300.00'),
    },
    {
        'name': 'Prime B',
        'color': '#4A69BD',
        'sort_order': 2,
        'default_price': Decimal('1000.00'),
    },
    {
        'name': 'Prime A',
        'color': '#4A69BD',
        'sort_order': 3,
        'default_price': Decimal('2000.00'),
    },
]

# ATP (Men's) events have 4 category types
ATP_CATEGORIES = [
    {
        'name': 'Grandstand Upper',
        'color': '#4A69BD',
        'sort_order': 1,
        'default_price': Decimal('200.00'),
    },
    {
        'name': 'Grandstand Lower',
        'color': '#4A69BD',
        'sort_order': 2,
        'default_price': Decimal('400.00'),
    },
    {
        'name': 'Prime B',
        'color': '#4A69BD',
        'sort_order': 3,
        'default_price': Decimal('1500.00'),
    },
    {
        'name': 'Prime A',
        'color': '#4A69BD',
        'sort_order': 4,
        'default_price': Decimal('3000.00'),
    },
]


class Command(BaseCommand):
    help = 'Ensure all seating map categories exist for every event (creates missing as SOLD OUT)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be created without making changes',
        )
        parser.add_argument(
            '--event-id',
            type=int,
            help='Process only a specific event ID',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        dry_run = options['dry_run']
        event_id = options.get('event_id')

        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE - No changes will be made'))

        # Get events to process
        events = Event.objects.select_related('tournament').prefetch_related('categories')
        if event_id:
            events = events.filter(id=event_id)

        if not events.exists():
            self.stdout.write(self.style.WARNING('No events found.'))
            return

        total_created = 0
        total_events = 0

        for event in events:
            tournament_type = event.tournament.type
            expected_categories = WTA_CATEGORIES if tournament_type == 'WTA' else ATP_CATEGORIES

            self.stdout.write(f'\n[{tournament_type}] Event {event.id}: {event.title}')

            existing_names = set(
                cat.name.lower() for cat in event.categories.all()
            )

            event_created = 0
            for cat_def in expected_categories:
                cat_name_lower = cat_def['name'].lower()

                if cat_name_lower in existing_names:
                    self.stdout.write(f'  ✓ {cat_def["name"]} - exists')
                else:
                    # Category is MISSING - create it as SOLD OUT
                    self.stdout.write(
                        self.style.WARNING(f'  ✗ {cat_def["name"]} - MISSING, creating as SOLD OUT')
                    )

                    if not dry_run:
                        Category.objects.create(
                            event=event,
                            name=cat_def['name'],
                            price=cat_def['default_price'],
                            color=cat_def['color'],
                            sort_order=cat_def['sort_order'],
                            seats_total=100,
                            seats_available=0,  # SOLD OUT
                            is_active=False,    # SOLD OUT
                            show_on_frontend=True,  # Visible in UI (as SOLD OUT)
                        )
                        event_created += 1

            if event_created > 0:
                total_created += event_created
                # Recalculate min_price for the event
                event.recalculate_min_price()
                self.stdout.write(
                    self.style.SUCCESS(f'  Created {event_created} missing categories')
                )

            total_events += 1

        self.stdout.write('')
        if dry_run:
            self.stdout.write(self.style.WARNING(
                f'DRY RUN: Would create categories for {total_events} events'
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f'Processed {total_events} events, created {total_created} missing categories'
            ))
