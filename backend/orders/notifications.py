"""
Notification service for order updates.
Sends notifications via Telegram (admin) and Email (admin + customer).

NOTIFICATION FLOW:
1. Order CREATED -> Telegram + Email to ADMIN only
2. Order PAID (webhook) -> Telegram to ADMIN + Email to CUSTOMER

EMAIL: Uses Resend API (HTTP) instead of SMTP - works on Railway where SMTP is blocked.
"""

import logging
import resend
from django.conf import settings
from django.utils.html import strip_tags

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


class EmailNotifier:
    """Send email notifications via Resend API."""

    def __init__(self):
        self.from_email = settings.DEFAULT_FROM_EMAIL
        self.admin_email = settings.ADMIN_EMAIL
        self.api_key = getattr(settings, 'RESEND_API_KEY', '')

        # Initialize Resend with API key
        if self.api_key:
            resend.api_key = self.api_key

    def is_configured(self) -> bool:
        """Check if Resend is properly configured."""
        return bool(self.api_key and self.from_email)

    def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        plain_content: str = None
    ) -> bool:
        """
        Send an email via Resend API.

        Args:
            to_email: Recipient email address
            subject: Email subject
            html_content: HTML email body
            plain_content: Plain text email body (auto-generated if not provided)

        Returns:
            True if sent successfully, False otherwise
        """
        if not self.is_configured():
            logger.warning("Resend not configured (missing RESEND_API_KEY)")
            return False

        if not plain_content:
            plain_content = strip_tags(html_content)

        logger.info(f"[RESEND] Sending email to: {to_email}")
        logger.info(f"[RESEND] From: {self.from_email}")
        logger.info(f"[RESEND] Subject: {subject}")

        try:
            # Send via Resend API
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": subject,
                "html": html_content,
                "text": plain_content,
            }

            response = resend.Emails.send(params)

            if response and response.get('id'):
                logger.info(f"[RESEND] Email sent successfully! ID: {response['id']}")
                return True
            else:
                logger.warning(f"[RESEND] Unexpected response: {response}")
                return False

        except Exception as e:
            logger.error(f"[RESEND] Error Type: {type(e).__name__}")
            logger.error(f"[RESEND] Error Details: {e}")
            return False


# Singleton instances
telegram_notifier = TelegramNotifier()
email_notifier = EmailNotifier()


def _build_order_items_text(order) -> str:
    """Build formatted text of order items."""
    items_text = ""
    for item in order.items.all():
        items_text += f"  - {item.event_title} - {item.category_name}\n"
        items_text += f"    {item.quantity} x ${item.unit_price} = ${item.subtotal}\n"
    return items_text


def _build_order_items_html(order) -> str:
    """Build HTML formatted order items."""
    items_html = "<ul>"
    for item in order.items.all():
        items_html += f"""
        <li>
            <strong>{item.event_title}</strong> - {item.category_name}<br>
            {item.quantity} x ${item.unit_price} = <strong>${item.subtotal}</strong>
        </li>
        """
    items_html += "</ul>"
    return items_html


def _get_admin_url(order) -> str:
    """Get admin URL for order."""
    # Use environment-based URL in production
    base_url = getattr(settings, 'BACKEND_URL', 'http://localhost:8000')
    return f"{base_url}/admin/orders/order/{order.id}/change/"


# =============================================================================
# PHASE 1: ORDER CREATED (before payment)
# =============================================================================

def notify_order_created(order) -> dict:
    """
    Send notifications when order is CREATED (before payment).

    Sends to:
    - Telegram: Admin notification with order details
    - Email: Admin notification

    Args:
        order: Order model instance with status=CREATED

    Returns:
        dict with notification results
    """
    results = {
        'telegram_admin': False,
        'email_admin': False
    }

    items_text = _build_order_items_text(order)
    admin_url = _get_admin_url(order)

    # Telegram to Admin
    telegram_message = f"""
🎾 <b>НОВЫЙ ЗАКАЗ СОЗДАН</b>
⚠️ <b>Статус: ОЖИДАЕТ ОПЛАТЫ</b>

📋 <b>Заказ:</b> #{order.order_number}
📅 <b>Дата:</b> {order.created_at.strftime('%d.%m.%Y %H:%M')}

👤 <b>Клиент:</b>
• Имя: {order.name}
• Email: {order.email}
• Телефон: {order.phone or 'Не указан'}

🎫 <b>Билеты:</b>
{items_text}
💰 <b>Сумма к оплате:</b> ${order.total_amount} {order.currency}

📝 <b>Комментарий:</b> {order.comments or 'Нет'}

⏳ Ожидаем подтверждения оплаты через Stripe...

🔗 <a href="{admin_url}">Открыть в админке</a>
"""
    results['telegram_admin'] = telegram_notifier.send_message(telegram_message.strip())

    # Email to Admin
    if email_notifier.admin_email:
        admin_subject = f"[НОВЫЙ ЗАКАЗ] #{order.order_number} - Ожидает оплаты"
        admin_html = f"""
        <html>
        <body style="font-family: Arial, sans-serif;">
            <h2 style="color: #f0ad4e;">Новый заказ создан - Ожидает оплаты</h2>

            <p><strong>Заказ:</strong> #{order.order_number}</p>
            <p><strong>Дата:</strong> {order.created_at.strftime('%d.%m.%Y %H:%M')}</p>

            <h3>Клиент:</h3>
            <ul>
                <li>Имя: {order.name}</li>
                <li>Email: {order.email}</li>
                <li>Телефон: {order.phone or 'Не указан'}</li>
            </ul>

            <h3>Билеты:</h3>
            {_build_order_items_html(order)}

            <p><strong>Сумма к оплате:</strong> ${order.total_amount} {order.currency}</p>

            <p style="color: #f0ad4e;"><strong>Статус:</strong> Ожидает оплаты через Stripe</p>

            <p><a href="{admin_url}">Открыть в админке</a></p>
        </body>
        </html>
        """
        results['email_admin'] = email_notifier.send_email(
            to_email=email_notifier.admin_email,
            subject=admin_subject,
            html_content=admin_html
        )

    logger.info(
        f"Order CREATED notifications for {order.order_number}: "
        f"telegram={results['telegram_admin']}, email_admin={results['email_admin']}"
    )
    return results


