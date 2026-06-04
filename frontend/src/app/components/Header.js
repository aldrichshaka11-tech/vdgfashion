'use client';

import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, Home, Package, Headphones, Gift, Star, Truck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { usePathname, useRouter } from 'next/navigation';

export default function Header({ onMobileMenuToggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const {
    cartCount,
    wishlist,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    setSelectedProduct,
    setCheckedCategories,
    allCategories,
    user,
    settings,
  } = useStore();

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    if (setCheckedCategories) {
      setCheckedCategories([categoryName]);
    }
    setSelectedProduct(null);
    router.push('/categories');
  };

  return (
    <div className="w-full flex flex-col bg-white relative z-30 shadow-xs">
      {/* Top Announcement Bar (Infinite Marquee Loop) */}
      <div className="w-full bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500 py-2.5 text-white text-xs font-bold tracking-wide overflow-hidden whitespace-nowrap select-none">
        <div className="animate-marquee">
          <div className="shrink-0 flex items-center gap-12 px-6">
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Free Shipping on Orders Above ₹999</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="flex items-center gap-1.5"><Gift className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Premium Quality Kids Fashion</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Fast & Secure Delivery</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Shop Now & Get Special Offers!</span>
            <span className="text-white/40 font-normal">|</span>
          </div>
          <div className="shrink-0 flex items-center gap-12 px-6" aria-hidden="true">
            <span className="flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Free Shipping on Orders Above ₹999</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="flex items-center gap-1.5"><Gift className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Premium Quality Kids Fashion</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="flex items-center gap-1.5"><Package className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Fast & Secure Delivery</span>
            <span className="text-white/40 font-normal">|</span>
            <span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5" fill="white" strokeWidth={1} /> Shop Now & Get Special Offers!</span>
            <span className="text-white/40 font-normal">|</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="w-full bg-white py-3.5 px-4 sm:px-8 text-black border-b border-zinc-100">
        <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between gap-4">
          
          {/* Left Side: Mobile Menu Button & Logo on Mobile, Desktop Logo & Nav Links on Desktop */}
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button & Logo */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={onMobileMenuToggle}
                className="p-2 text-zinc-500 hover:bg-zinc-150 hover:text-black rounded-xl transition-all"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <div
                className="flex items-center cursor-pointer"
                onClick={() => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/'); }}
              >
                <img src={settings?.logoImage ? (settings.logoImage.startsWith('http') ? settings.logoImage : `http://127.0.0.1:8000${settings.logoImage}`) : "/logo.png"} alt="vdgfashion logo" className="h-12 w-auto object-contain" />
              </div>
            </div>

            {/* Desktop Logo & Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <div
                className="flex items-center cursor-pointer mr-2 shrink-0"
                onClick={() => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/'); }}
              >
                <img src={settings?.logoImage ? (settings.logoImage.startsWith('http') ? settings.logoImage : `http://127.0.0.1:8000${settings.logoImage}`) : "/logo.png"} alt="vdgfashion logo" className="h-14 xl:h-16 w-auto object-contain" />
              </div>

              {/* Navigation links */}
              <nav className="flex items-center gap-1">
                {/* Home Link */}
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setSelectedCategory('ALL');
                    router.push('/');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    pathname === '/' || pathname === ''
                      ? 'bg-rose-50 text-[#e11d48]'
                      : 'text-zinc-650 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Home
                </button>

                {/* My Orders Link */}
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    router.push('/orders');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    pathname?.startsWith('/orders')
                      ? 'bg-rose-50 text-[#e11d48]'
                      : 'text-zinc-650 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  My Orders
                </button>

                {/* Contact Link */}
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    router.push('/contact');
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all cursor-pointer ${
                    pathname?.startsWith('/contact')
                      ? 'bg-rose-50 text-[#e11d48]'
                      : 'text-zinc-650 hover:bg-zinc-50 hover:text-black'
                  }`}
                >
                  <Headphones className="h-4 w-4" />
                  Contact
                </button>
              </nav>
            </div>
          </div>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md xl:max-w-lg mx-auto relative hidden md:block">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-zinc-400">
              <Search className="h-4.5 w-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search for products, brands and more..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedProduct(null);
                const catalogPaths = ['/', '/categories', '/best-sellers', '/offers', '/collections', '/new-arrivals', '/wishlist'];
                if (!catalogPaths.includes(pathname)) {
                  router.push('/');
                }
              }}
              className="w-full pl-11 pr-4 py-2.5 bg-zinc-100/90 border-0 focus:border-0 rounded-full text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:bg-white transition-all text-black"
            />
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Mobile search indicator */}
            <div className="md:hidden relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedProduct(null);
                  const catalogPaths = ['/', '/categories', '/best-sellers', '/offers', '/collections', '/new-arrivals', '/wishlist'];
                  if (!catalogPaths.includes(pathname)) {
                    router.push('/');
                  }
                }}
                className="w-28 sm:w-36 pl-8 pr-3 py-1.5 bg-zinc-100 rounded-full text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500/20 text-black"
              />
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            </div>

            {/* User Account */}
            <button
              onClick={() => router.push('/account')}
              className="flex items-center gap-2 p-2 text-zinc-700 hover:bg-zinc-50 hover:text-pink-600 rounded-full transition-all cursor-pointer"
              aria-label="Account Profile"
            >
              {user ? (
                <>
                  <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 flex items-center justify-center text-white font-black text-xs">
                    {(user.first_name || user.username || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-zinc-800 max-w-[80px] truncate">
                    {user.first_name || user.username}
                  </span>
                </>
              ) : (
                <User className="h-5.5 w-5.5" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => router.push('/wishlist')}
              className="relative p-2 text-zinc-700 hover:bg-zinc-50 hover:text-pink-600 rounded-full transition-all cursor-pointer"
              aria-label="Wishlist items"
            >
              <Heart className="h-5.5 w-5.5" />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#e11d48] text-[8px] font-bold text-white ring-2 ring-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => router.push('/cart')}
              className="relative p-2 text-zinc-700 hover:bg-zinc-50 hover:text-pink-600 rounded-full transition-all cursor-pointer"
              aria-label="Shopping Cart Bag"
            >
              <ShoppingBag className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#e11d48] text-[8px] font-bold text-white ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>
    </div>
  );
}
