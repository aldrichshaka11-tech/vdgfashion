'use client';
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { X, RotateCcw, ShieldCheck, CreditCard, Ban } from 'lucide-react';

export default function ReturnRefundPolicyPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const sections = [
    {
      title: '1. 14-Day Return Window',
      icon: RotateCcw,
      content: 'We offer an easy 14-day replacement and return window from the day your package arrives. If you experience fit issues, size mismatches, or style doubts, you can request an exchange or credit refund via our support desk.'
    },
    {
      title: '2. Return Eligibility Criteria',
      icon: ShieldCheck,
      content: 'To be eligible for a return, the streetwear item must be unused, unwashed, and in the exact condition that you received it. It must be inside the original branded packaging with all barcode stickers and product tags intact.'
    },
    {
      title: '3. Refund Processing Pathway',
      icon: CreditCard,
      content: 'Once your return parcel arrives back at our Sivagami Puram hub and passes quality inspection, your refund will be processed. Refunds are credited back to your original payment method (Bank account or UPI) within 5 to 7 business days.'
    },
    {
      title: '4. Non-Returnable Apparel',
      icon: Ban,
      content: 'For hygiene reasons, innerwear, socks, and products bought under clearing warehouse sales are strictly non-returnable. Return requests submitted after the 14-day limit will be rejected automatically.'
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
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Return & Refund Policy</h1>
              <p className="text-sm sm:text-base text-zinc-500 font-normal">Last Updated: June 23, 2026. Review our simple return window, eligibility checklist, and refund speeds.</p>
            </div>

            {/* Content Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div key={idx} className="bg-white border border-zinc-150 rounded-[2rem] p-6 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col gap-4">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-amber-50 text-amber-600 border border-amber-100 shrink-0">
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
