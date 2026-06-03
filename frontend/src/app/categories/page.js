'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ProductFilters from '../components/ProductFilters';
import ProductCard from '../components/ProductCard';
import ProductDetailView from '../components/ProductDetailView';
import CartDrawer from '../components/CartDrawer';
import Footer from '../components/Footer';
import { ChevronRight, SlidersHorizontal, Grid, LayoutGrid, X, Search } from 'lucide-react';

const STATIC_SUBCATEGORIES = {
  'New Born': ['Baby Rompers', 'New Boy Dress', 'Gown', 'New Born Baby'],
  'Shirts': ['Full Hand Shirts', 'Casual Shirts'],
  'Toys': ['Car', 'Teddy Bear'],
  'Pants': ['Jeans', 'Cargos'],
  'T-Shirts': ['T-Shirts']
};

export default function CategoriesPage() {
  const {
    products,
    categoryItems,
    allCategories,
    searchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    checkedCategories,
    setCheckedCategories,
    priceRange,
    selectedColor,
    selectedSize,
    sortBy,
    setSortBy,
    selectedProduct,
    setSelectedProduct,
    setSearchQuery,
  } = useStore();

  const horizontalCategories = categoryItems || [];

  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'ALL') return [];
    
    const dbSubcategories = allCategories
      .filter(cat => cat.parent_category && cat.parent_category.toLowerCase() === selectedCategory.toLowerCase())
      .map(cat => cat.name);
      
    const productSubcategories = products
      .filter(p => {
        const catName = p.category_name || (typeof p.category === 'string' ? p.category : '');
        return catName && catName.toLowerCase() === selectedCategory.toLowerCase() && p.parent_category;
      })
      .map(p => p.parent_category);
      
    const staticSubs = STATIC_SUBCATEGORIES[selectedCategory] || [];
    
    return Array.from(new Set([...dbSubcategories, ...productSubcategories, ...staticSubs]));
  }, [selectedCategory, allCategories, products]);

  const subcategoryCounts = useMemo(() => {
    const counts = {};
    products.forEach(p => {
      const catName = p.category_name || (typeof p.category === 'string' ? p.category : '');
      if (catName && catName.toLowerCase() === selectedCategory.toLowerCase()) {
        const matchedSub = availableSubcategories.find(sub => {
          if (p.parent_category && p.parent_category.toLowerCase() === sub.toLowerCase()) return true;
          const nameMatch = p.name.toLowerCase().includes(sub.toLowerCase());
          const descMatch = p.description ? p.description.toLowerCase().includes(sub.toLowerCase()) : false;
          return nameMatch || descMatch;
        });
        if (matchedSub) {
          counts[matchedSub] = (counts[matchedSub] || 0) + 1;
        }
      }
    });
    return counts;
  }, [products, selectedCategory, availableSubcategories]);

  const parentCategoryTotalCount = useMemo(() => {
    return products.filter(p => {
      const catName = p.category_name || (typeof p.category === 'string' ? p.category : '');
      return catName && catName.toLowerCase() === selectedCategory.toLowerCase();
    }).length;
  }, [products, selectedCategory]);

  const renderSubcategoriesList = () => {
    if (selectedCategory === 'ALL' || availableSubcategories.length === 0) return null;

    return (
      <div 
        className="bg-white rounded-[1.85rem] p-6 border border-zinc-200 shadow-2xs text-black space-y-4 mb-6"
        data-aos="fade-right"
      >
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
          <span className="text-base font-black text-zinc-950 tracking-tight">
            {selectedCategory} Subcategories
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          <button
            onClick={() => setSelectedSubcategory('ALL')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${
              selectedSubcategory === 'ALL'
                ? 'bg-rose-50 text-[#e11d48]'
                : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
            }`}
          >
            <span>All Products</span>
            <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
              selectedSubcategory === 'ALL' ? 'bg-[#e11d48]/10 text-[#e11d48]' : 'bg-zinc-100 text-zinc-400'
            }`}>
              {parentCategoryTotalCount}
            </span>
          </button>

          {availableSubcategories.map((sub) => {
            const isSelected = selectedSubcategory === sub;
            const count = subcategoryCounts[sub] || 0;
            return (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${
                  isSelected
                    ? 'bg-rose-50 text-[#e11d48]'
                    : 'text-zinc-650 hover:bg-zinc-50 hover:text-zinc-950'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isSelected ? 'text-[#e11d48] translate-x-0.5' : 'text-zinc-400'}`} />
                  <span>{sub}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  isSelected ? 'bg-[#e11d48]/10 text-[#e11d48]' : 'bg-zinc-100 text-zinc-400'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, checkedCategories, priceRange, selectedColor, selectedSize, sortBy]);

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
  }, [selectedCategory, checkedCategories, searchQuery, selectedProduct]);

  // Smart Filtering Logic supporting checklist multi-select and top bar
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search Query Filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    // Category Filter: Check list first, then fallback to top bar
    if (checkedCategories.length > 0) {
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

    // Subcategory Filter
    if (selectedCategory !== 'ALL' && selectedSubcategory !== 'ALL') {
      result = result.filter((p) => {
        if (p.parent_category && p.parent_category.toLowerCase() === selectedSubcategory.toLowerCase()) {
          return true;
        }
        const nameMatch = p.name.toLowerCase().includes(selectedSubcategory.toLowerCase());
        const descMatch = p.description ? p.description.toLowerCase().includes(selectedSubcategory.toLowerCase()) : false;
        return nameMatch || descMatch;
      });
    }

    // Price Range Filter
    result = result.filter((p) => p.price <= priceRange);

    // Color Swatch Filter
    if (selectedColor !== '') {
      result = result.filter((p) => p.colors.some((c) => c.hex === selectedColor));
    }

    // Size Filter
    if (selectedSize !== '') {
      result = result.filter((p) => p.sizes.includes(selectedSize));
    }

    // Sorting Dropdown Logic
    if (sortBy === 'PRICE_LOW_HIGH') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'PRICE_HIGH_LOW') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'RATING') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSubcategory, checkedCategories, priceRange, selectedColor, selectedSize, sortBy]);

  const PRODUCTS_PER_PAGE = 8;
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleScrollToGrid = () => {
    const gridElement = document.getElementById('categories-main-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHorizontalCategoryClick = (catName) => {
    // If clicked, select that category, clear the checkboxes and set the category
    setSelectedCategory(catName);
    setCheckedCategories([catName]);
    setSelectedProduct(null);
  };

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
        
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1400px] mx-auto space-y-6 flex-grow">
          {selectedProduct ? (
            /* High Fidelity product detail page */
            <div data-aos="fade-up">
              <ProductDetailView />
            </div>
          ) : (
            <>
              {/* 1. All Categories Gradient Banner */}
              <section className="relative w-full rounded-[2rem] overflow-hidden shadow-sm border border-zinc-200/50 bg-[#8b5cf6]" data-aos="fade-up">
                <Image 
                  src="/banner/21.png" 
                  alt="All Categories Banner" 
                  width={1774}
                  height={887}
                  className="w-full h-auto select-none"
                  priority
                />
              </section>

              {/* 2. Horizontal Category Selector Card Row */}
              <section className="space-y-6" data-aos="fade-up">
                <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-200">
                  <span className="text-xl sm:text-2xl font-black text-zinc-950 flex items-center gap-2 tracking-tight">
                    <LayoutGrid className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
                    Categories
                  </span>
                </div>
                
                <div className="flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-3 pt-1.5 px-2.5">
                  {horizontalCategories.map((cat, idx) => {
                    const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase() || checkedCategories.includes(cat.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => handleHorizontalCategoryClick(cat.name)}
                        className="flex flex-col items-center flex-shrink-0 cursor-pointer transition-all duration-300 hover:scale-105 focus:outline-none"
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
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* 3. Subheader Filter Info & Sort */}
              <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-1" data-aos="fade-up">
                <div className="space-y-1">
                  
                  {/* Heading & Count */}
                  <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
                    {checkedCategories.length === 1 ? checkedCategories[0] : 'All Categories'}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1.5">
                    Showing 1-{filteredProducts.length} of {products.length} products
                  </p>
                </div>

                {/* Right Side Actions: Sort Dropdown & Mobile Filter Toggle */}
                <div className="flex items-center gap-3 flex-nowrap">
                  {/* Mobile Filters Trigger */}
                  <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  {/* Search Input Box */}
                  <div className="hidden md:flex items-center gap-2 bg-white px-3.5 py-2 border border-zinc-200 rounded-full shadow-2xs w-56 lg:w-64 focus-within:border-[#e11d48]/40 focus-within:ring-2 focus-within:ring-[#e11d48]/10 transition-all">
                    <Search className="h-4 w-4 text-zinc-400 shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products..."
                      className="text-sm sm:text-base font-normal text-zinc-850 bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full placeholder-zinc-400"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-zinc-400 hover:text-zinc-950 focus:outline-none"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Styled Sort Dropdown */}
                  <div className="flex items-center gap-2 bg-white px-3.5 py-2 border border-zinc-200 rounded-full shadow-2xs whitespace-nowrap">
                    <span className="text-sm sm:text-base font-normal text-zinc-500 select-none">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm sm:text-base font-normal text-zinc-800 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer pr-1"
                    >
                      <option value="DEFAULT">Popular</option>
                      <option value="PRICE_LOW_HIGH">Price: Low to High</option>
                      <option value="PRICE_HIGH_LOW">Price: High to Low</option>
                      <option value="RATING">Top Rated</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* 4. Main Two-Column Layout (Filters & Product Grid) */}
              <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                {/* Left Side Filters Card (Desktop) */}
                <div className="hidden lg:block lg:col-span-3 sticky top-4 space-y-6">
                  {renderSubcategoriesList()}
                  <ProductFilters />
                </div>

                {/* Right Side Products Grid */}
                <div id="categories-main-grid" className="lg:col-span-9 w-full scroll-mt-24">
                  {filteredProducts.length === 0 ? (
                    <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50/50 p-12 text-center flex flex-col items-center justify-center min-h-[300px]" data-aos="fade-up">
                      <Grid className="h-10 w-10 text-zinc-300 mb-3.5" />
                      <h3 className="text-base sm:text-lg font-black text-zinc-950">No products found</h3>
                      <p className="text-sm text-zinc-500 mt-2 max-w-xs leading-relaxed font-normal">
                        No products match your selected filters. Try adjusting your category checkbox, color, or price range values.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-fade-in">
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {paginatedProducts.map((product, idx) => (
                          <div 
                            key={product.id} 
                            data-aos="fade-up" 
                            data-aos-delay={(idx % 4) * 80}
                          >
                            <ProductCard product={product} />
                          </div>
                        ))}
                      </div>

                      {/* Categories Page Pagination Controls */}
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
                                handleScrollToGrid();
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
                                    handleScrollToGrid();
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
                                handleScrollToGrid();
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
              </section>
            </>
          )}
          </div>
          <Footer />
        </main>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative ml-auto w-80 h-full bg-white flex flex-col z-10 overflow-y-auto p-6 animate-slide-in-right">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-black">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 rounded-full text-zinc-500 hover:bg-zinc-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-6">
              {renderSubcategoriesList()}
              <ProductFilters />
            </div>
          </div>
        </div>
      )}

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
