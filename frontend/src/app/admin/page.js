'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Lock, Mail, Loader2, AlertCircle, Eye, EyeOff,
  LayoutDashboard, Package, Folders, ShoppingCart, Users,
  Ticket, Star, BarChart3, Megaphone, Landmark, Settings,
  UserCheck, ClipboardList, Search, Bell, Moon, Sun, ChevronRight, ChevronDown,
  ArrowUpRight, RefreshCcw, CheckCircle, Database, Trash2, Edit, Plus, Upload, X,
  ShoppingBag, Wallet, Menu, LogOut, Filter,
  Clock, Truck, MapPin, XCircle, Heart, Percent
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { API_BASE, mediaUrl } from '../../lib/api';

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

  // Auth navigation states
  const [authStep, setAuthStep] = useState('login'); // 'login' | 'otp' | 'forgot' | 'reset'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdminProfile = async (token) => {
    const activeToken = token || sessionStorage.getItem('access_token');
    if (!activeToken) return;
    try {
      const res = await fetch(`${API_BASE}/api/auth/profile/`, {
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
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (res.ok) {
        if (data.otp_required) {
          setAuthStep('otp');
          setSuccessMessage(data.message || 'OTP verification code has been sent.');
        } else {
          sessionStorage.setItem('vdgfashion_admin_authenticated', 'true');
          sessionStorage.setItem('access_token', data.access);
          sessionStorage.setItem('refresh_token', data.refresh);
          setIsLoggedIn(true);
          fetchAdminProfile(data.access);
        }
      } else {
        setError(data.detail || 'Invalid credentials.');
      }
    } catch (err) {
      setError('Connection failed. Make sure your Django backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-login-otp/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, otp })
      });

      const data = await res.json();

      if (res.ok) {
        sessionStorage.setItem('vdgfashion_admin_authenticated', 'true');
        sessionStorage.setItem('access_token', data.access);
        sessionStorage.setItem('refresh_token', data.refresh);
        setIsLoggedIn(true);
        fetchAdminProfile(data.access);
      } else {
        setError(data.detail || 'Invalid or expired OTP.');
      }
    } catch (err) {
      setError('Connection failed. Make sure your Django backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });

      const data = await res.json();

      if (res.ok) {
        setAuthStep('reset');
        setSuccessMessage(data.message || 'Verification code sent.');
      } else {
        setError(data.detail || 'Failed to submit forgot password request.');
      }
    } catch (err) {
      setError('Connection failed. Make sure your Django backend is running!');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp: otp, new_password: newPassword })
      });

      const data = await res.json();

      if (res.ok) {
        setAuthStep('login');
        setOtp('');
        setPassword('');
        setNewPassword('');
        setSuccessMessage(data.message || 'Password reset successful. You can now login.');
      } else {
        setError(data.detail || 'Invalid OTP code or password requirements.');
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
              <h2 className="text-3xl font-normal tracking-tight text-[#0f172a]">vdgfashion</h2>
              <h3 className="text-[17px] font-normal text-zinc-700">Admin Control Panel</h3>
              {authStep === 'login' && <p className="text-[11px] text-zinc-400 font-normal tracking-wide">Sign in to access custom dashboard</p>}
              {authStep === 'otp' && <p className="text-[11px] text-zinc-400 font-normal tracking-wide">Enter verification code to continue</p>}
              {authStep === 'forgot' && <p className="text-[11px] text-zinc-400 font-normal tracking-wide">Recover your password account credentials</p>}
              {authStep === 'reset' && <p className="text-[11px] text-zinc-400 font-normal tracking-wide">Enter new password parameters</p>}
            </div>
          </div>

          {error && (
            <div className="bg-red-50/70 border border-red-200 rounded-2xl p-3 flex items-start gap-2 text-red-500 text-xs animate-fade-in">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span className="font-normal">{error}</span>
            </div>
          )}
          {successMessage && (
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2 text-emerald-600 text-xs animate-fade-in">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span className="font-normal">{successMessage}</span>
            </div>
          )}

          {authStep === 'login' && (
            <form onSubmit={handleLogin} autoComplete="off" className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  autoComplete="off"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-normal text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
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
                  autoComplete="new-password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-normal text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer flex items-center justify-center"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => { setAuthStep('forgot'); setError(''); setSuccessMessage(''); }}
                  className="text-xs text-indigo-600 hover:text-indigo-850 hover:underline font-semibold cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-sm font-normal rounded-full shadow-lg shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Sign In</span>}
              </button>
            </form>
          )}

          {authStep === 'otp' && (
            <form onSubmit={handleVerifyOTP} autoComplete="off" className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="6-Digit OTP Code"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-normal text-zinc-800 placeholder-zinc-400 tracking-widest text-center focus:outline-none transition-all shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-sm font-normal rounded-full shadow-lg shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Verify OTP</span>}
              </button>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthStep('login'); setOtp(''); setError(''); setSuccessMessage(''); }}
                  className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {authStep === 'forgot' && (
            <form onSubmit={handleForgotPassword} autoComplete="off" className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Registered Email Address"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-normal text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-sm font-normal rounded-full shadow-lg shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Send Reset OTP</span>}
              </button>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthStep('login'); setResetEmail(''); setError(''); setSuccessMessage(''); }}
                  className="text-xs text-indigo-650 hover:underline font-semibold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {authStep === 'reset' && (
            <form onSubmit={handleResetPassword} autoComplete="off" className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400 font-semibold px-1">Email Address</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={resetEmail}
                  className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-[13px] font-normal text-zinc-450 focus:outline-none cursor-not-allowed opacity-85"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="6-Digit Reset OTP"
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-normal text-zinc-800 placeholder-zinc-400 tracking-widest text-center focus:outline-none transition-all shadow-2xs"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-500 pointer-events-none opacity-85" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter New Password"
                  className="w-full pl-12 pr-12 py-3.5 bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 rounded-2xl text-[13px] font-normal text-zinc-800 placeholder-zinc-400 focus:outline-none transition-all shadow-2xs"
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
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:opacity-95 text-white text-sm font-normal rounded-full shadow-lg shadow-indigo-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span>Reset Password</span>}
              </button>
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={() => { setAuthStep('login'); setOtp(''); setNewPassword(''); setResetEmail(''); setError(''); setSuccessMessage(''); }}
                  className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          <p className="text-[10px] text-center text-zinc-400 font-normal pt-4">
            © 2026 vdgfashion Admin. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  return <DashboardPortal onLogout={handleLogout} adminUser={adminUser} />;
}

const getPaginatedRange = (currentPage, totalPages) => {
  const maxVisible = 22;
  if (totalPages <= maxVisible) {
    return [...Array(totalPages)].map((_, i) => i + 1);
  }
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > totalPages) {
    end = totalPages;
    start = end - maxVisible + 1;
  }
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

