'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const DEFAULT_HERO_BANNERS = [
  { id: 1, src: '/banner/banner1.png', alt: 'vdgfashion Hero Banner 1' },
  { id: 2, src: '/banner/banner2.png', alt: 'vdgfashion Hero Banner 2' },
  { id: 3, src: '/banner/banner3.png', alt: 'vdgfashion Hero Banner 3' }
];

const DEFAULT_CATEGORY_ITEMS = [
  { id: 1, name: 'New Born', bg: '#b2f2e0', img: '/products/tshirt_green.png', categoryRef: 'New Born (0–3 Months)' },
  { id: 2, name: 'Baby Essentials', bg: '#ffc6e0', img: '/products/hoodie_pink.png', categoryRef: 'Baby Essentials' },
  { id: 3, name: 'Toys', bg: '#ffd8a8', img: '/products/cargo_pants_khaki.png', categoryRef: 'Toys' },
  { id: 4, name: 'Books', bg: '#d0bfff', img: '/products/oversized_tshirt_black.png', categoryRef: 'Books' },
  { id: 5, name: 'Stationery', bg: '#ffb3d1', img: '/products/backpack_black.png', categoryRef: 'Stationery' },
  { id: 6, name: 'Bags', bg: '#c4b5fd', img: '/products/backpack_black.png', categoryRef: 'Bags' },
  { id: 7, name: 'Jeans', bg: '#93c5fd', img: '/products/jeans_blue.png', categoryRef: 'Jeans' },
  { id: 8, name: 'Frocks', bg: '#fde68a', img: '/products/shirt_striped.png', categoryRef: 'Frocks' },
];

