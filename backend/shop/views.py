from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
from .models import Category, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, Order, Payment, HeroBanner, CategoryItem, MarketingBanner, Review
from .serializers import (
    CategorySerializer, ProductSerializer, OrderCreateSerializer,
    HeroBannerSerializer, CategoryItemSerializer, MarketingBannerSerializer,
    PaymentSerializer, ReviewSerializer
)


def _save_file(file_obj, folder):
    """Save uploaded file and return relative path."""
    path = default_storage.save(f'{folder}/{file_obj.name}', ContentFile(file_obj.read()))
    return path


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = CategorySerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        name = request.data.get('name', '').strip()
        if not name:
            return Response({'name': ['This field is required.']}, status=status.HTTP_400_BAD_REQUEST)

        # Handle soft-deleted duplicate
        Category.objects.filter(name=name, is_active=False).delete()

        # Build data dict without image
        data = {k: v for k, v in request.data.items() if k != 'image'}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        try:
            instance = serializer.save()
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

    def create(self, request, *args, **kwargs):
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
        for s in ['S', 'M', 'L', 'XL']:
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
        products_data = request.data
        if not isinstance(products_data, list):
            return Response({'error': 'Payload must be a JSON array'}, status=status.HTTP_400_BAD_REQUEST)

        created_count = 0
        errors = []
        for idx, item in enumerate(products_data):
            try:
                category_name = item.get('category_name', 'General')
                category, _ = Category.objects.get_or_create(name=category_name)
                serializer = self.get_serializer(data={
                    'name': item.get('name'),
                    'slug': item.get('slug'),
                    'unit': item.get('unit', 'pc'),
                    'sku': item.get('sku'),
                    'category': category.id,
                    'parent_category': item.get('parent_category', ''),
                    'price': item.get('price'),
                    'original_price': item.get('original_price', item.get('price')),
                    'discount': item.get('discount'),
                    'tag_type': item.get('tag_type', 'new'),
                    'description': item.get('description', 'Bulk imported product'),
                    'color_hex': item.get('color_hex', '#e6fcf5'),
                    'cart_btn_color': item.get('cart_btn_color', 'bg-teal-500 hover:bg-teal-600'),
                    'stock': item.get('stock', 50),
                    'product_type': item.get('product_type', 'simple'),
                    'status': item.get('status', 'published'),
                })
                if serializer.is_valid():
                    serializer.save()
                    created_count += 1
                else:
                    errors.append({'index': idx, 'errors': serializer.errors})
            except Exception as e:
                errors.append({'index': idx, 'error': str(e)})

        return Response({'success': True, 'created_count': created_count, 'failed_count': len(errors), 'errors': errors}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['POST'], url_path='clear-all')
    def clear_all(self, request):
        try:
            Product.objects.all().delete()
            Category.objects.all().delete()
            Order.objects.all().delete()
            HeroBanner.objects.all().delete()
            return Response({'success': True})
        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = OrderCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            order = serializer.save()
            return Response({'success': True, 'order_id': order.order_id, 'message': 'Order placed successfully!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = PaymentSerializer


class HeroBannerViewSet(viewsets.ModelViewSet):
    queryset = HeroBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = HeroBannerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class CategoryItemViewSet(viewsets.ModelViewSet):
    queryset = CategoryItem.objects.filter(is_active=True).order_by('order')
    serializer_class = CategoryItemSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class MarketingBannerViewSet(viewsets.ModelViewSet):
    queryset = MarketingBanner.objects.filter(is_active=True).order_by('order')
    serializer_class = MarketingBannerSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = ReviewSerializer
