"""
Management command to ensure superuser exists.
Resets password for ALL superusers to the one from environment.
"""
import os
from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Ensure superuser exists with correct password'

    def handle(self, *args, **options):
        from django.conf import settings

        # Debug: show database info
        db = settings.DATABASES['default']
        self.stdout.write(f"DATABASE ENGINE: {db.get('ENGINE')}")
        self.stdout.write(f"DATABASE HOST: {db.get('HOST', 'N/A')}")
        self.stdout.write(f"DATABASE NAME: {db.get('NAME')}")

        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', '')

        # Debug: show password info (not the actual password)
        self.stdout.write(f'Password from env: length={len(password)}, empty={not password}')

        if not password:
            password = 'TennisAdmin2026!'
            self.stdout.write(self.style.WARNING(
                f'DJANGO_SUPERUSER_PASSWORD not set! Using default: {password}'
            ))

        # Show all existing users
        all_users = CustomUser.objects.all()
        self.stdout.write(f'Total users in database: {all_users.count()}')

        for u in all_users:
            self.stdout.write(f'  - {u.username} (staff={u.is_staff}, superuser={u.is_superuser})')

        # Find all superusers and reset their passwords
        superusers = CustomUser.objects.filter(is_superuser=True)

        if superusers.exists():
            for user in superusers:
                user.set_password(password)
                user.save()
                # Verify password works
                user.refresh_from_db()
                if user.check_password(password):
                    self.stdout.write(self.style.SUCCESS(
                        f'Reset password for superuser: {user.username} - VERIFIED OK'
                    ))
                else:
                    self.stdout.write(self.style.ERROR(
                        f'ERROR: Password verification failed for {user.username}!'
                    ))
        else:
            # No superusers - create one
            username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
            email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
            user = CustomUser.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            # Verify password works
            if user.check_password(password):
                self.stdout.write(self.style.SUCCESS(
                    f'Created new superuser: {username} - VERIFIED OK'
                ))
            else:
                self.stdout.write(self.style.ERROR(
                    f'ERROR: Password verification failed for new user {username}!'
                ))

        self.stdout.write(self.style.SUCCESS(
            f'Done! Login with password from DJANGO_SUPERUSER_PASSWORD'
        ))
