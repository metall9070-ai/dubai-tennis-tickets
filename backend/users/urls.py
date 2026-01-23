"""
URL configuration for users app.
Includes JWT token endpoints and user registration.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenVerifyView

from .views import (
    RegisterView,
    ProfileView,
    PasswordChangeView,
    LogoutView,
    CustomTokenObtainPairView,
    CustomTokenRefreshView
)

urlpatterns = [
    # JWT Token endpoints
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # User management
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('password/change/', PasswordChangeView.as_view(), name='password_change'),
]
