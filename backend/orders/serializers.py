"""
Serializers for orders and order items.
Thin serializers focused on validation and transformation only.
Business logic is delegated to the service layer.
"""

from rest_framework import serializers
from django.db.models import Sum

from .models import Order, OrderItem
from .services import (
    OrderService,
    OrderItemRequest,
    OrderServiceError,
    EventNotFoundError,
    CategoryNotFoundError,
    InsufficientSeatsError
)


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for order items (read-only for response)."""
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'event_id', 'category_id', 'quantity', 
            'unit_price', 'subtotal',
            'event_title', 'event_date', 'event_month', 
            'event_day', 'event_time', 'category_name', 'venue'
        ]
        read_only_fields = ['id', 'subtotal']


class OrderItemCreateSerializer(serializers.Serializer):
    """
    Serializer for validating order item input.
    Validation is delegated to the service layer.
    """
    
    event_id = serializers.IntegerField(min_value=1)
    category_id = serializers.IntegerField(min_value=1)
    quantity = serializers.IntegerField(min_value=1, max_value=10)


class OrderSerializer(serializers.ModelSerializer):
    """
    Serializer for order details (read response).
    Uses annotated total_tickets for performance.
    """
    
    items = OrderItemSerializer(many=True, read_only=True)
    total_tickets = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'name', 'email', 'phone', 'comments',
            'total_amount', 'status', 'total_tickets',
            'items', 'created_at', 'updated_at', 'paid_at'
        ]
        read_only_fields = ['id', 'order_number', 'total_amount', 'status', 
                           'created_at', 'updated_at', 'paid_at']
    
    def get_total_tickets(self, obj):
        """
        Get total tickets using annotation if available,
        otherwise fallback to calculation.
        """
        # Check if annotated value exists (from optimized queryset)
        if hasattr(obj, '_total_tickets'):
            return obj._total_tickets or 0
        # Fallback: use aggregation instead of N+1 query
        return obj.items.aggregate(total=Sum('quantity'))['total'] or 0


class OrderCreateSerializer(serializers.Serializer):
    """
    Serializer for creating orders.
    Validates input and delegates creation to OrderService.
    """
    
    # Customer information
    name = serializers.CharField(max_length=200, min_length=2)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=30, min_length=5)
    comments = serializers.CharField(required=False, allow_blank=True, default='')
    
    # Cart items
    items = OrderItemCreateSerializer(many=True)
    
    def validate_name(self, value):
        """Sanitize and validate name."""
        return value.strip()
    
    def validate_phone(self, value):
        """Sanitize phone number."""
        # Remove common formatting characters
        cleaned = ''.join(c for c in value if c.isdigit() or c == '+')
        if len(cleaned) < 5:
            raise serializers.ValidationError('Phone number is too short.')
        return value.strip()
    
    def validate_items(self, value):
        """Ensure at least one item in order."""
        if not value:
            raise serializers.ValidationError('Order must contain at least one item.')
        if len(value) > 20:
            raise serializers.ValidationError('Order cannot contain more than 20 items.')
        return value
    
    def validate(self, attrs):
        """
        Validate items using the service layer.
        This performs preliminary validation without locking.
        """
        try:
            validated_items = OrderService.validate_items(attrs['items'])
            attrs['validated_items'] = validated_items
        except EventNotFoundError as e:
            raise serializers.ValidationError({'items': e.message})
        except CategoryNotFoundError as e:
            raise serializers.ValidationError({'items': e.message})
        except InsufficientSeatsError as e:
            raise serializers.ValidationError({'items': e.message})
        
        return attrs
    
    def create(self, validated_data):
        """
        Create order using the service layer.
        The service handles atomic seat reservation with proper locking.
        """
        # Get authenticated user if available
        user = None
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
        
        try:
            order = OrderService.create_order(
                name=validated_data['name'],
                email=validated_data['email'],
                phone=validated_data['phone'],
                items=validated_data['validated_items'],
                user=user,
                comments=validated_data.get('comments', '')
            )
            return order
        except InsufficientSeatsError as e:
            # This can happen if seats were taken between validation and creation
            raise serializers.ValidationError({'items': e.message})
        except OrderServiceError as e:
            raise serializers.ValidationError({'non_field_errors': [e.message]})


class OrderListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for order listing.
    Uses annotation for total_tickets performance.
    """
    
    total_tickets = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'total_amount', 'status',
            'total_tickets', 'created_at'
        ]
    
    def get_total_tickets(self, obj):
        """Get total tickets from annotation or calculation."""
        if hasattr(obj, '_total_tickets'):
            return obj._total_tickets or 0
        return obj.items.aggregate(total=Sum('quantity'))['total'] or 0
