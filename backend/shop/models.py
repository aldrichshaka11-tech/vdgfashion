from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    parent_category = models.CharField(max_length=255, blank=True, null=True)
    image = models.ImageField(upload_to='categories/', max_length=500, blank=True, null=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    featured = models.BooleanField(default=False)
    icon = models.CharField(max_length=100, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=500, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    slug = models.SlugField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['order', 'name']

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        # Soft delete: set active flag to False
        self.is_active = False
        self.save()


class Brand(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, blank=True, null=True)
    logo = models.ImageField(upload_to='brands/', max_length=500, blank=True, null=True)
    banner = models.ImageField(upload_to='brand_banners/', max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_keywords = models.CharField(max_length=500, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, default='active')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='products')
    parent_category = models.CharField(max_length=255, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.CharField(max_length=50, blank=True, null=True)
    tag_type = models.CharField(max_length=50, blank=True, null=True)
    rating = models.FloatField(default=0.0)
    reviews_count = models.IntegerField(default=0)
    is_new = models.BooleanField(default=False)
    description = models.TextField()
    image = models.ImageField(upload_to='products/', max_length=500, blank=True, null=True)
    color_hex = models.CharField(max_length=50)
    cart_btn_color = models.CharField(max_length=100, blank=True, null=True)
    stock = models.IntegerField(default=50)
    
    # Premium Mockup Fields
    slug = models.SlugField(max_length=255, blank=True, null=True)
    unit = models.CharField(max_length=50, default='pc')
    sku = models.CharField(max_length=100, blank=True, null=True)
    width = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    height = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    length = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    product_type = models.CharField(max_length=50, default='simple')
    status = models.CharField(max_length=20, default='published')
    
    # Missing Migration 0007 fields
    brand = models.ForeignKey(Brand, blank=True, null=True, on_delete=models.SET_NULL, related_name='products')
    barcode = models.CharField(max_length=100, blank=True, null=True)
    cost_price = models.DecimalField(decimal_places=2, default=0.0, max_digits=10)
    meta_description = models.TextField(blank=True, null=True)
    meta_keywords = models.CharField(max_length=500, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    reorder_level = models.IntegerField(default=10)
    tax_rate = models.DecimalField(decimal_places=2, default=18.0, max_digits=5)
    warehouse = models.CharField(max_length=100, default='WH-MAIN')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            from django.utils.text import slugify
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Soft delete: set active flag to False
        self.is_active = False
        self.save()


class ProductColor(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='colors')
    name = models.CharField(max_length=100)
    hex = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.product.name} - {self.name}"


class ProductSize(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='sizes')
    size = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.product.name} - {self.size}"


class ProductFeature(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='features')
    feature_text = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.product.name} - Feature"


class ProductDetail(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='details')
    title = models.CharField(max_length=255)
    content = models.TextField()

    def __str__(self):
        return f"{self.product.name} - {self.title}"


class Order(models.Model):
    PAYMENT_CHOICES = [
        ('card', 'Credit Card'),
        ('upi', 'UPI Transfer'),
        ('cod', 'Cash on Delivery'),
    ]

    order_id = models.CharField(max_length=100, unique=True)
    customer_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=50)
    street_address = models.TextField()
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    pin_code = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Missing Migration 0007 field
    status = models.CharField(
        max_length=30,
        choices=[
            ('pending', 'Pending'),
            ('confirmed', 'Confirmed'),
            ('packed', 'Packed'),
            ('shipped', 'Shipped'),
            ('out_for_delivery', 'Out for Delivery'),
            ('delivered', 'Delivered'),
            ('cancelled', 'Cancelled'),
            ('returned', 'Returned'),
            ('refunded', 'Refunded')
        ],
        default='pending'
    )
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.order_id} - {self.customer_name}"

    def delete(self, *args, **kwargs):
        # Soft delete: set active flag to False
        self.is_active = False
        self.save()


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    product_name = models.CharField(max_length=255)  # Snapshot product name at order time
    quantity = models.IntegerField(default=1)
    selected_color = models.CharField(max_length=100, blank=True, null=True)
    selected_size = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product_name} in {self.order.order_id}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    transaction_id = models.CharField(max_length=255, unique=True)
    payment_method = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment {self.transaction_id} for Order {self.order.order_id}"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()


class HeroBanner(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='banners/', max_length=500)
    alt = models.CharField(max_length=255)
    link = models.CharField(max_length=500, blank=True)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()


class CategoryItem(models.Model):
    name = models.CharField(max_length=100)
    bg = models.CharField(max_length=50)
    image = models.ImageField(upload_to='category_items/', max_length=500)
    category_ref = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()


class MarketingBanner(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    bg = models.CharField(max_length=50)
    image = models.ImageField(upload_to='marketing/', max_length=500)
    button_text = models.CharField(max_length=100, default="SHOP NOW")
    category_ref = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user_name = models.CharField(max_length=255)
    user_email = models.EmailField()
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('product', 'user_email')

    def __str__(self):
        return f"Review by {self.user_name} on {self.product.name}"

    def delete(self, *args, **kwargs):
        self.is_active = False
        self.save()
