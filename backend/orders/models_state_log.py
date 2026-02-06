"""
OrderStateLog — обязательный append-only лог изменений статуса заказа.

ЖЁСТКОЕ ПРАВИЛО:
Статус Order НИКОГДА не меняется без записи в OrderStateLog.

Это обеспечивается через единый метод Order.change_status(),
который атомарно:
1. Фиксирует from_status
2. Создаёт запись в OrderStateLog
3. Обновляет Order.status

ГАРАНТИИ:
- Append-only: записи никогда не удаляются и не модифицируются
- Атомарность: статус и лог создаются в одной транзакции
- Идемпотентность: если статус не меняется, лог не создаётся
- Полный audit trail: каждый переход статуса задокументирован
"""

from django.db import models


class OrderStateLog(models.Model):
    """
    Append-only лог изменений статуса заказа.

    Каждая запись — факт перехода заказа из одного статуса в другой.
    Создаётся ТОЛЬКО через Order.change_status().
    """

    SOURCE_CHOICES = [
        ('api', 'API'),           # Frontend checkout, REST API
        ('webhook', 'Webhook'),   # Stripe/PayPal webhook
        ('admin', 'Admin'),       # Django admin actions
        ('system', 'System'),     # Background jobs, migrations
    ]

    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.CASCADE,
        related_name='state_logs',
        db_index=True,
        help_text='Order whose status changed'
    )
    from_status = models.CharField(
        max_length=20,
        db_index=True,
        help_text='Status before the change'
    )
    to_status = models.CharField(
        max_length=20,
        db_index=True,
        help_text='Status after the change'
    )
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        db_index=True,
        help_text='What triggered the status change'
    )
    note = models.TextField(
        blank=True,
        default='',
        help_text='Optional note (e.g., reason for cancellation, payment_intent_id)'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text='When the status change occurred'
    )

    class Meta:
        verbose_name = 'Order State Log'
        verbose_name_plural = 'Order State Logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order', 'created_at']),
            models.Index(fields=['from_status', 'to_status']),
        ]

    def __str__(self):
        return f"{self.order.order_number}: {self.from_status} → {self.to_status} ({self.source})"

    # =========================================================================
    # APPEND-ONLY PROTECTION
    # =========================================================================

    def save(self, *args, **kwargs):
        """
        Prevent modification of existing records.
        OrderStateLog is append-only.
        """
        if self.pk:
            raise ValueError("OrderStateLog records cannot be modified. They are append-only.")
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """
        Prevent deletion of records.
        OrderStateLog is append-only.
        """
        raise ValueError("OrderStateLog records cannot be deleted. They are append-only.")

    # =========================================================================
    # CREATION METHOD (internal, called by Order.change_status)
    # =========================================================================

    @classmethod
    def create_log(
        cls,
        order,
        from_status: str,
        to_status: str,
        source: str,
        note: str = ''
    ) -> 'OrderStateLog':
        """
        Create a new state log entry.

        This method is internal - always call Order.change_status() instead.

        Args:
            order: Order instance
            from_status: Status before change
            to_status: Status after change
            source: What triggered the change (api, webhook, admin, system)
            note: Optional additional context

        Returns:
            OrderStateLog instance
        """
        return cls.objects.create(
            order=order,
            from_status=from_status,
            to_status=to_status,
            source=source,
            note=note,
        )
