'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Lock, Mail, Loader2, AlertCircle, Eye, EyeOff,
  LayoutDashboard, Package, Folders, ShoppingCart, Users, 
  Ticket, Star, BarChart3, Megaphone, Landmark, Settings, 
  UserCheck, ClipboardList, Search, Bell, Moon, Sun, ChevronRight, 
  ArrowUpRight, RefreshCcw, CheckCircle, Database, Trash2, Edit, Plus, Upload, X,
  ShoppingBag, Wallet
} from 'lucide-react';

export default function AdminRoute() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('trendify_admin_authenticated');
    if (sessionAuth === 'true') {
      setIsLoggedIn(true);
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
        sessionStorage.setItem('trendify_admin_authenticated', 'true');
        sessionStorage.setItem('access_token', data.access);
        sessionStorage.setItem('refresh_token', data.refresh);
        setIsLoggedIn(true);
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
    sessionStorage.removeItem('trendify_admin_authenticated');
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full bg-[#f8fafc] flex items-center justify-center p-4 relative font-sans overflow-hidden select-none text-[#0f172a]">
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
              <h2 className="text-3xl font-extrabold tracking-tight text-[#0f172a]">Trendify</h2>
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
            © 2026 Trendify Admin. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return <DashboardPortal onLogout={handleLogout} />;
}

function DashboardPortal({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [productPage, setProductPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setProductPage(1);
  }, [searchQuery]);
  
  // Real Database Lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  
  const [loadingData, setLoadingData] = useState(false);

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
    name: '', parent_category: ''
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

  const syncData = useCallback(async () => {
    setLoadingData(true);
    try {
      const prodRes = await fetch('http://127.0.0.1:8000/api/products/');
      if (prodRes.ok) setProducts(await prodRes.json());
      const orderRes = await fetch('http://127.0.0.1:8000/api/orders/');
      if (orderRes.ok) setOrders(await orderRes.json());
      const catRes = await fetch('http://127.0.0.1:8000/api/categories/');
      if (catRes.ok) setCategories(await catRes.json());
      const banRes = await fetch('http://127.0.0.1:8000/api/hero-banners/');
      if (banRes.ok) setBanners(await banRes.json());
    } catch (e) {
      showToast('Failed to sync with backend REST API!', 'warning');
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    syncData();
  }, [syncData]);

  // CRUD Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = modalMode === 'edit'
      ? `http://127.0.0.1:8000/api/products/${selectedItem.id}/`
      : 'http://127.0.0.1:8000/api/products/';
    const method = modalMode === 'edit' ? 'PATCH' : 'POST';

    try {
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
        image: productForm.image || null
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
    const url = modalMode === 'edit'
      ? `http://127.0.0.1:8000/api/categories/${selectedItem.id}/`
      : 'http://127.0.0.1:8000/api/categories/';
    const method = modalMode === 'edit' ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: categoryForm.name,
          parent_category: categoryForm.parent_category || null
        })
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Category updated' : 'Category created', 'success');
        setModalType(null);
        syncData();
      } else {
        showToast('Error saving category data', 'warning');
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

  const handleOpenProductModal = (mode, item = null) => {
    setModalType('product');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setProductForm({
        name: item.name || '',
        slug: item.slug || '',
        unit: item.unit || 'pc',
        sku: item.sku || '',
        category: item.category || '',
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
        name: '', slug: '', unit: 'pc', sku: '', category: categories[0]?.id || '', parent_category: 'New Born (0–3 Months)',
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
        parent_category: item.parent_category || ''
      });
    } else {
      setCategoryForm({ name: '', parent_category: '' });
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

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-colors duration-200 ${
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

      {/* Sidebar Navigation */}
      <aside className={`w-[290px] flex-shrink-0 flex flex-col border-r transition-all duration-200 ${
        theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200'
      }`}>
        <div className={`p-6 border-b flex items-center gap-3.5 ${theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-100'}`}>
          <div className="flex items-center gap-3">
            <svg width="34" height="34" viewBox="0 0 60 60" fill="none">
              <defs>
                <linearGradient id="logoG" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <rect x="5" y="15" width="50" height="12" rx="6" fill="url(#logoG)" />
              <rect x="18" y="32" width="10" height="20" rx="5" fill="#10b981" />
              <rect x="32" y="32" width="10" height="20" rx="5" fill="#3b82f6" />
            </svg>
            <span className={`font-black text-2xl tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Trendify</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <NavItem theme={theme} icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
          <NavItem theme={theme} icon={<Package size={20} />} label="Products" active={activePage === 'products'} onClick={() => setActivePage('products')} />
          <NavItem theme={theme} icon={<Folders size={20} />} label="Categories" active={activePage === 'categories'} onClick={() => setActivePage('categories')} />
          <NavItem theme={theme} icon={<ShoppingCart size={20} />} label="Orders" active={activePage === 'orders'} onClick={() => setActivePage('orders')} />
          <NavItem theme={theme} icon={<Users size={20} />} label="Customers" active={activePage === 'customers'} onClick={() => setActivePage('customers')} />
          <NavItem theme={theme} icon={<Ticket size={20} />} label="Coupons" active={activePage === 'coupons'} onClick={() => setActivePage('coupons')} />
          <NavItem theme={theme} icon={<Star size={20} />} label="Reviews" active={activePage === 'reviews'} onClick={() => setActivePage('reviews')} />
          <NavItem theme={theme} icon={<BarChart3 size={20} />} label="Analytics" active={activePage === 'analytics'} onClick={() => setActivePage('analytics')} />
          <NavItem theme={theme} icon={<Megaphone size={20} />} label="Marketing" active={activePage === 'marketing'} onClick={() => setActivePage('marketing')} />
          <NavItem theme={theme} icon={<Landmark size={20} />} label="Withdrawals" active={activePage === 'withdrawals'} onClick={() => setActivePage('withdrawals')} />
          <NavItem theme={theme} icon={<Settings size={20} />} label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
          <NavItem theme={theme} icon={<UserCheck size={20} />} label="Users" active={activePage === 'users'} onClick={() => setActivePage('users')} />
          <NavItem theme={theme} icon={<ClipboardList size={20} />} label="Reports" active={activePage === 'reports'} onClick={() => setActivePage('reports')} />

          <a href="http://localhost:8000/admin" target="_blank" rel="noopener noreferrer" className="block pt-4 mt-4 border-t border-dashed border-zinc-200 dark:border-[#2a3145]">
            <NavItem theme={theme} icon={<Database size={20} />} label="Django DB Admin ↗" active={false} onClick={() => {}} />
          </a>
        </nav>

        {/* Sidebar Promo Card - High Fidelity custom-coded guy mockup card (Compact Version) */}
        <div className="px-4 py-2 select-none">
          <div className="relative overflow-hidden rounded-[1.85rem] bg-gradient-to-br from-[#783cf5] via-[#8c4bf6] to-[#a35cf7] p-4.5 text-white w-full aspect-[1/0.92] min-h-[195px] shrink-0 flex flex-col justify-between shadow-[0_12px_24px_-5px_rgba(120,60,245,0.22)] select-none">
            
            {/* Ambient background glows */}
            <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-white/10 blur-[40px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[30px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col justify-start h-full max-w-[50%] text-white py-0.5">
              {/* Cursive italic "Summer" */}
              <span className="font-serif italic text-white/95 text-[19px] font-medium tracking-wide leading-none mb-0.5">Summer</span>
              {/* Bold uppercase "SALE" */}
              <span className="text-[36px] font-black tracking-tighter text-white uppercase leading-[0.85] -mt-0.5">SALE</span>
              
              {/* UP TO with flanking horizontal borders */}
              <div className="mt-2.5 flex items-center gap-1.5 select-none leading-none">
                <span className="h-[1px] w-3 bg-white/40 shrink-0" />
                <span className="text-[8.5px] font-extrabold uppercase text-white/80 tracking-widest leading-none">UP TO</span>
                <span className="h-[1px] w-3 bg-white/40 shrink-0" />
              </div>

              {/* 50% OFF block */}
              <div className="flex flex-col items-start leading-none mt-0.5">
                <span className="text-[46px] font-black text-white leading-none tracking-tighter">50%</span>
                <span className="text-[9.5px] font-extrabold uppercase text-white/90 tracking-widest mt-0.5">OFF</span>
              </div>

              {/* Shop Now Action Button */}
              <button
                onClick={() => window.open('/', '_blank')}
                className="mt-4 self-start bg-white text-[#5c23d4] px-4.5 py-2.5 rounded-full text-[10px] font-black tracking-wide shadow-md transition-all hover:scale-105 active:scale-95 duration-200 shrink-0 cursor-pointer"
              >
                Shop Now
              </button>
              
              {/* Tiny premium brand stamp */}
              <span className="text-[8.5px] text-white/30 font-serif italic mt-3 select-none">vdgfashion</span>
            </div>

            {/* Absolute product model cutout (curly hair guy in colorful shirt) */}
            <div className="absolute bottom-0 right-[-8px] h-[98%] w-[54%] pointer-events-none">
              <div className="relative h-full w-full">
                <img 
                  src="/products/promo_model.png" 
                  alt="Promo Model" 
                  className="object-contain object-bottom h-full w-full scale-[1.08] translate-y-[2px]" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info profile cockpit */}
        <div className={`p-5 border-t flex items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${
          theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-200'
        }`} onClick={onLogout}>
          <div className="flex items-center gap-3 min-w-0 text-left">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-zinc-250/30 shadow-3xs relative shrink-0">
              <img src="/products/promo_model.png" className="w-full h-full object-cover object-top" alt="Admin Profile Picture" />
            </div>
            <div className="min-w-0">
              <p className={`font-bold text-[17px] truncate ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>Admin User</p>
              <p className="text-[14px] text-zinc-400 truncate">admin@trendify.com</p>
            </div>
          </div>
          <ChevronRight size={17} className="text-zinc-400" />
        </div>
      </aside>

      {/* Main viewport */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header bar */}
        <header className={`px-6 py-4 flex items-center justify-between flex-shrink-0 border-b ${
          theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200'
        }`}>
          <div className="relative w-full max-w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for products, categories..."
              className={`w-full rounded-2xl pl-10 pr-12 py-2.5 text-sm focus:outline-none focus:border-indigo-500 border ${
                theme === 'dark' 
                  ? 'bg-[#161b26] border-[#2a3145] text-white placeholder-zinc-500' 
                  : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'
              }`}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-1.5 py-0.5 rounded border border-zinc-300 dark:border-[#2a3145] text-zinc-400">⌘K</span>
          </div>

          <div className="flex items-center gap-3.5">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="relative cursor-pointer">
              <Bell size={18} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 text-white font-extrabold text-[7px] flex items-center justify-center shadow-md">5</span>
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-[#cbd5e1]/10">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-250/30 shadow-3xs relative shrink-0">
                <img src="/products/promo_model.png" className="w-full h-full object-cover object-top" alt="Admin Badge Picture" />
              </div>
              <div className="hidden sm:block text-left leading-none">
                <p className={`font-bold text-[11px] ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Admin User</p>
                <p className="text-[9px] text-zinc-500 font-semibold mt-0.5">Super Admin</p>
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
                  value="₹24,780" 
                  growth="+12.5%" 
                  icon={<ShoppingBag className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-pink-600 text-white dark:bg-pink-500 shadow-pink-500/10" 
                  label="Total Orders" 
                  value={orders.length > 0 ? orders.length : "1,248"} 
                  growth="+8.3%" 
                  icon={<ShoppingCart className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-blue-600 text-white dark:bg-blue-500 shadow-blue-500/10" 
                  label="Total Customers" 
                  value="2,856" 
                  growth="+15.2%" 
                  icon={<Users className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-orange-500 text-white dark:bg-orange-600 shadow-orange-500/10" 
                  label="Products" 
                  value={products.length > 0 ? products.length : "342"} 
                  growth="+6.4%" 
                  icon={<Package className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-teal-600 text-white dark:bg-teal-500 shadow-teal-500/10" 
                  label="Revenue" 
                  value="₹18,340" 
                  growth="+10.1%" 
                  icon={<Wallet className="h-5.5 w-5.5" />} 
                />
                <GridStat 
                  theme={theme}
                  color="bg-indigo-600 text-white dark:bg-indigo-500 shadow-indigo-500/10" 
                  label="Coupons Used" 
                  value="128" 
                  growth="+4.7%" 
                  icon={<Ticket className="h-5.5 w-5.5" />} 
                />
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
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#8b5cf6" strokeWidth="4.2" strokeDasharray="35 65" strokeDashoffset="25" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#3b82f6" strokeWidth="4.2" strokeDasharray="25 75" strokeDashoffset="90" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#10b981" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="65" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#f59e0b" strokeWidth="4.2" strokeDasharray="15 85" strokeDashoffset="50" />
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#ec4899" strokeWidth="4.2" strokeDasharray="10 90" strokeDashoffset="35" />
                      </svg>
                    </div>
                    <div className="flex-grow space-y-3.5 text-left flex flex-col justify-center">
                      <CategoryLegendRow dotColor="bg-purple-500" label="T-Shirts" pct="35%" val="₹8,673" />
                      <CategoryLegendRow dotColor="bg-blue-500" label="Hoodies" pct="25%" val="₹6,195" />
                      <CategoryLegendRow dotColor="bg-emerald-500" label="Jeans" pct="15%" val="₹3,711" />
                      <CategoryLegendRow dotColor="bg-amber-500" label="Shoes" pct="15%" val="₹3,711" />
                      <CategoryLegendRow dotColor="bg-pink-500" label="Bags" pct="10%" val="₹2,476" />
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
                  <div className="space-y-3 pt-0.5">
                    <OrderRow theme={theme} id="#ORD-1452" date="May 18, 2024" amount="₹89.99" status="Completed" name="Sarah W." gradient="from-pink-400 to-rose-500" initials="SW" />
                    <OrderRow theme={theme} id="#ORD-1451" date="May 18, 2024" amount="₹129.50" status="Processing" name="Deepak V." gradient="from-blue-400 to-indigo-500" initials="DV" />
                    <OrderRow theme={theme} id="#ORD-1450" date="May 17, 2024" amount="₹79.00" status="Pending" name="Arjun M." gradient="from-amber-400 to-orange-500" initials="AM" />
                    <OrderRow theme={theme} id="#ORD-1449" date="May 17, 2024" amount="₹149.99" status="Completed" name="Kavita R." gradient="from-purple-400 to-indigo-500" initials="KR" />
                    <OrderRow theme={theme} id="#ORD-1448" date="May 16, 2024" amount="₹59.99" status="Processing" name="Priya S." gradient="from-teal-400 to-emerald-500" initials="PS" />
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
                  <table className="w-full text-left text-sm font-semibold">
                    <thead className="text-zinc-400 font-black uppercase tracking-wider border-b border-zinc-100 dark:border-[#2a3145] pb-2.5 text-[12px]">
                      <tr>
                        <th className="pb-3">Product</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3 text-center">Sold</th>
                        <th className="pb-3 text-right">Revenue</th>
                        <th className="pb-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-[#2a3145]/60 text-zinc-700 dark:text-zinc-300">
                      <TopProductRow theme={theme} name="Urban Oversized T-Shirt" category="T-Shirts" sold="320" rev="₹6,368" icon="👕" />
                      <TopProductRow theme={theme} name="Comfort Fit Hoodie" category="Hoodies" sold="280" rev="₹5,588" icon="🧥" />
                      <TopProductRow theme={theme} name="Slim Fit Jeans" category="Jeans" sold="250" rev="₹4,995" icon="👖" />
                      <TopProductRow theme={theme} name="Classic White Sneakers" category="Shoes" sold="210" rev="₹4,409" icon="👟" />
                      <TopProductRow theme={theme} name="Everyday Backpack" category="Bags" sold="180" rev="₹3,420" icon="🎒" />
                    </tbody>
                  </table>
                </div>

                {/* Customer Growth Bar Chart Card */}
                <div className={`p-5 rounded-3xl border transition-all ${
                  theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Customer Growth</h3>
                    <select className={`text-[10px] font-bold p-1 bg-transparent border rounded-lg outline-none cursor-pointer ${
                      theme === 'dark' ? 'border-[#2a3145] text-zinc-350' : 'border-zinc-200 text-zinc-750'
                    }`}>
                      <option>This Month</option>
                    </select>
                  </div>
                  
                  <div className="flex gap-3 h-44 mt-3.5 select-none">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[8.5px] text-zinc-400 font-bold h-[82%] pb-1 w-6 text-left leading-none">
                      <span>1.5K</span>
                      <span>1.2K</span>
                      <span>900</span>
                      <span>600</span>
                      <span>0</span>
                    </div>
                    {/* Columns grid area */}
                    <div className="flex-grow h-full flex items-end justify-between gap-1 sm:gap-1.5 relative">
                      {[38, 48, 42, 55, 40, 58, 62, 52, 60, 65, 82, 78, 92, 85, 98, 102].map((val, idx) => (
                        <div key={idx} className="flex-grow flex flex-col items-center gap-1 group h-full justify-end">
                          <div 
                            className="w-full rounded-t bg-[#8b5cf6] dark:bg-[#a855f7] hover:bg-[#ff007a] transition-all cursor-pointer shadow-3xs" 
                            style={{ height: `${(val / 110) * 82}%` }} 
                            title={`Customers: ${Math.round(val * 15)}`}
                          />
                        </div>
                      ))}
                      
                      <div className="flex justify-between text-[8px] text-zinc-400 font-bold absolute bottom-0 left-0 right-0">
                        <span>May 1</span><span>May 6</span><span>May 11</span><span>May 16</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean elegant dashboard footer */}
              <footer className={`pt-6 border-t flex items-center justify-between text-[10px] text-zinc-400 font-bold ${
                theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-200'
              }`}>
                <span>© 2026 Trendify Admin. All rights reserved.</span>
                <span>Made with ❤️ by Trendify</span>
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

              <div className={`border rounded-2xl overflow-hidden ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full text-left text-sm">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
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
                          {p.image && <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#2a3145]" />}
                          <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{p.name}</span>
                        </td>
                        <td className="p-4 font-semibold text-zinc-400">{p.category_name || 'Unassigned'}</td>
                        <td className={`p-4 font-bold text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{p.price}</td>
                        <td className="p-4 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            p.stock === 0 ? 'bg-red-950/40 text-red-400' : p.stock < 15 ? 'bg-amber-950/40 text-amber-400' : 'bg-green-950/40 text-green-400'
                          }`}>{p.stock} units</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleOpenProductModal('edit', p)} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"><Edit size={12} /></button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 cursor-pointer"><Trash2 size={12} /></button>
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
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Category Registry</h3>
                <button 
                  onClick={() => handleOpenCategoryModal('add')}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus size={14} /> Add Category
                </button>
              </div>

              <div className={`border rounded-2xl overflow-hidden ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full text-left text-sm">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="p-4.5">Category Name</th>
                      <th className="p-4.5">Parent Level</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                    {categories.map((c) => (
                      <tr key={c.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-2.5">
                          {c.image_url && <img src={c.image_url} alt={c.name} className="w-8 h-8 rounded-lg object-cover border border-[#2a3145]" />}
                          <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{c.name}</span>
                        </td>
                        <td className="p-4 font-semibold text-zinc-400">{c.parent_category || 'Root'}</td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleOpenCategoryModal('edit', c)} className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"><Edit size={12} /></button>
                            <button onClick={() => handleDeleteCategory(c.id)} className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-400 cursor-pointer"><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'orders' && (
            <div className="space-y-4 text-left">
              <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Customer Checkout Orders</h3>

              <div className={`border rounded-2xl overflow-hidden ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full text-left text-xs">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4 text-right">Total Price</th>
                      <th className="p-4 text-center">Checkout Date</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                    {orders.map((o) => (
                      <tr key={o.order_id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold text-indigo-400">{o.order_id}</td>
                        <td className={`p-4 font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{o.customer_name}</td>
                        <td className="p-4 uppercase text-zinc-500 font-bold">{o.payment_method}</td>
                        <td className={`p-4 font-extrabold text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{o.total_amount}</td>
                        <td className="p-4 text-center text-zinc-500 font-semibold">
                          {new Date(o.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activePage === 'analytics' && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Inventory Stock Management</h3>
                  <p className="text-[10px] text-zinc-500 font-semibold mt-1">Real-time tracking of item stocks, supply states, and automatic refills.</p>
                </div>
                <button 
                  onClick={() => window.print()}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ClipboardList size={14} /> Export Stock Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Package className="text-indigo-400" />} label="Registry Products" value={products.length} desc="Active SKU variants" theme={theme} />
                <StatCard icon={<ArrowUpRight className="text-green-400" />} label="Total Stock Units" value={products.reduce((acc, p) => acc + (p.stock || 0), 0)} desc="Items in warehouse" theme={theme} />
                <StatCard icon={<AlertCircle className="text-red-400" />} label="Low Stock Alerts" value={products.filter(p => (p.stock || 0) < 15).length} desc="SKUs below 15 units" theme={theme} />
              </div>

              <div className={`border rounded-2xl overflow-hidden ${theme === 'dark' ? 'border-[#2a3145] bg-[#10141c]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full text-left text-xs">
                  <thead className={`font-bold uppercase tracking-wider border-b ${theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-zinc-500'}`}>
                    <tr>
                      <th className="p-4">SKU / Item</th>
                      <th className="p-4">Category</th>
                      <th className="p-4 text-right">Current Stock</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#2a3145]' : 'divide-zinc-200'}`}>
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-bold flex items-center gap-2.5">
                          {p.image && <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover border border-[#2a3145]" />}
                          <div>
                            <p className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{p.name}</p>
                            <p className="text-[10px] text-zinc-500">PROD-00{p.id}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-zinc-400">{p.category_name || 'Unassigned'}</td>
                        <td className={`p-4 font-extrabold text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{p.stock} units</td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                            p.stock === 0 ? 'bg-red-950/40 text-red-400' : p.stock < 15 ? 'bg-amber-950/40 text-amber-400' : 'bg-green-950/40 text-green-400'
                          }`}>{p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'Good Stock'}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
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
                            className="py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg text-[9px] transition-colors cursor-pointer border border-[#2a3145]"
                          >
                            Refill to 100
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activePage === 'settings' && (
            <div className="space-y-6 text-left">
              <div>
                <h3 className={`font-black text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>System Settings</h3>
                <p className="text-[10px] text-zinc-500 font-semibold mt-1">Manage global preferences, configurations, and core database maintenance.</p>
              </div>

              <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#10141c] border-[#2a3145]' : 'bg-white border-zinc-200'}`}>
                <h4 className="text-sm font-black text-red-500 mb-2">Danger Zone</h4>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">Wipe your database clean by deleting all catalog products, categories, active checkout orders, and banners in one click.</p>
                
                <button 
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
        </div>
      </main>


      {/* Floating CRUD Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full ${modalType === 'product' ? 'max-w-[780px]' : 'max-w-[500px]'} max-h-[90vh] overflow-y-auto rounded-3xl border p-6 shadow-2xl space-y-4 text-left custom-scrollbar transition-all duration-200 ${
            theme === 'dark' ? 'bg-[#10141c] border-[#2a3145] text-white shadow-black/85' : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50'
          }`}>
            <div className={`flex justify-between items-center pb-2 border-b ${theme === 'dark' ? 'border-[#2a3145]' : 'border-zinc-200'}`}>
              <h3 className="text-base font-black uppercase tracking-wider">
                {modalMode === 'edit' ? 'Edit' : 'Create New'} {modalType === 'product' ? 'Product' : modalType}
              </h3>
              <button onClick={() => setModalType(null)} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`}><X size={16} /></button>
            </div>

            {modalType === 'product' && (
              <form onSubmit={handleSaveProduct} className="space-y-6 text-xs font-semibold">
                
                {/* 1. Featured Image & Gallery Section */}
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold">1. Media Assets</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Image Path / URL</label>
                      <input 
                        type="text" 
                        value={productForm.image} 
                        onChange={(e) => setProductForm({ ...productForm, image: e.target.value })} 
                        placeholder="e.g., products/baby_frock.png"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Upload Local File</label>
                      <div className="relative flex items-center justify-center">
                        <label className={`w-full flex flex-col items-center justify-center p-3 h-[46px] rounded-xl border border-dashed cursor-pointer transition-all ${
                          theme === 'dark' 
                            ? 'bg-[#161b26] border-[#2a3145] hover:bg-[#202736] text-zinc-300' 
                            : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-600'
                        }`}>
                          <div className="flex items-center gap-2">
                            <Upload size={14} className={uploadingImage ? "animate-spin" : "animate-bounce"} />
                            <span className="text-[10px] font-bold">
                              {uploadingImage ? 'Uploading...' : productForm.image ? '✅ File Linked' : 'Choose Local File'}
                            </span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Color Selection (Hex)</label>
                      <div className="flex gap-2">
                        <input 
                          type="color" 
                          value={productForm.color_hex} 
                          onChange={(e) => setProductForm({ ...productForm, color_hex: e.target.value })} 
                          className={`w-12 h-10 p-1 rounded-xl border cursor-pointer ${
                            theme === 'dark' ? 'bg-[#161b26] border-[#2a3145]' : 'bg-white border-zinc-200'
                          }`}
                        />
                        <input 
                          type="text" 
                          value={productForm.color_hex} 
                          onChange={(e) => setProductForm({ ...productForm, color_hex: e.target.value })} 
                          placeholder="#ffffff"
                          className={`flex-1 p-3 rounded-xl border transition-all focus:outline-none ${
                            theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Group & Categories Section */}
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold">2. Group & Classification</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Group (Parent Category)</label>
                      <input 
                        type="text" 
                        value={productForm.parent_category} 
                        onChange={(e) => setProductForm({ ...productForm, parent_category: e.target.value })} 
                        placeholder="e.g., Boys Clothing"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Category</label>
                      <select 
                        value={productForm.category} 
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      >
                        <option value="">Select Category...</option>
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Tag Type</label>
                      <select 
                        value={productForm.tag_type} 
                        onChange={(e) => setProductForm({ ...productForm, tag_type: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
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
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold">3. Product Details</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Product Name*</label>
                      <input 
                        type="text" 
                        required 
                        value={productForm.name} 
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Unit*</label>
                      <input 
                        type="text" 
                        required 
                        value={productForm.unit} 
                        onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} 
                        placeholder="e.g., pc, pack, box"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Slug (Automatic / Custom)</label>
                      <input 
                        type="text" 
                        value={productForm.slug} 
                        onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })} 
                        placeholder="Auto-generated if left blank"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Discount Label</label>
                      <input 
                        type="text" 
                        value={productForm.discount} 
                        onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })} 
                        placeholder="e.g., -25% OFF" 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Description*</label>
                    <textarea 
                      required
                      value={productForm.description} 
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} 
                      className={`w-full p-3 h-20 rounded-xl border transition-all focus:outline-none resize-none ${
                        theme === 'dark' ? 'bg-[#161b26] text-white border-[#2a3145] focus:border-indigo-500' : 'bg-white text-zinc-800 border-zinc-200 focus:border-indigo-500'
                      }`}
                    />
                  </div>
                </div>

                {/* 4. Product Type & Dimensions */}
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold">4. Product Configuration & Dimensions</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Product Type</label>
                      <select 
                        value={productForm.product_type} 
                        onChange={(e) => setProductForm({ ...productForm, product_type: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      >
                        <option value="simple">Simple Product</option>
                        <option value="variable">Variable Product</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Width (cm)</label>
                      <input 
                        type="number" 
                        value={productForm.width} 
                        onChange={(e) => setProductForm({ ...productForm, width: e.target.value })} 
                        placeholder="0.0"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Height (cm)</label>
                      <input 
                        type="number" 
                        value={productForm.height} 
                        onChange={(e) => setProductForm({ ...productForm, height: e.target.value })} 
                        placeholder="0.0"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Length (cm)</label>
                      <input 
                        type="number" 
                        value={productForm.length} 
                        onChange={(e) => setProductForm({ ...productForm, length: e.target.value })} 
                        placeholder="0.0"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Simple Product Information (Pricing & Stock) */}
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold">5. Pricing & Inventory</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Price (INR)*</label>
                      <input 
                        type="number" 
                        required 
                        value={productForm.price} 
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Sale Price (Original)</label>
                      <input 
                        type="number" 
                        value={productForm.original_price} 
                        onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Quantity (Stock)*</label>
                      <input 
                        type="number" 
                        required 
                        value={productForm.stock} 
                        onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} 
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>SKU*</label>
                      <input 
                        type="text" 
                        required 
                        value={productForm.sku} 
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })} 
                        placeholder="e.g., TS-GRN-001"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                          theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Status Selection */}
                <div className={`p-4 rounded-2xl border space-y-3 transition-colors ${
                  theme === 'dark' ? 'bg-[#161b26]/50 border-[#2a3145]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <h4 className="text-[11px] uppercase tracking-wider text-indigo-500 font-bold">6. Publishing Control</h4>
                  <div className="flex gap-6 items-center">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="status"
                        value="published"
                        checked={productForm.status === 'published'}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                        className="w-4 h-4 text-indigo-600 bg-transparent border-zinc-300 dark:border-[#2a3145]"
                      />
                      <span>Published (Live on Website)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="radio" 
                        name="status"
                        value="draft"
                        checked={productForm.status === 'draft'}
                        onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                        className="w-4 h-4 text-indigo-600 bg-transparent border-zinc-300 dark:border-[#2a3145]"
                      />
                      <span>Draft (Offline Sandbox)</span>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setModalType(null)} className="py-3 px-6 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer shadow-lg shadow-indigo-500/20 font-bold uppercase tracking-wider">Save Changes</button>
                </div>
              </form>
            )}

            {modalType === 'category' && (
              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-semibold">
                <div className="space-y-1">
                  <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Category Name</label>
                  <input 
                    type="text" 
                    required 
                    value={categoryForm.name} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} 
                    className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                      theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Parent Category</label>
                  <input 
                    type="text" 
                    value={categoryForm.parent_category} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, parent_category: e.target.value })} 
                    className={`w-full p-3 rounded-xl border transition-all focus:outline-none ${
                      theme === 'dark' ? 'bg-[#161b26] border-[#2a3145] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500'
                    }`}
                  />
                </div>
                <div className="flex gap-3 justify-end pt-2">
                  <button type="button" onClick={() => setModalType(null)} className="py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer">Save Category</button>
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

function GridStat({ color, label, value, growth, icon, theme }) {
  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 ease-out transform hover:scale-[1.04] text-left shadow-2xs hover:shadow-lg ${
      theme === 'dark' 
        ? 'bg-[#10141c] border-[#2a3145] text-white hover:shadow-purple-500/5' 
        : 'bg-white border-zinc-200 text-[#0f172a] hover:shadow-zinc-300/30'
    }`}>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm ${color} mb-4 shadow-md transition-transform duration-300 hover:rotate-6`}>
        {icon}
      </div>
      <p className="text-[14.5px] font-black text-zinc-400 uppercase tracking-widest leading-none mb-2">{label}</p>
      <h4 className={`text-[30px] font-black leading-none mb-2.5 ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{value}</h4>
      <div className="flex items-center gap-1.5 leading-none">
        <span className="text-emerald-500 text-[13.5px] font-black">{growth}</span>
        <span className="text-[12px] text-zinc-400 font-semibold">vs last week</span>
      </div>
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
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-900/30';
      case 'Processing':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/30';
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30';
      default:
        return 'bg-zinc-50 text-zinc-700 border-zinc-200 dark:bg-zinc-950/40 dark:text-zinc-400 dark:border-zinc-900/30';
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
        <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-black uppercase tracking-wider ${getBadgeStyle()}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function TopProductRow({ name, category, sold, rev, icon, theme }) {
  return (
    <tr className={`transition-colors border-b last:border-b-0 ${
      theme === 'dark' 
        ? 'hover:bg-white/2 border-[#2a3145]/60' 
        : 'hover:bg-zinc-50/50 border-zinc-150'
    }`}>
      <td className="py-3.5 font-bold flex items-center gap-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shadow-3xs ${
          theme === 'dark' ? 'bg-[#161b26] text-white' : 'bg-zinc-100 text-zinc-800'
        }`}>
          {icon}
        </span>
        <span className={`text-[15.5px] ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{name}</span>
      </td>
      <td className="py-3.5 font-semibold text-zinc-400 text-[14.5px]">{category}</td>
      <td className={`py-3.5 text-center font-bold text-[15.5px] ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{sold}</td>
      <td className={`py-3.5 text-right font-extrabold text-[16px] ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>{rev}</td>
      <td className="py-3.5 text-center">
        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30">Active</span>
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
