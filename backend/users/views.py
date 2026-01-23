"""
Views for user authentication and registration.
"""

import logging
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth import get_user_model

from .serializers import UserSerializer, RegisterSerializer, PasswordChangeSerializer

User = get_user_model()
logger = logging.getLogger(__name__)


class RegisterThrottle(AnonRateThrottle):
    """Throttle for user registration to prevent abuse."""
    scope = 'register'


class LoginThrottle(AnonRateThrottle):
    """Throttle for login attempts to prevent brute force."""
    scope = 'login'


class PasswordChangeThrottle(UserRateThrottle):
    """Throttle for password change to prevent abuse."""
    scope = 'password_change'


class TokenRefreshThrottle(AnonRateThrottle):
    """Throttle for token refresh to prevent abuse."""
    scope = 'token_refresh'


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view with throttling to prevent brute force attacks.

    POST /api/auth/login/
    """
    throttle_classes = [LoginThrottle]


class CustomTokenRefreshView(TokenRefreshView):
    """
    Custom token refresh view with throttling.

    POST /api/auth/refresh/
    """
    throttle_classes = [TokenRefreshThrottle]


class RegisterView(generics.CreateAPIView):
    """
    Register a new user account.

    POST /api/auth/register/
    """

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    throttle_classes = [RegisterThrottle]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    Get or update the current user's profile.
    
    GET /api/auth/profile/
    PUT /api/auth/profile/
    PATCH /api/auth/profile/
    """
    
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user


class PasswordChangeView(APIView):
    """
    Change the current user's password.

    POST /api/auth/password/change/
    """

    permission_classes = [IsAuthenticated]
    throttle_classes = [PasswordChangeThrottle]
    
    def post(self, request):
        serializer = PasswordChangeSerializer(
            data=request.data, 
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        
        request.user.set_password(serializer.validated_data['new_password'])
        request.user.save()

        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    Logout user by blacklisting their refresh token.

    POST /api/auth/logout/
    Body: {"refresh": "refresh_token_here"}

    Security: Validates that the token belongs to the requesting user.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            logger.warning(
                f"Logout attempt without refresh token by user {request.user.id}"
            )
            return Response(
                {
                    'error': 'missing_token',
                    'message': 'Refresh token is required'
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            token = RefreshToken(refresh_token)

            # Security: Verify token belongs to the requesting user
            token_user_id = token.get('user_id')
            if token_user_id != request.user.id:
                logger.warning(
                    f"User {request.user.id} attempted to blacklist token "
                    f"belonging to user {token_user_id}"
                )
                return Response(
                    {
                        'error': 'invalid_token',
                        'message': 'Token does not belong to this user'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )

            # Blacklist the token
            token.blacklist()

            logger.info(f"User {request.user.id} logged out successfully")
            return Response(
                {'message': 'Logout successful'},
                status=status.HTTP_200_OK
            )

        except TokenError as e:
            error_message = str(e)
            logger.warning(
                f"Invalid token during logout for user {request.user.id}: {error_message}"
            )

            # Determine specific error type
            if 'blacklisted' in error_message.lower():
                return Response(
                    {
                        'error': 'token_blacklisted',
                        'message': 'Token has already been blacklisted'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            elif 'expired' in error_message.lower():
                return Response(
                    {
                        'error': 'token_expired',
                        'message': 'Token has expired'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                return Response(
                    {
                        'error': 'invalid_token',
                        'message': 'Invalid or malformed token'
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
