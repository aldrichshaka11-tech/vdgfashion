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
    showOnlyOffers,
    setShowOnlyOffers,
  } = useStore();

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Build category list from root categories only (categoryItems = root only, filtered in StoreContext)
  const categoriesList = categoryItems.map((cat) => {
    const count = products.filter((p) => {
      const catName = p.category_name || '';
      const parentCat = p.parent_category || '';
      return catName.toLowerCase() === cat.name.toLowerCase() ||
             parentCat.toLowerCase() === cat.name.toLowerCase();
    }).length;
    return { name: cat.name, count };
  });

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
    ? categoriesList 
    : categoriesList.slice(0, 5);

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
              {visibleCategories.map((cat) => {
                const isChecked = checkedCategories.includes(cat.name);
                return (
                  <label
                    key={cat.name}
                    className="flex items-center justify-between text-[13.5px] font-normal text-zinc-650 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCategory(cat.name)}
                        className="h-4 w-4 rounded border-zinc-300 text-[#e11d48] focus:ring-[#e11d48] transition cursor-pointer"
                      />
                      <span className={isChecked ? 'text-zinc-950 font-bold' : 'text-zinc-600'}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-normal">({cat.count})</span>
                  </label>
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
