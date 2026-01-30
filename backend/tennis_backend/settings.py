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
    'users',
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
    # PostgreSQL configuration
    import re
    match = re.match(r'postgres://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)', DATABASE_URL)
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

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173'
    ).split(',')
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

    # Additional security headers
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    X_FRAME_OPTIONS = 'DENY'

    # WhiteNoise compression and caching
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
