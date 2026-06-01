from .base import *
import socket

DEBUG = True

# Function to check if a port is open
def _check_db_port(host, port):
    try:
        with socket.create_connection((host, port), timeout=1.0) as sock:
            return True
    except Exception:
        return False

mysql_host = env.str('DB_HOST', '127.0.0.1')
mysql_port = env.int('DB_PORT', 3306)

if _check_db_port(mysql_host, mysql_port):
    print("[OK] MySQL is running on {}:{}. Connecting to MySQL database...".format(mysql_host, mysql_port))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': env.str('DB_NAME', 'fashion_db'),
            'USER': env.str('DB_USER', 'root'),
            'PASSWORD': env.str('DB_PASSWORD', ''),
            'HOST': mysql_host,
            'PORT': str(mysql_port),
            'OPTIONS': {
                'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
            }
        }
    }
else:
    print("[WARNING] MySQL is NOT running on {}:{}. Falling back to local SQLite database...".format(mysql_host, mysql_port))
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
