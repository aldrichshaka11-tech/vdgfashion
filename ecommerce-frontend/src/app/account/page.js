'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { User, ShoppingBag, MapPin, ChevronRight, X, UserCheck, ShieldCheck, HelpCircle, Phone } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function AccountPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('orders'); // 'profile' | 'orders' | 'addresses'

  const [profile, setProfile] = useState({
    name: 'Goutham Raj',
    email: 'gouthamraj@vdgfashion.com',
    phone: '+91 98765 43210',
    joined: 'October 2025'
  });

  const [savedAddresses, setSavedAddresses] = useState([
    {
      id: 1,
      type: 'Home (Default)',
      name: 'Goutham Raj',
      phone: '+91 98765 43210',
      address: 'Express Avenue Mall, 1st Floor, No. 2, Club House Rd, India, TN - 600002'
    },
    {
      id: 2,
      type: 'Office',
      name: 'Goutham Raj',
      phone: '+91 98765 43210',
      address: 'T-Shirts & Prints HQ, EA Complex, Anna Salai, Chennai, TN - 600002'
    }
  ]);

  const [mockOrders, setMockOrders] = useState([
    {
      id: 'TRD-2026-98124',
      date: 'May 20, 2026',
      total: 1850,
      status: 'Delivered',
      items: [
        { name: 'Jeans Blue Premium Wash', price: 1100, qty: 1, size: '32', img: '/products/jeans_blue.png' },
        { name: 'vdgfashion Pastel T-Shirt', price: 750, qty: 1, size: 'L', img: '/products/tshirt_green.png' }
      ]
    },
    {
      id: 'TRD-2026-77314',
      date: 'May 04, 2026',
      total: 1999,
      status: 'Delivered',
      items: [
        { name: 'Winter Cotton Hoodie Pink', price: 1999, qty: 1, size: 'XL', img: '/products/hoodie_pink.png' }
      ]
    }
  ]);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });

    // Try adding the last checkout order if there is one in session
    const lastOrder = sessionStorage.getItem('vdgfashion_last_order');
    if (lastOrder) {
      const order = JSON.parse(lastOrder);
      // Check if already added
      const exists = mockOrders.some(o => o.id === order.orderId);
      if (!exists) {
        const parsedOrder = {
          id: order.orderId,
          date: order.date,
          total: order.totalAmount,
          status: 'Processing',
          items: [
            { name: 'vdgfashion Streetwear Apparel', price: order.totalAmount, qty: order.itemsCount, size: 'M', img: '/products/promo_model.png' }
          ]
        };
        setMockOrders(prev => [parsedOrder, ...prev]);
      }
    }
  }, [mockOrders]);

  const handleProfileSave = (e) => {
    e.preventDefault();
    alert('Mock Account details saved successfully!');
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Processing':
        return 'bg-indigo-50 text-indigo-700 border-indigo-150 animate-pulse';
      case 'Shipped':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-100';
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
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1400px] mx-auto space-y-6 flex-grow">
            
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
                  className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-semibold transition-all text-left ${
                    activeTab === 'orders' ? 'bg-rose-50 text-[#e11d48] font-bold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <ShoppingBag className="h-5 w-5" />
                  Order History ({mockOrders.length})
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-semibold transition-all text-left ${
                    activeTab === 'profile' ? 'bg-rose-50 text-[#e11d48] font-bold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <User className="h-5 w-5" />
                  Personal Information
                </button>

                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center gap-3 px-4.5 py-3 rounded-2xl text-[14px] font-semibold transition-all text-left ${
                    activeTab === 'addresses' ? 'bg-rose-50 text-[#e11d48] font-bold' : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <MapPin className="h-5 w-5" />
                  Delivery Addresses
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
                                <span className="font-mono">{order.id}</span>
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
                                  <Image src={item.img} alt={item.name} fill className="object-contain p-1" />
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
                        <label className="text-sm font-normal text-zinc-600">Full Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-sm font-normal text-zinc-600">Email Address</label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-normal text-zinc-600">Mobile Phone</label>
                        <input
                          type="text"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10"
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
                    <div className="space-y-1">
                      <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Delivery Directory</h3>
                      <p className="text-xs sm:text-sm text-zinc-400 font-normal">Manage your shipping destinations and billing locations.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div key={addr.id} className="border border-zinc-150 rounded-2xl p-5 shadow-2xs space-y-3 relative hover:border-zinc-300 transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="px-2.5 py-0.5 rounded-md bg-zinc-100 text-[10px] font-bold text-zinc-600 border border-zinc-200">
                              {addr.type}
                            </span>
                            <button className="text-xs font-semibold text-rose-500 hover:text-rose-600">Edit</button>
                          </div>
                          <div className="space-y-1 text-xs sm:text-sm">
                            <h4 className="font-bold text-zinc-900">{addr.name}</h4>
                            <p className="text-zinc-500 font-normal leading-normal">{addr.address}</p>
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
          <Footer />
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
