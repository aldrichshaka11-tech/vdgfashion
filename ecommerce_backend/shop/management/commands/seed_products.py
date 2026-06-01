from django.core.management.base import BaseCommand
from shop.models import Category, Product, ProductColor, ProductSize, ProductFeature, ProductDetail, HeroBanner, CategoryItem, MarketingBanner

class Command(BaseCommand):
    help = "Seeds initial categories, products, and CMS layout models matching frontend data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Deleting old records...")
        Category.objects.all().delete()
        Product.objects.all().delete()
        HeroBanner.objects.all().delete()
        CategoryItem.objects.all().delete()
        MarketingBanner.objects.all().delete()

        # 1. Define and Create Categories
        categories_data = [
            {"name": "Jablas", "parent_category": "New Born (0–3 Months)"},
            {"name": "Rompers", "parent_category": "3–6 Months"},
            {"name": "Jeans", "parent_category": "2–3 Years"},
            {"name": "Frocks", "parent_category": "12–18 Months"},
            {"name": "Shoes", "parent_category": "12–18 Months"},
            {"name": "School Bags", "parent_category": "Bags"},
            {"name": "Wooden Toys", "parent_category": "Toys"},
            {"name": "Activity Books", "parent_category": "Books"},
        ]

        categories_dict = {}
        for cat in categories_data:
            obj, created = Category.objects.get_or_create(
                name=cat["name"],
                parent_category=cat["parent_category"]
            )
            categories_dict[cat["name"]] = obj

        # 2. Define Products
        products_data = [
            {
                "id": 1,
                "name": "Sage Green Organic Jabla",
                "category_name": "Jablas",
                "parent_category": "New Born (0–3 Months)",
                "price": 349.00,
                "original_price": 499.00,
                "discount": "-30%",
                "tag_type": "discount",
                "rating": 4.8,
                "reviews_count": 120,
                "is_new": False,
                "description": "Cloud-soft baby jabla stitched in 100% organic cotton. Easy tie-on neck straps and loose fit for perfect newborn breathability.",
                "image": "/products/tshirt_green.png",
                "color_hex": "#e6fcf5",
                "cart_btn_color": "bg-teal-500 hover:bg-teal-600",
                "colors": [
                    {"name": "Sage Green", "hex": "#0ca678"},
                    {"name": "Off White", "hex": "#f8f9fa"}
                ],
                "sizes": ["0-1M", "1-3M"],
                "features": [
                    "Material: 100% Organic Muslin Cotton",
                    "Stitch: External soft-locking seams",
                    "Design: Front overlap tie-up",
                    "Care: Machine wash cold, gentle cycle"
                ],
                "details": [
                    {"title": "Muslin Softness", "content": "Gets softer with every wash. Hypoallergenic and highly breathable."},
                    {"title": "Size Guide", "content": "Designed for babies from 2.5 kg to 5.5 kg."}
                ]
            },
            {
                "id": 2,
                "name": "Baby Pink Fleece Romper",
                "category_name": "Rompers",
                "parent_category": "3–6 Months",
                "price": 799.00,
                "original_price": 999.00,
                "discount": "-20%",
                "tag_type": "discount",
                "rating": 4.7,
                "reviews_count": 88,
                "is_new": True,
                "description": "Ultra-comfy romper in blush pink cotton fleece. Features a front double-slider zipper for quick diaper changes.",
                "image": "/products/hoodie_pink.png",
                "color_hex": "#fff0f6",
                "cart_btn_color": "bg-pink-500 hover:bg-pink-600",
                "colors": [
                    {"name": "Baby Pink", "hex": "#f783ac"},
                    {"name": "Matte Black", "hex": "#1c1c1e"}
                ],
                "sizes": ["3-6M", "6-9M"],
                "features": [
                    "Material: 95% Organic Cotton, 5% Elastane",
                    "Fastener: Two-way YKK safety zip",
                    "Safety: Built-in fold-over scratch mittens",
                    "Sole: Non-slip foot grips on larger sizes"
                ],
                "details": [
                    {"title": "Safety Zipper", "content": "Safety guard protects baby's chin from pinches."},
                    {"title": "Stretch & Flex", "content": "Excellent stretch recovery for active crawling babies."}
                ]
            },
            {
                "id": 3,
                "name": "Toddler Premium Soft Wash Jeans",
                "category_name": "Jeans",
                "parent_category": "2–3 Years",
                "price": 1199.00,
                "original_price": 1499.00,
                "discount": "-20%",
                "tag_type": "discount",
                "rating": 4.6,
                "reviews_count": 65,
                "is_new": False,
                "description": "Extremely soft denim trousers with an elasticized knit waistband. Designed to stay gentle on toddler bellies during active playtime.",
                "image": "/products/jeans_blue.png",
                "color_hex": "#e8f4fd",
                "cart_btn_color": "bg-blue-500 hover:bg-blue-600",
                "colors": [
                    {"name": "Classic Indigo", "hex": "#228be6"},
                    {"name": "Light Denim", "hex": "#a5d8ff"}
                ],
                "sizes": ["2-3Y", "3-4Y"],
                "features": [
                    "Material: 82% Cotton, 16% Polyester, 2% Spandex",
                    "Waistband: Ribbed elastic with mock drawstring",
                    "Pockets: 4-pocket configuration",
                    "Fly: Mock fly detailing"
                ],
                "details": [
                    {"title": "Soft Wash Denim", "content": "Enzyme washed for high comfort. No stiff fabrics or scratchy buttons."},
                    {"title": "Fit Advice", "content": "Relaxed hip and thigh room for active toddler steps."}
                ]
            },
            {
                "id": 4,
                "name": "Striped Smart Casual Frock",
                "category_name": "Frocks",
                "parent_category": "12–18 Months",
                "price": 899.00,
                "original_price": 899.00,
                "discount": "BEST SELLER",
                "tag_type": "bestseller",
                "rating": 4.9,
                "reviews_count": 110,
                "is_new": False,
                "description": "Cute resort-style striped dress for little girls. Styled with a dynamic collar and wood-accent buttons.",
                "image": "/products/shirt_striped.png",
                "color_hex": "#fff9db",
                "cart_btn_color": "bg-amber-500 hover:bg-amber-600",
                "colors": [
                    {"name": "Yellow Striped", "hex": "#fab005"},
                    {"name": "Sage Striped", "hex": "#40c057"}
                ],
                "sizes": ["12-18M", "18-24M", "2-3Y"],
                "features": [
                    "Material: 70% Muslin Linen, 30% Cotton",
                    "Detailing: Tiered flared skirt",
                    "Buttons: Natural shell buttons",
                    "Inner: Breathable cotton slip lining"
                ],
                "details": [
                    {"title": "Tiered Flared Silhouette", "content": "Flared design allows free mobility and ventilation."},
                    {"title": "Washing Guide", "content": "Gentle cold cycle. Warm iron if required."}
                ]
            },
            {
                "id": 5,
                "name": "First Steps Soft Sole Trainers",
                "category_name": "Shoes",
                "parent_category": "12–18 Months",
                "price": 1499.00,
                "original_price": 1999.00,
                "discount": "-25%",
                "tag_type": "discount",
                "rating": 4.8,
                "reviews_count": 74,
                "is_new": False,
                "description": "Clean retro low-top trainer structured in micro-stitched full grain baby-safe synthetic leather. Fully flexible rubber sole.",
                "image": "/products/sneakers_white.png",
                "color_hex": "#f1f3f5",
                "cart_btn_color": "bg-emerald-500 hover:bg-emerald-600",
                "colors": [
                    {"name": "Bright White", "hex": "#f8f9fa"},
                    {"name": "Matte Black", "hex": "#1c1c1e"}
                ],
                "sizes": ["18-24M", "2Y", "3Y"],
                "features": [
                    "Material: Hypoallergenic PU Leather Upper",
                    "Fastener: Double hook-and-loop straps",
                    "Insole: Breathable cushioned latex arch",
                    "Outsole: Ultra-flexible non-marking rubber"
                ],
                "details": [
                    {"title": "Pediatric Friendly", "content": "Wide toe box design supports natural toe splay and stable balance."},
                    {"title": "Easy On/Off", "content": "Velcro straps allow kids to step in and out in seconds."}
                ]
            },
            {
                "id": 6,
                "name": "Dinosaur Kids School Backpack",
                "category_name": "School Bags",
                "parent_category": "Bags",
                "price": 999.00,
                "original_price": 1299.00,
                "discount": "NEW",
                "tag_type": "new",
                "rating": 4.7,
                "reviews_count": 45,
                "is_new": True,
                "description": "Adorable dinosaur-themed school pack for nursery and kindergarten. Built with water-resistant lightweight neoprene fabric.",
                "image": "/products/backpack_black.png",
                "color_hex": "#f3f0ff",
                "cart_btn_color": "bg-purple-500 hover:bg-purple-600",
                "colors": [
                    {"name": "Matte Black", "hex": "#1c1c1e"},
                    {"name": "Navy Blue", "hex": "#1864ab"}
                ],
                "sizes": ["One Size"],
                "features": [
                    "Material: Eco-friendly Waterproof Neoprene",
                    "Compartment: 1 main pocket, 1 front zip box",
                    "Straps: Cushioned ergonomic mesh shoulder pads",
                    "Buckle: Adjustable chest stability clip"
                ],
                "details": [
                    {"title": "Ultra Lightweight", "content": "Weighs only 280g, ensuring minimal burden on young shoulders."},
                    {"title": "Dynamic Neoprene", "content": "Shock-absorbing and insulating fabric keeps contents safe and cool."}
                ]
            },
            {
                "id": 7,
                "name": "Wooden building Blocks Play Set",
                "category_name": "Wooden Toys",
                "parent_category": "Toys",
                "price": 699.00,
                "original_price": 899.00,
                "discount": "-22%",
                "tag_type": "discount",
                "rating": 4.9,
                "reviews_count": 95,
                "is_new": False,
                "description": "50-piece set of natural pine wood blocks in geometric shapes. Dyed in non-toxic water-based paints for safe child development.",
                "image": "/products/cargo_pants_khaki.png",
                "color_hex": "#fcf8f2",
                "cart_btn_color": "bg-amber-600 hover:bg-amber-700",
                "colors": [
                    {"name": "Natural Pine", "hex": "#d6c39f"}
                ],
                "sizes": ["50 Pcs"],
                "features": [
                    "Material: Sustainable Baltic Pine Wood",
                    "Paint: Safe food-grade child paints",
                    "Storage: Reusable cotton canvas bag included",
                    "Ages: Recommended for 18 months and up"
                ],
                "details": [
                    {"title": "Cognitive Dev", "content": "Boosts spatial intelligence, logical alignment, and fine motor skills."},
                    {"title": "Sanding Standard", "content": "Double-sanded block profiles avoid splinters and rough surfaces."}
                ]
            },
            {
                "id": 8,
                "name": "Interactive Learning Activity Book",
                "category_name": "Activity Books",
                "parent_category": "Books",
                "price": 299.00,
                "original_price": 399.00,
                "discount": "-25%",
                "tag_type": "discount",
                "rating": 4.8,
                "reviews_count": 142,
                "is_new": False,
                "description": "Thick wipe-clean write-in page learning book for pre-readers. Complete with tracing paths, color cards, and sticker grids.",
                "image": "/products/oversized_tshirt_black.png",
                "color_hex": "#e9ecef",
                "cart_btn_color": "bg-zinc-800 hover:bg-zinc-950",
                "colors": [
                    {"name": "Color Block", "hex": "#1c1c1e"}
                ],
                "sizes": ["Standard"],
                "features": [
                    "Pages: 48 High-gloss laminated pages",
                    "Accessory: Wipe-clean non-toxic marker included",
                    "Stickers: 100+ reusable shape stickers",
                    "Themes: Letters, numbers, and basic shapes"
                ],
                "details": [
                    {"title": "Wipe-Clean Feature", "content": "Glossy pages let kids trace, erase, and practice writing over and over."},
                    {"title": "Pre-School Prep", "content": "Designed in collaboration with childhood development experts."}
                ]
            }
        ]

        # 3. Create Products and Child Records
        for prod in products_data:
            cat_obj = categories_dict[prod["category_name"]]
            
            # Map stock matching dashboard defaults
            prod_stock = 85 if prod["id"] == 1 else 12 if prod["id"] == 3 else 0 if prod["id"] == 5 else 35
            
            p_obj = Product.objects.create(
                id=prod["id"],
                name=prod["name"],
                category=cat_obj,
                parent_category=prod["parent_category"],
                price=prod["price"],
                original_price=prod["original_price"],
                discount=prod["discount"],
                tag_type=prod["tag_type"],
                rating=prod["rating"],
                reviews_count=prod["reviews_count"],
                is_new=prod["is_new"],
                description=prod["description"],
                image=prod["image"],
                color_hex=prod["color_hex"],
                cart_btn_color=prod["cart_btn_color"],
                stock=prod_stock
            )

            for color in prod["colors"]:
                ProductColor.objects.create(
                    product=p_obj,
                    name=color["name"],
                    hex=color["hex"]
                )

            for size in prod["sizes"]:
                ProductSize.objects.create(
                    product=p_obj,
                    size=size
                )

            for feat in prod["features"]:
                ProductFeature.objects.create(
                    product=p_obj,
                    feature_text=feat
                )

            for detail in prod["details"]:
                ProductDetail.objects.create(
                    product=p_obj,
                    title=detail["title"],
                    content=detail["content"]
                )

            self.stdout.write(f"Created product: {p_obj.name}")

        # 4. Seed Hero Banners
        hero_banners_data = [
            {"src": "/banner/banner1.png", "alt": "vdgfashion Hero Banner 1"},
            {"src": "/banner/banner2.png", "alt": "vdgfashion Hero Banner 2"},
            {"src": "/banner/banner3.png", "alt": "vdgfashion Hero Banner 3"},
        ]
        for idx, item in enumerate(hero_banners_data):
            hb = HeroBanner.objects.create(
                id=idx+1,
                src=item["src"],
                alt=item["alt"]
            )
            self.stdout.write(f"Created HeroBanner: {hb.alt}")

        # 5. Seed Category Items (pastels slider)
        category_items_data = [
            {"name": "New Born", "bg": "#e6fcf5", "img": "/products/tshirt_green.png", "categoryRef": "New Born (0–3 Months)"},
            {"name": "Baby Essentials", "bg": "#fff0f6", "img": "/products/hoodie_pink.png", "categoryRef": "Baby Essentials"},
            {"name": "Toys", "bg": "#fcf8f2", "img": "/products/cargo_pants_khaki.png", "categoryRef": "Toys"},
            {"name": "Books", "bg": "#e9ecef", "img": "/products/oversized_tshirt_black.png", "categoryRef": "Books"},
            {"name": "Stationery", "bg": "#f3f0ff", "img": "/products/backpack_black.png", "categoryRef": "Stationery"},
            {"name": "Bags", "bg": "#f3f0ff", "img": "/products/backpack_black.png", "categoryRef": "Bags"},
            {"name": "Jeans", "bg": "#e8f4fd", "img": "/products/jeans_blue.png", "categoryRef": "Jeans"},
            {"name": "Frocks", "bg": "#fff9db", "img": "/products/shirt_striped.png", "categoryRef": "Frocks"},
        ]
        for idx, item in enumerate(category_items_data):
            ci = CategoryItem.objects.create(
                id=idx+1,
                name=item["name"],
                bg=item["bg"],
                img=item["img"],
                categoryRef=item["categoryRef"]
            )
            self.stdout.write(f"Created CategoryItem: {ci.name}")

        # 6. Seed Marketing Banners (twin cards)
        marketing_banners_data = [
            {
                "title": "Summer Outfits",
                "description": "100% Pure Natural Cotton Wear",
                "bg": "#d9f2ec",
                "img": "/products/tshirt_green.png",
                "buttonText": "SHOP NOW",
                "categoryRef": "T-Shirts"
            },
            {
                "title": "Winter Hoodies",
                "description": "With 25% Off All Winter Wear",
                "bg": "#faedd0",
                "img": "/products/hoodie_pink.png",
                "buttonText": "SHOP NOW",
                "categoryRef": "Rompers"
            }
        ]
        for idx, item in enumerate(marketing_banners_data):
            mb = MarketingBanner.objects.create(
                id=idx+1,
                title=item["title"],
                description=item["description"],
                bg=item["bg"],
                img=item["img"],
                buttonText=item["buttonText"],
                categoryRef=item["categoryRef"]
            )
            self.stdout.write(f"Created MarketingBanner: {mb.title}")

        self.stdout.write(self.style.SUCCESS("All products and CMS layout templates seeded successfully!"))
