# 🎯 Complete Admin Panel Guide - Real Data Upload

## 🚀 Start Server:
```bash
cd c:\Users\WEB TEAM\Downloads\fashion\ecommerce_backend
python manage.py runserver
```

## 🔐 Admin Login:
- **URL:** http://localhost:8000/admin
- **Username:** admin
- **Password:** admin123

---

## 📝 1. ADD CATEGORY

**Steps:**
1. Go to: http://localhost:8000/admin/shop/category/
2. Click **"Add Category"** button (top right)
3. Fill in fields:

```
┌─────────────────────────────────────┐
│ BASIC INFORMATION                   │
├─────────────────────────────────────┤
│ Name: T-Shirts                      │
│ Parent category: Baby (0-24M)       │
├─────────────────────────────────────┤
│ IMAGE UPLOAD                        │
├─────────────────────────────────────┤
│ Image: [Choose File] Browse...      │
│        (Upload from computer)       │
├─────────────────────────────────────┤
│ DISPLAY SETTINGS                    │
├─────────────────────────────────────┤
│ Order: 1                            │
│ Is active: ☑                        │
└─────────────────────────────────────┘
```

4. Click **"SAVE"** button

**Result:** Category created with uploaded image!

---

## 📦 2. ADD PRODUCT

**Steps:**
1. Go to: http://localhost:8000/admin/shop/product/
2. Click **"Add Product"** button
3. Fill in all fields:

```
┌─────────────────────────────────────────────┐
│ BASIC INFORMATION                           │
├─────────────────────────────────────────────┤
│ Name: Sage Green Organic Jabla              │
│ Category: [Select from dropdown]            │
│ Parent category: New Born (0–3 Months)      │
│ Description: [Full product description]     │
├─────────────────────────────────────────────┤
│ PRICING                                     │
├─────────────────────────────────────────────┤
│ Price: 349.00                               │
│ Original price: 499.00                      │
│ Discount: -30%                              │
├─────────────────────────────────────────────┤
│ INVENTORY                                   │
├─────────────────────────────────────────────┤
│ Stock: 50                                   │
├─────────────────────────────────────────────┤
│ IMAGE UPLOAD                                │
├─────────────────────────────────────────────┤
│ Image: [Choose File] Browse...              │
│        (Upload product image)               │
├─────────────────────────────────────────────┤
│ DESIGN COLORS                               │
├─────────────────────────────────────────────┤
│ Color hex: #e6fcf5                          │
│ Cart btn color: bg-teal-500 hover:bg-teal-600│
├─────────────────────────────────────────────┤
│ TAGS & STATUS                               │
├─────────────────────────────────────────────┤
│ Tag type: [Select: discount/bestseller/new] │
│ Is new: ☑                                   │
│ Is active: ☑                                │
│ Rating: 4.8                                 │
│ Reviews count: 120                          │
└─────────────────────────────────────────────┘
```

4. **Add Colors** (Inline section below):
```
┌─────────────────────────────────────┐
│ PRODUCT COLORS                      │
├─────────────────────────────────────┤
│ Name: Sage Green  | Hex: #0ca678    │
│ Name: Off White   | Hex: #f8f9fa    │
└─────────────────────────────────────┘
```

5. **Add Sizes** (Inline section):
```
┌─────────────────────────────────────┐
│ PRODUCT SIZES                       │
├─────────────────────────────────────┤
│ Size: 0-1M                          │
│ Size: 1-3M                          │
│ Size: 3-6M                          │
└─────────────────────────────────────┘
```

6. **Add Features** (Inline section):
```
┌─────────────────────────────────────┐
│ PRODUCT FEATURES                    │
├─────────────────────────────────────┤
│ Feature: Material: 100% Organic Cotton│
│ Feature: Stitch: Soft seams         │
│ Feature: Care: Machine wash cold    │
└─────────────────────────────────────┘
```

7. **Add Details** (Inline section):
```
┌─────────────────────────────────────┐
│ PRODUCT DETAILS                     │
├─────────────────────────────────────┤
│ Title: Muslin Softness              │
│ Content: Gets softer with every wash│
│                                     │
│ Title: Size Guide                   │
│ Content: Designed for babies 2.5-5kg│
└─────────────────────────────────────┘
```

8. Click **"SAVE"**

**Result:** Complete product with all details created!

---

## 🎨 3. ADD HERO BANNER

**Steps:**
1. Go to: http://localhost:8000/admin/shop/herobanner/
2. Click **"Add Hero Banner"**
3. Fill in:

