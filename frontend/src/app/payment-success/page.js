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

export default function PaymentSuccessPage() {
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
          <div className="px-4 sm:px-8 py-6 sm:py-12 w-full max-w-[500px] mx-auto flex-grow flex flex-col justify-center relative z-10">
            
            <div className="bg-white rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-zinc-200/50 text-center border border-zinc-100" data-aos="fade-up" data-aos-duration="800">
              
              {/* Success Icon */}
              <div className="h-24 w-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border-8 border-emerald-50/50">
                <img 
                  src="https://img.icons8.com/?size=100&id=70yRC8npwT3d&format=png&color=000000" 
                  alt="Success" 
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Headings */}
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#1a202c] tracking-tight mb-2">Payment Successful</h1>
              <p className="text-[15px] text-[#718096] font-medium mb-6">
                Your transaction was completed.
              </p>

              {/* Large Amount */}
              <div className="text-[44px] font-black text-[#1a202c] mb-8 tracking-tight">
                {formatINR(orderDetails.totalAmount)}
              </div>

              {/* Divider */}
              <hr className="border-t border-zinc-100 mb-6" />

              {/* Details List */}
              <div className="space-y-4 text-left mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-medium text-[#a0aec0]">Transaction ID</span>
                  <span className="text-[15px] font-semibold text-[#4a5568] uppercase tracking-wide">{orderDetails.orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-medium text-[#a0aec0]">Date</span>
                  <span className="text-[15px] font-semibold text-[#4a5568] uppercase tracking-wide">{orderDetails.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[15px] font-medium text-[#a0aec0]">Payment Method</span>
                  <span className="text-[15px] font-semibold text-[#4a5568] flex items-center gap-1.5 uppercase tracking-wide">
                    <span className="text-xl leading-none -mt-1">••••</span> 
                    {orderDetails.paymentMethod === 'Credit Card' || orderDetails.paymentMethod === 'card' ? 'CARD' : orderDetails.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => router.push('/')}
                className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-4 rounded-2xl text-[17px] font-bold transition-colors active:scale-[0.98] cursor-pointer shadow-md shadow-blue-500/20"
              >
                Done
              </button>
              
              <button
                onClick={() => router.push('/account')}
                className="w-full mt-4 text-[#718096] hover:text-[#4a5568] py-2 text-[15px] font-semibold transition-colors cursor-pointer bg-transparent border-none"
              >
                View Order Details
              </button>
              
            </div>
          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
