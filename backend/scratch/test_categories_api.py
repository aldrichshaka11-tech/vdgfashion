import os
import sys

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings.base')

import django
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth.models import User
from shop.models import MainCategory, Category, SubCategory

def test_api():
    # Setup test admin user
    user, _ = User.objects.get_or_create(username='testadmin', is_staff=True, is_superuser=True)
    user.set_password('password123')
    user.save()
    
    client = APIClient()
    client.force_authenticate(user=user)
    
    print("=== Testing MainCategory Creation ===")
    res = client.post('/api/main-categories/', {'name': 'Test Main'}, format='json')
    print("Status:", res.status_code)
    print("Response:", res.json())
    
    print("\n=== Testing Category Creation ===")
    res = client.post('/api/categories/', {'name': 'Test Cat', 'parent_category': 'Test Main'}, format='json')
    print("Status:", res.status_code)
    print("Response:", res.json())
    
    print("\n=== Testing SubCategory Creation ===")
    res = client.post('/api/sub-categories/', {'name': 'Test Sub', 'parent_category': 'Test Cat'}, format='json')
    print("Status:", res.status_code)
    print("Response:", res.json())
    
    print("\n=== Testing Global List ===")
    res = client.get('/api/categories/')
    print("Status:", res.status_code)
    print("Response items count:", len(res.json()))
    
    # Clean up
    MainCategory.objects.all().delete()
    user.delete()

if __name__ == '__main__':
    test_api()
