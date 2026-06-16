'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { API_BASE, mediaUrl } from '../../lib/api';

const StoreContext = createContext();

const CART_KEY = 'vgd_cart';
const WISHLIST_KEY = 'vgd_wishlist';

export function StoreProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);

  // Restore session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('vgd_user_token');
    const savedUser = localStorage.getItem('vgd_user_profile');
    if (token && savedUser) {
      try {
        setUser({ ...JSON.parse(savedUser), token });
      } catch {
        localStorage.removeItem('vgd_user_token');
        localStorage.removeItem('vgd_user_profile');
      }
    }
  }, []);

  // ─── Auth ───────────────────────────────────────────────────
  const loginUser = async (username, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('vgd_user_token', data.access);
        const profileRes = await fetch(`${API_BASE}/api/auth/profile/`, {
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
    } catch {
      return { success: false, message: 'Server connection failed!' };
    }
  };

  const registerUser = async (username, email, password, firstName = '', lastName = '') => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register/`, {
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
    } catch {
      return { success: false, message: 'Server connection failed!' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('vgd_user_token');
    localStorage.removeItem('vgd_user_profile');
    setUser(null);
  };

  // ─── Default banners (fallback to /public/banner/) ──────────
  const defaultBanners = [
    { id: 'default-1', src: '/banner/11.webp', alt: 'VGD Fashion Banner 1' },
    { id: 'default-2', src: '/banner/12.webp', alt: 'VGD Fashion Banner 2' },
    { id: 'default-3', src: '/banner/13.webp', alt: 'VGD Fashion Banner 3' },
  ];
  const defaultMobileBanners = [
    { id: 'default-mobile-1', src: '/banner/21.webp', alt: 'VGD Fashion Banner 1' },
    { id: 'default-mobile-2', src: '/banner/22.webp', alt: 'VGD Fashion Banner 2' },
    { id: 'default-mobile-3', src: '/banner/23.webp', alt: 'VGD Fashion Banner 3' },
  ];

  const [heroBanners, setHeroBanners] = useState(defaultBanners);
  const [mobileBanners, setMobileBanners] = useState(defaultMobileBanners);
  const [categoryItems, setCategoryItems] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [marketingBanners, setMarketingBanners] = useState([]);
  const [reviews, setReviews] = useState([]);

  // Cart & Wishlist
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
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
    const saved = localStorage.getItem('vdgfashion_settings');
    if (saved) {
      try { setSettings(prev => ({ ...prev, ...JSON.parse(saved) })); } catch {}
    }
  }, []);

  const saveStoreSettings = async (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('vdgfashion_settings', JSON.stringify(newSettings));
    try {
      await fetch(`${API_BASE}/api/settings/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
    } catch (e) {
      console.error('Failed to save settings to backend', e);
    }
  };

  // ─── Data fetching ───────────────────────────────────────────
  const categoryColors = [
    '#e5dbff','#cbe2fd','#c6f8ec','#ffd8a8','#ffc6e0',
    '#fde68a','#fecdd3','#ccfbf1','#f5d0fe','#c7d2fe'
  ];

  const fetchAllData = () => {
    // Products
    fetch(`${API_BASE}/api/products/`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => {
        if (!Array.isArray(data)) return;
        setProducts(data.map(p => ({
          ...p,
          image: mediaUrl(p.image) || p.image,
          thumbnails: (p.thumbnails || []).map(t => mediaUrl(t) || t),
          colorHex: p.color_hex || p.colorHex,
          cartBtnColor: p.cart_btn_color || p.cartBtnColor || 'bg-rose-600 hover:bg-rose-700',
          originalPrice: p.original_price !== undefined ? p.original_price : p.originalPrice,
          reviewsCount: p.reviews_count !== undefined ? p.reviews_count : p.reviewsCount,
          isNew: p.is_new !== undefined ? p.is_new : p.isNew,
          tagType: p.tag_type || p.tagType
        })));
      })
      .catch(() => {});

    // Hero Banners
    fetch(`${API_BASE}/api/hero-banners/`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const merged = [...defaultBanners];
        (data || []).forEach(b => {
          const src = mediaUrl(b.src || b.image);
          const idx = (b.order || 1) - 1;
          if (idx >= 0 && idx < 3) merged[idx] = { ...merged[idx], ...b, src: src || merged[idx].src };
        });
        setHeroBanners(merged);
      })
      .catch(() => setHeroBanners(defaultBanners));

    // Mobile Banners
    fetch(`${API_BASE}/api/mobile-banners/`, { cache: 'no-store' })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        const merged = [...defaultMobileBanners];
        (data || []).forEach(b => {
          const src = mediaUrl(b.src || b.image);
          const idx = (b.order || 1) - 1;
          if (idx >= 0 && idx < 3) merged[idx] = { ...merged[idx], ...b, src: src || merged[idx].src };
        });
        setMobileBanners(merged);
      })
      .catch(() => setMobileBanners(defaultMobileBanners));

    // Categories
    fetch(`${API_BASE}/api/categories/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (!data?.length) return;
        setAllCategories(data);
        setCategoryItems(
          data.filter(c => !c.parent_category).map((c, i) => ({
            id: c.id,
            name: c.name,
            bg: categoryColors[i % categoryColors.length],
            img: mediaUrl(c.image_url || c.image) || '/products/accessories_category.png',
            categoryRef: c.name
          }))
        );
      })
      .catch(() => {});

    // Marketing Banners
    fetch(`${API_BASE}/api/marketing-banners/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (!data?.length) return;
        setMarketingBanners(data.map(mb => ({ ...mb, img: mediaUrl(mb.img) || mb.img })));
      })
      .catch(() => {});

    // Reviews
    fetch(`${API_BASE}/api/reviews/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (data?.length) setReviews(data); })
      .catch(() => {});

    // Site Settings
    fetch(`${API_BASE}/api/settings/`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        if (!data) return;
        // Resolve logo image URL
        if (data.logoImage) data.logoImage = mediaUrl(data.logoImage) || data.logoImage;
        setSettings(data);
        localStorage.setItem('vdgfashion_settings', JSON.stringify(data));
      })
      .catch(() => {});
  };

  // Poll every 30s (not 3s) — 10x less server load
  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 30000);
    const handleVisibility = () => { if (document.visibilityState === 'visible') fetchAllData(); };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ─── Persist cart & wishlist ─────────────────────────────────
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY);
    const savedWishlist = localStorage.getItem(WISHLIST_KEY);
    if (savedCart) { try { setCart(JSON.parse(savedCart)); } catch {} }
    if (savedWishlist) { try { setWishlist(JSON.parse(savedWishlist)); } catch {} }
  }, []);

  useEffect(() => { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist)); }, [wishlist]);

  // ─── Search & Filtering ──────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSubcategory, setSelectedSubcategory] = useState('ALL');
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [sortBy, setSortBy] = useState('DEFAULT');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => { setSelectedSubcategory('ALL'); }, [selectedCategory]);

  // ─── Cart operations ─────────────────────────────────────────
  const addToCart = (product, color, size, quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(
        item => item.product.id === product.id && item.selectedColor === color && item.selectedSize === size
      );
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, { product, selectedColor: color, selectedSize: size, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId, color, size) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const updateCartQuantity = (productId, color, size, newQty) => {
    if (newQty <= 0) { removeFromCart(productId, color, size); return; }
    setCart(prev => prev.map(item =>
      item.product.id === productId && item.selectedColor === color && item.selectedSize === size
        ? { ...item, quantity: newQty } : item
    ));
  };

  const clearCart = () => setCart([]);

  // ─── Wishlist operations ─────────────────────────────────────
  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };
  const isWishlisted = (productId) => wishlist.includes(productId);

  // ─── Cart totals ─────────────────────────────────────────────
  const cartCount = cart.reduce((t, item) => t + item.quantity, 0);
  const cartSubtotal = cart.reduce((t, item) => t + item.product.price * item.quantity, 0);
  const freeShipThreshold = parseFloat(settings.freeShippingThreshold || 3000);
  const shippingFee = cartSubtotal === 0 || cartSubtotal > freeShipThreshold ? 0 : parseFloat(settings.shippingFee || 99);
  const couponDiscount = appliedCoupon === settings.activePromoCode
    ? Math.round(cartSubtotal * (parseFloat(settings.activePromoDiscount || 10) / 100)) : 0;
  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  // ─── Coupon ──────────────────────────────────────────────────
  const applyCoupon = (code) => {
    const promoCode = (settings.activePromoCode || 'TREND10').trim().toUpperCase();
    if (code.trim().toUpperCase() === promoCode) {
      setAppliedCoupon(promoCode);
      return { success: true, message: `Coupon applied! ${settings.activePromoDiscount || 10}% discount added.` };
    }
    return { success: false, message: 'Invalid coupon code!' };
  };
  const removeCoupon = () => setAppliedCoupon('');

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
    <StoreContext.Provider value={{
      products,
      heroBanners, mobileBanners, categoryItems, allCategories, marketingBanners, reviews,
      cart, isCartOpen, setIsCartOpen,
      wishlist, toggleWishlist, isWishlisted,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      cartCount, cartSubtotal, shippingFee, cartTotal,
      appliedCoupon, applyCoupon, removeCoupon, couponDiscount,
      searchQuery, setSearchQuery,
      selectedCategory, setSelectedCategory,
      selectedSubcategory, setSelectedSubcategory,
      checkedCategories, setCheckedCategories,
      priceRange, setPriceRange,
      selectedColor, setSelectedColor,
      selectedSize, setSelectedSize,
      sortBy, setSortBy, resetFilters,
      selectedProduct, setSelectedProduct,
      user, loginUser, registerUser, logoutUser,
      settings, saveStoreSettings,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within a StoreProvider');
  return ctx;
}
