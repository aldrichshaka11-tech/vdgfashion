'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductDetailView from './components/ProductDetailView';
import HeroSlider from './components/HeroSlider';
import Footer from './components/Footer';
import { ArrowRight, Sparkles, Send, Flame, X, SlidersHorizontal, Grid, LayoutGrid } from 'lucide-react';
import Image from 'next/image';

// AOS animation imports
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  const {
    products,
    categoryItems,
    marketingBanners,
    searchQuery,
    selectedCategory,
    checkedCategories,
    priceRange,
    selectedColor,
    selectedSize,
    sortBy,
    selectedProduct,
    setSelectedProduct,
    setSelectedCategory
  } = useStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, checkedCategories, priceRange, selectedColor, selectedSize, sortBy]);

  // Initialize AOS scroll animation library
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-out-cubic',
      delay: 50,
    });
  }, []);

  // Refresh AOS scroll positions when filters or active product details view state shifts
  useEffect(() => {
    AOS.refresh();
  }, [selectedCategory, searchQuery, selectedProduct, showFiltersPanel]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Category Filter: Check list first, then fallback to top bar
    if (checkedCategories && checkedCategories.length > 0) {
      result = result.filter((p) => {
        return checkedCategories.some((cat) => {
          const catName = (p.category_name || '').toLowerCase();
          const parentCat = (p.parent_category || '').toLowerCase();
          const c = cat.toLowerCase();
          return catName === c || parentCat === c;
        });
      });
    } else if (selectedCategory !== 'ALL') {
      const sel = selectedCategory.toLowerCase();
      result = result.filter((p) => {
        const catName = (p.category_name || '').toLowerCase();
        const parentCat = (p.parent_category || '').toLowerCase();
        return catName === sel || parentCat === sel;
      });
    }

    result = result.filter((p) => p.price <= priceRange);

    if (selectedColor !== '') {
      result = result.filter((p) => p.colors.some((c) => c.hex === selectedColor));
    }

    if (selectedSize !== '') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    if (sortBy === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [searchQuery, selectedCategory, checkedCategories, priceRange, selectedColor, selectedSize, sortBy]);

  const PRODUCTS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Categories Horizontal track list
  const categoryTrack = categoryItems || [];

  const handleScrollToShop = () => {
    const catalogElement = document.getElementById('shop-catalog');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      
      {/* 1. Left Sidebar Navigation (Desktop: fixed, Mobile: hidden) */}
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

      {/* Mobile Sidebar overlay backdrop drawer */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 h-full bg-white flex flex-col animate-slide-in-right z-10">
            {/* Close Mobile Menu absolute */}
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

      {/* 2. Main Content area (Desktop offset left-64) */}
        <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        
        {/* Top Header inside main */}
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        {/* Scrollable interior section */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-8 max-w-[1300px] w-full mx-auto flex-1">
          
          {selectedProduct ? (
            /* High Fidelity detail page */
            <div data-aos="fade-up">
              <ProductDetailView />
            </div>
          ) : (
            /* Home Dashboard layout */
            <div className="space-y-8">
              
              {/* Hero Slider Banner with interactive indicators */}
              <div data-aos="fade-up">
                <HeroSlider onShopClick={handleScrollToShop} />
              </div>

              {/* Horizontal Categories track layout */}
              <div className="space-y-6" data-aos="fade-up">
                <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-200">
                  <span className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2 tracking-tight">
                    <LayoutGrid className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
                    Categories
                  </span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-1.5 px-2.5">
                  {categoryTrack.map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedCategory(cat.categoryRef);
                        setFilterCategory(cat.name);
                        setShowFiltersPanel(true);
                        setTimeout(() => handleScrollToShop(), 50);
                      }}
                      data-aos="zoom-in"
                      data-aos-delay={idx * 50}
                      className={`relative rounded-2xl p-3 w-28 sm:w-32 flex flex-col justify-between flex-shrink-0 cursor-pointer border border-zinc-100 hover:scale-102 hover:shadow-sm transition-all ${
                        selectedCategory === cat.categoryRef ? 'ring-2 ring-[#e11d48]/30 shadow-md bg-rose-50/20' : 'bg-white'
                      }`}
                    >
                      {/* Pastel background photo box */}
                      <div
                        className="w-full aspect-square rounded-xl flex items-center justify-center p-2 relative overflow-hidden"
                        style={{ backgroundColor: cat.bg }}
                      >
                        <div className="relative w-[90%] h-[90%]">
                          <Image src={cat.img} alt={cat.name} fill className="object-contain" />
                        </div>
                      </div>
                      
                      {/* White bottom text label */}
                      <div className="mt-3 bg-white/95 rounded-lg border border-zinc-100/50 py-2 text-center text-sm font-normal text-zinc-950 shadow-2xs">
                        {cat.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid content header - 🔥 Best Picks For You */}
              <div id="shop-catalog" className="space-y-6 scroll-mt-24 animate-fade-in" data-aos="fade-up">
                <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2 tracking-tight">
                      <Flame className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
                      Best Picks For You
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Collapsible toggle Filters indicator */}
                    <button
                      onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
                        showFiltersPanel
                          ? 'bg-[#e11d48] border-[#e11d48] text-white'
                          : 'border-zinc-200 text-zinc-650 hover:bg-zinc-50'
                      }`}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5" />
                      FILTERS
                    </button>

                    <button
                      onClick={() => {
                        setSelectedCategory('ALL');
                        setTimeout(() => handleScrollToShop(), 50);
                      }}
                      className="text-[10px] font-bold text-[#e11d48] hover:text-[#be123c] flex items-center gap-1 transition-colors"
                    >
                      View All
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Main section: grid or dynamic filters side panel */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Slide open Sidebar Filters */}
                  {showFiltersPanel && (
                    <div className="lg:col-span-3" data-aos="fade-right">
                      <ProductFilters filterCategory={filterCategory} onClose={() => { setShowFiltersPanel(false); setFilterCategory(null); }} />
                    </div>
                  )}

                  {/* Main Catalog grid with staggered AOS load waves */}
                  <div className={showFiltersPanel ? 'lg:col-span-9' : 'lg:col-span-12'}>
                    {filteredProducts.length === 0 ? (
                      <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200 vdgfashion-card-shadow flex flex-col items-center justify-center min-h-[260px]">
                        <Grid className="h-9 w-9 text-zinc-400 mb-2" />
                        <h4 className="text-base sm:text-lg font-black text-zinc-950">No matching products</h4>
                        <p className="text-sm text-zinc-500 mt-2 max-w-xs leading-relaxed font-normal">
                          We couldn&apos;t find items in this price bucket or styling dot selection. Try resetting filters.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                          {paginatedProducts.map((prod, idx) => (
                            <div
                              key={prod.id}
                              data-aos="fade-up"
                              data-aos-delay={(idx % 4) * 80}
                            >
                              <ProductCard product={prod} />
                            </div>
                          ))}
                        </div>

                        {/* Storefront Pagination Controls */}
                        {totalPages > 1 && (
                          <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-zinc-200 text-xs font-semibold select-none gap-4">
                            <span className="text-zinc-500 font-normal">
                              Showing <span className="text-[#e11d48] font-bold">{Math.min(filteredProducts.length, (currentPage - 1) * PRODUCTS_PER_PAGE + 1)}</span> to <span className="text-[#e11d48] font-bold">{Math.min(filteredProducts.length, currentPage * PRODUCTS_PER_PAGE)}</span> of <span className="font-bold text-zinc-800">{filteredProducts.length}</span> products
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                disabled={currentPage === 1}
                                onClick={() => {
                                  setCurrentPage(prev => Math.max(1, prev - 1));
                                  handleScrollToShop();
                                }}
                                className="py-2 px-3 bg-white hover:bg-zinc-50 disabled:opacity-40 text-zinc-700 rounded-xl transition-all cursor-pointer border border-zinc-200 active:scale-95 shadow-2xs font-bold"
                              >
                                ◀ Prev
                              </button>
                              {[...Array(totalPages)].map((_, idx) => {
                                const pageNum = idx + 1;
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={() => {
                                      setCurrentPage(pageNum);
                                      handleScrollToShop();
                                    }}
                                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer active:scale-90 shadow-2xs ${
                                      currentPage === pageNum
                                        ? 'bg-gradient-to-r from-[#e11d48] to-[#be123c] text-white'
                                        : 'bg-white hover:bg-zinc-50 text-zinc-600 border border-zinc-200'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                              <button 
                                disabled={currentPage === totalPages}
                                onClick={() => {
                                  setCurrentPage(prev => Math.min(totalPages, prev + 1));
                                  handleScrollToShop();
                                }}
                                className="py-2 px-3 bg-white hover:bg-zinc-50 disabled:opacity-40 text-zinc-700 rounded-xl transition-all cursor-pointer border border-zinc-200 active:scale-95 shadow-2xs font-bold"
                              >
                                Next ▶
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </div>


            </div>
          )}
          </div>
          <Footer />
        </div>

      </div>

      {/* Shopping Cart Drawer slide panel */}
      <CartDrawer />

    </div>
  );
}
