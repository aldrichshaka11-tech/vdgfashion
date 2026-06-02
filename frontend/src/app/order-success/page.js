'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { CheckCircle2, ChevronRight, X, Calendar, ShoppingBag, ShieldCheck, Landmark } from 'lucide-react';
import { formatINR } from '../utils/currency';

export default function OrderSuccessPage() {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
    
    // Fetch last placed order from sessionStorage
    const storedOrder = sessionStorage.getItem('vdgfashion_last_order');
    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    } else {
      // Fallback details if visited directly without checkout
      setOrderDetails({
        orderId: `TRD-2026-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: 'Guest Shopper',
        itemsCount: 2,
        totalAmount: 1850,
        shippingAddress: 'Express Avenue Mall, Chennai, Tamil Nadu - 600002',
        paymentMethod: 'Credit Card',
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      });
    }
  }, []);

  if (!orderDetails) return null;

  // Calculate delivery date estimator (approx 5 days from date)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-72 h-full bg-white flex flex-col animate-slide-in-right z-10">
            <button onClick={() => setMobileSidebarOpen(false)} className="absolute top-5 right-5 p-1 rounded-full text-zinc-500 hover:bg-zinc-150">
              <X className="h-5 w-5" />
            </button>
            <Sidebar className="flex h-full w-full border-r-0" />
          </div>
        </div>
      )}

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1000px] mx-auto space-y-6 flex-grow flex flex-col justify-center">
            
            <div className="bg-white border border-zinc-150 rounded-[2.5rem] p-6 sm:p-12 shadow-xs space-y-8 text-center relative overflow-hidden" data-aos="zoom-in">
              
              {/* Giant animated success banner */}
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="h-20 w-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 animate-bounce">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Order Placed Successfully!</h1>
                  <p className="text-sm sm:text-base text-zinc-500 max-w-md mx-auto font-normal">
                    Thank you for shopping at vdgfashion boutique! We have secured your payment transaction and are packing your collections now.
                  </p>
                </div>
              </div>

              {/* Order specifications grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left bg-zinc-50/50 p-6 rounded-3xl border border-zinc-150">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Order Identifier</span>
                    <span className="text-base font-black text-zinc-950">{orderDetails.orderId}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Payment Method</span>
                    <span className="text-base font-semibold text-zinc-800">{orderDetails.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Shipment Address</span>
                    <p className="text-xs sm:text-sm text-zinc-650 font-normal mt-0.5 line-clamp-2 leading-tight">{orderDetails.shippingAddress}</p>
                  </div>
                </div>

                <div className="space-y-3 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-3 sm:pt-0 sm:pl-6">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-[#e11d48]" />
                      Estimated Delivery
                    </span>
                    <span className="text-base font-black text-emerald-700">{formattedDelivery}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Total Items Purchased</span>
                    <span className="text-base font-semibold text-zinc-850">{orderDetails.itemsCount} Items</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Amount Paid</span>
                    <span className="text-lg font-black text-zinc-950">{formatINR(orderDetails.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Secure guarantee banner */}
              <div className="flex justify-center items-center gap-6 py-2 border-y border-zinc-100 text-xs text-zinc-400 font-normal">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-4.5 w-4.5 text-[#5c51db]" />
                  Fully Encrypted
                </span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-4.5 w-4.5 text-[#e11d48]" />
                  Original Tag Products
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
                <button
                  onClick={() => router.push('/')}
                  className="rounded-xl bg-[#e11d48] hover:bg-[#be123c] text-white px-6 py-3.5 text-sm sm:text-base font-black tracking-wider uppercase transition-colors shadow-md active:scale-98 cursor-pointer flex-1 sm:flex-none"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => router.push('/account')}
                  className="rounded-xl border border-zinc-250 bg-white hover:bg-zinc-50 text-zinc-850 px-6 py-3.5 text-sm sm:text-base font-black tracking-wider uppercase transition-colors shadow-2xs active:scale-98 cursor-pointer flex-1 sm:flex-none"
                >
                  Track Order Status
                </button>
              </div>

            </div>

          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
