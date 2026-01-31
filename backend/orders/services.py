"""
Order service layer.
Centralizes all order-related business logic with proper transaction handling.
"""

import logging
from decimal import Decimal
from typing import List, Optional
from dataclasses import dataclass

from django.db import transaction
from django.contrib.auth import get_user_model

from events.models import Category, Event
from .models import Order, OrderItem, SalesChannel
from .notifications import notify_new_order

logger = logging.getLogger(__name__)
User = get_user_model()


@dataclass
class OrderItemRequest:
    """Data class for order item creation request."""
    event_id: int
    category_id: int
    quantity: int
    
    # Populated during validation
    event: Optional[Event] = None
    category: Optional[Category] = None


class OrderServiceError(Exception):
    """Base exception for order service errors."""
    
    def __init__(self, message: str, code: str = 'order_error', details: dict = None):
        self.message = message
        self.code = code
        self.details = details or {}
        super().__init__(message)


class InsufficientSeatsError(OrderServiceError):
    """Raised when not enough seats are available."""
    
    def __init__(self, category_name: str, available: int, requested: int):
        super().__init__(
            message=f'Only {available} seats available for {category_name}, but {requested} requested.',
            code='insufficient_seats',
            details={
                'category': category_name,
                'available': available,
                'requested': requested
            }
        )


class EventNotFoundError(OrderServiceError):
    """Raised when event is not found or inactive."""
    
    def __init__(self, event_id: int):
        super().__init__(
            message=f'Event with ID {event_id} not found or not available.',
            code='event_not_found',
            details={'event_id': event_id}
        )


class CategoryNotFoundError(OrderServiceError):
    """Raised when category is not found or inactive."""
    
    def __init__(self, category_id: int, event_id: int):
        super().__init__(
            message=f'Category with ID {category_id} not found or not available for event {event_id}.',
            code='category_not_found',
            details={'category_id': category_id, 'event_id': event_id}
        )


