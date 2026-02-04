"""
Django settings for tennis_backend project.
Dubai Duty Free Tennis Championships Ticket System
"""

import os
from pathlib import Path
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# =============================================================================
# SENTRY ERROR TRACKING
# =============================================================================
SENTRY_DSN = os.getenv('SENTRY_DSN', '')

if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    def _sentry_before_send(event, hint):
        """
        Filter out expected client errors (400, 404) from Sentry.
        These are not actionable - they're normal client behavior.
        """
        if 'exc_info' in hint:
            exc_type, exc_value, tb = hint['exc_info']
            # Filter Django Http404
            from django.http import Http404
            if isinstance(exc_value, Http404):
                return None
            # Filter DRF validation errors and 404s
            from rest_framework.exceptions import NotFound, ValidationError
            if isinstance(exc_value, (NotFound, ValidationError)):
                return None

        return event

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[
            DjangoIntegration(
                transaction_style='url',
                middleware_spans=True,
            ),
        ],
        environment=os.getenv('SENTRY_ENVIRONMENT', 'development'),
        release=os.getenv('SENTRY_RELEASE', 'dubai-tennis@1.0.0'),
        traces_sample_rate=float(os.getenv('SENTRY_TRACES_SAMPLE_RATE', '0.1')),
        send_default_pii=True,
        before_send=_sentry_before_send,
    )

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-dev-key-change-me')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'True').lower() in ('true', '1', 'yes')

# Parse ALLOWED_HOSTS from env, with Railway domains always allowed
_env_hosts = [
    host.strip()
    for host in os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
    if host.strip()
]
ALLOWED_HOSTS = _env_hosts + [
    '.railway.app',  # Railway deployments
    '.up.railway.app',  # Railway production URLs
]

# =============================================================================
# CSRF & PROXY SETTINGS (MUST BE OUTSIDE DEBUG BLOCK)
# =============================================================================
# Railway runs behind HTTPS reverse proxy - Django must trust the header
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Trusted origins for CSRF - required for admin login
# NOTE: Django does NOT support wildcards in CSRF_TRUSTED_ORIGINS
CSRF_TRUSTED_ORIGINS = [
    'https://worthy-clarity-production.up.railway.app',
]

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # Third-party apps
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',  # For secure token rotation
    'corsheaders',
    # Local apps
    'users.apps.UsersConfig',
    'events',
    'orders',
    'contacts',
]


MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Serve static files in production
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'core.middleware.client_context.ClientContextMiddleware',
]

ROOT_URLCONF = 'tennis_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'tennis_backend.wsgi.application'

# Database configuration
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///db.sqlite3')

if DATABASE_URL.startswith('postgres'):
    # PostgreSQL configuration (supports both postgres:// and postgresql://)
    import re
    match = re.match(r'postgres(?:ql)?://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', DATABASE_URL)
    if match:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'USER': match.group(1),
                'PASSWORD': match.group(2),
                'HOST': match.group(3),
                'PORT': match.group(4),
                'NAME': match.group(5),
            }
        }
    else:
        DATABASES = {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': BASE_DIR / 'db.sqlite3',
            }
        }
else:
    # SQLite fallback for development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Custom User Model
AUTH_USER_MODEL = 'users.CustomUser'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Dubai'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Staticfiles finders - required for WhiteNoise to find DRF and admin static files
STATICFILES_FINDERS = [
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
]

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'EXCEPTION_HANDLER': 'tennis_backend.exceptions.custom_exception_handler',
    # Throttling is applied selectively to sensitive endpoints (auth, orders)
    # instead of globally, to avoid restricting public endpoints like events
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {
        # Rates for selective endpoint throttling
        'anon': os.getenv('THROTTLE_ANON_RATE', '100/hour'),
        'user': os.getenv('THROTTLE_USER_RATE', '1000/hour'),
        # Auth-specific rates (more restrictive)
        'login': os.getenv('THROTTLE_LOGIN_RATE', '10/hour'),
        'register': os.getenv('THROTTLE_REGISTER_RATE', '5/hour'),
        'password_change': os.getenv('THROTTLE_PASSWORD_CHANGE_RATE', '5/hour'),
        'token_refresh': os.getenv('THROTTLE_TOKEN_REFRESH_RATE', '30/hour'),
    },
}

