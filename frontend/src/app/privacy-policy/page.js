'use client';
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { X, Shield, Lock, Eye, CheckCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const sections = [
    {
      title: '1. Information We Collect',
      icon: Eye,
      content: 'We collect personal information that you provide to us when placing an order, registering an account, or communicating with us. This includes your name, delivery address, billing address, phone number, email address, and payment preferences. We also collect automated browsing statistics such as IP address, browser type, and device information to optimize your shopping experience.'
    },
    {
      title: '2. How We Use Your Data',
      icon: Lock,
      content: 'Your data is utilized to process orders, handle payment transactions, deliver products, and send order status notifications. We also use your email for promo updates or feedback requests if opted in. We do not sell or trade your personal information with third-party marketing companies.'
    },
    {
      title: '3. Data Protection & Security',
      icon: Shield,
      content: 'We employ advanced security protocols (such as SSL encryption and tokenized payment pathways) to protect your transaction and personal data. Access to your personal data is restricted to authorized operations personnel only.'
    },
    {
      title: '4. Cookies & Web Tracking',
      icon: CheckCircle,
      content: 'Our website uses cookies to remember items in your shopping cart, analyze web traffic, and keep you logged in. You can configure your browser to reject cookies, but this may limit access to checkout features.'
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
              <h1 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">Privacy Policy</h1>
              <p className="text-sm sm:text-base text-zinc-500 font-normal">Last Updated: June 23, 2026. Learn how vdgfashion handles and secures your user information.</p>
            </div>

            {/* Content Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" data-aos="fade-up">
              {sections.map((sec, idx) => {
                const Icon = sec.icon;
                return (
                  <div key={idx} className="bg-white border border-zinc-150 rounded-[2rem] p-6 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col gap-4">
                    <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-indigo-50 text-indigo-600 border border-indigo-100 shrink-0">
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

            {/* Editorial block */}
            <section className="bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 space-y-4 shadow-2xs" data-aos="fade-up">
              <h3 className="text-lg sm:text-xl font-black text-zinc-950 tracking-tight">Your Rights & Control</h3>
              <p className="text-xs sm:text-sm text-zinc-650 font-normal leading-relaxed">
                You have the right to request access to the personal data we hold about you, request corrections to out-of-date records, or ask us to delete your personal profile at any time. If you wish to make any changes or request deletion, please contact our support desk at <a href="mailto:support@vdgfashion.com" className="text-indigo-600 font-semibold hover:underline">support@vdgfashion.com</a>.
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
