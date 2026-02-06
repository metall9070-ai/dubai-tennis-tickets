"""
PaymentLog — доменный append-only журнал платёжных фактов.

НАЗНАЧЕНИЕ:
Это НЕ Sentry и НЕ monitoring. Это бизнес-журнал, который фиксирует
КАЖДОЕ входящее платёжное событие от провайдера (Stripe, PayPal, etc.).

ОТЛИЧИЕ ОТ WebhookEvent:
- WebhookEvent — техническая таблица для idempotency (предотвращение дубликатов)
- PaymentLog — доменный audit trail платёжных операций

ГАРАНТИИ:
- Append-only: записи никогда не удаляются и не модифицируются (кроме status/processed_at)
- Каждое событие фиксируется СРАЗУ после валидации подписи
- raw_payload сохраняется целиком для аудита и отладки

ИСПОЛЬЗОВАНИЕ:
1. СРАЗУ после валидации подписи webhook → PaymentLog.create_received()
2. После обработки → payment_log.mark_processed() / mark_ignored() / mark_error()
"""

from decimal import Decimal
from django.db import models
from django.utils import timezone


class PaymentLog(models.Model):
    """
    Append-only журнал платёжных событий.

    Каждая запись — факт получения события от платёжного провайдера.
    Записи создаются СРАЗУ после валидации подписи, ДО бизнес-логики.
    """

    PROVIDER_CHOICES = [
        ('stripe', 'Stripe'),
        ('paypal', 'PayPal'),
        ('other', 'Other'),
    ]

    STATUS_CHOICES = [
        ('received', 'Received'),    # Событие получено, обработка не начата
        ('processed', 'Processed'),  # Успешно обработано
        ('ignored', 'Ignored'),      # Событие проигнорировано (не поддерживается или дубликат)
        ('error', 'Error'),          # Ошибка при обработке
    ]

    # Provider identification
    provider = models.CharField(
        max_length=50,
        choices=PROVIDER_CHOICES,
        default='stripe',
        db_index=True,
        help_text='Payment provider (stripe, paypal, etc.)'
    )
    provider_event_id = models.CharField(
        max_length=255,
        unique=True,
        db_index=True,
        help_text='Unique event ID from provider (e.g., Stripe evt_...)'
    )
    event_type = models.CharField(
        max_length=100,
        db_index=True,
        help_text='Event type (e.g., checkout.session.completed)'
    )

    # Order reference (nullable - event may not have associated order)
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payment_logs',
        help_text='Associated order (if applicable)'
    )

    # Payment details
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Payment amount (in currency units, not cents)'
    )
    currency = models.CharField(
        max_length=3,
        blank=True,
        default='',
        help_text='ISO 4217 currency code'
    )

    # Raw payload (для аудита и отладки)
    raw_payload = models.JSONField(
        default=dict,
        help_text='Full webhook payload as received from provider'
    )

    # Processing status
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='received',
        db_index=True,
        help_text='Processing status'
    )
    status_reason = models.TextField(
        blank=True,
        default='',
        help_text='Reason for status (e.g., error message or ignore reason)'
    )

    # Timestamps
    received_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text='When event was received from provider'
    )
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='When processing completed'
    )

    class Meta:
        verbose_name = 'Payment Log'
        verbose_name_plural = 'Payment Logs'
        ordering = ['-received_at']
        indexes = [
            models.Index(fields=['provider', 'status']),
            models.Index(fields=['received_at']),
            models.Index(fields=['order', 'received_at']),
        ]

    def __str__(self):
        return f"{self.provider}:{self.provider_event_id} ({self.status})"

    # =========================================================================
    # CREATION METHOD (call IMMEDIATELY after signature validation)
    # =========================================================================

    @classmethod
    def create_received(
        cls,
        provider: str,
        event_id: str,
        event_type: str,
        raw_payload: dict,
        amount_cents: int = None,
        currency: str = '',
    ) -> 'PaymentLog':
        """
        Create a new payment log entry with status='received'.

        MUST be called IMMEDIATELY after webhook signature validation,
        BEFORE any business logic or idempotency checks.

        Args:
            provider: Provider name ('stripe', 'paypal', etc.)
            event_id: Provider's unique event ID
            event_type: Event type (e.g., 'checkout.session.completed')
            raw_payload: Full webhook payload (will be stored as-is)
            amount_cents: Payment amount in cents (optional, will be converted)
            currency: ISO 4217 currency code (optional)

        Returns:
            PaymentLog instance with status='received'
        """
        # Convert cents to decimal if provided
        amount = None
        if amount_cents is not None:
            amount = Decimal(amount_cents) / 100

        return cls.objects.create(
            provider=provider,
            provider_event_id=event_id,
            event_type=event_type,
            raw_payload=raw_payload,
            amount=amount,
            currency=currency.upper() if currency else '',
            status='received',
        )

    # =========================================================================
    # STATUS UPDATE METHODS (call after processing)
    # =========================================================================

    def mark_processed(self, order=None):
        """Mark event as successfully processed."""
        self.status = 'processed'
        self.processed_at = timezone.now()
        if order:
            self.order = order
        self.save(update_fields=['status', 'processed_at', 'order'])

    def mark_ignored(self, reason: str = ''):
        """Mark event as ignored (e.g., unsupported event type or duplicate)."""
        self.status = 'ignored'
        self.processed_at = timezone.now()
        self.status_reason = reason
        self.save(update_fields=['status', 'processed_at', 'status_reason'])

    def mark_error(self, error_message: str):
        """Mark event as failed with error."""
        self.status = 'error'
        self.processed_at = timezone.now()
        self.status_reason = error_message
        self.save(update_fields=['status', 'processed_at', 'status_reason'])

    def link_order(self, order):
        """Link payment log to an order (without changing status)."""
        self.order = order
        self.save(update_fields=['order'])
