"""
Webhook tracking model for idempotent event processing.

This model ensures that webhook events from payment providers (Stripe, etc.)
are processed exactly once, even under retries, race conditions, or redelivery.

IDEMPOTENCY GUARANTEE:
- Same event_id will NEVER cause side effects more than once
- Processing is atomic: either fully complete or fully rolled back
- Safe under concurrent webhook delivery

USAGE:
1. Check WebhookEvent.is_already_processed(provider, event_id) BEFORE any logic
2. Create WebhookEvent with status='received' at start
3. Execute business logic inside transaction
4. Update status to 'processed' or 'failed'
"""

from django.db import models
from django.utils import timezone


class WebhookEvent(models.Model):
    """
    Tracks webhook events for idempotent processing.

    Fields:
    - provider: Payment provider name (e.g., 'stripe')
    - provider_event_id: Unique event ID from provider (e.g., Stripe event.id)
    - event_type: Type of event (e.g., 'checkout.session.completed')
    - processing_status: Current processing state
    - raw_payload: Full JSON payload for debugging/audit
    - related_order_id: Optional link to Order for querying
    - error_message: Error details if processing failed
    - received_at: When webhook was first received
    - processed_at: When processing completed (success or failure)
    """

    PROVIDER_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('received', 'Received'),      # Event received, processing started
        ('processed', 'Processed'),    # Successfully processed
        ('failed', 'Failed'),          # Processing failed (will not retry)
        ('skipped', 'Skipped'),        # Skipped (e.g., unsupported event type)
    ]

    # Provider identification
    provider = models.CharField(
        max_length=50,
        choices=PROVIDER_CHOICES,
        default='stripe',
        db_index=True,
        help_text='Payment provider name'
    )
    provider_event_id = models.CharField(
        max_length=255,
        db_index=True,
        help_text='Unique event ID from provider (e.g., Stripe evt_...)'
    )
    event_type = models.CharField(
        max_length=100,
        help_text='Event type (e.g., checkout.session.completed)'
    )

    # Processing state
    processing_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='received',
        db_index=True,
        help_text='Current processing status'
    )

    # Payload storage (for debugging and audit)
    raw_payload = models.JSONField(
        default=dict,
        help_text='Full webhook payload as JSON'
    )

    # Optional relation to Order (for querying)
    related_order_id = models.UUIDField(
        null=True,
        blank=True,
        db_index=True,
        help_text='Related order ID if applicable'
    )

    # Error tracking
    error_message = models.TextField(
        blank=True,
        default='',
        help_text='Error message if processing failed'
    )

    # Timestamps
    received_at = models.DateTimeField(
        auto_now_add=True,
        help_text='When webhook was first received'
    )
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When processing completed'
    )

    class Meta:
        verbose_name = 'Webhook Event'
        verbose_name_plural = 'Webhook Events'
        ordering = ['-received_at']

        # CRITICAL: Unique constraint on (provider, provider_event_id)
        # This ensures idempotency at database level
        constraints = [
            models.UniqueConstraint(
                fields=['provider', 'provider_event_id'],
                name='unique_provider_event'
            )
        ]
        indexes = [
            models.Index(fields=['provider', 'processing_status']),
            models.Index(fields=['received_at']),
        ]

    def __str__(self):
        return f"{self.provider}:{self.provider_event_id} ({self.processing_status})"

    @classmethod
    def is_already_processed(cls, provider: str, event_id: str) -> bool:
        """
        Check if event was already successfully processed.

        CRITICAL: Call this BEFORE any business logic.

        Args:
            provider: Provider name (e.g., 'stripe')
            event_id: Provider's event ID

        Returns:
            True if event was already processed successfully
        """
        return cls.objects.filter(
            provider=provider,
            provider_event_id=event_id,
            processing_status='processed'
        ).exists()

    @classmethod
    def create_or_get_for_processing(cls, provider: str, event_id: str,
                                      event_type: str, payload: dict):
        """
        Create new event record or get existing one.

        Uses get_or_create with unique constraint to handle race conditions.

        Args:
            provider: Provider name
            event_id: Provider's event ID
            event_type: Event type
            payload: Raw webhook payload

        Returns:
            tuple: (WebhookEvent, created: bool)
        """
        return cls.objects.get_or_create(
            provider=provider,
            provider_event_id=event_id,
            defaults={
                'event_type': event_type,
                'raw_payload': payload,
                'processing_status': 'received',
            }
        )

    def mark_processed(self, order_id=None):
        """Mark event as successfully processed."""
        self.processing_status = 'processed'
        self.processed_at = timezone.now()
        if order_id:
            self.related_order_id = order_id
        self.save(update_fields=['processing_status', 'processed_at', 'related_order_id'])

    def mark_failed(self, error_message: str):
        """Mark event as failed."""
        self.processing_status = 'failed'
        self.processed_at = timezone.now()
        self.error_message = error_message
        self.save(update_fields=['processing_status', 'processed_at', 'error_message'])

    def mark_skipped(self, reason: str = ''):
        """Mark event as skipped (e.g., unsupported event type)."""
        self.processing_status = 'skipped'
        self.processed_at = timezone.now()
        self.error_message = reason
        self.save(update_fields=['processing_status', 'processed_at', 'error_message'])