function DashboardPortal({ onLogout, adminUser }) {
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [activePage, setActivePage] = useState('dashboard');
  const [productPage, setProductPage] = useState(1);

  // Offers management state
  const [offersSearchQuery, setOffersSearchQuery] = useState('');
  const [selectedProductForOffer, setSelectedProductForOffer] = useState(null);
  const [offerDiscountStr, setOfferDiscountStr] = useState('');
  const [offerPromoPrice, setOfferPromoPrice] = useState('');
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerModalMode, setOfferModalMode] = useState('add');
  const [analyticsPage, setAnalyticsPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState('light');
  const [toasts, setToasts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handlePageChange = (page) => {
    setActivePage(page);
    setIsSidebarOpen(false);
  };

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [banners, setBanners] = useState([]);
  const [mobileBanners, setMobileBanners] = useState([]);
  const [marketingBanners, setMarketingBanners] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [userPage, setUserPage] = useState(1);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Inventory state variables
  const [inventoryPage, setInventoryPage] = useState(1);
  const [inventorySearchQuery, setInventorySearchQuery] = useState('');
  const [inventoryStatusFilter, setInventoryStatusFilter] = useState('all');
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all');
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
  const [showWipeOtpModal, setShowWipeOtpModal] = useState(false);
  const [wipeOtp, setWipeOtp] = useState('');
  const [settingsForm, setSettingsForm] = useState({
    contactPhone: '',
    contactEmail: '',
    storeAddress: '',
    aboutText: '',
    freeShippingThreshold: 3000,
    shippingFee: 99,
    activePromoCode: 'TREND10',
    activePromoDiscount: 10,
    isStoreOpen: true,
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: ''
  });

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        contactPhone: settings.contactPhone || '',
        contactEmail: settings.contactEmail || '',
        storeAddress: settings.storeAddress || '',
        aboutText: settings.aboutText || '',
        freeShippingThreshold: settings.freeShippingThreshold !== undefined ? settings.freeShippingThreshold : 3000,
        shippingFee: settings.shippingFee !== undefined ? settings.shippingFee : 99,
        activePromoCode: settings.activePromoCode || 'TREND10',
        activePromoDiscount: settings.activePromoDiscount !== undefined ? settings.activePromoDiscount : 10,
        isStoreOpen: settings.isStoreOpen !== undefined ? settings.isStoreOpen : true,
        facebookUrl: settings.facebookUrl || '',
        instagramUrl: settings.instagramUrl || '',
        youtubeUrl: settings.youtubeUrl || ''
      });
    }
  }, [settings]);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${API_BASE}/api/settings/upload-logo/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
        },
        body: formData,
      });

      if (res.ok) {
        const updatedSettings = await res.json();
        saveStoreSettings(updatedSettings);
        showToast('Logo uploaded successfully', 'success');
      } else {
        throw new Error('Failed to upload logo');
      }
    } catch (err) {
      showToast('Failed to upload logo', 'error');
      console.error(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    saveStoreSettings(settingsForm);
    showToast('Store settings saved successfully', 'success');
  };

  // Analytics states
  const [analyticsChartMetric, setAnalyticsChartMetric] = useState('revenue');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState('week');
  const [customerGrowthTimeframe, setCustomerGrowthTimeframe] = useState('month');

  // Dynamic analytics calculation
  const analyticsData = useMemo(() => {
    const dataPoints = [];

    if (analyticsTimeframe === 'year') {
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        dataPoints.push({
          dateStr: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
          month: d.getMonth(),
          year: d.getFullYear(),
          ordersCount: 0,
          revenue: 0
        });
      }
      orders.forEach(o => {
        if (!o.created_at) return;
        const oDate = new Date(o.created_at);
        const matchMonth = dataPoints.find(dp => dp.month === oDate.getMonth() && dp.year === oDate.getFullYear());
        if (matchMonth) {
          matchMonth.ordersCount += 1;
          matchMonth.revenue += parseFloat(o.total_amount || 0);
        }
      });
    } else {
      let daysCount = analyticsTimeframe === 'month' ? 30 : 7;
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dataPoints.push({
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
        const matchDay = dataPoints.find(d => d.dateKey === oDateKey);
        if (matchDay) {
          matchDay.ordersCount += 1;
          matchDay.revenue += parseFloat(o.total_amount || 0);
        }
      });
    }
    return dataPoints;
  }, [orders, analyticsTimeframe]);

  const maxChartVal = useMemo(() => {
    const vals = analyticsData.map(d => analyticsChartMetric === 'revenue' ? d.revenue : d.ordersCount);
    const max = Math.max(...vals);
    return max === 0 ? 10 : max;
  }, [analyticsData, analyticsChartMetric]);

  const points = useMemo(() => {
    return analyticsData.map((d, i) => {
      const val = analyticsChartMetric === 'revenue' ? d.revenue : d.ordersCount;
      const x = 40 + (i / Math.max(1, analyticsData.length - 1)) * 420;
      const y = 160 - (val / maxChartVal) * 120;
      return { x, y, val, date: d.dateStr };
    });
  }, [analyticsData, analyticsChartMetric, maxChartVal]);

  const pathD = useMemo(() => {
    return points.length > 0
      ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
      : '';
  }, [points]);

  const areaD = useMemo(() => {
    return points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`
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
    return categories.filter(c => c.type === 'main_category');
  }, [categories]);

  const mainCategories = useMemo(() => {
    return categories.filter(c => c.type === 'category');
  }, [categories]);

  const subCategories = useMemo(() => {
    return categories.filter(c => c.type === 'sub_category');
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

  // Dynamic Category Sales Share calculated from active orders and products
  const categoryShares = useMemo(() => {
    if (orders.length === 0 || products.length === 0) return [];

    const catRevenue = {};
    let totalRevenue = 0;

    orders.forEach(o => {
      (o.items || []).forEach(item => {
        const pid = item.product_id || item.product;
        const product = products.find(p => p.id === pid);
        if (product) {
          const cat = product.category || 'Uncategorized';
          const price = parseFloat(item.price || product.price || 0);
          const qty = parseInt(item.quantity || 1);
          const rev = price * qty;

          catRevenue[cat] = (catRevenue[cat] || 0) + rev;
          totalRevenue += rev;
        }
      });
    });

    if (totalRevenue === 0) return [];

    return Object.entries(catRevenue)
      .map(([name, rev]) => {
        const percentage = Math.round((rev / totalRevenue) * 100);
        return { name, count: rev, percentage };
      })
      .sort((a, b) => b.count - a.count);
  }, [orders, products]);

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
        category: p.main_category || 'Uncategorized',
        sold: soldMap[p.id] || 0,
        rev: `₹${((soldMap[p.id] || 0) * parseFloat(p.price || 0)).toLocaleString('en-IN')}`,
        image: p.image
      }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);
  }, [products, orders]);

  // Customer Growth Data from real orders only
  const customerGrowthData = useMemo(() => {
    const data = [];
    const now = new Date();

    if (customerGrowthTimeframe === 'year') {
      const ordersByMonth = {};
      orders.forEach(o => {
        if (o.created_at) {
          const d = new Date(o.created_at);
          const monthStr = `${d.getFullYear()}-${d.getMonth()}`;
          ordersByMonth[monthStr] = (ordersByMonth[monthStr] || 0) + 1;
        }
      });

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(now.getMonth() - i);
        const monthStr = `${d.getFullYear()}-${d.getMonth()}`;
        const count = ordersByMonth[monthStr] || 0;
        data.push({
          label: d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          value: count,
          realOrders: count
        });
      }
    } else {
      const ordersByDate = {};
      orders.forEach(o => {
        if (o.created_at) {
          const dateStr = new Date(o.created_at).toISOString().split('T')[0];
          ordersByDate[dateStr] = (ordersByDate[dateStr] || 0) + 1;
        }
      });

      let daysCount = customerGrowthTimeframe === 'month' ? 30 : 7;
      for (let i = daysCount - 1; i >= 0; i--) {
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
    }
    return data;
  }, [orders, customerGrowthTimeframe]);

  const maxCustomerGrowthVal = useMemo(() => {
    const max = Math.max(...customerGrowthData.map(d => d.value));
    return max === 0 ? 10 : max;
  }, [customerGrowthData]);

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

  // Success Popup state
  const [successPopup, setSuccessPopup] = useState({ show: false, title: '', message: '' });

  const showSuccessPopup = (title, message) => {
    setSuccessPopup({ show: true, title, message });
  };

  const closeSuccessPopup = () => {
    setSuccessPopup({ show: false, title: '', message: '' });
  };

  // Delete Popup state
  const [deletePopup, setDeletePopup] = useState({ show: false, title: 'Deleted!', message: 'The item has been deleted successfully.' });

  const showDeletePopup = (title = 'Deleted!', message = 'The item has been deleted successfully.') => {
    setDeletePopup({ show: true, title, message });
  };

  const closeDeletePopup = () => {
    setDeletePopup({ show: false, title: 'Deleted!', message: 'The item has been deleted successfully.' });
  };

  // Forms inputs
  const [productForm, setProductForm] = useState({
    name: '', slug: '', unit: 'pc', sku: '', price: '', original_price: '',
    discount: '', tag_type: 'new', description: '', color_hex: '#e6fcf5',
    cart_btn_color: 'bg-teal-500 hover:bg-teal-600', stock: 50,
    width: '', height: '', length: '', product_type: 'simple', status: 'published',
    category: '', parent_category: 'New Born (0-3 Months)', sub_category: '', image: '',
    razorpay_buy_now_link: '',
    sizes: 'S, M, L, XL'
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '', parent_category: '', image: '', imagePreview: '', is_active: true
  });

  const [bannerForm, setBannerForm] = useState({
    title: '', subtitle: '', alt: '', link: '', order: 0
  });

  const [marketingBannerForm, setMarketingBannerForm] = useState({
    title: '', description: '', bg: 'bg-teal-50', buttonText: 'SHOP NOW', categoryRef: '', image: '', imagePreview: '', order: 0
  });

  const [uploadingMarketingBannerImage, setUploadingMarketingBannerImage] = useState(false);

  const [bulkInput, setBulkInput] = useState('');
  const [bulkImages, setBulkImages] = useState({}); // { index: { file, path, preview } }
  const [uploadingBulkImages, setUploadingBulkImages] = useState({});

  const handleBulkImageUpload = async (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBulkImages(prev => ({ ...prev, [index]: true }));
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/products/upload-image/`, {
        method: 'POST', body: formData, headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBulkImages(prev => ({ ...prev, [index]: { path: data.path, url: data.url, name: file.name } }));
        showToast(`Image ${index + 1} uploaded!`, 'success');
      } else {
        showToast('Image upload failed', 'warning');
      }
    } catch { showToast('Network error uploading image', 'warning'); }
    finally { setUploadingBulkImages(prev => ({ ...prev, [index]: false })); }
  };
  const [bulkMode, setBulkMode] = useState('file'); // 'file' or 'paste'
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadProgressInfo, setUploadProgressInfo] = useState('');

  const showToast = (message, type = 'info') => {
    const newToast = { id: Date.now(), message, type };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const getImageUrl = (urlOrPath) => {
    if (!urlOrPath) return null;
    if (urlOrPath.startsWith('http://') || urlOrPath.startsWith('https://')) {
      let imgUrl = urlOrPath;
      // Google Drive URL helper
      if (imgUrl.includes('drive.google.com')) {
        const driveMatch = imgUrl.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/) ||
          imgUrl.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
        if (driveMatch) {
          const fileId = driveMatch[1];
          imgUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }
      // Dropbox URL helper
      else if (imgUrl.includes('dropbox.com')) {
        if (imgUrl.includes('dl=0')) {
          imgUrl = imgUrl.replace('dl=0', 'raw=1');
        } else if (!imgUrl.includes('dl=1') && !imgUrl.includes('raw=1')) {
          imgUrl = imgUrl + (imgUrl.includes('?') ? '&' : '?') + 'raw=1';
        }
      }
      return imgUrl;
    }
    if (urlOrPath.startsWith('/media/')) {
      return `${API_BASE}${urlOrPath}`;
    }
    // Bare path like 'products/xx.png' or 'categories/xx.png'
    return `${API_BASE}/media/${urlOrPath}`;
  };

  const syncData = useCallback(async () => {
    setLoadingData(true);
    try {
      const token = sessionStorage.getItem('access_token');
      const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

      const prodRes = await fetch(`${API_BASE}/api/products/`);
      if (prodRes.ok) setProducts(await prodRes.json());
      const orderRes = await fetch(`${API_BASE}/api/orders/`, { headers: authHeader });
      if (orderRes.ok) setOrders(await orderRes.json());
      const catRes = await fetch(`${API_BASE}/api/categories/`);
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData);
        const rootCats = catData.filter(c => !c.main_category);
        if (rootCats.length > 0) {
          setSelectedAdminCategory(prev => prev || rootCats[0].name);
        }
      }
      const banRes = await fetch(`${API_BASE}/api/hero-banners/`, { cache: 'no-store' });
      if (banRes.ok) setBanners(await banRes.json());
      const mobBanRes = await fetch(`${API_BASE}/api/mobile-banners/`, { cache: 'no-store' });
      if (mobBanRes.ok) setMobileBanners(await mobBanRes.json());
      const marketBanRes = await fetch(`${API_BASE}/api/marketing-banners/`);
      if (marketBanRes.ok) setMarketingBanners(await marketBanRes.json());
      const revRes = await fetch(`${API_BASE}/api/reviews/`);
      if (revRes.ok) setReviews(await revRes.json());
      const usersRes = await fetch(`${API_BASE}/api/auth/users/`, { headers: authHeader });
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

  // Offers Actions
  const handleRemoveOffer = async (product) => {
    if (!confirm(`Are you sure you want to remove the offer from "${product.name}"?`)) return;

    setLoadingData(true);
    try {
      const original = product.original_price || product.price;
      const payload = {
        price: parseFloat(original),
        original_price: parseFloat(original),
        discount: "",
        tag_type: ""
      };

      const token = sessionStorage.getItem('access_token');
      const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/api/products/${product.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast('Offer removed successfully', 'success');
        syncData();
      } else {
        showToast('Failed to remove offer.', 'warning');
      }
    } catch (e) {
      showToast('Error removing offer.', 'warning');
    } finally {
      setLoadingData(false);
    }
  };

  const handleSaveOffer = async (e) => {
    if (e) e.preventDefault();
    if (!selectedProductForOffer) return;

    const promoPriceNum = parseFloat(offerPromoPrice);
    const originalPriceNum = parseFloat(selectedProductForOffer.original_price || selectedProductForOffer.price);

    if (isNaN(promoPriceNum) || promoPriceNum <= 0) {
      showToast('Please enter a valid promotional price.', 'warning');
      return;
    }

    const isSpecialOffer = offerDiscountStr && (
      offerDiscountStr.toUpperCase().includes('BUY 1 GET 1') ||
      offerDiscountStr.toUpperCase().includes('BOGO') ||
      offerDiscountStr.toUpperCase().includes('B1G1') ||
      offerDiscountStr.toUpperCase().includes('BUY 5 GET 2') ||
      offerDiscountStr.toUpperCase().includes('B5G2')
    );

    if (promoPriceNum >= originalPriceNum && !isSpecialOffer) {
      if (!confirm(`Warning: The promotional price (₹${promoPriceNum}) is higher than or equal to the original price (₹${originalPriceNum}). Do you still want to proceed?`)) {
        return;
      }
    }

    setLoadingData(true);
    try {
      const payload = {
        price: promoPriceNum,
        original_price: originalPriceNum,
        discount: offerDiscountStr || "DISCOUNT",
        tag_type: "discount"
      };

      const token = sessionStorage.getItem('access_token');
      const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/api/products/${selectedProductForOffer.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(offerModalMode === 'edit' ? 'Offer updated successfully' : 'Offer added successfully', 'success');
        setIsOfferModalOpen(false);
        setSelectedProductForOffer(null);
        syncData();
      } else {
        showToast('Failed to save offer details.', 'warning');
      }
    } catch (e) {
      showToast('Network error saving offer details.', 'warning');
    } finally {
      setLoadingData(false);
    }
  };

  // CRUD Handlers
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const url = modalMode === 'edit'
      ? `${API_BASE}/api/products/${selectedItem.id}/`
      : `${API_BASE}/api/products/`;
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

      let finalCatId = parseInt(productForm.main_category) || null;
      let finalParentCat = productForm.category || '';
      let finalSubCat = productForm.sub_category || '';

      const payload = {
        name: productForm.name,
        slug: productForm.slug || null,
        unit: productForm.unit || 'pc',
        sku: productForm.sku || null,
        category: finalCatId,
        parent_category: finalParentCat,
        sub_category: finalSubCat,
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
        razorpay_buy_now_link: productForm.razorpay_buy_now_link || null,
        sizes: productForm.sizes ? productForm.sizes.split(',').map(s => s.trim()).filter(Boolean) : [],
        ...(imagePath ? { image: imagePath } : {})
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Product updated successfully' : 'Product created successfully', 'success');
        showSuccessPopup(
          modalMode === 'edit' ? 'Product Updated!' : 'Product Added!',
          modalMode === 'edit'
            ? `"${productForm.name}" has been updated successfully.`
            : `"${productForm.name}" has been added to your store.`
        );
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
      ? `${API_BASE}/api/auth/users/${selectedItem.id}/`
      : `${API_BASE}/api/auth/register/`;
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

      const token = sessionStorage.getItem('access_token');
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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
      const token = sessionStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/auth/users/${id}/`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        showToast('User deleted successfully', 'success');
        showDeletePopup('User Deleted!', 'The user has been deleted successfully.');
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
      const token = sessionStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/auth/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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
      const token = sessionStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/auth/users/${user.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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
      const res = await fetch(`${API_BASE}/api/products/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        showToast('Product deleted successfully', 'success');
        showDeletePopup('Product Deleted!', 'The product has been removed from your store.');
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
    if (modalType === 'category' && !categoryForm.image) {
      showToast('Please upload a category image first!', 'warning');
      return;
    }
    let endpoint = 'categories';
    if (modalType === 'maincategory') endpoint = 'main-categories';
    if (modalType === 'subcategory') endpoint = 'sub-categories';

    const url = modalMode === 'edit'
      ? `${API_BASE}/api/${endpoint}/${selectedItem.id}/`
      : `${API_BASE}/api/${endpoint}/`;
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
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Category updated successfully' : 'Category created successfully', 'success');
        showSuccessPopup(
          modalMode === 'edit' ? 'Category Updated!' : 'Category Added!',
          modalMode === 'edit'
            ? `"${categoryForm.name}" has been updated successfully.`
            : `"${categoryForm.name}" has been added to your store.`
        );
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

  const handleDeleteCategory = async (item) => {
    if (!confirm('Are you sure you want to delete this category?')) return;
    try {
      let endpoint = 'categories';
      if (item.type === 'main_category') endpoint = 'main-categories';
      if (item.type === 'sub_category') endpoint = 'sub-categories';
      const res = await fetch(`${API_BASE}/api/${endpoint}/${item.id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        showToast('Category deleted successfully', 'success');
        showDeletePopup('Category Deleted!', 'The category has been removed from your store.');
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
      const res = await fetch(`${API_BASE}/api/reviews/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        showToast('Review deleted successfully', 'success');
        showDeletePopup('Review Deleted!', 'The review has been removed successfully.');
        syncData();
      } else {
        showToast('Failed to delete review', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting review', 'warning');
    }
  };

  const parseTSV = (text) => {
    let separator = ',';
    const firstLineEnd = text.indexOf('\n');
    const firstLine = firstLineEnd !== -1 ? text.slice(0, firstLineEnd) : text;
    if (firstLine.includes('\t')) separator = '\t';
    else if (firstLine.includes(';')) separator = ';';

    const parseCSV = (str) => {
      const result = [];
      let row = [];
      let col = '';
      let insideQuote = false;
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const nextChar = str[i + 1];
        if (char === '"') {
          if (insideQuote && nextChar === '"') {
            col += '"';
            i++;
          } else {
            insideQuote = !insideQuote;
          }
        } else if (char === separator && !insideQuote) {
          row.push(col);
          col = '';
        } else if ((char === '\n' || (char === '\r' && nextChar === '\n')) && !insideQuote) {
          row.push(col);
          result.push(row);
          row = [];
          col = '';
          if (char === '\r') i++;
        } else {
          if (char !== '\r' || insideQuote) col += char;
        }
      }
      if (col || row.length) {
        row.push(col);
        result.push(row);
      }
      return result;
    };

    const parsedRows = parseCSV(text.trim());
    if (parsedRows.length < 2) return [];

    const headers = parsedRows[0].map(h => h.trim().toLowerCase().replace(/^"|"$/g, ''));
    
    // Find column indices
    const nameIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('name') || norm.includes('title');
    });

    if (nameIdx === -1) {
      throw new Error("Could not find a column for 'Name' or 'Title' in the header row. Please make sure you included/copied the header row (first line containing headers like: product_name, code, category).");
    }

    const skuIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('sku') || norm.includes('code');
    });
    const catIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return (norm.includes('cat') || norm.includes('group')) && !norm.includes('age') && !norm.includes('sub') && !norm.includes('main') && !norm.includes('parent');
    });
    const priceIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('price') && !norm.includes('original') && !norm.includes('mrp') && !norm.includes('budget') && !norm.includes('link') && !norm.includes('razorpay');
    });
    const origPriceIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('original') || norm.includes('mrp') || norm.includes('budget') || norm.includes('origprice');
    });
    const stockIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('stock') || norm.includes('qty') || norm.includes('quantity') || norm.includes('count');
    });
    const imgIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return (norm.includes('image') || norm.includes('url') || norm.includes('link') || norm.includes('drive') || norm.includes('photo') || norm.includes('img') || norm.includes('pic')) && !norm.includes('2') && !norm.includes('3');
    });
    const img2Idx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('image2') || norm.includes('img2') || norm.includes('photo2') || norm.includes('url2') || norm.includes('link2');
    });
    const img3Idx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('image3') || norm.includes('img3') || norm.includes('photo3') || norm.includes('url3') || norm.includes('link3');
    });
    const descIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('desc') || norm.includes('about') || norm.includes('info');
    });
    const razorpayIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('razorpay') || norm.includes('buynow') || norm.includes('payment') || norm.includes('paylink') || norm.includes('buylink');
    });
    const ageGroupIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return (norm.includes('agegroup') || norm.includes('age')) && !norm.includes('image') && !norm.includes('img');
    });
    const sizeIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('size');
    });
    const mainCatIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('maincategory') || norm.includes('maincat') || norm.includes('parentcategory') || norm.includes('parentcat');
    });
    const subCatIdx = headers.findIndex(h => {
      const norm = h.replace(/[^a-z0-9]/g, '');
      return norm.includes('subcategory') || norm.includes('subcat');
    });

    const parsed = [];
    for (let i = 1; i < parsedRows.length; i++) {
      const cols = parsedRows[i];
      if (cols.length < 1) continue;

      const item = {};
      if (nameIdx !== -1 && cols[nameIdx]) item.name = cols[nameIdx].trim().replace(/^"|"$/g, '');
      if (skuIdx !== -1 && cols[skuIdx]) item.sku = cols[skuIdx].trim().replace(/^"|"$/g, '');
      if (catIdx !== -1 && cols[catIdx]) item.category = cols[catIdx].trim().replace(/^"|"$/g, '');
      if (priceIdx !== -1 && cols[priceIdx]) item.price = parseFloat(cols[priceIdx].trim().replace(/[^0-9.]/g, '')) || 0;
      if (origPriceIdx !== -1 && cols[origPriceIdx]) item.original_price = parseFloat(cols[origPriceIdx].trim().replace(/[^0-9.]/g, '')) || 0;
      if (stockIdx !== -1 && cols[stockIdx]) item.stock = parseInt(cols[stockIdx].trim().replace(/[^0-9]/g, '')) || 0;
      if (imgIdx !== -1 && cols[imgIdx]) item.image = cols[imgIdx].trim().replace(/^"|"$/g, '');
      if (img2Idx !== -1 && cols[img2Idx]) item.image_2 = cols[img2Idx].trim().replace(/^"|"$/g, '');
      if (img3Idx !== -1 && cols[img3Idx]) item.image_3 = cols[img3Idx].trim().replace(/^"|"$/g, '');
      if (descIdx !== -1 && cols[descIdx]) item.description = cols[descIdx].trim().replace(/^"|"$/g, '');
      if (razorpayIdx !== -1 && cols[razorpayIdx]) item.razorpay_buy_now_link = cols[razorpayIdx].trim().replace(/^"|"$/g, '');
      if (ageGroupIdx !== -1 && cols[ageGroupIdx]) {
        const val = cols[ageGroupIdx].trim().replace(/^"|"$/g, '');
        item.age_group = val;
        item.category = val;
      }
      if (sizeIdx !== -1 && cols[sizeIdx]) item.size = cols[sizeIdx].trim().replace(/^"|"$/g, '');
      if (mainCatIdx !== -1 && cols[mainCatIdx] && !item.main_category) item.main_category = cols[mainCatIdx].trim().replace(/^"|"$/g, '');
      if (subCatIdx !== -1 && cols[subCatIdx]) item.sub_category = cols[subCatIdx].trim().replace(/^"|"$/g, '');

      // Fill defaults
      if (!item.name) continue; // Skip items without a name
      if (item.original_price === undefined || isNaN(item.original_price)) item.original_price = 0;
      if (item.price === undefined || isNaN(item.price) || item.price === 0) item.price = item.original_price;
      if (item.original_price === 0) item.original_price = item.price;
      if (!item.main_category) item.main_category = 'General';
      if (item.stock === undefined || isNaN(item.stock)) item.stock = 50;

      parsed.push(item);
    }
    return parsed;
  };

  const fileInputRef = useRef(null);
  const uploadCancelledRef = useRef(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setBulkInput(event.target.result);
      showToast(`Loaded file: ${file.name}`, 'success');
    };
    reader.readAsText(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setBulkInput(event.target.result);
        showToast(`Loaded file: ${file.name}`, 'success');
      };
      reader.readAsText(file);
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setLoadingData(true);
    uploadCancelledRef.current = false;
    try {
      let parsedData;
      if (bulkMode === 'file' || bulkMode === 'paste') {
        parsedData = parseTSV(bulkInput);
        if (parsedData.length === 0) {
          throw new Error('No valid products parsed. Make sure to copy columns including a header row.');
        }
      } else {
        parsedData = JSON.parse(bulkInput);
      }

      const total = parsedData.length;
      let createdCount = 0;
      let failedCount = 0;
      let errors = [];

      setUploadProgress(0);
      setUploadProgressInfo(`Uploading ${total} products...`);

      if (!uploadCancelledRef.current) {
        try {
          const token = sessionStorage.getItem('access_token');
          const res = await fetch(`${API_BASE}/api/products/bulk-upload/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            },
            body: JSON.stringify(parsedData)
          });
          const result = await res.json();
          if (res.ok && result.success) {
            createdCount = result.created_count;
            failedCount = result.failed_count;
            if (result.errors && result.errors.length > 0) {
              errors.push(...result.errors);
            }
          } else {
            failedCount = total;
            errors.push({ error: result.error || 'Import failed' });
          }
        } catch (err) {
          failedCount = total;
          errors.push({ error: err.message });
        }
      }

      setUploadProgress(100);

      if (uploadCancelledRef.current) {
        showToast(`Bulk Upload Cancelled. Created ${createdCount} products.`, 'warning');
        setModalType(null);
        setBulkInput('');
        syncData();
      } else if (createdCount > 0 && failedCount === 0) {
        showToast(`Bulk Upload Successful! Created ${createdCount} products.`, 'success');
        setModalType(null);
        setBulkInput('');
        syncData();
      } else if (createdCount > 0) {
        showToast(`Import completed. Created: ${createdCount}, Failed: ${failedCount}`, 'warning');
        setModalType(null);
        setBulkInput('');
        syncData();
      } else {
        const errorDetail = errors.length > 0 ? JSON.stringify(errors[0].errors || errors[0].error) : 'Unknown error';
        showToast(`All imports failed. Reason: ${errorDetail}`, 'warning');
      }
    } catch (err) {
      showToast(err.message || 'Invalid structure. Please check input formatting.', 'warning');
    } finally {
      setLoadingData(false);
      setUploadProgress(null);
      setUploadProgressInfo('');
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [inlineStockEdit, setInlineStockEdit] = useState({}); // { productId: tempValue }
  const [orderSearch, setOrderSearch] = useState('');

  const handleInlineStockSave = async (productId, newStock) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${productId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
        body: JSON.stringify({ stock: parseInt(newStock) })
      });
      if (res.ok) {
        showToast('Stock updated!', 'success');
        setInlineStockEdit(prev => { const n = { ...prev }; delete n[productId]; return n; });
        syncData();
      }
    } catch { showToast('Failed to update stock', 'warning'); }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const token = sessionStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
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
      const token = sessionStorage.getItem('access_token');
      const res = await fetch(`${API_BASE}/api/orders/${id}/`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      if (res.ok) {
        showToast('Order deleted successfully', 'success');
        showDeletePopup('Order Deleted!', 'The order has been removed from the system.');
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
      const res = await fetch(`${API_BASE}/api/products/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
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
  const [uploadingBannerSlot, setUploadingBannerSlot] = useState(null);
  const [uploadingMobileBannerSlot, setUploadingMobileBannerSlot] = useState(null);
  const [bannerTypeTab, setBannerTypeTab] = useState('desktop');
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to revert this banner to default?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/hero-banners/${bannerId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        showToast('Banner reverted to default.', 'success');
        syncData();
      } else {
        showToast('Failed to delete banner.', 'warning');
      }
    } catch (err) {
      showToast('Network error.', 'warning');
    }
  };

  const handleHeroBannerUpload = async (e, slotOrder) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingBannerSlot(slotOrder);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/hero-banners/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const existingBanner = banners.find(b => b.order === slotOrder);
        const payload = {
          title: `Index Banner ${slotOrder}`,
          subtitle: '',
          image: data.path,
          order: slotOrder,
          alt: `Banner Slot ${slotOrder}`,
          is_default: false,
          is_active: true
        };
        const method = existingBanner ? 'PATCH' : 'POST';
        const url = existingBanner
          ? `${API_BASE}/api/hero-banners/${existingBanner.id}/`
          : `${API_BASE}/api/hero-banners/`;

        const saveRes = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (saveRes.ok) {
          showToast(`Banner slot ${slotOrder} updated!`, 'success');
          syncData();
        } else {
          showToast('Failed to save banner slot.', 'warning');
        }
      } else {
        showToast(data.error || 'Failed to upload image.', 'warning');
      }
    } catch (err) {
      showToast('Network error during image upload.', 'warning');
    } finally {
      setUploadingBannerSlot(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteMobileBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to revert this mobile banner to default?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/mobile-banners/${bannerId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        showToast('Mobile banner reverted to default.', 'success');
        syncData();
      } else {
        showToast('Failed to delete mobile banner.', 'warning');
      }
    } catch (err) {
      showToast('Network error.', 'warning');
    }
  };

  const handleMobileBannerUpload = async (e, slotOrder) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingMobileBannerSlot(slotOrder);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/mobile-banners/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const existingBanner = mobileBanners.find(b => b.order === slotOrder);
        const payload = {
          title: `Mobile Banner ${slotOrder}`,
          subtitle: '',
          image: data.path,
          order: slotOrder,
          alt: `Mobile Banner Slot ${slotOrder}`,
          is_default: false,
          is_active: true
        };
        const method = existingBanner ? 'PATCH' : 'POST';
        const url = existingBanner
          ? `${API_BASE}/api/mobile-banners/${existingBanner.id}/`
          : `${API_BASE}/api/mobile-banners/`;

        const saveRes = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (saveRes.ok) {
          showToast(`Mobile banner slot ${slotOrder} updated!`, 'success');
          syncData();
        } else {
          showToast('Failed to save mobile banner slot.', 'warning');
        }
      } else {
        showToast(data.error || 'Failed to upload image.', 'warning');
      }
    } catch (err) {
      showToast('Network error during image upload.', 'warning');
    } finally {
      setUploadingMobileBannerSlot(null);
      if (e.target) e.target.value = '';
    }
  };

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingCategoryImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/categories/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
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

  const handleMarketingBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingMarketingBannerImage(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/api/marketing-banners/upload-image/`, {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMarketingBannerForm((prev) => ({ ...prev, image: data.path, imagePreview: data.url }));
        showToast('Marketing banner image uploaded!', 'success');
      } else {
        showToast(data.error || 'Failed to upload image.', 'warning');
      }
    } catch (err) {
      showToast('Network error during image upload.', 'warning');
    } finally {
      setUploadingMarketingBannerImage(false);
    }
  };

  const handleOpenMarketingBannerModal = (mode, item = null) => {
    setModalType('marketing-banner');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setMarketingBannerForm({
        title: item.title || '',
        description: item.description || '',
        bg: item.bg || 'bg-teal-50',
        buttonText: item.buttonText || 'SHOP NOW',
        categoryRef: item.categoryRef || '',
        image: item.image || '',
        imagePreview: item.img || '',
        order: item.order || 0
      });
    } else {
      setMarketingBannerForm({
        title: '',
        description: '',
        bg: 'bg-teal-50',
        buttonText: 'SHOP NOW',
        categoryRef: '',
        image: '',
        imagePreview: '',
        order: 0
      });
    }
  };

  const handleSaveMarketingBanner = async (e) => {
    e.preventDefault();
    const url = modalMode === 'edit'
      ? `${API_BASE}/api/marketing-banners/${selectedItem.id}/`
      : `${API_BASE}/api/marketing-banners/`;
    const method = modalMode === 'edit' ? 'PATCH' : 'POST';

    let imagePath = marketingBannerForm.image || null;
    if (imagePath && (imagePath.startsWith('http://') || imagePath.startsWith('https://'))) {
      const mediaIdx = imagePath.indexOf('/media/');
      if (mediaIdx !== -1) {
        imagePath = imagePath.substring(mediaIdx + 7);
      } else {
        imagePath = null;
      }
    }

    const payload = {
      title: marketingBannerForm.title,
      description: marketingBannerForm.description,
      bg: marketingBannerForm.bg,
      buttonText: marketingBannerForm.buttonText,
      categoryRef: marketingBannerForm.categoryRef,
      order: parseInt(marketingBannerForm.order || 0),
      is_active: true,
      ...(imagePath ? { image: imagePath } : {})
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(modalMode === 'edit' ? 'Marketing banner updated successfully' : 'Marketing banner created successfully', 'success');
        showSuccessPopup(
          modalMode === 'edit' ? 'Banner Updated!' : 'Banner Added!',
          modalMode === 'edit'
            ? `"${marketingBannerForm.title}" has been updated.`
            : `"${marketingBannerForm.title}" has been created.`
        );
        setModalType(null);
        syncData();
      } else {
        try {
          const errData = await res.json();
          const errMessage = Object.entries(errData)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
            .join(' | ');
          showToast(`Error: ${errMessage || 'Error saving banner.'}`, 'warning');
        } catch (e) {
          showToast('Error saving banner.', 'warning');
        }
      }
    } catch (err) {
      showToast('Network error saving marketing banner', 'warning');
    }
  };

  const handleDeleteMarketingBanner = async (id) => {
    if (!confirm('Are you sure you want to delete this marketing banner?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/marketing-banners/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      if (res.ok) {
        showToast('Marketing banner deleted successfully', 'success');
        showDeletePopup('Banner Deleted!', 'The marketing banner has been deleted successfully.');
        syncData();
      } else {
        showToast('Failed to delete marketing banner', 'warning');
      }
    } catch (err) {
      showToast('Network error deleting banner', 'warning');
    }
  };

  const handleOpenProductModal = (mode, item = null) => {
    setModalType('product');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      // Find category ID from category field (could be id or name)
      let formCatId = '';
      let formSubCatName = '';

      const catObj = categories.find(c => String(c.id) === String(item.category));
      if (catObj) {
        if (catObj.parent_category) {
          // This is a subcategory
          formSubCatName = catObj.name;
          const parentCatObj = categories.find(c => c.name === catObj.parent_category && !c.main_category);
          formCatId = parentCatObj ? parentCatObj.id : '';
        } else {
          // This is a root category
          formCatId = catObj.id;
          formSubCatName = '';
        }
      } else {
        // Fallback
        formCatId = item.category || '';
        formSubCatName = item.category || '';
      }

      setProductForm({
        name: item.name || '',
        slug: item.slug || '',
        unit: item.unit || 'pc',
        sku: item.sku || '',
        category: formCatId,
        parent_category: formSubCatName,
        sub_category: item.sub_category || '',
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
        image: item.image || '',
        razorpay_buy_now_link: item.razorpay_buy_now_link || '',
        sizes: item.sizes ? item.sizes.join(', ') : 'S, M, L, XL'
      });
    } else {
      setProductForm({
        name: '', slug: '', unit: 'pc', sku: '', category: rootCategories[0]?.id || '', parent_category: '', sub_category: '',
        price: '', original_price: '', discount: '', tag_type: 'new', description: '', color_hex: '#e6fcf5',
        cart_btn_color: 'bg-teal-500 hover:bg-teal-600', stock: 50,
        width: '', height: '', length: '', product_type: 'simple', status: 'published', image: '',
        razorpay_buy_now_link: '',
        sizes: 'S, M, L, XL'
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
        parent_category: item.category || '',
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
        parent_category: item.category || '',
        image: item.image || '',
        imagePreview: item.image_url || '',
        is_active: item.is_active !== undefined ? item.is_active : true
      });
    } else {
      const defaultParent = rootCategories[0]?.name || '';
      setCategoryForm({ name: '', parent_category: defaultParent, image: '', imagePreview: '', is_active: true });
    }
  };

  const handleOpenMainCategoryModal = (mode, item = null) => {
    setModalType('maincategory');
    setModalMode(mode);
    setSelectedItem(item);
    if (mode === 'edit' && item) {
      setCategoryForm({
        name: item.name || '',
        parent_category: item.category || '',
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
    const q = searchQuery.toLowerCase().trim();
    if (!q) return products;
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.main_category || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      String(p.price).includes(q) ||
      String(p.id).includes(q)
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
      (p.main_category && p.main_category.toLowerCase().includes(searchQuery.toLowerCase()))
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

  // Inventory filters and pagination
  const filteredInventoryProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Search query filter
      const matchesSearch =
        p.name.toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
        (p.sku || '').toLowerCase().includes(inventorySearchQuery.toLowerCase()) ||
        (p.main_category || '').toLowerCase().includes(inventorySearchQuery.toLowerCase());

      // 2. Status filter
      let matchesStatus = true;
      if (inventoryStatusFilter === 'outofstock') {
        matchesStatus = p.stock === 0;
      } else if (inventoryStatusFilter === 'lowstock') {
        matchesStatus = p.stock > 0 && p.stock < 15;
      } else if (inventoryStatusFilter === 'instock') {
        matchesStatus = p.stock >= 15;
      }

      // 3. Category filter
      let matchesCategory = true;
      if (inventoryCategoryFilter !== 'all') {
        matchesCategory = p.main_category === inventoryCategoryFilter;
      }

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [products, inventorySearchQuery, inventoryStatusFilter, inventoryCategoryFilter]);

  const INVENTORY_ITEMS_PER_PAGE = 10;
  const totalInventoryPages = Math.ceil(filteredInventoryProducts.length / INVENTORY_ITEMS_PER_PAGE) || 1;
  const paginatedInventoryProducts = useMemo(() => {
    const startIndex = (inventoryPage - 1) * INVENTORY_ITEMS_PER_PAGE;
    return filteredInventoryProducts.slice(startIndex, startIndex + INVENTORY_ITEMS_PER_PAGE);
  }, [filteredInventoryProducts, inventoryPage]);

  // Inventory stats derivations
  const totalInventoryVal = useMemo(() => {
    return products.reduce((acc, p) => acc + (p.stock * parseFloat(p.price || 0)), 0);
  }, [products]);

  const outOfStockCount = useMemo(() => {
    return products.filter(p => p.stock === 0).length;
  }, [products]);

  const lowStockCount = useMemo(() => {
    return products.filter(p => p.stock > 0 && p.stock < 15).length;
  }, [products]);

  const parsedBulkPreview = useMemo(() => {
    if ((bulkMode !== 'file' && bulkMode !== 'paste') || !bulkInput.trim()) return [];
    try {
      const parsed = parseTSV(bulkInput);
      return parsed.slice(0, 100);
    } catch {
      return [];
    }
  }, [bulkInput, bulkMode]);

  return (
    <div className={`flex h-screen overflow-hidden font-sans admin-portal-font-boost transition-colors duration-200 ${theme === 'dark' ? 'bg-[#080c14] text-[#e8eaf0]' : 'bg-[#f8fafc] text-[#0f172a]'
      }`}>
      {/* Side Toasts Notifications */}
      <div className="fixed top-5 right-5 z-[998] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: 360 }}>
        {toasts.map((t) => {
          const isDelete = t.message.toLowerCase().includes('deleted');
          const isWarning = t.type === 'warning';
          const isError = t.type === 'error';
          const isSuccess = !isWarning && !isError;

          // Determine colors
          const bgColor = isDelete || isError ? '#fff5f5' : isWarning ? '#fffbeb' : '#f0fdf4';
          const borderColor = isDelete || isError ? '#fecaca' : isWarning ? '#fde68a' : '#bbf7d0';
          const iconColor = isDelete || isError ? '#ef4444' : isWarning ? '#f59e0b' : '#22c55e';
          const textColor = isDelete || isError ? '#991b1b' : isWarning ? '#92400e' : '#166534';
          const subColor = isDelete || isError ? '#dc2626' : isWarning ? '#d97706' : '#16a34a';

          return (
            <div
              key={t.id}
              className="relative pointer-events-auto rounded-2xl border shadow-lg overflow-hidden"
              style={{
                background: bgColor,
                borderColor: borderColor,
                animation: 'toastSlideIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
                minWidth: 280
              }}
            >
              {/* Progress bar at top */}
              <div
                className="absolute top-0 left-0 h-[3px] rounded-t-2xl"
                style={{
                  background: iconColor,
                  width: '100%',
                  animation: 'toastProgress 5s linear both',
                  transformOrigin: 'left'
                }}
              />

              <div className="flex items-start gap-3 p-4 pt-5">
                {/* Icon */}
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: iconColor + '20' }}
                >
                  {isDelete ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  ) : isWarning ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                {/* Message text */}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-xs font-bold" style={{ color: textColor }}>
                    {isDelete ? 'Deleted Successfully' : isWarning ? 'Warning' : 'Success'}
                  </p>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: subColor }}>
                    {t.message}
                  </p>
                </div>

                {/* Close X button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer hover:scale-110"
                  style={{ color: iconColor, background: iconColor + '15' }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <line x1="1" y1="1" x2="9" y2="9" />
                    <line x1="9" y1="1" x2="1" y2="9" />
                  </svg>
                </button>
              </div>

              <style>{`
                @keyframes toastSlideIn {
                  from { opacity: 0; transform: translateX(60px) scale(0.9); }
                  to { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes toastProgress {
                  from { transform: scaleX(1); }
                  to { transform: scaleX(0); }
                }
              `}</style>
            </div>
          );
        })}
      </div>

      {/* Success Popup Modal */}
      {successPopup.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px] p-8 flex flex-col items-center gap-5 overflow-hidden"
            style={{ animation: 'successPopupIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
          >
            {/* Close X button */}
            <button
              onClick={closeSuccessPopup}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1 rounded-full hover:bg-zinc-100"
            >
              <X size={18} />
            </button>

            {/* Floating particles */}
            {[
              { top: '15%', left: '12%', size: 8, color: '#4ade80', delay: '0s' },
              { top: '20%', right: '15%', size: 6, color: '#86efac', delay: '0.1s' },
              { top: '65%', left: '8%', size: 5, color: '#bbf7d0', delay: '0.2s' },
              { top: '70%', right: '10%', size: 7, color: '#4ade80', delay: '0.15s' },
              { top: '40%', left: '5%', size: 4, color: '#86efac', delay: '0.3s' },
              { top: '35%', right: '6%', size: 5, color: '#4ade80', delay: '0.05s' },
              { top: '55%', left: '18%', size: 4, color: '#bbf7d0', delay: '0.25s' },
              { top: '50%', right: '18%', size: 6, color: '#86efac', delay: '0.18s' },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  top: p.top, left: p.left, right: p.right,
                  width: p.size, height: p.size,
                  backgroundColor: p.color,
                  animation: `successParticle 2.5s ease-in-out ${p.delay} infinite alternate`,
                  opacity: 0.7
                }}
              />
            ))}

            {/* Checkmark circle */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 110, height: 110 }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(74,222,128,0.18) 0%, rgba(74,222,128,0.04) 70%, transparent 100%)',
                  animation: 'successGlow 2s ease-in-out infinite alternate'
                }}
              />
              {/* Circle border */}
              <svg width="110" height="110" viewBox="0 0 110 110" className="absolute inset-0">
                <circle
                  cx="55" cy="55" r="48"
                  fill="none"
                  stroke="#4ade80"
                  strokeWidth="3"
                  strokeDasharray="302"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  style={{ animation: 'successCircle 0.6s ease-out 0.1s both' }}
                />
              </svg>
              {/* Green fill circle */}
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 86, height: 86,
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  boxShadow: '0 8px 32px rgba(74,222,128,0.35)',
                  animation: 'successCheckIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both'
                }}
              >
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <path
                    d="M8 20L16 28L30 11"
                    stroke="white"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ animation: 'successCheckDraw 0.4s ease-out 0.4s both', strokeDasharray: 40, strokeDashoffset: 40 }}
                  />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-zinc-900" style={{ animation: 'successFadeUp 0.5s ease-out 0.3s both', opacity: 0 }}>
                {successPopup.title}
              </h3>
              <p className="text-sm text-zinc-500 font-normal leading-relaxed" style={{ animation: 'successFadeUp 0.5s ease-out 0.4s both', opacity: 0 }}>
                {successPopup.message}
              </p>
            </div>

            {/* Got it button */}
            <button
              onClick={closeSuccessPopup}
              className="w-full py-3.5 rounded-2xl font-bold text-base text-white cursor-pointer transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                boxShadow: '0 6px 20px rgba(34,197,94,0.35)',
                animation: 'successFadeUp 0.5s ease-out 0.5s both',
                opacity: 0
              }}
            >
              Got it!
            </button>

            {/* CSS keyframes injected inline */}
            <style>{`
              @keyframes successPopupIn {
                from { opacity: 0; transform: scale(0.7) translateY(30px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes successParticle {
                0% { transform: translateY(0px) scale(1); opacity: 0.5; }
                100% { transform: translateY(-12px) scale(1.3); opacity: 1; }
              }
              @keyframes successGlow {
                from { transform: scale(0.9); opacity: 0.6; }
                to { transform: scale(1.1); opacity: 1; }
              }
              @keyframes successCircle {
                from { stroke-dashoffset: 302; opacity: 0; }
                to { stroke-dashoffset: 0; opacity: 1; }
              }
              @keyframes successCheckIn {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              @keyframes successCheckDraw {
                from { stroke-dashoffset: 40; }
                to { stroke-dashoffset: 0; }
              }
              @keyframes successFadeUp {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Delete Popup Modal */}
      {deletePopup.show && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4" style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px] p-8 flex flex-col items-center gap-5 overflow-hidden"
            style={{ animation: 'dpopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
          >
            {/* Close X button */}
            <button
              onClick={closeDeletePopup}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer p-1 rounded-full hover:bg-zinc-100"
            >
              <X size={18} />
            </button>

            {/* Floating red particles */}
            {[
              { top: '12%', left: '10%', size: 8, color: '#f87171', delay: '0s', shape: 'circle' },
              { top: '18%', right: '12%', size: 5, color: '#fca5a5', delay: '0.1s', shape: 'circle' },
              { top: '60%', left: '7%', size: 6, color: '#f87171', delay: '0.2s', shape: 'circle' },
              { top: '72%', right: '9%', size: 7, color: '#fca5a5', delay: '0.15s', shape: 'circle' },
              { top: '38%', left: '4%', size: 4, color: '#fecaca', delay: '0.3s', shape: 'square' },
              { top: '32%', right: '5%', size: 5, color: '#f87171', delay: '0.05s', shape: 'square' },
              { top: '52%', left: '17%', size: 4, color: '#fca5a5', delay: '0.25s', shape: 'circle' },
              { top: '48%', right: '16%', size: 6, color: '#f87171', delay: '0.18s', shape: 'circle' },
            ].map((p, i) => (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  top: p.top, left: p.left, right: p.right,
                  width: p.size, height: p.size,
                  backgroundColor: p.color,
                  borderRadius: p.shape === 'circle' ? '50%' : '2px',
                  animation: `dpart 2.5s ease-in-out ${p.delay} infinite alternate`,
                  opacity: 0.75
                }}
              />
            ))}

            {/* Trash icon circle */}
            <div
              className="relative flex items-center justify-center"
              style={{ width: 110, height: 110 }}
            >
              {/* Outer glow ring */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(248,113,113,0.18) 0%, rgba(248,113,113,0.04) 70%, transparent 100%)',
                  animation: 'dglow 2s ease-in-out infinite alternate'
                }}
              />
              {/* Circle border */}
              <svg width="110" height="110" viewBox="0 0 110 110" className="absolute inset-0">
                <circle
                  cx="55" cy="55" r="48"
                  fill="none"
                  stroke="#f87171"
                  strokeWidth="3"
                  strokeDasharray="302"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  style={{ animation: 'dcircle 0.6s ease-out 0.1s both' }}
                />
              </svg>
              {/* Red fill circle with trash icon */}
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: 86, height: 86,
                  background: 'linear-gradient(135deg, #f87171, #ef4444)',
                  boxShadow: '0 8px 32px rgba(239,68,68,0.35)',
                  animation: 'dcheckin 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both'
                }}
              >
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ animation: 'dfadeup 0.4s ease-out 0.4s both' }}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-zinc-900" style={{ animation: 'dfadeup 0.5s ease-out 0.35s both' }}>
                {deletePopup.title}
              </h3>
              <p className="text-sm text-zinc-500 font-normal leading-relaxed" style={{ animation: 'dfadeup 0.5s ease-out 0.45s both' }}>
                {deletePopup.message}
              </p>
            </div>

            {/* OK, Got it! button */}
            <button
              onClick={closeDeletePopup}
              className="w-full py-3.5 rounded-2xl font-bold text-base text-white cursor-pointer transition-all active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #f87171, #ef4444)',
                boxShadow: '0 6px 20px rgba(239,68,68,0.35)',
                animation: 'dfadeup 0.5s ease-out 0.55s both'
              }}
            >
              OK, Got it!
            </button>

            {/* All keyframes self-contained — no dependency on success popup */}
            <style>{`
              @keyframes dpopIn {
                from { opacity: 0; transform: scale(0.7) translateY(30px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
              @keyframes dpart {
                0% { transform: translateY(0px) scale(1); opacity: 0.5; }
                100% { transform: translateY(-12px) scale(1.3); opacity: 1; }
              }
              @keyframes dglow {
                from { transform: scale(0.9); opacity: 0.6; }
                to { transform: scale(1.15); opacity: 1; }
              }
              @keyframes dcircle {
                from { stroke-dashoffset: 302; opacity: 0; }
                to { stroke-dashoffset: 0; opacity: 1; }
              }
              @keyframes dcheckin {
                from { transform: scale(0); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              @keyframes dfadeup {
                from { opacity: 0; transform: translateY(12px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Backdrop overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[290px] lg:static lg:translate-x-0 flex-shrink-0 flex flex-col border-r transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200'
        }`}>
        <div className={`p-6 border-b flex items-center gap-3.5 ${theme === 'dark' ? 'border-[#1e293b]' : 'border-zinc-100'}`}>
          <div className="flex items-center justify-center w-full">
            <img src="/logo.png" alt="vdgfashion logo" className="h-12 object-contain" />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <NavItem theme={theme} icon={<LayoutDashboard size={20} />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => handlePageChange('dashboard')} />
          <NavItem theme={theme} icon={<Package size={20} />} label="Products" active={activePage === 'products'} onClick={() => handlePageChange('products')} />
          <NavItem theme={theme} icon={<ClipboardList size={20} />} label="Inventory" active={activePage === 'inventory'} onClick={() => handlePageChange('inventory')} />
          <NavItem theme={theme} icon={<Folders size={20} />} label="Categories" active={activePage === 'categories'} onClick={() => handlePageChange('categories')} />
          <NavItem theme={theme} icon={<ShoppingCart size={20} />} label="Orders" active={activePage === 'orders'} onClick={() => handlePageChange('orders')} />
          <NavItem theme={theme} icon={<Star size={20} />} label="Reviews" active={activePage === 'reviews'} onClick={() => handlePageChange('reviews')} />
          <NavItem theme={theme} icon={<BarChart3 size={20} />} label="Analytics" active={activePage === 'analytics'} onClick={() => handlePageChange('analytics')} />
          <NavItem theme={theme} icon={<Users size={20} />} label="Users" active={activePage === 'users'} onClick={() => handlePageChange('users')} />
          <NavItem theme={theme} icon={<Megaphone size={20} />} label="Index Banners" active={activePage === 'hero-banners'} onClick={() => handlePageChange('hero-banners')} />
          <NavItem theme={theme} icon={<Megaphone size={20} />} label="Marketing Banners" active={activePage === 'marketing-banners'} onClick={() => handlePageChange('marketing-banners')} />
          <NavItem theme={theme} icon={<Percent size={20} />} label="Offers" active={activePage === 'offers'} onClick={() => handlePageChange('offers')} />
          <NavItem theme={theme} icon={<Settings size={20} />} label="Settings" active={activePage === 'settings'} onClick={() => handlePageChange('settings')} />

          <hr className="border-dashed my-2 opacity-50 border-zinc-200 dark:border-[#1e293b]" />

          <button
            onClick={onLogout}
            className={`w-full px-5 py-4 rounded-2xl text-[18px] font-normal transition-all flex items-center gap-4 cursor-pointer select-none active:scale-98 text-rose-500 ${theme === 'dark'
                ? 'hover:bg-rose-950/15'
                : 'hover:bg-rose-50'
              }`}
          >
            <LogOut size={20} />
            <span>Log Out</span>
          </button>

        </nav>

        {/* Footer info profile cockpit */}
        <div className={`p-5 border-t flex items-center justify-between gap-3 cursor-pointer transition-colors ${theme === 'dark'
            ? 'border-[#1e293b] hover:bg-[#172033]/70'
            : 'border-zinc-200 hover:bg-zinc-50'
          }`} onClick={onLogout}>
          <div className="flex items-center gap-3 min-w-0 text-left">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] flex items-center justify-center text-white font-semibold text-sm shadow-2xs shrink-0 border border-white/10 select-none">
              {adminUser?.first_name ? adminUser.first_name[0].toUpperCase() : adminUser?.username ? adminUser.username[0].toUpperCase() : 'A'}
            </div>
            <div className="min-w-0">
              <p className={`font-semibold text-[17px] truncate ${theme === 'dark' ? 'text-slate-100' : 'text-[#0f172a]'}`}>
                {adminUser?.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim() : adminUser?.username || 'Admin User'}
              </p>
              <p className="text-[14px] text-zinc-400 dark:text-zinc-300 truncate">
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
        <header className={`px-4 sm:px-6 py-4 flex items-center justify-between flex-shrink-0 border-b gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200'
          }`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger mobile menu button */}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 rounded-xl border lg:hidden cursor-pointer transition-colors shrink-0 ${theme === 'dark'
                  ? 'bg-[#172033] border-[#1e293b] text-zinc-400 hover:text-white'
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
                className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 border ${theme === 'dark'
                    ? 'bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500'
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
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 text-white font-normal text-[7px] flex items-center justify-center shadow-md animate-pulse">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className={`absolute right-0 mt-3.5 w-80 rounded-2xl border shadow-xl z-50 p-4 max-h-[350px] overflow-y-auto text-left flex flex-col divide-y divide-zinc-100 dark:divide-[#1e293b]/60 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/60' : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50'
                    }`}>
                    <div className="pb-2 flex justify-between items-center">
                      <span className="font-normal text-[12px] uppercase tracking-wider text-indigo-500">Notifications ({notifications.length})</span>
                      <button className="text-[10px] font-normal text-zinc-400 hover:text-zinc-650" onClick={() => setShowNotifications(false)}>Close</button>
                    </div>
                    <div className="pt-2 space-y-2.5">
                      {notifications.length === 0 ? (
                        <p className="text-[11px] text-zinc-400 font-normal py-4 text-center">No active notifications.</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="text-[11px] leading-relaxed pt-2 first:pt-0">
                            <div className="flex justify-between items-start gap-1">
                              <span className="font-normal text-zinc-900 dark:text-white">{n.title}</span>
                              <span className="text-[9px] font-normal text-zinc-400 shrink-0">{n.time}</span>
                            </div>
                            <p className="text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 pl-3 border-l border-zinc-200 dark:border-[#cbd5e1]/10">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] flex items-center justify-center text-white font-bold text-xs shadow-xs shrink-0 border border-white/10 select-none">
                {adminUser?.first_name ? adminUser.first_name[0].toUpperCase() : adminUser?.username ? adminUser.username[0].toUpperCase() : 'A'}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className={`font-semibold text-xs ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                  {adminUser?.first_name ? `${adminUser.first_name} ${adminUser.last_name || ''}`.trim() : adminUser?.username || 'Admin User'}
                </p>
                <p className="text-[10px] font-semibold mt-0.5 text-zinc-500 dark:text-indigo-400">
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
                <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Dashboard</h2>
                <p className="text-xs text-zinc-500 font-normal mt-1">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
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
              <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleOpenProductModal('add')}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 cursor-pointer group ${theme === 'dark'
                      ? 'bg-[#0f1626] border-[#1e293b] hover:bg-zinc-900 hover:border-purple-500/50 text-white'
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-purple-500/50 shadow-3xs'
                    }`}
                >
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform">
                    <Plus className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-normal text-xs">Add Product</h4>
                    <p className="text-[10px] text-zinc-500 font-normal">Create new inventory item</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenCategoryModal('add')}
                  className={`p-4 rounded-2xl border transition-all text-left flex items-center space-x-3 cursor-pointer group ${theme === 'dark'
                      ? 'bg-[#0f1626] border-[#1e293b] hover:bg-zinc-900 hover:border-pink-500/50 text-white'
                      : 'bg-white border-zinc-200 hover:bg-zinc-50 hover:border-pink-500/50 shadow-3xs'
                    }`}
                >
                  <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-600 dark:text-pink-400 group-hover:scale-105 transition-transform">
                    <Folders className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-normal text-xs">Add Category</h4>
                    <p className="text-[10px] text-zinc-500 font-normal">Add category or subcategory</p>
                  </div>
                </button>

              </div>

              {/* Charts cockpit section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sales Overview Line Chart Area */}
                <div className={`p-5 rounded-3xl border transition-all flex flex-col h-full justify-between ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Sales Overview</h3>
                    <select
                      value={analyticsTimeframe}
                      onChange={(e) => setAnalyticsTimeframe(e.target.value)}
                      className={`text-[10px] font-normal p-1 bg-transparent border rounded-lg outline-none cursor-pointer ${theme === 'dark' ? 'border-[#1e293b] text-zinc-300' : 'border-zinc-200 text-zinc-700'
                        }`}>
                      <option value="week" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>This Week</option>
                      <option value="month" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>This Month</option>
                      <option value="year" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>This Year</option>
                    </select>
                  </div>

                  <div className="flex gap-4 h-64 mt-2 select-none flex-grow">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[10px] text-zinc-400 font-normal h-[88%] pb-2 select-none w-[42px] text-left leading-none">
                      {[1, 0.8, 0.6, 0.4, 0.2, 0].map(mult => (
                        <span key={mult}>₹{analyticsChartMetric === 'revenue' ? Math.round(maxChartVal * mult).toLocaleString('en-IN') : Math.round(maxChartVal * mult)}</span>
                      ))}
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
                      <svg className="w-full h-[88%] absolute inset-0" viewBox="0 0 500 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {areaD && <path d={areaD} fill="url(#chartGrad)" />}
                        {pathD && <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />}
                      </svg>

                      {/* X-axis Labels */}
                      <div className="flex justify-between text-[9px] text-zinc-400 font-normal absolute bottom-0 left-0 right-0 px-2">
                        {analyticsData.filter((_, i) => {
                          if (analyticsTimeframe === 'week') return true;
                          if (analyticsTimeframe === 'month') return i === 0 || i % 5 === 4;
                          if (analyticsTimeframe === 'year') return true;
                          return true;
                        }).map((d, i) => (
                          <span key={i}>{d.dateStr}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sales By Category Donut Area */}
                <div className={`p-5 rounded-3xl border transition-all flex flex-col h-full justify-between ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <h3 className={`font-normal text-sm mb-4 text-left ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Sales by Category</h3>
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
                        <span className="text-xs font-normal text-zinc-400 text-center">No categories recorded yet.</span>
                      ) : (
                        donutSlices.map((slice, idx) => (
                          <CategoryLegendRow
                            key={idx}
                            dotColor={slice.dot}
                            label={slice.name}
                            pct={`${slice.percentage}%`}
                            val={`₹${Math.round(slice.count).toLocaleString('en-IN')}`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Orders List panel */}
                <div className={`p-5 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Recent Orders</h3>
                    <span className="text-[10px] font-normal text-[#8b5cf6] dark:text-[#a855f7] cursor-pointer tracking-wider" onClick={() => setActivePage('orders')}>View All</span>
                  </div>
                  <div className="space-y-3 pt-0.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {orders.length === 0 ? (
                      <div className="text-center py-12 text-xs font-normal text-zinc-400">
                        No orders recorded yet.
                      </div>
                    ) : (
                      orders.slice(0, 5).map((o, idx) => {
                        const initials = o.customer_name
                          ? o.customer_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : 'C';
                        const colors = [
                          'bg-pink-500',
                          'bg-blue-500',
                          'bg-amber-500',
                          'bg-purple-500',
                          'bg-teal-500'
                        ];
                        const avatarColor = colors[idx % colors.length];
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
                            gradient={avatarColor}
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
                <div className={`lg:col-span-2 p-5 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Top Selling Products</h3>
                    <span className="text-[10px] font-normal text-[#8b5cf6] dark:text-[#a855f7] cursor-pointer tracking-wider" onClick={() => setActivePage('products')}>View All</span>
                  </div>
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[500px] text-left text-sm font-normal">
                      <thead className={`font-normal tracking-normal border-b pb-2.5 text-[12px] ${theme === 'dark' ? 'border-[#1e293b] text-zinc-400' : 'border-zinc-100 text-black'}`}>
                        <tr>
                          <th className="pb-3">Product</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3 text-center">Sold</th>
                          <th className="pb-3 text-right">Revenue</th>
                          <th className="pb-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-[#1e293b]/60 text-zinc-700 dark:text-zinc-300">
                        {topSellingProducts.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-xs font-normal text-zinc-400">
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
                <div className={`p-5 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Customer Growth</h3>
                    <select
                      value={customerGrowthTimeframe}
                      onChange={(e) => setCustomerGrowthTimeframe(e.target.value)}
                      className={`text-[10px] font-normal p-1 bg-transparent border rounded-lg outline-none cursor-pointer ${theme === 'dark' ? 'border-[#1e293b] text-zinc-400' : 'border-zinc-200 text-zinc-700'
                        }`}>
                      <option value="week" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>This Week</option>
                      <option value="month" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>This Month</option>
                      <option value="year" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>This Year</option>
                    </select>
                  </div>

                  <div className="flex gap-4 h-64 mt-4 select-none">
                    {/* Y-axis Labels */}
                    <div className="flex flex-col justify-between text-[9px] text-zinc-400 font-normal h-[88%] pb-4 w-7 text-left leading-none">
                      {[1, 0.8, 0.6, 0.4, 0.2, 0].map(mult => (
                        <span key={mult}>{Math.round(maxCustomerGrowthVal * mult)}</span>
                      ))}
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
                              style={{ height: customerGrowthData.some(d => d.value > 0) ? `${(day.value / maxCustomerGrowthVal) * 100}%` : '4px' }}
                              title={`${day.label}: ${day.value} active users (${day.realOrders} orders)`}
                            />
                          </div>
                        ))}
                      </div>

                      {/* X-axis labels row (completely separated, no overlapping!) */}
                      <div className="flex justify-between text-[9px] text-zinc-400 font-normal pt-2 px-1">
                        {customerGrowthData.filter((_, i) => {
                          const len = customerGrowthData.length;
                          if (len <= 7) return true;
                          if (len === 12) return i % 3 === 0;
                          return i === 0 || i === Math.floor(len / 3) || i === Math.floor(2 * len / 3) || i === len - 1;
                        }).map((d, i) => (
                          <span key={i}>{d.label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clean elegant dashboard footer */}
              <footer className={`pt-6 border-t flex items-center justify-between text-[10px] text-zinc-400 font-normal ${theme === 'dark' ? 'border-[#1e293b]' : 'border-zinc-200'
                }`}>
                <span>© 2026 vdgfashion Admin. All rights reserved.</span>
                <span className="flex items-center gap-0.5">Made with <Heart size={10} className="text-red-500 fill-red-500 shrink-0" /> by vdgfashion</span>
              </footer>
            </div>
          )}

          {activePage === 'products' && (
            <div className="space-y-4 text-left">
              <div className="flex justify-between items-center">
                <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Product Registry</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalType('bulk')}
                    className="py-2.5 px-4 bg-[#172033] hover:bg-[#20293a] text-white text-xs font-normal rounded-xl flex items-center gap-1.5 transition-colors border border-[#1e293b] cursor-pointer"
                  >
                    <Upload size={14} /> Bulk Upload
                  </button>
                  <button
                    onClick={() => handleOpenProductModal('add')}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-normal rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add Product
                  </button>
                </div>
              </div>

              {/* Search & Filter Panel */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full max-w-[320px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setProductPage(1); }}
                    placeholder="Search products by name, SKU, category..."
                    className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 border ${theme === 'dark'
                        ? 'bg-[#0f1626] border-[#1e293b] text-white placeholder-zinc-500'
                        : 'bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400'
                      }`}
                  />
                </div>
              </div>

              <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className={`font-normal tracking-normal border-b ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                    <tr>
                      <th className="p-4.5">Product Name</th>
                      <th className="p-4.5">Code</th>
                      <th className="p-4.5">Category</th>
                      <th className="p-4.5 text-right">Price</th>
                      <th className="p-4.5 text-right">Stock</th>
                      <th className="p-4.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                    {paginatedProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4 font-normal flex items-center gap-2.5">
                          {p.image && <img src={getImageUrl(p.image)} alt={p.name} className="w-8 h-8 rounded-lg object-contain border border-[#1e293b] bg-white p-0.5" />}
                          <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{p.name}</span>
                        </td>
                        <td className="p-4 font-mono text-xs tracking-wider text-indigo-500">
                          {p.sku || '-'}
                        </td>
                        <td className="p-4 font-normal text-zinc-400">
                          {p.main_category || 'Unassigned'}
                          {p.category ? ` > ${p.category}` : ''}
                          {p.sub_category ? ` > ${p.sub_category}` : ''}
                        </td>
                        <td className={`p-4 font-normal text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{p.price}</td>
                        <td className="p-4 text-right">
                          {inlineStockEdit[p.id] !== undefined ? (
                            <div className="flex items-center justify-end gap-1">
                              <input
                                type="number"
                                value={inlineStockEdit[p.id]}
                                onChange={(e) => setInlineStockEdit(prev => ({ ...prev, [p.id]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleInlineStockSave(p.id, inlineStockEdit[p.id]); if (e.key === 'Escape') setInlineStockEdit(prev => { const n = { ...prev }; delete n[p.id]; return n; }); }}
                                className={`w-16 px-2 py-1 rounded-lg border text-xs font-normal text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white' : 'bg-white border-zinc-300 text-zinc-800'
                                  }`}
                                autoFocus
                              />
                              <button onClick={() => handleInlineStockSave(p.id, inlineStockEdit[p.id])} className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95">
                                <CheckCircle size={12} />
                              </button>
                              <button onClick={() => setInlineStockEdit(prev => { const n = { ...prev }; delete n[p.id]; return n; })} className="p-1 rounded-lg bg-zinc-300 text-zinc-700 hover:bg-zinc-400 active:scale-95">
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => setInlineStockEdit(prev => ({ ...prev, [p.id]: p.stock }))}
                              title="Click to edit stock"
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[9px] font-normal border transition-all cursor-pointer hover:ring-2 hover:ring-indigo-400 ${p.stock === 0 ? 'bg-red-600 text-white border-transparent'
                                  : p.stock < 15 ? 'bg-amber-500 text-white border-transparent'
                                    : 'bg-emerald-600 text-white border-transparent'
                                }`}
                            >
                              {p.stock} units <Edit size={10} strokeWidth={2.5} className="text-white shrink-0 ml-0.5" />
                            </span>
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
                <div className="flex items-center justify-between pt-4 pb-2 text-xs font-normal select-none leading-none">
                  <span className="text-zinc-400">
                    Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-normal">{Math.min(filteredProducts.length, (productPage - 1) * ITEMS_PER_PAGE + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-normal">{Math.min(filteredProducts.length, productPage * ITEMS_PER_PAGE)}</span> of <span className="font-normal text-zinc-650 dark:text-zinc-300">{filteredProducts.length}</span> products
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={productPage === 1}
                      onClick={() => setProductPage(prev => Math.max(1, prev - 1))}
                      className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#1e293b] font-normal active:scale-95"
                    >
                      ◀ Prev
                    </button>
                    {getPaginatedRange(productPage, totalProductPages).map((pageNum) => {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setProductPage(pageNum)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-normal transition-all cursor-pointer active:scale-90 ${productPage === pageNum
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
                      className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#1e293b] font-normal active:scale-95"
                    >
                      Next ▶
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activePage === 'inventory' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div>
                <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Inventory Control Centre</h2>
                <p className="text-xs text-zinc-500 font-normal mt-1">Monitor stock status, record replenishment, and review inventory valuation.</p>
              </div>

              {/* Grid Statistics Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-4.5 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] font-normal uppercase tracking-wider">Total Items</p>
                    <h3 className={`text-xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{products.length}</h3>
                  </div>
                </div>

                <div className={`p-4.5 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] font-normal uppercase tracking-wider">Stock Valuation</p>
                    <h3 className={`text-xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>₹{Math.round(totalInventoryVal).toLocaleString('en-IN')}</h3>
                  </div>
                </div>

                <div className={`p-4.5 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="w-11 h-11 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                    <XCircle size={20} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] font-normal uppercase tracking-wider">Out of Stock</p>
                    <h3 className={`text-xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{outOfStockCount}</h3>
                  </div>
                </div>

                <div className={`p-4.5 rounded-2xl border flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[10px] font-normal uppercase tracking-wider">Low Stock Alert</p>
                    <h3 className={`text-xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{lowStockCount}</h3>
                  </div>
                </div>
              </div>

              {/* Filters Panel */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full max-w-[320px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={inventorySearchQuery}
                    onChange={(e) => { setInventorySearchQuery(e.target.value); setInventoryPage(1); }}
                    placeholder="Search inventory by name, SKU..."
                    className={`w-full rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 border ${theme === 'dark'
                        ? 'bg-[#0f1626] border-[#1e293b] text-white placeholder-zinc-500'
                        : 'bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400'
                      }`}
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center justify-end">
                  <select
                    value={inventoryCategoryFilter}
                    onChange={(e) => { setInventoryCategoryFilter(e.target.value); setInventoryPage(1); }}
                    className={`text-xs font-normal p-2.5 bg-transparent border rounded-xl outline-none cursor-pointer max-w-[160px] ${theme === 'dark' ? 'border-[#1e293b] text-zinc-300 bg-[#0f1626]' : 'border-zinc-200 text-zinc-700 bg-white'
                      }`}
                  >
                    <option value="all" className={theme === "dark" ? "bg-[#0f1626] text-white font-normal" : "bg-white text-zinc-850 font-normal"}>All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name} className={theme === "dark" ? "bg-[#0f1626] text-white font-normal" : "bg-white text-zinc-850 font-normal"}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={inventoryStatusFilter}
                    onChange={(e) => { setInventoryStatusFilter(e.target.value); setInventoryPage(1); }}
                    className={`text-xs font-normal p-2.5 bg-transparent border rounded-xl outline-none cursor-pointer ${theme === 'dark' ? 'border-[#1e293b] text-zinc-300 bg-[#0f1626]' : 'border-zinc-200 text-zinc-700 bg-white'
                      }`}
                  >
                    <option value="all" className={theme === "dark" ? "bg-[#0f1626] text-white font-normal" : "bg-white text-zinc-850 font-normal"}>All Stock Status</option>
                    <option value="instock" className={theme === "dark" ? "bg-[#0f1626] text-white font-normal" : "bg-white text-zinc-850 font-normal"}>In Stock (15+ units)</option>
                    <option value="lowstock" className={theme === "dark" ? "bg-[#0f1626] text-white font-normal" : "bg-white text-zinc-850 font-normal"}>Low Stock (&lt; 15 units)</option>
                    <option value="outofstock" className={theme === "dark" ? "bg-[#0f1626] text-white font-normal" : "bg-white text-zinc-850 font-normal"}>Out of Stock (0 units)</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[800px] text-left text-sm">
                  <thead className={`font-normal tracking-normal border-b ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                    <tr>
                      <th className="p-4.5">Product Name</th>
                      <th className="p-4.5">Category</th>
                      <th className="p-4.5 text-right">Price</th>
                      <th className="p-4.5 text-center">Stock Level Status</th>
                      <th className="p-4.5 text-center">Quick Adjust</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                    {paginatedInventoryProducts.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-zinc-400 font-normal">
                          No matching inventory items found.
                        </td>
                      </tr>
                    ) : (
                      paginatedInventoryProducts.map((p) => {
                        const stockProgress = Math.min(100, (p.stock / 100) * 100);
                        const progressColor = p.stock === 0 ? 'bg-rose-500' : p.stock < 15 ? 'bg-amber-500' : 'bg-emerald-500';
                        const textStatus = p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock';
                        const textBadgeColor = p.stock === 0 ? 'bg-rose-600 text-white border-transparent' : p.stock < 15 ? 'bg-amber-500 text-white border-transparent' : 'bg-emerald-600 text-white border-transparent';

                        return (
                          <tr key={p.id} className="hover:bg-white/2 transition-colors">
                            <td className="p-4 font-normal flex items-center gap-2.5">
                              {p.image && <img src={getImageUrl(p.image)} alt={p.name} className="w-9 h-9 rounded-xl object-contain border border-[#1e293b] bg-white p-0.5" />}
                              <div>
                                <span className={`font-semibold block ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{p.name}</span>
                                <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono">SKU: {p.sku || 'N/A'}</span>
                              </div>
                            </td>
                            <td className="p-4 font-normal text-zinc-400">
                              {p.main_category || 'Unassigned'}
                              {p.category ? ` > ${p.category}` : ''}
                              {p.sub_category ? ` > ${p.sub_category}` : ''}
                            </td>
                            <td className={`p-4 font-normal text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{p.price}</td>
                            <td className="p-4 text-center">
                              <div className="flex flex-col items-center gap-1.5 justify-center">
                                <div className="flex items-center justify-between w-full max-w-[130px] text-[10px] text-zinc-400 font-semibold px-0.5">
                                  <span>{p.stock} units</span>
                                  <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md border uppercase tracking-wider ${textBadgeColor}`}>{textStatus}</span>
                                </div>
                                <div className="w-full max-w-[130px] bg-zinc-150 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                                  <div className={`h-full ${progressColor} transition-all duration-300`} style={{ width: `${stockProgress}%` }}></div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleInlineStockSave(p.id, Math.max(0, p.stock - 5))}
                                  className="py-1.5 px-2.5 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-[#1e293b] text-zinc-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer font-bold active:scale-95"
                                  title="Decrease stock by 5"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleInlineStockSave(p.id, Math.max(0, p.stock - 1))}
                                  className="py-1.5 px-2.5 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-[#1e293b] text-zinc-500 hover:text-rose-500 rounded-lg transition-colors cursor-pointer font-bold active:scale-95"
                                  title="Decrease stock by 1"
                                >
                                  -1
                                </button>

                                {inlineStockEdit[p.id] !== undefined ? (
                                  <div className="flex items-center gap-1">
                                    <input
                                      type="number"
                                      value={inlineStockEdit[p.id]}
                                      onChange={(e) => setInlineStockEdit(prev => ({ ...prev, [p.id]: e.target.value }))}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleInlineStockSave(p.id, inlineStockEdit[p.id]);
                                        if (e.key === 'Escape') setInlineStockEdit(prev => { const n = { ...prev }; delete n[p.id]; return n; });
                                      }}
                                      className={`w-14 px-1.5 py-1 rounded-lg border text-xs font-semibold text-center focus:outline-none focus:ring-1 focus:ring-indigo-500 ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white' : 'bg-white border-zinc-300 text-zinc-805'
                                        }`}
                                      autoFocus
                                    />
                                    <button onClick={() => handleInlineStockSave(p.id, inlineStockEdit[p.id])} className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-95">
                                      <CheckCircle size={11} />
                                    </button>
                                    <button onClick={() => setInlineStockEdit(prev => { const n = { ...prev }; delete n[p.id]; return n; })} className="p-1.5 rounded-lg bg-zinc-300 text-zinc-700 hover:bg-zinc-400 active:scale-95">
                                      <X size={11} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setInlineStockEdit(prev => ({ ...prev, [p.id]: p.stock }))}
                                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer active:scale-95 transition-all duration-150"
                                    title="Edit custom value"
                                  >
                                    Edit
                                  </button>
                                )}

                                <button
                                  onClick={() => handleInlineStockSave(p.id, p.stock + 1)}
                                  className="py-1.5 px-2.5 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-[#1e293b] text-zinc-500 hover:text-emerald-500 rounded-lg transition-colors cursor-pointer font-bold active:scale-95"
                                  title="Increase stock by 1"
                                >
                                  +1
                                </button>
                                <button
                                  onClick={() => handleInlineStockSave(p.id, p.stock + 5)}
                                  className="py-1.5 px-2.5 text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-[#1e293b] text-zinc-500 hover:text-emerald-500 rounded-lg transition-colors cursor-pointer font-bold active:scale-95"
                                  title="Increase stock by 5"
                                >
                                  +5
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
              {totalInventoryPages > 1 && (
                <div className="flex items-center justify-between pt-4 pb-2 text-xs font-normal select-none leading-none">
                  <span className="text-zinc-400">
                    Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-semibold">{Math.min(filteredInventoryProducts.length, (inventoryPage - 1) * INVENTORY_ITEMS_PER_PAGE + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-semibold">{Math.min(filteredInventoryProducts.length, inventoryPage * INVENTORY_ITEMS_PER_PAGE)}</span> of <span className="font-semibold text-zinc-650 dark:text-zinc-300">{filteredInventoryProducts.length}</span> products
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={inventoryPage === 1}
                      onClick={() => setInventoryPage(prev => Math.max(1, prev - 1))}
                      className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#1e293b] font-normal active:scale-95"
                    >
                      ◀ Prev
                    </button>
                    {getPaginatedRange(inventoryPage, totalInventoryPages).map((pageNum) => {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setInventoryPage(pageNum)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-normal transition-all cursor-pointer active:scale-90 ${inventoryPage === pageNum
                              ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md font-semibold'
                              : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      disabled={inventoryPage === totalInventoryPages}
                      onClick={() => setInventoryPage(prev => Math.min(totalInventoryPages, prev + 1))}
                      className="py-2 px-3 bg-zinc-100 hover:bg-[#1e293b] dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#1e293b] font-normal active:scale-95"
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
                  <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Category & Subcategory</h2>
                  <p className="text-xs text-zinc-500 font-normal mt-1">Dashboard &gt; Categories</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenMainCategoryModal('add')}
                    className="py-2.5 px-4 bg-pink-600 hover:bg-pink-700 text-white text-xs font-normal rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} /> Add Main Category
                  </button>
                  <button
                    onClick={() => handleOpenCategoryModal('add')}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-normal rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} /> Add Category
                  </button>
                  <button
                    onClick={() => handleOpenSubcategoryModal('add')}
                    className="py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white text-xs font-normal rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                  >
                    <Plus size={14} /> Add Subcategory
                  </button>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    <Folders className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Total Categories</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {rootCategories.length}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-normal mt-1.5 leading-none">
                      <span className="text-emerald-500">Active: {rootCategories.filter(c => c.is_active).length}</span>
                      <span className="text-zinc-350 dark:text-zinc-700">•</span>
                      <span className="text-rose-500">Inactive: {rootCategories.filter(c => !c.is_active).length}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                    <Folders className="h-6 w-6 rotate-90" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Total Subcategories</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {subCategories.length}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9px] font-normal mt-1.5 leading-none">
                      <span className="text-emerald-500">Active: {subCategories.filter(c => c.is_active).length}</span>
                      <span className="text-zinc-350 dark:text-zinc-700">•</span>
                      <span className="text-rose-500">Inactive: {subCategories.filter(c => !c.is_active).length}</span>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Total Products</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {products.length}
                    </h3>
                    <p className="text-zinc-400 text-[9px] font-normal mt-1.5 leading-none">Linked to Categories</p>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Low Stock</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {products.filter(p => p.stock < 15).length}
                    </h3>
                    <p className="text-zinc-400 text-[9px] font-normal mt-1.5 leading-none">Items below 15 units</p>
                  </div>
                </div>
              </div>

              {/* Table Card */}
              <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                {/* Tabs & Search / Filter Header */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-6">
                  {/* Category / Subcategory Tabs */}
                  <div className="flex gap-6 border-b border-transparent">
                    <button
                      onClick={() => setCategoriesActiveTab('maincategories')}
                      className={`pb-2.5 text-sm font-medium relative transition-all cursor-pointer ${categoriesActiveTab === 'maincategories'
                          ? 'text-indigo-650 dark:text-indigo-400 font-semibold'
                          : theme === 'dark'
                            ? 'text-zinc-450 hover:text-white'
                            : 'text-zinc-550 hover:text-zinc-850'
                        }`}
                    >
                      Main Categories
                      {categoriesActiveTab === 'maincategories' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-fade-in" />
                      )}
                    </button>
                    <button
                      onClick={() => setCategoriesActiveTab('categories')}
                      className={`pb-2.5 text-sm font-medium relative transition-all cursor-pointer ${categoriesActiveTab === 'categories'
                          ? 'text-indigo-650 dark:text-indigo-400 font-semibold'
                          : theme === 'dark'
                            ? 'text-zinc-450 hover:text-white'
                            : 'text-zinc-550 hover:text-zinc-850'
                        }`}
                    >
                      Categories
                      {categoriesActiveTab === 'categories' && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-fade-in" />
                      )}
                    </button>
                    <button
                      onClick={() => setCategoriesActiveTab('subcategories')}
                      className={`pb-2.5 text-sm font-medium relative transition-all cursor-pointer ${categoriesActiveTab === 'subcategories'
                          ? 'text-indigo-650 dark:text-indigo-400 font-semibold'
                          : theme === 'dark'
                            ? 'text-zinc-450 hover:text-white'
                            : 'text-zinc-550 hover:text-zinc-850'
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
                    <div className={`relative flex items-center bg-zinc-50 border rounded-2xl px-3.5 py-1.5 focus-within:border-indigo-500 w-52 sm:w-64 transition-all ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-zinc-50 border-zinc-200'
                      }`}>
                      <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                      <input
                        type="text"
                        value={categorySearchQuery}
                        onChange={(e) => setCategorySearchQuery(e.target.value)}
                        placeholder="Search categories..."
                        className="text-xs font-normal pl-2 bg-transparent border-none outline-none focus:outline-none focus:ring-0 p-0 w-full placeholder-zinc-455 text-zinc-800 dark:text-white"
                      />
                      {categorySearchQuery && (
                        <button onClick={() => setCategorySearchQuery('')} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"><X size={12} /></button>
                      )}
                    </div>

                    <button className={`py-1.5 px-3.5 border rounded-2xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${theme === 'dark'
                        ? 'border-[#1e293b] text-zinc-300 hover:bg-[#172033] hover:text-white'
                        : 'border-zinc-200 text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900'
                      }`}>
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                    </button>
                  </div>
                </div>

                {/* Categories Table View */}
                {categoriesActiveTab === 'categories' && (
                  <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className={`font-normal tracking-normal border-b text-[12px] ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-455' : 'bg-zinc-50/50 border-zinc-150 text-zinc-500'
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
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                        {rootCategories
                          .filter(c => c.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                          .map((c, index) => {
                            const isSelected = selectedAdminCategory === c.name;
                            const subsCount = subCategories.filter(sub => sub.parent_category === c.name).length;
                            const prodsCount = products.filter(p => p.main_category === c.name || p.category === c.id).length;

                            return (
                              <tr
                                key={c.id}
                                onClick={() => setSelectedAdminCategory(c.name)}
                                className={`transition-all duration-150 cursor-pointer ${isSelected
                                    ? theme === 'dark' ? 'bg-indigo-950/20 hover:bg-indigo-950/30' : 'bg-indigo-50/40 hover:bg-indigo-50/60'
                                    : theme === 'dark' ? 'hover:bg-white/2' : 'hover:bg-zinc-50/50'
                                  }`}
                              >
                                <td className="p-4 font-normal text-center text-zinc-400">{index + 1}</td>
                                <td className="p-4 font-normal">
                                  <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{c.name}</span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    {c.image_url || c.image ? (
                                      <img src={getImageUrl(c.image_url || c.image)} alt={c.name} className="w-9 h-9 rounded-xl object-contain border border-zinc-200 dark:border-[#1e293b] p-0.5 bg-white shadow-3xs" />
                                    ) : (
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-zinc-50 border-zinc-200'
                                        }`}>
                                        <Folders size={16} className="text-zinc-400" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-normal text-zinc-650 dark:text-zinc-350">{subsCount}</td>
                                <td className="p-4 text-center font-normal text-zinc-650 dark:text-zinc-350">{prodsCount}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-normal border ${c.is_active
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
                )}

                {categoriesActiveTab === 'maincategories' && (
                  <div className="overflow-x-auto no-scrollbar animate-fade-in">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className={`font-normal tracking-normal border-b text-[12px] ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-455' : 'bg-zinc-50/50 border-zinc-150 text-zinc-500'
                        }`}>
                        <tr>
                          <th className="p-4 w-12 text-center">#</th>
                          <th className="p-4">Main Category Name</th>
                          <th className="p-4">Parent Category</th>
                          <th className="p-4 text-center">Image</th>
                          <th className="p-4 text-center">Subcategories</th>
                          <th className="p-4 text-center">Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                        {mainCategories
                          .filter(main => main.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                          .map((main, index) => {
                            const subsCount = subCategories.filter(sub => sub.parent_category === main.name).length;

                            return (
                              <tr key={main.id} className={`transition-all duration-150 ${theme === 'dark' ? 'hover:bg-white/2' : 'hover:bg-zinc-50/50'}`}>
                                <td className="p-4 font-normal text-center text-zinc-400">{index + 1}</td>
                                <td className="p-4 font-normal">
                                  <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{main.name}</span>
                                </td>
                                <td className="p-4 font-normal text-indigo-500">
                                  <span>{main.parent_category}</span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    {main.image_url || main.image ? (
                                      <img src={getImageUrl(main.image_url || main.image)} alt={main.name} className="w-9 h-9 rounded-xl object-contain border border-zinc-200 dark:border-[#1e293b] p-0.5 bg-white shadow-3xs" />
                                    ) : (
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-zinc-50 border-zinc-200'
                                        }`}>
                                        <Folders size={16} className="text-zinc-400" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-normal text-zinc-650 dark:text-zinc-350">{subsCount}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-normal border ${main.is_active
                                      ? 'bg-emerald-600 text-white border-transparent'
                                      : 'bg-rose-600 text-white border-transparent'
                                    }`}>
                                    {main.is_active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handleOpenMainCategoryModal('edit', main)}
                                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-400 dark:hover:border-indigo-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                      title="Edit Main Category"
                                    >
                                      <Edit size={13} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteCategory(main.id)}
                                      className="p-2 rounded-xl bg-zinc-50 border border-zinc-200/60 text-zinc-650 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-150/60 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 dark:hover:border-rose-900/30 transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs hover:shadow-2xs"
                                      title="Delete Main Category"
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

                {categoriesActiveTab === 'subcategories' && (
                  <div className="overflow-x-auto no-scrollbar animate-fade-in">
                    <table className="w-full min-w-[700px] text-left text-sm">
                      <thead className={`font-normal tracking-normal border-b text-[12px] ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-455' : 'bg-zinc-50/50 border-zinc-150 text-zinc-500'
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
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                        {subCategories
                          .filter(sub => sub.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
                          .map((sub, index) => {
                            const prodsCount = products.filter(p => p.category === sub.name || p.main_category === sub.name).length;

                            return (
                              <tr key={sub.id} className={`transition-all duration-150 ${theme === 'dark' ? 'hover:bg-white/2' : 'hover:bg-zinc-50/50'}`}>
                                <td className="p-4 font-normal text-center text-zinc-400">{index + 1}</td>
                                <td className="p-4 font-normal">
                                  <span className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{sub.name}</span>
                                </td>
                                <td className="p-4 font-normal text-indigo-500">
                                  <span>{sub.parent_category}</span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex justify-center">
                                    {sub.image_url || sub.image ? (
                                      <img src={getImageUrl(sub.image_url || sub.image)} alt={sub.name} className="w-9 h-9 rounded-xl object-contain border border-zinc-200 dark:border-[#1e293b] p-0.5 bg-white shadow-3xs" />
                                    ) : (
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-zinc-50 border-zinc-200'
                                        }`}>
                                        <Folders size={16} className="text-zinc-400" />
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-center font-normal text-zinc-650 dark:text-zinc-350">{prodsCount}</td>
                                <td className="p-4 text-center">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-normal border ${sub.is_active
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
                <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Customer Checkout Orders</h3>
                <div className="relative w-full max-w-[300px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by order ID, name, phone..."
                    className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 border ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'
                      }`}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[['All', orders.length, 'bg-indigo-600'], ['Pending', orders.filter(o => o.status === 'pending' || (!o.status && o.payment_method === 'cod')).length, 'bg-amber-500'], ['Delivered', orders.filter(o => o.status === 'delivered').length, 'bg-emerald-600'], ['Cancelled', orders.filter(o => o.status === 'cancelled').length, 'bg-red-600']].map(([label, count, color]) => (
                  <div key={label} className={`p-4 rounded-2xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl ${color} text-white flex items-center justify-center font-normal text-sm`}>{count}</div>
                    <span className={`text-xs font-normal ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>{label}</span>
                  </div>
                ))}
              </div>

              <div className={`border rounded-2xl overflow-x-auto min-h-[420px] ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead className={`font-normal tracking-normal border-b ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
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
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                    {filteredOrders.length === 0 ? (
                      <tr><td colSpan="8" className="p-8 text-center text-zinc-400 font-normal">No orders found.</td></tr>
                    ) : (
                      filteredOrders.map((o, index) => {
                        const StatusIcon = STATUS_CONFIG[o.status || 'pending']?.icon || Clock;
                        const openUpwards = index >= filteredOrders.length - 2 && filteredOrders.length >= 4;
                        return (
                          <React.Fragment key={o.order_id}>
                            <tr onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)} className="hover:bg-white/2 transition-colors cursor-pointer">
                              <td className="p-4 font-normal text-indigo-400">{o.order_id}</td>
                              <td className={`p-4 font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{o.customer_name}</td>
                              <td className="p-4 text-zinc-400 font-normal">{o.phone || '---'}</td>
                              <td className="p-4 uppercase text-zinc-500 font-normal">{o.payment_method}</td>
                              <td className={`p-4 font-normal text-right ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>₹{o.total_amount}</td>
                              <td className="p-4 text-center relative">
                                <div className="inline-block text-left relative">
                                  {/* Custom Dropdown Toggle Button */}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveDropdownId(activeDropdownId === o.id ? null : o.id);
                                    }}
                                    className={`text-xs font-normal px-3.5 py-2 rounded-full flex items-center justify-between gap-2 cursor-pointer transition-all duration-200 active:scale-95 border hover:brightness-95 dark:hover:brightness-110 shadow-3xs ${STATUS_CONFIG[o.status || 'pending']?.bg || 'bg-zinc-500/10 text-zinc-650 border-zinc-500/20'
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
                                        onClick={(e) => { e.stopPropagation(); setActiveDropdownId(null); }}
                                      />
                                      <div className={`absolute left-1/2 -translate-x-1/2 w-40 rounded-2xl shadow-xl z-45 border p-1.5 animate-fade-in ${openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                                        } ${theme === 'dark'
                                          ? 'bg-[#172033] border-[#1e293b] text-white shadow-black/85'
                                          : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-250/60'
                                        }`}>
                                        <div className="max-h-[220px] overflow-y-auto no-scrollbar py-0.5 space-y-0.5">
                                          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                                            const ItemIcon = cfg.icon || Clock;
                                            return (
                                              <button
                                                key={key}
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  handleOrderStatusChange(o.id, key);
                                                  setActiveDropdownId(null);
                                                }}
                                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-left text-xs font-normal transition-all cursor-pointer select-none active:scale-97 ${(o.status || 'pending') === key
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
                              <td className="p-4 text-center text-zinc-500 font-normal">
                                {/* eslint-disable-next-line react-hooks/purity */}
                                {new Date(o.created_at || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteOrder(o.id);
                                  }}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors cursor-pointer"
                                  title="Delete Order"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                            {expandedOrderId === o.id && (
                              <tr>
                                <td colSpan="8" className="p-0 border-b-0">
                                  <div className={`p-5 m-2 rounded-xl border ${theme === 'dark' ? 'bg-[#1a233a] border-[#2a344a]' : 'bg-zinc-50 border-zinc-200'}`}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div>
                                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Order Items</h4>
                                        <div className="space-y-3">
                                          {(o.items || []).map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-xs">
                                              <div className="flex flex-col">
                                                <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                                                  {item.quantity}x {item.product_name}
                                                </span>
                                                {item.product_code && <span className="text-[10.5px] text-indigo-500 font-mono tracking-wider font-medium mb-0.5">Code: {item.product_code}</span>}
                                                <span className={`text-[10px] ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                                  {item.selected_color && `Color: ${item.selected_color}`} 
                                                  {item.selected_color && item.selected_size && ' | '}
                                                  {item.selected_size && `Size: ${item.selected_size}`}
                                                </span>
                                              </div>
                                              <span className={`font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>₹{item.price}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>Shipping Details</h4>
                                        <div className={`text-xs space-y-1 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                          <p><span className={`font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Name:</span> {o.customer_name}</p>
                                          <p><span className={`font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Email:</span> {o.email || 'N/A'}</p>
                                          <p><span className={`font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Phone:</span> {o.phone || 'N/A'}</p>
                                          <p><span className={`font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-zinc-400'}`}>Address:</span> {o.street_address}</p>
                                          <p className="pl-14">{o.city}, {o.state} - {o.pin_code}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
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
              <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>Customer Product Reviews</h3>

              <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'}`}>
                <table className="w-full min-w-[850px] text-left text-xs">
                  <thead className={`font-normal tracking-normal border-b ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-400' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
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
                  <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                    {reviews.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="p-8 text-center text-zinc-500 font-normal">
                          No reviews found.
                        </td>
                      </tr>
                    ) : (
                      reviews.map((r) => (
                        <tr key={r.id} className="hover:bg-white/2 transition-colors">
                          <td className={`p-4 font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{r.user_name}</td>
                          <td className="p-4 text-zinc-500 font-normal">{r.user_email}</td>
                          <td className={`p-4 font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{r.product_name || 'Deleted Product'}</td>
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
                          <td className="p-4 text-center text-zinc-500 font-normal">
                            {/* eslint-disable-next-line react-hooks/purity */}
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
                <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Business Intelligence & Analytics</h2>
                <p className="text-xs text-zinc-500 font-normal mt-1">Real-time charts, order distributions, and warehousing stock tracking.</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Package className="text-white" />} label="Registry Products" value={products.length} desc="Active SKU variants" theme={theme} bgClass="bg-indigo-600 text-white" />
                <StatCard icon={<ArrowUpRight className="text-white" />} label="Total Stock Units" value={products.reduce((acc, p) => acc + (p.stock || 0), 0)} desc="Items in warehouse" theme={theme} bgClass="bg-emerald-600 text-white" />
                <StatCard icon={<AlertCircle className="text-white" />} label="Low Stock Alerts" value={products.filter(p => (p.stock || 0) < 15).length} desc="SKUs below 15 units" theme={theme} bgClass="bg-rose-600 text-white" />
              </div>

              {/* Charts grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Sales & Orders Trend Card */}
                <div className={`p-6 rounded-3xl border transition-all lg:col-span-2 relative flex flex-col justify-between ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                      <h4 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>
                        {analyticsChartMetric === 'revenue' ? 'Revenue Growth Trend' : 'Order Volume Trend'}
                      </h4>
                      <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Daily performance tracking over the last 14 days.</p>
                    </div>
                    <div className={`flex rounded-xl p-0.5 border ${theme === 'dark' ? 'bg-zinc-900 border-[#1e293b]' : 'bg-zinc-150 border-zinc-200'
                      }`}>
                      <button
                        type="button"
                        onClick={() => setAnalyticsChartMetric('revenue')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-normal tracking-wide transition-all cursor-pointer ${analyticsChartMetric === 'revenue'
                            ? 'bg-[#8b5cf6] text-white shadow-xs'
                            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'
                          }`}
                      >
                        Revenue
                      </button>
                      <button
                        type="button"
                        onClick={() => setAnalyticsChartMetric('orders')}
                        className={`px-3 py-1.5 rounded-lg text-[9px] font-normal tracking-wide transition-all cursor-pointer ${analyticsChartMetric === 'orders'
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
                    <div className="flex flex-col justify-between text-[9px] text-zinc-400 font-normal h-[85%] pb-2 select-none w-10 text-left leading-none">
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
                            points={`${points[0].x},160 ${points.map(p => `${p.x},${p.y}`).join(' ')} ${points[points.length - 1].x},160`}
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
                              stroke={theme === 'dark' ? '#0f1626' : '#ffffff'}
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
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[8px] font-normal text-zinc-400 px-1 pointer-events-none">
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
                          <p className="font-normal text-zinc-400">{points[hoveredPointIndex].date}</p>
                          <p className="font-normal text-xs text-white">
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
                <div className={`p-6 rounded-3xl border transition-all flex flex-col justify-between ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div>
                    <h4 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Order Statuses</h4>
                    <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Distribution of active workflow statuses.</p>
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
                        <span className="text-[10px] font-normal text-zinc-400 text-center">No orders recorded yet.</span>
                      ) : (
                        statusDonutSlices.map((slice, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-normal text-zinc-550 dark:text-zinc-455">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }} />
                              <span className="capitalize">{slice.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-400 font-normal">{slice.percentage}%</span>
                              <span className="text-zinc-800 dark:text-white font-normal">{slice.count}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Stock Inventory Section */}
              <div className={`p-6 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Inventory Stock Registry</h3>
                    <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Real-time tracking of item stocks, supply states, and automatic refills.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="py-2 px-3 bg-[#8b5cf6] hover:bg-purple-650 text-white text-[10px] font-normal rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ClipboardList size={12} /> Export Stock Report
                  </button>
                </div>

                <div className={`border rounded-2xl overflow-hidden overflow-x-auto ${theme === 'dark' ? 'border-[#1e293b] bg-zinc-950/20' : 'border-zinc-150 bg-white'}`}>
                  <table className="w-full min-w-[700px] text-left text-xs">
                    <thead className={`font-normal tracking-normal border-b ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-zinc-450' : 'bg-zinc-50 border-zinc-200 text-black'}`}>
                      <tr>
                        <th className="p-4">SKU / Item</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-right">Current Stock</th>
                        <th className="p-4 text-center">Status</th>
                        <th className="p-4 text-center">Quick Action</th>
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-[#1e293b]' : 'divide-zinc-200'}`}>
                      {paginatedAnalyticsProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/2 transition-colors">
                          <td className="p-4 font-normal flex items-center gap-2.5">
                            {p.image && <img src={getImageUrl(p.image)} alt={p.name} className="w-8 h-8 rounded-lg object-contain border border-[#1e293b] bg-white p-0.5" />}
                            <div>
                              <p className={theme === 'dark' ? 'text-white' : 'text-zinc-800'}>{p.name}</p>
                              <p className="text-[10px] text-zinc-500">PROD-00{p.id}</p>
                            </div>
                          </td>
                          <td className="p-4 font-normal text-zinc-400">
                            {p.main_category || 'Unassigned'}
                            {p.category ? ` > ${p.category}` : ''}
                            {p.sub_category ? ` > ${p.sub_category}` : ''}
                          </td>
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
                                    const res = await fetch(`${API_BASE}/api/products/${p.id}/`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
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
                                className={`w-16 p-1.5 text-center rounded-lg border outline-none text-xs font-normal transition-all ${theme === 'dark'
                                    ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                                    : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                                  }`}
                              />
                              <span className="text-[10px] text-zinc-500 font-normal">pcs</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col items-center gap-1.5">
                              {/* Stock Warning Badge */}
                              <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border-none shadow-sm transition-all ${p.stock === 0
                                  ? 'bg-rose-600 text-white'
                                  : p.stock < 15
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-emerald-600 text-white'
                                }`}>{p.stock === 0 ? 'Out of Stock' : p.stock < 15 ? 'Low Stock' : 'In Stock'}</span>

                              {/* Publication Status Dropdown */}
                              <select
                                value={p.status || 'published'}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                  try {
                                    const res = await fetch(`${API_BASE}/api/products/${p.id}/`, {
                                      method: 'PATCH',
                                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
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
                                className={`text-[9px] font-normal px-3 py-1 rounded-full outline-none cursor-pointer border-none shadow-sm appearance-none transition-all ${(p.status || 'published') === 'published'
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-amber-400 text-white'
                                  }`}
                              >
                                <option value="published" style={{ background: '#fff', color: '#000' }}>Published</option>
                                <option value="draft" style={{ background: '#fff', color: '#000' }}>Draft</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const res = await fetch(`${API_BASE}/api/products/${p.id}/`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.getItem('access_token')}` },
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
                              className="py-2 px-4 bg-zinc-50 border border-zinc-200 text-zinc-750 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-450 dark:hover:border-emerald-900/30 font-normal rounded-xl text-[10px] transition-all duration-200 active:scale-95 cursor-pointer shadow-3xs"
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
                  <div className="flex items-center justify-between pt-6 text-xs font-normal select-none leading-none">
                    <span className="text-zinc-400">
                      Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-normal">{Math.min(filteredAnalyticsProducts.length, (analyticsPage - 1) * 8 + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-normal">{Math.min(filteredAnalyticsProducts.length, analyticsPage * 8)}</span> of <span className="font-normal text-zinc-650 dark:text-zinc-300">{filteredAnalyticsProducts.length}</span> items
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={analyticsPage === 1}
                        onClick={() => setAnalyticsPage(prev => Math.max(1, prev - 1))}
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-[#1e293b] font-normal active:scale-95"
                      >
                        ◀ Prev
                      </button>
                      {getPaginatedRange(analyticsPage, totalAnalyticsPages).map((pageNum) => {
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => setAnalyticsPage(pageNum)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-normal transition-all cursor-pointer active:scale-90 ${analyticsPage === pageNum
                                ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md'
                                : 'bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-655 dark:text-zinc-400'
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
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200 dark:border-[#1e293b] font-normal active:scale-95"
                      >
                        Next ▶
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {activePage === 'hero-banners' && (
            <div className="space-y-6 text-left animate-fade-in admin-banners-container">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Index Banners</h2>
                  <p className="text-xs text-zinc-500 font-normal mt-1">Manage desktop and mobile hero banners on the index page.</p>
                </div>

                {/* Tab Header Navigation */}
                <div className={`flex border rounded-2xl p-1 gap-2 shrink-0 ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'
                  }`}>
                  <button
                    type="button"
                    onClick={() => setBannerTypeTab('desktop')}
                    className={`px-4 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${bannerTypeTab === 'desktop'
                        ? 'bg-[#8b5cf6] text-white shadow-xs'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-855 hover:bg-zinc-100'
                      }`}
                  >
                    Desktop Banners
                  </button>
                  <button
                    type="button"
                    onClick={() => setBannerTypeTab('mobile')}
                    className={`px-4 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${bannerTypeTab === 'mobile'
                        ? 'bg-[#8b5cf6] text-white shadow-xs'
                        : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-855 hover:bg-zinc-100'
                      }`}
                  >
                    Mobile Banners
                  </button>
                </div>
              </div>

              {/* Previews Only */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {[1, 2, 3].map((slot) => {
                  const isMobile = bannerTypeTab === 'mobile';
                  const activeBanners = isMobile ? mobileBanners : banners;
                  const existingBanner = activeBanners.find(b => b.order === slot);
                  const isUploaded = existingBanner && !existingBanner.is_default;

                  // Use correct seeded default images: 11/12/13.webp for desktop and 21/22/23.webp for mobile
                  let imgSrc = isMobile ? `/banner/2${slot}.webp` : `/banner/1${slot}.webp`;

                  if (existingBanner) {
                    imgSrc = existingBanner.src || existingBanner.image;
                    if (imgSrc && imgSrc.startsWith('/media/')) imgSrc = `${API_BASE}${imgSrc}`;
                    if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) imgSrc = `${API_BASE}/media/${imgSrc}`;
                  }

                  const isUploading = isMobile ? uploadingMobileBannerSlot === slot : uploadingBannerSlot === slot;

                  return (
                    <div key={`preview-${slot}`} className={`rounded-3xl border p-3 flex flex-col items-center gap-4 shadow-3xs relative overflow-hidden ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'
                      }`}>
                      <div className="w-full flex justify-between items-center mb-1 px-1">
                        <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{isMobile ? 'Mobile' : 'Desktop'} Banner {slot}</h3>
                        {isUploaded && (
                          <span className="bg-indigo-500/10 text-indigo-500 text-[9px] font-normal px-2 py-0.5 rounded-md uppercase tracking-wider">Custom</span>
                        )}
                        {!isUploaded && (
                          <span className="bg-zinc-500/10 text-zinc-500 text-[9px] font-normal px-2 py-0.5 rounded-md uppercase tracking-wider">Default</span>
                        )}
                      </div>
                      <div className={`relative w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-inner ${isMobile ? 'aspect-[2/1]' : 'aspect-[3/1]'}`}>
                        <img src={imgSrc} alt={`${isMobile ? 'Mobile' : 'Desktop'} Banner Slot ${slot}`} className="w-full h-full object-cover" />
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                            <Loader2 className="animate-spin text-white w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-400 font-normal">
                        Size: {isMobile ? '800 * 400 px' : '1500 * 500 px'}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className={`p-6 rounded-3xl border shadow-3xs mt-6 ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'
                }`}>
                <h3 className={`font-normal text-lg mb-4 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Upload Custom {bannerTypeTab === 'mobile' ? 'Mobile' : 'Desktop'} Banners</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((slot) => {
                    const isMobile = bannerTypeTab === 'mobile';
                    const activeBanners = isMobile ? mobileBanners : banners;
                    const existingBanner = activeBanners.find(b => b.order === slot);
                    const isUploaded = existingBanner && !existingBanner.is_default;

                    let imgSrc = isMobile ? `/banner/2${slot}.webp` : `/banner/1${slot}.webp`;
                    if (existingBanner) {
                      imgSrc = existingBanner.src || existingBanner.image;
                      if (imgSrc && imgSrc.startsWith('/media/')) imgSrc = `${API_BASE}${imgSrc}`;
                      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) imgSrc = `${API_BASE}/media/${imgSrc}`;
                    }

                    const isUploading = isMobile ? uploadingMobileBannerSlot === slot : uploadingBannerSlot === slot;

                    return (
                      <div key={`input-${slot}`} className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border ${theme === 'dark' ? 'border-[#1e293b] bg-[#172033]/50' : 'border-zinc-100 bg-zinc-50/50'
                        }`}>
                        <span className={`w-16 font-normal text-sm shrink-0 ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Slot {slot}</span>

                        <div className={`w-16 h-8 sm:w-20 sm:h-10 rounded overflow-hidden shrink-0 shadow-sm relative border ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-zinc-100 border-zinc-200'
                          }`}>
                          <img src={imgSrc} alt={`Slot ${slot} thumb`} className="w-full h-full object-cover" />
                          {isUploading && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                              <Loader2 className="animate-spin text-white w-4 h-4" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => isMobile ? handleMobileBannerUpload(e, slot) : handleHeroBannerUpload(e, slot)}
                            disabled={isUploading}
                            className={`w-full text-sm file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-normal file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-500/10 dark:file:text-indigo-400 cursor-pointer transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-650'}`}
                          />
                        </div>
                        {isUploaded && (
                          <button
                            onClick={() => isMobile ? handleDeleteMobileBanner(existingBanner.id) : handleDeleteBanner(existingBanner.id)}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 transition-all text-xs active:scale-95"
                            title="Revert to Default"
                          >
                            <Trash2 size={14} /> Delete Custom
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}


          {activePage === 'marketing-banners' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Marketing Banners</h2>
                  <p className="text-xs text-zinc-500 font-normal mt-1">Manage promotional banners displayed on the storefront index page.</p>
                </div>
                <button
                  onClick={() => handleOpenMarketingBannerModal('add')}
                  className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-normal rounded-xl flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus size={14} /> Add Marketing Banner
                </button>
              </div>

              {/* Marketing Banners Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {marketingBanners.map((banner) => {
                  let imgSrc = banner.img || banner.image;
                  if (imgSrc && imgSrc.startsWith('/media/')) imgSrc = `${API_BASE}${imgSrc}`;
                  if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('/')) imgSrc = `${API_BASE}/media/${imgSrc}`;

                  return (
                    <div
                      key={banner.id}
                      className={`rounded-3xl border p-5 flex flex-col gap-4 shadow-3xs relative overflow-hidden transition-all ${
                        theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 text-left min-w-0">
                          <h3 className={`font-semibold text-base truncate ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{banner.title}</h3>
                          <p className="text-xs text-zinc-500 line-clamp-2">{banner.description}</p>
                        </div>
                        <span className={`text-[10px] font-normal px-2 py-0.5 rounded-md shrink-0 border uppercase tracking-wider ${
                          banner.bg === 'bg-teal-50' ? 'bg-teal-500/10 text-teal-655 border-teal-500/20' :
                          banner.bg === 'bg-pink-50' ? 'bg-pink-500/10 text-pink-655 border-pink-500/20' :
                          'bg-indigo-500/10 text-indigo-550 border-indigo-500/20'
                        }`}>
                          {banner.bg}
                        </span>
                      </div>

                      <div className="relative w-full aspect-[2/1] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shadow-inner border border-zinc-200/50">
                        {imgSrc ? (
                          <img src={imgSrc} alt={banner.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400">
                            <Plus size={24} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                        <div className="space-y-1">
                          <p>Button: <strong className="text-zinc-800 dark:text-zinc-350">{banner.buttonText}</strong></p>
                          <p>Category: <strong className="text-zinc-800 dark:text-zinc-355">{banner.categoryRef}</strong></p>
                        </div>
                        <div className="text-right space-y-1">
                          <p>Order: <strong className="text-zinc-800 dark:text-zinc-350">{banner.order}</strong></p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 mt-2.5">
                        <button
                          onClick={() => handleOpenMarketingBannerModal('edit', banner)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-normal border transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 ${
                            theme === 'dark' ? 'bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-350' : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                          }`}
                        >
                          <Edit size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMarketingBanner(banner.id)}
                          className="flex-1 py-2.5 rounded-xl text-xs font-normal bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20 text-red-650 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
                {marketingBanners.length === 0 && (
                  <div className={`col-span-full py-16 text-center rounded-3xl border border-dashed ${
                    theme === 'dark' ? 'border-[#1e293b] text-zinc-500' : 'border-zinc-200 text-zinc-400'
                  }`}>
                    <Plus size={36} className="mx-auto opacity-40 mb-3" />
                    <p className="text-sm">No marketing banners configured. Click "Add Marketing Banner" to get started.</p>
                  </div>
                )}
              </div>
            </div>
          )}


          {activePage === 'settings' && (
            <div className="space-y-6 text-left animate-fade-in admin-settings-container">
              <div>
                <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Store Configurations</h2>
                <p className="text-xs text-zinc-500 font-normal mt-1">Manage public details, checkout configurations, and store accessibility settings.</p>
              </div>

              {/* Tab Header Navigation */}
              <div className={`flex flex-wrap border rounded-2xl p-1 gap-2 ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'
                }`}>
                <button
                  type="button"
                  onClick={() => setSettingsTab('general')}
                  className={`px-4 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${settingsTab === 'general'
                      ? 'bg-[#8b5cf6] text-white shadow-xs'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-850 hover:bg-zinc-100'
                    }`}
                >
                  General Settings
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('checkout')}
                  className={`px-4 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${settingsTab === 'checkout'
                      ? 'bg-[#8b5cf6] text-white shadow-xs'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-850 hover:bg-zinc-100'
                    }`}
                >
                  Checkout Config
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('status')}
                  className={`px-4 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${settingsTab === 'status'
                      ? 'bg-[#8b5cf6] text-white shadow-xs'
                      : theme === 'dark' ? 'text-zinc-400 hover:text-white hover:bg-zinc-900/50' : 'text-zinc-650 hover:text-zinc-850 hover:bg-zinc-100'
                    }`}
                >
                  Store Operations
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsTab('danger')}
                  className={`px-4 py-2 rounded-xl text-xs font-normal transition-all cursor-pointer ${settingsTab === 'danger'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'text-red-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-500/10'
                    }`}
                >
                  Danger Zone
                </button>
              </div>

              {/* Tab Contents */}
              <form onSubmit={handleSaveSettings} className={`p-6 rounded-3xl border transition-all ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b]' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                {settingsTab === 'general' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      {/* Logo Upload Section */}
                      <div className={`mb-6 p-4 border rounded-xl ${theme === 'dark' ? 'border-[#1e293b] bg-[#0f1626]' : 'border-zinc-200 bg-white'}`}>
                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                          <div className="shrink-0">
                            <h4 className={`text-sm font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Store Logo</h4>
                            <p className="text-xs text-zinc-500 mt-1">Upload your brand logo. Recommended format: PNG with transparent background.</p>
                          </div>

                          <div className="flex-1 flex items-center gap-4">
                            {settings?.logoImage ? (
                              <div className="h-12 w-auto bg-zinc-100 dark:bg-zinc-800 rounded p-1 border border-zinc-200 dark:border-zinc-700">
                                <img src={settings.logoImage.startsWith('http') ? settings.logoImage : `${API_BASE}${settings.logoImage}`} alt="Store Logo" className="h-full w-auto object-contain" />
                              </div>
                            ) : (
                              <div className="h-12 w-12 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                <span className="text-[10px] text-zinc-400">None</span>
                              </div>
                            )}

                            <div className="flex-1 relative">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                disabled={uploadingLogo}
                                className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-normal file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-500/10 dark:file:text-purple-400 cursor-pointer"
                              />
                              {uploadingLogo && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                  <Loader2 className="animate-spin w-4 h-4 text-purple-600" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <h3 className={`text-base font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>General Settings</h3>
                      <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Edit public contact parameters shown on the storefront.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Public Support Phone</label>
                        <input
                          type="text"
                          value={settingsForm.contactPhone}
                          onChange={e => setSettingsForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                          placeholder="+91 XXXXX XXXXX"
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Contact Email Address</label>
                        <input
                          type="email"
                          value={settingsForm.contactEmail}
                          onChange={e => setSettingsForm(prev => ({ ...prev, contactEmail: e.target.value }))}
                          placeholder="support@vdgfashion.com"
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Boutique Physical Address</label>
                      <textarea
                        rows={3}
                        value={settingsForm.storeAddress}
                        onChange={e => setSettingsForm(prev => ({ ...prev, storeAddress: e.target.value }))}
                        placeholder="Full physical address..."
                        required
                        className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                            ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Boutique About Text</label>
                      <textarea
                        rows={2}
                        value={settingsForm.aboutText}
                        onChange={e => setSettingsForm(prev => ({ ...prev, aboutText: e.target.value }))}
                        placeholder="Trendy looks for every vibe. Stay stylish, every day."
                        required
                        className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                            ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                            : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                          }`}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Facebook Page URL</label>
                        <input
                          type="url"
                          value={settingsForm.facebookUrl}
                          onChange={e => setSettingsForm(prev => ({ ...prev, facebookUrl: e.target.value }))}
                          placeholder="https://facebook.com/..."
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Instagram Profile URL</label>
                        <input
                          type="url"
                          value={settingsForm.instagramUrl}
                          onChange={e => setSettingsForm(prev => ({ ...prev, instagramUrl: e.target.value }))}
                          placeholder="https://instagram.com/..."
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">YouTube Channel URL</label>
                        <input
                          type="url"
                          value={settingsForm.youtubeUrl}
                          onChange={e => setSettingsForm(prev => ({ ...prev, youtubeUrl: e.target.value }))}
                          placeholder="https://youtube.com/..."
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === 'checkout' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className={`text-base font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Checkout Configurations</h3>
                      <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Control pricing, active promotional code discounts, and shipping rules.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Active Promo Code Name</label>
                        <input
                          type="text"
                          value={settingsForm.activePromoCode}
                          onChange={e => setSettingsForm(prev => ({ ...prev, activePromoCode: e.target.value.toUpperCase() }))}
                          placeholder="e.g. SUMMER20"
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Promo Discount Percentage (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={settingsForm.activePromoDiscount}
                          onChange={e => setSettingsForm(prev => ({ ...prev, activePromoDiscount: Math.min(100, Math.max(0, parseInt(e.target.value) || 0)) }))}
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Free Shipping Threshold limit (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={settingsForm.freeShippingThreshold}
                          onChange={e => setSettingsForm(prev => ({ ...prev, freeShippingThreshold: Math.max(0, parseInt(e.target.value) || 0) }))}
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
                              : 'bg-zinc-50 border-zinc-200 text-zinc-950 focus:border-purple-500'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-normal text-zinc-400 uppercase tracking-wider">Flat Shipping Fee (₹)</label>
                        <input
                          type="number"
                          min="0"
                          value={settingsForm.shippingFee}
                          onChange={e => setSettingsForm(prev => ({ ...prev, shippingFee: Math.max(0, parseInt(e.target.value) || 0) }))}
                          required
                          className={`w-full p-3 rounded-xl border outline-none text-xs ${theme === 'dark'
                              ? 'bg-zinc-950 border-[#1e293b] text-white focus:border-purple-500'
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
                      <h3 className={`text-base font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Boutique Operations</h3>
                      <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Toggle store operation between fully active and maintenance modes.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, isStoreOpen: true }))}
                        className={`p-5 rounded-2xl border text-left flex items-start space-x-4 cursor-pointer transition-all ${settingsForm.isStoreOpen
                            ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
                            : theme === 'dark' ? 'border-[#1e293b] text-zinc-400 hover:bg-zinc-900/30' : 'border-zinc-200 text-zinc-550 hover:bg-zinc-50'
                          }`}
                      >
                        <CheckCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-normal text-sm">Active Storefront (Open)</h4>
                          <p className="text-[10px] text-zinc-500 font-normal mt-1">Customers can browse collections, modify shopping carts, and submit orders.</p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSettingsForm(prev => ({ ...prev, isStoreOpen: false }))}
                        className={`p-5 rounded-2xl border text-left flex items-start space-x-4 cursor-pointer transition-all ${!settingsForm.isStoreOpen
                            ? 'border-rose-500 bg-rose-500/5 text-rose-600 dark:text-rose-400'
                            : theme === 'dark' ? 'border-[#1e293b] text-zinc-400 hover:bg-zinc-900/30' : 'border-zinc-200 text-zinc-550 hover:bg-zinc-50'
                          }`}
                      >
                        <XCircle className="h-6 w-6 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-normal text-sm">Maintenance Mode (Closed)</h4>
                          <p className="text-[10px] text-zinc-500 font-normal mt-1">Order submissions are blocked with a clean visual notice. Admins can still access dashboards.</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {settingsTab === 'danger' && (
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <h3 className="text-base font-normal text-red-505 text-red-500 uppercase tracking-wider">Danger Zone</h3>
                      <p className="text-[10px] text-zinc-500 font-normal mt-0.5">Database maintenance, reset scripts, and system wipe controls.</p>
                    </div>

                    <div className={`p-5 rounded-2xl border ${theme === 'dark' ? 'border-red-900/30 bg-red-950/10' : 'border-red-150 bg-red-50/20'
                      }`}>
                      <h4 className="text-xs font-normal text-red-500 uppercase tracking-wider mb-1">Erase Registry Data</h4>
                      <p className="text-[10px] text-zinc-500 font-normal mb-4 leading-relaxed">
                        Warning: Clicking the button below will clear all registered products, categories, subcategories, customer orders, and reviews. This action is irreversible.
                      </p>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirm('WARNING: This will trigger a database reset OTP. Are you sure?')) return;
                          setLoadingData(true);
                          try {
                            const token = sessionStorage.getItem('access_token');
                            const res = await fetch(`${API_BASE}/api/products/request-clear-otp/`, {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/json',
                                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                              }
                            });
                            if (res.ok) {
                              showToast('OTP sent to admin email!', 'success');
                              setShowWipeOtpModal(true);
                            } else {
                              showToast('Failed to request OTP.', 'warning');
                            }
                          } catch (e) {
                            showToast('Network error requesting OTP.', 'warning');
                          } finally {
                            setLoadingData(false);
                          }
                        }}
                        className="py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white text-xs font-normal rounded-xl transition-colors cursor-pointer"
                      >
                        Reset / Clear Database
                      </button>
                    </div>
                  </div>
                )}

                {/* Wipe OTP Modal */}
                {showWipeOtpModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-sm rounded-2xl shadow-xl overflow-hidden ${theme === 'dark' ? 'bg-[#0f172a] border border-[#1e293b]' : 'bg-white'}`}>
                      <div className="p-6">
                        <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>Verify Database Wipe</h3>
                        <p className={`text-xs mb-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}`}>
                          A 6-digit OTP has been sent to Vdgfashion6@gmail.com. It expires in 10 minutes.
                        </p>
                        <input
                          type="text"
                          maxLength={6}
                          value={wipeOtp}
                          onChange={(e) => setWipeOtp(e.target.value)}
                          placeholder="Enter 6-digit OTP"
                          className={`w-full h-10 px-3 rounded-lg text-sm border focus:outline-none focus:ring-1 focus:ring-rose-500 text-center tracking-widest font-mono mb-4 ${theme === 'dark' ? 'bg-[#1e293b] border-[#334155] text-white' : 'bg-zinc-50 border-zinc-200'}`}
                        />
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setShowWipeOtpModal(false);
                              setWipeOtp('');
                            }}
                            className={`flex-1 py-2 rounded-xl text-xs font-medium border ${theme === 'dark' ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'}`}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={async () => {
                              if (wipeOtp.length !== 6) return showToast('Enter 6-digit OTP', 'warning');
                              setLoadingData(true);
                              try {
                                const token = sessionStorage.getItem('access_token');
                                const res = await fetch(`${API_BASE}/api/products/clear-all/`, {
                                  method: 'POST',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                                  },
                                  body: JSON.stringify({ otp: wipeOtp })
                                });
                                if (res.ok) {
                                  showToast('Database wiped clean!', 'success');
                                  setShowWipeOtpModal(false);
                                  setWipeOtp('');
                                  syncData();
                                } else {
                                  showToast('Invalid or expired OTP.', 'error');
                                }
                              } catch (e) {
                                showToast('Network error clearing database.', 'warning');
                              } finally {
                                setLoadingData(false);
                              }
                            }}
                            className="flex-1 py-2 rounded-xl text-xs font-medium bg-red-600 hover:bg-red-500 text-white"
                          >
                            Confirm Erase
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Button for active config tabs */}
                {settingsTab !== 'danger' && (
                  <div className="mt-6 pt-4 border-t border-zinc-150 dark:border-[#1e293b] flex justify-end">
                    <button
                      type="submit"
                      className="py-2.5 px-5 bg-[#8b5cf6] hover:bg-purple-650 text-white text-xs font-normal rounded-xl transition-colors cursor-pointer active:scale-95 shadow-md shadow-purple-500/10"
                    >
                      Save Configuration
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

          {activePage === 'offers' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Offers & Discounts Management</h2>
                  <p className="text-xs text-zinc-500 font-normal mt-1">Dashboard &gt; Offers</p>
                </div>
              </div>

              {/* Summary Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-500/20">
                    <Percent className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Active Promo Offers</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{products.filter(p => p.tag_type === 'discount').length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-teal-500/20">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Catalog Products</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{products.length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                    <Star className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Average Rating</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>
                      {(products.reduce((acc, p) => acc + (p.rating || 0), 0) / (products.length || 1)).toFixed(1)} / 5.0
                    </h3>
                  </div>
                </div>
              </div>

              {/* Grid split: Left is Active Offers list, Right is Add Offers Search */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

                {/* Active Offers list: 7/12 cols */}
                <div className={`xl:col-span-7 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="flex justify-between items-center mb-6 border-b border-zinc-100 dark:border-[#1e293b] pb-4">
                    <div>
                      <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Active Discount Offers</h3>
                      <p className="text-[11px] text-zinc-400 font-normal mt-0.5">Manage current discounted products live on the website.</p>
                    </div>
                  </div>

                  <div className="overflow-x-auto min-h-[200px]">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${theme === 'dark' ? 'border-[#1e293b]/60 text-zinc-400' : 'border-zinc-150 text-zinc-550'}`}>
                          <th className="py-3 px-2">Product</th>
                          <th className="py-3 px-2">Original</th>
                          <th className="py-3 px-2">Promo Price</th>
                          <th className="py-3 px-2 text-center">Discount</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 dark:divide-[#1e293b]/60 text-xs">
                        {products.filter(p => p.tag_type === 'discount').length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-8 text-center text-zinc-400 font-normal">
                              No products are currently in offers. Use the search panel on the right to add some.
                            </td>
                          </tr>
                        ) : (
                          products.filter(p => p.tag_type === 'discount').map(p => {
                            const original = p.original_price || p.price;
                            return (
                              <tr key={p.id} className={`hover:bg-zinc-50/50 dark:hover:bg-[#172033]/30 transition-colors`}>
                                <td className="py-3 px-2 flex items-center gap-2.5 font-normal">
                                  {p.image ? (
                                    <img src={getImageUrl(p.image)} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-white border border-zinc-200 dark:border-[#1e293b] p-0.5" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                                      <Package size={14} className="text-zinc-400" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[150px]" title={p.name}>{p.name}</p>
                                    <p className="text-[10px] text-zinc-450 dark:text-zinc-400">{p.main_category || 'General'}</p>
                                  </div>
                                </td>
                                <td className="py-3 px-2 text-zinc-400 font-normal">₹{original}</td>
                                <td className="py-3 px-2 font-semibold text-zinc-900 dark:text-zinc-100">₹{p.price}</td>
                                <td className="py-3 px-2 text-center font-normal">
                                  <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-lg bg-[#e11d48] text-white uppercase">
                                    {p.discount || 'DISCOUNT'}
                                  </span>
                                </td>
                                <td className="py-3 px-2 text-right space-x-1.5">
                                  <button
                                    onClick={() => {
                                      setSelectedProductForOffer(p);
                                      setOfferDiscountStr(p.discount || '');
                                      setOfferPromoPrice(p.price || '');
                                      setOfferModalMode('edit');
                                      setIsOfferModalOpen(true);
                                    }}
                                    className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Edit Offer"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button
                                    onClick={() => handleRemoveOffer(p)}
                                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors cursor-pointer inline-flex"
                                    title="Remove Offer"
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

                {/* Add Offers Catalog search: 5/12 cols */}
                <div className={`xl:col-span-5 p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white' : 'bg-white border-zinc-200 shadow-3xs'
                  }`}>
                  <div className="mb-6 pb-4 border-b border-zinc-100 dark:border-[#1e293b]">
                    <h3 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Search & Add Offers</h3>
                    <p className="text-[11px] text-zinc-400 font-normal mt-0.5">Search catalog products to apply promotional discounts.</p>
                  </div>

                  <div className="relative mb-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Search products by name..."
                      value={offersSearchQuery}
                      onChange={(e) => setOffersSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2.5 text-xs font-normal border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/10 transition-all ${theme === 'dark'
                          ? 'bg-[#172033] border-[#1e293b] text-zinc-100 placeholder-zinc-550 focus:border-[#8b5cf6]'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400 focus:border-purple-500'
                        }`}
                    />
                  </div>

                  <div className="overflow-y-auto max-h-[360px] space-y-2 pr-1">
                    {(() => {
                      const nonOfferProducts = products.filter(p => p.tag_type !== 'discount');
                      const filtered = nonOfferProducts.filter(p =>
                        p.name.toLowerCase().includes(offersSearchQuery.toLowerCase()) ||
                        (p.main_category && p.main_category.toLowerCase().includes(offersSearchQuery.toLowerCase()))
                      );

                      if (filtered.length === 0) {
                        return (
                          <p className="text-center py-8 text-xs text-zinc-400">
                            {offersSearchQuery ? 'No matching products found.' : 'Search or browse products above.'}
                          </p>
                        );
                      }

                      return filtered.map(p => (
                        <div key={p.id} className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-colors ${theme === 'dark' ? 'bg-[#172033]/40 border-[#1e293b]/60 hover:bg-[#172033]/80' : 'bg-zinc-50/50 border-zinc-150 hover:bg-zinc-50'
                          }`}>
                          <div className="flex items-center gap-2.5 min-w-0">
                            {p.image ? (
                              <img src={getImageUrl(p.image)} alt={p.name} className="w-8 h-8 rounded-lg object-contain bg-white border border-zinc-200 dark:border-[#1e293b] p-0.5 shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700 shrink-0">
                                <Package size={14} className="text-zinc-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[160px]" title={p.name}>{p.name}</p>
                              <p className="text-[10px] text-zinc-450 dark:text-zinc-400">₹{p.price}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedProductForOffer(p);
                              setOfferDiscountStr('20% OFF');
                              // Pre-calculate 20% discount as default suggestion
                              const currentPrice = parseFloat(p.price);
                              const suggestion = Math.round(currentPrice * 0.8);
                              setOfferPromoPrice(suggestion || '');
                              setOfferModalMode('add');
                              setIsOfferModalOpen(true);
                            }}
                            className="py-1.5 px-3 bg-[#8b5cf6] hover:bg-purple-650 text-white rounded-lg text-[10px] font-semibold transition-colors cursor-pointer shrink-0"
                          >
                            Add Offer
                          </button>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

              </div>
            </div>
          )}

          {activePage === 'users' && (
            <div className="space-y-6 text-left animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className={`text-2xl font-normal tracking-tight ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>Users Registry</h2>
                  <p className="text-xs text-zinc-500 font-normal mt-1">Dashboard &gt; Users</p>
                </div>
              </div>

              {/* 4 Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Total Registered Users</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-purple-500/20">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Staff / Admins</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.filter(u => u.is_staff).length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                    <Users className="h-6 w-6 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Standard Customers</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.filter(u => !u.is_staff).length}</h3>
                  </div>
                </div>

                <div className={`p-5 rounded-3xl border transition-all flex items-center gap-4 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/40' : 'bg-white border-zinc-200 text-zinc-800 shadow-3xs'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-amber-500/20">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-zinc-400 text-[11px] font-normal uppercase tracking-wider">Active Accounts</p>
                    <h3 className={`text-2xl font-normal leading-none mt-1 ${theme === 'dark' ? 'text-white' : 'text-zinc-900'}`}>{usersList.filter(u => u.is_active).length}</h3>
                  </div>
                </div>
              </div>

              {/* Table Card */}
              <div className={`p-6 rounded-3xl border ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white' : 'bg-white border-zinc-200 shadow-3xs'
                }`}>
                {/* Search Header */}
                <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 mb-6">
                  <div>
                    <h3 className={`font-normal text-sm ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>User Directory</h3>
                    <p className="text-[10px] text-zinc-400 font-normal mt-0.5">Filter, configure, and promote/demote registered customer accounts.</p>
                  </div>
                  <div className="relative w-full max-w-[340px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <input
                      type="text"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      placeholder="Search users by name, email..."
                      className={`w-full rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-indigo-500 border ${theme === 'dark'
                          ? 'bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-800 placeholder-zinc-400'
                        }`}
                    />
                  </div>
                </div>

                {/* Main Table view */}
                <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full min-w-[900px] text-left text-sm font-normal">
                    <thead className={`font-normal tracking-normal border-b pb-2.5 text-[11px] ${theme === 'dark' ? 'border-[#1e293b] text-zinc-400' : 'border-zinc-100 text-black'
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
                    <tbody className="divide-y divide-zinc-100 dark:divide-[#1e293b]/60 text-zinc-700 dark:text-zinc-300">
                      {paginatedUsers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-12 text-center text-xs font-normal text-zinc-400">
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
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${gradient} flex items-center justify-center text-white font-normal text-xs shadow-3xs shrink-0 select-none`}>
                                    {initials}
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`font-normal text-[13px] leading-snug truncate ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>
                                      {u.username}
                                    </p>
                                    <p className="text-[11px] text-zinc-400 font-normal tracking-wide truncate max-w-[200px]">
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
                                  className={`px-3 py-1 rounded-full text-[9px] font-normal border transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-3xs ${u.is_staff
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
                                  className={`px-3 py-1 rounded-full text-[9px] font-normal border transition-all duration-200 cursor-pointer active:scale-95 hover:shadow-3xs ${u.is_active
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
                  <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800/80 text-xs font-normal select-none leading-none mt-4">
                    <span className="text-zinc-400">
                      Showing <span className="text-[#8b5cf6] dark:text-[#a855f7] font-normal">{Math.min(filteredUsers.length, (userPage - 1) * USERS_ITEMS_PER_PAGE + 1)}</span> to <span className="text-[#8b5cf6] dark:text-[#a855f7] font-normal">{Math.min(filteredUsers.length, userPage * USERS_ITEMS_PER_PAGE)}</span> of <span className="font-normal text-zinc-650 dark:text-zinc-300">{filteredUsers.length}</span> users
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={userPage === 1}
                        onClick={() => setUserPage(prev => Math.max(1, prev - 1))}
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#1e293b] font-normal active:scale-95"
                      >
                        ◀ Prev
                      </button>
                      {getPaginatedRange(userPage, totalUserPages).map((pageNum) => {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setUserPage(pageNum)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-normal transition-all cursor-pointer active:scale-90 ${userPage === pageNum
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
                        className="py-2 px-3 bg-zinc-100 hover:bg-zinc-250 dark:bg-zinc-800 dark:hover:bg-zinc-700 disabled:opacity-40 text-zinc-700 dark:text-zinc-300 rounded-lg transition-colors cursor-pointer border border-zinc-200/40 dark:border-[#1e293b] font-normal active:scale-95"
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
      {uploadProgress !== null ? (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full max-w-[360px] p-6 rounded-3xl border shadow-2xl transition-all duration-250 animate-fade-in ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/90' : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50'
            }`}>
            <div className="space-y-4 text-center">
              <Loader2 size={28} className="animate-spin text-indigo-500 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold tracking-tight">Importing Products</h4>
                <p className={`text-[10.5px] font-normal ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'}`}>
                  Downloading images and saving database records...
                </p>
              </div>

              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-200/10 shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <span>{uploadProgress}% Complete</span>
                <span>{uploadProgressInfo}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  uploadCancelledRef.current = true;
                }}
                className="w-full py-2.5 px-4 mt-2 bg-rose-600 hover:bg-rose-500 active:scale-95 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-600/10"
              >
                Cancel Upload
              </button>
            </div>
          </div>
        </div>
      ) : loadingData ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-xl text-xs font-normal border ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700'
            }`}>
            <Loader2 size={14} className="animate-spin text-indigo-500" />
            Syncing data...
          </div>
        </div>
      ) : null}

      {/* Floating CRUD Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className={`w-full ${modalType === 'product' ? 'max-w-[780px]' : 'max-w-[500px]'} rounded-3xl border shadow-2xl overflow-hidden transition-all duration-200 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-black/85' : 'bg-white border-zinc-200 text-zinc-800 shadow-zinc-200/50'
            }`}>
            <div className="max-h-[90vh] overflow-y-auto p-6 space-y-4 text-left custom-scrollbar">
              <div className={`flex justify-between items-center pb-4 border-b ${theme === 'dark' ? 'border-[#1e293b]' : 'border-zinc-200/65'}`}>
                <h3 className={`text-base font-semibold ${theme === 'dark' ? 'text-white' : 'text-zinc-900'} ${modalType === 'category' || modalType === 'subcategory' ? 'text-[20px] capitalize tracking-tight font-sans' : 'uppercase tracking-wider'}`}>
                  {modalMode === 'edit' ? 'Edit' : 'Create New'} {modalType === 'product' ? 'Product' : modalType === 'category' ? 'Category' : modalType === 'subcategory' ? 'Subcategory' : modalType === 'user' ? 'User Account' : modalType}
                </h3>
                <button onClick={() => setModalType(null)} className={`cursor-pointer transition-colors ${theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-zinc-400 hover:text-zinc-800'}`}><X size={modalType === 'category' || modalType === 'subcategory' ? 20 : 16} /></button>
              </div>

              {modalType === 'product' && (
                <form onSubmit={handleSaveProduct} className="space-y-6 text-sm font-normal">

                  {/* 1. Featured Image Section */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${theme === 'dark' ? 'bg-[#172033]/50 border-[#1e293b]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                    }`}>
                    <h4 className={`text-[13px] font-semibold flex items-center gap-2.5 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"}`}>
                      <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-normal text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">1</span>
                      Media Assets
                    </h4>
                    <div className="space-y-1.5">
                      <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Upload local file</label>
                      <div className="relative flex items-center justify-center">
                        <label className={`w-full flex flex-col items-center justify-center p-3 h-[46px] rounded-xl border border-dashed cursor-pointer transition-all ${theme === 'dark'
                            ? 'bg-[#172033] border-[#1e293b] hover:bg-[#202736] text-zinc-355 hover:border-indigo-500/40'
                            : 'bg-white border-zinc-300 hover:bg-zinc-100 text-zinc-650 hover:border-indigo-500/40 shadow-3xs'
                          }`}>
                          <div className="flex items-center gap-2">
                            {uploadingImage ? (
                              <Upload size={14} className="animate-spin text-indigo-500" />
                            ) : productForm.image ? (
                              <CheckCircle size={14} className="text-emerald-500" />
                            ) : (
                              <Upload size={14} className="animate-pulse text-zinc-400" />
                            )}
                            <span className="text-[10.5px] font-normal tracking-wide">
                              {uploadingImage ? 'Uploading...' : productForm.image ? 'File Linked' : 'Choose Local File'}
                            </span>
                          </div>
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* 2. Group & Categories Section */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${theme === 'dark' ? 'bg-[#172033]/50 border-[#1e293b]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                    }`}>
                    <h4 className={`text-[13px] font-semibold flex items-center gap-2.5 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"}`}>
                      <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-normal text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">2</span>
                      Group & Classification
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Category Dropdown - root categories only */}
                      <div className="space-y-1.5">
                        <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Category <span className="text-red-400">*</span></label>
                        <select
                          required
                          value={productForm.main_category}
                          onChange={(e) => {
                            const selectedCat = rootCategories.find(c => String(c.id) === String(e.target.value));
                            setProductForm(prev => ({
                              ...prev,
                              category: e.target.value,
                              parent_category: '' // reset subcategory when category changes
                            }));
                          }}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        >
                          <option value="" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Select Category...</option>
                          {rootCategories.map((c) => (
                            <option key={c.id} value={c.id} className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {/* Main Category Dropdown - filtered by selected category */}
                      <div className="space-y-1.5">
                        <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Main Category</label>
                        <select
                          value={productForm.category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, parent_category: e.target.value, sub_category: '' }))}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            } ${!productForm.main_category ? 'opacity-50' : ''}`}
                          disabled={!productForm.main_category}
                        >
                          <option value="" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Select Category...</option>
                          {(() => {
                            const selectedCatName = rootCategories.find(c => String(c.id) === String(productForm.main_category))?.name;
                            return mainCategories
                              .filter(mc => mc.main_category === selectedCatName)
                              .map(mc => (
                                <option key={mc.id} value={mc.name} className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>{mc.name}</option>
                              ));
                          })()}
                        </select>
                        {productForm.main_category && mainCategories.filter(mc => mc.main_category === rootCategories.find(c => String(c.id) === String(productForm.main_category))?.name).length === 0 && (
                          <p className="text-[10px] text-zinc-400 font-normal mt-1">No main categories for this category</p>
                        )}
                      </div>

                      {/* Subcategory Dropdown - filtered by selected main category */}
                      <div className="space-y-1.5">
                        <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Subcategory</label>
                        <select
                          value={productForm.sub_category}
                          onChange={(e) => setProductForm(prev => ({ ...prev, sub_category: e.target.value }))}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            } ${!productForm.category ? 'opacity-50' : ''}`}
                          disabled={!productForm.category}
                        >
                          <option value="" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Select Subcategory...</option>
                          {(() => {
                            return subCategories
                              .filter(sc => sc.main_category === productForm.category)
                              .map(sc => (
                                <option key={sc.id} value={sc.name} className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>{sc.name}</option>
                              ));
                          })()}
                        </select>
                        {productForm.category && subCategories.filter(sc => sc.main_category === productForm.category).length === 0 && (
                          <p className="text-[10px] text-zinc-400 font-normal mt-1">No subcategories for this main category</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 3. Description & Core Attributes */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${theme === 'dark' ? 'bg-[#172033]/50 border-[#1e293b]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                    }`}>
                    <h4 className={`text-[13px] font-semibold flex items-center gap-2.5 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"}`}>
                      <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-normal text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">3</span>
                      Product Details
                    </h4>
                    <div className="space-y-1.5">
                      <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Product name *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                          }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Description *</label>
                      <textarea
                        required
                        value={productForm.description}
                        onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                        className={`w-full p-3 h-20 rounded-xl border transition-all focus:outline-none resize-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] text-white border-[#1e293b] focus:border-indigo-500' : 'bg-white text-zinc-800 border-zinc-200 focus:border-indigo-500 focus:bg-white'
                          }`}
                      />
                    </div>
                  </div>

                  {/* 5. Simple Product Information (Pricing & Stock) */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${theme === 'dark' ? 'bg-[#172033]/50 border-[#1e293b]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                    }`}>
                    <h4 className={`text-[13px] font-semibold flex items-center gap-2.5 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"}`}>
                      <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-normal text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">5</span>
                      Pricing & Inventory
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="space-y-1.5">
                        <label className={`h-8 flex items-end pb-1 text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Price (INR) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.price}
                          onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`h-8 flex items-end pb-1 text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Sale price (original)</label>
                        <input
                          type="number"
                          value={productForm.original_price}
                          onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`h-8 flex items-end pb-1 text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Quantity (stock) *</label>
                        <input
                          type="number"
                          required
                          value={productForm.stock}
                          onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className={`h-8 flex items-end pb-1 text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Sku</label>
                        <input
                          type="text"
                          value={productForm.sku}
                          onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                          placeholder="e.g., TS-GRN-001"
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        />
                      </div>
                    </div>

                    {/* Sizes Row */}
                    <div className="space-y-1.5 pt-2">
                      <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Sizes (comma separated)</label>
                      <input
                        type="text"
                        value={productForm.sizes || ''}
                        onChange={(e) => setProductForm({ ...productForm, sizes: e.target.value })}
                        placeholder="e.g., S, M, L, XL or 28, 30, 32 or 0-3M, 3-6M"
                        className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                          }`}
                      />
                    </div>

                    {/* Promotion & Tags (Offers) Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="space-y-1.5 font-normal text-left">
                        <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Product Tag (Badge)</label>
                        <select
                          value={productForm.tag_type || ''}
                          onChange={(e) => setProductForm({ ...productForm, tag_type: e.target.value || null })}
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs cursor-pointer ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        >
                          <option value="" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>None (No Badge)</option>
                          <option value="discount" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Discount / Offer (Shows in Offers Page)</option>
                          <option value="new" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>New Arrival</option>
                          <option value="bestseller" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Bestseller</option>
                        </select>
                      </div>
                      <div className="space-y-1.5 font-normal text-left">
                        <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>Discount Label / Value</label>
                        <input
                          type="text"
                          value={productForm.discount || ''}
                          onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                          placeholder="e.g., 20% or 10% OFF"
                          className={`w-full p-3 rounded-xl border transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b] text-white focus:border-indigo-500' : 'bg-white border-zinc-200 text-zinc-800 focus:border-indigo-500 focus:bg-white'
                            }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Status Selection */}
                  <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${theme === 'dark' ? 'bg-[#172033]/50 border-[#1e293b]' : 'bg-zinc-50 border-zinc-200/80 shadow-3xs'
                    }`}>
                    <h4 className={`text-[13px] font-semibold flex items-center gap-2.5 ${theme === "dark" ? "text-zinc-200" : "text-zinc-800"}`}>
                      <span className="flex items-center justify-center w-5.5 h-5.5 rounded-xl bg-indigo-600 text-white font-normal text-[11px] shadow-sm shadow-indigo-600/25 shrink-0 select-none">6</span>
                      Publishing Control
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div
                        onClick={() => setProductForm({ ...productForm, status: 'published' })}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between shadow-3xs hover:shadow-2xs ${productForm.status === 'published'
                            ? (theme === 'dark' ? 'border-emerald-500 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                            : (theme === 'dark' ? 'border-[#1e293b] hover:border-indigo-500/40 bg-[#172033]' : 'border-zinc-200 hover:border-indigo-500/40 bg-white')
                          }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className={`font-semibold text-[12.5px] ${productForm.status === 'published'
                              ? (theme === 'dark' ? 'text-emerald-200' : 'text-emerald-950')
                              : (theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700')
                            }`}>Published</span>
                          <span className={`text-[10px] font-normal ${productForm.status === 'published'
                              ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700')
                              : (theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500')
                            }`}>Live on Website catalog</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${productForm.status === 'published'
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : (theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300 border-2')
                          }`}>
                          {productForm.status === 'published' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div
                        onClick={() => setProductForm({ ...productForm, status: 'draft' })}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between shadow-3xs hover:shadow-2xs ${productForm.status === 'draft'
                            ? (theme === 'dark' ? 'border-emerald-500 bg-emerald-950/20' : 'border-emerald-500 bg-emerald-50/50')
                            : (theme === 'dark' ? 'border-[#1e293b] hover:border-indigo-500/40 bg-[#172033]' : 'border-zinc-200 hover:border-indigo-500/40 bg-white')
                          }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className={`font-semibold text-[12.5px] ${productForm.status === 'draft'
                              ? (theme === 'dark' ? 'text-emerald-200' : 'text-emerald-950')
                              : (theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700')
                            }`}>Draft Mode</span>
                          <span className={`text-[10px] font-normal ${productForm.status === 'draft'
                              ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700')
                              : (theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500')
                            }`}>Offline Sandbox preview</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${productForm.status === 'draft'
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : (theme === 'dark' ? 'border-zinc-700' : 'border-zinc-300 border-2')
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
                      className={`py-3 px-6 border rounded-xl font-normal transition-all active:scale-95 cursor-pointer text-xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-zinc-100 border-transparent hover:bg-zinc-200 text-zinc-700"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`py-3 px-8 text-white font-normal rounded-xl transition-all active:scale-95 shadow-md cursor-pointer text-xs uppercase tracking-wider bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] hover:opacity-90 shadow-purple-500/20`}
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
                    <label className={`text-xs sm:text-sm font-normal flex items-center ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Category image <span className="text-red-500 ml-1">*</span>
                    </label>

                    <div className={`flex items-center p-6 border border-dashed rounded-2xl gap-5 transition-all ${theme === 'dark' ? 'bg-[#172033]/50 border-[#1e293b]' : 'bg-zinc-50/50 border-indigo-200'
                      } ${uploadingCategoryImage ? 'opacity-80' : ''
                      }`}>
                      {/* Left side preview */}
                      <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center overflow-hidden shrink-0 shadow-3xs ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-white border-zinc-200/60'
                        }`}>
                        {categoryForm.imagePreview || categoryForm.image ? (
                          <img src={getImageUrl(categoryForm.imagePreview || categoryForm.image)} alt="Preview" className="w-full h-full object-contain p-0.5" />
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
                          <span className="text-[14px] font-normal">
                            {uploadingCategoryImage ? 'Uploading Image...' : categoryForm.imagePreview ? 'Change Category Image' : 'Upload Category Image'}
                          </span>
                        </div>
                        <span className={`text-[11px] font-normal mt-1 ${theme === "dark" ? "text-zinc-400" : "text-zinc-500"}`}>
                          JPG, PNG or WEBP. Max size 2MB.
                        </span>
                        <input type="file" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* 2. Parent Category Select */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Main Category select <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      required
                      value={categoryForm.parent_category || ''}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parent_category: e.target.value })}
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm cursor-pointer transition-all shadow-3xs font-normal ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white" : "bg-white border-zinc-200 text-zinc-800"}`}
                    >
                      <option value="" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Select Category...</option>
                      {rootCategories.map((c) => (
                        <option key={c.id} value={c.name} className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Category Name */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Category name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Enter category name"
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                    />
                  </div>

                  {/* 4. Status */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Status <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={categoryForm.is_active ? 'true' : 'false'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.value === 'true' })}
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm cursor-pointer transition-all shadow-3xs font-normal ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white" : "bg-white border-zinc-200 text-zinc-800"}`}
                    >
                      <option value="true" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Active</option>
                      <option value="false" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Inactive</option>
                    </select>
                  </div>

                  {/* 5. Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className={`py-3 px-6 border rounded-xl font-normal transition-all active:scale-95 cursor-pointer text-xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingCategoryImage || !categoryForm.image}
                      className={`py-3 px-8 rounded-xl font-normal transition-all active:scale-95 shadow-md text-xs bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] text-white ${uploadingCategoryImage || !categoryForm.image
                          ? 'opacity-70 cursor-not-allowed grayscale-[20%] shadow-none'
                          : 'hover:opacity-90 shadow-purple-500/20 cursor-pointer'
                        }`}
                    >
                      {uploadingCategoryImage ? 'Uploading...' : 'Save Category'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'maincategory' && (
                <form onSubmit={handleSaveCategory} className="space-y-5 text-left text-sm">

                  {/* 1. Category Image (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label className={`font-semibold tracking-wide ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                      Category image <span className="text-zinc-400 ml-1 text-xs font-normal">(optional)</span>
                    </label>
                    <div
                      className={`relative flex items-center justify-center border-2 border-dashed ${theme === "dark" ? "border-zinc-700 bg-[#172033]" : "border-zinc-200 bg-zinc-50"} rounded-2xl w-full h-40 overflow-hidden group cursor-pointer transition-all hover:border-[#a855f7] ${uploadingCategoryImage ? 'opacity-80' : ''}`}
                      onClick={() => !uploadingCategoryImage && document.getElementById('mainCategoryImageUpload').click()}
                    >
                      {categoryForm.imagePreview || categoryForm.image ? (
                        <img src={getImageUrl(categoryForm.imagePreview || categoryForm.image)} alt="Preview" className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-[#a855f7] transition-colors">
                          <Upload size={16} className={uploadingCategoryImage ? 'animate-spin' : ''} />
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {uploadingCategoryImage ? 'Uploading Image...' : categoryForm.imagePreview ? 'Change Category Image' : 'Upload Category Image'}
                          </span>
                        </div>
                      )}
                      <input type="file" id="mainCategoryImageUpload" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                    </div>
                  </div>

                  {/* 2. Main Category Name */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Main Category name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Enter main category name"
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                    />
                  </div>

                  {/* 4. Status */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Status <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={categoryForm.is_active ? 'true' : 'false'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.value === 'true' })}
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm cursor-pointer transition-all shadow-3xs font-normal ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white" : "bg-white border-zinc-200 text-zinc-800"}`}
                    >
                      <option value="true" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Active</option>
                      <option value="false" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Inactive</option>
                    </select>
                  </div>

                  {/* 5. Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className={`py-3 px-6 border rounded-xl font-normal transition-all active:scale-95 cursor-pointer text-xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingCategoryImage}
                      className={`py-3 px-8 rounded-xl font-normal transition-all active:scale-95 shadow-md text-xs bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] text-white ${uploadingCategoryImage ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 shadow-purple-500/20 cursor-pointer'}`}
                    >
                      {uploadingCategoryImage ? 'Uploading...' : 'Save Main Category'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'subcategory' && (
                <form onSubmit={handleSaveCategory} className="space-y-5 text-left text-sm">

                  {/* 1. Category Image (Optional) */}
                  <div className="flex flex-col gap-2">
                    <label className={`font-semibold tracking-wide ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                      Category image <span className="text-zinc-400 ml-1 text-xs font-normal">(optional)</span>
                    </label>
                    <div
                      className={`relative flex items-center justify-center border-2 border-dashed ${theme === "dark" ? "border-zinc-700 bg-[#172033]" : "border-zinc-200 bg-zinc-50"} rounded-2xl w-full h-40 overflow-hidden group cursor-pointer transition-all hover:border-[#a855f7] ${uploadingCategoryImage ? 'opacity-80' : ''}`}
                      onClick={() => !uploadingCategoryImage && document.getElementById('subCategoryImageUpload').click()}
                    >
                      {categoryForm.imagePreview || categoryForm.image ? (
                        <img src={getImageUrl(categoryForm.imagePreview || categoryForm.image)} alt="Preview" className="w-full h-full object-contain p-0.5" />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-[#a855f7] transition-colors">
                          <Upload size={16} className={uploadingCategoryImage ? 'animate-spin' : ''} />
                          <span className="text-[10px] uppercase font-bold tracking-wider">
                            {uploadingCategoryImage ? 'Uploading Image...' : categoryForm.imagePreview ? 'Change Category Image' : 'Upload Category Image'}
                          </span>
                        </div>
                      )}
                      <input type="file" id="subCategoryImageUpload" accept="image/*" onChange={handleCategoryImageUpload} className="hidden" />
                    </div>
                  </div>

                  {/* 2. Parent Category Select */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Category select <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      required
                      value={categoryForm.category}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parent_category: e.target.value })}
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm cursor-pointer transition-all shadow-3xs font-normal ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white" : "bg-white border-zinc-200 text-zinc-800"}`}
                    >
                      <option value="" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Select Category...</option>
                      {mainCategories.map((c) => (
                        <option key={c.id} value={c.name} className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Subcategory Name */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Subcategory name type <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      placeholder="Enter subcategory name"
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                    />
                  </div>

                  {/* 4. Status */}
                  <div className="space-y-2">
                    <label className={`text-xs sm:text-sm font-normal ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                      Status <span className="text-red-500 ml-1">*</span>
                    </label>
                    <select
                      value={categoryForm.is_active ? 'true' : 'false'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, is_active: e.target.value === 'true' })}
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm cursor-pointer transition-all shadow-3xs font-normal ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white" : "bg-white border-zinc-200 text-zinc-800"}`}
                    >
                      <option value="true" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Active</option>
                      <option value="false" className={theme === "dark" ? "bg-[#172033] text-white font-normal" : "bg-white text-zinc-800 font-normal"}>Inactive</option>
                    </select>
                  </div>

                  {/* 5. Action Buttons */}
                  <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className={`py-3 px-6 border rounded-xl font-normal transition-all active:scale-95 cursor-pointer text-xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingCategoryImage}
                      className={`py-3 px-8 rounded-xl font-normal transition-all active:scale-95 shadow-md text-xs bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] text-white ${uploadingCategoryImage ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 shadow-purple-500/20 cursor-pointer'}`}
                    >
                      {uploadingCategoryImage ? 'Uploading...' : 'Save Subcategory'}
                    </button>
                  </div>
                </form>
              )}
              {modalType === 'bulk' && (
                <form onSubmit={handleBulkUpload} className="space-y-4 text-xs font-normal text-left">
                  <div className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-xl border border-indigo-500/15">
                    <h4 className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1">Spreadsheet Guidelines:</h4>
                    <ol className="list-decimal pl-4.5 space-y-1 text-[10px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      <li>Ensure your sheet has a header row at the top (e.g. <b>Name, SKU / Code, Price, MRP / Budget, Category, Main Category, Subcategory, Age Group, Stock, Image</b>).</li>
                      <li>For images, you can paste Google Drive <b>Share links</b>, absolute local system paths (e.g. <b>F:\images\tshirt.png</b>), or place the images in the <b>backend/bulk_upload_images/</b> folder and specify just the filename (e.g. <b>tshirt.png</b>). We will import them automatically!</li>
                    </ol>
                  </div>

                  <div className="space-y-1 mt-4">
                    <label className={theme === 'dark' ? 'text-zinc-400' : 'text-zinc-500'}>Upload TSV / CSV File</label>
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 h-36 text-center cursor-pointer transition-all ${dragActive
                          ? 'border-indigo-500 bg-indigo-500/5'
                          : theme === 'dark'
                            ? 'border-[#1e293b] bg-[#172033] hover:border-indigo-500/40 hover:bg-[#202736]'
                            : 'border-zinc-200 bg-white hover:border-indigo-500/40 hover:bg-zinc-50 shadow-3xs'
                        }`}
                    >
                      <Upload className="h-6 w-6 text-indigo-500 mb-2 animate-bounce" />
                      <span className="text-[10px] font-bold">
                        {bulkInput ? 'File Loaded Successfully' : 'Drag & Drop file here'}
                      </span>
                      <span className="text-[8.5px] text-zinc-400 mt-1 max-w-[250px]">
                        {bulkInput ? 'Click to browse or drop another file to replace' : 'Supports .csv, .tsv, .txt files or click to browse'}
                      </span>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".csv,.tsv,.txt"
                        className="hidden"
                      />
                    </div>
                  </div>

                  {parsedBulkPreview.length > 0 && (
                    <div className="space-y-1.5">
                      <label className={`text-[10px] uppercase font-bold tracking-wider ${theme === 'dark' ? 'text-zinc-400' : 'text-zinc-550'}`}>
                        Parsed Preview (Showing up to {parsedBulkPreview.length} Items)
                      </label>
                      <div className={`border rounded-xl overflow-auto max-h-60 text-[10px] ${theme === 'dark' ? 'border-[#1e293b] bg-[#172033]/50' : 'border-zinc-200 bg-zinc-50'}`}>
                        <table className="w-full text-left min-w-[650px]">
                          <thead className={`font-semibold border-b ${theme === 'dark' ? 'border-[#1e293b] text-zinc-400' : 'border-zinc-200 text-zinc-650'}`}>
                            <tr>
                              <th className="p-2 w-20">Images</th>
                              <th className="p-2">Name</th>
                              <th className="p-2">SKU</th>
                              <th className="p-2">Category</th>
                              <th className="p-2 text-right">Price</th>
                              <th className="p-2 text-right">Stock</th>
                              <th className="p-2">Image Link</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200/50 dark:divide-[#1e293b]/60">
                            {parsedBulkPreview.map((item, idx) => (
                              <tr key={idx} className="hover:bg-white/2">
                                <td className="p-2 flex gap-1.5 items-center min-h-[40px]">
                                  {item.image ? (
                                    <img
                                      src={getImageUrl(item.image)}
                                      alt="Img 1"
                                      className="w-8 h-8 rounded-md object-contain border border-zinc-200/20 dark:border-zinc-800 bg-white p-0.5 hover:scale-200 transition-all cursor-zoom-in"
                                      title="Main Image"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : null}
                                  {item.image_2 ? (
                                    <img
                                      src={getImageUrl(item.image_2)}
                                      alt="Img 2"
                                      className="w-8 h-8 rounded-md object-contain border border-zinc-200/20 dark:border-zinc-800 bg-white p-0.5 hover:scale-200 transition-all cursor-zoom-in"
                                      title="Second Image"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : null}
                                  {item.image_3 ? (
                                    <img
                                      src={getImageUrl(item.image_3)}
                                      alt="Img 3"
                                      className="w-8 h-8 rounded-md object-contain border border-zinc-200/20 dark:border-zinc-800 bg-white p-0.5 hover:scale-200 transition-all cursor-zoom-in"
                                      title="Third Image"
                                      onError={(e) => { e.target.style.display = 'none'; }}
                                    />
                                  ) : null}
                                  {!item.image && !item.image_2 && !item.image_3 && (
                                    <span className="text-zinc-500 font-mono text-[9px]">No Image</span>
                                  )}
                                </td>
                                <td className="p-2 font-semibold truncate max-w-[120px]">{item.name}</td>
                                <td className="p-2 font-mono">{item.sku || 'N/A'}</td>
                                <td className="p-2">{item.main_category}</td>
                                <td className="p-2 text-right">₹{item.price}</td>
                                <td className="p-2 text-right">{item.stock}</td>
                                <td className="p-2 truncate max-w-[150px] font-mono text-[9px] text-zinc-450">{item.image || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-end pt-2 border-t border-zinc-150 dark:border-zinc-800/80">
                    <button type="button" onClick={() => setModalType(null)} className={`py-2.5 px-4 border rounded-xl font-normal transition-all active:scale-95 cursor-pointer text-xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-zinc-100 border-transparent hover:bg-zinc-200 text-zinc-700"}`}>Cancel</button>
                    <button
                      type="submit"
                      className={`py-2.5 px-4 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 text-white bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] hover:opacity-90 shadow-purple-500/20`}
                    >
                      <Upload size={12} /> Execute Bulk Import
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'user' && (
                <form onSubmit={handleSaveUser} className="space-y-4 text-left text-sm">

                  <div className={`p-4 rounded-xl border space-y-1 ${theme === "dark" ? "bg-[#172033] border-[#1e293b]" : "bg-zinc-50 border-zinc-200"}`}>
                    <span className="text-[10px] text-zinc-400 font-normal uppercase tracking-wider">Username (Immutable)</span>
                    <p className={`text-base font-normal ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>{userForm.username}</p>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                      Email Address <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      placeholder="e.g. john@example.com"
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>First Name</label>
                      <input
                        type="text"
                        value={userForm.first_name}
                        onChange={(e) => setUserForm({ ...userForm, first_name: e.target.value })}
                        placeholder="John"
                        className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Last Name</label>
                      <input
                        type="text"
                        value={userForm.last_name}
                        onChange={(e) => setUserForm({ ...userForm, last_name: e.target.value })}
                        placeholder="Doe"
                        className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
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
                      <label htmlFor="form_is_staff" className={`text-xs font-semibold select-none cursor-pointer ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
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
                      <label htmlFor="form_is_active" className={`text-xs font-semibold select-none cursor-pointer ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                        Account Active
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-6">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className={`py-3 px-5 border rounded-xl font-normal cursor-pointer text-xs transition-all active:scale-95 ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-zinc-100 border-transparent hover:bg-zinc-200 text-zinc-700"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`py-3 px-5 text-white font-normal rounded-xl cursor-pointer text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] hover:opacity-90 shadow-purple-500/20`}
                    >
                      {modalMode === 'edit' ? 'Save Changes' : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}

              {modalType === 'marketing-banner' && (
                <form onSubmit={handleSaveMarketingBanner} className="space-y-4 text-left text-sm">
                  <div className="space-y-2">
                    <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                      Title <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={marketingBannerForm.title}
                      onChange={(e) => setMarketingBannerForm({ ...marketingBannerForm, title: e.target.value })}
                      placeholder="e.g. Playful Montessori Wooden Toys"
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>
                      Description <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={marketingBannerForm.description}
                      onChange={(e) => setMarketingBannerForm({ ...marketingBannerForm, description: e.target.value })}
                      placeholder="e.g. Inspire your child's imagination and early development..."
                      className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Button Text</label>
                      <input
                        type="text"
                        value={marketingBannerForm.buttonText}
                        onChange={(e) => setMarketingBannerForm({ ...marketingBannerForm, buttonText: e.target.value })}
                        placeholder="e.g. SHOP NOW"
                        className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Category Link (Category Ref)</label>
                      <input
                        type="text"
                        value={marketingBannerForm.categoryRef}
                        onChange={(e) => setMarketingBannerForm({ ...marketingBannerForm, categoryRef: e.target.value })}
                        placeholder="e.g. Toys"
                        className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Tailwind Bg Class</label>
                      <input
                        type="text"
                        value={marketingBannerForm.bg}
                        onChange={(e) => setMarketingBannerForm({ ...marketingBannerForm, bg: e.target.value })}
                        placeholder="e.g. bg-teal-50"
                        className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Sort Order</label>
                      <input
                        type="number"
                        value={marketingBannerForm.order}
                        onChange={(e) => setMarketingBannerForm({ ...marketingBannerForm, order: parseInt(e.target.value || 0) })}
                        placeholder="e.g. 1"
                        className={`w-full p-4 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm placeholder-zinc-400 transition-all shadow-3xs ${theme === "dark" ? "bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500" : "bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-[14px] font-semibold ${theme === "dark" ? "text-zinc-300" : "text-zinc-700"}`}>Banner Image</label>
                    <div className="flex items-center gap-4">
                      {marketingBannerForm.imagePreview ? (
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border bg-white p-1">
                          <img src={marketingBannerForm.imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-zinc-150 flex items-center justify-center shrink-0 border text-zinc-400">
                          <Plus size={20} />
                        </div>
                      )}
                      <div className="flex-1 relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMarketingBannerImageUpload}
                          disabled={uploadingMarketingBannerImage}
                          className="w-full text-xs file:mr-3 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 dark:file:bg-purple-500/10 dark:file:text-purple-400 cursor-pointer"
                        />
                        {uploadingMarketingBannerImage && (
                          <div className="absolute inset-y-0 right-3 flex items-center">
                            <Loader2 className="animate-spin text-purple-600 h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-6">
                    <button
                      type="button"
                      onClick={() => setModalType(null)}
                      className={`py-3 px-5 border rounded-xl font-normal cursor-pointer text-xs transition-all active:scale-95 ${theme === "dark" ? "bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300" : "bg-zinc-100 border-transparent hover:bg-zinc-200 text-zinc-700"}`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingMarketingBannerImage}
                      className={`py-3 px-5 text-white font-normal rounded-xl cursor-pointer text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5 bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] hover:opacity-90 shadow-purple-500/20`}
                    >
                      {modalMode === 'edit' ? 'Save Changes' : 'Create Banner'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offers Modal */}
      {isOfferModalOpen && selectedProductForOffer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none">
          <div className={`w-full max-w-[500px] rounded-[2rem] border p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all transform scale-100 ${theme === 'dark' ? 'bg-[#0f1626] border-[#1e293b] text-white shadow-purple-500/5' : 'bg-white border-zinc-200 text-[#0f172a]'
            }`}>
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-150 dark:border-zinc-800">
              <h3 className="text-lg font-bold">
                {offerModalMode === 'edit' ? 'Edit Offer Configuration' : 'Configure Offer'}
              </h3>
              <button
                onClick={() => {
                  setIsOfferModalOpen(false);
                  setSelectedProductForOffer(null);
                }}
                className={`p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-[#172033] cursor-pointer`}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4 text-left text-sm">
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${theme === 'dark' ? 'bg-[#172033] border-[#1e293b]' : 'bg-zinc-50 border-zinc-200'
                }`}>
                {selectedProductForOffer.image ? (
                  <img
                    src={getImageUrl(selectedProductForOffer.image)}
                    alt={selectedProductForOffer.name}
                    className="w-12 h-12 rounded-lg object-contain bg-white border"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center border text-zinc-400">
                    <Package size={20} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate max-w-[280px]">{selectedProductForOffer.name}</p>
                  <p className="text-xs text-zinc-450">Original Price: ₹{selectedProductForOffer.original_price || selectedProductForOffer.price}</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Offer Type
                </label>
                <div className="flex gap-4 p-3.5 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 flex-wrap">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="offerType"
                      checked={!(offerDiscountStr && (offerDiscountStr.toUpperCase().includes('BUY 1 GET 1') || offerDiscountStr.toUpperCase().includes('BOGO') || offerDiscountStr.toUpperCase().includes('B1G1') || offerDiscountStr.toUpperCase().includes('BUY 5 GET 2') || offerDiscountStr.toUpperCase().includes('B5G2')))}
                      onChange={() => {
                        setOfferDiscountStr('20% OFF');
                        const currentPrice = parseFloat(selectedProductForOffer.original_price || selectedProductForOffer.price);
                        setOfferPromoPrice(Math.round(currentPrice * 0.8));
                      }}
                      className="w-4 h-4 accent-[#8b5cf6]"
                    />
                    <span>Standard Discount</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="offerType"
                      checked={!!(offerDiscountStr && (offerDiscountStr.toUpperCase().includes('BUY 1 GET 1') || offerDiscountStr.toUpperCase().includes('BOGO') || offerDiscountStr.toUpperCase().includes('B1G1')))}
                      onChange={() => {
                        setOfferDiscountStr('BUY 1 GET 1 FREE');
                        setOfferPromoPrice(selectedProductForOffer.original_price || selectedProductForOffer.price);
                      }}
                      className="w-4 h-4 accent-[#8b5cf6]"
                    />
                    <span>Buy 1 Get 1 (BOGO)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="offerType"
                      checked={!!(offerDiscountStr && (offerDiscountStr.toUpperCase().includes('BUY 5 GET 2') || offerDiscountStr.toUpperCase().includes('B5G2')))}
                      onChange={() => {
                        setOfferDiscountStr('BUY 5 GET 2 FREE');
                        setOfferPromoPrice(selectedProductForOffer.original_price || selectedProductForOffer.price);
                      }}
                      className="w-4 h-4 accent-[#8b5cf6]"
                    />
                    <span>Buy 5 Get 2</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Discount Tag Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 20% OFF or Flat 500 Off"
                  value={offerDiscountStr}
                  onChange={(e) => setOfferDiscountStr(e.target.value)}
                  className={`w-full p-3.5 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm transition-all ${theme === 'dark'
                      ? 'bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500'
                      : 'bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400'
                    }`}
                />
              </div>

              <div className="space-y-2">
                <label className={`text-[14px] font-semibold ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-700'}`}>
                  Promotional Price (₹)
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 799"
                  value={offerPromoPrice}
                  onChange={(e) => setOfferPromoPrice(e.target.value)}
                  className={`w-full p-3.5 rounded-xl border focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/5 text-sm transition-all ${theme === 'dark'
                      ? 'bg-[#172033] border-[#1e293b] text-white placeholder-zinc-500'
                      : 'bg-white border-zinc-200 text-zinc-800 placeholder-zinc-400'
                    }`}
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-150 dark:border-zinc-800 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsOfferModalOpen(false);
                    setSelectedProductForOffer(null);
                  }}
                  className={`py-2.5 px-4 border rounded-xl font-normal transition-all active:scale-95 cursor-pointer text-xs ${theme === 'dark'
                      ? 'bg-[#172033] border-[#1e293b] hover:bg-[#1e293b] text-zinc-300'
                      : 'bg-zinc-100 border-transparent hover:bg-zinc-200 text-zinc-700'
                    }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`py-2.5 px-5 rounded-xl cursor-pointer flex items-center gap-1.5 transition-all active:scale-95 text-white bg-gradient-to-r from-[#4F38FF] via-[#A633FF] to-[#FF1A8C] hover:opacity-90 shadow-purple-500/20`}
                >
                  Apply Offer
                </button>
              </div>
            </form>
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
      className={`w-full px-5 py-4 rounded-2xl text-[18px] font-normal transition-all flex items-center gap-4 cursor-pointer select-none active:scale-98 ${active
          ? 'bg-gradient-to-r from-[#8b5cf6] to-[#a855f7] text-white shadow-md shadow-purple-500/10'
          : theme === 'dark'
            ? 'text-zinc-400 hover:bg-[#172033] hover:text-white'
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
    <div className={`p-5 rounded-3xl border transition-all duration-300 ease-out transform hover:scale-[1.04] text-left shadow-2xs hover:shadow-lg ${theme === 'dark'
        ? 'bg-[#0f1626] border-[#1e293b] text-white hover:shadow-purple-500/5'
        : 'bg-white border-zinc-200 text-[#0f172a] hover:shadow-zinc-300/30'
      }`}>
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-normal text-sm ${color} mb-4 shadow-md transition-transform duration-300 hover:rotate-6`}>
        {icon}
      </div>
      <p className="text-[14.5px] font-normal text-zinc-400 leading-none mb-2.5">{label}</p>
      <h4 className={`text-[30px] font-normal leading-none ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{value}</h4>
    </div>
  );
}

function CategoryLegendRow({ dotColor, label, pct, val }) {
  return (
    <div className="flex items-center justify-between text-[14.5px] font-normal text-zinc-650 dark:text-zinc-300">
      <div className="flex items-center gap-3">
        <span className={`w-3.5 h-3.5 rounded-full ${dotColor} shadow-2xs`} />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-3.5">
        <span className="text-zinc-400 font-normal">{pct}</span>
        <span className="text-zinc-800 dark:text-white font-normal">{val}</span>
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
    <div className={`flex items-center justify-between border-b py-3 sm:py-3.5 last:border-b-0 gap-2 sm:gap-4 ${theme === 'dark' ? 'border-[#1e293b]/60' : 'border-zinc-100'
      }`}>
      <div className="flex items-center gap-2.5 sm:gap-3.5 text-left min-w-0">
        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${gradient} flex items-center justify-center font-normal text-[10px] sm:text-[12px] text-white shadow-2xs shrink-0 select-none`}>
          {initials}
        </div>
        <div className="min-w-0">
          <p className={`font-normal text-[14px] sm:text-[16px] leading-none mb-1 sm:mb-1.5 truncate ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`} title={id}>{id}</p>
          <p className="text-[11px] sm:text-[13px] text-zinc-400 font-normal">{date}</p>
        </div>
      </div>
      <div className="text-right leading-none flex flex-col items-end gap-2 sm:gap-2.5 shrink-0">
        <p className={`font-normal text-[14px] sm:text-[16px] leading-none ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{amount}</p>
        <span className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full border text-[8px] sm:text-[9px] font-normal uppercase tracking-wider ${getBadgeStyle()}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function TopProductRow({ name, category, sold, rev, image, theme }) {
  return (
    <tr className={`transition-colors border-b last:border-b-0 ${theme === 'dark'
        ? 'hover:bg-white/2 border-[#1e293b]/60'
        : 'hover:bg-zinc-50/50 border-zinc-150'
      }`}>
      <td className="py-3.5 font-normal flex items-center gap-3">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-8 h-8 rounded-lg object-contain border border-zinc-200 dark:border-[#1e293b] bg-white p-0.5 shadow-3xs"
          />
        ) : (
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-3xs ${theme === 'dark' ? 'bg-[#172033]' : 'bg-zinc-100'
            }`}>
            <Package size={14} className="text-zinc-400" />
          </div>
        )}
        <span className={`text-[15.5px] ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{name}</span>
      </td>
      <td className="py-3.5 font-normal text-zinc-400 text-[14.5px]">{category}</td>
      <td className={`py-3.5 text-center font-normal text-[15.5px] ${theme === 'dark' ? 'text-white' : 'text-zinc-800'}`}>{sold}</td>
      <td className={`py-3.5 text-right font-normal text-[16px] ${theme === 'dark' ? 'text-white' : 'text-zinc-950'}`}>{rev}</td>
      <td className="py-3.5 text-center">
        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-normal uppercase tracking-wider bg-emerald-600 text-white border border-transparent">Active</span>
      </td>
    </tr>
  );
}

function StatCard({ icon, label, value, desc, theme, bgClass }) {
  return (
    <div className={`p-6 rounded-3xl border transition-all text-left ${theme === 'dark'
        ? 'bg-[#0f1626] border-[#1e293b] text-white'
        : 'bg-white border-zinc-200 text-[#0f172a] shadow-3xs'
      }`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] font-normal text-zinc-400 uppercase tracking-wider">{label}</span>
        <div className={`p-2.5 rounded-xl ${bgClass || 'bg-indigo-50 dark:bg-[#172033]'} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <h4 className={`text-3xl font-normal leading-none mb-2 ${theme === 'dark' ? 'text-white' : 'text-[#0f172a]'}`}>{value}</h4>
      <p className="text-[11px] text-zinc-400 font-normal leading-none">{desc}</p>
    </div>
  );
}
