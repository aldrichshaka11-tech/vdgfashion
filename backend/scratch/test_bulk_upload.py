import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from django.test import RequestFactory
from django.contrib.auth.models import User
from rest_framework.test import force_authenticate
from shop.views import ProductViewSet
from shop.models import MainCategory, Category, SubCategory, Product

def test_bulk_upload():
    factory = RequestFactory()
    user, _ = User.objects.get_or_create(username='vdgadmin')
    
    data = [
        {
            "code": "05Y176",
            "maincategory": "kids dresses",
            "budget": 299,
            "category": "5 - 6 Year",
            "subcategory": "T-SHIRT",
            "size": "5 - 6 Year",
            "product name": "T-SHIRT (05Y176)ROUND NECK",
            "stock": 1,
            "sale_price": 199,
            "description": "cotton mix",
            "Image 1url": "https://example.com/img1.jpg",
            "Image_2url": "https://example.com/img2.jpg"
        }
    ]

    request = factory.post('/api/products/bulk_upload/', data, content_type='application/json')
    force_authenticate(request, user=user)
    
    view = ProductViewSet.as_view({'post': 'bulk_upload'})
    response = view(request)
    
    print("Response Status:", response.status_code)
    print("Response Data:", response.data)
    
    print("\n--- DB Check ---")
    print("Main Categories:", list(MainCategory.objects.all().values('name')))
    print("Categories:", list(Category.objects.all().values('name', 'main_category__name')))
    print("Sub Categories:", list(SubCategory.objects.all().values('name', 'category__name')))
    
    p = Product.objects.last()
    if p:
        print(f"Product: {p.name}")
        print(f"  MainCat: {p.main_category.name if p.main_category else None}")
        print(f"  Cat: {p.category.name if p.category else None}")
        print(f"  SubCat: {p.sub_category.name if p.sub_category else None}")
    else:
        print("Product not created!")

if __name__ == '__main__':
    test_bulk_upload()
