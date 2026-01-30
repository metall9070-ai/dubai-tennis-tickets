"""
Data migration to create initial admin superuser.

This is the ONLY reliable way to create a superuser on Railway,
because migrations run automatically during deploy (via collectstatic/migrate).
"""
from django.db import migrations
from django.contrib.auth.hashers import make_password


def create_admin_superuser(apps, schema_editor):
    """Create admin superuser if it doesn't exist."""
    User = apps.get_model('users', 'CustomUser')

    if User.objects.filter(username='admin').exists():
        print("[MIGRATION] Admin user already exists - skipping")
        return

    # Create superuser with hashed password
    # apps.get_model() doesn't provide set_password(), so we use make_password()
    User.objects.create(
        username='admin',
        email='admin@dubaitennistickets.com',
        password=make_password('wt3652026!'),
        is_staff=True,
        is_superuser=True,
        is_active=True,
    )

    print("[MIGRATION] SUCCESS: Admin superuser created")


def remove_admin_superuser(apps, schema_editor):
    """Reverse migration - remove admin user."""
    User = apps.get_model('users', 'CustomUser')
    User.objects.filter(username='admin').delete()
    print("[MIGRATION] Admin user removed")


class Migration(migrations.Migration):
    
    dependencies = [
        ('users', '0001_initial'),
    ]
    
    operations = [
        migrations.RunPython(
            create_admin_superuser,
            reverse_code=remove_admin_superuser,
        ),
    ]
