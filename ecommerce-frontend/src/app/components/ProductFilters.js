'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatINR } from '../utils/currency';

export default function ProductFilters() {
  const {
    checkedCategories,
    setCheckedCategories,
    priceRange,
    setPriceRange,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    resetFilters,
  } = useStore();

  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Full category checklist for Baby & Kids storefront
  const categoriesList = [
    { name: 'New Born (0–3 Months)', count: 12 },
    { name: '3–6 Months', count: 15 },
    { name: '6–9 Months', count: 8 },
    { name: '9–12 Months', count: 14 },
    { name: '12–18 Months', count: 20 },
    { name: '18–24 Months', count: 18 },
    { name: '2–3 Years', count: 22 },
    { name: '3–4 Years', count: 16 },
    { name: '4–5 Years', count: 15 },
    { name: '5–12 Years', count: 25 },
    { name: 'Teen Dresses', count: 12 },
    { name: 'Baby Essentials', count: 32 },
    { name: 'Mom Care', count: 8 },
    { name: 'Nursery & Bedding', count: 18 },
    { name: 'Toys', count: 48 },
    { name: 'Books', count: 25 },
    { name: 'Stationery', count: 30 },
    { name: 'Home & Living', count: 15 },
    { name: 'Bags', count: 16 }
  ];

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
          
          <div className="pt-2 px-1 relative">
            <input
              type="range"
              min="500"
              max="5000"
              step="100"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full h-1 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-[#e11d48]"
            />
            {/* Displaying current price above or on hover is nice, but to match screenshot: */}
            <div className="mt-3 flex justify-between text-xs sm:text-sm text-zinc-450 font-normal">
              <span>{formatINR(500)}</span>
              <span className="bg-rose-50 text-[#e11d48] px-2.5 py-0.5 rounded-md font-semibold">{formatINR(priceRange)}</span>
              <span>{formatINR(5000)}</span>
            </div>
          </div>
        </div>



        <hr className="border-zinc-100" />

        {/* Sizes */}
        <div className="space-y-3.5">
          <h4 className="font-black text-[13.5px] text-zinc-900 tracking-tight">Size</h4>
          <div className="grid grid-cols-6 gap-2">
            {sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(isSelected ? '' : size)}
                  className={`text-center py-2 text-xs font-black rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-zinc-950 text-white border-zinc-950 scale-103 shadow-sm'
                      : 'border-zinc-200 text-zinc-600 hover:border-zinc-850 hover:text-zinc-950'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
