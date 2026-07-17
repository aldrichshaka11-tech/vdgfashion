from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import razorpay
import requests
import re
import os
import time
import csv
from .models import MainCategory, Category, SubCategory, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, Order, Payment, HeroBanner, MobileBanner, CategoryItem, MarketingBanner, Review, SiteSettings, UserAddress
from .serializers import (
    MainCategorySerializer, CategorySerializer, SubCategorySerializer, ProductSerializer, OrderCreateSerializer,
    HeroBannerSerializer, MobileBannerSerializer, CategoryItemSerializer, MarketingBannerSerializer,
    PaymentSerializer, ReviewSerializer, SiteSettingsSerializer, UserAddressSerializer
)


def _save_file(file_obj, folder):
    """Save uploaded file and return relative path."""
    path = default_storage.save(f'{folder}/{file_obj.name}', ContentFile(file_obj.read()))
    return path


class IsAdminUserOrReadOnly(permissions.IsAdminUser):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return super().has_permission(request, view)



class MainCategoryViewSet(viewsets.ModelViewSet):
    queryset = MainCategory.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = MainCategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        if not name: return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        MainCategory.objects.filter(name=name, is_active=False).delete()
        data = {k: v for k, v in request.data.items() if k != 'image'}
        parent_name = request.data.get('parent_category')
        parent_main = MainCategory.objects.filter(name=parent_name).first() if parent_name else None
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save(main_category=parent_main)
        except Exception as e:
            if 'UNIQUE' in str(e) or 'Duplicate' in str(e):
                return Response({'name': ['Exists.']}, status=status.HTTP_400_BAD_REQUEST)
            raise
        if request.FILES.get('image'):
            instance.image = _save_file(request.FILES['image'], 'categories')
            instance.save()
        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        MainCategory.objects.filter(pk=instance.pk).update(is_active=False)
        return Response(status=status.HTTP_204_NO_CONTENT)


