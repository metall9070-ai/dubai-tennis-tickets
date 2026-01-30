import os
import sys
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


def log(msg):
    """Print to both stdout and stderr for Railway logging"""
    print(msg, flush=True)
    print(msg, file=sys.stderr, flush=True)


class Command(BaseCommand):
    help = 'Create superuser from environment variables'

    def handle(self, *args, **options):
        log("[SUPERUSER] ====== Starting superuser creation ======")

        try:
            User = get_user_model()

            username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
            email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
            password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

            log(f"[SUPERUSER] Username: {username}")
            log(f"[SUPERUSER] Email: {email}")
            log(f"[SUPERUSER] Password set: {bool(password)}")

            if not password:
                log("[SUPERUSER] ERROR: DJANGO_SUPERUSER_PASSWORD not set!")
                return

            if User.objects.filter(username=username).exists():
                log(f"[SUPERUSER] User '{username}' already exists - skipping")
                return

            User.objects.create_superuser(username=username, email=email, password=password)
            log(f"[SUPERUSER] SUCCESS: Superuser '{username}' created!")

        except Exception as e:
            log(f"[SUPERUSER] EXCEPTION: {type(e).__name__}: {e}")
            raise
