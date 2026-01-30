"""
Management command to seed the database with initial event data.
This creates all the events and categories matching the frontend data.
"""

from django.core.management.base import BaseCommand
from django.db import transaction
from events.models import Tournament, Event, Category
from datetime import date


class Command(BaseCommand):
    help = 'Seeds the database with initial tournament, event, and category data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            Category.objects.all().delete()
            Event.objects.all().delete()
            Tournament.objects.all().delete()
            self.stdout.write(self.style.SUCCESS('Existing data cleared.'))

        self.stdout.write('Creating tournaments...')
        
        # Create WTA Tournament
        wta_tournament, created = Tournament.objects.get_or_create(
            type='WTA',
            year=2026,
            defaults={
                'name': "Dubai Duty Free Tennis Championships - Women's Week",
                'description': "WTA 1000 Tournament - The premier women's tennis tournament in Dubai.",
                'venue': 'Dubai Duty Free Tennis Stadium',
            }
        )
        if created:
            self.stdout.write(f'  Created: {wta_tournament}')

        # Create ATP Tournament
        atp_tournament, created = Tournament.objects.get_or_create(
            type='ATP',
            year=2026,
            defaults={
                'name': "Dubai Duty Free Tennis Championships - Men's Week",
                'description': "ATP 500 Tournament - A prestigious men's tennis tournament.",
                'venue': 'Dubai Duty Free Tennis Stadium',
            }
        )
        if created:
            self.stdout.write(f'  Created: {atp_tournament}')

        self.stdout.write('Creating events...')

        # WTA Events data - min_price = Grandstand ($300)
        wta_events = [
            {'title': "Women's Day 1", 'date': '15', 'day': 'Sun', 'month': 'FEB',
             'time': '11:00 AM', 'event_date': date(2026, 2, 15), 'min_price': 300},
            {'title': "Women's Day 2", 'date': '16', 'day': 'Mon', 'month': 'FEB',
             'time': '11:00 AM', 'event_date': date(2026, 2, 16), 'min_price': 300},
            {'title': "Women's Day 3", 'date': '17', 'day': 'Tue', 'month': 'FEB',
             'time': '11:00 AM', 'event_date': date(2026, 2, 17), 'min_price': 300},
            {'title': "Women's Day 4", 'date': '18', 'day': 'Wed', 'month': 'FEB',
             'time': '11:00 AM', 'event_date': date(2026, 2, 18), 'min_price': 300},
            {'title': "Women's Quarter-Finals", 'date': '19', 'day': 'Thu', 'month': 'FEB',
             'time': '2:00 PM', 'event_date': date(2026, 2, 19), 'min_price': 300},
            {'title': "Women's Semi-Finals", 'date': '20', 'day': 'Fri', 'month': 'FEB',
             'time': '1:00 PM', 'event_date': date(2026, 2, 20), 'min_price': 300},
            {'title': "Women's Finals", 'date': '21', 'day': 'Sat', 'month': 'FEB',
             'time': '4:30 PM', 'event_date': date(2026, 2, 21), 'min_price': 300},
        ]

        # ATP Events data - min_price = Grandstand Upper ($300)
        atp_events = [
            {'title': "Men's Day 1", 'date': '23', 'day': 'Mon', 'month': 'FEB',
             'time': '2:00 PM', 'event_date': date(2026, 2, 23), 'min_price': 300},
            {'title': "Men's Day 2", 'date': '24', 'day': 'Tue', 'month': 'FEB',
             'time': '2:00 PM', 'event_date': date(2026, 2, 24), 'min_price': 300},
            {'title': "Men's Day 3", 'date': '25', 'day': 'Wed', 'month': 'FEB',
             'time': '2:00 PM', 'event_date': date(2026, 2, 25), 'min_price': 300},
            {'title': "Men's Quarter-Finals", 'date': '26', 'day': 'Thu', 'month': 'FEB',
             'time': '2:00 PM', 'event_date': date(2026, 2, 26), 'min_price': 300},
            {'title': "Men's Semi-Finals", 'date': '27', 'day': 'Fri', 'month': 'FEB',
             'time': '1:30 PM', 'event_date': date(2026, 2, 27), 'min_price': 300},
            {'title': "Men's Finals", 'date': '28', 'day': 'Sat', 'month': 'FEB',
             'time': '4:30 PM', 'event_date': date(2026, 2, 28), 'min_price': 300},
        ]

        # WTA (Women) categories - fixed prices
        wta_categories = [
            {'name': 'Grandstand', 'price': 300, 'color': '#86868b',
             'seats_total': 300, 'seats_available': 156, 'sort_order': 1},
            {'name': 'Prime B', 'price': 1000, 'color': '#3d6ef5',
             'seats_total': 100, 'seats_available': 42, 'sort_order': 2},
            {'name': 'Prime A', 'price': 1500, 'color': '#1e824c',
             'seats_total': 50, 'seats_available': 14, 'sort_order': 3},
        ]

        # ATP (Men) categories - fixed prices
        atp_categories = [
            {'name': 'Grandstand Upper', 'price': 300, 'color': '#86868b',
             'seats_total': 300, 'seats_available': 156, 'sort_order': 1},
            {'name': 'Grandstand Lower', 'price': 800, 'color': '#5d9cec',
             'seats_total': 200, 'seats_available': 88, 'sort_order': 2},
            {'name': 'Prime B', 'price': 1200, 'color': '#3d6ef5',
             'seats_total': 100, 'seats_available': 42, 'sort_order': 3},
            {'name': 'Prime A', 'price': 1800, 'color': '#1e824c',
             'seats_total': 50, 'seats_available': 14, 'sort_order': 4},
        ]

        def create_events_with_categories(tournament, events_data, categories):
            for event_data in events_data:
                event, created = Event.objects.get_or_create(
                    tournament=tournament,
                    title=event_data['title'],
                    event_date=event_data['event_date'],
                    defaults={
                        'date': event_data['date'],
                        'day': event_data['day'],
                        'month': event_data['month'],
                        'time': event_data['time'],
                        'min_price': event_data['min_price'],
                    }
                )
                if created:
                    self.stdout.write(f'  Created: {event}')

                    # Create categories for this event
                    for cat_data in categories:
                        Category.objects.create(
                            event=event,
                            name=cat_data['name'],
                            price=cat_data['price'],
                            color=cat_data['color'],
                            seats_total=cat_data['seats_total'],
                            seats_available=cat_data['seats_available'],
                            sort_order=cat_data['sort_order'],
                        )

        # Create WTA events and categories
        create_events_with_categories(wta_tournament, wta_events, wta_categories)

        # Create ATP events and categories
        create_events_with_categories(atp_tournament, atp_events, atp_categories)

        self.stdout.write(self.style.SUCCESS(
            f'Successfully seeded database with {Event.objects.count()} events '
            f'and {Category.objects.count()} categories.'
        ))
