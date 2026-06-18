from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Brand, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, Order, OrderItem, Payment, HeroBanner, MobileBanner, CategoryItem, MarketingBanner, Review, SiteSettings

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
    readonly_fields = ('image_preview_detail',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'parent_category')
        }),
        ('Image Upload', {
            'fields': ('image', 'image_preview_detail')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0; font-size: 11px;">❌ No Image</span>')
    image_preview.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px; background: #fff;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0;">No image uploaded yet. Select an image above and click save.</span>')
    image_preview_detail.short_description = 'Current Image Preview'

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'category', 'parent_category', 'price', 'original_price', 'discount', 'stock', 'image_preview', 'rating', 'is_new', 'is_active')
    list_editable = ('price', 'original_price', 'discount', 'stock', 'is_new', 'is_active')
    search_fields = ('name', 'category__name', 'description', 'parent_category')
    list_filter = ('category', 'parent_category', 'is_new', 'tag_type', 'is_active')
    inlines = [ProductColorInline, ProductSizeInline, ProductFeatureInline, ProductDetailInline]
    readonly_fields = ('image_preview_detail',)
    
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
            'fields': ('image', 'image_preview_detail')
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
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0; font-size: 11px;">❌ No Image</span>')
    image_preview.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px; background: #fff;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0;">No image uploaded yet. Select an image above and click save.</span>')
    image_preview_detail.short_description = 'Current Image Preview'

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product', 'product_name', 'quantity', 'selected_color', 'selected_size', 'price')
    can_delete = False

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'customer_name', 'phone', 'email', 'payment_method', 'total_amount', 'status_badge', 'created_at')
    list_editable = ()
    list_filter = ('status', 'payment_method', 'created_at')
    search_fields = ('order_id', 'customer_name', 'phone', 'email')
    inlines = [OrderItemInline]
    ordering = ('-created_at',)

    readonly_fields = (
        'order_id', 'customer_name', 'email', 'phone',
        'street_address', 'city', 'state', 'pin_code',
        'payment_method', 'subtotal', 'discount_amount',
        'shipping_fee', 'total_amount', 'created_at', 'user'
    )

    fieldsets = (
        ('🧾 Order Info', {
            'fields': ('order_id', 'created_at', 'user')
        }),
        ('👤 Customer Details', {
            'fields': ('customer_name', 'email', 'phone')
        }),
        ('📦 Shipping Address', {
            'fields': ('street_address', 'city', 'state', 'pin_code')
        }),
        ('💳 Payment & Totals', {
            'fields': ('payment_method', 'subtotal', 'discount_amount', 'shipping_fee', 'total_amount')
        }),
        ('🚚 Order Status', {
            'fields': ('status',),
            'description': 'Update the order status here. This is visible to the customer in their account.'
        }),
    )

    def status_badge(self, obj):
        colors = {
            'pending':          ('#f59e0b', '#fffbeb'),
            'confirmed':        ('#3b82f6', '#eff6ff'),
            'packed':           ('#8b5cf6', '#f5f3ff'),
            'shipped':          ('#06b6d4', '#ecfeff'),
            'out_for_delivery': ('#f97316', '#fff7ed'),
            'delivered':        ('#10b981', '#ecfdf5'),
            'cancelled':        ('#ef4444', '#fef2f2'),
            'returned':         ('#6b7280', '#f9fafb'),
            'refunded':         ('#ec4899', '#fdf2f8'),
        }
        color, bg = colors.get(obj.status, ('#6b7280', '#f9fafb'))
        label = obj.get_status_display()
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;border:1px solid {}22;">{}</span>',
            bg, color, color, label
        )
    status_badge.short_description = 'Status'
    status_badge.admin_order_field = 'status'

    def has_add_permission(self, request):
        return False

from django.db import models
from django import forms
from django.forms.widgets import FileInput

class HeroBannerForm(forms.ModelForm):
    class Meta:
        model = HeroBanner
        fields = '__all__'
        widgets = {
            'image': FileInput(),
        }

