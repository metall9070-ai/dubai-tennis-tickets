"""
URL configuration for tennis_backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

from .health import health_check


def root_health(request):
    """Simple root health check for Railway."""
    return HttpResponse("OK", content_type="text/plain")


urlpatterns = [
    path('', root_health, name='root'),  # Root endpoint for quick testing
    path('health/', root_health, name='health'),  # Health check at /health/
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health_check'),
    path('api/auth/', include('users.urls')),
    path('api/', include('events.urls')),
    path('api/', include('orders.urls')),
    path('api/', include('contacts.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
