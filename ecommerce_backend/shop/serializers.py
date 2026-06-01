from rest_framework import serializers
from .models import Category, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, Order, OrderItem, Payment, HeroBanner, CategoryItem, MarketingBanner, Review

class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ['name', 'hex']

class ProductSizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductSize
        fields = ['size']

class ProductFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFeature
        fields = ['feature_text']

class ProductDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetail
        fields = ['title', 'content']

class ProductSerializer(serializers.ModelSerializer):
    colors = ProductColorSerializer(many=True, read_only=True)
    sizes = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    details = ProductDetailSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    thumbnails = serializers.SerializerMethodField()
    image = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'unit', 'sku', 'category', 'category_name', 'parent_category', 
            'price', 'original_price', 'discount', 'tag_type', 
            'rating', 'reviews_count', 'is_new', 'description', 
            'image', 'thumbnails', 'color_hex', 'cart_btn_color', 'stock',
            'width', 'height', 'length', 'product_type', 'status',
            'colors', 'sizes', 'features', 'details'
        ]

    def get_sizes(self, obj):
        return [size_obj.size for size_obj in obj.sizes.all()]

    def get_features(self, obj):
        return [feat_obj.feature_text for feat_obj in obj.features.all()]

    def get_thumbnails(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return [request.build_absolute_uri(obj.image.url)]
            return [obj.image.url]
        return []

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['price'] = float(instance.price)
        data['original_price'] = float(instance.original_price)
        
        # Get full image URL
        if instance.image:
            request = self.context.get('request')
            if request:
                data['image'] = request.build_absolute_uri(instance.image.url)
                data['thumbnails'] = [request.build_absolute_uri(instance.image.url)]
            else:
                data['image'] = instance.image.url
                data['thumbnails'] = [instance.image.url]
        
        return data

    def create(self, validated_data):
        product = Product.objects.create(**validated_data)
        
        # Seed default colors matching the selected color_hex or standard defaults
        color_hex = validated_data.get('color_hex', '#e6fcf5')
        ProductColor.objects.create(product=product, name="Sage Green", hex=color_hex)
        ProductColor.objects.create(product=product, name="Off White", hex="#f8f9fa")
        
        # Seed default sizes based on parent category
        parent = validated_data.get('parent_category', '')
        if '0–3' in parent or '3–6' in parent:
            sizes = ["0-1M", "1-3M", "3-6M"]
        elif 'Jeans' in validated_data.get('name', ''):
            sizes = ["2-3Y", "3-4Y"]
        else:
            sizes = ["S", "M", "L", "XL"]
            
        for s in sizes:
            ProductSize.objects.create(product=product, size=s)
            
        # Seed default features
        ProductFeature.objects.create(product=product, feature_text="Material: 100% Organic Muslin Cotton")
        ProductFeature.objects.create(product=product, feature_text="Stitch: Soft interlocking seams")
        ProductFeature.objects.create(product=product, feature_text="Care: Gentle machine wash cold")
        
        # Seed default details
        ProductDetail.objects.create(
            product=product, 
            title="Premium Comfort", 
            content="Cloud-soft fabric designed specifically to stay gentle on child skin."
        )
        ProductDetail.objects.create(
            product=product, 
            title="Sizing & Fit", 
            content="Standard comfort fit allowing loose play breathability and active crawling."
        )
        
        return product


class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'parent_category', 'image', 'image_url', 'order', 'is_active']
        extra_kwargs = {'image': {'required': False, 'allow_null': True}}
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'quantity', 'selected_color', 'selected_size', 'price']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['price'] = float(instance.price)
        return data


class OrderItemCreateSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(default=1)
    selected_color = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    selected_size = serializers.CharField(required=False, allow_blank=True, allow_null=True)


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_id', 'customer_name', 'email', 'phone', 
            'street_address', 'city', 'state', 'pin_code', 
            'payment_method', 'subtotal', 'discount_amount', 
            'shipping_fee', 'total_amount', 'items', 'created_at'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['subtotal'] = float(instance.subtotal)
        data['discount_amount'] = float(instance.discount_amount)
        data['shipping_fee'] = float(instance.shipping_fee)
        data['total_amount'] = float(instance.total_amount)
        
        # Include serialized order items
        items = instance.items.all()
        data['items'] = OrderItemSerializer(items, many=True).data
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'])
                OrderItem.objects.create(
                    order=order,
                    product=product,
                    product_name=product.name,
                    quantity=item['quantity'],
                    selected_color=item.get('selected_color'),
                    selected_size=item.get('selected_size'),
                    price=product.price
                )
            except Product.DoesNotExist:
                OrderItem.objects.create(
                    order=order,
                    product_name=f"Unknown Product (ID: {item['product_id']})",
                    quantity=item['quantity'],
                    selected_color=item.get('selected_color'),
                    selected_size=item.get('selected_size'),
                    price=0.00
                )
        return order


class HeroBannerSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    
    class Meta:
        model = HeroBanner
        fields = ['id', 'title', 'subtitle', 'src', 'alt', 'link', 'order']
    
    def get_src(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CategoryItemSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()
    categoryRef = serializers.CharField(source='category_ref')
    
    class Meta:
        model = CategoryItem
        fields = ['id', 'name', 'bg', 'img', 'categoryRef', 'order']
    
    def get_img(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class MarketingBannerSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()
    buttonText = serializers.CharField(source='button_text')
    categoryRef = serializers.CharField(source='category_ref')
    
    class Meta:
        model = MarketingBanner
        fields = ['id', 'title', 'description', 'bg', 'img', 'buttonText', 'categoryRef', 'order']
    
    def get_img(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class PaymentSerializer(serializers.ModelSerializer):
    order_id = serializers.CharField(source='order.order_id', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order', 'order_id', 'transaction_id', 'payment_method', 'amount', 'status', 'is_active', 'created_at']


class ReviewSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'product_name', 'user_name', 'user_email', 'rating', 'comment', 'created_at', 'is_active']
