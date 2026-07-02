import os
from pathlib import Path
import environ
from datetime import timedelta

# Initialize environ
env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
SECRET_KEY = env.str('SECRET_KEY', 'django-insecure-t5u8-#3q%cj^u+w*qu@v9-^&203ln06=umd!%l!z!u@7h)jrae')

ALLOWED_HOSTS = env.list('ALLOWED_HOSTS', default=['*'])

# Application definition
INSTALLED_APPS = [
    # Premium theme MUST be loaded before django.contrib.admin
    'jazzmin',
    
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    'django_filters',
    'rest_framework_simplejwt',
    
    # Project apps
    'shop',
    'authentication',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ecommerce_backend.urls'

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

WSGI_APPLICATION = 'ecommerce_backend.wsgi.application'

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
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

CORS_ALLOW_ALL_ORIGINS = True

# REST Framework configurations
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'django_filters.rest_framework.DjangoFilterBackend',
    ),
}

# Simple JWT configurations
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Redis Caching with LocMemCache fallback
import socket

def _check_redis_port(host, port):
    try:
        with socket.create_connection((host, port), timeout=1.0) as sock:
            return True
    except Exception:
        return False

redis_url = env.str('REDIS_URL', 'redis://127.0.0.1:6379/1')
redis_host = '127.0.0.1'
redis_port = 6379

if redis_url.startswith('redis://'):
    try:
        parts = redis_url[8:].split('/')[0].split(':')
        redis_host = parts[0]
        if len(parts) > 1:
            redis_port = int(parts[1])
    except Exception:
        pass

if _check_redis_port(redis_host, redis_port):
    print("[OK] Redis is running on {}:{}. Using Redis Cache...".format(redis_host, redis_port))
    CACHES = {
        'default': {
            'BACKEND': 'django_redis.cache.RedisCache',
            'LOCATION': redis_url,
            'OPTIONS': {
                'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            }
        }
    }
else:
    print("[WARNING] Redis is NOT running on {}:{}. Falling back to In-Memory Cache (LocMemCache)...".format(redis_host, redis_port))
    CACHES = {
        'default': {
            'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
            'LOCATION': 'unique-snowflake',
        }
    }

# Jazzmin Dashboard configurations
JAZZMIN_SETTINGS = {
    "site_title": "vdgfashion Admin Portal",
    "site_header": "vdgfashion Admin",
    "site_brand": "vdgfashion Admin",
    "site_logo_classes": "img-circle",
    "welcome_sign": "Welcome back! Sign in to vdgfashion Admin Panel",
    "copyright": "vdgfashion Ltd",
    "search_model": ["shop.Product"],
    "show_sidebar": True,
    "navigation_expanded": True,
    "icons": {
        "auth.Group": "fas fa-users",
        "auth.User": "fas fa-user",
        "shop.Category": "fas fa-list-alt",
        "shop.Product": "fas fa-shopping-bag",
        "shop.Order": "fas fa-shopping-cart",
        "shop.HeroBanner": "fas fa-image",
        "shop.CategoryItem": "fas fa-folder",
        "shop.MarketingBanner": "fas fa-ad",
    },
    "default_icon_parents": "fas fa-chevron-circle-right",
    "default_icon_children": "fas fa-circle",
    "topmenu_links": [
        {"name": "Home", "url": "admin:index", "permissions": ["auth.view_user"]},
        {"name": "Frontend Shop", "url": "http://localhost:3000", "new_window": True},
    ],
    "show_ui_builder": True,
}

JAZZMIN_UI_TWEAKS = {
    "navbar_small_text": False,
    "footer_small_text": False,
    "body_small_text": False,
    "brand_small_text": False,
    "brand_colour": "navbar-indigo",
    "accent": "accent-indigo",
    "navbar": "navbar-indigo navbar-dark",
    "no_navbar_border": False,
    "navbar_fixed": False,
    "layout_boxed": False,
    "footer_fixed": False,
    "sidebar_fixed": False,
    "sidebar": "sidebar-dark-indigo",
    "sidebar_nav_small_text": False,
    "sidebar_disable_expand": False,
    "sidebar_nav_child_indent": False,
    "sidebar_nav_compact_style": False,
    "sidebar_nav_legacy_style": False,
    "sidebar_nav_flat_style": False,
    "theme": "flatly",
    "dark_mode_theme": "darkly",
    "button_classes": {
        "primary": "btn-primary",
        "secondary": "btn-secondary",
        "info": "btn-info",
        "warning": "btn-warning",
        "success": "btn-success"
    }
}

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = env.str('SMTP_HOST', 'smtp.gmail.com')
EMAIL_PORT = env.int('SMTP_PORT', 2525)
EMAIL_HOST_USER = env.str('SMTP_USER', '')
EMAIL_HOST_PASSWORD = env.str('SMTP_PASS', '')
EMAIL_USE_TLS = env.bool('SMTP_USE_TLS', True)
EMAIL_USE_SSL = env.bool('SMTP_USE_SSL', False)
DEFAULT_FROM_EMAIL = env.str('DEFAULT_FROM_EMAIL', EMAIL_HOST_USER)

# Razorpay Configuration
RAZORPAY_KEY_ID = env.str('RAZORPAY_KEY_ID', '')
RAZORPAY_KEY_SECRET = env.str('RAZORPAY_KEY_SECRET', '')
