import os
from pathlib import Path
import environ

# Initialize environ
env = environ.Env()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load environment variables from .env
env_file = BASE_DIR / '.env'
if env_file.exists():
    environ.Env.read_env(str(env_file))

# Determine environment: local or production
ENVIRONMENT = env.str('DJANGO_ENV', 'local')

if ENVIRONMENT == 'production':
    from .production import *
else:
    from .local import *
