"""
Management command to retry pending notifications.

This command processes all pending notifications in the outbox
that haven't been delivered due to crashes or failures.

USAGE:
    # Retry all pending notifications older than 5 minutes
    python manage.py retry_notifications

    # Retry with custom settings
    python manage.py retry_notifications --max-attempts=3 --older-than=10

    # Cleanup old sent notifications (30 days default)
    python manage.py retry_notifications --cleanup

CRON SETUP (recommended):
    # Run every 5 minutes
    */5 * * * * cd /app && python manage.py retry_notifications >> /var/log/notifications.log 2>&1

    # Cleanup weekly
    0 0 * * 0 cd /app && python manage.py retry_notifications --cleanup --cleanup-days=30
"""

from django.core.management.base import BaseCommand
from orders.models_outbox import NotificationOutbox


class Command(BaseCommand):
    help = 'Retry pending notifications and optionally cleanup old sent notifications'

    def add_arguments(self, parser):
        parser.add_argument(
            '--max-attempts',
            type=int,
            default=5,
            help='Maximum retry attempts before marking as failed (default: 5)'
        )
        parser.add_argument(
            '--older-than',
            type=int,
            default=5,
            help='Only process notifications older than N minutes (default: 5)'
        )
        parser.add_argument(
            '--cleanup',
            action='store_true',
            help='Also cleanup old sent notifications'
        )
        parser.add_argument(
            '--cleanup-days',
            type=int,
            default=30,
            help='Delete sent notifications older than N days (default: 30)'
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be done without actually doing it'
        )

    def handle(self, *args, **options):
        max_attempts = options['max_attempts']
        older_than = options['older_than']
        cleanup = options['cleanup']
        cleanup_days = options['cleanup_days']
        dry_run = options['dry_run']

        # Show pending count
        pending_count = NotificationOutbox.get_pending_count()
        self.stdout.write(f"Pending notifications: {pending_count}")

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN - no changes will be made"))
            return

        # Retry pending notifications
        if pending_count > 0:
            self.stdout.write(f"Retrying notifications (max_attempts={max_attempts}, older_than={older_than}m)...")

            results = NotificationOutbox.retry_all_pending(
                max_attempts=max_attempts,
                older_than_minutes=older_than
            )

            self.stdout.write(
                f"Processed: {results['processed']}, "
                f"Sent: {results['sent']}, "
                f"Failed: {results['failed']}, "
                f"Skipped: {results['skipped']}"
            )

            if results['sent'] > 0:
                self.stdout.write(self.style.SUCCESS(f"Successfully sent {results['sent']} notifications"))

            if results['failed'] > 0:
                self.stdout.write(self.style.WARNING(f"Failed to send {results['failed']} notifications"))

        # Cleanup old sent notifications
        if cleanup:
            self.stdout.write(f"Cleaning up sent notifications older than {cleanup_days} days...")
            deleted = NotificationOutbox.cleanup_old_sent(days=cleanup_days)
            self.stdout.write(self.style.SUCCESS(f"Deleted {deleted} old sent notifications"))

        self.stdout.write(self.style.SUCCESS("Done"))
