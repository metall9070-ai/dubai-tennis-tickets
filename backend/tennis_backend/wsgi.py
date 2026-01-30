"""
WSGI config for tennis_backend project.
"""

import os
import sys

print("=" * 50, file=sys.stderr)
print("WSGI: Starting Django application...", file=sys.stderr)
print(f"WSGI: Python path: {sys.path}", file=sys.stderr)
print(f"WSGI: CWD: {os.getcwd()}", file=sys.stderr)
print(f"WSGI: DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE', 'NOT SET')}", file=sys.stderr)
print("=" * 50, file=sys.stderr)

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tennis_backend.settings')

print("WSGI: Calling get_wsgi_application()...", file=sys.stderr)
application = get_wsgi_application()
print("WSGI: Django application loaded successfully!", file=sys.stderr)
