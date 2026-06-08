'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Grid, Sparkles, Flame, Tag, Layers, Star, ShoppingBag, Truck, ShieldCheck, Headphones, Smartphone, Heart, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Image from 'next/image';

export default function Sidebar({ className = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedCategory, setSelectedCategory, setSelectedProduct } = useStore();

  const menuItems = [
    {
      name: 'Home',
      icon: Home,
      active: pathname === '/' || pathname === '',
      action: () => {
        setSelectedProduct(null);
        setSelectedCategory('ALL');
        router.push('/');
      },
    },
    {
      name: 'Categories',
      icon: Grid,
      active: pathname?.startsWith('/categories'),
      action: () => {
        setSelectedProduct(null);
        setSelectedCategory('ALL');
        router.push('/categories');
      },
    },
    {
      name: 'Cart',
      icon: ShoppingBag,
      active: pathname?.startsWith('/cart'),
      action: () => {
        setSelectedProduct(null);
        router.push('/cart');
      },
    },
    { name: 'Wishlist', icon: Heart, active: pathname?.startsWith('/wishlist'), action: () => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/wishlist'); } },
    { name: 'My Orders', icon: Package, active: pathname?.startsWith('/orders'), action: () => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/orders'); } },
    { name: 'Offers', icon: Tag, active: pathname?.startsWith('/offers'), action: () => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/offers'); } },
    { name: 'Collections', icon: Layers, active: pathname?.startsWith('/collections'), action: () => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/collections'); } },
    { name: 'Contact', icon: Headphones, active: pathname?.startsWith('/contact'), action: () => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/contact'); } },
  ];

  const valueProps = [
    { title: 'Free Shipping', desc: 'On orders over Rs 3000', icon: Truck },
    { title: 'Easy Returns', desc: '14 days return policy', icon: Headphones },
    { title: 'Secure Payment', desc: '100% secure checkout', icon: ShieldCheck },
    { title: '24/7 Support', desc: 'We are here to help', icon: Smartphone },
  ];

  return (
    <aside className={`w-80 bg-white border-r border-zinc-200 flex flex-col h-full py-6 px-6 overflow-y-auto no-scrollbar text-black ${className}`}>
      
      {/* Brand logo - Butterfly Brand Logo */}
      <div className="flex items-center justify-center pb-6 border-b border-zinc-150 cursor-pointer" onClick={() => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/'); }}>
        <img src="/logo.png" alt="vdgfashion logo" className="h-16 object-contain" />
      </div>

      {/* Menu links - Clean E-commerce Semibold hierarchy */}
      <nav className="mt-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              onClick={item.action}
              className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-[18.5px] font-bold transition-all active:scale-[0.98] ${
                item.active
                  ? 'bg-rose-50 text-[#e11d48] font-extrabold shadow-xs'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-black'
              }`}
            >
              <Icon className={`h-6 w-6 ${item.active ? 'text-[#e11d48]' : 'text-zinc-400 group-hover:text-black'}`} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Accurate Custom-Coded Guy Promo card - High Fidelity visual design (Compact Version) */}
      <div className="relative overflow-hidden rounded-[1.85rem] bg-gradient-to-br from-[#783cf5] via-[#8c4bf6] to-[#a35cf7] p-4.5 text-white mt-5 mb-5 w-full aspect-[1/0.92] min-h-[195px] shrink-0 flex flex-col justify-between shadow-[0_12px_24px_-5px_rgba(120,60,245,0.22)] select-none">
        
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
            onClick={() => { setSelectedProduct(null); setSelectedCategory('ALL'); router.push('/categories'); }}
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

      {/* Value props grid - Highly readable contrast */}
      <div className="space-y-4 border-t border-zinc-150 pt-6 mt-2">
        {valueProps.map((prop, idx) => {
          const PropIcon = prop.icon;
          return (
            <div key={idx} className="flex gap-3.5 items-center">
              <div className="h-10.5 w-10.5 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100 shrink-0">
                <PropIcon className="h-5.5 w-5.5 text-zinc-400" />
              </div>
              <div>
                <h5 className="text-[15px] font-black text-zinc-800 leading-tight">{prop.title}</h5>
                <p className="text-[12px] text-zinc-400 leading-tight mt-0.5 font-semibold">{prop.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

    </aside>
  );
}
