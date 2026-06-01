from .base import *

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': env.str('DB_NAME', 'fashion_db'),
        'USER': env.str('DB_USER', 'root'),
        'PASSWORD': env.str('DB_PASSWORD', ''),
        'HOST': env.str('DB_HOST', '127.0.0.1'),
        'PORT': env.str('DB_PORT', '3306'),
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}
