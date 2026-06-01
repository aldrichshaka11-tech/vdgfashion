'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { ShieldCheck, Truck, RotateCcw, Heart, ChevronRight, X, Sparkles, Star } from 'lucide-react';

export default function AboutPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const coreValues = [
    {
      title: 'Premium Sourcing',
      desc: '100% pure organic cotton fabric, ensuring ultra durability, breathability, and luxurious comfort.',
      icon: ShieldCheck,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100'
    },
    {
      title: 'Fast Dispatch Delivery',
      desc: 'Prompt nationwide logistical routes, ensuring your streetwear drops arrive at your door within 3 to 5 business days.',
      icon: Truck,
      color: 'bg-rose-50 text-[#e11d48] border-rose-100'
    },
    {
      title: 'Hassle-Free Returns',
      desc: 'We offer an easy 14-day replacement guarantee if there are sizing or quality issues with your product.',
      icon: RotateCcw,
      color: 'bg-amber-50 text-amber-600 border-amber-100'
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
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1400px] mx-auto space-y-8 flex-grow">
            
            {/* Title Section */}
            <div className="space-y-1.5" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Our Brand Story</h1>
              <p className="text-sm sm:text-base text-zinc-500 font-normal">Learn about vdgfashion boutique commitment to quality, style, and organic materials.</p>
            </div>

            {/* Editorial Story grid */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center" data-aos="fade-up">
              <div className="lg:col-span-5 relative rounded-[2rem] overflow-hidden border border-zinc-200/50 bg-[#e11d48]/5 min-h-[300px] aspect-[4/3] flex items-center justify-center">
                <Image 
                  src="/products/promo_model.png" 
                  alt="Our Story" 
                  width={600}
                  height={800}
                  className="object-contain max-h-[85%] select-none transition-transform duration-500 hover:scale-105"
                  priority
                />
              </div>

              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Redefining Indian Streetwear</h2>
                
                <p className="text-sm sm:text-base text-zinc-650 font-normal leading-relaxed">
                  Founded in Chennai, vdgfashion was born out of a desire to create high-quality, luxury-style streetwear specifically tailored for Indian youth. We believe clothing is an extension of identity and shouldn&apos;t require compromising on durability or pricing limits.
                </p>

                <p className="text-sm sm:text-base text-zinc-650 font-normal leading-relaxed">
                  Every product in our boutique—from the relaxed summer cotton t-shirts to the custom thick winter hoodies—is meticulously designed, sourced sustainably, and verified for sewing perfection. We bypass traditional heavy retail markups to bring you pristine quality directly.
                </p>

                {/* Aesthetic quote card */}
                <div className="border-l-4 border-[#e11d48] pl-4 py-1.5 bg-rose-50/20 rounded-r-2xl">
                  <p className="text-xs sm:text-sm text-zinc-700 italic font-normal leading-relaxed">
                    &quot;vdgfashion isn&apos;t just a brand; it&apos;s a visual movement to establish pure, robust, and accessible streetwear designs nationwide.&quot;
                  </p>
                </div>
              </div>
            </section>

            {/* Values Section */}
            <section className="space-y-6 pt-4" data-aos="fade-up">
              <div className="flex items-center gap-2 pb-3.5 border-b border-zinc-200">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight flex items-center gap-2">
                  <Sparkles className="h-5 w-5 fill-[#e11d48] text-[#e11d48]" />
                  What We Stand For
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {coreValues.map((val, idx) => {
                  const Icon = val.icon;
                  return (
                    <div key={idx} className="bg-white border border-zinc-150 rounded-[2rem] p-6 shadow-xs flex flex-col justify-between space-y-4">
                      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center border shrink-0 ${val.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-base sm:text-lg font-black text-zinc-950 leading-tight">{val.title}</h4>
                        <p className="text-xs sm:text-sm text-zinc-500 font-normal leading-relaxed">{val.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Promise Banner */}
            <section className="relative rounded-[2rem] bg-gradient-to-r from-[#5c51db] to-[#bb4dff] p-6 sm:p-10 text-white overflow-hidden shadow-sm" data-aos="fade-up">
              <div className="absolute top-0 right-0 w-[40%] h-full bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
              <div className="relative z-10 max-w-xl space-y-3.5">
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-200">Our Guarantee</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">100% Product Quality Assurance</h3>
                <p className="text-xs sm:text-sm text-zinc-100 font-normal leading-relaxed">
                  We guarantee original materials, precise fitting, and double-checked stitch alignments on every piece of clothing. If your order falls short of this boutique standard, reach out directly and we will provide a replacement instantly.
                </p>
              </div>
            </section>

          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
