"""
Custom exception handler for the Tennis Backend API.
Provides consistent error response format across all endpoints.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that returns consistent error format.
    
    Response format:
    {
        "error": "error_code",
        "message": "Human readable message",
        "details": {}
    }
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Determine error code from status
        error_codes = {
            400: 'bad_request',
            401: 'unauthorized',
            403: 'forbidden',
            404: 'not_found',
            405: 'method_not_allowed',
            429: 'rate_limit_exceeded',
            500: 'internal_error',
        }
        
        error_code = error_codes.get(response.status_code, 'error')
        
        # Extract message from response data
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
                details = {}
            else:
                message = 'Validation error'
                details = response.data
        elif isinstance(response.data, list):
            message = response.data[0] if response.data else 'Error occurred'
            details = {'errors': response.data}
        else:
            message = str(response.data)
            details = {}
        
        response.data = {
            'error': error_code,
            'message': message,
            'details': details,
        }
    
    return response


class APIException(Exception):
    """Base exception for API errors."""
    
    def __init__(self, message, error_code='error', status_code=400, details=None):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)
    
    def to_response(self):
        """Convert exception to DRF Response."""
        return Response(
            {
                'error': self.error_code,
                'message': self.message,
                'details': self.details,
            },
            status=self.status_code
        )


class ValidationError(APIException):
    """Validation error exception."""
    
    def __init__(self, message, details=None):
        super().__init__(
            message=message,
            error_code='validation_error',
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )


class NotFoundError(APIException):
    """Resource not found exception."""
    
    def __init__(self, message='Resource not found', details=None):
        super().__init__(
            message=message,
            error_code='not_found',
            status_code=status.HTTP_404_NOT_FOUND,
            details=details
        )


class InsufficientSeatsError(APIException):
    """Not enough seats available."""

    def __init__(self, available, requested):
        super().__init__(
            message=f'Only {available} seats available, but {requested} requested',
            error_code='insufficient_seats',
            status_code=status.HTTP_400_BAD_REQUEST,
            details={'available': available, 'requested': requested}
        )


# Authentication-related exceptions

class AuthenticationError(APIException):
    """Base class for authentication errors."""

    def __init__(self, message='Authentication failed', error_code='auth_error', details=None):
        super().__init__(
            message=message,
            error_code=error_code,
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details
        )


class InvalidTokenError(APIException):
    """Invalid or malformed token."""

    def __init__(self, message='Invalid or malformed token', details=None):
        super().__init__(
            message=message,
            error_code='invalid_token',
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details
        )


class TokenExpiredError(APIException):
    """Token has expired."""

    def __init__(self, message='Token has expired', details=None):
        super().__init__(
            message=message,
            error_code='token_expired',
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details
        )


class TokenBlacklistedError(APIException):
    """Token has been blacklisted."""

    def __init__(self, message='Token has been blacklisted', details=None):
        super().__init__(
            message=message,
            error_code='token_blacklisted',
            status_code=status.HTTP_401_UNAUTHORIZED,
            details=details
        )


class TokenOwnershipError(APIException):
    """Token does not belong to the requesting user."""

    def __init__(self, message='Token does not belong to this user', details=None):
        super().__init__(
            message=message,
            error_code='token_ownership_error',
            status_code=status.HTTP_403_FORBIDDEN,
            details=details
        )
