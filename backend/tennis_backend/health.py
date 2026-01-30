"""
Health check endpoint for API availability monitoring.
Includes database connectivity check.
"""

from django.http import JsonResponse
from django.conf import settings
from django.db import connection


def health_check(request):
    """
    Health check endpoint with database connectivity check.

    Returns:
        200 OK with status info if healthy
        503 Service Unavailable if database is unreachable

    Usage:
        GET /api/health/

    Response:
    {
        "status": "ok",
        "database_connected": true,
        "database_engine": "postgresql",
        "use_django_prices": true,
        "use_django_availability": true
    }
    """
    # Check database connectivity
    database_connected = False
    database_engine = "unknown"

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        database_connected = True

        # Get database engine name
        db_settings = settings.DATABASES.get('default', {})
        engine = db_settings.get('ENGINE', '')
        if 'postgresql' in engine:
            database_engine = 'postgresql'
        elif 'sqlite' in engine:
            database_engine = 'sqlite'
        elif 'mysql' in engine:
            database_engine = 'mysql'
        else:
            database_engine = engine.split('.')[-1] if engine else 'unknown'

    except Exception as e:
        database_connected = False
        database_engine = f"error: {str(e)}"

    response_data = {
        'status': 'ok' if database_connected else 'degraded',
        'database_connected': database_connected,
        'database_engine': database_engine,
        'use_django_prices': getattr(settings, 'USE_DJANGO_PRICES', True),
        'use_django_availability': getattr(settings, 'USE_DJANGO_AVAILABILITY', True),
    }

    # Return 503 if database is down
    if not database_connected:
        return JsonResponse(response_data, status=503)

    return JsonResponse(response_data)
