'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useStore } from '../context/StoreContext';

function SliderInstance({ banners, aspectClass, hiddenClass, onShopClick }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prevSlide = (e) => {
    e.stopPropagation();
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? banners.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = useCallback((e) => {
    if (e) e.stopPropagation();
    const isLastSlide = currentIndex === banners.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  }, [currentIndex, banners.length]);

  const goToSlide = (slideIndex, e) => {
    e.stopPropagation();
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

  if (!banners.length) return (
    <div className={`relative overflow-hidden bg-zinc-950 ${aspectClass} ${hiddenClass} w-full`} />
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group overflow-hidden bg-zinc-950 ${aspectClass} ${hiddenClass} w-full`}
    >
      {/* Main Slide Image */}
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
      {isHovered && (
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-3 md:left-5 -translate-y-1/2 h-8 w-8 md:h-11 md:w-11 bg-white/80 hover:bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-md md:shadow-lg transition-all hover:scale-105 active:scale-95 border border-zinc-100 z-10"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      )}

      {/* Right Chevron arrow button */}
      {isHovered && (
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-3 md:right-5 -translate-y-1/2 h-8 w-8 md:h-11 md:w-11 bg-white/80 hover:bg-white text-zinc-900 rounded-full flex items-center justify-center shadow-md md:shadow-lg transition-all hover:scale-105 active:scale-95 border border-zinc-100 z-10"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
        </button>
      )}

      {/* Slide Indicators / Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2.5 z-10">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => goToSlide(idx, e)}
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

export default function HeroSlider({ onShopClick }) {
  const { heroBanners, mobileBanners } = useStore();
  
  const desktopList = (heroBanners || []).filter(b => b && b.src && b.src.trim() !== '');
  const mobileList = (mobileBanners || []).filter(b => b && b.src && b.src.trim() !== '');

  return (
    <>
      {/* Desktop Slider */}
      <SliderInstance
        banners={desktopList}
        aspectClass="aspect-[3/1]"
        hiddenClass="hidden md:block"
        onShopClick={onShopClick}
      />

      {/* Mobile Slider */}
      <SliderInstance
        banners={mobileList}
        aspectClass="aspect-[2/1]"
        hiddenClass="block md:hidden"
        onShopClick={onShopClick}
      />
    </>
  );
}
