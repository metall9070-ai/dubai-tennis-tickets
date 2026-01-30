"""
Health check endpoint for API availability monitoring.
This endpoint is designed to be fast and NOT query the database.
"""

from django.http import JsonResponse
from django.conf import settings


def health_check(request):
    """
    Simple health check endpoint.

    Returns:
        200 OK with status info (always succeeds, no DB query)

    Usage:
        GET /api/health/

    Frontend should use this to check API availability before
    relying on dynamic prices/availability data.
    """
    return JsonResponse({
        'status': 'ok',
        'use_django_prices': getattr(settings, 'USE_DJANGO_PRICES', True),
        'use_django_availability': getattr(settings, 'USE_DJANGO_AVAILABILITY', True),
    })
