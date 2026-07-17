from rest_framework import serializers
from .models import MainCategory, Category, SubCategory, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, Order, OrderItem, Payment, HeroBanner, MobileBanner, CategoryItem, MarketingBanner, Review, SiteSettings, UserAddress


class MainCategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    unique_id = serializers.SerializerMethodField()

    class Meta:
        model = MainCategory
        fields = ['id', 'unique_id', 'name', 'type', 'image', 'image_url', 'order', 'is_active']
        extra_kwargs = {'image': {'required': False, 'allow_null': True}}

    def get_image_url(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_type(self, obj):
        return 'main_category'

    def get_unique_id(self, obj):
        return f"main_{obj.id}"


class CategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    main_category = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    unique_id = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'unique_id', 'name', 'main_category', 'type', 'image', 'image_url', 'order', 'is_active']
        extra_kwargs = {'image': {'required': False, 'allow_null': True}}

    def get_image_url(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_main_category(self, obj):
        return obj.main_category.name if obj.main_category else None

    def get_type(self, obj):
        return 'category'

    def get_unique_id(self, obj):
        return f"cat_{obj.id}"


class SubCategorySerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField()
    unique_id = serializers.SerializerMethodField()

    class Meta:
        model = SubCategory
        fields = ['id', 'unique_id', 'name', 'category', 'type', 'image', 'image_url', 'order', 'is_active']
        extra_kwargs = {'image': {'required': False, 'allow_null': True}}

    def get_image_url(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_category(self, obj):
        return obj.category.name if obj.category else None

    def get_type(self, obj):
        return 'sub_category'

    def get_unique_id(self, obj):
        return f"sub_{obj.id}"


class ProductColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductColor
        fields = ['name', 'hex']


class ProductSerializer(serializers.ModelSerializer):
    colors = ProductColorSerializer(many=True, read_only=True)
    sizes = serializers.SerializerMethodField()
    features = serializers.SerializerMethodField()
    details = serializers.SerializerMethodField()
    
    main_category_id = serializers.PrimaryKeyRelatedField(queryset=MainCategory.objects.all(), source='main_category', write_only=True, required=False, allow_null=True)
    category_id = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), source='category', write_only=True, required=False, allow_null=True)
    sub_category_id = serializers.PrimaryKeyRelatedField(queryset=SubCategory.objects.all(), source='sub_category', write_only=True, required=False, allow_null=True)
    
    main_category = serializers.CharField(source='main_category.name', read_only=True)
    category = serializers.CharField(source='category.name', read_only=True)
    sub_category = serializers.CharField(source='sub_category.name', read_only=True)
    image = serializers.SerializerMethodField()
    image_2 = serializers.SerializerMethodField()
    image_3 = serializers.SerializerMethodField()
    thumbnails = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'unit', 'sku', 'main_category', 'category', 'sub_category',
            'main_category_id', 'category_id', 'sub_category_id',
            'price', 'original_price', 'discount', 'tag_type',
            'rating', 'reviews_count', 'is_new', 'description',
            'image', 'image_2', 'image_3', 'thumbnails', 'color_hex', 'cart_btn_color', 'stock',
            'width', 'height', 'length', 'product_type', 'status',
            'colors', 'sizes', 'features', 'details', 'razorpay_buy_now_link'
        ]
        extra_kwargs = {
            'image': {'read_only': True},
            'image_2': {'read_only': True},
            'image_3': {'read_only': True}
        }

    def get_sizes(self, obj):
        return [s.size for s in obj.sizes.all()]

    def get_features(self, obj):
        return [f.feature_text for f in obj.features.all()]

    def get_details(self, obj):
        return [{'title': d.title, 'content': d.content} for d in obj.details.all()]

    def get_image(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_image_2(self, obj):
        if obj.image_2:
            if str(obj.image_2).startswith('http'):
                return str(obj.image_2)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_2.url)
            return obj.image_2.url
        return None

    def get_image_3(self, obj):
        if obj.image_3:
            if str(obj.image_3).startswith('http'):
                return str(obj.image_3)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image_3.url)
            return obj.image_3.url
        return None

    def get_thumbnails(self, obj):
        urls = []
        for img in [self.get_image(obj), self.get_image_2(obj), self.get_image_3(obj)]:
            if img:
                urls.append(img)
        return urls

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['price'] = float(instance.price)
        data['original_price'] = float(instance.original_price)
        return data


