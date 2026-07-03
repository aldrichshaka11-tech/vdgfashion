import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.contrib.auth.models import User

username = 'vdgadmin'
email = 'Vdgfashion6@gmail.com'
password = 'vdgadmin123'

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"SUCCESS: Admin user created!")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Admin Panel: http://localhost:8000/admin")
else:
    print(f"Admin user already exists!")
