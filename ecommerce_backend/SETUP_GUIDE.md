# E-Commerce Backend - Complete Setup Guide

## ✅ Setup Complete!

### 🔐 Admin Login Details:
- **URL:** http://localhost:8000/admin
- **Username:** admin
- **Password:** admin123

### 🗄️ Database:
- **Type:** MySQL (XAMPP)
- **Database Name:** fashion_db
- **Host:** 127.0.0.1
- **Port:** 3306

---

## 🚀 How to Run Server:

```bash
cd c:\Users\WEB TEAM\Downloads\fashion\ecommerce_backend
python manage.py runserver
```

---

## 📝 Admin Panel Features:

### 1. **Categories** (http://localhost:8000/admin/shop/category/)
   - Add category name
   - Upload category image
   - Set parent category
   - Set display order
   - Enable/Disable

### 2. **Products** (http://localhost:8000/admin/shop/product/)
   - Product name & description
   - Upload product image
   - Set price & original price
   - Add discount
   - Set stock quantity
   - Add colors (inline)
   - Add sizes (inline)
   - Add features (inline)
   - Add details (inline)
   - Mark as New/Featured

### 3. **Hero Banners** (http://localhost:8000/admin/shop/herobanner/)
   - Banner title & subtitle
   - Upload banner image
   - Set link URL
   - Set display order
   - Enable/Disable

### 4. **Category Items** (http://localhost:8000/admin/shop/categoryitem/)
   - Category name
   - Upload image
   - Set background color
   - Set category reference
   - Set display order

### 5. **Marketing Banners** (http://localhost:8000/admin/shop/marketingbanner/)
   - Banner title & description
   - Upload image
   - Set background color
   - Set button text
   - Set category reference

### 6. **Orders** (http://localhost:8000/admin/shop/order/)
   - View all orders
   - See order items
   - Customer details
   - Payment method
   - Order total

---

## 🔗 API Endpoints:

### Categories:
- **GET** http://localhost:8000/api/categories/
- **POST** http://localhost:8000/api/categories/
- **GET** http://localhost:8000/api/categories/{id}/

### Products:
- **GET** http://localhost:8000/api/products/
- **POST** http://localhost:8000/api/products/
- **GET** http://localhost:8000/api/products/{id}/

### Hero Banners:
- **GET** http://localhost:8000/api/hero-banners/

### Category Items:
- **GET** http://localhost:8000/api/category-items/

### Marketing Banners:
- **GET** http://localhost:8000/api/marketing-banners/

### Orders:
- **POST** http://localhost:8000/api/orders/

---

## 📸 Media Files:

All uploaded images stored in:
```
ecommerce_backend/media/
├── categories/      (Category images)
├── products/        (Product images)
├── banners/         (Hero banner images)
├── category_items/  (Category item images)
└── marketing/       (Marketing banner images)
```

**Access uploaded images:**
http://localhost:8000/media/products/image_name.jpg

---

## 🎯 Workflow:

1. **Start XAMPP** - Make sure MySQL is running
2. **Run Server** - `python manage.py runserver`
3. **Login to Admin** - http://localhost:8000/admin
4. **Add Categories** - Upload name + image
5. **Add Products** - Upload product with all details
6. **Add Banners** - Upload hero banners for homepage
7. **Frontend Auto-Updates** - All data shows in frontend via API

---

## 🔄 Frontend Integration:

Your Next.js frontend will fetch data from:
```javascript
const API_URL = 'http://localhost:8000/api';

// Get all categories
fetch(`${API_URL}/categories/`)

// Get all products
fetch(`${API_URL}/products/`)

// Get hero banners
fetch(`${API_URL}/hero-banners/`)
```

---

## ✨ Key Features:

✅ Image upload support
✅ MySQL database (XAMPP)
✅ Active/Inactive toggle
✅ Display order management
✅ Inline editing for product variants
✅ Order management
✅ REST API for frontend
✅ CORS enabled for Next.js
✅ Media file serving

---

## 🛠️ Troubleshooting:

**If server won't start:**
1. Check XAMPP MySQL is running
2. Check port 8000 is free
3. Run: `python manage.py runserver 8001` (different port)

**If images don't show:**
1. Check MEDIA_URL in settings.py
2. Check file uploaded in media folder
3. Access: http://localhost:8000/media/products/filename.jpg

**If admin panel not loading:**
1. Clear browser cache
2. Check server is running
3. Try incognito mode

---

## 📞 Support:

All functionality working:
- ✅ Admin panel with image upload
- ✅ MySQL database connection
- ✅ API endpoints
- ✅ Frontend data display
- ✅ Order management

**Admin la upload pannuna data automatic ah frontend la show aagum!**