class OrderItemSerializer(serializers.ModelSerializer):
    product_code = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_code', 'quantity', 'selected_color', 'selected_size', 'price']

    def get_product_code(self, obj):
        if obj.product_code:
            return obj.product_code
        if obj.product and obj.product.sku:
            return obj.product.sku
        return ""

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
            'shipping_fee', 'total_amount', 'status', 'items', 'created_at'
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['subtotal'] = float(instance.subtotal)
        data['discount_amount'] = float(instance.discount_amount)
        data['shipping_fee'] = float(instance.shipping_fee)
        data['total_amount'] = float(instance.total_amount)
        data['items'] = OrderItemSerializer(instance.items.all(), many=True).data
        return data

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)
        for item in items_data:
            try:
                product = Product.objects.get(id=item['product_id'])
                OrderItem.objects.create(
                    order=order, product=product,
                    product_name=product.name,
                    product_code=product.sku,
                    quantity=item['quantity'],
                    selected_color=item.get('selected_color'),
                    selected_size=item.get('selected_size'),
                    price=product.price
                )
                product.stock = max(0, product.stock - item['quantity'])
                product.save()
            except Product.DoesNotExist:
                OrderItem.objects.create(
                    order=order,
                    product_name=f"Unknown Product (ID: {item['product_id']})",
                    product_code="",
                    quantity=item['quantity'],
                    selected_color=item.get('selected_color'),
                    selected_size=item.get('selected_size'),
                    price=0.00
                )
        return order


class HeroBannerSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    image = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = HeroBanner
        fields = ['id', 'title', 'subtitle', 'image', 'src', 'alt', 'link', 'order', 'is_default', 'is_active']

    def get_src(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class MobileBannerSerializer(serializers.ModelSerializer):
    src = serializers.SerializerMethodField()
    image = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = MobileBanner
        fields = ['id', 'title', 'subtitle', 'image', 'src', 'alt', 'link', 'order', 'is_default', 'is_active']

    def get_src(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None



class CategoryItemSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()
    categoryRef = serializers.CharField(source='category_ref')
    image = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = CategoryItem
        fields = ['id', 'name', 'bg', 'image', 'img', 'categoryRef', 'order']

    def get_img(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class MarketingBannerSerializer(serializers.ModelSerializer):
    img = serializers.SerializerMethodField()
    buttonText = serializers.CharField(source='button_text')
    categoryRef = serializers.CharField(source='category_ref')
    image = serializers.CharField(max_length=500, required=False, allow_blank=True, allow_null=True)

    class Meta:
        model = MarketingBanner
        fields = ['id', 'title', 'description', 'bg', 'image', 'img', 'buttonText', 'categoryRef', 'order']

    def get_img(self, obj):
        if obj.image:
            if str(obj.image).startswith('http'):
                return str(obj.image)
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

    def validate(self, attrs):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            attrs['user_email'] = request.user.email
        return attrs


class SiteSettingsSerializer(serializers.ModelSerializer):
    contactPhone = serializers.CharField(source='contact_phone', required=False, allow_blank=True, allow_null=True)
    contactEmail = serializers.EmailField(source='contact_email', required=False, allow_blank=True, allow_null=True)
    storeAddress = serializers.CharField(source='store_address', required=False, allow_blank=True, allow_null=True)
    freeShippingThreshold = serializers.DecimalField(source='free_shipping_threshold', max_digits=10, decimal_places=2, required=False, allow_null=True)
    shippingFee = serializers.DecimalField(source='shipping_fee', max_digits=10, decimal_places=2, required=False, allow_null=True)
    activePromoCode = serializers.CharField(source='active_promo_code', required=False, allow_blank=True, allow_null=True)
    activePromoDiscount = serializers.IntegerField(source='active_promo_discount', required=False, allow_null=True)
    isStoreOpen = serializers.BooleanField(source='is_store_open', required=False, allow_null=True)
    facebookUrl = serializers.URLField(source='facebook_url', required=False, allow_blank=True, allow_null=True)
    instagramUrl = serializers.URLField(source='instagram_url', required=False, allow_blank=True, allow_null=True)
    youtubeUrl = serializers.URLField(source='youtube_url', required=False, allow_blank=True, allow_null=True)
    aboutText = serializers.CharField(source='about_text', required=False, allow_blank=True, allow_null=True)
    logoImage = serializers.ImageField(source='logo_image', required=False, allow_null=True, read_only=True)

    class Meta:
        model = SiteSettings
        fields = [
            'id', 'contactPhone', 'contactEmail', 'storeAddress', 
            'freeShippingThreshold', 'shippingFee', 
            'activePromoCode', 'activePromoDiscount', 'isStoreOpen',
            'facebookUrl', 'instagramUrl', 'youtubeUrl', 'aboutText', 'logoImage'
        ]


class UserAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAddress
        fields = [
            'id', 'label', 'recipient_name', 'phone', 'street_address', 
            'city', 'state', 'pin_code', 'is_default', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

