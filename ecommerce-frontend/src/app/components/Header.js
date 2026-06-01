'use client';

import React, { useState } from 'react';
import { Search, User, Heart, ShoppingBag, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { usePathname, useRouter } from 'next/navigation';
import { MEGA_MENU_STRUCTURE } from '../data/categories';

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
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => { setSelectedProduct(null); setSelectedCategory('ALL'); }}
          >
            <div className="h-8 w-8 bg-gradient-to-tr from-pink-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-black text-sm">
              V
            </div>
            <span className="text-base font-black tracking-tight text-zinc-950">vdgfashion</span>
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
            className="p-2 text-zinc-700 hover:bg-zinc-50 hover:text-pink-600 rounded-full transition-all cursor-pointer"
            aria-label="Account Profile"
          >
            <User className="h-5.5 w-5.5" />
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

      {/* Desktop Mega-Menu Nav Bar */}
      <div 
        className="hidden lg:flex items-center justify-center gap-10 mt-3.5 border-t border-zinc-100 pt-3.5 relative"
        onMouseLeave={() => setHoveredMenu(null)}
      >
        {MEGA_MENU_STRUCTURE.map((menu) => (
          <div
            key={menu.id}
            className="relative py-1"
            onMouseEnter={() => setHoveredMenu(menu.id)}
          >
            <button
              onClick={() => handleCategorySelect(menu.name)}
              className={`text-[12.5px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer pb-1.5 border-b-2 ${
                hoveredMenu === menu.id 
                  ? 'text-[#e11d48] border-[#e11d48]' 
                  : 'text-zinc-700 border-transparent hover:text-[#e11d48]'
              }`}
            >
              {menu.name}
            </button>
          </div>
        ))}
      </div>

      {/* Mega-menu dropdown panel */}
      {hoveredMenu && (
        <div 
          className="absolute top-full left-0 right-0 w-full bg-white border-t border-zinc-150 border-b border-zinc-200 shadow-2xl z-50 animate-fade-in"
          onMouseEnter={() => setHoveredMenu(hoveredMenu)}
          onMouseLeave={() => setHoveredMenu(null)}
        >
          <div className="max-w-[1300px] mx-auto px-8 py-8 grid grid-cols-6 gap-6">
            {MEGA_MENU_STRUCTURE.find(m => m.id === hoveredMenu)?.groups.map((group, gIdx) => (
              <div key={gIdx} className="space-y-3">
                <h4 className="text-[13px] font-black text-zinc-950 uppercase tracking-wider pb-1.5 border-b border-zinc-150">
                  {group.title}
                </h4>
                <ul className="space-y-2">
                  {group.items.map((item, iIdx) => (
                    <li key={iIdx}>
                      <button
                        onClick={() => {
                          handleCategorySelect(item);
                          setHoveredMenu(null);
                        }}
                        className="text-[13.5px] text-zinc-650 hover:text-[#e11d48] transition-colors text-left block font-medium"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}
