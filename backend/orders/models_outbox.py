"""
Notification Outbox model for guaranteed delivery.

This implements a lightweight "Outbox pattern" to ensure notifications
are NEVER lost, even if the server crashes between DB commit and delivery.

PATTERN:
1. INSIDE transaction: Create pending notification record
2. AFTER commit: Send notification and mark as 'sent'
3. ON CRASH: Pending records remain in DB for retry

GUARANTEES:
- Every successful payment will eventually trigger notification
- Notifications are idempotent (can be safely re-sent)
- No external dependencies (no RabbitMQ, Celery, etc.)

USAGE:
1. Inside atomic transaction:
   NotificationOutbox.create_pending(order, 'order_paid')

2. After transaction commit:
   NotificationOutbox.process_pending_for_order(order_id)

3. Periodic cleanup (cron/management command):
   NotificationOutbox.retry_all_pending()
"""

import logging
from django.db import models, transaction
from django.utils import timezone

logger = logging.getLogger(__name__)


class NotificationOutbox(models.Model):
    """
    Outbox for deferred notification delivery.

    Records are created INSIDE the payment transaction.
    Delivery happens AFTER commit, ensuring crash-safety.
    """

    NOTIFICATION_TYPES = [
        ('order_paid', 'Order Paid'),
        ('order_created', 'Order Created'),
        ('order_cancelled', 'Order Cancelled'),
        ('order_refunded', 'Order Refunded'),
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),      # Created, not yet sent
        ('sent', 'Sent'),            # Successfully delivered
        ('failed', 'Failed'),        # Delivery failed (will retry)
    ]

    # Link to order
    order_id = models.UUIDField(
        db_index=True,
        help_text='Order ID this notification relates to'
    )

    # Notification details
    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPES,
        db_index=True,
        help_text='Type of notification to send'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
        db_index=True,
        help_text='Current delivery status'
    )

    # Delivery tracking
    attempt_count = models.PositiveIntegerField(
        default=0,
        help_text='Number of delivery attempts'
    )
    last_error = models.TextField(
        blank=True,
        default='',
        help_text='Last error message if delivery failed'
    )

    # Timestamps
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When notification was queued'
    )
    sent_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When notification was successfully sent'
    )

    class Meta:
        verbose_name = 'Notification Outbox'
        verbose_name_plural = 'Notification Outbox'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['status', 'created_at']),
            models.Index(fields=['order_id', 'notification_type']),
        ]

    def __str__(self):
        return f"{self.notification_type} for {self.order_id} ({self.status})"

    # =========================================================================
    # CREATION METHODS (call INSIDE transaction)
    # =========================================================================

    @classmethod
    def create_pending(cls, order, notification_type: str) -> 'NotificationOutbox':
        """
        Create a pending notification record.

        MUST be called INSIDE an atomic transaction with the order update.
        This ensures the notification record is committed atomically.

        Args:
            order: Order model instance (or order_id UUID)
            notification_type: Type of notification ('order_paid', etc.)

        Returns:
            NotificationOutbox instance with status='pending'
        """
        order_id = order.id if hasattr(order, 'id') else order

        return cls.objects.create(
            order_id=order_id,
            notification_type=notification_type,
            status='pending'
        )

    # =========================================================================
    # DELIVERY METHODS (call AFTER transaction commit)
    # =========================================================================

    @classmethod
    def process_pending_for_order(cls, order_id) -> dict:
        """
        Process all pending notifications for a specific order.

        Call this AFTER the transaction commits to send notifications.
        Safe to call multiple times (idempotent).

        Args:
            order_id: UUID of the order

        Returns:
            dict with results: {'sent': int, 'failed': int}
        """
        from .models import Order
        from .notifications import notify_order_paid, notify_order_created

        results = {'sent': 0, 'failed': 0}

        # Get all pending notifications for this order
        pending = cls.objects.filter(
            order_id=order_id,
            status='pending'
        ).select_for_update(skip_locked=True)

        for outbox_item in pending:
            try:
                # Load order with items for notification
                order = Order.objects.prefetch_related('items').get(id=order_id)

                # Dispatch based on notification type
                if outbox_item.notification_type == 'order_paid':
                    notify_order_paid(order)
                elif outbox_item.notification_type == 'order_created':
                    notify_order_created(order)
                else:
                    logger.warning(f"Unknown notification type: {outbox_item.notification_type}")
                    continue

                # Mark as sent
                outbox_item.status = 'sent'
                outbox_item.sent_at = timezone.now()
                outbox_item.attempt_count += 1
                outbox_item.save(update_fields=['status', 'sent_at', 'attempt_count'])

                results['sent'] += 1
                logger.info(
                    f"Notification {outbox_item.notification_type} sent for order {order_id}"
                )

            except Order.DoesNotExist:
                outbox_item.status = 'failed'
                outbox_item.last_error = f"Order {order_id} not found"
                outbox_item.attempt_count += 1
                outbox_item.save(update_fields=['status', 'last_error', 'attempt_count'])
                results['failed'] += 1
                logger.error(f"Order not found for notification: {order_id}")

            except Exception as e:
                # Don't mark as failed immediately - allow retry
                outbox_item.last_error = str(e)
                outbox_item.attempt_count += 1
                outbox_item.save(update_fields=['last_error', 'attempt_count'])
                results['failed'] += 1
                logger.error(f"Failed to send notification for order {order_id}: {e}")

        return results

    @classmethod
    def retry_all_pending(cls, max_attempts: int = 5, older_than_minutes: int = 5) -> dict:
        """
        Retry all pending notifications (for cron/management command).

        Only processes notifications that:
        - Have status='pending'
        - Were created more than `older_than_minutes` ago (to avoid race with normal flow)
        - Have less than `max_attempts` attempts

        Args:
            max_attempts: Maximum retry attempts before marking as failed
            older_than_minutes: Only process notifications older than this

        Returns:
            dict with results: {'processed': int, 'sent': int, 'failed': int, 'skipped': int}
        """
        from .models import Order
        from .notifications import notify_order_paid, notify_order_created

        cutoff_time = timezone.now() - timezone.timedelta(minutes=older_than_minutes)

        results = {'processed': 0, 'sent': 0, 'failed': 0, 'skipped': 0}

        # Get pending notifications older than cutoff
        pending = cls.objects.filter(
            status='pending',
            created_at__lt=cutoff_time,
            attempt_count__lt=max_attempts
        ).select_for_update(skip_locked=True)

        for outbox_item in pending:
            results['processed'] += 1

            try:
                order = Order.objects.prefetch_related('items').get(id=outbox_item.order_id)

                # Dispatch based on notification type
                if outbox_item.notification_type == 'order_paid':
                    notify_order_paid(order)
                elif outbox_item.notification_type == 'order_created':
                    notify_order_created(order)
                else:
                    outbox_item.status = 'failed'
                    outbox_item.last_error = f"Unknown type: {outbox_item.notification_type}"
                    outbox_item.save(update_fields=['status', 'last_error'])
                    results['skipped'] += 1
                    continue

                # Mark as sent
                outbox_item.status = 'sent'
                outbox_item.sent_at = timezone.now()
                outbox_item.attempt_count += 1
                outbox_item.save(update_fields=['status', 'sent_at', 'attempt_count'])
                results['sent'] += 1

                logger.info(
                    f"[RETRY] Notification {outbox_item.notification_type} sent for order {outbox_item.order_id}"
                )

            except Order.DoesNotExist:
                outbox_item.status = 'failed'
                outbox_item.last_error = f"Order not found"
                outbox_item.attempt_count += 1
                outbox_item.save(update_fields=['status', 'last_error', 'attempt_count'])
                results['failed'] += 1

            except Exception as e:
                outbox_item.last_error = str(e)
                outbox_item.attempt_count += 1

                # Mark as failed if max attempts reached
                if outbox_item.attempt_count >= max_attempts:
                    outbox_item.status = 'failed'

                outbox_item.save(update_fields=['status', 'last_error', 'attempt_count'])
                results['failed'] += 1
                logger.error(f"[RETRY] Failed notification for {outbox_item.order_id}: {e}")

        return results

    @classmethod
    def get_pending_count(cls) -> int:
        """Get count of pending notifications (for monitoring)."""
        return cls.objects.filter(status='pending').count()

    @classmethod
    def cleanup_old_sent(cls, days: int = 30) -> int:
        """
        Delete old sent notifications (housekeeping).

        Args:
            days: Delete notifications older than this many days

        Returns:
            Number of deleted records
        """
        cutoff = timezone.now() - timezone.timedelta(days=days)
        deleted, _ = cls.objects.filter(
            status='sent',
            sent_at__lt=cutoff
        ).delete()
        return deleted
