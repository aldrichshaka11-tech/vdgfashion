from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.cache import cache
from .models import Category, Product, Order, Payment, HeroBanner, CategoryItem, MarketingBanner
from .serializers import (
    CategorySerializer, ProductSerializer, OrderCreateSerializer, 
    HeroBannerSerializer, CategoryItemSerializer, MarketingBannerSerializer,
    PaymentSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = CategorySerializer

    def list(self, request, *args, **kwargs):
        cache_key = "categories_list_cache"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on get: {e}")
        
        response = super().list(request, *args, **kwargs)
        try:
            cache.set(cache_key, response.data, timeout=86400)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on set: {e}")
        return response

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related('colors', 'sizes', 'features', 'details').order_by('-created_at')
    serializer_class = ProductSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "products_list_cache"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on get: {e}")
        
        response = super().list(request, *args, **kwargs)
        try:
            cache.set(cache_key, response.data, timeout=86400)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on set: {e}")
        return response

    @action(detail=False, methods=['POST'], url_path='bulk-upload')
    def bulk_upload(self, request):
        products_data = request.data
        if not isinstance(products_data, list):
            return Response({"error": "Payload must be a JSON array of products"}, status=status.HTTP_400_BAD_REQUEST)

        created_count = 0
        errors = []

        for idx, item in enumerate(products_data):
            try:
                # Find or create category
                category_name = item.get('category_name', 'Apparel')
                category, _ = Category.objects.get_or_create(name=category_name)

                # Build serializer
                serializer = self.get_serializer(data={
                    "name": item.get('name'),
                    "slug": item.get('slug'),
                    "unit": item.get('unit', 'pc'),
                    "sku": item.get('sku'),
                    "category": category.id,
                    "parent_category": item.get('parent_category', 'New Born (0–3 Months)'),
                    "price": item.get('price'),
                    "original_price": item.get('original_price', item.get('price')),
                    "discount": item.get('discount'),
                    "tag_type": item.get('tag_type', 'new'),
                    "description": item.get('description', 'Bulk imported product'),
                    "color_hex": item.get('color_hex', '#e6fcf5'),
                    "cart_btn_color": item.get('cart_btn_color', 'bg-teal-500 hover:bg-teal-600'),
                    "stock": item.get('stock', 50),
                    "width": item.get('width'),
                    "height": item.get('height'),
                    "length": item.get('length'),
                    "product_type": item.get('product_type', 'simple'),
                    "status": item.get('status', 'published')
                })

                if serializer.is_valid():
                    serializer.save()
                    created_count += 1
                else:
                    errors.append({"index": idx, "errors": serializer.errors})
            except Exception as e:
                errors.append({"index": idx, "error": str(e)})

        # Clear products cache in Redis
        try:
            cache.delete("products_list_cache")
        except Exception as e:
            print(f"[Cache Warning] Redis offline on delete: {e}")

        return Response({
            "success": True,
            "created_count": created_count,
            "failed_count": len(errors),
            "errors": errors
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='upload-image')
    def upload_image(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)
        
        from django.core.files.storage import default_storage
        from django.core.files.base import ContentFile
        from django.conf import settings
        
        # Save file to media/products/
        filename = file_obj.name
        path = default_storage.save(f'products/{filename}', ContentFile(file_obj.read()))
        
        return Response({
            "success": True,
            "path": path,
            "url": request.build_absolute_uri(settings.MEDIA_URL + path)
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='clear-all')
    def clear_all(self, request):
        try:
            Product.objects.all().delete()
            Category.objects.all().delete()
            Order.objects.all().delete()
            HeroBanner.objects.all().delete()
            
            try:
                cache.delete("products_list_cache")
                cache.delete("categories_list_cache")
                cache.delete("hero_banners_list_cache")
            except Exception as e:
                print(f"[Cache Warning] Redis offline on delete: {e}")
            
            return Response({"success": True, "message": "Database successfully cleared!"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            return Response({
                "success": True,
                "order_id": order.order_id,
                "message": "Order placed successfully!"
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = PaymentSerializer


class HeroBannerViewSet(viewsets.ModelViewSet):
    queryset = HeroBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroBannerSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "hero_banners_list_cache"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on get: {e}")
        
        response = super().list(request, *args, **kwargs)
        try:
            cache.set(cache_key, response.data, timeout=86400)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on set: {e}")
        return response


class CategoryItemViewSet(viewsets.ModelViewSet):
    queryset = CategoryItem.objects.filter(is_active=True).order_by('order')
    serializer_class = CategoryItemSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "category_items_list_cache"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on get: {e}")
        
        response = super().list(request, *args, **kwargs)
        try:
            cache.set(cache_key, response.data, timeout=86400)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on set: {e}")
        return response


class MarketingBannerViewSet(viewsets.ModelViewSet):
    queryset = MarketingBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = MarketingBannerSerializer

    def list(self, request, *args, **kwargs):
        cache_key = "marketing_banners_list_cache"
        try:
            cached_data = cache.get(cache_key)
            if cached_data is not None:
                return Response(cached_data)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on get: {e}")
        
        response = super().list(request, *args, **kwargs)
        try:
            cache.set(cache_key, response.data, timeout=86400)
        except Exception as e:
            print(f"[Cache Warning] Redis offline on set: {e}")
        return response

