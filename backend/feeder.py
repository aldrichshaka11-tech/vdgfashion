import os
import sys
import shutil
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ecommerce_backend.settings.local')
django.setup()

from django.core.files import File
from django.core.cache import cache
from shop.models import Category, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, HeroBanner, CategoryItem, MarketingBanner, Order, Payment, SiteSettings

def clean_database():
    print("--- Cleaning database records ---")
    # Clean previous records
    Payment.objects.all().delete()
    Order.objects.all().delete()
    ProductDetail.objects.all().delete()
    ProductFeature.objects.all().delete()
    ProductSize.objects.all().delete()
    ProductColor.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()
    HeroBanner.objects.all().delete()
    CategoryItem.objects.all().delete()
    MarketingBanner.objects.all().delete()
    SiteSettings.objects.all().delete()

    
    # Clear redis cache if configured
    try:
        cache.clear()
        print("Redis Cache cleared successfully!")
    except Exception as e:
        print(f"Redis clear skipped: {e}")

def get_file_object(src_path):
    """Utility to open file and return Django File object"""
    if os.path.exists(src_path):
        return File(open(src_path, 'rb'))
    return None

def seed_database():
    print("--- Seeding database ---")
    
    # Define paths
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_public = os.path.join(base_dir, '..', 'frontend', 'public')
    frontend_products_dir = os.path.join(frontend_public, 'products')
    frontend_banner_dir = os.path.join(frontend_public, 'banner')
    
    media_dir = os.path.join(base_dir, 'media')
    os.makedirs(os.path.join(media_dir, 'categories'), exist_ok=True)
    os.makedirs(os.path.join(media_dir, 'products'), exist_ok=True)
    os.makedirs(os.path.join(media_dir, 'banners'), exist_ok=True)
    os.makedirs(os.path.join(media_dir, 'category_items'), exist_ok=True)
    os.makedirs(os.path.join(media_dir, 'marketing'), exist_ok=True)
    
    print(f"Resolved Frontend public path: {frontend_public}")
    
    # --- 1. SEED CATEGORIES ---
    print("Seeding Categories...")
    categories_data = [
        {"name": "Apparel", "parent_category": None, "image_filename": "baby_frock.png", "order": 1},
        {"name": "Toys", "parent_category": None, "image_filename": "wooden_toy.png", "order": 2},
        {"name": "Books", "parent_category": None, "image_filename": "activity_book.png", "order": 3},
        {"name": "Accessories", "parent_category": None, "image_filename": "accessories_category.png", "order": 4},
        {"name": "Footwear", "parent_category": None, "image_filename": "sneakers_white.png", "order": 5},
    ]
    
    category_map = {}
    for cat in categories_data:
        category = Category(
            name=cat["name"],
            parent_category=cat["parent_category"],
            order=cat["order"]
        )
        src_img = os.path.join(frontend_products_dir, cat["image_filename"])
        file_obj = get_file_object(src_img)
        if file_obj:
            category.image.save(cat["image_filename"], file_obj, save=False)
        category.save()
        category_map[cat["name"]] = category
        print(f"   Created Category: {category.name}")

    # --- 2. SEED PRODUCTS ---
    print("Seeding Products...")
    products_data = [
        {
            "name": "Baby Cotton Frock",
            "category_name": "Apparel",
            "parent_category": "Girls Clothing",
            "price": 899.00,
            "original_price": 1199.00,
            "discount": "25% OFF",
            "tag_type": "trending",
            "rating": 4.8,
            "reviews_count": 120,
            "is_new": True,
            "description": "Cloud-soft baby frock made with 100% premium organic cotton. Features safe back buttons and high breathability for girls.",
            "image_filename": "baby_frock.png",
            "color_hex": "#f3d9fa",
            "cart_btn_color": "bg-indigo-600 hover:bg-indigo-700",
            "stock": 45,
            "colors": [("Sage Green", "#e6fcf5"), ("Pink Frock", "#f3d9fa"), ("Off White", "#f8f9fa")],
            "sizes": ["0-3M", "3-6M", "6-12M"],
            "features": [
                "Material: 100% Organic Muslin Cotton",
                "Stitch: Soft interlocking flat seams",
                "Care: Gentle machine wash cold"
            ],
            "details": [
                ("Premium Comfort", "Cloud-soft fabric designed specifically to stay gentle on child skin."),
                ("Sizing & Fit", "Standard comfort fit allowing loose play breathability.")
            ]
        },
        {
            "name": "Activity Learning Book",
            "category_name": "Books",
            "parent_category": "Educational",
            "price": 499.00,
            "original_price": 699.00,
            "discount": "30% OFF",
            "tag_type": "popular",
            "rating": 4.9,
            "reviews_count": 85,
            "is_new": False,
            "description": "Interactive sensory book helping toddlers learn motor skills, shapes, colors, and basic vocabulary.",
            "image_filename": "activity_book.png",
            "color_hex": "#e8f0fe",
            "cart_btn_color": "bg-pink-600 hover:bg-pink-700",
            "stock": 60,
            "colors": [("Sky Blue", "#e8f0fe"), ("Sunny Yellow", "#fff9db")],
            "sizes": ["One Size"],
            "features": [
                "Interactive textured surfaces",
                "Built-in toddler safety mirror",
                "Water-resistant fabric pages"
            ],
            "details": [
                ("Sensory Development", "Stimulates multi-sensory development and hand-eye logic coordination.")
            ]
        },
        {
            "name": "Kids School Backpack",
            "category_name": "Accessories",
            "parent_category": "School Supplies",
            "price": 1299.00,
            "original_price": 1599.00,
            "discount": "18% OFF",
            "tag_type": "new",
            "rating": 4.5,
            "reviews_count": 32,
            "is_new": True,
            "description": "Ergonomic, lightweight black backpack designed with dual cushioned straps and spacious water-resistant compartments.",
            "image_filename": "backpack_black.png",
            "color_hex": "#212529",
            "cart_btn_color": "bg-teal-600 hover:bg-teal-700",
            "stock": 15,
            "colors": [("Obsidian Black", "#212529"), ("Ocean Blue", "#1971c2")],
            "sizes": ["M", "L"],
            "features": [
                "Waterproof high-grade nylon",
                "Orthopedic breathable back cushion",
                "Dual side mesh pockets"
            ],
            "details": [
                ("Ergonomic Back Support", "Engineered to distribute load evenly across kids back shoulders.")
            ]
        },
        {
            "name": "Khaki Cargo Pants",
            "category_name": "Apparel",
            "parent_category": "Boys Clothing",
            "price": 799.00,
            "original_price": 999.00,
            "discount": "20% OFF",
            "tag_type": "casual",
            "rating": 4.6,
            "reviews_count": 47,
            "is_new": False,
            "description": "Durable khaki cargo trousers with multiple utility pockets and elastic drawstring waist for flexible fit.",
            "image_filename": "cargo_pants_khaki.png",
            "color_hex": "#d7ccc8",
            "cart_btn_color": "bg-amber-600 hover:bg-amber-700",
            "stock": 35,
            "colors": [("Khaki Beige", "#d7ccc8"), ("Olive Green", "#558b2f")],
            "sizes": ["1-2Y", "2-3Y", "3-4Y"],
            "features": [
                "Heavy-duty cotton twill fabric",
                "Adjustable elastic waist drawstring",
                "6 functional utility deep pockets"
            ],
            "details": [
                ("Durable For Outdoor Play", "Reinforced knee stitches make it resistant to heavy play and crawling.")
            ]
        },
        {
            "name": "Cotton Pink Hoodie",
            "category_name": "Apparel",
            "parent_category": "Unisex Clothing",
            "price": 1199.00,
            "original_price": 1499.00,
            "discount": "20% OFF",
            "tag_type": "cozy",
            "rating": 4.7,
            "reviews_count": 58,
            "is_new": True,
            "description": "Super-soft inner fleece cotton hoodie keeping your kids warm and fashionable during cool breeze days.",
            "image_filename": "hoodie_pink.png",
            "color_hex": "#f8bbd0",
            "cart_btn_color": "bg-purple-600 hover:bg-purple-700",
            "stock": 25,
            "colors": [("Blossom Pink", "#f8bbd0"), ("Heather Gray", "#cfd8dc")],
            "sizes": ["2-3Y", "3-4Y", "4-5Y"],
            "features": [
                "Inner brushed fleece lining",
                "Soft ribbed wrist cuffs and hem",
                "Chafing-free zipper front lock"
            ],
            "details": [
                ("Cozy Comfort Layer", "Snug yet highly breathable for layering during cold weather seasons.")
            ]
        },
        {
            "name": "Classic Blue Jeans",
            "category_name": "Apparel",
            "parent_category": "Boys Clothing",
            "price": 999.00,
            "original_price": 1299.00,
            "discount": "23% OFF",
            "tag_type": "essential",
            "rating": 4.4,
            "reviews_count": 92,
            "is_new": False,
            "description": "Stretchable denim classic jeans tailored to resist high-intensity play while maintaining a smart fit.",
            "image_filename": "jeans_blue.png",
            "color_hex": "#bbdefb",
            "cart_btn_color": "bg-blue-600 hover:bg-blue-700",
            "stock": 40,
            "colors": [("Denim Blue", "#1971c2"), ("Charcoal Black", "#343a40")],
            "sizes": ["1-2Y", "2-3Y", "3-4Y", "4-5Y"],
            "features": [
                "Hyper-stretch comfortable denim",
                "Soft inner waistband lining",
                "Eco-friendly stone wash process"
            ],
            "details": [
                ("Flex Fit Denim", "Adapts to body motions allowing active running, crawling and squatting.")
            ]
        },
        {
            "name": "Kids Striped Shirt",
            "category_name": "Apparel",
            "parent_category": "Boys Clothing",
            "price": 699.00,
            "original_price": 899.00,
            "discount": "22% OFF",
            "tag_type": "smart",
            "rating": 4.6,
            "reviews_count": 24,
            "is_new": True,
            "description": "100% premium woven linen striped shirt with half-sleeves, perfect for summer outings and birthday celebrations.",
            "image_filename": "shirt_striped.png",
            "color_hex": "#e0f2f1",
            "cart_btn_color": "bg-teal-500 hover:bg-teal-600",
            "stock": 30,
            "colors": [("Aqua Stripe", "#e0f2f1"), ("Tan Stripe", "#efebe9")],
            "sizes": ["1-2Y", "2-3Y", "3-4Y"],
            "features": [
                "Breathable lightweight organic linen",
                "Premium coconut shell front buttons",
                "Classic relaxed camp collar"
            ],
            "details": [
                ("Summer Breeze Woven", "Optimal moisture absorption keeping skin cool on hot sunny beach days.")
            ]
        },
        {
            "name": "Urban White Sneakers",
            "category_name": "Footwear",
            "parent_category": "Shoes",
            "price": 1499.00,
            "original_price": 1999.00,
            "discount": "25% OFF",
            "tag_type": "sporty",
            "rating": 4.8,
            "reviews_count": 73,
            "is_new": True,
            "description": "Anti-slip orthopedic athletic sneakers equipped with soft foam insoles and breathable mesh fabric.",
            "image_filename": "sneakers_white.png",
            "color_hex": "#ffffff",
            "cart_btn_color": "bg-slate-700 hover:bg-slate-800",
            "stock": 18,
            "colors": [("Urban White", "#ffffff"), ("Pastel Pink", "#fbc5d8")],
            "sizes": ["S (Size 5)", "M (Size 7)", "L (Size 9)"],
            "features": [
                "Anti-slip shock absorber sole",
                "Dual quick loop Velcro straps",
                "Washable premium canvas structure"
            ],
            "details": [
                ("Orthopedic Insole Support", "Provides natural heel cushion supporting toddlers first steps arches.")
            ]
        },
        {
            "name": "Organic Green T-Shirt",
            "category_name": "Apparel",
            "parent_category": "Boys Clothing",
            "price": 499.00,
            "original_price": 599.00,
            "discount": "16% OFF",
            "tag_type": "eco",
            "rating": 4.3,
            "reviews_count": 15,
            "is_new": False,
            "description": "Lightweight combed organic cotton green crewneck tee featuring friendly animal graphics printed with water-based ink.",
            "image_filename": "tshirt_green.png",
            "color_hex": "#c8e6c9",
            "cart_btn_color": "bg-emerald-600 hover:bg-emerald-700",
            "stock": 50,
            "colors": [("Leaf Green", "#c8e6c9"), ("Mustard Yellow", "#fff3bf")],
            "sizes": ["6-12M", "12-18M", "18-24M"],
            "features": [
                "100% fine combed jersey cotton",
                "Non-toxic allergen free chest print",
                "Tagless collar neck label"
            ],
            "details": [
                ("Eco Soft Fabric", "Super breathable fabric gentle for warm afternoons or casual nursery nap.")
            ]
        },
        {
            "name": "Premium Wooden Toy Set",
            "category_name": "Toys",
            "parent_category": "Montessori",
            "price": 1599.00,
            "original_price": 1999.00,
            "discount": "20% OFF",
            "tag_type": "premium",
            "rating": 4.9,
            "reviews_count": 104,
            "is_new": True,
            "description": "Eco-friendly non-toxic natural wood stacker puzzle set supporting hand-eye coordination and spatial reasoning.",
            "image_filename": "wooden_toy.png",
            "color_hex": "#ffe0b2",
            "cart_btn_color": "bg-orange-600 hover:bg-orange-700",
            "stock": 22,
            "colors": [("Multi Colorwood", "#ffe0b2"), ("Natural Beechwood", "#faf0e6")],
            "sizes": ["Standard"],
            "features": [
                "Premium solid organic beechwood",
                "Eco non-toxic water based paints",
                "Curved corners preventing scratch hazards"
            ],
            "details": [
                ("Montessori Play", "Promotes logical stacking order, size scaling, and fine motor skills.")
            ]
        }
    ]
    
    for item in products_data:
        cat_obj = category_map.get(item["category_name"])
        product = Product(
            name=item["name"],
            category=cat_obj,
            parent_category=item["parent_category"],
            price=item["price"],
            original_price=item["original_price"],
            discount=item["discount"],
            tag_type=item["tag_type"],
            rating=item["rating"],
            reviews_count=item["reviews_count"],
            is_new=item["is_new"],
            description=item["description"],
            color_hex=item["color_hex"],
            cart_btn_color=item["cart_btn_color"],
            stock=item["stock"]
        )
        src_img = os.path.join(frontend_products_dir, item["image_filename"])
        file_obj = get_file_object(src_img)
        if file_obj:
            product.image.save(item["image_filename"], file_obj, save=False)
        product.save()
        
        # Colors
        for col_name, col_hex in item["colors"]:
            ProductColor.objects.create(product=product, name=col_name, hex=col_hex)
            
        # Sizes
        for sz in item["sizes"]:
            ProductSize.objects.create(product=product, size=sz)
            
        # Features
        for feat in item["features"]:
            ProductFeature.objects.create(product=product, feature_text=feat)
            
        # Details
        for title, content in item["details"]:
            ProductDetail.objects.create(product=product, title=title, content=content)
            
        print(f"   Created Product: {product.name} ({product.category.name})")

    # --- 3. SEED HERO BANNERS ---
    print("Seeding Hero Banners...")
    banners_data = [
        {"title": "New Born Collections", "subtitle": "Up to 50% Off on cute organic cotton wear", "filename": "banner1.png", "alt": "New Born Collection Banner", "link": "/shop?category=Apparel", "order": 1},
        {"title": "Activity Learning Toys", "subtitle": "Creative sensory sets for growing minds", "filename": "banner2.png", "alt": "Montessori Toys Banner", "link": "/shop?category=Toys", "order": 2},
        {"title": "Premium Kids Accessories", "subtitle": "Durable school bags, shoes, and safety gear", "filename": "banner3.png", "alt": "Kids Accessories Banner", "link": "/shop?category=Accessories", "order": 3},
    ]
    
    for ban in banners_data:
        banner = HeroBanner(
            title=ban["title"],
            subtitle=ban["subtitle"],
            alt=ban["alt"],
            link=ban["link"],
            order=ban["order"]
        )
        src_img = os.path.join(frontend_banner_dir, ban["filename"])
        file_obj = get_file_object(src_img)
        if file_obj:
            banner.image.save(ban["filename"], file_obj, save=False)
        banner.save()
        print(f"   Created Banner: {banner.title}")

    # --- 4. SEED CATEGORY ITEMS ---
    print("Seeding Category Grid Items...")
    cat_items_data = [
        {"name": "New Born (0–3 Months)", "bg": "bg-amber-100", "filename": "baby_frock.png", "category_ref": "Apparel", "order": 1},
        {"name": "Infant (3–12 Months)", "bg": "bg-teal-50", "filename": "tshirt_green.png", "category_ref": "Apparel", "order": 2},
        {"name": "Toddler (1–3 Years)", "bg": "bg-indigo-50", "filename": "wooden_toy.png", "category_ref": "Toys", "order": 3},
        {"name": "Kids (3+ Years)", "bg": "bg-pink-50", "filename": "activity_book.png", "category_ref": "Books", "order": 4},
    ]
    
    for ci in cat_items_data:
        cat_item = CategoryItem(
            name=ci["name"],
            bg=ci["bg"],
            category_ref=ci["category_ref"],
            order=ci["order"]
        )
        src_img = os.path.join(frontend_products_dir, ci["filename"])
        file_obj = get_file_object(src_img)
        if file_obj:
            cat_item.image.save(ci["filename"], file_obj, save=False)
        cat_item.save()
        print(f"   Created Category Grid Item: {cat_item.name}")

    # --- 5. SEED MARKETING BANNERS ---
    print("Seeding Marketing Banners...")
    marketing_banners_data = [
        {
            "title": "Playful Montessori Wooden Toys",
            "description": "Inspire your child's imagination and early development with safe organic woods.",
            "bg": "bg-teal-50",
            "filename": "wooden_toy.png",
            "button_text": "SHOP WOODS",
            "category_ref": "Toys",
            "order": 1
        },
        {
            "title": "Premium Cozy Fleece Hoodies",
            "description": "Keep your little ones cozy during breeze times with premium breathable warmth.",
            "bg": "bg-pink-50",
            "filename": "hoodie_pink.png",
            "button_text": "SHOP COZY",
            "category_ref": "Apparel",
            "order": 2
        }
    ]
    
    for mb in marketing_banners_data:
        m_banner = MarketingBanner(
            title=mb["title"],
            description=mb["description"],
            bg=mb["bg"],
            button_text=mb["button_text"],
            category_ref=mb["category_ref"],
            order=mb["order"]
        )
        src_img = os.path.join(frontend_products_dir, mb["filename"])
        file_obj = get_file_object(src_img)
        if file_obj:
            m_banner.image.save(mb["filename"], file_obj, save=False)
        m_banner.save()
        print(f"   Created Marketing Banner: {m_banner.title}")

    # --- 6. SEED COMPLETED DUMMY ORDERS & PAYMENTS ---
    print("Seeding Sample Orders & Payments...")
    order_id_1 = "ORD-2026-0001"
    order_1 = Order.objects.create(
        order_id=order_id_1,
        customer_name="John Doe",
        email="john.doe@example.com",
        phone="+1 555-0199",
        street_address="123 Cozy Lane",
        city="Sunnyvale",
        state="California",
        pin_code="94085",
        payment_method="card",
        subtotal=2198.00,
        discount_amount=200.00,
        shipping_fee=0.00,
        total_amount=1998.00
    )
    Payment.objects.create(
        order=order_1,
        transaction_id="TXN-9876543210",
        payment_method="Credit Card",
        amount=1998.00,
        status="completed"
    )
    
    order_id_2 = "ORD-2026-0002"
    order_2 = Order.objects.create(
        order_id=order_id_2,
        customer_name="Alice Smith",
        email="alice.smith@example.com",
        phone="+1 555-0144",
        street_address="789 Playful Ave",
        city="Austin",
        state="Texas",
        pin_code="78701",
        payment_method="upi",
        subtotal=499.00,
        discount_amount=0.00,
        shipping_fee=50.00,
        total_amount=549.00
    )
    Payment.objects.create(
        order=order_2,
        transaction_id="TXN-1122334455",
        payment_method="UPI Transfer",
        amount=549.00,
        status="completed"
    )
    print("   Created Sample Orders & Payments.")

    # --- 7. SEED SITE SETTINGS ---
    print("Seeding Site Settings...")
    SiteSettings.objects.update_or_create(
        id=1,
        defaults={
            "contact_phone": "083001 12996",
            "contact_email": "gouthamraj@vdgfashion.com",
            "store_address": "61/1,First floor, VDG Fashion Narayana complex, opp. burma hotel, Sivagami Puram, Virudhunagar, Tamil Nadu 626001",
            "about_text": "Trendy looks for every vibe. Stay stylish, every day.",
            "facebook_url": "https://www.facebook.com/fashionvdg/",
            "instagram_url": "https://www.instagram.com/vdgfashion/",
            "youtube_url": "https://www.youtube.com/channel/UCLLKwEMo4FManOeDUO3jaKw",
            "free_shipping_threshold": 3000.00,
            "shipping_fee": 99.00,
            "active_promo_code": "TREND10",
            "active_promo_discount": 10,
            "is_store_open": True
        }
    )
    print("   Created/Updated Site Settings.")

    print("Database successfully seeded with rich, realistic dummy data!")

if __name__ == '__main__':
    clean_database()
    seed_database()

