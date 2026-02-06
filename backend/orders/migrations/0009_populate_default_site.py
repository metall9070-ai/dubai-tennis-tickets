# Data migration: Create default Site and link existing Orders

import uuid
from django.db import migrations


def create_default_site_and_link_orders(apps, schema_editor):
    """
    1. Create default Site with code='default'
    2. Link ALL existing Orders to default Site
    """
    Site = apps.get_model('orders', 'Site')
    Order = apps.get_model('orders', 'Order')

    # Create default site
    default_site, created = Site.objects.get_or_create(
        code='default',
        defaults={
            'id': uuid.uuid4(),
            'domain': 'dubaitennistickets.com',
            'status': 'active',
        }
    )

    # Link ALL existing orders to default site
    Order.objects.filter(site__isnull=True).update(site=default_site)


def reverse_migration(apps, schema_editor):
    """Reverse: unlink orders from default site (but don't delete site)."""
    Order = apps.get_model('orders', 'Order')
    Order.objects.all().update(site=None)


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0008_add_site_model'),
    ]

    operations = [
        migrations.RunPython(
            create_default_site_and_link_orders,
            reverse_code=reverse_migration,
        ),
    ]