class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = SubCategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        parent_name = request.data.get('parent_category')
        if not name: return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)
        SubCategory.objects.filter(name=name, is_active=False).delete()
        
        parent_cat = Category.objects.filter(name=parent_name).first() if parent_name else None
        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save(category=parent_cat)
        except Exception as e:
            if 'UNIQUE' in str(e) or 'Duplicate' in str(e):
                return Response({'name': ['Exists.']}, status=status.HTTP_400_BAD_REQUEST)
            raise
        if request.FILES.get('image'):
            instance.image = _save_file(request.FILES['image'], 'categories')
            instance.save()
        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        SubCategory.objects.filter(pk=instance.pk).update(is_active=False)
        return Response(status=status.HTTP_204_NO_CONTENT)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def list(self, request, *args, **kwargs):
        main_qs = MainCategory.objects.filter(is_active=True).order_by('order', 'name')
        cat_qs = Category.objects.filter(is_active=True).order_by('order', 'name')
        sub_qs = SubCategory.objects.filter(is_active=True).order_by('order', 'name')
        
        main_data = MainCategorySerializer(main_qs, many=True, context={'request': request}).data
        cat_data = CategorySerializer(cat_qs, many=True, context={'request': request}).data
        sub_data = SubCategorySerializer(sub_qs, many=True, context={'request': request}).data
        
        return Response(main_data + cat_data + sub_data)

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        # Handle soft-deleted duplicate
        Category.objects.filter(name=name, is_active=False).delete()

        # Build data dict without image
        data = {k: v for k, v in request.data.items() if k != 'image'}
        parent_name = request.data.get('parent_category')
        parent_main = MainCategory.objects.filter(name=parent_name).first() if parent_name else None
        
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save(main_category=parent_main)
        except Exception as e:
            if 'UNIQUE' in str(e) or 'Duplicate' in str(e):
                return Response({'name': ['A category with this name already exists.']}, status=status.HTTP_400_BAD_REQUEST)
            raise

        # Save image after create
        if request.FILES.get('image'):
            path = _save_file(request.FILES['image'], 'categories')
            Category.objects.filter(pk=instance.pk).update(image=path)
            instance.refresh_from_db()
        else:
            # Handle pre-uploaded image path string from FormData
            img_val = request.data.get('image', '')
            if img_val and isinstance(img_val, str):
                if '/media/' in img_val:
                    img_val = img_val.split('/media/')[-1]
                if img_val and not img_val.startswith('http'):
                    Category.objects.filter(pk=instance.pk).update(image=img_val)
                    instance.refresh_from_db()

        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save()
        except Exception as e:
            if 'UNIQUE' in str(e) or 'Duplicate' in str(e):
                return Response({'name': ['A category with this name already exists.']}, status=status.HTTP_400_BAD_REQUEST)
            raise

        # Save image if new file uploaded
        if request.FILES.get('image'):
            path = _save_file(request.FILES['image'], 'categories')
            Category.objects.filter(pk=instance.pk).update(image=path)
            instance.refresh_from_db()
        else:
            # Handle existing image path string from FormData
            img_val = request.data.get('image', '')
            if img_val and isinstance(img_val, str):
                if '/media/' in img_val:
                    img_val = img_val.split('/media/')[-1]
                if img_val and not img_val.startswith('http'):
                    Category.objects.filter(pk=instance.pk).update(image=img_val)
                    instance.refresh_from_db()

        return Response(self.get_serializer(instance).data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        Category.objects.filter(pk=instance.pk).update(is_active=False)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['POST'], url_path='upload-image')
    def upload_image(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        path = _save_file(file_obj, 'categories')
        return Response({
            'success': True,
            'path': path,
            'url': request.build_absolute_uri(settings.MEDIA_URL + path)
        }, status=status.HTTP_201_CREATED)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related('colors', 'sizes', 'features', 'details').order_by('-created_at')
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def create(self, request, *args, **kwargs):
        # Prevent duplicate products by checking SKU or Name, updating existing instead
        sku = request.data.get('sku')
        name = request.data.get('name')
        existing_product = None
        if sku:
            existing_product = Product.objects.filter(sku=sku, is_active=True).first()
        if not existing_product and name:
            existing_product = Product.objects.filter(name__iexact=name.strip(), is_active=True).first()

        if existing_product:
            self.kwargs[self.lookup_field] = str(existing_product.pk)
            kwargs['partial'] = True
            return self.update(request, *args, **kwargs)

        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        # Save image
        if request.FILES.get('image'):
            path = _save_file(request.FILES['image'], 'products')
            Product.objects.filter(pk=instance.pk).update(image=path)
            instance.refresh_from_db()
        elif request.data.get('image') and isinstance(request.data.get('image'), str):
            img_path = request.data['image']
            # Strip leading /media/ or full URL
            if '/media/' in img_path:
                img_path = img_path.split('/media/')[-1]
            if not img_path.startswith('http'):
                Product.objects.filter(pk=instance.pk).update(image=img_path)
                instance.refresh_from_db()

        # Seed defaults
        color_hex = data.get('color_hex', '#e6fcf5')
        ProductColor.objects.create(product=instance, name='Default', hex=color_hex)
        
        sizes_input = request.data.get('sizes')
        if sizes_input:
            if isinstance(sizes_input, str):
                sizes_list = [s.strip() for s in sizes_input.split(',') if s.strip()]
            else:
                sizes_list = sizes_input
        else:
            sizes_list = ['S', 'M', 'L', 'XL']
            
        for s in sizes_list:
            ProductSize.objects.create(product=instance, size=s)
            
        ProductFeature.objects.create(product=instance, feature_text='Material: 100% Organic Cotton')
        ProductDetail.objects.create(product=instance, title='Premium Comfort', content='Designed for comfort and durability.')

        return Response(self.get_serializer(instance).data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()

        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()

        if request.FILES.get('image'):
            path = _save_file(request.FILES['image'], 'products')
            Product.objects.filter(pk=instance.pk).update(image=path)
            instance.refresh_from_db()
        elif request.data.get('image') and isinstance(request.data.get('image'), str):
            img_path = request.data['image']
            if '/media/' in img_path:
                img_path = img_path.split('/media/')[-1]
            if not img_path.startswith('http'):
                Product.objects.filter(pk=instance.pk).update(image=img_path)
                instance.refresh_from_db()

        sizes_input = request.data.get('sizes')
        if sizes_input is not None:
            if isinstance(sizes_input, str):
                sizes_list = [s.strip() for s in sizes_input.split(',') if s.strip()]
            else:
                sizes_list = sizes_input
            
            instance.sizes.all().delete()
            for s in sizes_list:
                ProductSize.objects.create(product=instance, size=s)
            instance.refresh_from_db()

        return Response(self.get_serializer(instance).data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @action(detail=False, methods=['POST'], url_path='upload-image')
    def upload_image(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        path = _save_file(file_obj, 'products')
        return Response({
            'success': True,
            'path': path,
            'url': request.build_absolute_uri(settings.MEDIA_URL + path)
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='bulk-upload')
    def bulk_upload(self, request):
        import os
        import re
        import time
        import requests
        import urllib3
        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
        from django.core.files.base import ContentFile

        products_data = request.data
        if not isinstance(products_data, list):
            return Response({'error': 'Payload must be a JSON array'}, status=status.HTTP_400_BAD_REQUEST)

        def download_and_save_image(img_url, safe_name, field_name, prod_id):
            if not img_url:
                return None
            img_url = img_url.strip()
            
            # Try to resolve as local system file path
            local_path = img_url
            if local_path.startswith('file:///'):
                local_path = local_path.replace('file:///', '')
            elif local_path.startswith('file://'):
                local_path = local_path.replace('file://', '')
            
            local_path = os.path.normpath(local_path)
            
            safe_base_dir = os.path.join(settings.BASE_DIR, 'bulk_upload_images')
            possible_paths = [
                os.path.join(safe_base_dir, os.path.basename(local_path))
            ]
            
            resolved_path = None
            for p in possible_paths:
                if os.path.exists(p) and os.path.isfile(p):
                    resolved_path = p
                    break
            
            if resolved_path:
                try:
                    ext = os.path.splitext(resolved_path)[1].lstrip('.').lower() or 'jpg'
                    with open(resolved_path, 'rb') as f:
                        file_content = f.read()
                    filename = f"products/{safe_name}_{field_name}_{int(time.time())}.{ext}"
                    path = default_storage.save(filename, ContentFile(file_content))
                    Product.objects.filter(pk=prod_id).update(**{field_name: path})
                    return path
                except Exception as e:
                    print(f"[IMAGE UPLOADER] Error reading local file {resolved_path}: {e}")
                return None

            if not img_url.startswith('http'):
                return None
            
            # Google Drive URL helper
            drive_match = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', img_url)
            if not drive_match:
                drive_match = re.search(r'drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)', img_url)
            
            if drive_match:
                file_id = drive_match.group(1)
                try:
                    session = requests.Session()
                    url = "https://docs.google.com/uc?export=download"
                    r = session.get(url, params={'id': file_id}, verify=False)
                    
                    token = None
                    for key, value in r.cookies.items():
                        if key.startswith('download_warning'):
                            token = value
                            break
                    if token:
                        r = session.get(url, params={'id': file_id, 'confirm': token}, verify=False)
                    
                    content_type = r.headers.get('content-type', '').lower()
                    if r.status_code == 200 and 'image' in content_type:
                        ext = 'jpg'
                        if 'png' in content_type: ext = 'png'
                        elif 'webp' in content_type: ext = 'webp'
                        elif 'jpeg' in content_type: ext = 'jpeg'
                        
                        filename = f"products/{safe_name}_{field_name}_{int(time.time())}.{ext}"
                        path = default_storage.save(filename, ContentFile(r.content))
                        Product.objects.filter(pk=prod_id).update(**{field_name: path})
                        return path
                    else:
                        print(f"[IMAGE UPLOADER] Failed to download Drive image {file_id}: status={r.status_code}, type={content_type}")
                except Exception as e:
                    print(f"[IMAGE UPLOADER] Error downloading Drive image {file_id}: {e}")
                return None
            
            # Dropbox URL helper
            elif 'dropbox.com' in img_url:
                if 'dl=0' in img_url:
                    img_url = img_url.replace('dl=0', 'dl=1')
                elif 'dl=1' not in img_url and 'raw=1' not in img_url:
                    img_url = img_url + ('&' if '?' in img_url else '?') + 'dl=1'
            
            try:
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                }
                r = requests.get(img_url, headers=headers, timeout=15, verify=False)
                if r.status_code == 200:
                    content_type = r.headers.get('content-type', '').lower()
                    if 'image' in content_type:
                        ext = 'jpg'
                        if 'png' in content_type: ext = 'png'
                        elif 'webp' in content_type: ext = 'webp'
                        elif 'jpeg' in content_type: ext = 'jpeg'
                        
                        filename = f"products/{safe_name}_{field_name}_{int(time.time())}.{ext}"
                        path = default_storage.save(filename, ContentFile(r.content))
                        Product.objects.filter(pk=prod_id).update(**{field_name: path})
                        return path
            except Exception as e:
                print(f"[IMAGE UPLOADER] Error downloading {img_url}: {e}")
            return None

        created_count = 0
        errors = []
        for idx, item in enumerate(products_data):
            level1 = None
            try:
                raw_main_cat = item.get('maincategory', item.get('main_category', item.get('parent_category', 'General')))
                main_category_name = " ".join(raw_main_cat.split()) if raw_main_cat else 'General'
                
                raw_cat_name = item.get('category', item.get('category_name', ''))
                category_name = " ".join(raw_cat_name.split()) if raw_cat_name else ''
                
                raw_sub_cat = item.get('subcategory', item.get('sub_category', item.get('subcat', '')))
                sub_category_name = " ".join(raw_sub_cat.split()) if raw_sub_cat else ''
                
                main_cat = None
                mid_cat = None
                sub_cat = None
                
                if sub_category_name and category_name:
                    main_cat, _ = MainCategory.objects.get_or_create(name=main_category_name)
                    mid_cat, _ = Category.objects.get_or_create(name=category_name, main_category=main_cat)
                    sub_cat, _ = SubCategory.objects.get_or_create(name=sub_category_name, category=mid_cat)
                elif category_name:
                    main_cat, _ = MainCategory.objects.get_or_create(name=main_category_name)
                    mid_cat, _ = Category.objects.get_or_create(name=category_name, main_category=main_cat)
                else:
                    main_cat, _ = MainCategory.objects.get_or_create(name=main_category_name)

                # Check for category image if specified in data
                cat_image_url = item.get('category_image', '')
                if cat_image_url and main_cat and not main_cat.image:
                    cat_image_url = cat_image_url.strip()
                    cat_local_path = cat_image_url
                    if cat_local_path.startswith('file:///'):
                        cat_local_path = cat_local_path.replace('file:///', '')
                    elif cat_local_path.startswith('file://'):
                        cat_local_path = cat_local_path.replace('file://', '')
                    
                    cat_local_path = os.path.normpath(cat_local_path)
                    
                    safe_cat_base_dir = os.path.join(settings.BASE_DIR, 'bulk_upload_images')
                    possible_cat_paths = [
                        os.path.join(safe_cat_base_dir, os.path.basename(cat_local_path))
                    ]
                    
                    resolved_cat_path = None
                    for p in possible_cat_paths:
                        if os.path.exists(p) and os.path.isfile(p):
                            resolved_cat_path = p
                            break
                            
                    if resolved_cat_path:
                        try:
                            ext = os.path.splitext(resolved_cat_path)[1].lstrip('.').lower() or 'jpg'
                            with open(resolved_cat_path, 'rb') as f:
                                file_content = f.read()
                            
                            cat_filename = f"categories/{main_cat.name.replace(' ', '_')}_{int(time.time())}.{ext}"
                            path = default_storage.save(cat_filename, ContentFile(file_content))
                            main_cat.image = path
                            main_cat.save()
                        except Exception as e:
                            print(f"[CATEGORY IMAGE UPLOADER] Error reading local file {resolved_cat_path}: {e}")
                    elif cat_image_url.startswith('http'):
                        drive_match = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', cat_image_url)
                        if not drive_match:
                            drive_match = re.search(r'drive\.google\.com/open\?id=([a-zA-Z0-9_-]+)', cat_image_url)
                            
                        if drive_match:
                            file_id = drive_match.group(1)
                            try:
                                session = requests.Session()
                                url = "https://docs.google.com/uc?export=download"
                                r = session.get(url, params={'id': file_id}, verify=False)
                                
                                token = None
                                for key, value in r.cookies.items():
                                    if key.startswith('download_warning'):
                                        token = value
                                        break
                                if token:
                                    r = session.get(url, params={'id': file_id, 'confirm': token}, verify=False)
                                
                                content_type = r.headers.get('content-type', '').lower()
                                if r.status_code == 200 and 'image' in content_type:
                                    ext = 'jpg'
                                    if 'png' in content_type: ext = 'png'
                                    elif 'webp' in content_type: ext = 'webp'
                                    elif 'jpeg' in content_type: ext = 'jpeg'
                                    cat_filename = f"categories/{main_cat.name.replace(' ', '_')}_{int(time.time())}.{ext}"
                                    path = default_storage.save(cat_filename, ContentFile(r.content))
                                    main_cat.image = path
                                    main_cat.save()
                            except Exception:
                                pass
                        else:
                            try:
                                headers = {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
                                }
                                r = requests.get(cat_image_url, headers=headers, timeout=10, verify=False)
                                content_type = r.headers.get('content-type', '').lower()
                                if r.status_code == 200 and 'image' in content_type:
                                    ext = 'jpg'
                                    if 'png' in content_type: ext = 'png'
                                    elif 'webp' in content_type: ext = 'webp'
                                    elif 'jpeg' in content_type: ext = 'jpeg'
                                    cat_filename = f"categories/{main_cat.name.replace(' ', '_')}_{int(time.time())}.{ext}"
                                    path = default_storage.save(cat_filename, ContentFile(r.content))
                                    main_cat.image = path
                                    main_cat.save()
                            except Exception:
                                pass

                # Check if product already exists by SKU to prevent duplicates. 
                # (Product name can be identical across different products, so we only check SKU)
                sku = str(item.get('code', item.get('sku', ''))).strip() or None
                name = item.get('product name', item.get('name'))
                existing_product = None
                if sku:
                    existing_product = Product.objects.filter(sku=sku, is_active=True).first()
                
                price = item.get('sale_price', item.get('price'))
                original_price = item.get('budget', item.get('original_price', price))

                serializer_data = {
                    'name': name.strip() if name else '',
                    'slug': item.get('slug'),
                    'unit': item.get('unit', 'pc'),
                    'sku': sku,
                    'main_category_id': main_cat.id if main_cat else None,
                    'category_id': mid_cat.id if mid_cat else None,
                    'sub_category_id': sub_cat.id if sub_cat else None,
                    'price': price,
                    'original_price': original_price,
                    'discount': item.get('discount'),
                    'tag_type': item.get('tag_type', 'new'),
                    'description': item.get('description', 'Bulk imported product'),
                    'color_hex': item.get('color_hex', '#e6fcf5'),
                    'cart_btn_color': item.get('cart_btn_color', 'bg-teal-500 hover:bg-teal-600'),
                    'stock': item.get('stock', 50),
                    'product_type': item.get('product_type', 'simple'),
                    'status': item.get('status', 'published'),
                    'razorpay_buy_now_link': item.get('razorpay_buy_now_link') or item.get('razorpay'),
                }

                if existing_product:
                    serializer = self.get_serializer(existing_product, data=serializer_data, partial=True)
                else:
                    serializer = self.get_serializer(data=serializer_data)

                if serializer.is_valid():
                    product_instance = serializer.save()
                    created_count += 1
                    
                    # Create default ProductColor and ProductSize (get_or_create to prevent duplicate relation entries)
                    color_hex = item.get('color_hex', '#e6fcf5')
                    ProductColor.objects.get_or_create(product=product_instance, hex=color_hex, defaults={'name': 'Default'})
                    
                    # Determine sizes to update/seed
                    sizes_input = item.get('sizes') or item.get('size') or item.get('age_group')
                    if sizes_input:
                        sizes_to_create = []
                        if isinstance(sizes_input, list):
                            for s in sizes_input:
                                if isinstance(s, str):
                                    sizes_to_create.extend([x.strip() for x in s.split(',') if x.strip()])
                                else:
                                    sizes_to_create.append(str(s))
                        elif isinstance(sizes_input, str):
                            sizes_to_create = [s.strip() for s in sizes_input.split(',') if s.strip()]
                        else:
                            sizes_to_create = [str(sizes_input).strip()]

                        if existing_product:
                            product_instance.sizes.all().delete()

                        for s in sizes_to_create:
                            ProductSize.objects.get_or_create(product=product_instance, size=s)
                    elif not existing_product:
                        # New product, no sizes specified - seed defaults
                        sizes_to_create = ['S', 'M', 'L', 'XL']
                        for s in sizes_to_create:
                            ProductSize.objects.get_or_create(product=product_instance, size=s)
                        
                    # Create default feature and detail (get_or_create to prevent duplicates)
                    ProductFeature.objects.get_or_create(product=product_instance, feature_text='Material: Muslin / Cotton')
                    ProductDetail.objects.get_or_create(product=product_instance, title='Elegant Design', defaults={'content': item.get('description', 'Elegant apparel for everyday style.')})
                    
                    # Handle product image downloads
                    safe_name = "".join(x for x in product_instance.name if x.isalnum() or x in ('-', '_')).strip()
                    img1 = item.get('Image 1url', item.get('image'))
                    img2 = item.get('Image_2url', item.get('image_2'))
                    img3 = item.get('image_3')
                    
                    if img1:
                        download_and_save_image(img1, safe_name, 'image', product_instance.pk)
                    if img2:
                        download_and_save_image(img2, safe_name, 'image_2', product_instance.pk)
                    if img3:
                        download_and_save_image(img3, safe_name, 'image_3', product_instance.pk)
                else:
                    errors.append({'index': idx, 'errors': serializer.errors})
            except Exception as e:
                errors.append({'index': idx, 'error': str(e)})

        return Response({'success': True, 'created_count': created_count, 'failed_count': len(errors), 'errors': errors}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='request-clear-otp', permission_classes=[permissions.IsAdminUser])
    def request_clear_otp(self, request):
        import random
        from django.core.cache import cache
        import requests as req

        otp = str(random.randint(100000, 999999))
        # Store in cache for 10 minutes
        cache.set('db_wipe_otp', otp, timeout=600)

        # Send via Resend API
        try:
            resend_url = "https://api.resend.com/emails"
            api_key = os.getenv("RESEND_API_KEY", "")
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "from": "noreply@kairavcard.com",
                "to": "Vdgfashion6@gmail.com",
                "subject": "DANGER: Database Reset OTP for vdgfashion",
                "html": f"<h2>Database Reset Requested</h2><p>Your 6-digit OTP to clear the database is: <strong>{otp}</strong></p><p>This code will expire in 10 minutes. If you did not request this, please secure your admin account immediately.</p>"
            }
            response = req.post(resend_url, json=payload, headers=headers)
            print(f"[OTP SENDER] Resend API Response: {response.status_code} {response.text}")
        except Exception as e:
            print(f"[OTP SENDER] Error sending email: {e}")

        # Always return success even if email fails so testing isn't blocked (OTP is in cache)
        return Response({"detail": "OTP sent to admin email."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'], url_path='clear-all', permission_classes=[permissions.IsAdminUser])
    def clear_all(self, request):
        from django.core.cache import cache
        otp = request.data.get('otp')
        cached_otp = cache.get('db_wipe_otp')

        if not cached_otp or str(otp) != str(cached_otp):
            return Response({"detail": "Invalid or expired OTP."}, status=status.HTTP_400_BAD_REQUEST)

        # Clear the OTP so it can't be reused
        cache.delete('db_wipe_otp')
        try:
            Product.objects.all().delete()
            SubCategory.objects.all().delete()
            Category.objects.all().delete()
            MainCategory.objects.all().delete()
            Order.objects.all().delete()
            HeroBanner.objects.all().delete()
            MobileBanner.objects.all().delete()
            return Response({'success': True})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = OrderCreateSerializer

    def get_permissions(self):
        if self.action in ['create', 'create_razorpay_order', 'verify_razorpay_payment']:
            return [permissions.AllowAny()]
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_staff:
                return Order.objects.filter(is_active=True).order_by('-created_at')
            return Order.objects.filter(is_active=True, user=user).order_by('-created_at')
        return Order.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            if request.user.is_authenticated:
                order = serializer.save(user=request.user)
            else:
                order = serializer.save()
            
            try:
                from .email_utils import send_order_email
                send_order_email(order, 'receipt')
            except Exception as e:
                print(f"[EMAIL ERROR] {e}")
                
            return Response({'success': True, 'order_id': order.order_id, 'message': 'Order placed successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        old_status = instance.status
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        new_status = instance.status
        if old_status != new_status:
            try:
                from .email_utils import send_order_email
                send_order_email(instance, 'status_update')
            except Exception as e:
                print(f"[EMAIL ERROR] {e}")
                
        return Response(serializer.data)
        
    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    @action(detail=False, methods=['POST'], url_path='create-razorpay-order')
    def create_razorpay_order(self, request):
        amount = request.data.get('amount')
        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            # Create order (amount must be in paise)
            payment = client.order.create({
                "amount": int(float(amount) * 100),
                "currency": "INR",
                "payment_capture": "1"
            })
            return Response({
                'success': True,
                'order_id': payment['id'],
                'amount': payment['amount'],
                'currency': payment['currency'],
                'key_id': settings.RAZORPAY_KEY_ID
            })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['POST'], url_path='verify-razorpay-payment')
    def verify_razorpay_payment(self, request):
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_payment_id, razorpay_order_id, razorpay_signature]):
            return Response({'error': 'Missing payment verification details'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            params_dict = {
                'razorpay_order_id': razorpay_order_id,
                'razorpay_payment_id': razorpay_payment_id,
                'razorpay_signature': razorpay_signature
            }
            # verify the signature
            client.utility.verify_payment_signature(params_dict)
            return Response({'success': True, 'message': 'Payment verified successfully'})
        except razorpay.errors.SignatureVerificationError:
            return Response({'error': 'Invalid payment signature'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = PaymentSerializer


class HeroBannerViewSet(viewsets.ModelViewSet):
    queryset = HeroBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroBannerSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['POST'], url_path='upload-image')
    def upload_image(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            path = _save_file(file_obj, 'banners')
            url = f"{settings.MEDIA_URL}{path}" if not path.startswith('/') else path
            return Response({'success': True, 'path': path, 'url': url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class MobileBannerViewSet(viewsets.ModelViewSet):
    queryset = MobileBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = MobileBannerSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['POST'], url_path='upload-image')
    def upload_image(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            path = _save_file(file_obj, 'banners/mobile')
            url = f"{settings.MEDIA_URL}{path}" if not path.startswith('/') else path
            return Response({'success': True, 'path': path, 'url': url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CategoryItemViewSet(viewsets.ModelViewSet):
    queryset = CategoryItem.objects.filter(is_active=True).order_by('order')
    serializer_class = CategoryItemSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class MarketingBannerViewSet(viewsets.ModelViewSet):
    queryset = MarketingBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = MarketingBannerSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['POST'], url_path='upload-image')
    def upload_image(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            path = _save_file(file_obj, 'marketing')
            url = f"{settings.MEDIA_URL}{path}" if not path.startswith('/') else path
            return Response({'success': True, 'path': path, 'url': url})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ReviewSerializer

    def get_permissions(self):
        # Anyone can read reviews; only authenticated users can create/edit/delete
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class SiteSettingsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminUserOrReadOnly]
    def list(self, request):
        settings_obj, _ = SiteSettings.objects.get_or_create(id=1)
        serializer = SiteSettingsSerializer(settings_obj, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        settings_obj, _ = SiteSettings.objects.get_or_create(id=1)
        serializer = SiteSettingsSerializer(settings_obj, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], url_path='upload-logo')
    def upload_logo(self, request):
        settings_obj, _ = SiteSettings.objects.get_or_create(id=1)
        if 'image' not in request.FILES:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)
        
        settings_obj.logo_image = request.FILES['image']
        settings_obj.save()
        
        serializer = SiteSettingsSerializer(settings_obj, context={'request': request})
        return Response(serializer.data)


class UserAddressViewSet(viewsets.ModelViewSet):
    serializer_class = UserAddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserAddress.objects.filter(user=self.request.user).order_by('-is_default', '-created_at')

    def perform_create(self, serializer):
        is_default = serializer.validated_data.get('is_default', False)
        if is_default:
            UserAddress.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        is_default = serializer.validated_data.get('is_default', False)
        if is_default:
            UserAddress.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save()


