'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';

export default function ProductFilters() {
  const {
    products,
    checkedCategories,
    setCheckedCategories,
    priceRange,
    setPriceRange,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    resetFilters,
    categoryItems,
    allCategories,
    showOnlyOffers,
    setShowOnlyOffers,
  } = useStore();

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Helper for category product counts
  const getProductCount = (catName) => {
    return products.filter((p) => {
      const pCat = (p.category_name || '').toLowerCase();
      const pParent = (p.parent_category || '').toLowerCase();
      const pSub = (p.sub_category || '').toLowerCase();
      const c = catName.toLowerCase();
      return pCat === c || pParent === c || pSub === c;
    }).length;
  };

  const rootCategories = (allCategories || []).filter(c => !c.parent_category);
  const mainCategories = (allCategories || []).filter(c => c.parent_category && rootCategories.some(r => r.name === c.parent_category));
  const subCategories = (allCategories || []).filter(c => c.parent_category && mainCategories.some(m => m.name === c.parent_category));

  const colors = [
    { name: 'Orange-Red', hex: '#fa5252' },
    { name: 'Green', hex: '#12b886' },
    { name: 'Blue', hex: '#228be6' },
    { name: 'Purple', hex: '#7950f2' },
    { name: 'Dark Gray', hex: '#25262b' },
    { name: 'White', hex: '#f8f9fa' }
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleToggleCategory = (catName) => {
    if (checkedCategories.includes(catName)) {
      setCheckedCategories(checkedCategories.filter((c) => c !== catName));
    } else {
      setCheckedCategories([...checkedCategories, catName]);
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
            className="w-full flex items-center justify-between font-black text-[13.5px] text-zinc-900 tracking-tight"
          >
            <span>Category</span>
            {isCategoryOpen ? (
              <ChevronUp className="h-4.5 w-4.5 text-zinc-500" />
            ) : (
              <ChevronDown className="h-4.5 w-4.5 text-zinc-500" />
            )}
          </button>

          {isCategoryOpen && (
            <div className="space-y-2.5 pt-1">
              {visibleCategories.map((rootCat) => {
                const isRootChecked = checkedCategories.includes(rootCat.name);
                const rootMains = mainCategories.filter(m => m.parent_category === rootCat.name);
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
                      <span className="text-xs text-zinc-400 font-normal">({getProductCount(rootCat.name)})</span>
                    </label>

                    {/* Main Categories */}
                    {rootMains.map((mainCat) => {
                      const isMainChecked = checkedCategories.includes(mainCat.name);
                      const mainSubs = subCategories.filter(s => s.parent_category === mainCat.name);
                      return (
                        <div key={mainCat.id} className="pl-5 space-y-1.5 border-l-2 border-zinc-100 ml-[7px] my-2">
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
                            <span className="text-[10px] text-zinc-400 font-normal">({getProductCount(mainCat.name)})</span>
                          </label>

                          {/* Sub Categories */}
                          {mainSubs.length > 0 && (
                            <div className="pl-4 space-y-1.5 border-l border-zinc-100 ml-1.5 mt-1.5 mb-2">
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
          )}
        </div>

        <hr className="border-zinc-100" />

        {/* Price Range */}
        <div className="space-y-3.5">
          <h4 className="font-black text-[13.5px] text-zinc-900 tracking-tight">Price Range</h4>
          
          <div className="pt-2 px-1 relative space-y-4">
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
          <label className="flex items-center gap-2.5 text-[13.5px] font-bold text-zinc-900 cursor-pointer select-none">
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
  );
}
