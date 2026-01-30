"""
Views for orders.
Thin views that delegate business logic to the service layer.
"""

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, BasePermission
from rest_framework.decorators import action
from rest_framework.throttling import AnonRateThrottle
from django.db.models import Sum
from django.utils import timezone
from django.db import IntegrityError

from .models import Order
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    OrderListSerializer,
    MarkPaidSerializer
)


class OrderCreateThrottle(AnonRateThrottle):
    """Throttle for order creation to prevent abuse."""
    rate = '10/hour'


class IsOrderOwnerOrAdmin(BasePermission):
    """
    Permission that allows:
    - Staff/admin users to access any order
    - Authenticated users to access their own orders
    - Anyone to access orders by order_number (for guest checkout lookup)
    """
    
    def has_object_permission(self, request, view, obj):
        # Staff can access any order
        if request.user.is_staff:
            return True
        
        # Owner can access their order
        if request.user.is_authenticated and obj.user == request.user:
            return True
        
        # For guest orders, we allow lookup by order_number action
        # The by_order_number action requires email verification
        if view.action == 'by_order_number':
            return True
        
        # Deny access for direct UUID lookup to non-owners
        return False


class OrderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating and managing orders.
    
    POST /api/orders/ - Create new order (guest or authenticated)
    GET /api/orders/ - List user's orders (authenticated only)
    GET /api/orders/{id}/ - Get order details (owner only)
    GET /api/orders/by-number/{order_number}/ - Get order by order number
    """
    
    queryset = Order.objects.all()
    lookup_field = 'id'
    
    def get_throttles(self):
        """Apply throttling only to order creation."""
        if self.action == 'create':
            return [OrderCreateThrottle()]
        return []
    
    def get_permissions(self):
        """
        Permission configuration:
        - create: Anyone (guest checkout)
        - list: Authenticated users only (see their orders)
        - retrieve: Owner or admin only
        - by_order_number: Anyone (but requires order number)
        - mark_paid: Anyone (internal webhook, no auth for now)
        """
        if self.action == 'create':
            return [AllowAny()]
        elif self.action == 'by_order_number':
            return [AllowAny()]
        elif self.action == 'mark_paid':
            return [AllowAny()]  # Internal webhook - will add auth later
        elif self.action == 'retrieve':
            return [IsOrderOwnerOrAdmin()]
        return [IsAuthenticated()]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        elif self.action == 'list':
            return OrderListSerializer
        return OrderSerializer
    
    def get_queryset(self):
        """
        Optimized queryset with annotations.
        Filters to current user for listing.
        """
        queryset = Order.objects.prefetch_related('items').annotate(
            _total_tickets=Sum('items__quantity')
        )
        
        # For list action, filter to current user's orders
        if self.action == 'list':
            if self.request.user.is_authenticated:
                return queryset.filter(user=self.request.user)
            return Order.objects.none()
        
        return queryset
    
    def create(self, request, *args, **kwargs):
        """Create a new order."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Fetch the created order with optimized query for response
        order = self.get_queryset().get(id=order.id)
        response_serializer = OrderSerializer(order)
        
        return Response(
            {
                'message': 'Order created successfully',
                'order': response_serializer.data
            },
            status=status.HTTP_201_CREATED
        )
    
    def retrieve(self, request, *args, **kwargs):
        """Get order details by ID."""
        instance = self.get_object()
        serializer = OrderSerializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-number/(?P<order_number>[^/.]+)')
    def by_order_number(self, request, order_number=None):
        """
        Get order by order number.
        This is the secure way for guests to look up their orders.
        """
        if not order_number or len(order_number) < 5:
            return Response(
                {'error': 'invalid_request', 'message': 'Invalid order number'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            order = self.get_queryset().get(order_number=order_number.upper())
            serializer = OrderSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {'error': 'not_found', 'message': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )

    # =========================================================================
    # INTERNAL WEBHOOK ENDPOINT (not in browsable API)
    # =========================================================================

    @action(
        detail=True,
        methods=['post'],
        url_path='mark-paid',
        url_name='mark-paid',
        # Exclude from schema/browsable API
        schema=None
    )
    def mark_paid(self, request, id=None):
        """
        Mark order as paid (internal webhook endpoint).

        POST /api/orders/{id}/mark-paid/
        {
            "payment_intent_id": "pi_..."
        }

        Idempotency:
        - If order already paid with same payment_intent_id → 200 OK
        - If payment_intent_id used by another order → 400 Bad Request
        - If order already paid with different payment_intent_id → 400 Bad Request

        This endpoint is NOT exposed in browsable API docs.
        """
        # Get order
        try:
            order = Order.objects.get(id=id)
        except Order.DoesNotExist:
            return Response(
                {'error': 'not_found', 'message': 'Order not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Validate input
        serializer = MarkPaidSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'error': 'validation_error', 'details': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        payment_intent_id = serializer.validated_data['payment_intent_id']

        # IDEMPOTENCY CHECK: If order already paid with same payment_intent_id
        if order.status == 'paid' and order.payment_intent_id == payment_intent_id:
            return Response({
                'message': 'Order already marked as paid',
                'order_id': str(order.id),
                'order_number': order.order_number,
                'status': order.status,
                'paid_at': order.paid_at.isoformat() if order.paid_at else None,
                'idempotent': True
            }, status=status.HTTP_200_OK)

        # ERROR: Order already paid with DIFFERENT payment_intent_id
        if order.status == 'paid':
            return Response(
                {
                    'error': 'already_paid',
                    'message': 'Order is already paid with a different payment',
                    'order_id': str(order.id),
                    'order_number': order.order_number
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ERROR: Order in non-payable status
        if order.status not in ('pending', 'confirmed'):
            return Response(
                {
                    'error': 'invalid_status',
                    'message': f'Cannot mark order as paid. Current status: {order.status}',
                    'order_id': str(order.id),
                    'order_number': order.order_number
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Attempt to save (unique constraint will catch duplicate payment_intent_id)
        try:
            order.payment_intent_id = payment_intent_id
            order.status = 'paid'
            order.paid_at = timezone.now()
            order.save(update_fields=['payment_intent_id', 'status', 'paid_at', 'updated_at'])
        except IntegrityError:
            # payment_intent_id already used by another order
            return Response(
                {
                    'error': 'duplicate_payment',
                    'message': 'This payment_intent_id is already associated with another order',
                    'payment_intent_id': payment_intent_id
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response({
            'message': 'Order marked as paid successfully',
            'order_id': str(order.id),
            'order_number': order.order_number,
            'status': order.status,
            'paid_at': order.paid_at.isoformat()
        }, status=status.HTTP_200_OK)
