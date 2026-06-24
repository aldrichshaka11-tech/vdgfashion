'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import { API_BASE } from '../../lib/api';
import { 
  Grid, 
  Sparkles, 
  Flame, 
  Tag, 
  Layers, 
  CheckCircle2, 
  Package, 
  RotateCcw, 
  Truck, 
  Ruler, 
  HelpCircle, 
  Headphones, 
  User, 
  Briefcase, 
  Newspaper, 
  Pencil, 
  Users, 
  Map, 
  MapPin, 
  CreditCard, 
  Lock, 
  FileText, 
  Shield, 
  Accessibility 
} from 'lucide-react';

const InstagramIcon = () => (
  <svg className="h-4 w-4 fill-none stroke-white stroke-[2px]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
    <path d="M9 8H7v3h2v9h3v-9h3l.5-3H12V6c0-.9.2-1.2 1-1.2h2V2h-3c-3 0-4 1.4-4 3.5V8z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-3.5 w-3.5 fill-white" viewBox="0 0 24 24">
    <path d="M18.2 2.4h3.3L14.3 11l8.5 11.3h-6.8L10.7 15l-6.1 7.3H1.3l7.6-8.7L.8 2.4h7l5.1 6.7 5.3-6.7zm-1.2 17.6h1.8L7.1 4.2H5.2l11.8 15.8z"/>
  </svg>
);

const YoutubeIcon = () => (
  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
    <path d="M23.5 6.2c-.3-1.1-1.1-2-2.2-2.3C19.3 3.3 12 3.3 12 3.3s-7.3 0-9.3.6C1.6 4.2.8 5.1.5 6.2.2 8.3 0 12 0 12s.2 3.7.5 5.8c.3 1.1 1.1 2 2.2 2.3 2 .6 9.3.6 9.3.6s7.3 0 9.3-.6c1.1-.3 1.9-1.2 2.2-2.3.3-2.1.5-5.8.5-5.8s-.2-3.7-.5-5.8zM9.5 15.5V8.5l6.5 3.5-6.5 3.5z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg className="h-4 w-4 fill-white" viewBox="0 0 24 24">
    <path d="M12 0C5.4 0 0 5.4 0 12c0 5 3.1 9.3 7.6 11-.1-.9-.2-2.4 0-3.4.2-.9 1.4-6 1.4-6s-.4-.7-.4-1.8c0-1.7 1-3 2.2-3 1 0 1.5.8 1.5 1.7 0 1-.7 2.6-1 4.1-.3 1.2.6 2.2 1.8 2.2 2.1 0 3.8-2.2 3.8-5.5 0-2.9-2.1-4.9-5-4.9-3.4 0-5.4 2.6-5.4 5.2 0 1 .4 2.1.9 2.7.1.1.1.2.1.3-.1.4-.3 1.2-.3 1.4 0 .1-.2.2-.3.1-1-.5-1.6-2-1.6-3.2 0-3.8 2.8-7.3 8-7.3 4.2 0 7.5 3 7.5 7 0 4.2-2.6 7.5-6.3 7.5-1.2 0-2.4-.6-2.8-1.4l-.8 2.9c-.3 1.1-1.1 2.5-1.6 3.4 1.1.3 2.3.5 3.5.5 6.6 0 12-5.4 12-12S18.6 0 12 0z"/>
  </svg>
);