@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    form = HeroBannerForm
    list_display = ('id', 'title', 'alt', 'image_preview', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'alt')
    list_filter = ('is_active',)
    readonly_fields = ('image_preview_detail',)
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'alt', 'link')
        }),
        ('Desktop Image Upload', {
            'fields': ('image', 'image_preview_detail')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0; font-size: 11px;">❌ No Image</span>')
    image_preview.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px; background: #fff;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0;">No image uploaded yet. Select an image above and click save.</span>')
    image_preview_detail.short_description = 'Current Image Preview'

    def has_delete_permission(self, request, obj=None):
        if obj is not None and getattr(obj, 'is_default', False):
            return False
        return super().has_delete_permission(request, obj)

    def delete_queryset(self, request, queryset):
        non_default_queryset = queryset.filter(is_default=False)
        if non_default_queryset.count() < queryset.count():
            self.message_user(request, "Default banners cannot be deleted.", level='warning')
        super().delete_queryset(request, non_default_queryset)

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def action_checkbox(self, obj):
        if getattr(obj, 'is_default', False):
            return ""
        return super().action_checkbox(obj)


class MobileBannerForm(forms.ModelForm):
    class Meta:
        model = MobileBanner
        fields = '__all__'
        widgets = {
            'image': FileInput(),
        }

@admin.register(MobileBanner)
class MobileBannerAdmin(admin.ModelAdmin):
    form = MobileBannerForm
    list_display = ('id', 'title', 'alt', 'image_preview', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'alt')
    list_filter = ('is_active',)
    readonly_fields = ('image_preview_detail',)
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'subtitle', 'alt', 'link')
        }),
        ('Mobile Image Upload', {
            'fields': ('image', 'image_preview_detail')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0; font-size: 11px;">❌ No Image</span>')
    image_preview.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px; background: #fff;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0;">No image uploaded yet. Select an image above and click save.</span>')
    image_preview_detail.short_description = 'Current Image Preview'

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def delete_queryset(self, request, queryset):
        pass

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions

    def action_checkbox(self, obj):
        return ""




@admin.register(CategoryItem)
class CategoryItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'bg', 'category_ref', 'image_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('name', 'category_ref')
    list_filter = ('is_active',)
    readonly_fields = ('image_preview_detail',)
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'category_ref', 'bg')
        }),
        ('Image Upload', {
            'fields': ('image', 'image_preview_detail')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0; font-size: 11px;">❌ No Image</span>')
    image_preview.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px; background: #fff;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0;">No image uploaded yet. Select an image above and click save.</span>')
    image_preview_detail.short_description = 'Current Image Preview'

@admin.register(MarketingBanner)
class MarketingBannerAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'bg', 'category_ref', 'image_preview', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'category_ref')
    list_filter = ('is_active',)
    readonly_fields = ('image_preview_detail',)
    
    fieldsets = (
        ('Content', {
            'fields': ('title', 'description', 'button_text', 'category_ref')
        }),
        ('Design', {
            'fields': ('bg',)
        }),
        ('Image Upload', {
            'fields': ('image', 'image_preview_detail')
        }),
        ('Display Settings', {
            'fields': ('order', 'is_active')
        }),
    )
    
    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 45px; height: 45px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0; font-size: 11px;">❌ No Image</span>')
    image_preview.short_description = 'Preview'

    def image_preview_detail(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="max-width: 200px; max-height: 200px; object-fit: contain; border-radius: 8px; border: 1px solid #e2e8f0; padding: 4px; background: #fff;" />', obj.image.url)
        return format_html('<span style="color: #a0aec0;">No image uploaded yet. Select an image above and click save.</span>')
    image_preview_detail.short_description = 'Current Image Preview'


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_id', 'order', 'payment_method', 'amount', 'status', 'is_active', 'created_at')
    list_editable = ('status', 'is_active')
    search_fields = ('transaction_id', 'order__order_id', 'payment_method')
    list_filter = ('status', 'payment_method', 'is_active', 'created_at')


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ('contact_phone', 'contact_email', 'store_address', 'is_store_open')
    
    fieldsets = (
        ('Store Contacts', {
            'fields': ('contact_phone', 'contact_email', 'store_address', 'about_text')
        }),
        ('Store Checkout & Operations', {
            'fields': ('free_shipping_threshold', 'shipping_fee', 'active_promo_code', 'active_promo_discount', 'is_store_open')
        }),
        ('Social Media Links', {
            'fields': ('facebook_url', 'instagram_url', 'youtube_url')
        }),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'is_active', 'created_at')
    list_editable = ('status', 'is_active')
    search_fields = ('name', 'description')
    list_filter = ('status', 'is_active')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'product', 'user_name', 'user_email', 'rating', 'is_active', 'created_at')
    list_editable = ('is_active',)
    search_fields = ('user_name', 'user_email', 'comment', 'product__name')
    list_filter = ('rating', 'is_active', 'created_at')



