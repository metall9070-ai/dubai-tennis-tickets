"""
URL configuration for tennis_backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

# Temporary diagnostics - DELETE after production sync confirmed
from tennis_backend.diagnostics import version_view

urlpatterns = [
    # Root health checks - MUST be fast, no DB, no imports
    path('', lambda request: HttpResponse("OK", status=200)),
    path('health/', lambda request: HttpResponse("OK", status=200)),

    # Temporary diagnostics - DELETE after production sync confirmed
    path('__version__/', version_view, name='version'),

    # Admin
    path('admin/', admin.site.urls),

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
