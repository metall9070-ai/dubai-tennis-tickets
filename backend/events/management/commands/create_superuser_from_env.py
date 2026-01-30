import os
import sys
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Create superuser from environment variables'

    def handle(self, *args, **options):
        print("[SUPERUSER] Starting superuser creation...", flush=True)

        try:
            User = get_user_model()

            username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
            email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
            password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

            print(f"[SUPERUSER] Username: {username}", flush=True)
            print(f"[SUPERUSER] Email: {email}", flush=True)
            print(f"[SUPERUSER] Password set: {bool(password)}", flush=True)

            if not password:
                print("[SUPERUSER] ERROR: DJANGO_SUPERUSER_PASSWORD not set!", flush=True)
                return

            if User.objects.filter(username=username).exists():
                print(f"[SUPERUSER] User '{username}' already exists - skipping", flush=True)
                return

            User.objects.create_superuser(username=username, email=email, password=password)
            print(f"[SUPERUSER] SUCCESS: Superuser '{username}' created!", flush=True)

        except Exception as e:
            print(f"[SUPERUSER] EXCEPTION: {type(e).__name__}: {e}", flush=True)
            raise