```
┌─────────────────────────────────────┐
│ CONTENT                             │
├─────────────────────────────────────┤
│ Title: Summer Collection 2024       │
│ Subtitle: Up to 50% Off             │
│ Alt: Summer banner                  │
│ Link: /collections/summer           │
├─────────────────────────────────────┤
│ IMAGE UPLOAD                        │
├─────────────────────────────────────┤
│ Image: [Choose File] Browse...      │
│        (Upload banner image)        │
├─────────────────────────────────────┤
│ DISPLAY SETTINGS                    │
├─────────────────────────────────────┤
│ Order: 1                            │
│ Is active: ☑                        │
└─────────────────────────────────────┘
```

4. Click **"SAVE"**

---

## 🏷️ 4. ADD CATEGORY ITEM

**Steps:**
1. Go to: http://localhost:8000/admin/shop/categoryitem/
2. Click **"Add Category Item"**
3. Fill in:

```
┌─────────────────────────────────────┐
│ BASIC INFORMATION                   │
├─────────────────────────────────────┤
│ Name: Toys                          │
│ Category ref: Toys                  │
│ Bg: #fff0f6                         │
├─────────────────────────────────────┤
│ IMAGE UPLOAD                        │
├─────────────────────────────────────┤
│ Image: [Choose File] Browse...      │
├─────────────────────────────────────┤
│ DISPLAY SETTINGS                    │
├─────────────────────────────────────┤
│ Order: 1                            │
│ Is active: ☑                        │
└─────────────────────────────────────┘
```

4. Click **"SAVE"**

---

## 📢 5. ADD MARKETING BANNER

**Steps:**
1. Go to: http://localhost:8000/admin/shop/marketingbanner/
2. Click **"Add Marketing Banner"**
3. Fill in:

```
┌─────────────────────────────────────┐
│ CONTENT                             │
├─────────────────────────────────────┤
│ Title: New Arrivals                 │
│ Description: Fresh styles for kids  │
│ Button text: SHOP NOW               │
│ Category ref: New Arrivals          │
├─────────────────────────────────────┤
│ DESIGN                              │
├─────────────────────────────────────┤
│ Bg: #e8f4fd                         │
├─────────────────────────────────────┤
│ IMAGE UPLOAD                        │
├─────────────────────────────────────┤
│ Image: [Choose File] Browse...      │
├─────────────────────────────────────┤
│ DISPLAY SETTINGS                    │
├─────────────────────────────────────┤
│ Order: 1                            │
│ Is active: ☑                        │
└─────────────────────────────────────┘
```

4. Click **"SAVE"**

---

## 📊 6. VIEW ORDERS

**Steps:**
1. Go to: http://localhost:8000/admin/shop/order/
2. See all customer orders
3. Click on any order to view:
   - Customer details
   - Order items
   - Payment method
   - Total amount
   - Shipping address

**Note:** Orders are created from frontend, view-only in admin

---

## 🎯 WORKFLOW SUMMARY:

```
1. Login to Admin Panel
   ↓
2. Add Categories (with images)
   ↓
3. Add Products (with all details + images)
   ↓
4. Add Hero Banners (homepage sliders)
   ↓
5. Add Category Items (category showcase)
   ↓
6. Add Marketing Banners (promotional)
   ↓
7. Frontend automatically shows all data!
```

---

## 📸 UPLOADED FILES LOCATION:

```
ecommerce_backend/media/
├── categories/          ← Category images
├── products/            ← Product images
├── banners/             ← Hero banner images
├── category_items/      ← Category item images
└── marketing/           ← Marketing banner images
```

---

## 🔗 FRONTEND AUTO-FETCH:

Frontend automatically gets data from:
- Categories: http://localhost:8000/api/categories/
- Products: http://localhost:8000/api/products/
- Hero Banners: http://localhost:8000/api/hero-banners/
- Category Items: http://localhost:8000/api/category-items/
- Marketing Banners: http://localhost:8000/api/marketing-banners/

**Admin la upload pannuna data automatic ah frontend la show aagum!** 🎉

---

## ✅ FEATURES:

✅ Real file upload (no API paths needed)
✅ Image preview in admin list
✅ Inline editing for product variants
✅ Order management
✅ Active/Inactive toggle
✅ Display order control
✅ Search & filter options
✅ Full CRUD operations
✅ MySQL database (XAMPP)
✅ Auto API endpoints for frontend

---

## 🛠️ TROUBLESHOOTING:

**Images not uploading?**
- Check media folder exists
- Check file permissions
- Check file size (max 10MB)

**Can't save data?**
- Check all required fields filled
- Check MySQL is running
- Check server is running

**Frontend not showing data?**
- Check server is running
- Check API URL correct
- Check CORS enabled
- Check data is marked "Is active"

---

## 📞 SUPPORT:

Everything works without API configuration!
Just upload data in admin panel and it automatically appears in frontend! 🚀