const DEFAULT_MARKETING_BANNERS = [
  {
    id: 1,
    title: "Summer Outfits",
    description: "100% Pure Natural Cotton Wear",
    bg: "#d9f2ec",
    img: "/products/tshirt_green.png",
    buttonText: "SHOP NOW",
    categoryRef: "T-Shirts"
  },
  {
    id: 2,
    title: "Winter Hoodies",
    description: "With 25% Off All Winter Wear",
    bg: "#faedd0",
    img: "/products/hoodie_pink.png",
    buttonText: "SHOP NOW",
    categoryRef: "Rompers"
  }
];

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Products state (dynamic from Django, falls back to static PRODUCTS)
  const [products, setProducts] = useState(PRODUCTS);

  // User state
  const [user, setUser] = useState(null);

  // Initialize storefront user session
  useEffect(() => {
    const token = localStorage.getItem('vgd_user_token');
    const savedUser = localStorage.getItem('vgd_user_profile');
    if (token && savedUser) {
      try {
        setUser({ ...JSON.parse(savedUser), token });
      } catch (e) {
        localStorage.removeItem('vgd_user_token');
        localStorage.removeItem('vgd_user_profile');
      }
    }
  }, []);

  const loginUser = async (username, password) => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('vgd_user_token', data.access);
        const profileRes = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
          headers: { 'Authorization': `Bearer ${data.access}` }
        });
        const profileData = await profileRes.json();
        if (profileRes.ok) {
          localStorage.setItem('vgd_user_profile', JSON.stringify(profileData));
          setUser({ ...profileData, token: data.access });
          return { success: true };
        }
      }
      return { success: false, message: data.detail || 'Invalid login credentials!' };
    } catch (e) {
      return { success: false, message: 'Server connection failed!' };
    }
  };

  const registerUser = async (username, email, password, firstName = '', lastName = '') => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, first_name: firstName, last_name: lastName })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('vgd_user_token', data.tokens.access);
        localStorage.setItem('vgd_user_profile', JSON.stringify(data.user));
        setUser({ ...data.user, token: data.tokens.access });
        return { success: true };
      }
      const errorMsg = Object.entries(data)
        .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
        .join(' | ');
      return { success: false, message: errorMsg || 'Registration failed!' };
    } catch (e) {
      return { success: false, message: 'Server connection failed!' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('vgd_user_token');
    localStorage.removeItem('vgd_user_profile');
    setUser(null);
  };

  // Storefront dynamic layouts (CMS components)
  const [heroBanners, setHeroBanners] = useState(DEFAULT_HERO_BANNERS);
  const [categoryItems, setCategoryItems] = useState(DEFAULT_CATEGORY_ITEMS);
  const [marketingBanners, setMarketingBanners] = useState(DEFAULT_MARKETING_BANNERS);

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state (array of product IDs)
  const [wishlist, setWishlist] = useState([]);

  // Fetch products and CMS storefront layouts from Django API on mount
  useEffect(() => {
    // 1. Fetch Products
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => {
        if (!res.ok) throw new Error('API server offline or invalid response');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map((p) => {
            let img = p.image;
            if (img && img.startsWith('/media/')) {
              img = `http://127.0.0.1:8000${img}`;
            }
            let thumbs = p.thumbnails || [];
            if (thumbs && thumbs.length > 0) {
              thumbs = thumbs.map((t) => (t && t.startsWith('/media/') ? `http://127.0.0.1:8000${t}` : t));
            } else {
              thumbs = [img];
            }
            return { 
              ...p, 
              image: img, 
              thumbnails: thumbs,
              colorHex: p.color_hex || p.colorHex,
              cartBtnColor: p.cart_btn_color || p.cartBtnColor || 'bg-rose-600 hover:bg-rose-700',
              originalPrice: p.original_price !== undefined ? p.original_price : p.originalPrice,
              reviewsCount: p.reviews_count !== undefined ? p.reviews_count : p.reviewsCount,
              isNew: p.is_new !== undefined ? p.is_new : p.isNew,
              tagType: p.tag_type || p.tagType
            };
          });
          setProducts(formatted);
        }
      })
      .catch(err => {
        console.warn('API fetch failed, using static products fallback:', err);
      });

    // 2. Fetch Hero Banners
    fetch('http://127.0.0.1:8000/api/hero-banners/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map((b) => {
            let src = b.src;
            if (src && src.startsWith('/media/')) {
              src = `http://127.0.0.1:8000${src}`;
            }
            return { ...b, src };
          });
          setHeroBanners(formatted);
        }
      })
      .catch(() => {});

    // 3. Fetch Category Items dynamically from Categories API to sync with Admin Page
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          const getPastelBg = (name) => {
            const n = name.toLowerCase();
            if (n.includes('born') || n.includes('jabla') || n.includes('jab')) return '#b2f2e0';
            if (n.includes('essential') || n.includes('romper')) return '#ffc6e0';
            if (n.includes('toy') || n.includes('wood')) return '#ffd8a8';
            if (n.includes('book') || n.includes('learn') || n.includes('activity')) return '#d0bfff';
            if (n.includes('station')) return '#ffb3d1';
            if (n.includes('bag') || n.includes('school')) return '#c4b5fd';
            if (n.includes('jean')) return '#93c5fd';
            if (n.includes('frock') || n.includes('dress')) return '#fde68a';
            if (n.includes('shoe') || n.includes('trainer')) return '#99f6e4';
            return '#bfdbfe';
          };

          const mapped = data.map((c) => {
            let img = c.image_url || c.image || '/products/accessories_category.png';
            if (img && img.startsWith('/media/')) {
              img = `http://127.0.0.1:8000${img}`;
            }
            return {
              id: c.id,
              name: c.name,
              bg: getPastelBg(c.name),
              img,
              categoryRef: c.name
            };
          });
          setCategoryItems(mapped);
        }
      })
      .catch(() => {});

    // 4. Fetch Marketing Banners
    fetch('http://127.0.0.1:8000/api/marketing-banners/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          const formatted = data.map((mb) => {
            let img = mb.img;
            if (img && img.startsWith('/media/')) {
              img = `http://127.0.0.1:8000${img}`;
            }
            return { ...mb, img };
          });
          setMarketingBanners(formatted);
        }
      })
      .catch(() => {});
  }, []);

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [checkedCategories, setCheckedCategories] = useState([]); // Array of checked categories
  const [priceRange, setPriceRange] = useState(5000); // Max budget in INR
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT'); // DEFAULT, PRICE_LOW_HIGH, PRICE_HIGH_LOW, RATING

  // Active view: either 'shop' or the full product object itself for detailed viewing
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    const savedCart = localStorage.getItem('urbanwear_cart');
    const savedWishlist = localStorage.getItem('urbanwear_wishlist');
    
    setTimeout(() => {
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error("Failed loading cart", e);
        }
      }
      if (savedWishlist) {
        try {
          setWishlist(JSON.parse(savedWishlist));
        } catch (e) {
          console.error("Failed loading wishlist", e);
        }
      }
    }, 0);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('urbanwear_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('urbanwear_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart operations
  const addToCart = (product, color, size, quantity = 1) => {
    setCart((prevCart) => {
      // Find if item already exists with exact color and size
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, selectedColor: color, selectedSize: size, quantity }];
      }
    });
    // Open the cart drawer to give immediate feedback
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color, size) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === color &&
            item.selectedSize === size
          )
      )
    );
  };

  const updateCartQuantity = (productId, color, size, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist((prevWishlist) => {
      if (prevWishlist.includes(productId)) {
        return prevWishlist.filter((id) => id !== productId);
      } else {
        return [...prevWishlist, productId];
      }
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // Cart count and totals calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const shippingFee = cartSubtotal > 3000 || cartSubtotal === 0 ? 0 : 99; // Free shipping over ₹3000
  const couponDiscount = appliedCoupon === 'TREND10' ? Math.round(cartSubtotal * 0.10) : 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  // Coupon operations
  const applyCoupon = (code) => {
    if (code.trim().toUpperCase() === 'TREND10') {
      setAppliedCoupon('TREND10');
      return { success: true, message: 'Coupon applied successfully! 10% discount added.' };
    }
    return { success: false, message: 'Invalid coupon code!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('ALL');
    setCheckedCategories([]);
    setPriceRange(5000);
    setSelectedColor('');
    setSelectedSize('');
    setSortBy('DEFAULT');
    setSearchQuery('');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        heroBanners,
        categoryItems,
        marketingBanners,
        cart,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,

        // Filters
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        checkedCategories,
        setCheckedCategories,
        priceRange,
        setPriceRange,
        selectedColor,
        setSelectedColor,
        selectedSize,
        setSelectedSize,
        sortBy,
        setSortBy,
        resetFilters,

        // Routing / Active Product Detail View
        selectedProduct,
        setSelectedProduct,

        // Customer Authentication State & Methods
        user,
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
