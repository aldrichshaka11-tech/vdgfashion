'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { PRODUCTS } from './data/products';
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
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

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
          const catName = p.category_name || (typeof p.category === 'string' ? p.category : '');
          const parentCat = p.parent_category || p.parentCategory || '';
          return (catName && catName.toLowerCase() === cat.toLowerCase()) || 
                 (parentCat && parentCat.toLowerCase() === cat.toLowerCase());
        });
      });
    } else if (selectedCategory !== 'ALL') {
      result = result.filter((p) => {
        const catName = p.category_name || (typeof p.category === 'string' ? p.category : '');
        const parentCat = p.parent_category || p.parentCategory || '';
        return (catName && catName.toLowerCase() === selectedCategory.toLowerCase()) || 
               (parentCat && parentCat.toLowerCase() === selectedCategory.toLowerCase());
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
                      onClick={() => setSelectedCategory(cat.categoryRef)}
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
                      onClick={() => setSelectedCategory('ALL')}
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
                      <ProductFilters />
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
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {filteredProducts.map((prod, idx) => (
                          <div
                            key={prod.id}
                            data-aos="fade-up"
                            data-aos-delay={(idx % 4) * 80}
                          >
                            <ProductCard product={prod} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Bottom twin marketing banners with side fade AOS slides */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {marketingBanners && marketingBanners.slice(0, 2).map((banner, index) => (
                  <div
                    key={banner.id || index}
                    data-aos={index === 0 ? "fade-right" : "fade-left"}
                    className="relative overflow-hidden rounded-[2rem] border border-zinc-200/40 p-6 sm:p-8 flex items-center gap-4 vdgfashion-card-shadow cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all duration-300 min-h-[220px] sm:min-h-[260px] text-black"
                    style={{ backgroundColor: banner.bg || '#ffffff' }}
                    onClick={() => { setSelectedCategory(banner.categoryRef); handleScrollToShop(); }}
                  >
                    {/* Background decoration lines */}
                    <div className="absolute left-0 top-0 w-24 h-full bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-20 pointer-events-none" />

                    {/* Left Column: Product Image */}
                    <div className="w-[45%] h-full flex items-center justify-center relative select-none">
                      <div className="relative w-[110px] h-[110px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px] z-10 transition-transform duration-500 hover:scale-110">
                        <Image
                          src={banner.img}
                          alt={banner.title}
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </div>

                    {/* Right Column: Text & Button */}
                    <div className="w-[55%] flex flex-col justify-center text-left pl-2 z-10">
                      <h3 className="text-3xl sm:text-4xl lg:text-4.5xl font-serif italic font-black text-zinc-950 leading-tight tracking-tight">
                        {banner.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-zinc-750 font-normal mt-1.5 leading-relaxed">
                        {banner.description}
                      </p>
                      <button
                        className="mt-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs sm:text-sm font-semibold tracking-wider uppercase px-5 py-2.5 rounded-xl w-fit transition-colors shadow-xs active:scale-98"
                      >
                        {banner.buttonText || 'SHOP NOW'}
                      </button>
                    </div>
                  </div>
                ))}
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
