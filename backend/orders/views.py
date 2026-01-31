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

from .models import Order
from .serializers import (
    OrderSerializer,
    OrderCreateSerializer,
    OrderListSerializer,
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
        - retrieve: Anyone (for order confirmation page after checkout)
        - by_order_number: Anyone (but requires order number)

        NOTE: Payment confirmation is ONLY via Stripe webhook at /api/stripe/webhook/
        NOTE: retrieve is public because UUIDs are unguessable and needed for checkout flow
        """
        if self.action == 'create':
            return [AllowAny()]
        elif self.action == 'by_order_number':
            return [AllowAny()]
        elif self.action == 'retrieve':
            return [AllowAny()]  # Public for checkout confirmation (UUID is unguessable)
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
