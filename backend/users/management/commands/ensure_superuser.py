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
        password = os.getenv('DJANGO_SUPERUSER_PASSWORD', 'admin123')

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
                self.stdout.write(self.style.SUCCESS(
                    f'Reset password for superuser: {user.username}'
                ))
        else:
            # No superusers - create one
            username = os.getenv('DJANGO_SUPERUSER_USERNAME', 'admin')
            email = os.getenv('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
            CustomUser.objects.create_superuser(
                username=username,
                email=email,
                password=password
            )
            self.stdout.write(self.style.SUCCESS(
                f'Created new superuser: {username}'
            ))

        self.stdout.write(self.style.SUCCESS(
            f'Done! Login with password from DJANGO_SUPERUSER_PASSWORD'
        ))
