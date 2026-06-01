'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ChevronRight, X } from 'lucide-react';

export default function ContactPage() {
  const { setSelectedProduct, setSelectedCategory } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-out-cubic',
      delay: 40,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1200);
  };

  const contactDetails = [
    {
      title: 'Call Us Directly',
      info: '+91 98765 43210',
      description: 'Mon - Sat, 9:00 AM to 7:00 PM IST',
      icon: Phone,
      color: 'bg-[#e11d48] text-white border-transparent',
      action: 'tel:+919876543210'
    },
    {
      title: 'Email Our Support Team',
      info: 'support@vdgfashion.com',
      description: 'We reply within 24 business hours',
      icon: Mail,
      color: 'bg-indigo-600 text-white border-transparent',
      action: 'mailto:support@vdgfashion.com'
    },
    {
      title: 'Visit Our HQ Store',
      info: 'Express Avenue Mall, Chennai',
      description: '1st Floor, No. 2, Club House Rd, India',
      icon: MapPin,
      color: 'bg-amber-600 text-white border-transparent',
      action: 'https://maps.google.com'
    },
    {
      title: 'Corporate Working Hours',
      info: 'Monday - Friday',
      description: '9:00 AM - 6:00 PM EST',
      icon: Clock,
      color: 'bg-emerald-600 text-white border-transparent',
      action: null
    }
  ];

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      {/* Left Sidebar Navigation (Desktop) */}
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

      {/* Mobile Sidebar overlay backdrop drawer */}
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

      {/* Main Content Pane */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />
        
        {/* Full-viewport scrolling container with decoupled scroll constraints */}
        <main className="flex-1 overflow-y-auto flex flex-col justify-between">
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1400px] mx-auto space-y-8 flex-grow">
            

            {/* 1. Interactive Top Banner using contact.png */}
            <section className="relative w-full rounded-[2rem] overflow-hidden shadow-sm border border-zinc-200/50 bg-[#be123c]" data-aos="fade-up">
              <Image 
                src="/banner/contact.png" 
                alt="Contact Us Banner" 
                width={1774}
                height={887}
                className="w-full h-auto select-none"
                priority
              />
            </section>

            {/* 2. Form & Contact Info stretch row layout - Same height cards */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2 items-stretch">
              
              {/* Left Column: Contact Cards in a matching card container (5 cols span) */}
              <div className="lg:col-span-5 bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full" data-aos="fade-up">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">Get in Touch</h2>
                    <p className="text-sm sm:text-base text-zinc-500 font-normal leading-relaxed">
                      Feel free to reach out to our team at any time. We usually respond within a single working day to assist you with order status, sizing issues, or refunds.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5">
                    {contactDetails.map((detail, idx) => {
                      const IconComponent = detail.icon;
                      const CardWrapper = detail.action ? 'a' : 'div';
                      return (
                        <CardWrapper
                          key={idx}
                          href={detail.action || undefined}
                          target={detail.action && detail.action.startsWith('http') ? '_blank' : undefined}
                          className={`block p-4.5 bg-zinc-50/40 rounded-2xl hover:scale-[1.01] hover:shadow-2xs transition-all ${
                            detail.action ? 'cursor-pointer hover:bg-zinc-50/50' : ''
                          }`}
                        >
                          <div className="flex gap-4 items-center">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shrink-0 ${detail.color}`}>
                              <IconComponent className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-base sm:text-lg font-normal text-zinc-850 leading-tight">{detail.info}</p>
                              <p className="text-xs sm:text-sm text-zinc-500 mt-1 leading-tight font-normal">{detail.description}</p>
                            </div>
                          </div>
                        </CardWrapper>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Interactive Form Card (7 cols span) */}
              <div className="lg:col-span-7 bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 shadow-xs flex flex-col justify-between h-full relative overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                
                {submitSuccess ? (
                  /* Premium Success Modal view after form submits successfully */
                  <div className="flex flex-col items-center justify-center py-12 my-auto text-center space-y-4 animate-fade-in">
                    <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-100 animate-bounce">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    
                    <div className="space-y-2 max-w-sm">
                      <h3 className="text-2xl sm:text-3xl font-black text-zinc-950">Message Sent Successfully!</h3>
                      <p className="text-sm sm:text-base text-zinc-500 leading-relaxed font-normal">
                        Thank you for contacting vdgfashion support. We have received your query and one of our brand experts will reach out to you shortly.
                      </p>
                    </div>

                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-6 inline-flex items-center justify-center rounded-full bg-[#5c51db] hover:bg-[#4b41ca] px-6 py-2.5 text-sm sm:text-base font-semibold text-white transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  /* Standard form state */
                  <form onSubmit={handleSubmit} className="space-y-5 flex flex-col justify-between h-full">
                    <div className="space-y-1.5">
                      <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">Send Us a Direct Message</h3>
                      <p className="text-sm sm:text-base text-zinc-400 font-normal">Fill in the fields below and we will get back to you immediately.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-sm sm:text-base font-normal text-zinc-600">Full Name *</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 focus:border-zinc-300 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 focus:bg-white transition-all text-zinc-700"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-sm sm:text-base font-normal text-zinc-600">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="johndoe@email.com"
                          className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 focus:border-zinc-300 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 focus:bg-white transition-all text-zinc-700"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-sm sm:text-base font-normal text-zinc-600">Subject (Optional)</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Order tracking, sizing guidelines..."
                        className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 focus:border-zinc-300 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 focus:bg-white transition-all text-zinc-700"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-sm sm:text-base font-normal text-zinc-600">Your Message *</label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows="4"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Write details of your questions or help queries here..."
                        className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 focus:border-zinc-300 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#e11d48]/10 focus:bg-white transition-all text-zinc-700 resize-none flex-grow min-h-[90px]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5c51db] hover:bg-[#4b41ca] px-5 py-3.5 text-sm sm:text-base font-semibold text-white transition-colors cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs active:scale-99"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending enquiry...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Enquiry
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>

            </section>

            {/* 3. Full Width Horizontal Map Section */}
            <section className="w-full bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-4" data-aos="fade-up">
              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">Find Us on the Map</h3>
                <p className="text-sm sm:text-base text-zinc-500 font-normal">Our boutique store is located inside Express Avenue Mall, Chennai. Drop by for custom fittings.</p>
              </div>
              <div className="w-full h-80 rounded-2xl overflow-hidden border border-zinc-200/60 shadow-2xs relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.486266014496!2d80.25866167576406!3d13.055648813455243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52661aa4f107f9%3A0xe543329ebc671a5a!2sExpress%20Avenue!5e0!3m2!1sen!2sin!4v1716900000000!5m2!1sen!2sin" 
                  className="absolute inset-0 w-full h-full border-0 select-none"
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </section>
            
          </div>
          <Footer />
        </main>
      </div>

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer />
    </div>
  );
}