# =============================================================================
# PHASE 2: ORDER PAID (after successful Stripe webhook)
# =============================================================================

def notify_order_paid(order) -> dict:
    """
    Send notifications when order is PAID (after Stripe webhook confirms payment).

    Sends to:
    - Telegram: Admin notification that payment is confirmed
    - Email: Customer confirmation with ticket details

    Args:
        order: Order model instance with status=PAID

    Returns:
        dict with notification results
    """
    results = {
        'telegram_admin': False,
        'email_customer': False
    }

    items_text = _build_order_items_text(order)
    admin_url = _get_admin_url(order)

    # Telegram to Admin
    telegram_message = f"""
✅ <b>ЗАКАЗ ОПЛАЧЕН!</b>

📋 <b>Заказ:</b> #{order.order_number}
📅 <b>Оплачен:</b> {order.paid_at.strftime('%d.%m.%Y %H:%M') if order.paid_at else 'N/A'}

👤 <b>Клиент:</b>
• Имя: {order.name}
• Email: {order.email}
• Телефон: {order.phone or 'Не указан'}

🎫 <b>Билеты:</b>
{items_text}
💰 <b>Оплачено:</b> ${order.total_amount} {order.currency}

💳 <b>Stripe Payment:</b> {order.payment_intent_id or 'N/A'}

🔗 <a href="{admin_url}">Открыть в админке</a>
"""
    results['telegram_admin'] = telegram_notifier.send_message(telegram_message.strip())

    # Email to Customer - Payment Confirmation
    frontend_url = getattr(settings, 'FRONTEND_URL', 'https://dubaitennistickets.com')
    customer_subject = f"Payment Confirmed - Dubai Tennis Championships #{order.order_number}"
    customer_html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1a1a2e; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Dubai Duty Free Tennis Championships</h1>
        </div>

        <div style="padding: 20px;">
            <h2 style="color: #28a745;">Payment Confirmed!</h2>

            <p>Dear {order.name},</p>

            <p>Thank you for your purchase! Your payment has been successfully processed.</p>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> #{order.order_number}</p>
                <p><strong>Date:</strong> {order.paid_at.strftime('%B %d, %Y at %H:%M') if order.paid_at else 'N/A'}</p>

                <h4>Tickets:</h4>
                {_build_order_items_html(order)}

                <p style="font-size: 18px;"><strong>Total Paid:</strong> ${order.total_amount} {order.currency}</p>
            </div>

            <h3>What's Next?</h3>
            <p>You will receive your e-tickets via email within 24-48 hours before the event date.</p>
            <p>Please bring a valid ID matching the name on your order to collect your tickets at the venue.</p>

            <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Venue:</strong> Dubai Duty Free Tennis Stadium, Aviation Club, Al Garhoud</p>
            </div>

            <p>If you have any questions, please contact us at support@dubaitennistickets.com</p>

            <p>We look forward to seeing you at the tournament!</p>

            <p>Best regards,<br>Dubai Tennis Tickets Team</p>
        </div>

        <div style="background: #f8f9fa; padding: 15px; text-align: center; font-size: 12px; color: #666;">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p><a href="{frontend_url}">www.dubaitennistickets.com</a></p>
        </div>
    </body>
    </html>
    """
    results['email_customer'] = email_notifier.send_email(
        to_email=order.email,
        subject=customer_subject,
        html_content=customer_html
    )

    logger.info(
        f"Order PAID notifications for {order.order_number}: "
        f"telegram={results['telegram_admin']}, email_customer={results['email_customer']}"
    )
    return results


# =============================================================================
# LEGACY FUNCTIONS (for backward compatibility)
# =============================================================================

def notify_new_order(order) -> bool:
    """
    Legacy function - now calls notify_order_created.
    Kept for backward compatibility with existing code.
    """
    results = notify_order_created(order)
    return results.get('telegram_admin', False)


def notify_order_status_change(order, old_status: str) -> bool:
    """
    Send notification about order status change.
    """
    status_emoji = {
        'pending': '',
        'confirmed': '',
        'paid': '',
        'cancelled': '',
        'refunded': '',
    }

    emoji = status_emoji.get(order.status, '')

    message = f"""
{emoji} <b>Статус заказа изменен</b>

 Заказ: #{order.order_number}
 Клиент: {order.name}

 Статус: <s>{old_status}</s>  <b>{order.get_status_display()}</b>
"""
    return telegram_notifier.send_message(message.strip())
