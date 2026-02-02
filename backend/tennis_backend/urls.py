"""
URL configuration for tennis_backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

from .health import health_check


def sentry_debug(request):
    """Temporary endpoint to test Sentry integration. Remove after verification."""
    division_by_zero = 1 / 0
    return HttpResponse("This will never be reached")


urlpatterns = [
    # Root health check (simple)
    path('', lambda request: HttpResponse("OK", status=200)),
    path('health/', lambda request: HttpResponse("OK", status=200)),

    # Sentry test endpoint (remove after verification)
    path('api/sentry-debug/', sentry_debug, name='sentry-debug'),

    # Admin
    path('admin/', admin.site.urls),

    # API health check (with DB check)
    path('api/health/', health_check, name='api-health'),

    # API endpoints
    path('api/auth/', include('users.urls')),
    path('api/', include('events.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('contacts.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
