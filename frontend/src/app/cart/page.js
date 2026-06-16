'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
  Headphones,
  Truck,
  BadgePercent
} from 'lucide-react';
import { formatINR } from '../utils/currency';

const FREE_SHIPPING_THRESHOLD = 3000;
const DISCOUNT_AMOUNT = 140;

function getColorName(product, selectedColor) {
  if (!selectedColor) return 'Default';
  const color = product.colors?.find((entry) => entry.hex === selectedColor);
  return color?.name || selectedColor;
}

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    cartCount,
    cartSubtotal,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponDiscount,
    shippingFee,
    cartTotal,
    settings
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

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
  }, [cartCount, cartSubtotal, cart.length]);

  const discountValue = couponDiscount;
  const finalTotal = cartTotal;
  const freeShippingLeft = Math.max(0, 3000 - cartSubtotal);
  const progressWidth = Math.min(100, (cartSubtotal / 3000) * 100);

  const acceptCards = useMemo(() => ['VISA', 'Mastercard', 'AMEX', 'PayPal'], []);

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

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

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1600px] mx-auto space-y-6 flex-grow">
            {/* 1. Shopping Cart Hero Banner using cart.png */}
          <section className="relative w-full rounded-[2rem] overflow-hidden shadow-sm border border-zinc-200/50 bg-[#7c3aed]" data-aos="fade-up">
            <Image 
              src="/banner/cart.png" 
              alt="Shopping Cart Banner" 
              width={1080}
              height={540}
              className="w-full h-auto select-none"
              priority
            />
          </section>

          {/* 2. Main content split layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            <section className="xl:col-span-9 space-y-4" data-aos="fade-up">
              <div className="flex items-center justify-between gap-3">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">
                  Your Cart <span className="text-sm sm:text-base font-normal text-zinc-500">({cartCount} items)</span>
                </h1>
                <button
                  onClick={() => router.push('/')}
                  className="rounded-xl border border-zinc-200 bg-white px-4.5 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer active:scale-98"
                >
                  Continue Shopping
                </button>
              </div>

              {cart.length > 0 && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
                  <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold">
                    <p className="text-emerald-700 flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="h-4 w-4" />
                      {freeShippingLeft > 0
                        ? `You are ${formatINR(freeShippingLeft)} away from free shipping!`
                        : 'Yay! You get FREE shipping.'}
                    </p>
                    <span className="text-zinc-600">{formatINR(cartSubtotal)} / {formatINR(FREE_SHIPPING_THRESHOLD)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-100 mt-2 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#e11d48] to-[#7c3aed] transition-all duration-300"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden" data-aos="fade-up" data-aos-delay="80">
                <div className="hidden md:grid grid-cols-[1.3fr_0.5fr_0.6fr_0.5fr] gap-4 bg-zinc-50 px-6 py-3 text-sm font-normal text-zinc-500 uppercase tracking-wide">
                  <span>Product</span>
                  <span>Price</span>
                  <span>Quantity</span>
                  <span>Total</span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-16 px-6 text-center">
                    <p className="text-base sm:text-lg font-black text-zinc-950">Your cart is empty</p>
                    <p className="text-sm text-zinc-500 mt-2 font-normal">Add products from the homepage to see them here.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-150">
                    {cart.map((item, index) => {
                      const itemTotal = item.product.price * item.quantity;
                      return (
                        <div key={`${item.product.id}-${index}`} className="grid grid-cols-1 md:grid-cols-[1.3fr_0.5fr_0.6fr_0.5fr] gap-4 p-5 items-center">
                          <div className="flex gap-3">
                            <div
                              className="relative h-24 w-24 rounded-xl border border-zinc-150 p-2 shrink-0"
                              style={{ backgroundColor: item.product.colorHex || '#f4f4f5' }}
                            >
                              <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-2" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-base font-normal text-zinc-850">{item.product.name}</h3>
                              <p className="text-xs text-zinc-500 mt-1">
                                Size: {item.selectedSize || 'One Size'}
                              </p>
                              <span className="inline-flex mt-2 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-normal text-emerald-700 border border-emerald-100">
                                In Stock
                              </span>
                              <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-zinc-500">
                                <button className="hover:text-zinc-800 cursor-pointer">Move to Wishlist</button>
                                <button
                                  onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                                  className="text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                                >
                                  <X className="h-3.5 w-3.5" />
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>

                          <p className="text-base font-extrabold text-zinc-900">{formatINR(item.product.price)}</p>

                          <div className="inline-flex items-center rounded-lg border border-zinc-200 overflow-hidden w-fit">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                              className="px-2.5 py-1.5 hover:bg-zinc-50 text-zinc-500"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="px-3 text-base font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                              className="px-2.5 py-1.5 hover:bg-zinc-50 text-zinc-500"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <p className="text-base font-extrabold text-zinc-950">{formatINR(itemTotal)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {appliedCoupon ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3 flex items-center justify-between" data-aos="fade-up" data-aos-delay="120">
                  <p className="text-xs sm:text-sm font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 animate-bounce" />
                    Code <span className="text-[#7c3aed] font-black">{appliedCoupon}</span> applied successfully! {settings?.activePromoDiscount || 10}% OFF added.
                  </p>
                  <button 
                    onClick={() => removeCoupon()}
                    className="text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
                  >
                    Remove Coupon
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-zinc-200 bg-white px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in" data-aos="fade-up" data-aos-delay="120">
                  <p className="text-xs sm:text-sm font-normal text-zinc-650 flex items-center gap-2">
                    <BadgePercent className="h-4.5 w-4.5 text-[#7c3aed]" />
                    Use code <span className="text-[#7c3aed] font-semibold">{settings?.activePromoCode || 'TREND10'}</span> to get {settings?.activePromoDiscount || 10}% OFF on your order!
                  </p>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <input 
                      type="text"
                      placeholder="Enter Coupon"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="px-3 py-1.5 border border-zinc-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#7c3aed] w-28 uppercase text-black"
                    />
                    <button 
                      onClick={() => {
                        const codeToApply = couponInput.trim() || settings?.activePromoCode || 'TREND10';
                        const res = applyCoupon(codeToApply);
                        if (!res.success) {
                          alert(res.message);
                        }
                      }}
                      className="text-xs sm:text-sm font-semibold bg-[#7c3aed] text-white hover:bg-[#6d28d9] px-4 py-2 rounded-xl transition-all cursor-pointer shadow-2xs active:scale-98"
                    >
                      Apply Code
                    </button>
                  </div>
                </div>
              )}
            </section>

            <aside className="xl:col-span-3 space-y-4" data-aos="fade-left" data-aos-delay="100">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3">
                <h2 className="text-xl sm:text-2xl font-black text-zinc-950">Order Summary</h2>
                <div className="space-y-2 text-base sm:text-lg">
                  <div className="flex items-center justify-between text-zinc-650 font-normal">
                    <span>Subtotal ({cartCount} items)</span>
                    <span className="font-normal text-zinc-800">{formatINR(cartSubtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-650 font-normal">
                    <span>Discount ({appliedCoupon || 'TREND10'})</span>
                    <span className="font-normal text-rose-600">- {formatINR(discountValue)}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-650 font-normal">
                    <span>Shipping</span>
                    <span className="font-normal text-zinc-800">
                      {shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}
                    </span>
                  </div>
                  <div className="border-t border-zinc-200 pt-3 flex items-center justify-between">
                    <span className="text-lg font-black text-zinc-950">Total</span>
                    <span className="text-2xl font-black text-zinc-950">{formatINR(finalTotal)}</span>
                  </div>
                </div>

                {shippingFee === 0 ? (
                  <div className="rounded-lg bg-emerald-50 text-emerald-700 text-xs sm:text-sm font-semibold px-3 py-2">
                    Yay! You qualify for FREE shipping!
                  </div>
                ) : (
                  <div className="rounded-lg bg-rose-50/50 text-[#e11d48] text-[11px] font-bold px-3 py-2">
                    Add {formatINR(freeShippingLeft)} more for FREE shipping!
                  </div>
                )}

                <button 
                  onClick={() => router.push('/checkout')}
                  className="w-full rounded-xl bg-linear-to-r from-[#ff008a] to-[#6a00ff] px-4 py-3.5 text-base font-semibold text-white hover:opacity-95 cursor-pointer transition-all shadow-2xs hover:shadow-xs active:scale-99"
                >
                  Proceed to Checkout
                </button>

                <div className="pt-2">
                  <p className="text-xs font-normal text-zinc-400 mb-2">We accept</p>
                  <div className="flex flex-wrap gap-2">
                    {acceptCards.map((card) => (
                      <span
                        key={card}
                        className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-[10px] font-normal text-zinc-650"
                      >
                        {card}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3" data-aos="fade-left" data-aos-delay="160">
                <div className="flex items-start gap-2">
                  <Truck className="h-4 w-4 text-[#7c3aed] mt-0.5" />
                  <p className="text-xs text-zinc-600"><span className="font-black text-zinc-900">Free Shipping</span><br />On orders over {formatINR(FREE_SHIPPING_THRESHOLD)}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Headphones className="h-4 w-4 text-[#7c3aed] mt-0.5" />
                  <p className="text-xs text-zinc-600"><span className="font-black text-zinc-900">Easy Returns</span><br />14 days return policy</p>
                </div>
                <div className="flex items-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#7c3aed] mt-0.5" />
                  <p className="text-xs text-zinc-600"><span className="font-black text-zinc-900">Secure Payment</span><br />100% secure checkout</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  </div>
  );
}
