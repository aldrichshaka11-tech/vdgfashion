// Frontend Integration Example - Categories Display

// API URL
const API_URL = 'http://localhost:8000/api';

// Fetch Categories from Backend
async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories/`);
    const categories = await response.json();
    
    console.log('Categories from Admin:', categories);
    
    // Display categories on page
    displayCategories(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

// Display Categories
function displayCategories(categories) {
  const container = document.getElementById('categories-container');
  
  categories.forEach(category => {
    const categoryCard = `
      <div class="category-card">
        <img src="${category.image_url}" alt="${category.name}" />
        <h3>${category.name}</h3>
        <p>${category.parent_category || ''}</p>
      </div>
    `;
    container.innerHTML += categoryCard;
  });
}

// Call on page load
fetchCategories();


// ============================================
// Next.js Example (app/page.js)
// ============================================

export default async function HomePage() {
  // Fetch categories from backend
  const res = await fetch('http://localhost:8000/api/categories/', {
    cache: 'no-store'
  });
  const categories = await res.json();
  
  return (
    <div>
      <h1>Categories</h1>
      <div className="grid grid-cols-4 gap-4">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <img 
              src={category.image_url} 
              alt={category.name}
              className="w-full h-48 object-cover"
            />
            <h3 className="text-lg font-bold mt-2">{category.name}</h3>
            {category.parent_category && (
              <p className="text-sm text-gray-600">{category.parent_category}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}


// ============================================
// API Response Example
// ============================================

/*
GET http://localhost:8000/api/categories/

Response:
[
  {
    "id": 1,
    "name": "T-Shirts",
    "parent_category": "Baby (0-24M)",
    "image": "/media/categories/tshirt_category.jpg",
    "image_url": "http://localhost:8000/media/categories/tshirt_category.jpg",
    "order": 1,
    "is_active": true
  },
  {
    "id": 2,
    "name": "Frocks",
    "parent_category": "Kids & Teens",
    "image": "/media/categories/frock_category.jpg",
    "image_url": "http://localhost:8000/media/categories/frock_category.jpg",
    "order": 2,
    "is_active": true
  }
]
*/


// ============================================
// How Admin Upload Works
// ============================================

/*
1. Admin logs in: http://localhost:8000/admin
2. Goes to Categories section
3. Clicks "Add Category"
4. Fills in:
   - Name: "T-Shirts"
   - Parent Category: "Baby (0-24M)"
   - Image: Upload file
   - Order: 1
   - Is Active: ✓
5. Clicks "Save"

6. Frontend automatically gets this data via API:
   GET http://localhost:8000/api/categories/
   
7. Image URL is automatically generated:
   http://localhost:8000/media/categories/uploaded_image.jpg

8. Frontend displays the category with uploaded image!
*/