# JWT Configuration
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(
        minutes=int(os.getenv('JWT_ACCESS_TOKEN_LIFETIME_MINUTES', 60))
    ),
    'REFRESH_TOKEN_LIFETIME': timedelta(
        days=int(os.getenv('JWT_REFRESH_TOKEN_LIFETIME_DAYS', 7))
    ),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
}

# CORS Configuration
# For development, allow all origins (change for production)
CORS_ALLOW_ALL_ORIGINS = DEBUG

# Production frontend domains + local development
_DEFAULT_CORS_ORIGINS = ','.join([
    'https://dubaitennistickets.com',
    'https://www.dubaitennistickets.com',
    'https://dubai-tennis-tickets.vercel.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
])

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv('CORS_ALLOWED_ORIGINS', _DEFAULT_CORS_ORIGINS).split(',')
    if origin.strip()
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'cache-control',
    'pragma',
]

# Logging configuration
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
        'auth': {
            'format': '{levelname} {asctime} [AUTH] {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'auth_console': {
            'class': 'logging.StreamHandler',
            'formatter': 'auth',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        # Suppress WhiteNoise "No directory at" warning (benign, collectstatic creates it)
        'py.warnings': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'whitenoise': {
            'handlers': ['console'],
            'level': 'ERROR',
            'propagate': False,
        },
        'users.views': {
            'handlers': ['auth_console'],
            'level': os.getenv('AUTH_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        'orders.views': {
            'handlers': ['console'],
            'level': os.getenv('ORDERS_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        'events.views': {
            'handlers': ['console'],
            'level': os.getenv('EVENTS_LOG_LEVEL', 'INFO'),
            'propagate': False,
        },
        'events.safety': {
            'handlers': ['console'],
            'level': os.getenv('API_SAFETY_LOG_LEVEL', 'DEBUG'),
            'propagate': False,
        },
    },
}

# Telegram Bot Configuration for Order Notifications
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID', '')
TELEGRAM_NOTIFICATIONS_ENABLED = os.getenv('TELEGRAM_NOTIFICATIONS_ENABLED', 'False').lower() == 'true'

# =============================================================================
# STRIPE CONFIGURATION
# =============================================================================
STRIPE_SECRET_KEY = os.getenv('STRIPE_SECRET_KEY', '')
STRIPE_PUBLISHABLE_KEY = os.getenv('STRIPE_PUBLISHABLE_KEY', '')
STRIPE_WEBHOOK_SECRET = os.getenv('STRIPE_WEBHOOK_SECRET', '')

# Frontend URL for Stripe redirects
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:3000')

# =============================================================================
# EMAIL CONFIGURATION (Resend API - works on Railway)
# =============================================================================
# Resend uses HTTP API instead of SMTP, bypassing Railway's SMTP block
RESEND_API_KEY = os.getenv('RESEND_API_KEY', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'Dubai Tennis Tickets <orders@dubaitennistickets.com>')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL', '')

# =============================================================================
# CLIENT CONTEXT
# =============================================================================
DEFAULT_CLIENT_CODE = "dubai_tennis_v1"

# =============================================================================
# API SAFETY FLAGS
# =============================================================================
# Controls whether Django API prices are authoritative for frontend.
# When False, frontend should use static/fallback prices.
USE_DJANGO_PRICES = os.getenv('USE_DJANGO_PRICES', 'True').lower() == 'true'

# Controls whether Django API availability data is authoritative.
# When False, frontend should show "check availability" instead of counts.
USE_DJANGO_AVAILABILITY = os.getenv('USE_DJANGO_AVAILABILITY', 'True').lower() == 'true'

# =============================================================================
# PRODUCTION SECURITY SETTINGS
# =============================================================================
# These settings are ONLY applied when DEBUG is False (production mode)
if not DEBUG:
    # Railway/Render proxy handles HTTPS - disable Django redirect to avoid loop
    SECURE_SSL_REDIRECT = False

    # HTTP Strict Transport Security (1 year)
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True

    # Secure cookies
    CSRF_COOKIE_SECURE = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_SAMESITE = 'Lax'

    # Additional security headers
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'

    # WhiteNoise compression (without manifest - doesn't require collectstatic at startup)
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedStaticFilesStorage'
