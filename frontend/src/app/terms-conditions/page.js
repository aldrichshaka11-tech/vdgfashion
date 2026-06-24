'use client';
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { X, Scale, FileText, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function TermsConditionsPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const sections = [
    {
      title: '1. Conditions of Store Use',
      icon: ShoppingBag,
      content: 'By visiting our store and purchasing products, you agree to comply with our Terms. You warrant that you are of legal age or have parental consent to browse and use our purchasing pathways. Users are prohibited from hacking, scraper harvesting, or using our store assets for illegal redistribution.'
    },
    {
      title: '2. Product Pricing & Accuracy',
      icon: Scale,
      content: 'We strive to provide accurate display descriptions and pricing for all products. However, typographical errors or database price sync delays may occur. vdgfashion reserves the right to cancel or adjust orders placed at incorrect price levels, even after order confirmation.'
    },
    {
      title: '3. Intellectual Property Rights',
      icon: FileText,
      content: 'All brand names, custom designs, clothing photos, graphics, text layout descriptions, and logos on this store are the exclusive intellectual property of vdgfashion. Copying, duplicating, or downloading these assets for commercial utilization is strictly prohibited.'
    },
    {
      title: '4. Limitation of Liability',
      icon: ShieldAlert,
      content: 'vdgfashion will not be liable for any indirect, incidental, or consequential damages resulting from store use, delivery delays, or out-of-stock items. Our maximum liability to you for any product purchased will be limited to the purchase price paid for that item.'
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
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Terms & Conditions</h1>
              <p className="text-sm sm:text-base text-zinc-500 font-normal">Last Updated: June 23, 2026. Please read our user agreement rules carefully before using our store services.</p>
            </div>

            {/* Content Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div key={idx} className="bg-white border border-zinc-150 rounded-[2rem] p-6 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col gap-4">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-rose-50 text-[#e11d48] border border-rose-100 shrink-0">
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

            {/* General Conditions block */}
            <section className="bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-2xs" data-aos="fade-up">
              <h3 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">Contractual Agreement</h3>
              <p className="text-xs sm:text-sm text-zinc-650 font-normal leading-relaxed">
                By purchasing goods from this store, you enter into a legally binding contract. Any dispute arising from your transactions or use of this website will be subject to local court jurisdictions in Tamil Nadu, India. vdgfashion reserves the right to modify these terms and conditions at any time without prior customer notifications.
              </p>
            </section>

          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
