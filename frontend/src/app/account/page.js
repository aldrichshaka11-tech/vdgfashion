'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { User, ShoppingBag, MapPin, ChevronRight, X, UserCheck, ShieldCheck, HelpCircle, Phone, Eye, EyeOff } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { useStore } from '../context/StoreContext';
import { API_BASE } from '../../lib/api';

import { Suspense } from 'react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');
  const { user, loginUser, registerUser, logoutUser, products } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'profile' | 'orders' | 'addresses'

  // Registration Form States
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirst, setRegFirst] = useState('');
  const [regLast, setRegLast] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login Form States
  const [loginUserVal, setLoginUserVal] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Goutham Raj',
    email: 'gouthamraj@vdgfashion.com',
    phone: '+91 98765 43210',
    joined: 'October 2025'
  });

  // Saved addresses states
  const [isAddrModalOpen, setIsAddrModalOpen] = useState(false);
  const [addrModalMode, setAddrModalMode] = useState('add'); // 'add' | 'edit'
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addrForm, setAddrForm] = useState({
    label: 'Home',
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: false
  });

  const [savedAddresses, setSavedAddresses] = useState([]);

  const [mockOrders, setMockOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const headers = {};
      if (user && user.token) headers['Authorization'] = `Bearer ${user.token}`;
      const res = await fetch(`${API_BASE}/api/orders/`, { headers });
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map(o => ({
          id: o.id,
          orderId: o.order_id,
          date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          total: parseFloat(o.total_amount),
          status: o.status
            ? (o.status === 'out_for_delivery' ? 'Out for Delivery' : o.status.charAt(0).toUpperCase() + o.status.slice(1))
            : 'Pending',
          items: (o.items || []).map(item => {
            const productObj = products?.find(p => p.id === (item.product || item.product_id));
            const resolvedImage = productObj && productObj.image ? productObj.image : null;
            return {
              name: item.product_name,
              qty: item.quantity,
              price: parseFloat(item.price),
              size: item.selected_size || '-',
              img: resolvedImage
            };
          })
        }));
        setMockOrders(mapped);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete/cancel this order?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/orders/${id}/`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert('Order deleted/cancelled successfully!');
        fetchOrders();
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      alert('Network error deleting order');
    }
  };

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username,
        email: user.email,
        phone: user.phone || '+91 98765 43210',
        joined: user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'October 2025'
      });
      fetchOrders();
    } else {
      setMockOrders([]);
    }
  }, [user, products]);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const fetchAddresses = async () => {
    if (!user || !user.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/addresses/`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data);
      }
    } catch (e) {
      console.error('Failed to fetch addresses', e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const result = await loginUser(loginUserVal, loginPassword);
    setAuthLoading(false);
    if (!result.success) {
      setAuthError(result.message);
    } else if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setAuthLoading(true);
    const result = await registerUser(regUsername, regEmail, regPassword, regFirst, regLast);
    setAuthLoading(false);
    if (!result.success) {
      setAuthError(result.message);
    } else if (redirectUrl) {
      router.push(redirectUrl);
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert('Mock Account details saved successfully!');
  };

  const handleAddrDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/addresses/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setSavedAddresses(prev => prev.filter(addr => addr.id !== id));
      } else {
        alert('Failed to delete address.');
      }
    } catch (e) {
      console.error(e);
      alert('Network error deleting address.');
    }
  };

  const handleAddrFormSubmit = async (e) => {
    e.preventDefault();
    if (!addrForm.label || !addrForm.name || !addrForm.phone || !addrForm.street || !addrForm.city || !addrForm.pinCode) {
      alert('Please fill out all fields.');
      return;
    }

    const payload = {
      label: addrForm.label,
      recipient_name: addrForm.name,
      phone: addrForm.phone,
      street_address: addrForm.street,
      city: addrForm.city,
      state: addrForm.state || '',
      pin_code: addrForm.pinCode,
      is_default: addrForm.isDefault
    };

    const url = addrModalMode === 'edit'
      ? `${API_BASE}/api/addresses/${selectedAddressId}/`
      : `${API_BASE}/api/addresses/`;

    const method = addrModalMode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        fetchAddresses();
        setIsAddrModalOpen(false);
        setSelectedAddressId(null);
      } else {
        alert('Failed to save address. Please check inputs.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving address.');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold';
      case 'Processing':
      case 'Confirmed':
      case 'Packed':
        return 'bg-amber-500 text-white border-amber-500 shadow-xs font-bold animate-pulse';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold';
      case 'Cancelled':
        return 'bg-rose-600 text-white border-rose-600 shadow-xs font-bold';
      case 'Returned':
      case 'Refunded':
        return 'bg-purple-600 text-white border-purple-600 shadow-xs font-bold';
      case 'Pending':
      default:
        return 'bg-amber-600 text-white border-amber-600 shadow-xs font-bold';
    }
  };

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 h-full bg-white flex flex-col animate-slide-in-right z-10">
            <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-5 right-5 p-1 rounded-full text-zinc-500 hover:bg-zinc-150">
              <X className="h-5 w-5" />
            </button>
            <Sidebar className="flex h-full w-full border-r-0" />
          </div>
        </div>
      )}

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          {!user ? (
            /* Stunning Login & Registration screen */
            <div className="px-4 sm:px-8 py-10 sm:py-16 w-full max-w-[460px] mx-auto flex-grow flex flex-col justify-center animate-fade-in text-black space-y-6">
              <div className="bg-white border border-zinc-250 rounded-[2.5rem] p-8 sm:p-10 shadow-lg relative space-y-6">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 mx-auto bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm">
                    V
                  </div>
                  <h2 className="text-2xl font-black text-zinc-950 tracking-tight mt-3">
                    {isRegisterMode ? 'Create Account' : 'Welcome Back'}
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    {isRegisterMode
                      ? 'Sign up to shop the curated infant & toddler collection'
                      : 'Sign in to access your vdgfashion account & checkouts'}
                  </p>
                </div>

                {authError && (
                  <div className="bg-red-50 text-red-655 border border-red-200 rounded-2xl p-3 flex items-start gap-2 text-xs font-bold leading-normal">
                    <span>⚠️ {authError}</span>
                  </div>
                )}

                {isRegisterMode ? (
                  /* Registration Form */
                  <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Username*</label>
                      <input
                        type="text" required value={regUsername} onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Email Address*</label>
                      <input
                        type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">First Name</label>
                        <input
                          type="text" value={regFirst} onChange={(e) => setRegFirst(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Last Name</label>
                        <input
                          type="text" value={regLast} onChange={(e) => setRegLast(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Password*</label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? "text" : "password"} required value={regPassword} onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs pr-10"
                        />
                        <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer flex items-center justify-center">
                          {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit" disabled={authLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-95 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-98 text-xs tracking-wider uppercase cursor-pointer"
                    >
                      {authLoading ? 'Signing up...' : 'Create Account'}
                    </button>
                  </form>
                ) : (
                  /* Login Form */
                  <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4 text-xs font-semibold">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Username / Email*</label>
                      <input
                        type="text" required value={loginUserVal} onChange={(e) => setLoginUserVal(e.target.value)}
                        autoComplete="off"
                        className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Password*</label>
                        <button type="button" onClick={() => alert('Forgot password functionality coming soon!')} className="text-[10px] uppercase tracking-wider text-pink-500 font-bold hover:text-pink-600 transition-colors cursor-pointer">Forgot Password?</button>
                      </div>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? "text" : "password"} required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}
                          autoComplete="new-password"
                          className="w-full px-4 py-3 bg-zinc-55 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs pr-10"
                        />
                        <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer flex items-center justify-center">
                          {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit" disabled={authLoading}
                      className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-95 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-98 text-xs tracking-wider uppercase cursor-pointer"
                    >
                      {authLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                  </form>
                )}

                <div className="pt-4 border-t border-zinc-150 text-center">
                  <button
                    onClick={() => { setIsRegisterMode(!isRegisterMode); setAuthError(''); }}
                    className="text-xs font-bold text-[#e11d48] hover:text-[#be123c] transition-colors cursor-pointer"
                  >
                    {isRegisterMode
                      ? 'Already have an account? Sign In'
                      : "Don't have an account? Sign Up"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Real Account Profile panel */
            <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1600px] mx-auto space-y-6 flex-grow">
              <div className="space-y-1.5" data-aos="fade-up">
                <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">My Account</h1>
                <p className="text-sm sm:text-base text-zinc-500 font-normal">Manage your profile, saved addresses, and active/delivered streetwear orders.</p>
              </div>

              {/* Main Tabs Container */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-2">

                {/* Left Column Tabs Selector (4 cols span) */}
                <div className="lg:col-span-3 bg-white border border-zinc-150 rounded-[2rem] p-5 shadow-xs h-fit space-y-2" data-aos="fade-up">
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-semibold transition-all text-left ${activeTab === 'orders' ? 'bg-rose-50 text-[#e11d48] font-bold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                      }`}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    Order History ({mockOrders.length})
                  </button>

                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-semibold transition-all text-left ${activeTab === 'profile' ? 'bg-rose-50 text-[#e11d48] font-bold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                      }`}
                  >
                    <User className="h-5 w-5" />
                    Personal Information
                  </button>

                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-semibold transition-all text-left ${activeTab === 'addresses' ? 'bg-rose-50 text-[#e11d48] font-bold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                      }`}
                  >
                    <MapPin className="h-5 w-5" />
                    Delivery Addresses
                  </button>

                  <hr className="border-zinc-100 my-2" />

                  <button
                    onClick={logoutUser}
                    className="w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-bold transition-all text-left text-red-500 hover:bg-red-50 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                    Sign Out Account
                  </button>
                </div>

                {/* Right Column: Tab Panels (9 cols span) */}
                <div className="lg:col-span-9 bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full min-h-[400px]" data-aos="fade-up" data-aos-delay="100">

                  {/* 1. Order History Panel */}
                  {activeTab === 'orders' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Purchase History</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-normal">Check the packaging and shipping status of your orders.</p>
                      </div>

                      <div className="space-y-5">
                        {mockOrders.map((order, idx) => (
                          <div key={idx} className="border border-zinc-150 rounded-2xl overflow-hidden shadow-2xs">
                            {/* Order Card header */}
                            <div className="bg-zinc-50/50 p-4 border-b border-zinc-150 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs sm:text-sm">
                              <div className="flex flex-wrap gap-4 text-zinc-550 font-normal">
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Placed On</span>
                                  <span>{order.date}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total Paid</span>
                                  <span className="font-bold text-zinc-800">{formatINR(order.total)}</span>
                                </div>
                                <div>
                                  <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Order ID</span>
                                  <span className="font-mono">{order.orderId}</span>
                                </div>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${getStatusBadgeClass(order.status)}`}>
                                {order.status}
                              </span>
                            </div>

                            {/* Order Products List */}
                            <div className="p-4 divide-y divide-zinc-100">
                              {order.items.map((item, itemIdx) => (
                                <div key={itemIdx} className="flex gap-4 py-3 items-center">
                                  <div className="relative h-14 w-14 rounded-xl border border-zinc-150 p-1 bg-zinc-50 shrink-0">
                                    {item.img ? (
                                      <Image src={item.img} alt={item.name} fill className="object-contain p-1" />
                                    ) : null}
                                  </div>
                                  <div className="min-w-0 flex-grow">
                                    <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{item.name}</h4>
                                    <p className="text-xs text-zinc-500 mt-0.5">Size: {item.size} • Qty: {item.qty}</p>
                                  </div>
                                  <span className="text-sm font-semibold text-zinc-800">{formatINR(item.price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 2. Personal Profile Panel */}
                  {activeTab === 'profile' && (
                    <form onSubmit={handleProfileSave} className="space-y-6 animate-fade-in">
                      <div className="space-y-1">
                        <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Personal Details</h3>
                        <p className="text-xs sm:text-sm text-zinc-400 font-normal">Edit your account settings and registered information.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-normal text-zinc-650">Full Name</label>
                          <input
                            type="text"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-normal text-zinc-650">Email Address</label>
                          <div className="w-full px-4 py-3 bg-zinc-50/20 border border-zinc-150 rounded-xl text-sm font-normal text-zinc-500 select-none">
                            {profile.email}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-normal text-zinc-650">Mobile Phone</label>
                          <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-normal text-zinc-650">Joined Date</label>
                          <div className="w-full px-4 py-3 bg-zinc-50/20 border border-zinc-150 rounded-xl text-sm font-normal text-zinc-500 select-none">
                            {profile.joined}
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5c51db] hover:bg-[#4b41ca] px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
                      >
                        <UserCheck className="h-4 w-4" />
                        Save Profile Changes
                      </button>
                    </form>
                  )}

                  {/* 3. Address details panel */}
                  {activeTab === 'addresses' && (
                    <div className="space-y-6 animate-fade-in">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-4">
                        <div className="space-y-1">
                          <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Delivery Directory</h3>
                          <p className="text-xs sm:text-sm text-zinc-400 font-normal">Manage your shipping destinations and billing locations.</p>
                        </div>
                        <button
                          onClick={() => {
                            setAddrForm({
                              label: 'Home',
                              name: user?.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : (user?.username || ''),
                              phone: user?.phone || '',
                              street: '',
                              city: '',
                              state: '',
                              pinCode: '',
                              isDefault: false
                            });
                            setAddrModalMode('add');
                            setIsAddrModalOpen(true);
                          }}
                          className="px-4 py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-xl transition-all shadow-sm active:scale-95 text-xs shrink-0 cursor-pointer"
                        >
                          Add New Address
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {savedAddresses.map((addr) => (
                          <div key={addr.id} className="border border-zinc-150 rounded-2xl p-5 shadow-2xs space-y-3 relative hover:border-zinc-300 transition-colors">
                            <div className="flex justify-between items-center">
                              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white border shadow-3xs ${addr.is_default
                                  ? 'bg-[#e5484d] border-[#e5484d]'
                                  : 'bg-[#5c51db] border-[#5c51db]'
                                }`}>
                                {addr.is_default ? `${addr.label || 'Home'} (Default)` : (addr.label || 'Home')}
                              </span>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    setAddrForm({
                                      label: addr.label || 'Home',
                                      name: addr.recipient_name,
                                      phone: addr.phone,
                                      street: addr.street_address,
                                      city: addr.city,
                                      state: addr.state,
                                      pinCode: addr.pin_code,
                                      isDefault: addr.is_default
                                    });
                                    setSelectedAddressId(addr.id);
                                    setAddrModalMode('edit');
                                    setIsAddrModalOpen(true);
                                  }}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                                >
                                  Edit
                                </button>
                                <span className="text-zinc-300 select-none">|</span>
                                <button
                                  onClick={() => handleAddrDelete(addr.id)}
                                  className="text-xs font-bold text-rose-500 hover:text-rose-650 cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <div className="space-y-1 text-xs sm:text-sm">
                              <h4 className="font-bold text-zinc-900">{addr.recipient_name}</h4>
                              <p className="text-zinc-500 font-normal leading-normal">{addr.street_address}, {addr.city}, {addr.state} - {addr.pin_code}</p>
                              <p className="text-zinc-400 mt-1 font-normal flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                                <span>{addr.phone}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
          <Footer />
        </main>
      </div>

      {/* Address Edit/Add Modal */}
      {isAddrModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in select-none text-black">
          <div className="w-full max-w-[500px] bg-white rounded-[2rem] border border-zinc-200 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all transform scale-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-150">
              <h3 className="text-lg font-bold">
                {addrModalMode === 'edit' ? 'Edit Shipping Address' : 'Add New Address'}
              </h3>
              <button
                onClick={() => {
                  setIsAddrModalOpen(false);
                  setSelectedAddressId(null);
                }}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-550 transition-all cursor-pointer flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddrFormSubmit} className="space-y-4 text-left text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Address Label / Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home, Office, Work"
                  value={addrForm.label}
                  onChange={(e) => setAddrForm({ ...addrForm, label: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={addrForm.name}
                  onChange={(e) => setAddrForm({ ...addrForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Mobile Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={addrForm.phone}
                  onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Complete Shipping Address</label>
                <textarea
                  required
                  rows="2"
                  placeholder="e.g. Apartment, House No., Street Address"
                  value={addrForm.street}
                  onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Chennai"
                    value={addrForm.city}
                    onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Tamil Nadu"
                    value={addrForm.state}
                    onChange={(e) => setAddrForm({ ...addrForm, state: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="600002"
                    value={addrForm.pinCode}
                    onChange={(e) => setAddrForm({ ...addrForm, pinCode: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 text-black shadow-3xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="accountModalIsDefault"
                  checked={addrForm.isDefault}
                  onChange={(e) => setAddrForm({ ...addrForm, isDefault: e.target.checked })}
                  className="h-4.5 w-4.5 rounded border-zinc-300 text-[#e11d48] focus:ring-[#e11d48] cursor-pointer"
                />
                <label htmlFor="accountModalIsDefault" className="text-xs text-zinc-650 font-bold select-none cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-150 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddrModalOpen(false);
                    setSelectedAddressId(null);
                  }}
                  className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CartDrawer />
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-zinc-50">Loading...</div>}>
      <AccountContent />
    </Suspense>
  );
}
