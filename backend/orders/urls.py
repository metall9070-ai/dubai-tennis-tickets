"""
URL configuration for orders app.

Endpoints:
- /api/orders/ - Order CRUD (existing)
- /api/checkout/create-session/ - Create order + Stripe session (combined flow)
- /api/checkout/{order_id}/status/ - Check order payment status
- /api/stripe/create-checkout-session/ - Create Stripe session for existing order
- /api/stripe/webhook/ - Stripe webhook handler
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import OrderViewSet
from .stripe_views import (
    create_checkout_session,
    create_stripe_session_for_order,
    stripe_webhook,
    check_order_status,
)

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    # Existing order endpoints
    path('', include(router.urls)),

    # Stripe checkout endpoints
    path('checkout/create-session/', create_checkout_session, name='create-checkout-session'),
    path('checkout/<uuid:order_id>/status/', check_order_status, name='check-order-status'),

    # Stripe endpoints
    path('stripe/create-checkout-session/', create_stripe_session_for_order, name='create-stripe-session'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
]
