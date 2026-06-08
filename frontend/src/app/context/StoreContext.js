'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export function StoreProvider({ children }) {
  // Products state (dynamic from Django, falls back to static PRODUCTS)
  const [products, setProducts] = useState([]);

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

  // Default fallback banners using public folder images
  const defaultBanners = [
    {
      id: 'default-1',
      src: '/banner/11.webp',
      alt: 'VGD Fashion Banner 1'
    },
    {
      id: 'default-2',
      src: '/banner/12.webp',
      alt: 'VGD Fashion Banner 2'
    },
    {
      id: 'default-3',
      src: '/banner/13.webp',
      alt: 'VGD Fashion Banner 3'
    }
  ];

  const defaultMobileBanners = [
    {
      id: 'default-mobile-1',
      src: '/banner/21.webp',
      alt: 'VGD Fashion Banner 1'
    },
    {
      id: 'default-mobile-2',
      src: '/banner/22.webp',
      alt: 'VGD Fashion Banner 2'
    },
    {
      id: 'default-mobile-3',
      src: '/banner/23.webp',
      alt: 'VGD Fashion Banner 3'
    }
  ];

  // Storefront dynamic layouts (CMS components)
  const [heroBanners, setHeroBanners] = useState(defaultBanners);
  const [mobileBanners, setMobileBanners] = useState(defaultMobileBanners);
  const [categoryItems, setCategoryItems] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [marketingBanners, setMarketingBanners] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state (array of product IDs)
  const [wishlist, setWishlist] = useState([]);

  const [settings, setSettings] = useState({
    contactPhone: '083001 12996',
    contactEmail: 'gouthamraj@vdgfashion.com',
    storeAddress: '61/1,First floor, VDG Fashion Narayana complex, opp. burma hotel, Sivagami Puram, Virudhunagar, Tamil Nadu 626001',
    aboutText: 'Trendy looks for every vibe. Stay stylish, every day.',
    freeShippingThreshold: 3000,
    shippingFee: 99,
    activePromoCode: 'TREND10',
    activePromoDiscount: 10,
    isStoreOpen: true,
    facebookUrl: 'https://www.facebook.com/fashionvdg/',
    instagramUrl: 'https://www.instagram.com/vdgfashion/',
    youtubeUrl: 'https://www.youtube.com/channel/UCLLKwEMo4FManOeDUO3jaKw'
  });

  useEffect(() => {
    // First try to load from localstorage for instant load
    const saved = localStorage.getItem('vdgfashion_settings');
    if (saved) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(saved) }));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  const saveStoreSettings = async (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('vdgfashion_settings', JSON.stringify(newSettings));
    try {
      await fetch('http://127.0.0.1:8000/api/settings/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error('Failed to save settings to backend', e);
    }
  };


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

  const fetchAllData = () => {
    // Products
    fetch('http://127.0.0.1:8000/api/products/')
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.map((p) => {
            let img = p.image;
            if (img && img.startsWith('/media/')) img = `http://127.0.0.1:8000${img}`;
            let thumbs = (p.thumbnails || []).map(t => t && t.startsWith('/media/') ? `http://127.0.0.1:8000${t}` : t);
            if (thumbs.length === 0 && img) thumbs = [img];
            return {
              ...p, image: img, thumbnails: thumbs,
              colorHex: p.color_hex || p.colorHex,
              cartBtnColor: p.cart_btn_color || p.cartBtnColor || 'bg-rose-600 hover:bg-rose-700',
              originalPrice: p.original_price !== undefined ? p.original_price : p.originalPrice,
              reviewsCount: p.reviews_count !== undefined ? p.reviews_count : p.reviewsCount,
              isNew: p.is_new !== undefined ? p.is_new : p.isNew,
              tagType: p.tag_type || p.tagType
            };
          }));
        }
      })
      .catch(() => {});

    // Hero Banners (Desktop)
    fetch('http://127.0.0.1:8000/api/hero-banners/', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        let mergedBanners = [...defaultBanners];
        if (data && data.length > 0) {
          data.forEach(b => {
            let src = b.src || b.image;
            if (src && src.startsWith('/media/')) src = `http://127.0.0.1:8000${src}`;
            if (src && !src.startsWith('http') && !src.startsWith('/')) src = `http://127.0.0.1:8000/media/${src}`;
            
            const index = (b.order || 1) - 1;
            if (index >= 0 && index < 3) {
              mergedBanners[index] = { 
                ...mergedBanners[index], 
                ...b, 
                src: src || mergedBanners[index].src 
              };
            }
          });
        }
        setHeroBanners(mergedBanners);
      })
      .catch(() => {
        setHeroBanners(defaultBanners);
      });

    // Mobile Banners
    fetch('http://127.0.0.1:8000/api/mobile-banners/', { cache: 'no-store' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        let mergedMobileBanners = [...defaultMobileBanners];
        if (data && data.length > 0) {
          data.forEach(b => {
            let src = b.src || b.image;
            if (src && src.startsWith('/media/')) src = `http://127.0.0.1:8000${src}`;
            if (src && !src.startsWith('http') && !src.startsWith('/')) src = `http://127.0.0.1:8000/media/${src}`;
            
            const index = (b.order || 1) - 1;
            if (index >= 0 && index < 3) {
              mergedMobileBanners[index] = { 
                ...mergedMobileBanners[index], 
                ...b, 
                src: src || mergedMobileBanners[index].src
              };
            }
          });
        }
        setMobileBanners(mergedMobileBanners);
      })
      .catch(() => {
        setMobileBanners(defaultMobileBanners);
      });

    // Categories
    fetch('http://127.0.0.1:8000/api/categories/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          const colors = [
            '#e5dbff', // Pastel Purple/Lavender
            '#cbe2fd', // Pastel Blue
            '#c6f8ec', // Pastel Mint/Green
            '#ffd8a8', // Pastel Orange/Peach
            '#ffc6e0', // Pastel Pink
            '#fde68a', // Pastel Yellow
            '#fecdd3', // Pastel Rose/Red
            '#ccfbf1', // Pastel Teal
            '#f5d0fe', // Pastel Violet
            '#c7d2fe'  // Pastel Indigo
          ];
          setCategoryItems(data.filter(c => !c.parent_category).map((c, index) => {
            let img = c.image_url || c.image || '/products/accessories_category.png';
            if (img && img.startsWith('/media/')) img = `http://127.0.0.1:8000${img}`;
            if (img && !img.startsWith('http') && !img.startsWith('/')) img = `http://127.0.0.1:8000/media/${img}`;
            return { id: c.id, name: c.name, bg: colors[index % colors.length], img, categoryRef: c.name };
          }));
          setAllCategories(data);
        }
      })
      .catch(() => {});

    // Marketing Banners
    fetch('http://127.0.0.1:8000/api/marketing-banners/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          setMarketingBanners(data.map((mb) => {
            let img = mb.img;
            if (img && img.startsWith('/media/')) img = `http://127.0.0.1:8000${img}`;
            if (img && !img.startsWith('http') && !img.startsWith('/')) img = `http://127.0.0.1:8000/media/${img}`;
            return { ...mb, img };
          }));
        }
      })
      .catch(() => {});

    // Reviews
    fetch('http://127.0.0.1:8000/api/reviews/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {});

    // Site Settings
    fetch('http://127.0.0.1:8000/api/settings/')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (data) {
          setSettings(data);
        }
      })
      .catch(() => {});
  };


  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 3000);
    const handleVisibility = () => { if (document.visibilityState === 'visible') fetchAllData(); };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [checkedCategories, setCheckedCategories] = useState([]); // Array of checked categories
  const [priceRange, setPriceRange] = useState(5000); // Max budget in INR
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT'); // DEFAULT, PRICE_LOW_HIGH, PRICE_HIGH_LOW, RATING

  useEffect(() => {
    setSelectedSubcategory('ALL');
  }, [selectedCategory]);

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
  const shippingFee = cartSubtotal > parseFloat(settings.freeShippingThreshold || 3000) || cartSubtotal === 0 ? 0 : parseFloat(settings.shippingFee || 99);
  const couponDiscount = appliedCoupon === settings.activePromoCode ? Math.round(cartSubtotal * (parseFloat(settings.activePromoDiscount || 10) / 100)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  // Coupon operations
  const applyCoupon = (code) => {
    const promoCode = (settings.activePromoCode || 'TREND10').trim().toUpperCase();
    if (code.trim().toUpperCase() === promoCode) {
      setAppliedCoupon(promoCode);
      return { success: true, message: `Coupon applied successfully! ${settings.activePromoDiscount || 10}% discount added.` };
    }
    return { success: false, message: 'Invalid coupon code!' };
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('ALL');
    setSelectedSubcategory('ALL');
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
        mobileBanners,
        categoryItems,
        allCategories,
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
        selectedSubcategory,
        setSelectedSubcategory,
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

        // Settings configurations
        settings,
        saveStoreSettings,

        reviews
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
