'use client';

import React, { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Image from 'next/image';
import { formatINR } from '../utils/currency';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const router = useRouter();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    clearCart,
    shippingFee,
    cartTotal,
    settings
  } = useStore();

  const freeShipThreshold = parseFloat(settings?.freeShippingThreshold || 3000);
  const remainingForFreeShipping = Math.max(0, freeShipThreshold - cartSubtotal);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setIsCheckingOut(false);
      setIsCartOpen(false);
      router.push('/checkout');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-black">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => { if (!isCheckingOut) setIsCartOpen(false); }}
      />

      <div className="absolute inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-in-right h-full border-l border-zinc-200/70">
          
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-zinc-200 flex items-center justify-between bg-white">
            <h2 className="text-[1.45rem] font-extrabold flex items-center gap-2 tracking-tight">
              <ShoppingBag className="h-5 w-5 text-[#e11d48]" />
              Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-zinc-500 hover:bg-zinc-250 hover:text-black transition-all"
              disabled={isCheckingOut}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Contents */}
          <div className="flex-1 overflow-y-auto px-6 py-4 bg-zinc-50/40">
            {checkoutComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in">
                <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                  <Sparkles className="h-8 w-8 text-[#e11d48] animate-bounce" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">Order Placed!</h3>
                <p className="text-sm text-zinc-500 mb-6 font-semibold">
                  Thank you for shopping at vdgfashion. Your parcel will be shipped shortly!
                </p>
                <div className="text-[10px] text-zinc-400 border border-dashed border-zinc-200 px-4 py-2 rounded-md font-bold">
                  Simulated Transaction Completed
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="h-14 w-14 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-7 w-7 text-zinc-400" />
                </div>
                <h3 className="text-sm font-black text-zinc-900">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed font-semibold">
                  Browse our categories and add some premium vdgfashion items to your cart!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 px-5 py-2.5 bg-black text-white text-xs font-bold rounded-full hover:bg-zinc-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Free Shipping Alert */}
                {remainingForFreeShipping > 0 ? (
                  <div className="bg-white border border-zinc-200 rounded-xl px-4 py-3 text-[11px] font-extrabold text-zinc-700 shadow-sm">
                    Add <span className="text-[#e11d48]">{formatINR(remainingForFreeShipping)}</span> more for <span className="text-zinc-950">FREE SHIPPING</span>!
                    <div className="w-full bg-zinc-200 h-2 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-linear-to-r from-[#ff008a] to-[#6a00ff] h-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (cartSubtotal / freeShipThreshold) * 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-rose-50 border border-rose-100 text-[#e11d48] rounded-xl px-4 py-3 text-[10px] font-black flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse text-[#e11d48]" />
                    Congratulations! You qualify for FREE SHIPPING!
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-zinc-100">
                  {cart.map((item, index) => (
                    <div key={index} className="py-4 flex gap-4 animate-fade-in rounded-xl px-3 bg-white border border-zinc-150 mb-2">
                      {/* Pastel background container */}
                      <div
                        className="relative h-20 w-16 rounded-lg overflow-hidden border border-zinc-150 flex-shrink-0"
                        style={{ backgroundColor: item.product.colorHex || '#f4f4f5' }}
                      >
                        {item.product.image ? (
                          <Image
                            src={item.product.image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-[14px] font-extrabold text-zinc-950 hover:text-[#e11d48] transition-colors leading-tight">
                            {item.product.name}
                          </h4>
                          <div className="flex flex-wrap gap-2 text-[11px] font-bold text-zinc-400 mt-1">
                            <span>Size: <strong className="text-zinc-700">{item.selectedSize}</strong></span>
                          </div>
                        </div>

                        {/* Quantity and Trash */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50/50">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                              className="px-2 py-0.5 text-zinc-500 hover:text-black transition-colors"
                              disabled={isCheckingOut}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-sm font-extrabold text-zinc-950">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                              className="px-2 py-0.5 text-zinc-500 hover:text-black transition-colors"
                              disabled={isCheckingOut}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                            className="text-zinc-400 hover:text-[#e11d48] p-1 rounded transition-colors"
                            disabled={isCheckingOut}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="text-right flex flex-col justify-between items-end">
                        <span className="text-lg font-extrabold text-zinc-950 leading-none">
                          {(() => {
                            const isBogo = item.product.discount && (
                              item.product.discount.toUpperCase().includes('BUY 1 GET 1') || 
                              item.product.discount.toUpperCase().includes('BOGO') || 
                              item.product.discount.toUpperCase().includes('B1G1')
                            );
                            const effectiveQty = isBogo ? Math.ceil(item.quantity / 2) : item.quantity;
                            return formatINR(item.product.price * effectiveQty);
                          })()}
                        </span>
                        <span className="text-[11px] font-bold text-zinc-400">
                          {formatINR(item.product.price)} each
                          {item.product.discount && (
                            item.product.discount.toUpperCase().includes('BUY 1 GET 1') || 
                            item.product.discount.toUpperCase().includes('BOGO') || 
                            item.product.discount.toUpperCase().includes('B1G1')
                          ) && (
                            <span className="block text-[9px] text-[#e11d48] font-extrabold mt-0.5 uppercase">BOGO Applied</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Drawer Footer Summary */}
          {cart.length > 0 && !checkoutComplete && (
            <div className="border-t border-zinc-200 px-6 py-6 bg-white space-y-4">
              <div className="space-y-1.5 text-sm text-zinc-700 font-extrabold">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-950">{formatINR(cartSubtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="text-zinc-950 font-bold">
                    {shippingFee === 0 ? <span className="text-green-600">FREE</span> : formatINR(shippingFee)}
                  </span>
                </div>
                <div className="border-t border-zinc-200 pt-3 flex justify-between text-[22px] font-black text-zinc-950 leading-none">
                  <span>Grand Total</span>
                  <span>{formatINR(cartTotal)}</span>
                </div>
              </div>

              {/* Security Indicators */}
              <div className="flex justify-center items-center gap-1.5 text-[9px] text-zinc-400 font-extrabold">
                <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
                <span>100% Secure SSL Payment Gateway</span>
              </div>

              {/* Checkout Trigger */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-[#ff006a] to-[#ff1f57] hover:opacity-95 text-white font-black rounded-2xl transition-all shadow-md active:scale-98 text-sm disabled:bg-zinc-400 tracking-wide"
              >
                {isCheckingOut ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Authorizing Secure Checkout...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    PROCEED TO CHECKOUT
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
