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


def _format_order_item(item, index: int) -> str:
    """
    Format a single OrderItem for email display.

    Args:
        item: OrderItem model instance
        index: Item number (1-based) for display

    Returns:
        Formatted string for this item
    """
    date_time = f"{item.event_date} {item.event_month} {item.event_day}, {item.event_time}"
    return f"""Item {index}:
Event: {item.event_title}
Date and time: {date_time}
Venue: {item.venue}
Category: {item.category_name}
Quantity: {item.quantity}
Price per ticket: ${item.unit_price}
Subtotal: ${item.subtotal}"""


def build_order_context(order) -> Dict[str, Any]:
    """
    Build context dictionary from Order instance.

    MULTI-ITEM SUPPORT:
    - {{order_items}} contains formatted text for ALL items (use this in templates)
    - {{total_quantity}} is the sum of all item quantities
    - For subject line compatibility, {{event_name}} uses first item's event title

    Args:
        order: Order model instance with items prefetched

    Returns:
        Dictionary with all template variables
    """
    items = list(order.items.all())

    # Build formatted order items text for ALL items
    if items:
        # Format each item with full details
        formatted_items = []
        for i, item in enumerate(items, start=1):
            formatted_items.append(_format_order_item(item, i))

        order_items_text = "\n\n".join(formatted_items)

        # First item data for subject line and backward compatibility
        first_item = items[0]
        event_name = first_item.event_title

        # Calculate totals across all items
        total_quantity = sum(item.quantity for item in items)
    else:
        order_items_text = "No items in order."
        event_name = "N/A"
        total_quantity = 0

    # Build FAQ link
    frontend_url = getattr(settings, 'FRONTEND_URL', 'https://dubaitennistickets.com')
    faq_link = f"{frontend_url}/faq"

    return {
        'order_number': order.order_number,
        'client_name': order.name,
        # For subject line (uses first item's event for brevity)
        'event_name': event_name,
        # NEW: Full order items listing for email body
        'order_items': order_items_text,
        'total_quantity': total_quantity,
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
