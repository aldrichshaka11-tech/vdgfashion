from django.contrib import admin
from .models import Category, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, Order, OrderItem, Payment, HeroBanner, CategoryItem, MarketingBanner

class ProductColorInline(admin.TabularInline):
    model = ProductColor
    extra = 1

class ProductSizeInline(admin.TabularInline):
    model = ProductSize
    extra = 1

class ProductFeatureInline(admin.TabularInline):
    model = ProductFeature
    extra = 1

class ProductDetailInline(admin.StackedInline):
    model = ProductDetail
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent_category', 'image_preview', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'parent_category')
    list_filter = ('parent_category', 'is_active')
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'parent_category')
        }),
        ('Image Upload', {
            'fields': ('image',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return f'✅ Uploaded'
        return '❌ No Image'
    image_preview.short_description = 'Image Status'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'parent_category', 'price', 'original_price', 'discount', 'stock', 'image_preview', 'rating', 'is_new', 'is_active')
    list_editable = ('price', 'original_price', 'discount', 'stock', 'is_new', 'is_active')
    search_fields = ('name', 'category__name', 'description', 'parent_category')
    list_filter = ('category', 'parent_category', 'is_new', 'tag_type', 'is_active')
    inlines = [ProductColorInline, ProductSizeInline, ProductFeatureInline, ProductDetailInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category', 'parent_category', 'description')
        }),
        ('Pricing', {
            'fields': ('price', 'original_price', 'discount')
        }),
        ('Inventory', {
            'fields': ('stock',)
        }),
        ('Image Upload', {
            'fields': ('image',)
        }),
        ('Design Colors', {
            'fields': ('color_hex', 'cart_btn_color')
        }),
        ('Tags & Status', {
            'fields': ('tag_type', 'is_new', 'is_active', 'rating', 'reviews_count')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return '✅ Uploaded'
        return '❌ No Image'
    image_preview.short_description = 'Image'

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'quantity', 'selected_color', 'selected_size', 'price')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer_name', 'phone', 'payment_method', 'total_amount', 'created_at')
    readonly_fields = ('order_id', 'customer_name', 'email', 'phone', 'street_address', 'city', 'state', 'pin_code', 'payment_method', 'subtotal', 'discount_amount', 'shipping_fee', 'total_amount', 'created_at')
    search_fields = ('order_id', 'customer_name', 'phone', 'email')
    list_filter = ('payment_method', 'created_at')
    inlines = [OrderItemInline]

    def has_add_permission(self, request):
        return False

@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'alt', 'image_preview', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'alt')
    list_filter = ('is_active',)
    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'alt', 'link')
        }),
        ('Image Upload', {
            'fields': ('image',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return '✅ Uploaded'
        return '❌ No Image'
    image_preview.short_description = 'Image'

@admin.register(CategoryItem)
class CategoryItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'bg', 'category_ref', 'image_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'category_ref')
    list_filter = ('is_active',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category_ref', 'bg')
        }),
        ('Image Upload', {
            'fields': ('image',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return '✅ Uploaded'
        return '❌ No Image'
    image_preview.short_description = 'Image'

@admin.register(MarketingBanner)
class MarketingBannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'bg', 'category_ref', 'image_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'category_ref')
    list_filter = ('is_active',)
    fieldsets = (
        ('Content', {
            'fields': ('title', 'description', 'button_text', 'category_ref')
        }),
        ('Design', {
            'fields': ('bg',)
        }),
        ('Image Upload', {
            'fields': ('image',)
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return '✅ Uploaded'
        return '❌ No Image'
    image_preview.short_description = 'Image'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_id', 'order', 'payment_method', 'amount', 'status', 'is_active', 'created_at')
    list_editable = ('status', 'is_active')
    search_fields = ('transaction_id', 'order__order_id', 'payment_method')
    list_filter = ('status', 'payment_method', 'is_active', 'created_at')

