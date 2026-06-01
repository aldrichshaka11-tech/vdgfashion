'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '../context/StoreContext';

export default function HeroSlider({ onShopClick }) {
  const { heroBanners } = useStore();
  const banners = heroBanners || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback(() => {
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, banners.length]);

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  // Automatic slide rotation
  useEffect(() => {
    if (isHovered) return; // Pause auto-rotation on mouse hover
    const timer = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => clearInterval(timer);
  }, [nextSlide, isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group overflow-hidden rounded-[2.5rem] bg-zinc-950 vdgfashion-card-shadow aspect-[2/1] w-full"
    >
      {/* Main Slide Images */}
      <div
        onClick={onShopClick}
        className="w-full h-full cursor-pointer relative"
      >
        <Image
          src={banners[currentIndex].src}
          alt={banners[currentIndex].alt}
          fill
          className="object-cover w-full h-full transition-all duration-700 ease-in-out transform scale-100"
          priority
        />
      </div>

      {/* Left Chevron arrow button */}
      <button
        onClick={prevSlide}
        className="hidden group-hover:flex absolute top-1/2 left-5 -translate-y-1/2 h-11 w-11 bg-white/80 hover:bg-white text-zinc-900 rounded-full items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 border border-zinc-100 z-10"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      {/* Right Chevron arrow button */}
      <button
        onClick={nextSlide}
        className="hidden group-hover:flex absolute top-1/2 right-5 -translate-y-1/2 h-11 w-11 bg-white/80 hover:bg-white text-zinc-900 rounded-full items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 border border-zinc-100 z-10"
        aria-label="Next Slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              currentIndex === idx
                ? 'w-6 bg-white shadow-md'
                : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
