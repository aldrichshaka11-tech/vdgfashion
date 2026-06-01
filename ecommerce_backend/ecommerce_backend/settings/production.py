from .base import *

DEBUG = False

# Production security headers
SECURE_SSL_REDIRECT = env.bool('SECURE_SSL_REDIRECT', True)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True

DATABASES = {
    'default': env.db('DATABASE_URL', default='mysql://root:@127.0.0.1:3306/fashion_db')
}
