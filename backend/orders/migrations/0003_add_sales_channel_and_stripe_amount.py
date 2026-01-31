# Generated manually for currency architecture (Variant 1)

from django.db import migrations, models
import django.db.models.deletion
import django.core.validators


def create_default_sales_channel(apps, schema_editor):
    """Create the default sales channel for dubaitennistickets.com"""
    SalesChannel = apps.get_model('orders', 'SalesChannel')
    SalesChannel.objects.get_or_create(
        domain='dubaitennistickets.com',
        defaults={
            'name': 'Dubai Tennis Tickets',
            'currency': 'USD',
            'is_active': True,
        }
    )


def calculate_stripe_amount_for_existing_orders(apps, schema_editor):
    """
    Backfill stripe_amount_cents for existing orders.
    Uses the formula: total_amount * 100 (for USD and other standard currencies)
    """
    Order = apps.get_model('orders', 'Order')
    for order in Order.objects.filter(stripe_amount_cents=0):
        # Standard currencies multiply by 100
        order.stripe_amount_cents = int(order.total_amount * 100)
        order.save(update_fields=['stripe_amount_cents'])


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_add_currency_field'),
    ]

    operations = [
        # 1. Create SalesChannel model
        migrations.CreateModel(
            name='SalesChannel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(help_text='Human-readable name (e.g., "Dubai Tennis Tickets")', max_length=100, unique=True)),
                ('domain', models.CharField(help_text='Domain name (e.g., "dubaitennistickets.com")', max_length=255, unique=True)),
                ('currency', models.CharField(
                    choices=[('USD', 'US Dollar'), ('EUR', 'Euro'), ('GBP', 'British Pound'), ('AED', 'UAE Dirham')],
                    default='USD',
                    help_text='ISO 4217 currency code. FROZEN for all orders from this channel.',
                    max_length=3,
                    validators=[django.core.validators.RegexValidator('^[A-Z]{3}$', 'Must be 3-letter ISO 4217 code')]
                )),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Sales Channel',
                'verbose_name_plural': 'Sales Channels',
            },
        ),

        # 2. Add stripe_amount_cents to Order
        migrations.AddField(
            model_name='order',
            name='stripe_amount_cents',
            field=models.PositiveIntegerField(
                default=0,
                help_text='FROZEN: Amount in smallest currency unit (cents). Used for Stripe validation.'
            ),
        ),

        # 3. Add sales_channel FK to Order (nullable for backwards compatibility)
        migrations.AddField(
            model_name='order',
            name='sales_channel',
            field=models.ForeignKey(
                blank=True,
                help_text='Sales channel that originated this order',
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                related_name='orders',
                to='orders.saleschannel'
            ),
        ),

        # 4. Update currency field with validator
        migrations.AlterField(
            model_name='order',
            name='currency',
            field=models.CharField(
                default='USD',
                help_text='FROZEN: ISO 4217 currency code. Set from SalesChannel at creation.',
                max_length=3,
                validators=[django.core.validators.RegexValidator('^[A-Z]{3}$', 'Must be 3-letter ISO 4217 code')]
            ),
        ),

        # 5. Create default sales channel
        migrations.RunPython(create_default_sales_channel, migrations.RunPython.noop),

        # 6. Backfill stripe_amount_cents for existing orders
        migrations.RunPython(calculate_stripe_amount_for_existing_orders, migrations.RunPython.noop),
    ]
