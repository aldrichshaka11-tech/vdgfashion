'use client';
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { X, Truck, Clock, MapPin, Package } from 'lucide-react';

export default function ShippingPolicyPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const sections = [
    {
      title: '1. Processing Times',
      icon: Clock,
      content: 'All streetwear drops and products are processed within 1 to 2 business days. Orders are not processed or shipped on Sundays or national holidays. You will receive an SMS and email notification with tracking codes once your pack leaves our dispatch hub.'
    },
    {
      title: '2. Shipping Rates & Delivery Estimates',
      icon: Truck,
      content: 'We offer free delivery for orders above ₹3,000 across India. For orders below this threshold, a shipping fee of ₹99 is applied. Estimated delivery transit duration is 3 to 5 business days for major metropolitan zones, and 5 to 7 days for regional districts.'
    },
    {
      title: '3. Shipment Coverage',
      icon: MapPin,
      content: 'We currently deliver to all reachable pin codes across India using premium cargo partners (Delhivery, Bluedart, and Speed Post). We do not support international delivery routes at this moment.'
    },
    {
      title: '4. Delivery Verification & Issues',
      icon: Package,
      content: 'If your parcel is marked as delivered but you have not received it, please contact our support chat within 48 hours. We strongly advise taking an unboxing video to assist with missing item claims.'
    }
  ];

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
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1600px] mx-auto space-y-8 flex-grow">
            
            {/* Title Section */}
            <div className="space-y-1.5" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Shipping Policy</h1>
              <p className="text-sm sm:text-base text-zinc-500 font-normal">Last Updated: June 23, 2026. Understand our dispatch processes, rates, and delivery speeds.</p>
            </div>

            {/* Content Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div key={idx} className="bg-white border border-zinc-150 rounded-[2rem] p-6 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col gap-4">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-cyan-50 text-cyan-600 border border-cyan-100 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-base sm:text-lg font-black text-zinc-950 leading-tight">{sec.title}</h4>
                      <p className="text-xs sm:text-sm text-zinc-600 font-normal leading-relaxed">{sec.content}</p>
                    </div>
                  </div>
                );
              })}
            </section>

          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
