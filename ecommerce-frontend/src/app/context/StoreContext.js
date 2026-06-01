'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS } from '../data/products';

const DEFAULT_HERO_BANNERS = [
  { id: 1, src: '/banner/banner1.png', alt: 'vdgfashion Hero Banner 1' },
  { id: 2, src: '/banner/banner2.png', alt: 'vdgfashion Hero Banner 2' },
  { id: 3, src: '/banner/banner3.png', alt: 'vdgfashion Hero Banner 3' }
];

const DEFAULT_CATEGORY_ITEMS = [
  { id: 1, name: 'New Born', bg: '#e6fcf5', img: '/products/tshirt_green.png', categoryRef: 'New Born (0–3 Months)' },
  { id: 2, name: 'Baby Essentials', bg: '#fff0f6', img: '/products/hoodie_pink.png', categoryRef: 'Baby Essentials' },
  { id: 3, name: 'Toys', bg: '#fcf8f2', img: '/products/cargo_pants_khaki.png', categoryRef: 'Toys' },
  { id: 4, name: 'Books', bg: '#e9ecef', img: '/products/oversized_tshirt_black.png', categoryRef: 'Books' },
  { id: 5, name: 'Stationery', bg: '#f3f0ff', img: '/products/backpack_black.png', categoryRef: 'Stationery' },
  { id: 6, name: 'Bags', bg: '#f3f0ff', img: '/products/backpack_black.png', categoryRef: 'Bags' },
  { id: 7, name: 'Jeans', bg: '#e8f4fd', img: '/products/jeans_blue.png', categoryRef: 'Jeans' },
  { id: 8, name: 'Frocks', bg: '#fff9db', img: '/products/shirt_striped.png', categoryRef: 'Frocks' },
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
            if (n.includes('born') || n.includes('jabla') || n.includes('jab')) return '#e6fcf5';
            if (n.includes('essential') || n.includes('romper')) return '#fff0f6';
            if (n.includes('toy') || n.includes('wood')) return '#fcf8f2';
            if (n.includes('book') || n.includes('learn') || n.includes('activity')) return '#e9ecef';
            if (n.includes('station') || n.includes('bag') || n.includes('school')) return '#f3f0ff';
            if (n.includes('jean')) return '#e8f4fd';
            if (n.includes('frock') || n.includes('dress')) return '#fff9db';
            if (n.includes('shoe') || n.includes('trainer')) return '#f1f3f5';
            return '#f8fafc';
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
