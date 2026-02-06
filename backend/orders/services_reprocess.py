"""
Order Reprocess Service — безопасная синхронизация статуса заказа с Stripe.

НАЗНАЧЕНИЕ:
Ручной reprocess заказа для случаев когда webhook не дошёл или был потерян.
Сверяет текущий статус Order с реальным состоянием платежа в Stripe API.

ГАРАНТИИ БЕЗОПАСНОСТИ:
❌ НЕ создаёт новый PaymentIntent
❌ НЕ инициирует оплату
❌ НЕ меняет статус напрямую (только через change_status)
❌ НЕ трогает availability / seats
✅ Только READ из Stripe API
✅ Идемпотентен — безопасен при повторных вызовах
✅ Полный audit trail через OrderStateLog

ИСПОЛЬЗОВАНИЕ:
- Django Admin action
- Management command
- НЕ из webhook (там своя логика)
- НЕ из frontend (опасно)
"""

import logging
import stripe
from typing import Optional
from dataclasses import dataclass
from enum import Enum

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .models import Order

logger = logging.getLogger(__name__)

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class ReprocessAction(Enum):
    """Результат reprocess операции."""
    NOOP = "noop"                    # Статус уже синхронизирован
    STATUS_SYNCED = "status_synced"  # Статус обновлён
    CANNOT_REPROCESS = "cannot_reprocess"  # Нет Stripe reference
    STRIPE_ERROR = "stripe_error"    # Ошибка Stripe API
    NOT_FOUND = "not_found"          # Заказ не найден


@dataclass
class ReprocessResult:
    """Результат reprocess операции."""
    order_id: str
    action: ReprocessAction
    before_status: Optional[str] = None
    after_status: Optional[str] = None
    stripe_status: Optional[str] = None
    stripe_payment_intent: Optional[str] = None
    message: Optional[str] = None

    def to_dict(self) -> dict:
        """Сериализация для API/logging."""
        result = {
            "order_id": str(self.order_id),
            "action": self.action.value,
        }
        if self.before_status:
            result["before_status"] = self.before_status
        if self.after_status:
            result["after_status"] = self.after_status
        if self.stripe_status:
            result["stripe_status"] = self.stripe_status
        if self.stripe_payment_intent:
            result["stripe_payment_intent"] = self.stripe_payment_intent
        if self.message:
            result["message"] = self.message
        return result


def _normalize_stripe_status(stripe_payment_status: str, payment_intent_status: str) -> str:
    """
    Нормализация статуса Stripe → CRM.

    Stripe PaymentIntent statuses:
    - requires_payment_method: Ожидает способ оплаты
    - requires_confirmation: Ожидает подтверждения
    - requires_action: Требует действия (3DS)
    - processing: Обрабатывается
    - requires_capture: Ожидает capture (для manual capture)
    - canceled: Отменён
    - succeeded: Успешно оплачен

    Returns:
        CRM status: 'pending', 'paid', or 'cancelled'
    """
    # Успешная оплата
    if payment_intent_status == 'succeeded':
        return 'paid'

    # Отменён явно
    if payment_intent_status == 'canceled':
        return 'cancelled'

    # Всё остальное — pending (ожидаем оплаты)
    # requires_payment_method, requires_confirmation, requires_action, processing
    return 'pending'


