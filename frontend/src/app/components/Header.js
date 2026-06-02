'use client';

import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
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
    <header className="w-full bg-white py-4 px-4 sm:px-8 text-black relative z-30">
      <div className="flex items-center justify-between gap-4">
        
        {/* Mobile Sidebar Trigger & Logo */}
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
            onClick={() => { setSelectedProduct(null); setSelectedCategory('ALL'); }}
          >
            <img src="/logo.png" alt="vdgfashion logo" className="h-10 object-contain" />
          </div>
        </div>

        {/* Center Search Input - Matching Wide Search Bar exactly */}
        <div className="flex-1 max-w-xl mx-auto relative hidden md:block">
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
            <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-400" />
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
            className="relative p-2 text-zinc-700 hover:bg-zinc-50 hover:text-pink-600 rounded-full transition-all"
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
            className="relative p-2 text-zinc-700 hover:bg-zinc-50 hover:text-pink-600 rounded-full transition-all"
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
  );
}
