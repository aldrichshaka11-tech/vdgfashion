from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.core.cache import cache
from .models import Category, Product, HeroBanner, CategoryItem, MarketingBanner

@receiver([post_save, post_delete], sender=Category)
def invalidate_category_cache(sender, instance, **kwargs):
    try:
        cache.delete("categories_list_cache")
    except Exception as e:
        print(f"[Cache Invalidation Warning] (Category): Redis is likely offline ({e})")

@receiver([post_save, post_delete], sender=Product)
def invalidate_product_cache(sender, instance, **kwargs):
    try:
        cache.delete("products_list_cache")
    except Exception as e:
        print(f"[Cache Invalidation Warning] (Product): Redis is likely offline ({e})")

@receiver([post_save, post_delete], sender=HeroBanner)
def invalidate_hero_banner_cache(sender, instance, **kwargs):
    try:
        cache.delete("hero_banners_list_cache")
    except Exception as e:
        print(f"[Cache Invalidation Warning] (HeroBanner): Redis is likely offline ({e})")

@receiver([post_save, post_delete], sender=CategoryItem)
def invalidate_category_item_cache(sender, instance, **kwargs):
    try:
        cache.delete("category_items_list_cache")
    except Exception as e:
        print(f"[Cache Invalidation Warning] (CategoryItem): Redis is likely offline ({e})")

@receiver([post_save, post_delete], sender=MarketingBanner)
def invalidate_marketing_banner_cache(sender, instance, **kwargs):
    try:
        cache.delete("marketing_banners_list_cache")
    except Exception as e:
        print(f"[Cache Invalidation Warning] (MarketingBanner): Redis is likely offline ({e})")
