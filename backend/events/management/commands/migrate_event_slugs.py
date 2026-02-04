"""
Management command to migrate Event slugs to theme-prefixed format.

Usage:
    python manage.py migrate_event_slugs --dry-run  # Preview changes
    python manage.py migrate_event_slugs            # Apply changes

Idempotent: Safe to run multiple times.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from events.models import Event


# Theme prefix for all current events (tennis)
THEME_PREFIX = "tennis-"


class Command(BaseCommand):
    help = "Migrate Event slugs to theme-prefixed format (tennis-*)"

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Preview changes without applying them",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]

        if dry_run:
            self.stdout.write(self.style.WARNING("DRY RUN - no changes will be made\n"))

        events = Event.objects.all()
        updated_count = 0
        skipped_count = 0

        changes = []

        for event in events:
            old_slug = event.slug

            # Idempotent: skip if already has theme prefix
            if old_slug.startswith(THEME_PREFIX):
                skipped_count += 1
                self.stdout.write(f"  SKIP: {old_slug} (already has prefix)")
                continue

            new_slug = f"{THEME_PREFIX}{old_slug}"
            changes.append((event, old_slug, new_slug))

        # Show planned changes
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("PLANNED CHANGES:")
        self.stdout.write("=" * 60)

        for event, old_slug, new_slug in changes:
            self.stdout.write(f"  {old_slug}")
            self.stdout.write(f"    -> {new_slug}")

        self.stdout.write("=" * 60 + "\n")

        if dry_run:
            self.stdout.write(
                self.style.WARNING(
                    f"DRY RUN: {len(changes)} events would be updated, {skipped_count} skipped"
                )
            )
            return

        # Apply changes in transaction
        with transaction.atomic():
            for event, old_slug, new_slug in changes:
                event.slug = new_slug
                event.save(update_fields=["slug", "updated_at"])
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f"  UPDATED: {old_slug} -> {new_slug}")
                )

        self.stdout.write("\n" + "=" * 60)
        self.stdout.write(
            self.style.SUCCESS(
                f"DONE: {updated_count} events updated, {skipped_count} skipped"
            )
        )
