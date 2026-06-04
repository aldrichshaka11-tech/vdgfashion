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
    reviews
  } = useStore();

  const router = useRouter();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filterCategory, setFilterCategory] = useState(null);

  const reviewsRef = React.useRef(null);
  const handleScrollReviews = (direction) => {
    if (reviewsRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      reviewsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
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

    if (sortBy === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, checkedCategories, priceRange, selectedColor, selectedSize, sortBy]);

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
          <div className="px-4 sm:px-8 py-6 sm:py-8 space-y-8 max-w-[1600px] w-full mx-auto flex-1">
          
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
                            <Image src={cat.img} alt={cat.name} fill className="object-contain" />
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
                    const bannerImgSrc = matchedProduct?.image || banner.img || banner.image;

                    return (
                    <div key={banner.id || idx} className={`rounded-[2.5rem] p-6 sm:p-8 flex items-center justify-between gap-6 border-0 hover:shadow-md transition-all duration-300 min-h-[220px] ${
                      banner.bg === 'bg-teal-50' ? 'bg-[#e2f2ed]' :
                      banner.bg === 'bg-pink-50' ? 'bg-[#fdf0d5]' :
                      (banner.bg || (idx % 2 === 0 ? 'bg-[#e2f2ed]' : 'bg-[#fdf0d5]'))
                    }`}>
                      <div className="relative w-2/5 aspect-square max-w-[200px] flex-shrink-0 flex items-center justify-center">
                        <img 
                          src={bannerImgSrc} 
                          alt={banner.title} 
                          className="object-contain max-h-[195px] drop-shadow-md hover:scale-105 transition-transform duration-305"
                        />
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
                      src="/products/hoodie_pink.png" 
                      alt="Winter Hoodies Pink Hoodie" 
                      className="object-contain max-h-[160px] drop-shadow-md hover:scale-105 transition-transform duration-305"
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
                  <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => { setSelectedCategory('Men'); setTimeout(() => handleScrollToShop(), 50); }}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden mb-5 rounded-sm">
                      <Image src="/now/1.png" alt="Elegant Fashion" fill className="object-cover" />
                      {/* Shining Effect Overlay */}
                      <div className="absolute inset-0 z-10 before:absolute before:inset-0 before:-translate-x-full group-hover:before:animate-[shine_1.2s_ease-in-out] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent block pointer-events-none"></div>
                    </div>
                    <h3 className="text-lg sm:text-xl font-normal text-zinc-900 mb-2 tracking-wide">Perfect Match for Elegant Fashion</h3>
                    <span className="text-[13px] text-zinc-500 border-b border-zinc-300 pb-0.5 group-hover:text-black group-hover:border-black transition-colors tracking-wide mt-1">Shop Collection</span>
                  </div>

                  {/* Card 2 */}
                  <div className="flex flex-col items-center text-center group cursor-pointer" onClick={() => { setSelectedCategory('Toys'); setTimeout(() => handleScrollToShop(), 50); }}>
                    <div className="relative w-full aspect-[4/5] overflow-hidden mb-5 rounded-sm">
                      <Image src="/now/2.png" alt="Lifestyle Collection" fill className="object-cover" />
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
                      onClick={() => { setSelectedCategory('ALL'); setTimeout(() => handleScrollToShop(), 50); }}
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

              {/* Real Love, Real reviews Section */}
              <div className="space-y-8 pt-10 border-t border-zinc-200/60" data-aos="fade-up">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 text-center tracking-tight">
                  Real Love, Real reviews
                </h2>
                
                <div className="relative flex items-center group px-4">

                  {/* Reviews Cards Scrollable Track */}
                  <div 
                    ref={reviewsRef}
                    className="flex gap-6 overflow-x-auto no-scrollbar pb-6 w-full snap-x scroll-smooth px-1.5"
                  >
                    {(reviews && reviews.length > 0 ? reviews.map((r, idx) => ({
                        image: ["/review_girl_pink.png", "/review_boy_navy.png", "/review_boy_cream.png", "/review_boy_blue.png"][idx % 4],
                        quote: r.comment,
                        name: r.user_name,
                        product: r.product_name || "vdgfashion",
                        rating: r.rating,
                        stickers: null
                    })) : [
                      {
                        image: "/review_girl_pink.png",
                        quote: "Lovely dress..",
                        name: "Anonymous",
                        product: "Rose Pink Weave Wrap...",
                        stickers: null,
                        rating: 5
                      },
                      {
                        image: "/review_boy_navy.png",
                        quote: "nice fabric, nice fit",
                        name: "Preeti.",
                        product: "Navy Blue Peplum Top",
                        rating: 5,
                        stickers: (
                          <div className="absolute top-3 right-3 bg-[#eab308] text-zinc-950 text-[8.5px] font-black px-1.5 py-0.5 rounded-md rotate-12 select-none pointer-events-none shadow-sm flex items-center gap-0.5">
                            <span>₹</span>
                            <span>★</span>
                          </div>
                        )
                      },
                      {
                        image: "/review_boy_cream.png",
                        quote: "Very nice coord set loved it",
                        name: "Anonymous",
                        product: "Khaki Cream Crop Top",
                        stickers: null,
                        rating: 5
                      },
                      {
                        image: "/review_boy_blue.png",
                        quote: "I ordered 2 shirts and 2 tops. Love the fabric, it'...",
                        name: "Gunasekharan Siva",
                        product: "vdgfashion",
                        rating: 5,
                        stickers: (
                          <div className="absolute top-3 right-3 bg-zinc-950 text-white rounded-full p-1 select-none pointer-events-none animate-pulse">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          </div>
                        )
                      },
                      {
                        image: "/review_girl_pink.png",
                        quote: "Perfect fit, fast delivery! The quality of the material is exceptional.",
                        name: "Sarah M.",
                        product: "Organic Green T-Shirt",
                        rating: 5,
                        stickers: null
                      }
                    ]).map((review, idx) => (
                      <div 
                        key={idx}
                        className="group w-[260px] sm:w-[280px] flex-shrink-0 bg-white border border-zinc-150 rounded-3xl p-4 vdgfashion-card-shadow flex flex-col justify-between items-center text-center snap-start transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      >
                        {/* Image with Gold Border & Stickers */}
                        <div className="relative w-full aspect-square rounded-[1.85rem] overflow-hidden border-3 border-[#facc15] shadow-xs">
                          <img 
                            src={review.image} 
                            alt={`Review ${idx + 1}`} 
                            className="object-cover w-full h-full select-none transition-transform duration-500 group-hover:scale-110"
                          />
                          {review.stickers}
                        </div>
                        
                        {/* Quote & Stars & Customer Details */}
                        <div className="mt-4 flex flex-col items-center flex-1 w-full justify-between">
                          <p className="text-sm sm:text-base font-bold text-zinc-800 leading-relaxed line-clamp-2 px-1">
                            &quot;{review.quote}&quot;
                          </p>
                          
                          <div className="mt-3 flex flex-col items-center">
                            {/* Stars */}
                            <div className="flex gap-1 mb-2">
                              {[...Array(review.rating || 5)].map((_, i) => (
                                <svg key={i} className="h-6 w-6 fill-[#facc15] text-[#facc15] drop-shadow-xs" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                            
                            {/* Verified Name */}
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-extrabold text-zinc-900">{review.name}</span>
                              <svg className="h-4 w-4 text-zinc-900 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            </div>
                            
                            {/* Product Name */}
                            <span className="text-xs text-zinc-500 font-extrabold tracking-wide mt-1 uppercase">
                              {review.product}
                            </span>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>

                </div>

                {/* Footer Follow Callout */}
                <div className="text-center pt-2">
                  <h4 className="text-sm sm:text-base font-black text-zinc-900 tracking-tight">
                    Love fashion? Follow <span className="text-[#e11d48] font-black cursor-pointer hover:underline">@vdgfashion</span> now!
                  </h4>
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