class OrderService:
    """
    Service class for order-related business logic.
    
    Handles:
    - Order creation with atomic seat reservation
    - Seat availability validation with row locking
    - Order total calculation
    """
    
    @classmethod
    def validate_items(cls, items_data: List[dict]) -> List[OrderItemRequest]:
        """
        Validate order items without locking.
        Used for initial validation before checkout.
        
        Args:
            items_data: List of dicts with event_id, category_id, quantity
            
        Returns:
            List of validated OrderItemRequest objects
            
        Raises:
            EventNotFoundError: If event not found
            CategoryNotFoundError: If category not found
            InsufficientSeatsError: If not enough seats (preliminary check)
        """
        validated_items = []
        
        for item_data in items_data:
            item = OrderItemRequest(
                event_id=item_data['event_id'],
                category_id=item_data['category_id'],
                quantity=item_data['quantity']
            )
            
            # Validate event exists and is active
            try:
                item.event = Event.objects.select_related('tournament').get(
                    id=item.event_id,
                    is_active=True
                )
            except Event.DoesNotExist:
                raise EventNotFoundError(item.event_id)
            
            # Validate category exists and belongs to event
            try:
                item.category = Category.objects.get(
                    id=item.category_id,
                    event=item.event,
                    is_active=True
                )
            except Category.DoesNotExist:
                raise CategoryNotFoundError(item.category_id, item.event_id)
            
            # Preliminary availability check (will be rechecked with lock)
            if item.category.seats_available < item.quantity:
                raise InsufficientSeatsError(
                    category_name=item.category.name,
                    available=item.category.seats_available,
                    requested=item.quantity
                )
            
            validated_items.append(item)
        
        return validated_items
    
    @classmethod
    @transaction.atomic
    def create_order(
        cls,
        name: str,
        email: str,
        phone: str,
        items: List[OrderItemRequest],
        user: Optional[User] = None,
        comments: str = '',
        sales_channel: Optional[SalesChannel] = None
    ) -> Order:
        """
        Create an order with atomic seat reservation.

        Uses SELECT FOR UPDATE to prevent race conditions when reserving seats.
        The entire operation is wrapped in a transaction - if any seat reservation
        fails, all changes are rolled back.

        Currency is set from SalesChannel (Variant 1 architecture).
        stripe_amount_cents is calculated and frozen at order creation.

        Args:
            name: Customer name
            email: Customer email
            phone: Customer phone
            items: List of validated OrderItemRequest objects
            user: Optional authenticated user
            comments: Optional order comments
            sales_channel: Optional SalesChannel (uses default if not provided)

        Returns:
            Created Order instance

        Raises:
            InsufficientSeatsError: If seats become unavailable during reservation
        """
        # Get sales channel (determines currency)
        if sales_channel is None:
            sales_channel = SalesChannel.get_default()

        # Create the order with currency from sales channel
        order = Order.objects.create(
            user=user,
            name=name,
            email=email,
            phone=phone,
            comments=comments,
            sales_channel=sales_channel,
            currency=sales_channel.currency,  # FROZEN at creation
        )

        total_amount = Decimal('0.00')

        # Process each item with row-level locking
        for item in items:
            # Lock the category row to prevent concurrent modifications
            # This is the key to preventing race conditions
            locked_category = Category.objects.select_for_update().get(
                id=item.category.id
            )

            # Re-check availability with the lock held
            if locked_category.seats_available < item.quantity:
                # Transaction will rollback automatically
                raise InsufficientSeatsError(
                    category_name=locked_category.name,
                    available=locked_category.seats_available,
                    requested=item.quantity
                )

            # Reserve the seats
            locked_category.seats_available -= item.quantity
            locked_category.save(update_fields=['seats_available', 'updated_at'])

            # Create order item with snapshot data
            order_item = OrderItem.objects.create(
                order=order,
                event=item.event,
                category=locked_category,
                quantity=item.quantity,
                unit_price=locked_category.price,
                event_title=item.event.title,
                event_date=item.event.date,
                event_month=item.event.month,
                event_day=item.event.day,
                event_time=item.event.time,
                category_name=locked_category.name,
                venue=item.event.venue,
            )

            total_amount += order_item.subtotal

            logger.info(
                f'Reserved {item.quantity} seats for {locked_category.name} '
                f'(order {order.order_number})'
            )

        # Update order total and calculate stripe_amount_cents (FROZEN)
        order.total_amount = total_amount
        order.stripe_amount_cents = order._calculate_stripe_amount_cents()
        order.save(update_fields=['total_amount', 'stripe_amount_cents'])

        logger.info(
            f'Order {order.order_number} created successfully. '
            f'Total: {order.currency} {total_amount} ({order.stripe_amount_cents} cents)'
        )

        # Send Telegram notification (async-safe, won't block)
        try:
            notify_new_order(order)
        except Exception as e:
            # Don't fail the order if notification fails
            logger.warning(f'Failed to send Telegram notification: {e}')

        return order
    
    @classmethod
    @transaction.atomic
    def cancel_order(cls, order: Order) -> Order:
        """
        Cancel an order and release reserved seats.
        
        Args:
            order: Order to cancel
            
        Returns:
            Updated Order instance
        """
        if order.status == 'cancelled':
            return order
        
        # Release seats for each item
        for item in order.items.select_related('category'):
            category = Category.objects.select_for_update().get(id=item.category_id)
            category.seats_available = min(
                category.seats_total,
                category.seats_available + item.quantity
            )
            category.save(update_fields=['seats_available', 'updated_at'])
            
            logger.info(
                f'Released {item.quantity} seats for {category.name} '
                f'(order {order.order_number} cancelled)'
            )
        
        order.status = 'cancelled'
        order.save(update_fields=['status', 'updated_at'])
        
        logger.info(f'Order {order.order_number} cancelled successfully.')
        
        return order
    
    @classmethod
    def get_order_with_items(cls, order_id) -> Optional[Order]:
        """
        Get order with optimized query for items.
        
        Args:
            order_id: Order UUID
            
        Returns:
            Order with prefetched items or None
        """
        try:
            return Order.objects.prefetch_related(
                'items',
                'items__event',
                'items__category'
            ).get(id=order_id)
        except Order.DoesNotExist:
            return None
