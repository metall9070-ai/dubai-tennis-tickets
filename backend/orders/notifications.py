"""
Telegram notification service for order updates.
Sends order details to admin via Telegram bot.
"""

import logging
import httpx
from django.conf import settings

logger = logging.getLogger(__name__)


class TelegramNotifier:
    """Send notifications to Telegram."""

    BASE_URL = "https://api.telegram.org/bot{token}/sendMessage"

    def __init__(self):
        self.token = settings.TELEGRAM_BOT_TOKEN
        self.chat_id = settings.TELEGRAM_CHAT_ID
        self.enabled = settings.TELEGRAM_NOTIFICATIONS_ENABLED

    def is_configured(self) -> bool:
        """Check if Telegram is properly configured."""
        return bool(self.token and self.chat_id and self.enabled)

    def send_message(self, text: str, parse_mode: str = "HTML") -> bool:
        """
        Send a message to Telegram.

        Args:
            text: Message text (supports HTML formatting)
            parse_mode: Message format (HTML or Markdown)

        Returns:
            True if sent successfully, False otherwise
        """
        if not self.is_configured():
            logger.debug("Telegram notifications disabled or not configured")
            return False

        url = self.BASE_URL.format(token=self.token)
        payload = {
            "chat_id": self.chat_id,
            "text": text,
            "parse_mode": parse_mode
        }

        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(url, json=payload)
                response.raise_for_status()
                logger.info("Telegram notification sent successfully")
                return True
        except httpx.HTTPError as e:
            logger.error(f"Failed to send Telegram notification: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending Telegram notification: {e}")
            return False

    def notify_new_order(self, order) -> bool:
        """
        Send notification about a new order.

        Args:
            order: Order model instance

        Returns:
            True if sent successfully
        """
        # Build order items list
        items_text = ""
        for item in order.items.all():
            items_text += f"  • {item.event_title} - {item.category_name}\n"
            items_text += f"    {item.quantity} x ${item.unit_price} = ${item.subtotal}\n"

        message = f"""
🎾 <b>НОВЫЙ ЗАКАЗ!</b>

📋 <b>Заказ:</b> #{order.order_number}
📅 <b>Дата:</b> {order.created_at.strftime('%d.%m.%Y %H:%M')}

👤 <b>Клиент:</b>
• Имя: {order.name}
• Email: {order.email}
• Телефон: {order.phone or 'Не указан'}

🎫 <b>Билеты:</b>
{items_text}
💰 <b>ИТОГО:</b> ${order.total_amount}

📝 <b>Комментарий:</b> {order.comments or 'Нет'}

🔗 <a href="http://localhost:8000/admin/orders/order/{order.id}/change/">Открыть в админке</a>
"""
        return self.send_message(message.strip())

    def notify_order_status_change(self, order, old_status: str) -> bool:
        """
        Send notification about order status change.

        Args:
            order: Order model instance
            old_status: Previous status

        Returns:
            True if sent successfully
        """
        status_emoji = {
            'pending': '⏳',
            'confirmed': '✅',
            'paid': '💳',
            'cancelled': '❌',
            'refunded': '💸',
        }

        emoji = status_emoji.get(order.status, '📋')

        message = f"""
{emoji} <b>Статус заказа изменен</b>

📋 Заказ: #{order.order_number}
👤 Клиент: {order.name}

📊 Статус: <s>{old_status}</s> → <b>{order.get_status_display()}</b>
"""
        return self.send_message(message.strip())


# Singleton instance
telegram_notifier = TelegramNotifier()


def notify_new_order(order) -> bool:
    """Convenience function to notify about new order."""
    return telegram_notifier.notify_new_order(order)


def notify_order_status_change(order, old_status: str) -> bool:
    """Convenience function to notify about status change."""
    return telegram_notifier.notify_order_status_change(order, old_status)
