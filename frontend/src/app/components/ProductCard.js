'use client';

import React from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Image from 'next/image';
import { formatINR } from '../utils/currency';

const safeBtnColor = (color) => {
  const colorsMap = {
    'bg-indigo-600 hover:bg-indigo-700': 'bg-indigo-600 hover:bg-indigo-700',
    'bg-pink-600 hover:bg-pink-700': 'bg-pink-600 hover:bg-pink-700',
    'bg-teal-600 hover:bg-teal-700': 'bg-teal-600 hover:bg-teal-700',
    'bg-amber-600 hover:bg-amber-700': 'bg-amber-600 hover:bg-amber-700',
    'bg-purple-600 hover:bg-purple-700': 'bg-purple-600 hover:bg-purple-700',
    'bg-blue-600 hover:bg-blue-700': 'bg-blue-600 hover:bg-blue-700',
    'bg-teal-50 hover:bg-teal-100': 'bg-teal-500 hover:bg-teal-600',
    'bg-teal-500 hover:bg-teal-600': 'bg-teal-500 hover:bg-teal-600',
    'bg-slate-700 hover:bg-slate-800': 'bg-slate-700 hover:bg-slate-800',
    'bg-orange-600 hover:bg-orange-700': 'bg-orange-600 hover:bg-orange-700',
  };
  return colorsMap[color] || 'bg-[#e11d48] hover:bg-[#be123c]';
};

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted, setSelectedProduct } = useStore();

  const isLiked = isWishlisted(product.id);

  const colors = product.colors && product.colors.length > 0 
    ? product.colors 
    : [{ name: "Sage Green", hex: "#0ca678" }];

  const sizes = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ["0-1M"];

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent opening detail view
    addToCart(product, colors[0].hex, sizes[0], 1);
  };

  const getTagBgColor = () => {
    switch (product.tagType) {
      case 'discount':
        return 'bg-[#e11d48] text-white'; // Deep pink/red
      case 'new':
        return 'bg-[#0ca678] text-white'; // Green
      case 'bestseller':
        return 'bg-[#4c6ef5] text-white'; // Indigo
      default:
        return 'bg-[#e11d48] text-white';
    }
  };

  return (
    <div
      onClick={() => setSelectedProduct(product)}
      className="group bg-white rounded-[1.8rem] p-4.5 border border-zinc-100 vdgfashion-card-shadow flex flex-col justify-between vdgfashion-transition cursor-pointer hover:-translate-y-1 hover:shadow-lg text-black"
    >
      <div>
        {/* Soft Pastel Background Image container */}
        {(() => {
          const pastelColors = [
            '#e5dbff', // Pastel Purple/Lavender
            '#cbe2fd', // Pastel Blue
            '#c6f8ec', // Pastel Mint/Green
            '#ffd8a8', // Pastel Orange/Peach
            '#ffc6e0', // Pastel Pink
            '#fde68a', // Pastel Yellow
            '#fecdd3', // Pastel Rose/Red
            '#ccfbf1', // Pastel Teal
            '#f5d0fe', // Pastel Violet
            '#c7d2fe'  // Pastel Indigo
          ];
          const colorIdx = product.id || 0;
          const cardBg = pastelColors[colorIdx % pastelColors.length];
          return (
            <div
              className="relative w-full aspect-square rounded-[1.4rem] overflow-hidden vdgfashion-transition group-hover:opacity-95"
              style={{ backgroundColor: cardBg }}
            >
              {/* Top-Left Tag Badge */}
          {product.discount && (
            <div className={`absolute top-3 left-3 z-10 text-xs font-bold px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${getTagBgColor()}`}>
              {product.discount}
            </div>
          )}

          {/* Top-Right Heart Wishlist Circle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className="absolute top-3 right-3 z-10 h-8.5 w-8.5 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all text-zinc-400 hover:text-red-500 border border-zinc-50"
            aria-label="Wishlist toggle"
          >
            <Heart className={`h-4.5 w-4.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
          </button>

          {/* Product Illustration */}
          <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover object-top"
              priority
            />
          </div>

          {/* Rating tag bottom left */}
          <div className="absolute bottom-3 left-3 z-10 bg-white/95 px-2.5 py-1 rounded-full text-xs font-bold text-zinc-800 border border-zinc-150 flex items-center gap-1 shadow-xs">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>
      ); })()}

        {/* Text layers */}
        <div className="mt-4 space-y-2 pr-2">
          {/* Title - Elegant Semibold for clean contrast */}
          <h3 className="text-base font-bold leading-tight text-zinc-900 line-clamp-1 group-hover:text-[#e11d48] transition-colors tracking-tight">
            {product.name}
          </h3>

          {/* Prices - Bold weight for clear hierarchy */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-extrabold text-zinc-950">{formatINR(product.price)}</span>
            {product.price !== product.originalPrice && (
              <span className="text-sm text-zinc-400 line-through font-semibold">{formatINR(product.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>

      {/* Full-width Add to Cart button */}
      <div className="mt-3.5 flex w-full">
        <button
          onClick={handleAddToCart}
          className="w-full py-2.5 bg-[#e5484d] hover:bg-[#d8373d] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
          aria-label="Add directly to cart"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
          Add to Cart
        </button>
      </div>

    </div>
  );
}
