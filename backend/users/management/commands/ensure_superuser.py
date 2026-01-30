"""
Management command to ensure superuser exists.
Creates or updates admin user with password from environment.
"""
import os
from django.core.management.base import BaseCommand
from users.models import CustomUser


class Command(BaseCommand):
    help = 'Ensure superuser exists with correct password'

    def handle(self, *args, **options):
        username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')
        email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')

        try:
            user = CustomUser.objects.get(username=username)
            # User exists - update password
            user.set_password(password)
            user.is_staff = True
            user.is_superuser = True
            user.save()
            self.stdout.write(self.style.SUCCESS(
                f'Updated password for existing superuser: {username}'
            ))
        except CustomUser.DoesNotExist:
            # Create new superuser
            CustomUser.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(
                f'Created new superuser: {username}'
            ))
