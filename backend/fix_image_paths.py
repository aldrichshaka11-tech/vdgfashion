import os
import django
import sys

# Setup Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings')
django.setup()

from shop.models import Product, Category, HeroBanner, MobileBanner, MarketingBanner, CategoryItem

def fix_paths(model_class, field_name='image'):
    instances = model_class.objects.filter(**{f"{field_name}__icontains": "C:/"})
    count = instances.count()
    if count == 0:
        return 0
    
    for instance in instances:
        setattr(instance, field_name, '')
        instance.save()
        
    return count

def run():
    print("Fixing broken local Windows image paths in the live database...")
    total_fixed = 0
    
    total_fixed += fix_paths(Product, 'image')
    total_fixed += fix_paths(Product, 'image_2')
    total_fixed += fix_paths(Product, 'image_3')
    total_fixed += fix_paths(Category, 'image')
    total_fixed += fix_paths(HeroBanner, 'image')
    total_fixed += fix_paths(MobileBanner, 'image')
    total_fixed += fix_paths(MarketingBanner, 'image')
    total_fixed += fix_paths(CategoryItem, 'image')
    
    print(f"Successfully removed {total_fixed} broken image paths.")
    print("The frontend will now display the default placeholder instead of broken image icons.")
    print("Please re-upload your images using Google Drive links or by uploading them to the 'bulk_upload_images' folder on the server.")

if __name__ == '__main__':
    run()
