'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Lock, Mail, Loader2, AlertCircle, Eye, EyeOff,
  LayoutDashboard, Package, Folders, ShoppingCart, Users, 
  Ticket, Star, BarChart3, Megaphone, Landmark, Settings, 
  UserCheck, ClipboardList, Search, Bell, Moon, Sun, ChevronRight, ChevronDown,
  ArrowUpRight, RefreshCcw, CheckCircle, Database, Trash2, Edit, Plus, Upload, X,
  ShoppingBag, Wallet, Menu, LogOut, Filter,
  Clock, Truck, MapPin, XCircle
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

const STATUS_CONFIG = {
  pending: { label: 'Pending', bg: 'bg-amber-500 text-white border-amber-600', dot: 'bg-amber-500', icon: Clock },
  confirmed: { label: 'Confirmed', bg: 'bg-indigo-500 text-white border-indigo-650', dot: 'bg-indigo-500', icon: CheckCircle },
  packed: { label: 'Packed', bg: 'bg-violet-500 text-white border-violet-650', dot: 'bg-violet-500', icon: Package },
  shipped: { label: 'Shipped', bg: 'bg-blue-500 text-white border-blue-600', dot: 'bg-blue-500', icon: Truck },
  out_for_delivery: { label: 'Out for Delivery', bg: 'bg-teal-500 text-white border-teal-600', dot: 'bg-teal-500', icon: MapPin },
  delivered: { label: 'Delivered', bg: 'bg-emerald-500 text-white border-emerald-600', dot: 'bg-emerald-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-500 text-white border-rose-600', dot: 'bg-rose-500', icon: XCircle },
  returned: { label: 'Returned', bg: 'bg-zinc-500 text-white border-zinc-600', dot: 'bg-zinc-500', icon: RefreshCcw },
  refunded: { label: 'Refunded', bg: 'bg-red-500 text-white border-red-600', dot: 'bg-red-500', icon: Wallet },
};