def reprocess_order(order_id: str) -> ReprocessResult:
    """
    Безопасный reprocess заказа — синхронизация статуса с Stripe.

    БЕЗОПАСНОСТЬ:
    - Только READ из Stripe API
    - Не создаёт PaymentIntent
    - Не инициирует оплату
    - Идемпотентен

    Args:
        order_id: UUID заказа

    Returns:
        ReprocessResult с деталями операции
    """
    # 1. Загрузить Order
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        logger.warning(f"Reprocess: Order {order_id} not found")
        return ReprocessResult(
            order_id=order_id,
            action=ReprocessAction.NOT_FOUND,
            message="Order not found"
        )

    logger.info(f"Reprocess: Starting for order {order.order_number} (status={order.status})")

    # 2. Проверить наличие Stripe reference
    if not order.payment_intent_id:
        logger.warning(f"Reprocess: Order {order.order_number} has no payment_intent_id")
        return ReprocessResult(
            order_id=str(order.id),
            action=ReprocessAction.CANNOT_REPROCESS,
            before_status=order.status,
            message="No Stripe payment_intent_id. Order was never sent to Stripe checkout."
        )

    # 3. Запросить Stripe API (ТОЛЬКО READ)
    try:
        payment_intent = stripe.PaymentIntent.retrieve(order.payment_intent_id)
    except stripe.error.InvalidRequestError as e:
        # PaymentIntent не найден (404)
        logger.error(f"Reprocess: PaymentIntent {order.payment_intent_id} not found: {e}")
        return ReprocessResult(
            order_id=str(order.id),
            action=ReprocessAction.STRIPE_ERROR,
            before_status=order.status,
            stripe_payment_intent=order.payment_intent_id,
            message=f"PaymentIntent not found in Stripe: {e.user_message}"
        )
    except stripe.error.AuthenticationError as e:
        logger.error(f"Reprocess: Stripe authentication error: {e}")
        return ReprocessResult(
            order_id=str(order.id),
            action=ReprocessAction.STRIPE_ERROR,
            before_status=order.status,
            message=f"Stripe authentication error: {e.user_message}"
        )
    except stripe.error.APIConnectionError as e:
        logger.error(f"Reprocess: Stripe connection error: {e}")
        return ReprocessResult(
            order_id=str(order.id),
            action=ReprocessAction.STRIPE_ERROR,
            before_status=order.status,
            message=f"Stripe connection error: {str(e)}"
        )
    except stripe.error.StripeError as e:
        logger.error(f"Reprocess: Stripe error: {e}")
        return ReprocessResult(
            order_id=str(order.id),
            action=ReprocessAction.STRIPE_ERROR,
            before_status=order.status,
            message=f"Stripe error: {str(e)}"
        )

    # 4. Нормализовать Stripe статус → CRM статус
    stripe_status = payment_intent.status
    crm_target_status = _normalize_stripe_status(
        stripe_payment_status=getattr(payment_intent, 'payment_status', ''),
        payment_intent_status=stripe_status
    )

    logger.info(
        f"Reprocess: Order {order.order_number} - "
        f"CRM status={order.status}, Stripe status={stripe_status} → target={crm_target_status}"
    )

    # 5. Сравнить и обновить если нужно
    if order.status == crm_target_status:
        # Статус уже синхронизирован
        logger.info(f"Reprocess: Order {order.order_number} already in sync (status={order.status})")
        return ReprocessResult(
            order_id=str(order.id),
            action=ReprocessAction.NOOP,
            before_status=order.status,
            after_status=order.status,
            stripe_status=stripe_status,
            stripe_payment_intent=order.payment_intent_id,
            message="Status already synchronized"
        )

    # 6. Обновить статус через change_status()
    before_status = order.status

    with transaction.atomic():
        # Блокируем заказ для избежания race conditions
        order = Order.objects.select_for_update().get(id=order_id)

        # Повторная проверка после блокировки (double-check)
        if order.status == crm_target_status:
            return ReprocessResult(
                order_id=str(order.id),
                action=ReprocessAction.NOOP,
                before_status=order.status,
                after_status=order.status,
                stripe_status=stripe_status,
                stripe_payment_intent=order.payment_intent_id,
                message="Status already synchronized (after lock)"
            )

        # Дополнительные поля для paid статуса
        update_fields = []
        if crm_target_status == 'paid' and not order.paid_at:
            order.paid_at = timezone.now()
            update_fields.append('paid_at')

        # MANDATORY: Используем change_status() для audit trail
        status_changed = order.change_status(
            to_status=crm_target_status,
            source='system',
            note=f"reprocess via stripe sync: pi={order.payment_intent_id}, stripe_status={stripe_status}",
            update_fields=update_fields if update_fields else None
        )

        if not status_changed:
            # Shouldn't happen after our checks, but handle gracefully
            return ReprocessResult(
                order_id=str(order.id),
                action=ReprocessAction.NOOP,
                before_status=before_status,
                after_status=order.status,
                stripe_status=stripe_status,
                stripe_payment_intent=order.payment_intent_id,
                message="Status unchanged (idempotent)"
            )

    logger.info(
        f"Reprocess: Order {order.order_number} status synced: "
        f"{before_status} → {crm_target_status}"
    )

    return ReprocessResult(
        order_id=str(order.id),
        action=ReprocessAction.STATUS_SYNCED,
        before_status=before_status,
        after_status=crm_target_status,
        stripe_status=stripe_status,
        stripe_payment_intent=order.payment_intent_id,
        message=f"Status synchronized from Stripe"
    )


def reprocess_orders_batch(order_ids: list) -> list:
    """
    Batch reprocess нескольких заказов.

    Args:
        order_ids: Список UUID заказов

    Returns:
        Список ReprocessResult
    """
    results = []
    for order_id in order_ids:
        try:
            result = reprocess_order(str(order_id))
            results.append(result)
        except Exception as e:
            logger.exception(f"Reprocess batch error for order {order_id}: {e}")
            results.append(ReprocessResult(
                order_id=str(order_id),
                action=ReprocessAction.STRIPE_ERROR,
                message=f"Unexpected error: {str(e)}"
            ))
    return results
