'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from './context/StoreContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import ProductCard from './components/ProductCard';
import ProductFilters from './components/ProductFilters';
import ProductDetailView from './components/ProductDetailView';
import HeroSlider from './components/HeroSlider';
import Footer from './components/Footer';
import { ArrowRight, Sparkles, Send, Flame, X, SlidersHorizontal, Grid, LayoutGrid, Truck, Gift, Shield, ChevronLeft, ChevronRight, Headphones } from 'lucide-react';
import Image from 'next/image';

// AOS animation imports
import AOS from 'aos';
import 'aos/dist/aos.css';

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

// Helper to generate Google-style letter avatar
const getGoogleAvatar = (name) => {
  const initial = (name || 'U').trim().charAt(0).toUpperCase();
  const colors = [
    'bg-[#00897b]', // teal (matching the user's second image)
    'bg-[#4285F4]', // Google Blue
    'bg-[#EA4335]', // Google Red
    'bg-[#34A853]', // Google Green
    'bg-[#FBBC05]', // Google Yellow
    'bg-[#ab47bc]', // Purple
    'bg-[#f4511e]', // Orange
    'bg-[#00acc1]', // Teal Light
    'bg-[#3f51b5]', // Indigo
    'bg-[#e91e63]'  // Pink
  ];
  const charCode = initial.charCodeAt(0) || 0;
  const colorClass = colors[charCode % colors.length];
  
  return (
    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-extrabold text-base ${colorClass} select-none border border-zinc-200/50`}>
      {initial}
    </div>
  );
};

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
    setSelectedCategory,
    setCheckedCategories,
    resetFilters,
    reviews,
    showOnlyOffers
  } = useStore();

  const router = useRouter();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);

  const reviewsRef = React.useRef(null);
  const handleScrollReviews = (direction) => {
    if (reviewsRef.current) {
      const container = reviewsRef.current;
      const scrollAmount = direction === 'left' ? -container.clientWidth : container.clientWidth;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    resetFilters();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

    if (showOnlyOffers) {
      result = result.filter((p) => p.tagType === 'discount' || p.tag_type === 'discount');
    }

    if (sortBy === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, checkedCategories, priceRange, selectedColor, selectedSize, sortBy, showOnlyOffers]);

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
          <div className="flex-grow flex flex-col">
          
          {selectedProduct ? (
            /* High Fidelity detail page */
            <div data-aos="fade-up" className="px-4 sm:px-8 py-6 sm:py-8 space-y-8 max-w-[1600px] w-full mx-auto flex-1">
              <ProductDetailView />
            </div>
          ) : (
            /* Home Dashboard layout */
            <div className="flex-grow flex flex-col">
              
              {/* Hero Slider Banner with interactive indicators */}
              <div data-aos="fade-up" className="w-full">
                <HeroSlider onShopClick={handleScrollToShop} />
              </div>

              <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-8 max-w-[1600px] w-full mx-auto flex-1">
                {/* Horizontal Categories track layout */}
              <div className="space-y-6" data-aos="fade-up">
                <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-200">
                  <span className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2 tracking-tight">
                    <LayoutGrid className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
                    Categories
                  </span>
                </div>
                
                <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1.5 px-2.5">
                  {categoryTrack.map((cat, idx) => {
                    const isSelected = selectedCategory === cat.categoryRef;
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setSelectedCategory(cat.categoryRef);
                          setCheckedCategories([cat.categoryRef]);
                          router.push('/categories');
                        }}
                        data-aos="zoom-in"
                        data-aos-delay={idx * 50}
                        className="flex flex-col items-center flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105"
                      >
                        {/* Circle photo container */}
                        <div
                          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center p-3.5 relative overflow-hidden shadow-2xs transition-all duration-300 ${
                            isSelected ? 'ring-3 ring-[#e11d48] ring-offset-2 scale-102' : 'hover:shadow-sm'
                          }`}
                          style={{ backgroundColor: cat.bg }}
                        >
                          <div className="relative w-4/5 h-4/5">
                            {cat.img ? (
                              <Image src={cat.img} alt={cat.name} fill className="object-contain" />
                            ) : null}
                          </div>
                        </div>
                        
                        {/* Plain text label below */}
                        <span className={`mt-2.5 text-xs sm:text-sm font-bold tracking-tight text-center transition-colors ${
                          isSelected ? 'text-[#e11d48]' : 'text-zinc-700'
                        }`}>
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Offers Section - Controlled by admin marking products as 'discount' */}
              {(() => {
                const offerProducts = products.filter(p => p.tagType === 'discount' || p.tag_type === 'discount');
                if (offerProducts.length === 0) return null;

                return (
                  <div className="space-y-6" data-aos="fade-up">
                    <div className="flex items-center justify-between pb-3.5 border-b border-zinc-200">
                      <span className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2 tracking-tight">
                        <Gift className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
                        Special Offers & Deals
                      </span>
                      <button
                        onClick={() => router.push('/offers')}
                        className="text-xs font-bold text-[#e11d48] hover:text-[#be123c] transition-colors"
                      >
                        View All Offers &rarr;
                      </button>
                    </div>
                    
                    <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1.5 px-1">
                      {offerProducts.map((prod, idx) => (
                        <div
                          key={prod.id}
                          className="w-[220px] sm:w-[260px] flex-shrink-0"
                          data-aos="fade-up"
                          data-aos-delay={idx * 50}
                        >
                          <ProductCard product={prod} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

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
                              Showing <span className="text-[#e11d48] font-normal">{Math.min(filteredProducts.length, (currentPage - 1) * PRODUCTS_PER_PAGE + 1)}</span> to <span className="text-[#e11d48] font-normal">{Math.min(filteredProducts.length, currentPage * PRODUCTS_PER_PAGE)}</span> of <span className="font-normal text-zinc-800">{filteredProducts.length}</span> products
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
                              {getPaginatedRange(currentPage, totalPages).map((pageNum) => {
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
                                        : 'bg-white hover:bg-zinc-50 text-zinc-655 border border-zinc-200'
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

              {/* Promo Banners Section */}
              {marketingBanners && marketingBanners.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" data-aos="fade-up">
                  {marketingBanners.map((banner, idx) => {
                    const catRef = banner.categoryRef || banner.category_ref;
                    let matchedProduct = null;
                    if (products && products.length > 0) {
                      if (catRef) {
                        matchedProduct = products.find(p => p.category_name === catRef || p.parent_category === catRef || p.category === catRef);
                      }
                      if (!matchedProduct) {
                        matchedProduct = products[idx % products.length];
                      }
                    }
                    const bannerImgSrc = banner.img || banner.image || (
                      (idx === 1 || banner.title?.toLowerCase().includes('hoodie'))
                        ? '/products/baby_frock.png'
                        : (matchedProduct?.image)
                    );

                    return (
                    <div key={banner.id || idx} className={`rounded-[2.5rem] p-6 sm:p-8 flex items-center justify-between gap-6 border-0 hover:shadow-md transition-all duration-300 min-h-[220px] ${
                      banner.bg === 'bg-teal-50' ? 'bg-[#e2f2ed]' :
                      banner.bg === 'bg-pink-50' ? 'bg-[#fdf0d5]' :
                      (banner.bg || (idx % 2 === 0 ? 'bg-[#e2f2ed]' : 'bg-[#fdf0d5]'))
                    }`}>
                      <div className="relative w-2/5 aspect-square max-w-[200px] flex-shrink-0 flex items-center justify-center">
                        {bannerImgSrc ? (
                          <img 
                            src={bannerImgSrc} 
                            alt={banner.title} 
                            className={`object-contain max-h-[195px] drop-shadow-md transition-transform duration-305 ${
                              bannerImgSrc.includes('baby_frock.png') ? 'scale-[1.45] hover:scale-[1.55]' : 'hover:scale-105'
                            }`}
                          />
                        ) : null}
                      </div>
                      <div className="flex-grow flex flex-col items-start space-y-3 pl-2">
                        <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">{banner.title}</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 font-semibold">{banner.description}</p>
                        <button 
                          onClick={() => {
                            if (catRef) {
                              setSelectedCategory(catRef);
                              setCheckedCategories([catRef]);
                            } else {
                              setSelectedCategory('ALL');
                            }
                            setTimeout(() => handleScrollToShop(), 50);
                          }}
                          className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-md shadow-red-900/10 cursor-pointer"
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                    );
                  })}
                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" data-aos="fade-up">
                {/* Left Banner: Summer Outfits */}
                <div className="rounded-[2.5rem] p-6 sm:p-8 bg-[#e2f2ed] flex items-center justify-between gap-6 border border-[#c4e3d9]/30 hover:shadow-md transition-all duration-300 min-h-[220px]">
                  <div className="relative w-1/3 aspect-square max-w-[155px] flex-shrink-0 flex items-center justify-center">
                    <img 
                      src="/products/tshirt_green.png" 
                      alt="Summer Outfits Green Tshirt" 
                      className="object-contain max-h-[160px] drop-shadow-md hover:scale-105 transition-transform duration-305"
                    />
                  </div>
                  <div className="flex-grow flex flex-col items-start space-y-3 pl-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Summer Outfits</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 font-semibold">100% Pure Natural Cotton Wear</p>
                    <button 
                      onClick={handleScrollToShop}
                      className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-md shadow-red-900/10 cursor-pointer"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Right Banner: Winter Hoodies */}
                <div className="rounded-[2.5rem] p-6 sm:p-8 bg-[#fdf0d5] flex items-center justify-between gap-6 border border-[#ebd7b1]/30 hover:shadow-md transition-all duration-300 min-h-[220px]">
                  <div className="relative w-1/3 aspect-square max-w-[155px] flex-shrink-0 flex items-center justify-center">
                    <img 
                      src="/products/baby_frock.png" 
                      alt="Winter Hoodies Pink Hoodie" 
                      className="object-contain max-h-[160px] drop-shadow-md transition-transform duration-305 scale-[1.45] hover:scale-[1.55]"
                    />
                  </div>
                  <div className="flex-grow flex flex-col items-start space-y-3 pl-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Winter Hoodies</h3>
                    <p className="text-xs sm:text-sm text-zinc-500 font-semibold">With 25% Off All Winter Wear</p>
                    <button 
                      onClick={handleScrollToShop}
                      className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white px-6 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-md shadow-red-900/10 cursor-pointer"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
              )}

              {/* Shop The Latest Trends Section */}
              <div className="py-8 sm:py-12 overflow-hidden animate-fade-in" data-aos="fade-up">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10 items-center">
                  
                  {/* Card 1 */}
                  <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => { setSelectedCategory('Men'); setCheckedCategories(['Men']); router.push('/categories'); }}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden mb-5 rounded-sm">
                      <Image src="/now/1.png" alt="Elegant Fashion" fill className="object-cover" />
                      {/* Shining Effect Overlay */}
                      <div className="absolute inset-0 z-10 before:absolute before:inset-0 before:-translate-x-full group-hover:before:animate-[shine_1.2s_ease-in-out] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent block pointer-events-none"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-normal text-zinc-900 mb-2 tracking-wide">Perfect Match for Elegant Fashion</h3>
                    <span className="text-[13px] text-zinc-500 border-b border-zinc-300 pb-0.5 group-hover:text-black group-hover:border-black transition-colors tracking-wide mt-1">Shop Collection</span>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => { setSelectedCategory('Toys'); setCheckedCategories(['Toys']); router.push('/categories'); }}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden mb-5 rounded-sm">
                      <Image src="/now/2.PNG" alt="Lifestyle Collection" fill className="object-cover object-left" />
                      {/* Shining Effect Overlay */}
                      <div className="absolute inset-0 z-10 before:absolute before:inset-0 before:-translate-x-full group-hover:before:animate-[shine_1.2s_ease-in-out] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent block pointer-events-none"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-normal text-zinc-900 mb-2 tracking-wide">Trendy Lifestyle Collection</h3>
                    <span className="text-[13px] text-zinc-500 border-b border-zinc-300 pb-0.5 group-hover:text-black group-hover:border-black transition-colors tracking-wide mt-1">Shop Collection</span>
                  </div>

                  {/* Text Column */}
                  <div className="flex flex-col items-start text-left pl-0 md:pl-6 lg:pl-10">
                    <h2 className="text-2xl sm:text-3xl font-normal text-zinc-900 mb-4 tracking-tight leading-tight">Shop The Latest Trends</h2>
                    <p className="text-sm text-zinc-500 leading-relaxed mb-6 font-normal">
                      Stay ahead of the curve with our curated collection of the latest fashion trends. Shop now for fresh styles and must-have pieces!
                    </p>
                    <button 
                      onClick={() => { setSelectedCategory('ALL'); setCheckedCategories([]); router.push('/categories'); }}
                      className="bg-[#212529] hover:bg-black text-white px-8 py-3.5 text-sm font-semibold transition-colors shadow-md rounded-sm"
                    >
                      Shop Now
                    </button>
                  </div>

                </div>
              </div>

              {/* Value Props Section with Cherry Blossom Petals decoration */}
              <div className="relative py-8 px-4 sm:px-8 overflow-hidden" data-aos="fade-up">
                
                {/* Left Blossom Petal Cluster */}
                <div className="absolute left-3 sm:left-6 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
                  <img src="/petal.png" alt="Sakura Petals Left" className="h-20 sm:h-24 w-auto object-contain opacity-95" />
                </div>

                {/* Right Blossom Petal Cluster */}
                <div className="absolute right-3 sm:right-6 md:right-8 lg:right-12 top-1/2 -translate-y-1/2 hidden md:block select-none pointer-events-none">
                  <img src="/petal.png" alt="Sakura Petals Right" className="h-20 sm:h-24 w-auto object-contain opacity-95 scale-x-[-1]" />
                </div>

                {/* Features Row */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 max-w-[1000px] mx-auto w-full">
                  
                  {/* Free Delivery */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-[220px]">
                    <Truck className="h-9 w-9 text-zinc-900 stroke-[1.5]" />
                    <h5 className="text-sm sm:text-base font-black text-zinc-950 tracking-wider">FREE DELIVERY</h5>
                    <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">Enjoy free delivery on all orders</p>
                  </div>

                  {/* Easy Returns */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-[220px]">
                    <Gift className="h-9 w-9 text-zinc-900 stroke-[1.5]" />
                    <h5 className="text-sm sm:text-base font-black text-zinc-950 tracking-wider">EASY RETURNS</h5>
                    <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">Shop with confidence, enjoy easy returns</p>
                  </div>

                  {/* Secure Payments */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-[220px]">
                    <Shield className="h-9 w-9 text-zinc-900 stroke-[1.5]" />
                    <h5 className="text-sm sm:text-base font-black text-zinc-950 tracking-wider">SECURE PAYMENTS</h5>
                    <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">Shop securely with our trusted payment options</p>
                  </div>

                  {/* Best Online Support */}
                  <div className="flex flex-col items-center text-center space-y-3 max-w-[220px]">
                    <Headphones className="h-9 w-9 text-zinc-900 stroke-[1.5]" />
                    <h5 className="text-sm sm:text-base font-black text-zinc-950 tracking-wider">BEST ONLINE SUPPORT</h5>
                    <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">Always available to assist with any questions or issues.</p>
                  </div>

                </div>

              </div>

              {/* Google Reviews Section */}
              <div className="space-y-8 pt-10 border-t border-zinc-200/60" data-aos="fade-up">
                <div className="bg-[#f8f9fa] border border-zinc-200/80 rounded-[2rem] p-6 sm:p-8 vdgfashion-card-shadow space-y-6 sm:space-y-8">
                  {/* Google Reviews Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200/60 pb-6">
                    <div className="flex flex-col items-center sm:items-start gap-1">
                      <div className="flex items-center gap-2">
                        {/* Google Colored Logo */}
                        <span className="text-2xl sm:text-3xl font-bold tracking-tight select-none">
                          <span className="text-[#4285F4]">G</span>
                          <span className="text-[#EA4335]">o</span>
                          <span className="text-[#FBBC05]">o</span>
                          <span className="text-[#4285F4]">g</span>
                          <span className="text-[#34A853]">l</span>
                          <span className="text-[#EA4335]">e</span>
                        </span>
                        <span className="text-2xl sm:text-3xl font-semibold text-[#3c4043] tracking-tight">Reviews</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-[#202124]">(4.8)</span>
                        <div className="flex gap-0.5">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} className="h-5 w-5 fill-[#facc15] text-[#facc15]" viewBox="0 0 24 24">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                            </svg>
                          ))}
                          <svg className="h-5 w-5 text-zinc-300" viewBox="0 0 24 24">
                            <defs>
                              <linearGradient id="grad-4.8">
                                <stop offset="80%" stopColor="#facc15" />
                                <stop offset="80%" stopColor="#e4e4e7" />
                              </linearGradient>
                            </defs>
                            <path fill="url(#grad-4.8)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                        <span className="text-sm text-zinc-500 font-medium">(191 reviews)</span>
                      </div>
                    </div>
                    
                    {/* Share Feedback Button */}
                    <button 
                      onClick={() => alert("Thank you for your interest! Review submissions are currently closed.")}
                      className="self-center bg-[#1a73e8] hover:bg-[#1557b0] text-white px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
                    >
                      Share your feedback
                    </button>
                  </div>

                  {/* Reviews Carousel Wrapper */}
                  <div className="relative flex items-center group px-12">
                    {/* Left Navigation Arrow */}
                    <button
                      onClick={() => handleScrollReviews('left')}
                      className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-zinc-50 text-zinc-700 rounded-full flex items-center justify-center border border-zinc-200/80 shadow-md transition-all z-30 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
                      aria-label="Previous Reviews"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Reviews Scroll Track */}
                    <div
                      ref={reviewsRef}
                      className="flex gap-6 overflow-x-auto no-scrollbar pb-4 w-full snap-x scroll-smooth px-1"
                    >
                      {[
                        {
                          quote: "Excellent collection of kids wear and ladies kurtis. The fabric quality is top-notch and the designs are very trendy. Highly recommend VDG Fashion!",
                          name: "Aarthi Swaminathan",
                          location: "Local Guide • Google Review",
                          rating: 5
                        },
                        {
                          quote: "Great customer service and very reasonable prices. I bought cotton dresses for my daughter and the stitching is perfect. Best boutique in Virudhunagar!",
                          name: "Manoj Kumar",
                          location: "Google Review",
                          rating: 5
                        },
                        {
                          quote: "Superb collections! The material is extremely soft, breathable, and perfect for kids. Very fast delivery and neat packaging.",
                          name: "Priya Dharshini",
                          location: "Local Guide • Google Review",
                          rating: 5
                        },
                        {
                          quote: "Highly satisfied with the product quality. The colors are exactly as shown in the catalog. Excellent response from the store team.",
                          name: "Sudhakar T.",
                          location: "Google Review",
                          rating: 5
                        },
                        {
                          quote: "A perfect place to shop for modern and comfortable clothing. The fabric doesn't fade after wash. My kids absolutely love their new dresses!",
                          name: "Janani Rajesh",
                          location: "Google Review",
                          rating: 5
                        }
                      ].map((review, idx) => (
                        <div
                          key={idx}
                          className="w-full sm:w-[340px] flex-shrink-0 bg-white border border-zinc-200/60 rounded-2xl p-5 sm:p-6 snap-start flex flex-col justify-between min-h-[220px] shadow-2xs hover:shadow-xs transition-shadow duration-200"
                        >
                          {/* Card Top: Stars */}
                           <div className="flex gap-0.5 mb-3">
                            {[...Array(review.rating || 5)].map((_, i) => (
                              <svg key={i} className="h-4.5 w-4.5 fill-[#facc15] text-[#facc15]" viewBox="0 0 24 24">
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                          </div>

                          {/* Card Middle: Quote / Comments */}
                          <div className="flex-1 flex flex-col justify-between">
                            <p className="text-zinc-700 text-sm sm:text-[14.5px] leading-relaxed line-clamp-4 font-normal">
                              &quot;{review.quote}&quot;
                            </p>
                            <button 
                              onClick={() => alert(`Review by ${review.name}: \n"${review.quote}"`)}
                              className="text-zinc-400 hover:text-zinc-655 text-[11px] font-bold text-left mt-2 hover:underline cursor-pointer"
                            >
                              Read more
                            </button>
                          </div>

                          {/* Card Bottom: User Row */}
                          <div className="flex items-center gap-3.5 mt-5 pt-4 border-t border-zinc-100">
                            {getGoogleAvatar(review.name)}
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-extrabold text-[#202124]">{review.name}</span>
                              <span className="text-[10px] text-zinc-500 font-bold tracking-wide mt-0.5 uppercase">{review.location}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Right Navigation Arrow */}
                    <button
                      onClick={() => handleScrollReviews('right')}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 bg-white hover:bg-zinc-50 text-zinc-700 rounded-full flex items-center justify-center border border-zinc-200/80 shadow-md transition-all z-30 hover:scale-105 active:scale-95 cursor-pointer pointer-events-auto"
                      aria-label="Next Reviews"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Footer Follow Callout */}
                <div className="text-center pt-2">
                  <h4 className="text-sm sm:text-base font-black text-zinc-900 tracking-tight">
                    Love fashion? Follow <a href="https://www.instagram.com/vdgfashion" target="_blank" rel="noopener noreferrer" className="text-[#e11d48] font-black cursor-pointer hover:underline">@vdgfashion</a> now!
                  </h4>
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