export default function AdminRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdminProfile = async (token) => {
    const activeToken = token || sessionStorage.getItem('access_token');
    if (!activeToken) return;
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/profile/', {
        headers: { 'Authorization': `Bearer ${activeToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setAdminUser(data);
      }
    } catch (e) {
      console.error('Failed to fetch admin profile', e);
    }
  };

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('vdgfashion_admin_authenticated');
    if (sessionAuth === 'true') {
      setIsLoggedIn(true);
      fetchAdminProfile();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('vdgfashion_admin_authenticated', 'true');
        sessionStorage.setItem('access_token', data.access);
        sessionStorage.setItem('refresh_token', data.refresh);
        setIsLoggedIn(true);
        fetchAdminProfile(data.access);
      } else {
        setError(data.detail || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection failed. Make sure your Django backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('vdgfashion_admin_authenticated');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setAdminUser(null);
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 relative font-sans admin-portal-font-boost overflow-hidden select-none text-[#0f172a]">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-indigo-100/40 to-purple-100/30 blur-[130px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-pink-100/40 to-rose-100/30 blur-[130px] pointer-events-none animate-pulse" />

        <div className="w-full max-w-[440px] bg-white/95 border border-zinc-200/50 backdrop-blur-md rounded-[2.5rem] p-9 shadow-[0_20px_50px_-12px_rgba(99,102,241,0.06)] relative z-10 space-y-6">
          <div className="text-center space-y-3">
            <svg width="52" height="52" viewBox="0 0 60 60" fill="none" className="mx-auto pointer-events-none select-none">
              <defs>
                <linearGradient id="topPill" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <linearGradient id="leftPill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="rightPill" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <rect x="10" y="12" width="40" height="10" rx="5" fill="url(#topPill)" />
              <rect x="20" y="26" width="10" height="22" rx="5" fill="url(#leftPill)" />
              <rect x="30" y="26" width="10" height="26" rx="5" fill="url(#rightPill)" />
            </svg>
            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">vdgfashion</h2>
              <h3 className="text-[17px] font-bold text-zinc-700">Admin Control Panel</h3>
              <p className="text-[11px] text-zinc-400 font-semibold tracking-wide">Sign in to access custom dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-3 flex items-start gap-2 text-red-500 text-xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span className="font-semibold">{error}</span>
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer flex items-center justify-center"
              >
                {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-sm font-bold rounded-full shadow-lg shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Sign In</span>}
            </button>
          </form>
          <p className="text-[10px] text-center text-zinc-400 font-bold pt-4">
            © 2026 vdgfashion Admin. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return <DashboardPortal onLogout={handleLogout} adminUser={adminUser} />;
}

function DashboardPortal({ onLogout, adminUser }) {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [productPage, setProductPage] = useState(1);
  const [analyticsPage, setAnalyticsPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    is_staff: false,
    is_active: true
  });
  
  const [loadingData, setLoadingData] = useState(false);

  // Store context settings and forms
  const { settings, saveStoreSettings } = useStore();
  const [settingsTab, setSettingsTab] = useState('general');
  const [settingsForm, setSettingsForm] = useState({
    contactPhone: '',
    contactEmail: '',
    storeAddress: '',
    freeShippingThreshold: 3000,
    shippingFee: 99,
    activePromoCode: 'TREND10',
    activePromoDiscount: 10,
    isStoreOpen: true
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        contactPhone: settings.contactPhone || '+91 98765 43210',
        contactEmail: settings.contactEmail || 'gouthamraj@vdgfashion.com',
        storeAddress: settings.storeAddress || 'Express Avenue Mall, 1st Floor, No. 2, Club House Rd, India, TN - 600002',
        freeShippingThreshold: settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 3000,
        shippingFee: settings.shippingFee !== undefined ? settings.shippingFee : 99,
        activePromoCode: settings.activePromoCode || 'TREND10',
        activePromoDiscount: settings.activePromoDiscount !== undefined ? settings.activePromoDiscount : 10,
        isStoreOpen: settings.isStoreOpen !== undefined ? settings.isStoreOpen : true
      });
    }
  }, [settings]);

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    saveStoreSettings(settingsForm);
    showToast('Store settings saved successfully', 'success');
  };

  // Analytics states
  const [analyticsChartMetric, setAnalyticsChartMetric] = useState('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // 14 days dynamic analytics calculation
  const analytics14Days = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({
        dateStr: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        dateKey: d.toDateString(),
        ordersCount: 0,
        revenue: 0
      });
    }

    orders.forEach(o => {
      if (!o.created_at) return;
      const oDate = new Date(o.created_at);
      const oDateKey = oDate.toDateString();
      const matchDay = days.find(d => d.dateKey === oDateKey);
      if (matchDay) {
        matchDay.ordersCount += 1;
        matchDay.revenue += parseFloat(o.total_amount || 0);
      }
    });

    return days;
  }, [orders]);

  const maxChartVal = useMemo(() => {
    const vals = analytics14Days.map(d => analyticsChartMetric === 'revenue' ? d.revenue : d.ordersCount);
    const max = Math.max(...vals);
    return max === 0 ? 10 : max;
  }, [analytics14Days, analyticsChartMetric]);

  const points = useMemo(() => {
    return analytics14Days.map((d, i) => {
      const val = analyticsChartMetric === 'revenue' ? d.revenue : d.ordersCount;
      const x = 40 + (i / 13) * 420;
      const y = 160 - (val / maxChartVal) * 120;
      return { x, y, val, date: d.dateStr };
    });
  }, [analytics14Days, analyticsChartMetric, maxChartVal]);

  const pathD = useMemo(() => {
    return points.length > 0 
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
      : '';
  }, [points]);

  const areaD = useMemo(() => {
    return points.length > 0
      ? `${pathD} L ${points[points.length-1].x} 160 L ${points[0].x} 160 Z`
      : '';
  }, [points, pathD]);

  // Order status distribution
  const orderStatusShares = useMemo(() => {
    const statusCounts = {};
    orders.forEach(o => {
      const status = o.status || 'pending';
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    const total = orders.length || 1;
    const colorsList = {
      pending: '#f59e0b',
      confirmed: '#6366f1',
      packed: '#8b5cf6',
      shipped: '#3b82f6',
      out_for_delivery: '#14b8a6',
      delivered: '#10b981',
      cancelled: '#ef4444',
      returned: '#71717a',
      refunded: '#ef4444'
    };

    return Object.entries(statusCounts).map(([status, count]) => {
      const percentage = Math.round((count / total) * 100);
      return {
        status,
        label: STATUS_CONFIG[status]?.label || status,
        count,
        percentage,
        color: colorsList[status] || '#a855f7'
      };
    }).sort((a, b) => b.count - a.count);
  }, [orders]);

  const statusDonutSlices = useMemo(() => {
    let currentOffset = 100;
    return orderStatusShares.map((share) => {
      const pct = share.percentage;
      const strokeDasharray = `${pct} ${100 - pct}`;
      const strokeDashoffset = currentOffset;
      currentOffset -= pct;
      return {
        ...share,
        strokeDasharray,
        strokeDashoffset
      };
    });
  }, [orderStatusShares]);

  useEffect(() => {
    setProductPage(1);
    setAnalyticsPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setUserPage(1);
  }, [userSearchQuery]);

  const [categoriesActiveTab, setCategoriesActiveTab] = useState('categories');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState(null);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  const rootCategories = useMemo(() => {
    return categories.filter(c => !c.parent_category);
  }, [categories]);

  const subCategories = useMemo(() => {
    return categories.filter(c => c.parent_category);
  }, [categories]);

  // Dynamic Dashboard Metrics calculated directly from the real database lists
  const totalSalesVal = useMemo(() => {
    return orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);
  }, [orders]);

  const totalRevenueVal = useMemo(() => {
    return orders.reduce((sum, o) => sum + parseFloat(o.subtotal || o.total_amount || 0), 0);
  }, [orders]);

  const uniqueCustomersCount = useMemo(() => {
    const customers = new Set(orders.map(o => o.customer_name).filter(Boolean));
    return customers.size;
  }, [orders]);

  const couponsUsedCount = useMemo(() => {
    return orders.filter(o => parseFloat(o.discount_amount || 0) > 0).length;
  }, [orders]);

  // Dynamic Category Sales Share calculated from active registry products
  const categoryShares = useMemo(() => {
    if (products.length === 0) return [];
    const groupCounts = {};
    products.forEach(p => {
      const cat = p.category_name || 'Apparel';
      groupCounts[cat] = (groupCounts[cat] || 0) + 1;
    });

    const total = products.length;
    return Object.entries(groupCounts)
      .map(([name, count]) => {
        const percentage = Math.round((count / total) * 100);
        return { name, count, percentage };
      })
      .sort((a, b) => b.count - a.count);
  }, [products]);

  // SVG Donut slice stroke calculations
  const donutSlices = useMemo(() => {
    let currentOffset = 100;
    const colorsList = [
      { dot: 'bg-purple-500', stroke: '#8b5cf6' },
      { dot: 'bg-blue-500', stroke: '#3b82f6' },
      { dot: 'bg-emerald-500', stroke: '#10b981' },
      { dot: 'bg-amber-500', stroke: '#f59e0b' },
      { dot: 'bg-pink-500', stroke: '#ec4899' },
      { dot: 'bg-indigo-500', stroke: '#6366f1' },
      { dot: 'bg-teal-500', stroke: '#14b8a6' }
    ];

    return categoryShares.slice(0, 5).map((share, index) => {
      const pct = share.percentage;
      const strokeDasharray = `${pct} ${100 - pct}`;
      const strokeDashoffset = currentOffset;
      currentOffset -= pct;
      const colors = colorsList[index % colorsList.length];
      return {
        ...share,
        strokeDasharray,
        strokeDashoffset,
        stroke: colors.stroke,
        dot: colors.dot
      };
    });
  }, [categoryShares]);

  // Top Selling Products from real orders data
  const topSellingProducts = useMemo(() => {
    if (products.length === 0) return [];
    const soldMap = {};
    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const pid = item.product_id || item.product;
        if (pid) soldMap[pid] = (soldMap[pid] || 0) + (item.quantity || 1);
      });
    });
    return products
      .map(p => ({
        id: p.id,
        name: p.name,
        category: p.category_name || 'Uncategorized',
        sold: soldMap[p.id] || 0,
        rev: `₹${((soldMap[p.id] || 0) * parseFloat(p.price || 0)).toLocaleString('en-IN')}`,
        image: p.image
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }, [products, orders]);

  // Customer Growth Data from real orders only
  const customerGrowthData = useMemo(() => {
    const ordersByDate = {};
    orders.forEach(o => {
      if (o.created_at) {
        const dateStr = new Date(o.created_at).toISOString().split('T')[0];
        ordersByDate[dateStr] = (ordersByDate[dateStr] || 0) + 1;
      }
    });
    const data = [];
    const now = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = ordersByDate[dateStr] || 0;
      data.push({
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: count,
        realOrders: count
      });
    }
    return data;
  }, [orders]);

  // Dynamic notifications from real data
  const notifications = useMemo(() => {
    const notifs = [];
    if (orders.length > 0) {
      const latest = orders[0];
      notifs.push({ id: 1, title: 'New Order Received', message: `Order #${latest.order_id} placed by ${latest.customer_name}`, time: 'Recent' });
    }
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 15);
    if (lowStock.length > 0) {
      notifs.push({ id: 2, title: 'Low Stock Warning', message: `${lowStock[0].name} is running low (${lowStock[0].stock} units left)`, time: 'Now' });
    }
    if (reviews.length > 0) {
      const latest = reviews[0];
      notifs.push({ id: 3, title: 'New Review Submitted', message: `${latest.user_name} rated ${latest.product_name || 'a product'} with ${latest.rating} stars`, time: 'Recent' });
    }
    return notifs;
  }, [orders, products, reviews]);

  // Modal and CRUD forms states
  const [modalType, setModalType] = useState(null); // 'product' | 'category' | 'banner' | 'bulk'
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  // Forms inputs
  const [productForm, setProductForm] = useState({
    name: '', slug: '', unit: 'pc', sku: '', price: '', original_price: '',
    discount: '', tag_type: 'new', description: '', color_hex: '#e6fcf5',
    cart_btn_color: 'bg-teal-500 hover:bg-teal-600', stock: 50,
    width: '', height: '', length: '', product_type: 'simple', status: 'published',
    category: '', parent_category: 'New Born (0–3 Months)', image: ''
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '', parent_category: '', image: '', imagePreview: '', is_active: true
  });

  const [bannerForm, setBannerForm] = useState({
    title: '', subtitle: '', alt: '', link: '', order: 0
  });

  const [bulkInput, setBulkInput] = useState('');

  const showToast = (message, type = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const getImageUrl = (urlOrPath) => {
    if (!urlOrPath) return null;
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      return urlOrPath;
    }
    if (urlOrPath.startsWith('/media/')) {
      return `http://127.0.0.1:8000${urlOrPath}`;
    }
    // Bare path like 'products/xx.png' or 'categories/xx.png'
    return `http://127.0.0.1:8000/media/${urlOrPath}`;
  };

  const syncData = useCallback(async () => {
    setLoadingData(true);
    try {
      const prodRes = await fetch('http://127.0.0.1:8000/api/products/');
      if (prodRes.ok) setProducts(await prodRes.json());
      const orderRes = await fetch('http://127.0.0.1:8000/api/orders/');
      if (orderRes.ok) setOrders(await orderRes.json());
      const catRes = await fetch('http://127.0.0.1:8000/api/categories/');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
        const rootCats = catData.filter(c => !c.parent_category);
        if (rootCats.length > 0) {
          setSelectedAdminCategory(prev => prev || rootCats[0].name);
        }
      }
      const banRes = await fetch('http://127.0.0.1:8000/api/hero-banners/');
      if (banRes.ok) setBanners(await banRes.json());
      const revRes = await fetch('http://127.0.0.1:8000/api/reviews/');
      if (revRes.ok) setReviews(await revRes.json());
      const usersRes = await fetch('http://127.0.0.1:8000/api/auth/users/');
      if (usersRes.ok) setUsersList(await usersRes.json());

    } catch (e) {
      showToast('Failed to sync with backend REST API!', 'warning');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    syncData();
    const interval = setInterval(syncData, 30000);
    return () => clearInterval(interval);
  }, [syncData]);

  // CRUD Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = modalMode === 'edit'
      ? `http://127.0.0.1:8000/api/products/${selectedItem.id}/`
      : 'http://127.0.0.1:8000/api/products/';
    const method = modalMode === 'edit' ? 'PATCH' : 'POST';

    try {
      // If image is a full URL, extract the media path for the backend
      let imagePath = productForm.image || null;
      if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
        // Extract path after /media/
        const mediaIdx = imagePath.indexOf('/media/');
        if (mediaIdx !== -1) {
          imagePath = imagePath.substring(mediaIdx + 7); // strip leading /media/
        } else {
          imagePath = null; // Can't use full external URL as file path
        }
      }

      const payload = {
        name: productForm.name,
        slug: productForm.slug || null,
        unit: productForm.unit || 'pc',
        sku: productForm.sku || null,
        category: parseInt(productForm.category) || null,
        parent_category: productForm.parent_category,
        price: parseFloat(productForm.price),
        original_price: parseFloat(productForm.original_price || productForm.price),
        discount: productForm.discount || null,
        tag_type: productForm.tag_type || null,
        description: productForm.description,
        color_hex: productForm.color_hex,
        cart_btn_color: productForm.cart_btn_color,
        stock: parseInt(productForm.stock),
        width: productForm.width ? parseFloat(productForm.width) : null,
        height: productForm.height ? parseFloat(productForm.height) : null,
        length: productForm.length ? parseFloat(productForm.length) : null,
        product_type: productForm.product_type || 'simple',
        status: productForm.status || 'published',
        ...(imagePath ? { image: imagePath } : {})
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Product updated successfully' : 'Product created successfully', 'success');
        setModalType(null);
        syncData();
      } else {
        try {
          const errData = await res.json();
          const errMessage = Object.entries(errData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ');
          showToast(`Error: ${errMessage || 'Error saving product data.'}`, 'warning');
        } catch (e) {
          showToast('Error saving product data.', 'warning');
        }
      }
    } catch (err) {
      showToast('Network error saving product', 'warning');
    }
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    const url = modalMode === 'edit'
      ? `http://127.0.0.1:8000/api/auth/users/${selectedItem.id}/`
      : 'http://127.0.0.1:8000/api/auth/register/';
    const method = modalMode === 'edit' ? 'PATCH' : 'POST';

    try {
      const payload = modalMode === 'edit'
        ? {
            email: userForm.email,
            first_name: userForm.first_name,
            last_name: userForm.last_name,
            is_staff: userForm.is_staff,
            is_active: userForm.is_active
          }
        : {
            username: userForm.username,
            email: userForm.email,
            password: userForm.password,
            first_name: userForm.first_name,
            last_name: userForm.last_name
          };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'User updated successfully' : 'User registered successfully', 'success');
        setModalType(null);
        syncData();
      } else {
        try {
          const errData = await res.json();
          const errMessage = Object.entries(errData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ');
          showToast(`Error: ${errMessage || 'Error saving user data.'}`, 'warning');
        } catch (e) {
          showToast('Error saving user data.', 'warning');
        }
      }
    } catch (err) {
      showToast('Network error saving user', 'warning');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/users/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('User deleted successfully', 'success');
        syncData();
      } else {
        showToast('Failed to delete user', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting user', 'warning');
    }
  };

  const handleToggleUserStaff = async (user) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/users/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_staff: !user.is_staff })
      });
      if (res.ok) {
        showToast(`Role updated for ${user.username}`, 'success');
        syncData();
      } else {
        showToast('Failed to update role', 'warning');
      }
    } catch (err) {
      showToast('Network error updating role', 'warning');
    }
  };

  const handleToggleUserActive = async (user) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/auth/users/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !user.is_active })
      });
      if (res.ok) {
        showToast(`Status updated for ${user.username}`, 'success');
        syncData();
      } else {
        showToast('Failed to update status', 'warning');
      }
    } catch (err) {
      showToast('Network error updating status', 'warning');
    }
  };

  const handleOpenUserModal = (mode, item = null) => {
    setModalType('user');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setUserForm({
        username: item.username || '',
        email: item.email || '',
        first_name: item.first_name || '',
        last_name: item.last_name || '',
        password: '',
        is_staff: item.is_staff || false,
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    } else {
      setUserForm({
        username: '',
        email: '',
        first_name: '',
        last_name: '',
        password: '',
        is_staff: false,
        is_active: true
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Product deleted successfully', 'success');
        syncData();
      } else {
        showToast('Failed to delete product', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting product', 'warning');
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.image) {
      showToast('Please upload a category image first!', 'warning');
      return;
    }
    const url = modalMode === 'edit'
      ? `http://127.0.0.1:8000/api/categories/${selectedItem.id}/`
      : 'http://127.0.0.1:8000/api/categories/';
    const method = modalMode === 'edit' ? 'PATCH' : 'POST';

    try {
      const payload = {
        name: categoryForm.name,
        is_active: categoryForm.is_active,
        parent_category: categoryForm.parent_category || null,
        image: categoryForm.image || null
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Category updated successfully' : 'Category created successfully', 'success');
        setModalType(null);
        syncData();
      } else {
        try {
          const errData = await res.json();
          const errMessage = Object.entries(errData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ');
          showToast(`Error: ${errMessage || 'Error saving category data.'}`, 'warning');
        } catch (e) {
          showToast('Error saving category data.', 'warning');
        }
      }
    } catch (err) {
      showToast('Network error saving category', 'warning');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/categories/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Category deleted successfully', 'success');
        syncData();
      } else {
        showToast('Failed to delete category', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting category', 'warning');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Review deleted successfully', 'success');
        syncData();
      } else {
        showToast('Failed to delete review', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting review', 'warning');
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    try {
      const parsedData = JSON.parse(bulkInput);
      const res = await fetch('http://127.0.0.1:8000/api/products/bulk-upload/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsedData)
      });
      const result = await res.json();
      if (res.ok && result.success) {
        showToast(`Bulk Upload Successful! Created ${result.created_count} products.`, 'success');
        setModalType(null);
        setBulkInput('');
        syncData();
      } else {
        showToast(`Import completed with errors. Failures: ${result.failed_count}`, 'warning');
      }
    } catch (err) {
      showToast('Invalid JSON structure. Please verify formatting.', 'warning');
    } finally {
      setLoadingData(false);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [inlineStockEdit, setInlineStockEdit] = useState({}); // { productId: tempValue }
  const [orderSearch, setOrderSearch] = useState('');

  const handleInlineStockSave = async (productId, newStock) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: parseInt(newStock) })
      });
      if (res.ok) {
        showToast('Stock updated!', 'success');
        setInlineStockEdit(prev => { const n = {...prev}; delete n[productId]; return n; });
        syncData();
      }
    } catch { showToast('Failed to update stock', 'warning'); }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast('Order status updated!', 'success');
        syncData();
      }
    } catch { showToast('Failed to update order status', 'warning'); }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/orders/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        showToast('Order deleted successfully', 'success');
        syncData();
      } else {
        showToast('Failed to delete order', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting order', 'warning');
    }
  };

  const filteredOrders = useMemo(() => {
    if (!orderSearch.trim()) return orders;
    const q = orderSearch.toLowerCase();
    return orders.filter(o =>
      (o.order_id || '').toLowerCase().includes(q) ||
      (o.customer_name || '').toLowerCase().includes(q) ||
      (o.phone || '').toLowerCase().includes(q)
    );
  }, [orders, orderSearch]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/products/upload-image/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProductForm((prev) => ({ ...prev, image: data.path }));
        showToast('Image uploaded successfully!', 'success');
      } else {
        showToast(data.error || 'Failed to upload image.', 'warning');
      }
    } catch (err) {
      showToast('Network error during image upload.', 'warning');
    } finally {
      setUploadingImage(false);
    }
  };

  const [uploadingCategoryImage, setUploadingCategoryImage] = useState(false);

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCategoryImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/categories/upload-image/', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategoryForm((prev) => ({ ...prev, image: data.path, imagePreview: data.url }));
        showToast('Category image uploaded!', 'success');
      } else {
        showToast(data.error || 'Failed to upload image.', 'warning');
      }
    } catch (err) {
      showToast('Network error during image upload.', 'warning');
    } finally {
      setUploadingCategoryImage(false);
    }
  };

  const handleOpenProductModal = (mode, item = null) => {
    setModalType('product');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      // Find category ID from category field (could be id or name)
      const catId = item.category || '';
      setProductForm({
        name: item.name || '',
        slug: item.slug || '',
        unit: item.unit || 'pc',
        sku: item.sku || '',
        category: catId,
        parent_category: item.parent_category || '',
        price: item.price || '',
        original_price: item.original_price || '',
        discount: item.discount || '',
        tag_type: item.tag_type || 'new',
        description: item.description || '',
        color_hex: item.color_hex || '#e6fcf5',
        cart_btn_color: item.cart_btn_color || 'bg-teal-500 hover:bg-teal-600',
        stock: item.stock !== undefined ? item.stock : 50,
        width: item.width || '',
        height: item.height || '',
        length: item.length || '',
        product_type: item.product_type || 'simple',
        status: item.status || 'published',
        image: item.image || ''
      });
    } else {
      setProductForm({
        name: '', slug: '', unit: 'pc', sku: '', category: rootCategories[0]?.id || '', parent_category: '',
        price: '', original_price: '', discount: '', tag_type: 'new', description: '', color_hex: '#e6fcf5',
        cart_btn_color: 'bg-teal-500 hover:bg-teal-600', stock: 50,
        width: '', height: '', length: '', product_type: 'simple', status: 'published', image: ''
      });
    }
  };

  const handleOpenCategoryModal = (mode, item = null) => {
    setModalType('category');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setCategoryForm({
        name: item.name || '',
        parent_category: item.parent_category || '',
        image: item.image || '',
        imagePreview: item.image_url || '',
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    } else {
      setCategoryForm({ name: '', parent_category: '', image: '', imagePreview: '', is_active: true });
    }
  };

  const handleOpenSubcategoryModal = (mode, item = null) => {
    setModalType('subcategory');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setCategoryForm({
        name: item.name || '',
        parent_category: item.parent_category || '',
        image: item.image || '',
        imagePreview: item.image_url || '',
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    } else {
      const defaultParent = rootCategories[0]?.name || '';
      setCategoryForm({ name: '', parent_category: defaultParent, image: '', imagePreview: '', is_active: true });
    }
  };

  // Search filter
  const filteredProducts = useMemo(() => {
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const ITEMS_PER_PAGE = 8;
  const totalProductPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (productPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, productPage]);

  // Analytics inventory search filter & pagination
  const filteredAnalyticsProducts = useMemo(() => {
    return products.filter((p) => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [products, searchQuery]);

  const ANALYTICS_ITEMS_PER_PAGE = 8;
  const totalAnalyticsPages = Math.ceil(filteredAnalyticsProducts.length / ANALYTICS_ITEMS_PER_PAGE) || 1;
  const paginatedAnalyticsProducts = useMemo(() => {
    const startIndex = (analyticsPage - 1) * ANALYTICS_ITEMS_PER_PAGE;
    return filteredAnalyticsProducts.slice(startIndex, startIndex + ANALYTICS_ITEMS_PER_PAGE);
  }, [filteredAnalyticsProducts, analyticsPage]);

  // Users search filter and pagination
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => 
      (u.username || '').toLowerCase().includes(userSearchQuery.toLowerCase()) || 
      (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.first_name || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      (u.last_name || '').toLowerCase().includes(userSearchQuery.toLowerCase())
    );
  }, [usersList, userSearchQuery]);

  const USERS_ITEMS_PER_PAGE = 8;
  const totalUserPages = Math.ceil(filteredUsers.length / USERS_ITEMS_PER_PAGE) || 1;
  const paginatedUsers = useMemo(() => {
    const startIndex = (userPage - 1) * USERS_ITEMS_PER_PAGE;
    return filteredUsers.slice(startIndex, startIndex + USERS_ITEMS_PER_PAGE);
  }, [filteredUsers, userPage]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans admin-portal-font-boost transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0a0c10] text-[#e8eaf0]' : 'bg-[#f8fafc] text-[#0f172a]'
    }`}>
      {/* Side Toasts Notifications */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="p-4 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border bg-white border-zinc-200 text-zinc-800 pointer-events-auto">
            <CheckCircle className="h-4.5 w-4.5 text-green-500" />
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[290px] lg:static lg:translate-x-0 flex-shrink-0 flex flex-col border-r transition-transform duration-300 ease-in-out ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200'
      }`}>
        <div className={`p-6 border-b flex items-center gap-3.5 ${theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-100'}`}>
          <div className="flex items-center justify-center w-full">
            <img src="/logo.png" alt="vdgfashion logo" className="h-12 object-contain" />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <NavItem theme={theme} icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => handlePageChange('dashboard')} />
          <NavItem theme={theme} icon={<Package size={20} />} label="Products" active={activePage === 'products'} onClick={() => handlePageChange('products')} />
          <NavItem theme={theme} icon={<Folders size={20} />} label="Categories" active={activePage === 'categories'} onClick={() => handlePageChange('categories')} />
          <NavItem theme={theme} icon={<ShoppingCart size={20} />} label="Orders" active={activePage === 'orders'} onClick={() => handlePageChange('orders')} />
          <NavItem theme={theme} icon={<Star size={20} />} label="Reviews" active={activePage === 'reviews'} onClick={() => handlePageChange('reviews')} />
          <NavItem theme={theme} icon={<BarChart3 size={20} />} label="Analytics" active={activePage === 'analytics'} onClick={() => handlePageChange('analytics')} />
          <NavItem theme={theme} icon={<Users size={20} />} label="Users" active={activePage === 'users'} onClick={() => handlePageChange('users')} />
          <NavItem theme={theme} icon={<Settings size={20} />} label="Settings" active={activePage === 'settings'} onClick={() => handlePageChange('settings')} />
          
          <hr className="border-dashed my-2 opacity-50 border-zinc-200 dark:border-[#2a3145]" />

          <button 
            onClick={onLogout}
            className="w-full px-5 py-4 rounded-2xl text-[18px] font-black transition-all flex items-center gap-4 cursor-pointer select-none active:scale-98 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>

        </nav>

        {/* Footer info profile cockpit */}
        <div className={`p-5 border-t flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
          theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-200'
        }`} onClick={onLogout}>
          <div className="flex items-center gap-3 min-w-0 text-left">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-3xs shrink-0 select-none">
              {adminUser?.first_name ? adminUser.first_name[0].toUpperCase() : adminUser?.username ? adminUser.username[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className={`font-bold text-[17px] truncate ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>
                {adminUser?.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim() : adminUser?.username || 'Admin User'}
              </p>
              <p className="text-[14px] text-zinc-400 truncate">
                {adminUser?.email || 'admin@vdgfashion.com'}
              </p>
            </div>
          </div>
          <ChevronRight size={17} className="text-zinc-400" />
        </div>
      </aside>

      {/* Main viewport */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className={`px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 border-b gap-4 ${
          theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200'
        }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger mobile menu button */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-xl border lg:hidden cursor-pointer transition-colors shrink-0 ${
                theme === 'dark' 
                  ? 'bg-[#161b26] border-[#2a3145] text-zinc-400 hover:text-white' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-650 hover:text-[#0f172a]'
              }`}
            >
              <Menu size={18} />
            </button>

            <div className="relative w-full max-w-[400px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories..."
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 border ${
                  theme === 'dark' 
                    ? 'bg-[#161b26] border-[#2a3145] text-white placeholder-zinc-500' 
                    : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'
                }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer relative p-1 flex items-center justify-center animate-fade-in"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 text-white font-extrabold text-[7px] flex items-center justify-center shadow-md animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className={`absolute right-0 mt-3.5 w-80 rounded-2xl border shadow-xl z-50 p-4 max-h-[350px] overflow-y-auto text-left flex flex-col divide-y divide-zinc-100 dark:divide-[#2a3145]/60 ${
                    theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/60' : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50'
                  }`}>
                    <div className="pb-2 flex justify-between items-center">
                      <span className="font-extrabold text-[12px] uppercase tracking-wider text-indigo-500">Notifications ({notifications.length})</span>
                      <button className="text-[10px] font-bold text-zinc-400 hover:text-zinc-650" onClick={() => setShowNotifications(false)}>Close</button>
                    </div>
                    <div className="pt-2 space-y-2.5">
                      {notifications.length === 0 ? (
                        <p className="text-[11px] text-zinc-400 font-semibold py-4 text-center">No active notifications.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="text-[11px] leading-relaxed pt-2 first:pt-0">
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-extrabold text-zinc-900 dark:text-white">{n.title}</span>
                              <span className="text-[9px] font-bold text-zinc-400 shrink-0">{n.time}</span>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-semibold mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-[#cbd5e1]/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs shadow-3xs shrink-0 select-none">
                {adminUser?.first_name ? adminUser.first_name[0].toUpperCase() : adminUser?.username ? adminUser.username[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left leading-none">
                <p className={`font-bold text-[11px] ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                  {adminUser?.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim() : adminUser?.username || 'Admin User'}
                </p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-0.5">
                  {adminUser?.is_staff ? 'Super Admin' : 'Staff Admin'}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard inner panels */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activePage === 'dashboard' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Dashboard</h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
              </div>

              {/* Grid Statistics Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <GridStat 
                  theme={theme}
                  color="bg-purple-600 text-white dark:bg-purple-500 shadow-purple-500/10" 
                  label="Total Sales" 
                  value={orders.length > 0 ? `₹${Math.round(totalSalesVal).toLocaleString('en-IN')}` : "₹0"} 
                  icon={<ShoppingBag className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-pink-600 text-white dark:bg-pink-500 shadow-pink-500/10" 
                  label="Total Orders" 
                  value={orders.length} 
                  icon={<ShoppingCart className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-blue-600 text-white dark:bg-blue-500 shadow-blue-500/10" 
                  label="Total Customers" 
                  value={uniqueCustomersCount} 
                  icon={<Users className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-orange-500 text-white dark:bg-orange-600 shadow-orange-500/10" 
                  label="Products" 
                  value={products.length} 
                  icon={<Package className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-teal-600 text-white dark:bg-teal-500 shadow-teal-500/10" 
                  label="Revenue" 
                  value={orders.length > 0 ? `₹${Math.round(totalRevenueVal).toLocaleString('en-IN')}` : "₹0"} 
                  icon={<Wallet className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-indigo-600 text-white dark:bg-indigo-500 shadow-indigo-500/10" 
                  label="Coupons Used" 
                  value={couponsUsedCount} 
                  icon={<Ticket className="h-5.5 w-5.5" />} 
                />
              </div>

              {/* Quick Actions Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenProductModal('add')}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 cursor-pointer group ${
                    theme === 'dark' 
                      ? 'bg-[#10141c] border-[#2a3145] hover:bg-zinc-900 hover:border-purple-500/50 text-white' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-purple-500/50 shadow-3xs'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Add Product</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Create new inventory item</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenCategoryModal('add')}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 cursor-pointer group ${
                    theme === 'dark' 
                      ? 'bg-[#10141c] border-[#2a3145] hover:bg-zinc-900 hover:border-pink-500/50 text-white' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-pink-500/50 shadow-3xs'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
                    <Folders className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Add Category</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Add category or subcategory</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(orders, null, 2));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `orders_report_${new Date().toISOString().split('T')[0]}.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                    showToast('Orders report exported successfully', 'success');
                  }}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 cursor-pointer group ${
                    theme === 'dark' 
                      ? 'bg-[#10141c] border-[#2a3145] hover:bg-zinc-900 hover:border-blue-500/50 text-white' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-blue-500/50 shadow-3xs'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                    <ArrowUpRight className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Export Orders</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Download JSON data sheet</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm('WARNING: This will completely erase all products, categories, orders, and banners from the database! Are you sure?')) return;
                    setLoadingData(true);
                    try {
                      const res = await fetch('http://127.0.0.1:8000/api/products/clear-all/', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                      });
                      if (res.ok) {
                        showToast('Database wiped clean!', 'success');
                        syncData();
                      } else {
                        showToast('Failed to clear database.', 'warning');
                      }
                    } catch (e) {
                      showToast('Network error clearing database.', 'warning');
                    } finally {
                      setLoadingData(false);
                    }
                  }}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 cursor-pointer group ${
                    theme === 'dark' 
                      ? 'bg-[#10141c] border-[#2a3145] hover:bg-zinc-900 hover:border-red-500/50 text-white' 
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-red-500/50 shadow-3xs'
                  }`}
                >
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-655 dark:text-red-400 group-hover:scale-105 transition-transform">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-red-600 dark:text-red-400">Database Reset</h4>
                    <p className="text-[10px] text-zinc-500 font-medium">Erase all dynamic data</p>
                  </div>
                </button>
              </div>

              {/* Charts cockpit section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales Overview Line Chart Area */}
                <div className={`p-5 rounded-3xl border transition-all flex flex-col h-full justify-between ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Sales Overview</h3>
                    <select className={`text-[10px] font-bold p-1 bg-transparent border rounded-lg outline-none cursor-pointer ${
                      theme === 'dark' ? 'border-[#2a3145] text-zinc-300' : 'border-zinc-200 text-zinc-700'
                    }`}>
                      <option>This Week</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4 h-64 mt-2 select-none flex-grow">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[10px] text-zinc-400 font-bold h-[88%] pb-2 select-none w-8 text-left leading-none">
                      <span>₹10K</span>
                      <span>₹8K</span>
                      <span>₹6K</span>
                      <span>₹4K</span>
                      <span>₹2K</span>
                      <span>₹0</span>
                    </div>
                    {/* Line Chart Grid Canvas */}
                    <div className="flex-grow h-full relative">
                      {/* Gridlines */}
                      <div className="absolute inset-0 flex flex-col justify-between h-[88%] pointer-events-none">
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                      </div>
                      
                      {/* Line chart svg overlay */}
                      <svg className="w-full h-[88%] absolute inset-0" viewBox="0 0 100 40" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        <path d="M 0 30 Q 15 25 30 20 T 60 18 T 90 22 L 100 24 L 100 40 L 0 40 Z" fill="url(#chartGrad)" />
                        <path d="M 0 30 Q 15 25 30 20 T 60 18 T 90 22 L 100 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      
                      {/* X-axis Labels */}
                      <div className="flex justify-between text-[9px] text-zinc-400 font-bold absolute bottom-0 left-0 right-0">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales By Category Donut Area */}
                <div className={`p-5 rounded-3xl border transition-all flex flex-col h-full justify-between ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <h3 className={`font-black text-sm mb-4 text-left ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Sales by Category</h3>
                  <div className="flex items-center justify-between gap-6 h-64 mt-2 flex-grow">
                    <div className="w-40 h-40 relative flex-shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="transparent" strokeWidth="4" />
                        {donutSlices.length === 0 ? (
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#cbd5e1" strokeWidth="4.2" strokeDasharray="100 0" strokeDashoffset="100" />
                        ) : (
                          donutSlices.map((slice, idx) => (
                            <circle 
                              key={idx}
                              cx="21" 
                              cy="21" 
                              r="15.915" 
                              fill="transparent" 
                              stroke={slice.stroke} 
                              strokeWidth="4.2" 
                              strokeDasharray={slice.strokeDasharray} 
                              strokeDashoffset={slice.strokeDashoffset} 
                            />
                          ))
                        )}
                      </svg>
                    </div>
                    <div className="flex-grow space-y-3.5 text-left flex flex-col justify-center max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                      {donutSlices.length === 0 ? (
                        <span className="text-xs font-semibold text-zinc-400 text-center">No categories recorded yet.</span>
                      ) : (
                        donutSlices.map((slice, idx) => (
                          <CategoryLegendRow 
                            key={idx} 
                            dotColor={slice.dot} 
                            label={slice.name} 
                            pct={`${slice.percentage}%`} 
                            val={`₹${Math.round(slice.count * 1250).toLocaleString('en-IN')}`} 
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Orders List panel */}
                <div className={`p-5 rounded-3xl border transition-all ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Recent Orders</h3>
                    <span className="text-[10px] font-black text-[#8b5cf6] dark:text-[#a855f7] cursor-pointer tracking-wider" onClick={() => setActivePage('orders')}>View All</span>
                  </div>
                  <div className="space-y-3 pt-0.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {orders.length === 0 ? (
                      <div className="text-center py-12 text-xs font-semibold text-zinc-400">
                        No orders recorded yet.
                      </div>
                    ) : (
                      orders.slice(0, 5).map((o, idx) => {
                        const initials = o.customer_name 
                          ? o.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) 
                          : 'C';
                        const gradients = [
                          'from-pink-400 to-rose-500',
                          'from-blue-400 to-indigo-500',
                          'from-amber-400 to-orange-500',
                          'from-purple-400 to-indigo-500',
                          'from-teal-400 to-emerald-500'
                        ];
                        const gradient = gradients[idx % gradients.length];
                        const status = o.payment_method === 'cod' ? 'Pending' : 'Completed';
                        const orderDate = new Date(o.created_at || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        });

                        return (
                          <OrderRow 
                            key={o.id || idx}
                            theme={theme} 
                            id={`#${o.order_id}`} 
                            date={orderDate} 
                            amount={`₹${o.total_amount}`} 
                            status={status} 
                            name={o.customer_name} 
                            gradient={gradient} 
                            initials={initials} 
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom stats tables and growth bar chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Top Selling Products List Card */}
                <div className={`lg:col-span-2 p-5 rounded-3xl border transition-all ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Top Selling Products</h3>
                    <span className="text-[10px] font-black text-[#8b5cf6] dark:text-[#a855f7] cursor-pointer tracking-wider" onClick={() => setActivePage('products')}>View All</span>
                  </div>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[500px] text-left text-sm font-semibold">
                      <thead className={`font-black uppercase tracking-wider border-b pb-2.5 text-[12px] ${theme === 'dark' ? 'border-[#2a3145] text-zinc-400' : 'border-zinc-100 text-black'}`}>
                        <tr>
                          <th className="pb-3">Product</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3 text-center">Sold</th>
                          <th className="pb-3 text-right">Revenue</th>
                          <th className="pb-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-[#2a3145]/60 text-zinc-700 dark:text-zinc-300">
                        {topSellingProducts.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-xs font-semibold text-zinc-400">
                              No products recorded yet.
                            </td>
                          </tr>
                        ) : (
                          topSellingProducts.map((p, idx) => (
                            <TopProductRow 
                              key={p.id || idx}
                              theme={theme} 
                              name={p.name} 
                              category={p.category} 
                              sold={p.sold} 
                              rev={p.rev} 
                              image={p.image} 
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Customer Growth Bar Chart Card */}
                <div className={`p-5 rounded-3xl border transition-all ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Customer Growth</h3>
                    <select className={`text-[10px] font-bold p-1 bg-transparent border rounded-lg outline-none cursor-pointer ${
                      theme === 'dark' ? 'border-[#2a3145] text-zinc-355' : 'border-zinc-200 text-zinc-755'
                    }`}>
                      <option>This Month</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-4 h-64 mt-4 select-none">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[9px] text-zinc-400 font-bold h-[88%] pb-4 w-7 text-left leading-none">
                      <span>300</span>
                      <span>240</span>
                      <span>180</span>
                      <span>120</span>
                      <span>60</span>
                      <span>0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-grow h-full flex flex-col justify-between">
                      {/* Bars row */}
                      <div className="flex-grow h-[88%] flex items-end justify-between gap-1 sm:gap-2 border-b border-zinc-150 dark:border-zinc-800/80 pb-1.5">
                        {customerGrowthData.map((day, idx) => (
                          <div key={idx} className="flex-grow flex flex-col justify-end h-full group relative">
                            {/* Bar item */}
                            <div 
                              className="w-full rounded-t-md bg-[#8b5cf6] dark:bg-[#a855f7] hover:bg-[#ff007a] transition-all cursor-pointer shadow-3xs" 
                              style={{ height: customerGrowthData.some(d => d.value > 0) ? `${(day.value / Math.max(...customerGrowthData.map(d => d.value), 1)) * 100}%` : '4px' }}
                              title={`${day.label}: ${day.value} active users (${day.realOrders} orders)`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* X-axis labels row (completely separated, no overlapping!) */}
                      <div className="flex justify-between text-[9px] text-zinc-400 font-bold pt-2 px-1">
                        <span>{customerGrowthData[0]?.label}</span>
                        <span>{customerGrowthData[4]?.label}</span>
                        <span>{customerGrowthData[9]?.label}</span>
                        <span>{customerGrowthData[14]?.label}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean elegant dashboard footer */}
              <footer className={`pt-6 border-t flex items-center justify-between text-[10px] text-zinc-400 font-bold ${
                theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-200'
              }`}>
                <span>© 2026 vdgfashion Admin. All rights reserved.</span>
                <span>Made with ❤️ by vdgfashion</span>
              </footer>
            </div>
          )}

          {activePage === 'products' && (
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Product Registry</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setModalType('bulk')}
                    className="py-2.5 px-4 bg-[#161b26] hover:bg-[#20293a] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors border border-[#2a3145] cursor-pointer"
                  >
                    <Upload size={14} /> Bulk Upload
                  </button>
                  <button 
                    onClick={() => handleOpenProductModal('add')}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>
              </div>

              <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                    <tr>
                      <th className="p-4.5">Product Name</th>
                      <th className="p-4.5">Category</th>
                      <th className="p-4.5 text-right">Price</th>
                      <th className="p-4.5 text-right">Stock</th>
                      <th className="p-4.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                    {paginatedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-2.5">
                          {p.image && <img src={getImageUrl(p.image)} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#2a3145]" />}
                          <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{p.name}</span>
                        </td>
                        <td className="p-4 font-semibold text-zinc-400">{p.category_name || 'Unassigned'}</td>
                        <td className={`p-4 font-bold text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{p.price}</td>
                        <td className="p-4 text-right">
                          {inlineStockEdit[p.id] !== undefined ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={inlineStockEdit[p.id]}
                                onChange={(e) => setInlineStockEdit(prev => ({ ...prev, [p.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleInlineStockSave(p.id, inlineStockEdit[p.id]); if (e.key === 'Escape') setInlineStockEdit(prev => { const n={...prev}; delete n[p.id]; return n; }); }}
                                className={`w-16 px-2 py-1 rounded-lg border text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white' : 'bg-white border-zinc-300 text-zinc-800'
                                }`}
                                autoFocus
                              />
                              <button onClick={() => handleInlineStockSave(p.id, inlineStockEdit[p.id])} className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95">
                                <CheckCircle size={12} />
                              </button>
                              <button onClick={() => setInlineStockEdit(prev => { const n={...prev}; delete n[p.id]; return n; })} className="p-1 rounded-lg bg-zinc-300 text-zinc-700 hover:bg-zinc-400 active:scale-95">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => setInlineStockEdit(prev => ({ ...prev, [p.id]: p.stock }))}
                              title="Click to edit stock"
                              className={`px-3 py-1 rounded-full text-[9px] font-semibold border transition-all cursor-pointer hover:ring-2 hover:ring-indigo-400 ${
                                p.stock === 0 ? 'bg-red-600 text-white border-transparent'
                                : p.stock < 15 ? 'bg-amber-500 text-white border-transparent'
                                : 'bg-emerald-600 text-white border-transparent'
                              }`}>{p.stock} units ✏️</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenProductModal('edit', p)}
                              className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                              title="Edit Product"
                            >
                              <Edit size={13} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                              title="Delete Product"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalProductPages > 1 && (
                <div className="flex items-center justify-between pt-4 pb-2 text-xs font-semibold select-none leading-none">
                  <span className="text-zinc-400">
                    Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-black">{Math.min(filteredProducts.length, (productPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-black">{Math.min(filteredProducts.length, productPage * ITEMS_PER_PAGE)}</span> of <span className="font-extrabold text-zinc-650 dark:text-zinc-300">{filteredProducts.length}</span> products
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button 
                      disabled={productPage === 1}
                      onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                      className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#2a3145] font-black active:scale-95"
                    >
                      ◀ Prev
                    </button>
                    {[...Array(totalProductPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setProductPage(pageNum)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all cursor-pointer active:scale-90 ${
                            productPage === pageNum
                              ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md'
                              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button 
                      disabled={productPage === totalProductPages}
                      onClick={() => setProductPage(prev => Math.min(totalProductPages, prev + 1))}
                      className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#2a3145] font-black active:scale-95"
                    >
                      Next ▶
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'categories' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Category & Subcategory</h2>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Dashboard &gt; Categories</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleOpenCategoryModal('add')}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} /> Add Category
                  </button>
                  <button 
                    onClick={() => handleOpenSubcategoryModal('add')}
                    className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} /> Add Subcategory
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    <Folders className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Total Categories</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {rootCategories.length}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold mt-1.5 leading-none">
                      <span className="text-emerald-500">Active: {rootCategories.filter(c => c.is_active).length}</span>
                      <span className="text-zinc-350 dark:text-zinc-700">•</span>
                      <span className="text-rose-500">Inactive: {rootCategories.filter(c => !c.is_active).length}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                    <Folders className="h-6 w-6 rotate-90" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Total Subcategories</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {subCategories.length}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold mt-1.5 leading-none">
                      <span className="text-emerald-500">Active: {subCategories.filter(c => c.is_active).length}</span>
                      <span className="text-zinc-350 dark:text-zinc-700">•</span>
                      <span className="text-rose-500">Inactive: {subCategories.filter(c => !c.is_active).length}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Total Products</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {products.length}
                    </h3>
                    <p className="text-zinc-400 text-[9px] font-semibold mt-1.5 leading-none">Linked to Categories</p>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Low Stock</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {products.filter(p => p.stock < 15).length}
                    </h3>
                    <p className="text-zinc-400 text-[9px] font-semibold mt-1.5 leading-none">Items below 15 units</p>
                  </div>
                </div>
              </div>

              {/* Table Card */}
              <div className={`p-6 rounded-3xl border ${
                theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white' : 'bg-white border-zinc-200 shadow-3xs'
              }`}>
                {/* Tabs & Search / Filter Header */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-6">
                  {/* Category / Subcategory Tabs */}
                  <div className="flex gap-6 border-b border-transparent">
                    <button
                      onClick={() => setCategoriesActiveTab('categories')}
                      className={`pb-2.5 text-sm font-black relative transition-all cursor-pointer ${
                        categoriesActiveTab === 'categories'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-zinc-450 hover:text-zinc-800 dark:hover:text-white'
                      }`}
                    >
                      Categories
                      {categoriesActiveTab === 'categories' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-fade-in" />
                      )}
                    </button>
                    <button
                      onClick={() => setCategoriesActiveTab('subcategories')}
                      className={`pb-2.5 text-sm font-black relative transition-all cursor-pointer ${
                        categoriesActiveTab === 'subcategories'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-zinc-450 hover:text-zinc-800 dark:hover:text-white'
                      }`}
                    >
                      Subcategories
                      {categoriesActiveTab === 'subcategories' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-fade-in" />
                      )}
                    </button>
                  </div>

                  {/* Search and Filters */}
                  <div className="flex items-center gap-3">
                    <div className={`relative flex items-center bg-zinc-50 border rounded-2xl px-3.5 py-1.5 focus-within:border-indigo-500 w-52 sm:w-64 transition-all ${
                      theme === 'dark' ? 'bg-[#161b26] border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                    }`}>
                      <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                      <input 
                        type="text"
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="text-xs font-semibold pl-2 bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 w-full placeholder-zinc-455 text-zinc-800 dark:text-white"
                      />
                      {categorySearchQuery && (
                        <button onClick={() => setCategorySearchQuery('')} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"><X size={12} /></button>
                      )}
                    </div>
                    
                    <button className={`py-1.5 px-3.5 border rounded-2xl text-xs font-bold flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all cursor-pointer ${
                      theme === 'dark' ? 'border-[#2a3145] text-zinc-455' : 'border-zinc-200 text-zinc-650'
                    }`}>
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Categories Table View */}
                {categoriesActiveTab === 'categories' ? (
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className={`font-black uppercase tracking-wider border-b text-[12px] ${
                        theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-455' : 'bg-zinc-50/50 border-zinc-150 text-zinc-500'
                      }`}>
                        <tr>
                          <th className="p-4 w-12 text-center">#</th>
                          <th className="p-4">Category Name</th>
                          <th className="p-4 text-center">Image</th>
                          <th className="p-4 text-center">Subcategories</th>
                          <th className="p-4 text-center">Products</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                        {rootCategories
                          .filter(c => c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                          .map((c, index) => {
                            const isSelected = selectedAdminCategory === c.name;
                            const subsCount = subCategories.filter(sub => sub.parent_category === c.name).length;
                            const prodsCount = products.filter(p => p.category_name === c.name || p.category === c.id).length;
                            
                            return (
                              <tr 
                                key={c.id} 
                                onClick={() => setSelectedAdminCategory(c.name)}
                                className={`transition-all duration-150 cursor-pointer ${
                                  isSelected 
                                    ? theme === 'dark' ? 'bg-indigo-950/20 hover:bg-indigo-950/30' : 'bg-indigo-50/40 hover:bg-indigo-50/60'
                                    : theme === 'dark' ? 'hover:bg-white/2' : 'hover:bg-zinc-50/50'
                                }`}
                              >
                                <td className="p-4 font-bold text-center text-zinc-400">{index + 1}</td>
                                <td className="p-4 font-bold">
                                  <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{c.name}</span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    {c.image_url || c.image ? (
                                      <img src={getImageUrl(c.image_url || c.image)} alt={c.name} className="w-9 h-9 rounded-xl object-cover border border-zinc-200 dark:border-[#2a3145] p-0.5 bg-white shadow-3xs" />
                                    ) : (
                                      <span className="text-xl">📁</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-bold text-zinc-650 dark:text-zinc-350">{subsCount}</td>
                                <td className="p-4 text-center font-bold text-zinc-650 dark:text-zinc-350">{prodsCount}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${
                                    c.is_active 
                                      ? 'bg-emerald-600 text-white border-transparent' 
                                      : 'bg-rose-600 text-white border-transparent'
                                  }`}>
                                    {c.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="p-4" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleOpenCategoryModal('edit', c)}
                                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                      title="Edit Category"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(c.id)}
                                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                      title="Delete Category"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  // All Subcategories view
                  <div className="overflow-x-auto no-scrollbar animate-fade-in">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className={`font-black uppercase tracking-wider border-b text-[12px] ${
                        theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-455' : 'bg-zinc-50/50 border-zinc-150 text-zinc-500'
                      }`}>
                        <tr>
                          <th className="p-4 w-12 text-center">#</th>
                          <th className="p-4">Subcategory Name</th>
                          <th className="p-4">Parent Category</th>
                          <th className="p-4 text-center">Image</th>
                          <th className="p-4 text-center">Products</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                        {subCategories
                          .filter(sub => sub.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                          .map((sub, index) => {
                            const prodsCount = products.filter(p => p.parent_category === sub.name || p.category_name === sub.name).length;
                            
                            return (
                              <tr key={sub.id} className={`transition-all duration-150 ${theme === 'dark' ? 'hover:bg-white/2' : 'hover:bg-zinc-50/50'}`}>
                                <td className="p-4 font-bold text-center text-zinc-400">{index + 1}</td>
                                <td className="p-4 font-bold">
                                  <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{sub.name}</span>
                                </td>
                                <td className="p-4 font-extrabold text-indigo-500">
                                  <span>{sub.parent_category}</span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    {sub.image_url || sub.image ? (
                                      <img src={getImageUrl(sub.image_url || sub.image)} alt={sub.name} className="w-9 h-9 rounded-xl object-cover border border-zinc-200 dark:border-[#2a3145] p-0.5 bg-white shadow-3xs" />
                                    ) : (
                                      <span className="text-xl">📁</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-bold text-zinc-650 dark:text-zinc-350">{prodsCount}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${
                                    sub.is_active 
                                      ? 'bg-emerald-600 text-white border-transparent' 
                                      : 'bg-rose-600 text-white border-transparent'
                                  }`}>
                                    {sub.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleOpenSubcategoryModal('edit', sub)}
                                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                      title="Edit Subcategory"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(sub.id)}
                                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                      title="Delete Subcategory"
                                    >
                                      <Trash2 size={13} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activePage === 'orders' && (
            <div className="space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Customer Checkout Orders</h3>
                <div className="relative w-full max-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID, name, phone..."
                    className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 border ${
                      theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'
                    }`}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[['All', orders.length, 'bg-indigo-600'], ['Pending', orders.filter(o=>o.status==='pending'||(!o.status&&o.payment_method==='cod')).length, 'bg-amber-500'], ['Delivered', orders.filter(o=>o.status==='delivered').length, 'bg-emerald-600'], ['Cancelled', orders.filter(o=>o.status==='cancelled').length, 'bg-red-600']].map(([label, count, color]) => (
                  <div key={label} className={`p-4 rounded-2xl border flex items-center gap-3 ${
                    theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                    <div className={`w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center font-black text-sm`}>{count}</div>
                    <span className={`text-xs font-bold ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</span>
                  </div>
                ))}
              </div>

              <div className={`border rounded-2xl overflow-x-auto min-h-[420px] ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4 text-right">Total</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Date</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan="8" className="p-8 text-center text-zinc-400 font-semibold">No orders found.</td></tr>
                    ) : (
                      filteredOrders.map((o) => {
                        const StatusIcon = STATUS_CONFIG[o.status || 'pending']?.icon || Clock;
                        return (
                          <tr key={o.order_id} className="hover:bg-white/2 transition-colors">
                            <td className="p-4 font-bold text-indigo-400">{o.order_id}</td>
                            <td className={`p-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{o.customer_name}</td>
                            <td className="p-4 text-zinc-400 font-semibold">{o.phone || '---'}</td>
                            <td className="p-4 uppercase text-zinc-500 font-bold">{o.payment_method}</td>
                            <td className={`p-4 font-extrabold text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{o.total_amount}</td>
                            <td className="p-4 text-center relative">
                              <div className="inline-block text-left">
                                {/* Custom Dropdown Toggle Button */}
                                 <button
                                   onClick={() => setActiveDropdownId(activeDropdownId === o.id ? null : o.id)}
                                   className={`text-xs font-black px-3.5 py-2 rounded-full flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 active:scale-95 border hover:brightness-95 dark:hover:brightness-110 shadow-3xs ${
                                     STATUS_CONFIG[o.status || 'pending']?.bg || 'bg-zinc-500/10 text-zinc-650 border-zinc-500/20'
                                   }`}
                                 >
                                   <StatusIcon size={14} className="shrink-0" />
                                   <span className="tracking-wider">{STATUS_CONFIG[o.status || 'pending']?.label || 'Pending'}</span>
                                   <ChevronDown size={12} className="shrink-0" />
                                 </button>
 
                                 {/* Dropdown Menu Overlay Backdrop & Menu */}
                                 {activeDropdownId === o.id && (
                                   <>
                                     <div 
                                       className="fixed inset-0 z-30" 
                                       onClick={() => setActiveDropdownId(null)} 
                                     />
                                     <div className={`absolute left-1/2 -translate-x-1/2 mt-1.5 w-40 rounded-2xl shadow-xl z-45 border p-1.5 animate-fade-in ${
                                       theme === 'dark' 
                                         ? 'bg-[#141a24] border-[#2a3145] text-white shadow-black/85' 
                                         : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-250/60'
                                     }`}>
                                       <div className="max-h-[220px] overflow-y-auto no-scrollbar py-0.5 space-y-0.5">
                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                                          const ItemIcon = cfg.icon || Clock;
                                          return (
                                            <button
                                              key={key}
                                              onClick={() => {
                                                handleOrderStatusChange(o.id, key);
                                                setActiveDropdownId(null);
                                              }}
                                              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-black transition-all cursor-pointer select-none active:scale-97 ${
                                                (o.status || 'pending') === key 
                                                  ? cfg.bg 
                                                  : (theme === 'dark' ? 'hover:bg-white/5 text-zinc-400 hover:text-white' : 'hover:bg-zinc-50 text-zinc-650 hover:text-zinc-900')
                                              }`}
                                            >
                                              <ItemIcon size={14} className="shrink-0" />
                                              <span className="tracking-wide">{cfg.label}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="p-4 text-center text-zinc-500 font-semibold">
                              {new Date(o.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleDeleteOrder(o.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'reviews' && (
            <div className="space-y-4 text-left animate-fade-in">
              <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Customer Product Reviews</h3>

              <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Product Name</th>
                      <th className="p-4 text-center">Rating</th>
                      <th className="p-4">Comment</th>
                      <th className="p-4 text-center">Date</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                    {reviews.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-zinc-500 font-semibold">
                          No reviews found.
                        </td>
                      </tr>
                    ) : (
                      reviews.map((r) => (
                        <tr key={r.id} className="hover:bg-white/2 transition-colors">
                          <td className={`p-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{r.user_name}</td>
                          <td className="p-4 text-zinc-500 font-semibold">{r.user_email}</td>
                          <td className={`p-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{r.product_name || 'Deleted Product'}</td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-0.5 text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={13}
                                  className={i < r.rating ? "fill-amber-500 stroke-amber-500" : "stroke-zinc-300 dark:stroke-zinc-700"}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="p-4 text-zinc-650 dark:text-zinc-350 max-w-[250px] truncate" title={r.comment}>
                            {r.comment}
                          </td>
                          <td className="p-4 text-center text-zinc-500 font-semibold">
                            {new Date(r.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                              title="Delete Review"
                            >
                              <Trash2 size={13} />
                            </button>
                          </td>
</tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'analytics' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Business Intelligence & Analytics</h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">Real-time charts, order distributions, and warehousing stock tracking.</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Package className="text-indigo-500" />} label="Registry Products" value={products.length} desc="Active SKU variants" theme={theme} />
                <StatCard icon={<ArrowUpRight className="text-green-500" />} label="Total Stock Units" value={products.reduce((acc, p) => acc + (p.stock || 0), 0)} desc="Items in warehouse" theme={theme} />
                <StatCard icon={<AlertCircle className="text-red-500" />} label="Low Stock Alerts" value={products.filter(p => (p.stock || 0) < 15).length} desc="SKUs below 15 units" theme={theme} />
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Sales & Orders Trend Card */}
                <div className={`p-6 rounded-3xl border transition-all lg:col-span-2 relative flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>
                        {analyticsChartMetric === 'revenue' ? 'Revenue Growth Trend' : 'Order Volume Trend'}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Daily performance tracking over the last 14 days.</p>
                    </div>
                    <div className={`flex rounded-xl p-0.5 border ${
                      theme === 'dark' ? 'bg-zinc-900 border-[#2a3145]' : 'bg-zinc-150 border-zinc-200'
                    }`}>
                      <button
                        type="button"
                        onClick={() => setAnalyticsChartMetric('revenue')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wide transition-all cursor-pointer ${
                          analyticsChartMetric === 'revenue'
                            ? 'bg-[#8b5cf6] text-white shadow-xs'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                      >
                        Revenue
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnalyticsChartMetric('orders')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-black tracking-wide transition-all cursor-pointer ${
                          analyticsChartMetric === 'orders'
                            ? 'bg-[#8b5cf6] text-white shadow-xs'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                        }`}
                      >
                        Orders
                      </button>
                    </div>
                  </div>

                  <div className="relative h-56 w-full flex select-none flex-grow">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[9px] text-zinc-400 font-bold h-[85%] pb-2 select-none w-10 text-left leading-none">
                      <span>{analyticsChartMetric === 'revenue' ? `₹${Math.round(maxChartVal).toLocaleString('en-IN')}` : Math.round(maxChartVal)}</span>
                      <span>{analyticsChartMetric === 'revenue' ? `₹${Math.round(maxChartVal * 0.75).toLocaleString('en-IN')}` : Math.round(maxChartVal * 0.75)}</span>
                      <span>{analyticsChartMetric === 'revenue' ? `₹${Math.round(maxChartVal * 0.5).toLocaleString('en-IN')}` : Math.round(maxChartVal * 0.5)}</span>
                      <span>{analyticsChartMetric === 'revenue' ? `₹${Math.round(maxChartVal * 0.25).toLocaleString('en-IN')}` : Math.round(maxChartVal * 0.25)}</span>
                      <span>₹0</span>
                    </div>

                    {/* Chart Canvas */}
                    <div className="flex-grow h-full relative">
                      {/* Gridlines */}
                      <div className="absolute inset-0 flex flex-col justify-between h-[85%] pointer-events-none">
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                        <div className="border-b border-dashed border-zinc-150 dark:border-zinc-800/80 w-full h-0" />
                      </div>

                      {/* SVG Line / Area */}
                      <svg className="w-full h-[85%] absolute inset-0 overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="analyticsTrendGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Area Polygon */}
                        {points.length > 0 && (
                          <polygon 
                            points={`${points[0].x},160 ${points.map(p => `${p.x},${p.y}`).join(' ')} ${points[points.length-1].x},160`}
                            fill="url(#analyticsTrendGrad)"
                          />
                        )}

                        {/* Trend Line */}
                        {points.length > 0 && (
                          <polyline 
                            fill="none" 
                            stroke="#8b5cf6" 
                            strokeWidth="3" 
                            points={points.map(p => `${p.x},${p.y}`).join(' ')}
                          />
                        )}

                        {/* Hover line and dot */}
                        {hoveredPointIndex !== null && (
                          <>
                            <line 
                              x1={points[hoveredPointIndex].x} 
                              y1="40" 
                              x2={points[hoveredPointIndex].x} 
                              y2="160" 
                              stroke="#8b5cf6" 
                              strokeWidth="1" 
                              strokeDasharray="4 4" 
                            />
                            <circle 
                              cx={points[hoveredPointIndex].x} 
                              cy={points[hoveredPointIndex].y} 
                              r="6" 
                              fill="#8b5cf6" 
                              stroke={theme === 'dark' ? '#10141c' : '#ffffff'} 
                              strokeWidth="2" 
                            />
                          </>
                        )}

                        {/* Tooltip triggers (hotspots) */}
                        {points.map((p, idx) => (
                          <rect
                            key={idx}
                            x={p.x - 15}
                            y="40"
                            width="30"
                            height="120"
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredPointIndex(idx)}
                            onMouseLeave={() => setHoveredPointIndex(null)}
                          />
                        ))}
                      </svg>

                      {/* X-axis Labels */}
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-bold text-zinc-400 px-1 pointer-events-none">
                        {points.map((p, idx) => {
                          if (idx % 2 !== 0 && idx !== points.length - 1) return <span key={idx} className="w-6 text-center opacity-0" />;
                          return (
                            <span key={idx} className="w-6 text-center">{p.date}</span>
                          );
                        })}
                      </div>

                      {/* Dynamic Tooltip */}
                      {hoveredPointIndex !== null && (
                        <div 
                          className="absolute p-3 bg-zinc-950/95 text-white rounded-xl text-[10px] space-y-1 shadow-xl border border-zinc-800 pointer-events-none transition-all duration-100 z-10"
                          style={{
                            left: `${(points[hoveredPointIndex].x / 500) * 100}%`,
                            top: `${(points[hoveredPointIndex].y / 200) * 100 - 15}%`,
                            transform: 'translate(-50%, -100%)',
                          }}
                        >
                          <p className="font-bold text-zinc-400">{points[hoveredPointIndex].date}</p>
                          <p className="font-black text-xs text-white">
                            {analyticsChartMetric === 'revenue' 
                              ? `₹${Math.round(points[hoveredPointIndex].val).toLocaleString('en-IN')}`
                              : `${points[hoveredPointIndex].val} Orders`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Distribution Donut Card */}
                <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div>
                    <h4 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Order Statuses</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Distribution of active workflow statuses.</p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4 flex-grow">
                    <div className="w-32 h-32 relative flex-shrink-0">
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="transparent" strokeWidth="4" />
                        {statusDonutSlices.length === 0 ? (
                          <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#cbd5e1" strokeWidth="4.2" strokeDasharray="100 0" strokeDashoffset="100" />
                        ) : (
                          statusDonutSlices.map((slice, idx) => (
                            <circle 
                              key={idx}
                              cx="21" 
                              cy="21" 
                              r="15.915" 
                              fill="transparent" 
                              stroke={slice.color} 
                              strokeWidth="4.2" 
                              strokeDasharray={slice.strokeDasharray} 
                              strokeDashoffset={slice.strokeDashoffset} 
                            />
                          ))
                        )}
                      </svg>
                    </div>

                    <div className="flex-grow w-full space-y-2 text-left flex flex-col justify-center max-h-[160px] overflow-y-auto custom-scrollbar pr-1">
                      {statusDonutSlices.length === 0 ? (
                        <span className="text-[10px] font-semibold text-zinc-400 text-center">No orders recorded yet.</span>
                      ) : (
                        statusDonutSlices.map((slice, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-bold text-zinc-550 dark:text-zinc-455">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                              <span className="capitalize">{slice.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-400 font-medium">{slice.percentage}%</span>
                              <span className="text-zinc-800 dark:text-white font-extrabold">{slice.count}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Stock Inventory Section */}
              <div className={`p-6 rounded-3xl border transition-all ${
                theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
              }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Inventory Stock Registry</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Real-time tracking of item stocks, supply states, and automatic refills.</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => window.print()}
                    className="py-2 px-3 bg-[#8b5cf6] hover:bg-purple-650 text-white text-[10px] font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ClipboardList size={12} /> Export Stock Report
                  </button>
                </div>

                <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#2a3145] bg-zinc-950/20' : 'border-zinc-150 bg-white'}`}>
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-450' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                      <tr>
                        <th className="p-4">SKU / Item</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Current Stock</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                      {paginatedAnalyticsProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/2 transition-colors">
                          <td className="p-4 font-bold flex items-center gap-2.5">
                            {p.image && <img src={getImageUrl(p.image)} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#2a3145]" />}
                            <div>
                              <p className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{p.name}</p>
                              <p className="text-[10px] text-zinc-500">PROD-00{p.id}</p>
                            </div>
                          </td>
                          <td className="p-4 font-semibold text-zinc-400">{p.category_name || 'Unassigned'}</td>
                          <td className="p-4 text-right">
                            <div className="flex items-center gap-1.5 justify-end">
                              <input 
                                type="number"
                                min="0"
                                key={p.stock}
                                defaultValue={p.stock}
                                onBlur={async (e) => {
                                  const val = parseInt(e.target.value);
                                  if (isNaN(val) || val < 0) return;
                                  if (val === p.stock) return;
                                  try {
                                    const res = await fetch(`http://127.0.0.1:8000/api/products/${p.id}/`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ stock: val })
                                    });
                                    if (res.ok) {
                                      showToast(`${p.name} stock updated to ${val} units`, 'success');
                                      syncData();
                                    } else {
                                      showToast('Failed to update stock', 'warning');
                                    }
                                  } catch (err) {
                                    showToast('Network error during stock update', 'warning');
                                  }
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.target.blur();
                                  }
                                }}
                                className={`w-16 p-1.5 text-center rounded-lg border outline-none text-xs font-black transition-all ${
                                  theme === 'dark' 
                                    ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                                }`}
                              />
                              <span className="text-[10px] text-zinc-500 font-semibold">pcs</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-center gap-1.5">
                              {/* Stock Warning Badge */}
                              <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-black uppercase tracking-wider border transition-all ${
                                p.stock === 0
                                  ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                  : p.stock < 15
                                  ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                  : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                              }`}>{p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock'}</span>

                              {/* Publication Status Dropdown */}
                              <select
                                value={p.status || 'published'}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    const res = await fetch(`http://127.0.0.1:8000/api/products/${p.id}/`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ status: newStatus })
                                    });
                                    if (res.ok) {
                                      showToast(`${p.name} status updated to ${newStatus}`, 'success');
                                      syncData();
                                    } else {
                                      showToast('Failed to update status', 'warning');
                                    }
                                  } catch (err) {
                                    showToast('Network error during status update', 'warning');
                                  }
                                }}
                                className={`text-[9px] font-black p-1 bg-transparent border rounded-lg outline-none cursor-pointer ${
                                  theme === 'dark' 
                                    ? 'border-[#2a3145] text-zinc-300 bg-zinc-950' 
                                    : 'border-zinc-200 text-zinc-750 bg-white'
                                }`}
                              >
                                <option value="published" className={theme === 'dark' ? 'bg-[#10141c] text-white font-bold' : 'bg-white text-zinc-950 font-semibold'}>Published</option>
                                <option value="draft" className={theme === 'dark' ? 'bg-[#10141c] text-white font-bold' : 'bg-white text-zinc-950 font-semibold'}>Draft</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`http://127.0.0.1:8000/api/products/${p.id}/`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ stock: 100 })
                                  });
                                  if (res.ok) {
                                    showToast(`${p.name} restocked to 100 units`, 'success');
                                    syncData();
                                  }
                                } catch (e) {
                                  showToast('Network error during restock', 'warning');
                                }
                              }}
                              className="py-2 px-4 bg-zinc-50 border border-zinc-200 text-zinc-750 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-450 dark:hover:border-emerald-900/30 font-black rounded-xl text-[10px] transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs"
                            >
                              Refill to 100
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Analytics Pagination Controls */}
                {totalAnalyticsPages > 1 && (
                  <div className="flex items-center justify-between pt-6 text-xs font-semibold select-none leading-none">
                    <span className="text-zinc-400">
                      Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-black">{Math.min(filteredAnalyticsProducts.length, (analyticsPage - 1) * 8 + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-black">{Math.min(filteredAnalyticsProducts.length, analyticsPage * 8)}</span> of <span className="font-extrabold text-zinc-650 dark:text-zinc-300">{filteredAnalyticsProducts.length}</span> items
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        type="button"
                        disabled={analyticsPage === 1}
                        onClick={() => setAnalyticsPage(prev => Math.max(1, prev - 1))}
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-[#2a3145] font-black active:scale-95"
                      >
                        ◀ Prev
                      </button>
                      {[...Array(totalAnalyticsPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setAnalyticsPage(pageNum)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all cursor-pointer active:scale-90 ${
                              analyticsPage === pageNum
                                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md'
                                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-400'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button 
                        type="button"
                        disabled={analyticsPage === totalAnalyticsPages}
                        onClick={() => setAnalyticsPage(prev => Math.min(totalAnalyticsPages, prev + 1))}
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-[#2a3145] font-black active:scale-95"
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {activePage === 'settings' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Store Configurations</h2>
                <p className="text-xs text-zinc-500 font-medium mt-1">Manage public details, checkout configurations, and store accessibility settings.</p>
              </div>

              {/* Tab Header Navigation */}
              <div className={`flex flex-wrap border rounded-2xl p-1 gap-2 ${
                theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'
              }`}>
                <button
                  type="button"
                  onClick={() => setSettingsTab('general')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settingsTab === 'general'
                      ? 'bg-[#8b5cf6] text-white shadow-xs'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-850 hover:bg-zinc-100'
                  }`}
                >
                  General Settings
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('checkout')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settingsTab === 'checkout'
                      ? 'bg-[#8b5cf6] text-white shadow-xs'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-850 hover:bg-zinc-100'
                  }`}
                >
                  Checkout Config
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('status')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settingsTab === 'status'
                      ? 'bg-[#8b5cf6] text-white shadow-xs'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-850 hover:bg-zinc-100'
                  }`}
                >
                  Store Operations
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('danger')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    settingsTab === 'danger'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-red-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-500/10'
                  }`}
                >
                  Danger Zone
                </button>
              </div>

              {/* Tab Contents */}
              <form onSubmit={handleSaveSettings} className={`p-6 rounded-3xl border transition-all ${
                theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
              }`}>
                {settingsTab === 'general' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>General Settings</h3>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Edit public contact parameters shown on the storefront.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Public Support Phone</label>
                        <input
                          type="text"
                          value={settingsForm.contactPhone}
                          onChange={e => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                          placeholder="+91 XXXXX XXXXX"
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Contact Email Address</label>
                        <input
                          type="email"
                          value={settingsForm.contactEmail}
                          onChange={e => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                          placeholder="support@vdgfashion.com"
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Boutique Physical Address</label>
                      <textarea
                        rows={3}
                        value={settingsForm.storeAddress}
                        onChange={e => setSettingsForm(prev => ({ ...prev, storeAddress: e.target.value }))}
                        placeholder="Full physical address..."
                        required
                        className={`w-full p-3 rounded-xl border outline-none text-xs ${
                          theme === 'dark' 
                            ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                            : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {settingsTab === 'checkout' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Checkout Configurations</h3>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Control pricing, active promotional code discounts, and shipping rules.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Active Promo Code Name</label>
                        <input
                          type="text"
                          value={settingsForm.activePromoCode}
                          onChange={e => setSettingsForm(prev => ({ ...prev, activePromoCode: e.target.value.toUpperCase() }))}
                          placeholder="e.g. SUMMER20"
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Promo Discount Percentage (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settingsForm.activePromoDiscount}
                          onChange={e => setSettingsForm(prev => ({ ...prev, activePromoDiscount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Free Shipping Threshold limit (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={settingsForm.freeShippingThreshold}
                          onChange={e => setSettingsForm(prev => ({ ...prev, freeShippingThreshold: Math.max(0, parseInt(e.target.value) || 0) }))}
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">Flat Shipping Fee (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={settingsForm.shippingFee}
                          onChange={e => setSettingsForm(prev => ({ ...prev, shippingFee: Math.max(0, parseInt(e.target.value) || 0) }))}
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${
                            theme === 'dark' 
                              ? 'bg-zinc-950 border-[#2a3145] text-white focus:border-purple-500' 
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'status' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className={`text-base font-black ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Boutique Operations</h3>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Toggle store operation between fully active and maintenance modes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, isStoreOpen: true }))}
                        className={`p-5 rounded-2xl border text-left flex items-start space-x-4 cursor-pointer transition-all ${
                          settingsForm.isStoreOpen
                            ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                            : theme === 'dark' ? 'border-[#2a3145] text-zinc-400 hover:bg-zinc-900/30' : 'border-zinc-200 text-zinc-550 hover:bg-zinc-50'
                        }`}
                      >
                        <CheckCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-black text-sm">Active Storefront (Open)</h4>
                          <p className="text-[10px] text-zinc-500 font-semibold mt-1">Customers can browse collections, modify shopping carts, and submit orders.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, isStoreOpen: false }))}
                        className={`p-5 rounded-2xl border text-left flex items-start space-x-4 cursor-pointer transition-all ${
                          !settingsForm.isStoreOpen
                            ? 'border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400'
                            : theme === 'dark' ? 'border-[#2a3145] text-zinc-400 hover:bg-zinc-900/30' : 'border-zinc-200 text-zinc-550 hover:bg-zinc-50'
                        }`}
                      >
                        <XCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-black text-sm">Maintenance Mode (Closed)</h4>
                          <p className="text-[10px] text-zinc-500 font-semibold mt-1">Order submissions are blocked with a clean visual notice. Admins can still access dashboards.</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === 'danger' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="text-base font-black text-red-505 text-red-500 uppercase tracking-wider">Danger Zone</h3>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">Database maintenance, reset scripts, and system wipe controls.</p>
                    </div>

                    <div className={`p-5 rounded-2xl border ${
                      theme === 'dark' ? 'border-red-900/30 bg-red-950/10' : 'border-red-150 bg-red-50/20'
                    }`}>
                      <h4 className="text-xs font-black text-red-500 uppercase tracking-wider mb-1">Erase Registry Data</h4>
                      <p className="text-[10px] text-zinc-500 font-medium mb-4 leading-relaxed">
                        Warning: Clicking the button below will clear all registered products, categories, subcategories, customer orders, and reviews. This action is irreversible.
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm('WARNING: This will completely erase all products, categories, orders, and banners from the database! Are you sure?')) return;
                          setLoadingData(true);
                          try {
                            const res = await fetch('http://127.0.0.1:8000/api/products/clear-all/', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' }
                            });
                            if (res.ok) {
                              showToast('Database wiped clean!', 'success');
                              syncData();
                            } else {
                              showToast('Failed to clear database.', 'warning');
                            }
                          } catch (e) {
                            showToast('Network error clearing database.', 'warning');
                          } finally {
                            setLoadingData(false);
                          }
                        }}
                        className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                      >
                        Reset / Clear Database
                      </button>
                    </div>
                  </div>
                )}

                {/* Save Button for active config tabs */}
                {settingsTab !== 'danger' && (
                  <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-[#2a3145] flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-[#8b5cf6] hover:bg-purple-650 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer active:scale-95 shadow-md shadow-purple-500/10"
                    >
                      Save Configuration
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activePage === 'users' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-black tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Users Registry</h2>
                  <p className="text-xs text-zinc-500 font-medium mt-1">Dashboard &gt; Users</p>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Total Registered Users</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Staff / Admins</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.filter(u => u.is_staff).length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                    <Users className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Standard Customers</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.filter(u => !u.is_staff).length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">Active Accounts</p>
                    <h3 className={`text-2xl font-black leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.filter(u => u.is_active).length}</h3>
                  </div>
                </div>
              </div>

              {/* Table Card */}
              <div className={`p-6 rounded-3xl border ${
                theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white' : 'bg-white border-zinc-200 shadow-3xs'
              }`}>
                {/* Search Header */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-6">
                  <div>
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>User Directory</h3>
                    <p className="text-[10px] text-zinc-400 font-semibold mt-0.5">Filter, configure, and promote/demote registered customer accounts.</p>
                  </div>
                  <div className="relative w-full max-w-[340px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input 
                      type="text" 
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search users by name, email..."
                      className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 border ${
                        theme === 'dark' 
                          ? 'bg-[#161b26] border-[#2a3145] text-white placeholder-zinc-500' 
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Main Table view */}
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full min-w-[900px] text-left text-sm font-semibold">
                    <thead className={`font-black uppercase tracking-wider border-b pb-2.5 text-[11px] ${
                      theme === 'dark' ? 'border-[#2a3145] text-zinc-400' : 'border-zinc-100 text-black'
                    }`}>
                      <tr>
                        <th className="pb-3.5">User Identity</th>
                        <th className="pb-3.5">Full Name</th>
                        <th className="pb-3.5 text-center">Role / Authorization</th>
                        <th className="pb-3.5 text-center">Account Status</th>
                        <th className="pb-3.5 text-center">Joined Date</th>
                        <th className="pb-3.5 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-[#2a3145]/60 text-zinc-700 dark:text-zinc-300">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-xs font-semibold text-zinc-400">
                            No matching user records found.
                          </td>
                        </tr>
                      ) : (
                        paginatedUsers.map((u, idx) => {
                          const initials = (u.first_name && u.last_name)
                            ? `${u.first_name[0]}${u.last_name[0]}`.toUpperCase()
                            : u.username.substring(0, 2).toUpperCase();

                          const gradients = [
                            'from-pink-400 to-rose-500',
                            'from-blue-400 to-indigo-500',
                            'from-amber-400 to-orange-500',
                            'from-purple-400 to-indigo-500',
                            'from-teal-400 to-emerald-500',
                            'from-violet-400 to-fuchsia-500'
                          ];
                          const gradient = gradients[u.id % gradients.length];
                          
                          const joinedDate = u.date_joined 
                            ? new Date(u.date_joined).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })
                            : '---';

                          return (
                            <tr key={u.id} className="hover:bg-white/2 transition-colors duration-150">
                              <td className="py-4">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-extrabold text-xs shadow-3xs shrink-0 select-none`}>
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`font-extrabold text-[13px] leading-snug truncate ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>
                                      {u.username}
                                    </p>
                                    <p className="text-[11px] text-zinc-400 font-semibold tracking-wide truncate max-w-[200px]">
                                      {u.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4">
                                <span className={theme === 'dark' ? 'text-zinc-200' : 'text-zinc-700'}>
                                  {u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : <span className="text-zinc-400">---</span>}
                                </span>
                              </td>
                              <td className="py-4 text-center">
                                <button
                                  onClick={() => handleToggleUserStaff(u)}
                                  className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-3xs ${
                                    u.is_staff
                                      ? 'bg-purple-600 text-white border-transparent'
                                      : 'bg-emerald-600 text-white border-transparent'
                                  }`}
                                  title="Click to toggle user role"
                                >
                                  {u.is_staff ? 'Admin / Staff' : 'Customer'}
                                </button>
                              </td>
                              <td className="py-4 text-center">
                                <button
                                  onClick={() => handleToggleUserActive(u)}
                                  className={`px-3 py-1 rounded-full text-[9px] font-bold border transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-3xs ${
                                    u.is_active
                                      ? 'bg-emerald-600 text-white border-transparent'
                                      : 'bg-red-650 text-white border-transparent'
                                  }`}
                                  title="Click to toggle account state"
                                >
                                  {u.is_active ? 'Active' : 'Deactivated'}
                                </button>
                              </td>
                              <td className="py-4 text-center text-zinc-400 text-xs">
                                {joinedDate}
                              </td>
                              <td className="py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleOpenUserModal('edit', u)}
                                    className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                    title="Edit User details"
                                  >
                                    <Edit size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteUser(u.id)}
                                    className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                    title="Delete User account"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalUserPages > 1 && (
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-semibold select-none leading-none mt-4">
                    <span className="text-zinc-400">
                      Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-black">{Math.min(filteredUsers.length, (userPage - 1) * USERS_ITEMS_PER_PAGE + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-black">{Math.min(filteredUsers.length, userPage * USERS_ITEMS_PER_PAGE)}</span> of <span className="font-extrabold text-zinc-650 dark:text-zinc-300">{filteredUsers.length}</span> users
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button 
                        disabled={userPage === 1}
                        onClick={() => setUserPage(prev => Math.max(1, prev - 1))}
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#2a3145] font-black active:scale-95"
                      >
                        ◀ Prev
                      </button>
                      {[...Array(totalUserPages)].map((_, idx) => {
                        const pageNum = idx + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setUserPage(pageNum)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-black transition-all cursor-pointer active:scale-90 ${
                              userPage === pageNum
                                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md'
                                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      <button 
                        disabled={userPage === totalUserPages}
                        onClick={() => setUserPage(prev => Math.min(totalUserPages, prev + 1))}
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#2a3145] font-black active:scale-95"
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>


      {/* Loading overlay */}
      {loadingData && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl text-xs font-bold border ${
            theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
          }`}>
            <Loader2 size={14} className="animate-spin text-indigo-500" />
            Syncing data...
          </div>
        </div>
      )}

      {/* Floating CRUD Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full ${modalType === 'product' ? 'max-w-[780px]' : 'max-w-[500px]'} rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 ${
            theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/85' : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50'
          }`}>
            <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4 text-left custom-scrollbar">
            <div className={`flex justify-between items-center pb-4 border-b ${theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-200/65'}`}>
              <h3 className={`text-base font-black ${modalType === 'category' || modalType === 'subcategory' ? 'text-[20px] font-bold text-zinc-900 dark:text-white capitalize tracking-tight font-sans' : 'uppercase tracking-wider'}`}>
                {modalMode === 'edit' ? 'Edit' : 'Create New'} {modalType === 'product' ? 'Product' : modalType === 'category' ? 'Category' : modalType === 'subcategory' ? 'Subcategory' : modalType === 'user' ? 'User Account' : modalType}
              </h3>
              <button onClick={() => setModalType(null)} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`}><X size={modalType === 'category' || modalType === 'subcategory' ? 20 : 16} /></button>
            </div>

            {modalType === 'product' && (
              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs font-semibold">
                
                {/* 1. Featured Image & Gallery Section */}
                <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                }`}>
                  <h4 className="text-[13px] font-black flex items-center gap-2.5 text-zinc-950 dark:text-zinc-50">
                    <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-black text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">1</span>
                    Media Assets
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Image Path / URL</label>
                      <input 
                        type="text" 
                        value={productForm.image} 
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} 
                        placeholder="e.g., products/baby_frock.png"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Upload Local File</label>
                      <div className="relative flex items-center justify-center">
                        <label className={`w-full flex flex-col items-center justify-center p-3 h-[46px] rounded-xl border border-dashed cursor-pointer transition-all ${
                          theme === 'dark' 
                            ? 'bg-[#161b26] border-[#2a3145] hover:bg-[#202736] text-zinc-355 hover:border-indigo-500/40' 
                            : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-650 hover:border-indigo-500/40 shadow-3xs'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Upload size={14} className={uploadingImage ? "animate-spin text-indigo-500" : "animate-pulse text-zinc-400"} />
                            <span className="text-[10.5px] font-extrabold tracking-wide">
                              {uploadingImage ? 'Uploading...' : productForm.image ? '✅ File Linked' : 'Choose Local File'}
                            </span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Color Selection (Hex)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={productForm.color_hex} 
                          onChange={(e) => setProductForm({ ...productForm, color_hex: e.target.value })} 
                          className={`w-12 h-[46px] p-1.5 rounded-xl border cursor-pointer ${
                            theme === 'dark' ? 'bg-[#161b26] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                          }`}
                        />
                        <input 
                          type="text" 
                          value={productForm.color_hex} 
                          onChange={(e) => setProductForm({ ...productForm, color_hex: e.target.value })} 
                          placeholder="#ffffff"
                          className={`flex-1 p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                            theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Group & Categories Section */}
                <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                }`}>
                  <h4 className="text-[13px] font-black flex items-center gap-2.5 text-zinc-950 dark:text-zinc-50">
                    <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-black text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">2</span>
                    Group & Classification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Category Dropdown - root categories only */}
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Category <span className="text-red-400">*</span></label>
                      <select
                        required
                        value={productForm.category}
                        onChange={(e) => {
                          const selectedCat = rootCategories.find(c => String(c.id) === String(e.target.value));
                          setProductForm(prev => ({
                            ...prev,
                            category: e.target.value,
                            parent_category: '' // reset subcategory when category changes
                          }));
                        }}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      >
                        <option value="">Select Category...</option>
                        {rootCategories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Subcategory Dropdown - filtered by selected category */}
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Subcategory</label>
                      <select
                        value={productForm.parent_category}
                        onChange={(e) => setProductForm(prev => ({ ...prev, parent_category: e.target.value }))}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        } ${!productForm.category ? 'opacity-50' : ''}`}
                        disabled={!productForm.category}
                      >
                        <option value="">Select Subcategory...</option>
                        {(() => {
                          const selectedCatName = rootCategories.find(c => String(c.id) === String(productForm.category))?.name;
                          return subCategories
                            .filter(sc => sc.parent_category === selectedCatName)
                            .map(sc => (
                              <option key={sc.id} value={sc.name}>{sc.name}</option>
                            ));
                        })()}
                      </select>
                      {productForm.category && subCategories.filter(sc => sc.parent_category === rootCategories.find(c => String(c.id) === String(productForm.category))?.name).length === 0 && (
                        <p className="text-[10px] text-zinc-400 font-semibold mt-1">No subcategories for this category</p>
                      )}
                    </div>

                    {/* Tag Type */}
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Tag Type</label>
                      <select 
                        value={productForm.tag_type} 
                        onChange={(e) => setProductForm({ ...productForm, tag_type: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      >
                        <option value="new">New</option>
                        <option value="trending">Trending</option>
                        <option value="popular">Popular</option>
                        <option value="sale">Sale</option>
                        <option value="casual">Casual</option>
                        <option value="sporty">Sporty</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 3. Description & Core Attributes */}
                <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                }`}>
                  <h4 className="text-[13px] font-black flex items-center gap-2.5 text-zinc-950 dark:text-zinc-50">
                    <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-black text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">3</span>
                    Product Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Product Name*</label>
                      <input 
                        type="text" 
                        required 
                        value={productForm.name} 
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Unit*</label>
                      <input 
                        type="text" 
                        required 
                        value={productForm.unit} 
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} 
                        placeholder="e.g., pc, pack, box"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Slug (Automatic / Custom)</label>
                      <input 
                        type="text" 
                        value={productForm.slug} 
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} 
                        placeholder="Auto-generated if left blank"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Discount Label</label>
                      <input 
                        type="text" 
                        value={productForm.discount} 
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} 
                        placeholder="e.g., -25% OFF" 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Description*</label>
                    <textarea 
                      required
                      value={productForm.description} 
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} 
                      className={`w-full p-3 h-20 rounded-xl border transition-all focus:outline-none resize-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                        theme === 'dark' ? 'bg-[#161b26] text-white border-[#2a3145] focus:border-indigo-500' : 'bg-white text-zinc-800 border-zinc-200 focus:border-indigo-500 focus:bg-white'
                      }`}
                    />
                  </div>
                </div>

                {/* 4. Product Type & Dimensions */}
                <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                }`}>
                  <h4 className="text-[13px] font-black flex items-center gap-2.5 text-zinc-950 dark:text-zinc-50">
                    <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-black text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">4</span>
                    Product Configuration & Dimensions
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Product Type</label>
                      <select 
                        value={productForm.product_type} 
                        onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      >
                        <option value="simple">Simple Product</option>
                        <option value="variable">Variable Product</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Width (cm)</label>
                      <input 
                        type="number" 
                        value={productForm.width} 
                        onChange={(e) => setProductForm({ ...productForm, width: e.target.value })} 
                        placeholder="0.0"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Height (cm)</label>
                      <input 
                        type="number" 
                        value={productForm.height} 
                        onChange={(e) => setProductForm({ ...productForm, height: e.target.value })} 
                        placeholder="0.0"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Length (cm)</label>
                      <input 
                        type="number" 
                        value={productForm.length} 
                        onChange={(e) => setProductForm({ ...productForm, length: e.target.value })} 
                        placeholder="0.0"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Simple Product Information (Pricing & Stock) */}
                <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                }`}>
                  <h4 className="text-[13px] font-black flex items-center gap-2.5 text-zinc-950 dark:text-zinc-50">
                    <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-black text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">5</span>
                    Pricing & Inventory
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className={`h-8 flex items-end pb-1 text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Price (INR)*</label>
                      <input 
                        type="number" 
                        required 
                        value={productForm.price} 
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`h-8 flex items-end pb-1 text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Sale Price (Original)</label>
                      <input 
                        type="number" 
                        value={productForm.original_price} 
                        onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`h-8 flex items-end pb-1 text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Quantity (Stock)*</label>
                      <input 
                        type="number" 
                        required 
                        value={productForm.stock} 
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`h-8 flex items-end pb-1 text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>SKU*</label>
                      <input 
                        type="text" 
                        required 
                        value={productForm.sku} 
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} 
                        placeholder="e.g., TS-GRN-001"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Status Selection */}
                <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                }`}>
                  <h4 className="text-[13px] font-black flex items-center gap-2.5 text-zinc-950 dark:text-zinc-50">
                    <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-black text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">6</span>
                    Publishing Control
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div 
                      onClick={() => setProductForm({ ...productForm, status: 'published' })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between shadow-3xs hover:shadow-2xs ${
                        productForm.status === 'published'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 dark:bg-[#161b26]'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className={`font-extrabold text-[12.5px] ${
                          productForm.status === 'published'
                            ? 'text-emerald-950 dark:text-emerald-50'
                            : 'text-zinc-800 dark:text-white'
                        }`}>Published</span>
                        <span className={`text-[10px] font-medium ${
                          productForm.status === 'published'
                            ? 'text-emerald-700/80 dark:text-emerald-400'
                            : 'text-zinc-400'
                        }`}>Live on Website catalog</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        productForm.status === 'published'
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-zinc-300 border-2'
                      }`}>
                        {productForm.status === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>

                    <div 
                      onClick={() => setProductForm({ ...productForm, status: 'draft' })}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between shadow-3xs hover:shadow-2xs ${
                        productForm.status === 'draft'
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-indigo-500/40 dark:bg-[#161b26]'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span className={`font-extrabold text-[12.5px] ${
                          productForm.status === 'draft'
                            ? 'text-emerald-950 dark:text-emerald-50'
                            : 'text-zinc-800 dark:text-white'
                        }`}>Draft Mode</span>
                        <span className={`text-[10px] font-medium ${
                          productForm.status === 'draft'
                            ? 'text-emerald-700/80 dark:text-emerald-400'
                            : 'text-zinc-400'
                        }`}>Offline Sandbox preview</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        productForm.status === 'draft'
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-zinc-300 border-2'
                      }`}>
                        {productForm.status === 'draft' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button 
                    type="button" 
                    onClick={() => setModalType(null)} 
                    className="py-3 px-6 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-300 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-3 px-8 bg-linear-to-r from-indigo-600 to-violet-600 hover:opacity-95 text-white font-extrabold rounded-xl transition-all active:scale-95 shadow-md shadow-indigo-500/10 cursor-pointer text-xs uppercase tracking-wider"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {modalType === 'category' && (
              <form onSubmit={handleSaveCategory} className="space-y-5 text-left text-sm">
                
                {/* 1. Category Image */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center">
                    Category Image <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className={`flex items-center p-6 bg-zinc-50/50 dark:bg-zinc-900/30 border border-dashed border-indigo-200 dark:border-zinc-700 rounded-2xl gap-5 transition-all ${
                    uploadingCategoryImage ? 'opacity-80' : ''
                  }`}>
                    {/* Left side preview */}
                    <div className="w-16 h-16 rounded-2xl border border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-3xs">
                      {categoryForm.imagePreview || categoryForm.image ? (
                        <img src={getImageUrl(categoryForm.imagePreview || categoryForm.image)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-indigo-300 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    {/* Right side upload button area */}
                    <label className="flex-1 flex flex-col items-start justify-center cursor-pointer select-none">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                        <Upload size={16} className={uploadingCategoryImage ? 'animate-spin' : ''} />
                        <span className="text-[14px] font-bold">
                          {uploadingCategoryImage ? 'Uploading Image...' : categoryForm.imagePreview ? 'Change Category Image' : 'Upload Category Image'}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold mt-1">
                        JPG, PNG or WEBP. Max size 2MB.
                      </span>
                      <input type="file" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* 2. Category Name */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    Category Name <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Enter category name"
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white transition-all shadow-3xs"
                  />
                </div>

                {/* 4. Status */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    Status <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={categoryForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.value === 'true' })}
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white cursor-pointer transition-all shadow-3xs font-extrabold"
                  >
                    <option value="true">🟢 Active</option>
                    <option value="false">🔴 Inactive</option>
                  </select>
                </div>

                {/* 5. Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button 
                    type="button" 
                    onClick={() => setModalType(null)} 
                    className="py-3 px-6 bg-white hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploadingCategoryImage || !categoryForm.image}
                    className={`py-3 px-8 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md text-xs cursor-pointer ${
                      uploadingCategoryImage || !categoryForm.image
                        ? 'bg-zinc-350 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/10'
                    }`}
                  >
                    {uploadingCategoryImage ? 'Uploading...' : 'Save Category'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'subcategory' && (
              <form onSubmit={handleSaveCategory} className="space-y-5 text-left text-sm">
                
                {/* 1. Subcategory Image */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200 flex items-center">
                    Subcategory Image <span className="text-red-500 ml-1">*</span>
                  </label>
                  
                  <div className={`flex items-center p-6 bg-zinc-50/50 dark:bg-zinc-900/30 border border-dashed border-indigo-200 dark:border-zinc-700 rounded-2xl gap-5 transition-all ${
                    uploadingCategoryImage ? 'opacity-80' : ''
                  }`}>
                    {/* Left side preview */}
                    <div className="w-16 h-16 rounded-2xl border border-zinc-200/60 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-3xs">
                      {categoryForm.imagePreview || categoryForm.image ? (
                        <img src={getImageUrl(categoryForm.imagePreview || categoryForm.image)} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-8 h-8 text-indigo-300 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <polyline points="21 15 16 10 5 21" />
                        </svg>
                      )}
                    </div>

                    {/* Right side upload button area */}
                    <label className="flex-1 flex flex-col items-start justify-center cursor-pointer select-none">
                      <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700">
                        <Upload size={16} className={uploadingCategoryImage ? 'animate-spin' : ''} />
                        <span className="text-[14px] font-bold">
                          {uploadingCategoryImage ? 'Uploading Image...' : categoryForm.imagePreview ? 'Change Subcategory Image' : 'Upload Subcategory Image'}
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-semibold mt-1">
                        JPG, PNG or WEBP. Max size 2MB.
                      </span>
                      <input type="file" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* 2. Parent Category Select */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    Category Name Select <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    required
                    value={categoryForm.parent_category}
                    onChange={(e) => setCategoryForm({ ...categoryForm, parent_category: e.target.value })}
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white cursor-pointer transition-all shadow-3xs font-extrabold"
                  >
                    <option value="">Select Category...</option>
                    {rootCategories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Subcategory Name */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    Subcategory Name Type <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    placeholder="Enter subcategory name"
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white transition-all shadow-3xs"
                  />
                </div>

                {/* 4. Status */}
                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    Status <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={categoryForm.is_active ? 'true' : 'false'}
                    onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.value === 'true' })}
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white cursor-pointer transition-all shadow-3xs font-extrabold"
                  >
                    <option value="true">🟢 Active</option>
                    <option value="false">🔴 Inactive</option>
                  </select>
                </div>

                {/* 5. Action Buttons */}
                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button 
                    type="button" 
                    onClick={() => setModalType(null)} 
                    className="py-3 px-6 bg-white hover:bg-zinc-50 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-750 dark:text-zinc-350 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold transition-all active:scale-95 cursor-pointer text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={uploadingCategoryImage || !categoryForm.image}
                    className={`py-3 px-8 text-white rounded-xl font-bold transition-all active:scale-95 shadow-md text-xs cursor-pointer ${
                      uploadingCategoryImage || !categoryForm.image
                        ? 'bg-zinc-350 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/10'
                    }`}
                  >
                    {uploadingCategoryImage ? 'Uploading...' : 'Save Subcategory'}
                  </button>
                </div>
              </form>
            )}

            {modalType === 'bulk' && (
              <form onSubmit={handleBulkUpload} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Paste Products JSON Array</label>
                    <span className="text-[10px] text-zinc-500">(Array of JSON objects)</span>
                  </div>
                  <textarea 
                    required
                    value={bulkInput} 
                    onChange={(e) => setBulkInput(e.target.value)} 
                    placeholder='[&#10;  {"name": "Bulk Product A", "price": 499.00, "category_name": "T-Shirts", "stock": 80},&#10;  {"name": "Bulk Product B", "price": 899.00, "category_name": "Apparel", "stock": 50}&#10;]'
                    className={`w-full h-48 p-3 rounded-xl border transition-all focus:outline-none resize-none font-mono text-[10px] ${
                      theme === 'dark' ? 'bg-[#161b26] text-white border-[#2a3145] focus:border-indigo-500' : 'bg-white text-[#0f172a] border-zinc-200 focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setModalType(null)} className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer flex items-center gap-1.5">
                    <Upload size={12} /> Execute Bulk Import
                  </button>
                </div>
              </form>
            )}

            {modalType === 'user' && (
              <form onSubmit={handleSaveUser} className="space-y-4 text-left text-sm">
                
                <div className="p-4 bg-zinc-50 dark:bg-[#161b26] border border-zinc-200 dark:border-zinc-700 rounded-xl space-y-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Username (Immutable)</span>
                  <p className={`text-base font-extrabold ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>{userForm.username}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">
                    Email Address <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="e.g. john@example.com"
                    className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white transition-all shadow-3xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">First Name</label>
                    <input
                      type="text"
                      value={userForm.first_name}
                      onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                      placeholder="John"
                      className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white transition-all shadow-3xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[14px] font-bold text-zinc-800 dark:text-zinc-200">Last Name</label>
                    <input
                      type="text"
                      value={userForm.last_name}
                      onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                      placeholder="Doe"
                      className="w-full p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 bg-white dark:bg-[#161b26] text-zinc-800 dark:text-white transition-all shadow-3xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="form_is_staff"
                      checked={userForm.is_staff}
                      onChange={(e) => setUserForm({ ...userForm, is_staff: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-650 accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="form_is_staff" className="text-xs font-bold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer">
                      Is Staff Admin
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="form_is_active"
                      checked={userForm.is_active}
                      onChange={(e) => setUserForm({ ...userForm, is_active: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-650 accent-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="form_is_active" className="text-xs font-bold text-zinc-800 dark:text-zinc-200 select-none cursor-pointer">
                      Account Active
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setModalType(null)} 
                    className="py-3 px-5 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold rounded-xl cursor-pointer text-xs transition-colors active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                  >
                    {modalMode === 'edit' ? 'Save Changes' : 'Create Account'}
                  </button>
                </div>
              </form>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavItem({ icon, label, active, onClick, theme }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full px-5 py-4 rounded-2xl text-[18px] font-black transition-all flex items-center gap-4 cursor-pointer select-none active:scale-98 ${
        active 
          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md shadow-purple-500/10' 
          : theme === 'dark'
            ? 'text-zinc-400 hover:bg-[#161b26] hover:text-white'
            : 'text-zinc-500 hover:bg-zinc-50 hover:text-[#0f172a]'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GridStat({ color, label, value, icon, theme }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ease-out transform hover:scale-[1.04] text-left shadow-2xs hover:shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#10141c] border-[#2a3145] text-white hover:shadow-purple-500/5' 
        : 'bg-white border-zinc-200 text-[#0f172a] hover:shadow-zinc-300/30'
    }`}>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${color} mb-4 shadow-md transition-transform duration-300 hover:rotate-6`}>
        {icon}
      </div>
      <p className="text-[14.5px] font-semibold text-zinc-400 leading-none mb-2.5">{label}</p>
      <h4 className={`text-[30px] font-black leading-none ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{value}</h4>
    </div>
  );
}

function CategoryLegendRow({ dotColor, label, pct, val }) {
  return (
    <div className="flex items-center justify-between text-[14.5px] font-black text-zinc-650 dark:text-zinc-300">
      <div className="flex items-center gap-3">
        <span className={`w-3.5 h-3.5 rounded-full ${dotColor} shadow-2xs`} />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-3.5">
        <span className="text-zinc-400 font-semibold">{pct}</span>
        <span className="text-zinc-800 dark:text-white font-extrabold">{val}</span>
      </div>
    </div>
  );
}

function OrderRow({ id, date, amount, status, name, gradient, initials, theme }) {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-600 text-white border-transparent';
      case 'Processing':
        return 'bg-indigo-600 text-white border-transparent';
      case 'Pending':
        return 'bg-amber-500 text-white border-transparent';
      default:
        return 'bg-zinc-500 text-white border-transparent';
    }
  };

  return (
    <div className={`flex items-center justify-between border-b py-3.5 last:border-b-0 ${
      theme === 'dark' ? 'border-[#2a3145]/60' : 'border-zinc-100'
    }`}>
      <div className="flex items-center gap-3.5 text-left">
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center font-extrabold text-[12px] text-white shadow-2xs shrink-0 select-none`}>
          {initials}
        </div>
        <div>
          <p className={`font-bold text-[16px] leading-none mb-1.5 ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{id}</p>
          <p className="text-[13px] text-zinc-400 font-semibold">{date}</p>
        </div>
      </div>
      <div className="text-right leading-none flex flex-col items-end gap-2.5">
        <p className={`font-extrabold text-[16px] leading-none ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{amount}</p>
        <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-wider ${getBadgeStyle()}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function TopProductRow({ name, category, sold, rev, image, theme }) {
  return (
    <tr className={`transition-colors border-b last:border-b-0 ${
      theme === 'dark' 
        ? 'hover:bg-white/2 border-[#2a3145]/60' 
        : 'hover:bg-zinc-50/50 border-zinc-150'
    }`}>
      <td className="py-3.5 font-bold flex items-center gap-3">
        {image ? (
          <img 
            src={image} 
            alt={name} 
            className="w-8 h-8 rounded-lg object-cover border border-zinc-200 dark:border-[#2a3145] shadow-3xs" 
          />
        ) : (
          <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-3xs ${
            theme === 'dark' ? 'bg-[#161b26] text-white' : 'bg-zinc-100 text-zinc-800'
          }`}>
            👕
          </span>
        )}
        <span className={`text-[15.5px] ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{name}</span>
      </td>
      <td className="py-3.5 font-semibold text-zinc-400 text-[14.5px]">{category}</td>
      <td className={`py-3.5 text-center font-bold text-[15.5px] ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{sold}</td>
      <td className={`py-3.5 text-right font-extrabold text-[16px] ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>{rev}</td>
      <td className="py-3.5 text-center">
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white border border-transparent">Active</span>
      </td>
    </tr>
  );
}

function StatCard({ icon, label, value, desc, theme }) {
  return (
    <div className={`p-6 rounded-3xl border transition-all text-left ${
      theme === 'dark' 
        ? 'bg-[#10141c] border-[#2a3145] text-white' 
        : 'bg-white border-zinc-200 text-[#0f172a] shadow-3xs'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-black text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-[#161b26] flex items-center justify-center">
          {icon}
        </div>
      </div>
      <h4 className={`text-3xl font-black leading-none mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{value}</h4>
      <p className="text-[11px] text-zinc-400 font-semibold leading-none">{desc}</p>
    </div>
  );
}
