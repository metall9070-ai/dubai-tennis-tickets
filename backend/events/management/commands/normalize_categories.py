"""
Management command to normalize seating categories for all events.
Applies standardized category structure based on tournament type (WTA/ATP).
"""

from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction

from events.models import Event, Category


# Category specifications by tournament type
CATEGORY_SPECS = {
    'WTA': [
        {'name': 'Grandstand', 'price': Decimal('300.00'), 'color': '#4a90d9', 'sort_order': 1},
        {'name': 'Prime B', 'price': Decimal('1000.00'), 'color': '#f5a623', 'sort_order': 2},
        {'name': 'Prime A', 'price': Decimal('2000.00'), 'color': '#7ed321', 'sort_order': 3},
    ],
    'ATP': [
        {'name': 'Grandstand Upper', 'price': Decimal('200.00'), 'color': '#4a90d9', 'sort_order': 1},
        {'name': 'Grandstand Lower', 'price': Decimal('400.00'), 'color': '#50e3c2', 'sort_order': 2},
        {'name': 'Prime B', 'price': Decimal('1500.00'), 'color': '#f5a623', 'sort_order': 3},
        {'name': 'Prime A', 'price': Decimal('3000.00'), 'color': '#7ed321', 'sort_order': 4},
    ],
}


class Command(BaseCommand):
    help = 'Normalize seating categories for all events based on tournament type'

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
        self.stdout.write('NORMALIZING SEATING CATEGORIES')
        self.stdout.write('=' * 60)
        
        events = Event.objects.select_related('tournament').prefetch_related('categories')
        
        total_created = 0
        total_updated = 0
        total_deleted = 0
        
        for event in events:
            created, updated, deleted = self.normalize_event(event, dry_run)
            total_created += created
            total_updated += updated
            total_deleted += deleted
        
        self.stdout.write('')
        self.stdout.write('=' * 60)
        self.stdout.write('SUMMARY')
        self.stdout.write('=' * 60)
        self.stdout.write(f'Events processed: {events.count()}')
        self.stdout.write(f'Categories created: {total_created}')
        self.stdout.write(f'Categories updated: {total_updated}')
        self.stdout.write(f'Categories deleted: {total_deleted}')
        
        if dry_run:
            self.stdout.write('')
            self.stdout.write(self.style.WARNING('DRY RUN - No actual changes were made'))
            self.stdout.write('Run without --dry-run to apply changes')

    @transaction.atomic
    def normalize_event(self, event, dry_run):
        """Normalize categories for a single event."""
        tournament_type = event.tournament.type
        specs = CATEGORY_SPECS.get(tournament_type)
        
        if not specs:
            self.stdout.write(
                self.style.WARNING(f'Unknown tournament type: {tournament_type} for {event.title}')
            )
            return 0, 0, 0
        
        self.stdout.write('')
        self.stdout.write(f'Event: {event.title} ({tournament_type})')
        self.stdout.write('-' * 40)
        
        created = 0
        updated = 0
        deleted = 0
        
        # Get required category names for this tournament type
        required_names = {spec['name'] for spec in specs}
        
        # Get existing categories
        existing_categories = {cat.name: cat for cat in event.categories.all()}
        
        # Process required categories
        for spec in specs:
            name = spec['name']
            
            if name in existing_categories:
                # Update existing category
                cat = existing_categories[name]
                changes = []
                
                if cat.price != spec['price']:
                    changes.append(f"price: ${cat.price} -> ${spec['price']}")
                    if not dry_run:
                        cat.price = spec['price']
                
                if not cat.is_active:
                    changes.append('is_active: False -> True')
                    if not dry_run:
                        cat.is_active = True
                
                if cat.sort_order != spec['sort_order']:
                    if not dry_run:
                        cat.sort_order = spec['sort_order']
                
                if changes:
                    if not dry_run:
                        cat.save()
                    self.stdout.write(f"  UPDATED: {name} ({', '.join(changes)})")
                    updated += 1
                else:
                    self.stdout.write(f"  OK: {name} (${spec['price']})")
            else:
                # Create new category
                if not dry_run:
                    Category.objects.create(
                        event=event,
                        name=name,
                        price=spec['price'],
                        color=spec['color'],
                        sort_order=spec['sort_order'],
                        seats_total=100,
                        seats_available=100,
                        is_active=True,
                    )
                self.stdout.write(self.style.SUCCESS(f"  CREATED: {name} (${spec['price']})"))
                created += 1
        
        # Handle obsolete categories (delete or deactivate if has orders)
        for name, cat in existing_categories.items():
            if name not in required_names:
                has_orders = cat.order_items.exists()
                if has_orders:
                    # Cannot delete - deactivate instead to preserve order history
                    if cat.is_active:
                        if not dry_run:
                            cat.is_active = False
                            cat.save(update_fields=['is_active', 'updated_at'])
                        self.stdout.write(self.style.WARNING(f'  DEACTIVATED: {name} (has orders, was ${cat.price})'))
                        deleted += 1
                    # Already inactive - skip (shown only in verbose mode)
                else:
                    # Safe to delete - no orders reference this category
                    if not dry_run:
                        cat.delete()
                    self.stdout.write(self.style.ERROR(f'  DELETED: {name} (was ${cat.price})'))
                    deleted += 1
        
        # Show resulting min_price
        if not dry_run:
            event.refresh_from_db()
            self.stdout.write(f'  -> min_price: ${event.min_price}')
        
        return created, updated, deleted