export default function Footer() {
  const router = useRouter();
  const { settings, setSelectedCategory } = useStore();

  const handleLinkClick = (category) => {
    setSelectedCategory(category);
    const catalog = document.getElementById('shop-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const quickLinks = [
    { name: 'Home', icon: User, action: () => router.push('/') },
    { name: 'Shop Categories', icon: Grid, action: () => router.push('/categories') },
    { name: 'My Orders', icon: Package, action: () => router.push('/orders') },
    { name: 'About Us', icon: Users, action: () => router.push('/about') },
    { name: 'Contact Us', icon: Headphones, action: () => router.push('/contact') },
    { name: 'Offers', icon: Tag, action: () => router.push('/offers') },
  ];

  const policies = [
    { name: 'Privacy Policy', icon: Shield, action: () => router.push('/privacy-policy') },
    { name: 'Terms & Conditions', icon: FileText, action: () => router.push('/terms-conditions') },
    { name: 'Shipping Policy', icon: Truck, action: () => router.push('/shipping-policy') },
    { name: 'Return & Refund Policy', icon: RotateCcw, action: () => router.push('/return-refund-policy') },
  ];

  return (
    <footer className="relative w-full overflow-hidden mt-12 bg-white border-t border-zinc-200 rounded-t-[32px]">
      
      {/* 1. Desktop Background (Monitor) */}
      <div className="absolute inset-0 hidden lg:block z-0 select-none pointer-events-none">
        <Image 
          src="/footer/21.png" 
          alt="Footer Background Monitor" 
          fill 
          className="object-cover animate-fade-in"
          style={{ objectPosition: 'center center' }}
          priority
        />
      </div>

      {/* 2. Mobile Background (Mobile) */}
      <div className="absolute inset-0 lg:hidden z-0 select-none pointer-events-none">
        <Image 
          src="/footer/22.png" 
          alt="Footer Background Mobile" 
          fill 
          className="object-cover animate-fade-in"
          style={{ objectPosition: 'left 38%' }}
          priority
        />
      </div>

      {/* Background Gradient overlay to ensure text legibility */}
      <div className="absolute inset-0 bg-white/10 lg:bg-white/0 z-0 pointer-events-none" />

      {/* Content wrapper */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 pt-16 pb-8 space-y-12 text-black">
        
        {/* Top Grid: Brand description, Quick Links, Policies, Address */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            {/* Colorful custom vdgfashion logo */}
            {settings?.logoImage ? (
              <div className="flex items-center gap-2.5 lg:gap-3">
                <img src={settings.logoImage.startsWith('http') ? settings.logoImage : `${API_BASE}${settings.logoImage}`} alt="Store Logo" className="h-16 md:h-20 w-auto object-contain" />
              </div>
            ) : (
              <div className="flex items-center gap-2.5 lg:gap-3">
                <div className="h-10 w-10 bg-gradient-to-tr from-[#e11d48] to-[#c026d3] rounded-xl flex items-center justify-center text-white font-extrabold shadow-sm relative">
                  <span className="text-xl font-sans tracking-tighter">V</span>
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-cyan-400 border-2 border-white rounded-full" />
                </div>
                <span className="text-3xl font-black tracking-tight text-zinc-950">vdgfashion</span>
              </div>
            )}
            
            <p className="text-[15.5px] font-medium text-zinc-650 leading-relaxed max-w-sm">
              {settings?.aboutText || "Trendy looks for every vibe. Stay stylish, every day."}
            </p>

            {/* Social media icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings?.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-xs bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"
                >
                  <InstagramIcon />
                </a>
              )}
              {settings?.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-xs bg-[#1877F2]"
                >
                  <FacebookIcon />
                </a>
              )}
              {settings?.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110 shadow-xs bg-[#FF0000]"
                >
                  <YoutubeIcon />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4 lg:pl-4">
            <div>
              <h4 className="text-[22px] font-sans font-black text-black tracking-normal">Quick Links</h4>
              <div className="h-[2.5px] w-8 bg-rose-600 mt-1.5" />
            </div>
            <ul className="space-y-3.5 text-[17px] font-sans font-medium text-zinc-650">
              {quickLinks.map((item) => {
                const LinkIcon = item.icon;
                return (
                  <li key={item.name}>
                    <button 
                      onClick={item.action}
                      className="flex items-center gap-2.5 hover:text-[#e11d48] text-zinc-650 transition-colors text-left group"
                    >
                      <LinkIcon className="h-5 w-5 text-zinc-500 group-hover:text-[#e11d48] transition-colors shrink-0" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 3: Policies */}
          <div className="space-y-4 lg:pl-4">
            <div>
              <h4 className="text-[22px] font-sans font-black text-black tracking-normal">Policies</h4>
              <div className="h-[2.5px] w-8 bg-cyan-500 mt-1.5" />
            </div>
            <ul className="space-y-3.5 text-[17px] font-sans font-medium text-zinc-650">
              {policies.map((item) => {
                const LinkIcon = item.icon;
                return (
                  <li key={item.name}>
                    <button 
                      onClick={item.action}
                      className="flex items-center gap-2.5 hover:text-cyan-600 text-zinc-650 transition-colors text-left group"
                    >
                      <LinkIcon className="h-5 w-5 text-zinc-500 group-hover:text-cyan-600 transition-colors shrink-0" />
                      {item.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Column 4: Address */}
          <div className="space-y-4 lg:pl-4">
            <div>
              <h4 className="text-[22px] font-sans font-black text-black tracking-normal">Address</h4>
              <div className="h-[2.5px] w-8 bg-indigo-600 mt-1.5" />
            </div>
            <div className="space-y-4 text-zinc-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <p className="text-[15.5px] font-medium leading-relaxed text-zinc-650">
                  {settings?.storeAddress || '61/1,First floor, VDG Fashion Narayana complex, opp. burma hotel, Sivagami Puram, Virudhunagar, Tamil Nadu 626001'}
                </p>
              </div>
              
              <div className="flex items-center gap-2.5">
                <Headphones className="h-5 w-5 text-indigo-600 shrink-0" />
                <p className="text-[15.5px] font-semibold text-zinc-650">
                  Phone: <a href={`tel:${settings?.contactPhone || '083001 12996'}`} className="hover:text-rose-600 transition-colors">{settings?.contactPhone || '083001 12996'}</a>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright notice only */}
        <div className="pt-6 border-t border-zinc-200/60 flex items-center justify-center w-full">
          <span className="text-[15.5px] font-normal text-zinc-500">
            &copy; 2026 vdgfashion. All rights reserved.
          </span>
        </div>

      </div>

    </footer>
  );
}
