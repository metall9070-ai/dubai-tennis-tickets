"""
Site — источник заказа в мультисайтовой архитектуре.

НАЗНАЧЕНИЕ:
Site определяет ТОЛЬКО источник заказа (какой сайт/канал сгенерировал заказ).
Site НЕ участвует в: pricing, availability, order-flow, SEO.

ИНВАРИАНТЫ:
- code уникален и НЕИЗМЕНЯЕМ после создания
- status=disabled запрещает НОВЫЕ заказы, НЕ влияет на существующие
- Order.site записывается ТОЛЬКО при создании, изменение запрещено

ОТЛИЧИЕ ОТ SalesChannel:
- SalesChannel — определяет currency и бизнес-правила
- Site — только идентификатор источника заказа
"""

import uuid
from django.db import models
from django.core.exceptions import ValidationError


class Site(models.Model):
    """
    Источник заказа (сайт/канал).

    Примеры:
    - code="dubaitennistickets", domain="dubaitennistickets.com"
    - code="partner_a", domain="partner-a.com"
    """

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('disabled', 'Disabled'),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    code = models.CharField(
        max_length=50,
        unique=True,
        db_index=True,
        help_text='Unique site code (immutable after creation). Example: "dubaitennistickets"'
    )
    domain = models.CharField(
        max_length=255,
        help_text='Site domain. Example: "dubaitennistickets.com"'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active',
        db_index=True,
        help_text='active=accepts orders, disabled=blocks new orders'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Site'
        verbose_name_plural = 'Sites'
        ordering = ['code']

    def __str__(self):
        return f"{self.code} ({self.status})"

    # =========================================================================
    # IMMUTABILITY PROTECTION: code cannot change after creation
    # =========================================================================

    def clean(self):
        """Validate that code is not changed on existing records."""
        if self.pk:
            try:
                original = Site.objects.get(pk=self.pk)
                if original.code != self.code:
                    raise ValidationError({
                        'code': 'Site code cannot be changed after creation.'
                    })
            except Site.DoesNotExist:
                pass

    def save(self, *args, **kwargs):
        """Enforce code immutability."""
        if self.pk:
            # Existing record — check code hasn't changed
            try:
                original = Site.objects.get(pk=self.pk)
                if original.code != self.code:
                    raise ValueError("Site code cannot be changed after creation.")
            except Site.DoesNotExist:
                pass
        self.full_clean()
        super().save(*args, **kwargs)

    # =========================================================================
    # STATUS CHECKS
    # =========================================================================

    @property
    def is_active(self) -> bool:
        """Check if site accepts new orders."""
        return self.status == 'active'

    def can_create_order(self) -> bool:
        """Check if new orders can be created for this site."""
        return self.status == 'active'

    # =========================================================================
    # CLASS METHODS
    # =========================================================================

    @classmethod
    def get_by_code(cls, code: str) -> 'Site':
        """
        Get site by code.

        Args:
            code: Site code

        Returns:
            Site instance

        Raises:
            Site.DoesNotExist: If site not found
        """
        return cls.objects.get(code=code)

    @classmethod
    def get_default(cls) -> 'Site':
        """
        Get the default site.
        Creates one if it doesn't exist.
        """
        site, created = cls.objects.get_or_create(
            code='default',
            defaults={
                'domain': 'dubaitennistickets.com',
                'status': 'active',
            }
        )
        return site
