# Category Image Path Feature

## ✅ Admin Panel - Category Add/Edit

### Two Options for Images:

#### Option 1: Upload Image File
- Click "Choose File" under **Image** field
- Upload image from computer
- Image saved to: `media/categories/`
- Auto URL: `http://localhost:8000/media/categories/filename.jpg`

#### Option 2: Enter Image Path
- Type path in **Image Path** field
- Example: `/products/tshirt_green.png`
- Example: `/banner/banner1.png`
- Example: `https://example.com/image.jpg`

### Priority:
**Image Path > Uploaded Image**
- If both provided, Image Path will be used
- If only Image Path, that will be used
- If only Upload, uploaded image URL will be used

---

## 📝 Admin Panel Fields:

```
Category Add/Edit Form:
├── Name: [Text Input]
├── Parent Category: [Text Input]
├── Image: [File Upload Button]
├── Image Path: [Text Input] ← NEW!
├── Order: [Number]
└── Is Active: [Checkbox]
```

---

## 🎯 Usage Examples:

### Example 1: Upload Image
```
Name: T-Shirts
Parent Category: Baby (0-24M)
Image: [Upload tshirt.jpg]
Image Path: [Leave empty]
```
**Result:** Uses uploaded image

### Example 2: Use Path
```
Name: Frocks
Parent Category: Kids & Teens
Image: [Leave empty]
Image Path: /products/frock_category.png
```
**Result:** Uses /products/frock_category.png

### Example 3: Both Provided
```
Name: Jeans
Parent Category: 2-3 Years
Image: [Upload jeans.jpg]
Image Path: /products/jeans_category.png
```
**Result:** Uses /products/jeans_category.png (Path has priority)

---

## 📡 API Response:

```json
{
  "id": 1,
  "name": "T-Shirts",
  "parent_category": "Baby (0-24M)",
  "image": "/media/categories/tshirt.jpg",
  "image_path": "/products/tshirt_green.png",
  "image_url": "/products/tshirt_green.png",
  "order": 1,
  "is_active": true
}
```

**Note:** `image_url` automatically returns the correct image (path or uploaded)

---

## 🚀 Start Server:

```bash
cd c:\Users\WEB TEAM\Downloads\fashion\ecommerce_backend
python manage.py runserver
```

## 🔐 Admin Login:
- URL: http://localhost:8000/admin
- Username: admin
- Password: admin123

---

## ✨ Benefits:

✅ Flexible image management
✅ Can use existing frontend images
✅ Can upload new images
✅ Easy to switch between options
✅ No need to re-upload if path exists
✅ Frontend automatically gets correct image

---

## 📱 Frontend Usage:

```javascript
// Fetch categories
const res = await fetch('http://localhost:8000/api/categories/');
const categories = await res.json();

// Display - image_url automatically has correct path
categories.map(cat => (
  <img src={cat.image_url} alt={cat.name} />
))
```

**Admin la name + image path type pannina, automatic ah frontend la show aagum!** 🎉
