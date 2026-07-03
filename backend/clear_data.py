import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from shop.models import Product, Category, ProductColor, ProductSize, ProductFeature, ProductDetail

def clear_all_products():
    print("Clearing all products and categories from the database...")
    
    # Delete all products (this will automatically cascade and delete sizes, colors, etc.)
    deleted_products = Product.objects.all().delete()
    print(f"Deleted products: {deleted_products}")
    
    # Delete all categories
    deleted_categories = Category.objects.all().delete()
    print(f"Deleted categories: {deleted_categories}")
    
    print("Database is now clean and ready for a fresh bulk upload!")

if __name__ == '__main__':
    clear_all_products()
