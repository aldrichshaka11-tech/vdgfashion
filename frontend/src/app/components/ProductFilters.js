'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw, Minus, Plus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';

export default function ProductFilters() {
  const {
    products,
    checkedCategories,
    setCheckedCategories,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    resetFilters,
    allCategories,
    showOnlyOffers,
    setShowOnlyOffers,
  } = useStore();

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isOffersOpen, setIsOffersOpen] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});

  const toggleExpand = (catName, e) => {
    e.preventDefault();
    e.stopPropagation();
    setExpandedCategories(prev => ({
      ...prev,
      [catName]: !prev[catName]
    }));
  };

  // Helper for category product counts
  const getProductCount = (catName) => {
    return products.filter((p) => {
      const pCat = (p.category || '').toLowerCase();
      const pMain = (p.main_category || '').toLowerCase();
      const pSub = (p.sub_category || '').toLowerCase();
      const c = catName.toLowerCase();
      return pCat === c || pMain === c || pSub === c;
    }).length;
  };

  const rootCategories = (allCategories || []).filter(c => c.type === 'main_category');
  const mainCategories = (allCategories || []).filter(c => c.type === 'category' && rootCategories.some(r => r.name === c.main_category));
  const subCategories = (allCategories || []).filter(c => c.type === 'sub_category' && mainCategories.some(m => m.name === c.category));

  const handleToggleCategory = (catName) => {
    let newChecked;
    if (checkedCategories.includes(catName)) {
      newChecked = checkedCategories.filter((c) => c !== catName);
    } else {
      newChecked = [...checkedCategories, catName];
    }
    setCheckedCategories(newChecked);

    // Fix the "Uncheck" fallback bug
    if (newChecked.length === 0) {
      setSelectedCategory('ALL');
    }
  };

  const visibleCategories = showAllCategories 
    ? rootCategories 
    : rootCategories.slice(0, 5);

  return (
    <div
      className="bg-white rounded-3xl p-6 border border-zinc-200 shadow-xs text-black"
      data-aos="fade-right"
      data-aos-duration="700"
      data-aos-easing="ease-out-cubic"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-5">
        <h3 className="text-lg font-black text-zinc-950">Filters</h3>
        <button
          onClick={resetFilters}
          className="text-xs font-bold text-[#e11d48] hover:text-[#be123c] transition-colors flex items-center gap-1"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Category Filters (Collapsible) */}
        <div className="space-y-3.5">
          <button
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
            className="w-full flex items-center justify-between font-black text-[13.5px] text-zinc-900 tracking-tight transition-opacity hover:opacity-80"
          >
            <span>Category</span>
            {isCategoryOpen ? (
              <ChevronUp className="h-4.5 w-4.5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4.5 w-4.5 text-zinc-500" />
            )}
          </button>

          <div className={`space-y-2.5 pt-1 overflow-hidden transition-all duration-300 ease-in-out ${isCategoryOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {visibleCategories.map((rootCat) => {
              const isRootChecked = checkedCategories.includes(rootCat.name);
              const rootMains = mainCategories.filter(m => m.main_category === rootCat.name);
              const isExpanded = expandedCategories[rootCat.name];

              return (
                <div key={rootCat.id} className="space-y-1.5 pb-2">
                  <label className="flex items-center justify-between text-[13.5px] font-normal text-zinc-650 cursor-pointer select-none">
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isRootChecked}
                        onChange={() => handleToggleCategory(rootCat.name)}
                        className="h-4 w-4 rounded border-zinc-300 text-[#e11d48] focus:ring-[#e11d48] transition cursor-pointer"
                      />
                      <span className={isRootChecked ? 'text-zinc-950 font-bold' : 'text-zinc-600'}>
                        {rootCat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-zinc-400 font-normal">({getProductCount(rootCat.name)})</span>
                      {rootMains.length > 0 && (
                        <button 
                          onClick={(e) => toggleExpand(rootCat.name, e)}
                          className="p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-700 transition-colors"
                        >
                          {isExpanded ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                        </button>
                      )}
                    </div>
                  </label>

                  {/* Main Categories */}
                  {isExpanded && rootMains.map((mainCat) => {
                    const isMainChecked = checkedCategories.includes(mainCat.name);
                    const mainSubs = subCategories.filter(s => s.category === mainCat.name);
                    const isMainExpanded = expandedCategories[mainCat.name];

                    return (
                      <div key={mainCat.id} className="pl-5 space-y-1.5 border-l-2 border-zinc-100 ml-[7px] my-2 animate-fade-in">
                        <label className="flex items-center justify-between text-[12.5px] font-normal text-zinc-550 cursor-pointer select-none">
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={isMainChecked}
                              onChange={() => handleToggleCategory(mainCat.name)}
                              className="h-3.5 w-3.5 rounded border-zinc-300 text-[#e11d48] focus:ring-[#e11d48] transition cursor-pointer"
                            />
                            <span className={isMainChecked ? 'text-zinc-900 font-bold' : 'text-zinc-500'}>
                              {mainCat.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-400 font-normal">({getProductCount(mainCat.name)})</span>
                            {mainSubs.length > 0 && (
                              <button 
                                onClick={(e) => toggleExpand(mainCat.name, e)}
                                className="p-0.5 hover:bg-zinc-100 rounded text-zinc-400 hover:text-zinc-700 transition-colors"
                              >
                                {isMainExpanded ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                              </button>
                            )}
                          </div>
                        </label>

                        {/* Sub Categories */}
                        {isMainExpanded && mainSubs.length > 0 && (
                          <div className="pl-4 space-y-1.5 border-l border-zinc-100 ml-1.5 mt-1.5 mb-2 animate-fade-in">
                            {mainSubs.map((subCat) => {
                              const isSubChecked = checkedCategories.includes(subCat.name);
                              return (
                                <label key={subCat.id} className="flex items-center justify-between text-[11.5px] font-normal text-zinc-450 cursor-pointer select-none">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="checkbox"
                                      checked={isSubChecked}
                                      onChange={() => handleToggleCategory(subCat.name)}
                                      className="h-3 w-3 rounded border-zinc-300 text-[#e11d48] focus:ring-[#e11d48] transition cursor-pointer"
                                    />
                                    <span className={isSubChecked ? 'text-zinc-800 font-bold' : 'text-zinc-400'}>
                                      {subCat.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-zinc-400 font-normal">({getProductCount(subCat.name)})</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
            
            <button
              type="button"
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-[12px] font-bold text-[#7c3aed] hover:text-[#6d28d9] transition pt-1 block"
            >
              {showAllCategories ? '- View Less' : '+ View More'}
            </button>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* Price Range */}
        <div className="space-y-3.5">
          <button
            onClick={() => setIsPriceOpen(!isPriceOpen)}
            className="w-full flex items-center justify-between font-black text-[13.5px] text-zinc-900 tracking-tight transition-opacity hover:opacity-80"
          >
            <span>Price Range</span>
            {isPriceOpen ? (
              <ChevronUp className="h-4.5 w-4.5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4.5 w-4.5 text-zinc-500" />
            )}
          </button>
          
          <div className={`pt-2 px-1 relative space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${isPriceOpen ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0 py-0'}`}>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#e11d48]"
            />
            <div className="flex justify-between text-xs sm:text-sm text-zinc-450 font-normal">
              <span>{formatINR(100)}</span>
              <span className="bg-rose-50 text-[#e11d48] px-2.5 py-0.5 rounded-md font-semibold">{formatINR(priceRange)}</span>
              <span>{formatINR(5000)}</span>
            </div>

            {/* Quick Filter Buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[100, 500, 1000, 5000].map((val) => {
                const isActive = priceRange === val;
                const label = val === 5000 ? 'All' : formatINR(val);
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPriceRange(val)}
                    className={`px-3 py-1.5 text-xs font-black rounded-lg border transition-all active:scale-95 ${
                      isActive
                        ? 'bg-[#e11d48] text-white border-[#e11d48]'
                        : 'border-zinc-200 text-zinc-650 hover:border-zinc-800 hover:text-zinc-950 bg-white'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <hr className="border-zinc-100" />

        {/* Offers Checkbox */}
        <div className="space-y-3.5">
          <button
            onClick={() => setIsOffersOpen(!isOffersOpen)}
            className="w-full flex items-center justify-between font-black text-[13.5px] text-zinc-900 tracking-tight transition-opacity hover:opacity-80"
          >
            <span>Promotions</span>
            {isOffersOpen ? (
              <ChevronUp className="h-4.5 w-4.5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4.5 w-4.5 text-zinc-500" />
            )}
          </button>
          
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOffersOpen ? 'max-h-[100px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <label className="flex items-center gap-2.5 text-[13.5px] font-bold text-zinc-900 cursor-pointer select-none pt-2">
              <input
                type="checkbox"
                checked={showOnlyOffers}
                onChange={(e) => setShowOnlyOffers(e.target.checked)}
                className="h-4.5 w-4.5 rounded border-zinc-300 text-[#e11d48] focus:ring-[#e11d48] transition cursor-pointer"
              />
              <span className={showOnlyOffers ? 'text-zinc-950 font-bold' : 'text-zinc-600'}>
                Offers & Discounts Only
              </span>
            </label>
          </div>
        </div>

      </div>
    </div>
  );
}
