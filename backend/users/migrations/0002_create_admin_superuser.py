"""
Data migration to create initial admin superuser.

This is the ONLY reliable way to create a superuser on Railway,
because migrations run automatically during deploy (via collectstatic/migrate).

After first login, IMMEDIATELY change the password via Django Admin UI.
"""
from django.db import migrations


def create_admin_superuser(apps, schema_editor):
    """Create admin superuser if it doesn't exist."""
    User = apps.get_model('users', 'CustomUser')
    
    if User.objects.filter(username='admin').exists():
        print("[MIGRATION] Admin user already exists - skipping")
        return
    
    # Create superuser with TEMPORARY password
    # MUST be changed immediately after first login!
    admin = User.objects.create(
        username='admin',
        email='admin@dubaitennistickets.com',
        is_staff=True,
        is_superuser=True,
        is_active=True,
    )
    admin.set_password('TempAdmin123!')
    admin.save()
    
    print("[MIGRATION] SUCCESS: Admin superuser created with temporary password")
    print("[MIGRATION] WARNING: Change password immediately after login!")


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
