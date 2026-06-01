'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import { PRODUCTS } from '../data/products';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import ProductCard from '../components/ProductCard';
import ProductDetailView from '../components/ProductDetailView';
import { Heart, ChevronRight, X } from 'lucide-react';

export default function WishlistPage() {
  const { products, selectedProduct, wishlist, searchQuery, setSelectedProduct, setSelectedCategory } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-out-cubic',
      delay: 40,
    });
  }, []);

  useEffect(() => {
    AOS.refresh();
  }, [wishlist.length, searchQuery, selectedProduct]);

  // Filter items in the wishlist that match search queries
  const wishlistProducts = useMemo(() => {
    let result = products.filter((item) => wishlist.includes(item.id));

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.category_name && item.category_name.toLowerCase().includes(q)) ||
          (typeof item.category === 'string' && item.category.toLowerCase().includes(q))
      );
    }

    return result;
  }, [wishlist, searchQuery]);

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      {/* Left Sidebar Navigation (Desktop) */}
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

      {/* Mobile Sidebar overlay backdrop drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 h-full bg-white flex flex-col animate-slide-in-right z-10">
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-5 right-5 p-1 rounded-full text-zinc-500 hover:bg-zinc-150"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar className="flex h-full w-full border-r-0" />
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />
        
        {/* Full-viewport scrolling container with decoupled scroll constraints */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1400px] mx-auto space-y-6 flex-grow">
            

            {selectedProduct ? (
              /* High Fidelity Product Detail view */
              <div data-aos="fade-up">
                <ProductDetailView />
              </div>
            ) : (
              <>
                {/* 1. Shopping Wishlist Hero Banner using wishlist.png */}
                <section className="relative w-full rounded-[2rem] overflow-hidden shadow-sm border border-zinc-200/50 bg-[#e11d48]" data-aos="fade-up">
                  <Image 
                    src="/banner/wishlist.png" 
                    alt="Wishlist Banner" 
                    width={1774}
                    height={887}
                    className="w-full h-auto select-none"
                    priority
                  />
                </section>

                {/* 2. Headline Title indicator */}
                <div className="space-y-1 pt-1" data-aos="fade-up">
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                    My Wishlist
                    <span className="text-sm font-normal text-zinc-500">({wishlistProducts.length} items)</span>
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1.5">All your saved style favorites in one place.</p>
                </div>

                {/* 3. Wishlist dynamic grid layout */}
                <section className="pt-2">
                  {wishlistProducts.length === 0 ? (
                    <div className="rounded-[2rem] border border-zinc-200 bg-white p-12 text-center flex flex-col items-center justify-center min-h-[300px]" data-aos="fade-up">
                      <Heart className="h-10 w-10 text-zinc-300 mb-3.5 fill-zinc-100" />
                      <h3 className="text-base sm:text-lg font-black text-zinc-950">Your wishlist is empty</h3>
                      <p className="text-sm text-zinc-500 mt-2 max-w-xs leading-relaxed font-normal">
                        Tap the heart icon on any product cards while browsing the home page or catalog to save your absolute favorites here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                      {wishlistProducts.map((product, idx) => (
                        <div 
                          key={product.id} 
                          data-aos="fade-up" 
                          data-aos-delay={(idx % 4) * 80}
                        >
                          <ProductCard product={product} />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </>
            )}
            
          </div>
          <Footer />
        </main>
      </div>

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
