'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Star, Heart, Plus, Minus, ShoppingBag, Truck, RefreshCw, CheckCircle2, ChevronDown, X, Info, CreditCard, Share2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Image from 'next/image';
import { formatINR } from '../utils/currency';
import { API_BASE } from '../../lib/api';
import ProductShareModal from './ProductShareModal';

export default function ProductDetailView() {
  const router = useRouter();
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isWishlisted
  } = useStore();

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState(selectedProduct?.colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(
    selectedProduct?.sizes?.includes('M') ? 'M' : (selectedProduct?.sizes?.[0] || '')
  );
  const [quantity, setQuantity] = useState(1);
  const [openAccordionIdx, setOpenAccordionIdx] = useState(0);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Sync state whenever selected product changes
  useEffect(() => {
    if (selectedProduct) {
      setActiveImageIdx(0);
      setSelectedColor(selectedProduct.colors?.[0]);
      setSelectedSize(selectedProduct.sizes?.includes('M') ? 'M' : (selectedProduct.sizes?.[0] || ''));
      setQuantity(1);
    }
  }, [selectedProduct]);

  if (!selectedProduct) return null;

  // Safe computed fallback variables to prevent rendering crashes
  const colors = selectedProduct.colors && selectedProduct.colors.length > 0
    ? selectedProduct.colors
    : [{ name: "Sage Green", hex: "#0ca678" }];

  const sizes = selectedProduct.sizes && selectedProduct.sizes.length > 0
    ? selectedProduct.sizes
    : ["0-1M"];

  const thumbnails = (selectedProduct.thumbnails && selectedProduct.thumbnails.length > 0
    ? selectedProduct.thumbnails
    : [selectedProduct.image]
  ).filter(Boolean);

  const details = selectedProduct.details || [];

  const currentColor = colors.some(c => c.hex === selectedColor?.hex)
    ? selectedColor 
    : colors[0];

  const currentSize = sizes.includes(selectedSize)
    ? selectedSize 
    : (sizes.includes('M') ? 'M' : (sizes[0] || ''));

  const currentImageIdx = activeImageIdx < thumbnails.length
    ? activeImageIdx 
    : 0;

  const isLiked = isWishlisted(selectedProduct.id);

  const handleAddToCart = () => {
    if (currentColor) {
      addToCart(selectedProduct, currentColor.hex, currentSize, quantity);
    }
  };

  const handleBackToCatalog = () => {
    setSelectedProduct(null);
  };

  const toggleAccordion = (idx) => {
    setOpenAccordionIdx(openAccordionIdx === idx ? -1 : idx);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 vdgfashion-card-shadow animate-fade-in text-black">
      
      {/* Navigation - Clean E-commerce weights */}
      <div className="flex flex-wrap items-center justify-end gap-4 pb-6 border-b border-zinc-150 mb-8">
        <button
          onClick={handleBackToCatalog}
          className="text-xs font-semibold text-zinc-450 hover:text-black transition-colors flex items-center gap-1"
        >
          &larr; BACK TO CATALOG
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Gallery Column */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
          
          {/* Thumbnails */}
          <div className="sm:col-span-2 order-2 sm:order-1 flex sm:flex-col gap-3 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0">
            {thumbnails.map((thumb, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative aspect-square w-16 sm:w-full rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                  currentImageIdx === idx ? 'border-[#e5484d] scale-102 shadow-sm' : 'border-zinc-200 hover:border-zinc-400'
                }`}
                style={{ backgroundColor: selectedProduct.colorHex || '#f4f4f5' }}
              >
                <Image
                  src={thumb}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main Display Image Frame */}
          <div
            className="sm:col-span-10 order-1 sm:order-2 relative aspect-square rounded-[1.8rem] border border-zinc-150 overflow-hidden"
            style={{ backgroundColor: selectedProduct.colorHex || '#f4f4f5' }}
          >
            {/* Heart toggle overlay */}
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className="absolute top-3 right-3 sm:top-5 sm:right-5 z-10 h-10 w-10 sm:h-11 sm:w-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-zinc-100 hover:scale-110 active:scale-95 transition-all text-zinc-400 hover:text-red-500"
              aria-label="Toggle Wishlist"
            >
              <Heart className={`h-5 w-5 sm:h-5.5 sm:w-5.5 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
            </button>

            {/* Share toggle overlay */}
            <button
              onClick={() => setShowShareModal(true)}
              className="absolute top-3 right-14 sm:top-5 sm:right-20 z-10 h-10 w-10 sm:h-11 sm:w-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg border border-zinc-100 hover:scale-110 active:scale-95 transition-all text-zinc-400 hover:text-indigo-500"
              aria-label="Share Product"
            >
              <Share2 className="h-5 w-5" />
            </button>

            {/* Display active image */}
            <div className="relative w-full h-full hover-scale overflow-hidden">
              {(thumbnails[currentImageIdx] || selectedProduct.image) ? (
                <Image
                  src={thumbnails[currentImageIdx] || selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : null}
            </div>
          </div>

        </div>

        {/* Contents Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-black">
          
          <div className="space-y-3">
            {/* Tag Badge */}
            {selectedProduct.discount && (
              <span className="inline-block text-xs font-bold tracking-widest bg-rose-50 text-[#e5484d] border border-rose-100 rounded px-2.5 py-1 uppercase">
                {selectedProduct.discount === 'NEW' || selectedProduct.discount === 'BEST SELLER' ? selectedProduct.discount : `${selectedProduct.discount} OFF`}
              </span>
            )}
            
            {/* Product Title - Clean Elegant Bold */}
            <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 leading-tight tracking-tight">
              {selectedProduct.name}
            </h1>

            {/* SKU & Category / Subcategory Labels */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-500 pt-1">
              {selectedProduct.sku && (
                <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md font-mono">
                  Product Code: {selectedProduct.sku}
                </span>
              )}
              {selectedProduct.parent_category ? (
                <>
                  <span className="bg-zinc-50 text-zinc-650 px-2.5 py-1 rounded-md border border-zinc-150">
                    {selectedProduct.parent_category}
                  </span>
                  <ChevronRight className="h-3 w-3 text-zinc-350" />
                  <span className="bg-rose-50/50 text-[#e5484d] border border-rose-100/50 px-2.5 py-1 rounded-md font-bold">
                    {selectedProduct.category_name}
                  </span>
                </>
              ) : (
                selectedProduct.category_name && (
                  <span className="bg-zinc-50 text-zinc-650 px-2.5 py-1 rounded-md border border-zinc-150">
                    {selectedProduct.category_name}
                  </span>
                )
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4.5 w-4.5 ${
                      i < Math.floor(selectedProduct.rating) ? 'fill-amber-400' : 'text-zinc-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-zinc-550">
                {selectedProduct.rating} ({selectedProduct.reviewsCount} Reviews)
              </span>
            </div>

            {/* Big price display - Bold */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black text-zinc-950">{formatINR(selectedProduct.price)}</span>
              {selectedProduct.price !== selectedProduct.originalPrice && (
                <span className="text-base text-zinc-400 line-through font-bold">{formatINR(selectedProduct.originalPrice)}</span>
              )}
            </div>
          </div>

          {/* Description - Standard E-commerce Regular/Medium contrast */}
          <p className="text-[15px] sm:text-base text-zinc-650 leading-relaxed font-normal">
            {selectedProduct.description}
          </p>

          <hr className="border-zinc-150" />



          {/* Size Selector */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm font-semibold text-zinc-500">
              <span>SIZE: <strong className="text-zinc-950 font-bold">{currentSize}</strong></span>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-[11px] text-zinc-400 hover:text-[#e5484d] flex items-center gap-1.5 transition-colors border-b border-dashed border-zinc-300 pb-0.5"
              >
                <Info className="h-3.5 w-3.5" />
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {sizes.map((size) => {
                const isSelected = currentSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`h-12 min-w-12 px-3 text-sm font-semibold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-zinc-950 text-white border-zinc-950 scale-105 shadow-sm font-bold'
                        : 'border-zinc-200 text-zinc-700 hover:border-black hover:text-black'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity Controls & vdgfashion Add to Cart button */}
          <div className="flex items-stretch gap-4 pt-2">
            
            {/* Quantity box */}
            <div className="flex items-center border-2 border-zinc-200 rounded-xl bg-zinc-50/50">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-zinc-505 hover:text-black transition-colors"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3.5 py-2 text-zinc-505 hover:text-black transition-colors"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Red Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#e5484d] hover:bg-[#d8373d] text-white font-extrabold rounded-xl transition-all shadow-md active:scale-98 text-xs tracking-wider"
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              ADD TO CART
            </button>

          </div>

          <hr className="border-zinc-150" />

          {/* Delivery & return features */}
          <div className="space-y-3.5 py-1">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-150 flex-shrink-0">
                <Truck className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <h5 className="text-sm font-black text-zinc-950 leading-tight">Free Shipping</h5>
                <p className="text-[11px] text-zinc-500 font-normal leading-tight">On orders above {formatINR(3000)} across all catalog purchases</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-150 flex-shrink-0">
                <RefreshCw className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <h5 className="text-sm font-black text-zinc-950 leading-tight">Easy Returns</h5>
                <p className="text-[11px] text-zinc-500 font-normal leading-tight">Hassle-free replacement within 14 days of delivery</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="h-9 w-9 bg-zinc-50 rounded-full flex items-center justify-center border border-zinc-150 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-zinc-600" />
              </div>
              <div>
                <h5 className="text-sm font-black text-zinc-950 leading-tight">100% Secure Gateway</h5>
                <p className="text-[11px] text-zinc-500 font-normal leading-tight">Guaranteed original items directly under secure SSL encryptions</p>
              </div>
            </div>
          </div>

          <hr className="border-zinc-150" />

          {/* Collapsible Accordion */}
          <div className="border border-zinc-200 rounded-2xl overflow-hidden divide-y divide-zinc-200">
            {details.map((detail, idx) => {
              const isOpen = openAccordionIdx === idx;
              return (
                <div key={idx} className="bg-white">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full flex items-center justify-between p-4.5 text-left text-xs sm:text-sm font-black text-zinc-950 hover:bg-zinc-50 transition-colors"
                  >
                    <span>{detail.title.toUpperCase()}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4.5 pt-1.5 bg-zinc-50/50 text-xs text-zinc-550 leading-relaxed border-t border-zinc-100 animate-fade-in font-normal">
                      {detail.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>

      <hr className="border-zinc-150 my-10" />

      {/* Reviews & Comments Feed */}
      <ProductReviewsSection productId={selectedProduct.id} />

      {/* Mock Size Guide modal overlay */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setShowSizeGuide(false)} />
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 shadow-premium animate-fade-in border border-zinc-200">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5">
                <Info className="h-4.5 w-4.5 text-[#e5484d]" />
                SIZING GUIDE CHART
              </h3>
              <button onClick={() => setShowSizeGuide(false)} className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-black">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-[13px] text-center border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 font-semibold">
                    <th className="py-2.5 px-2">Size</th>
                    <th className="py-2.5 px-2">Chest (in)</th>
                    <th className="py-2.5 px-2">Length (in)</th>
                    <th className="py-2.5 px-2">Shoulder (in)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 font-medium text-zinc-650">
                  <tr>
                    <td className="py-2.5 font-bold text-zinc-950">S</td>
                    <td className="py-2.5">38</td>
                    <td className="py-2.5">27</td>
                    <td className="py-2.5">17.5</td>
                  </tr>
                  <tr className="bg-zinc-50/50">
                    <td className="py-2.5 font-bold text-zinc-950">M</td>
                    <td className="py-2.5">40</td>
                    <td className="py-2.5">28</td>
                    <td className="py-2.5">18.5</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-zinc-950">L</td>
                    <td className="py-2.5">42</td>
                    <td className="py-2.5">29</td>
                    <td className="py-2.5">19.5</td>
                  </tr>
                  <tr className="bg-zinc-50/50">
                    <td className="py-2.5 font-bold text-zinc-950">XL</td>
                    <td className="py-2.5">44</td>
                    <td className="py-2.5">30</td>
                    <td className="py-2.5">20.5</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-zinc-950">XXL</td>
                    <td className="py-2.5">46</td>
                    <td className="py-2.5">31</td>
                    <td className="py-2.5">21.5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-zinc-400 mt-4 leading-relaxed font-normal">
              * Measurements represent garments specifications. Standard tolerance is +/- 0.5 inches.
            </p>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ProductShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        product={selectedProduct}
      />

    </div>
  );
}


function ProductReviewsSection({ productId }) {
  const { user, loginUser, logoutUser } = useStore();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [editingReviewId, setEditingReviewId] = useState(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleInlineLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const result = await loginUser(loginUsername, loginPassword);
    setLoginLoading(false);
    if (!result.success) {
      setLoginError(result.message);
    }
  };

  const fetchReviews = () => {
    fetch(`${API_BASE}/api/reviews/?product=${productId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const filtered = data.filter(r => r.product === productId);
        setReviews(filtered);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const handleStartEdit = (review) => {
    setEditingReviewId(review.id);
    setComment(review.comment);
    setRating(review.rating);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setComment('');
    setRating(5);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Are you sure you want to delete your review?')) return;
    try {
      const headers = {};
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/`, {
        method: 'DELETE',
        headers: headers
      });
      if (res.ok) {
        setSuccessMsg('Your review has been deleted successfully.');
        setErrorMsg('');
        if (editingReviewId === reviewId) {
          handleCancelEdit();
        }
        fetchReviews();
      } else {
        if (res.status === 401) {
          logoutUser();
          setErrorMsg('Your session has expired. Please log in again.');
        } else {
          setErrorMsg('Failed to delete review. Try again.');
        }
      }
    } catch (err) {
      setErrorMsg('Network error deleting review.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!user) {
      setErrorMsg('You must be logged in to submit a review!');
      return;
    }

    if (!comment.trim()) {
      setErrorMsg('Please write a comment!');
      return;
    }

    setSubmitting(true);
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      
      const isEditing = editingReviewId !== null;
      const url = isEditing 
        ? `${API_BASE}/api/reviews/${editingReviewId}/` 
        : `${API_BASE}/api/reviews/`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: headers,
        body: JSON.stringify({
          product: productId,
          user_name: user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username,
          user_email: user.email,
          rating: rating,
          comment: comment.trim()
        })
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(isEditing ? 'Your review has been updated!' : 'Thank you! Your review has been published.');
        setComment('');
        setRating(5);
        setEditingReviewId(null);
        fetchReviews();
      } else {
        if (res.status === 401) {
          logoutUser();
          setErrorMsg('Your session has expired. Please log in again to write a review.');
          return;
        }
        const isDuplicate = JSON.stringify(data).toLowerCase().includes('unique') || 
                            JSON.stringify(data).toLowerCase().includes('already reviewed');
        if (isDuplicate) {
          setErrorMsg('You have already submitted a comment for this product! One comment is allowed per customer.');
        } else {
          let errorMsg = 'Failed to submit review. Try again.';
          if (data && typeof data === 'object') {
            const errors = Object.entries(data)
              .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
              .join(' | ');
            if (errors) errorMsg = errors;
          } else if (typeof data === 'string') {
            errorMsg = data;
          }
          setErrorMsg(errorMsg);
        }
      }
    } catch (err) {
      setErrorMsg('Network error submitting review.');
    } finally {
      setSubmitting(false);
    }
  };

  const userReview = reviews.find(r => user && r.user_email === user.email);

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-150">
        <h3 className="text-xl sm:text-2xl font-black text-[#0f172a] tracking-tight flex items-center gap-2">
          <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
          Customer Reviews ({reviews.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Reviews List (8 cols) */}
        <div className="lg:col-span-8 space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          {reviews.length === 0 ? (
            <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-3xl p-10 text-center text-zinc-500 font-semibold">
              No reviews recorded for this product yet. Be the first to share your thoughts!
            </div>
          ) : (
            reviews.map((r, idx) => {
              const isOwner = user && r.user_email === user.email;
              return (
                <div key={r.id || idx} className="bg-white border border-zinc-200 rounded-[2rem] p-6 shadow-2xs space-y-3 relative hover:border-zinc-350 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">
                        {r.user_name} {isOwner && <span className="text-[10px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded ml-1 font-bold">You</span>}
                      </h4>
                      <p className="text-[10px] text-zinc-400 font-normal">{new Date(r.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-amber-400' : 'text-zinc-200'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-zinc-650 text-xs sm:text-sm leading-relaxed font-normal">{r.comment}</p>
                  
                  {isOwner && (
                    <div className="flex items-center gap-3.5 pt-1 text-[11px] font-bold">
                      <button
                        onClick={() => handleStartEdit(r)}
                        className="text-indigo-600 hover:text-indigo-850 transition-colors cursor-pointer"
                      >
                        Edit Review
                      </button>
                      <span className="text-zinc-200 font-normal">|</span>
                      <button
                        onClick={() => handleDeleteReview(r.id)}
                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Delete Review
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Submission Form (4 cols) */}
        <div className="lg:col-span-4 bg-zinc-50 border border-zinc-200/80 rounded-[2.2rem] p-6 shadow-3xs space-y-4">
          <h4 className="text-sm font-black text-zinc-950 uppercase tracking-wider">
            {editingReviewId ? 'Edit your Review' : 'Write a Review'}
          </h4>
          
          {user ? (
            userReview && !editingReviewId ? (
              <div className="space-y-3 text-center py-6 bg-zinc-100/50 rounded-2xl p-4.5 border border-zinc-200/40">
                <p className="text-xs text-zinc-650 font-bold leading-relaxed">
                  You have already submitted a comment for this product. 
                </p>
                <p className="text-[11.5px] text-zinc-400 font-normal leading-normal">
                  One comment is allowed per customer. You can edit or delete your existing review from the list.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs font-semibold text-zinc-700">
                {errorMsg && (
                  <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 font-bold text-[11px]">
                    ⚠️ {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl p-3 font-bold text-[11px]">
                    ✅ {successMsg}
                  </div>
                )}

                {/* Star Rating Picker */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Your Rating</label>
                  <div className="flex items-center gap-1 text-zinc-200">
                    {[...Array(5)].map((_, idx) => {
                      const starVal = idx + 1;
                      const isActive = starVal <= (hoverRating || rating);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setRating(starVal)}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-0.5 text-zinc-200 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                        >
                          <Star className={`h-6.5 w-6.5 ${isActive ? 'fill-amber-400 text-amber-400' : 'text-zinc-300'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Textarea */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Your Comment</label>
                  <textarea
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your thoughts on style, sizing, and muslin fabric fit..."
                    className="w-full h-24 p-3 border border-zinc-200 bg-white rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all font-normal text-xs"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-grow py-3 bg-[#e5484d] hover:bg-[#d8373d] disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md tracking-wider uppercase text-[10px] cursor-pointer"
                  >
                    {submitting ? 'Publishing...' : editingReviewId ? 'Update Review' : 'Submit Review'}
                  </button>
                  {editingReviewId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="py-3 px-4 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-extrabold rounded-xl transition-all tracking-wider uppercase text-[10px] cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )
          ) : (
            !showLoginForm ? (
              <div className="space-y-3.5 text-center py-6">
                <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                  You must sign in to your buyer profile account to write a product review.
                </p>
                <button 
                  type="button"
                  onClick={() => setShowLoginForm(true)}
                  className="w-full mt-2.5 py-3 bg-zinc-950 hover:bg-zinc-800 text-white text-[10px] font-extrabold rounded-xl tracking-wider uppercase shadow-md transition-colors cursor-pointer"
                >
                  Log In / Sign Up
                </button>
              </div>
            ) : (
              <form onSubmit={handleInlineLogin} className="space-y-4 text-xs font-semibold text-zinc-700">
                <p className="text-[11px] text-zinc-500 font-bold leading-relaxed text-center">
                  Sign in to post your review:
                </p>
                
                {loginError && (
                  <div className="bg-red-50 text-red-600 border border-red-200 rounded-xl p-3 font-bold text-[11px] leading-normal">
                    ⚠️ {loginError}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Username / Email*</label>
                  <input 
                    type="text" 
                    required 
                    value={loginUsername} 
                    onChange={(e) => setLoginUsername(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Password*</label>
                  <input 
                    type="password" 
                    required 
                    value={loginPassword} 
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500/80 transition-all text-black shadow-3xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="w-full py-3.5 bg-gradient-to-r from-pink-500 to-indigo-500 hover:opacity-95 disabled:opacity-50 text-white font-extrabold rounded-xl transition-all shadow-md active:scale-98 text-xs tracking-wider uppercase cursor-pointer"
                >
                  {loginLoading ? 'Signing in...' : 'Sign In & Comment'}
                </button>

                <div className="pt-2 flex justify-between items-center text-[10px] font-bold">
                  <button 
                    type="button"
                    onClick={() => router.push('/account')}
                    className="text-indigo-600 hover:underline cursor-pointer"
                  >
                    Create an Account
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowLoginForm(false)}
                    className="text-zinc-400 hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )
          )}
        </div>

      </div>
    </div>
  );
}
