"""
Email template renderer.
Loads templates from .txt files and renders them with order context.
"""

import os
import logging
from pathlib import Path
from typing import Tuple, Dict, Any

from django.conf import settings

logger = logging.getLogger(__name__)

# Path to email templates directory
EMAILS_DIR = Path(__file__).parent


def load_template(template_name: str) -> Tuple[str, str]:
    """
    Load email template from file.

    Args:
        template_name: Name of template file (e.g., 'order_created.txt')

    Returns:
        Tuple of (subject, body)
    """
    template_path = EMAILS_DIR / template_name

    if not template_path.exists():
        logger.error(f"Email template not found: {template_path}")
        raise FileNotFoundError(f"Template {template_name} not found")

    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Split by --- separator
    parts = content.split('---', 1)

    if len(parts) < 2:
        logger.error(f"Invalid template format in {template_name}: missing --- separator")
        raise ValueError(f"Template {template_name} has invalid format")

    # Extract subject from first part (supports both EN and RU headers)
    subject_part = parts[0].strip()
    subject_line = subject_part.replace('Subject:', '').replace('Тема письма:', '').strip()

    # Body is the second part
    body = parts[1].strip()

    return subject_line, body


def render_template(template_text: str, context: Dict[str, Any]) -> str:
    """
    Render template with context using {{variable}} syntax.

    Args:
        template_text: Template text with {{variable}} placeholders
        context: Dictionary of variables to replace

    Returns:
        Rendered template string
    """
    result = template_text
    for key, value in context.items():
        placeholder = '{{' + key + '}}'
        result = result.replace(placeholder, str(value) if value else '')
    return result


def build_order_context(order) -> Dict[str, Any]:
    """
    Build context dictionary from Order instance.

    Args:
        order: Order model instance with items prefetched

    Returns:
        Dictionary with all template variables
    """
    # Get first item for single-item orders, or build summary for multi-item
    items = list(order.items.all())

    if items:
        first_item = items[0]
        event_name = first_item.event_title
        event_date_time = f"{first_item.event_date} {first_item.event_month} {first_item.event_day}, {first_item.event_time}"
        venue = first_item.venue
        category = first_item.category_name
        quantity = sum(item.quantity for item in items)
        price = f"${first_item.unit_price}"
    else:
        event_name = "N/A"
        event_date_time = "N/A"
        venue = "N/A"
        category = "N/A"
        quantity = 0
        price = "N/A"

    # Build FAQ link
    frontend_url = getattr(settings, 'FRONTEND_URL', 'https://dubaitennistickets.com')
    faq_link = f"{frontend_url}/faq"

    return {
        'order_number': order.order_number,
        'client_name': order.name,
        'event_name': event_name,
        'event_date_time': event_date_time,
        'venue': venue,
        'category': category,
        'quantity': quantity,
        'price': price,
        'total_amount': f"${order.total_amount} {order.currency}",
        'faq_link': faq_link,
    }


def get_order_created_email(order) -> Tuple[str, str]:
    """
    Get rendered order_created email for customer.

    Args:
        order: Order model instance

    Returns:
        Tuple of (subject, body)
    """
    subject_template, body_template = load_template('order_created.txt')
    context = build_order_context(order)

    subject = render_template(subject_template, context)
    body = render_template(body_template, context)

    return subject, body


def get_order_paid_email(order) -> Tuple[str, str]:
    """
    Get rendered order_paid email for customer.

    Args:
        order: Order model instance

    Returns:
        Tuple of (subject, body)
    """
    subject_template, body_template = load_template('order_paid.txt')
    context = build_order_context(order)

    subject = render_template(subject_template, context)
    body = render_template(body_template, context)

    return subject, body
