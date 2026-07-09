'use client';

import React, { useState } from 'react';
import { X, Copy, Download, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';

const FacebookIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const InstagramIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function ProductShareModal({ isOpen, onClose, product }) {
  const [isReselling, setIsReselling] = useState(false);

  if (!isOpen || !product) return null;

  const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/collections/${product.parent_category_slug || 'all'}/${product.slug || product.id}` : '';
  
  const generateShareText = () => {
    return `Hey, check out this product on VDG Fashion!\n\n${product.name}\n\nPrice: ₹${product.price}\n\n${productUrl}`;
  };

  const handleShare = async (platform) => {
    // If reselling is YES, we attempt to share image only
    // If NO, we share link and text
    
    if (isReselling) {
       // Download image fallback or use Web Share API with files
       await shareImagesOnly();
       return;
    }

    const text = generateShareText();
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(text);
        alert('Link copied to clipboard!');
        break;
      default:
        // Try native share API if supported
        if (navigator.share) {
          navigator.share({
            title: product.name,
            text: text,
            url: productUrl,
          }).catch(console.error);
        }
        break;
    }
  };

  const shareImagesOnly = async () => {
    try {
        const imageUrls = product.thumbnails && product.thumbnails.length > 0 
           ? product.thumbnails.slice(0, 3) // max 3 images to avoid payload limits
           : [product.image];
           
        const files = await Promise.all(imageUrls.map(async (url, idx) => {
            const response = await fetch(url);
            const blob = await response.blob();
            const ext = url.split('.').pop().split('?')[0] || 'jpg';
            return new File([blob], `product-${idx}.${ext}`, { type: blob.type });
        }));

        if (navigator.canShare && navigator.canShare({ files })) {
            await navigator.share({
                files,
                title: product.name,
                text: 'Product Images'
            });
        } else {
            // Fallback: download images
            downloadPhotos();
            alert('Images downloaded! You can now share them manually.');
        }
    } catch (error) {
        console.error('Error sharing images:', error);
        // Fallback
        downloadPhotos();
        alert('Images downloaded! You can now share them manually.');
    }
  };

  const downloadPhotos = async () => {
    const imageUrls = product.thumbnails && product.thumbnails.length > 0 ? product.thumbnails : [product.image];
    
    for (let i = 0; i < imageUrls.length; i++) {
        const url = imageUrls[i];
        if (!url) continue;
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `${product.name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-${i + 1}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
            
            // small delay to prevent browser blocking multiple downloads
            await new Promise(r => setTimeout(r, 300));
        } catch(e) {
            console.error('Failed to download image', e);
        }
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div 
        className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up sm:animate-fade-in shadow-2xl border border-zinc-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-150">
          <h3 className="text-sm font-black tracking-widest text-zinc-900 uppercase">Share</h3>
          <button onClick={onClose} className="p-2 -mr-2 text-zinc-400 hover:text-black hover:bg-zinc-100 rounded-full transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto custom-scrollbar p-5 space-y-6">
            {/* Product Snippet */}
            <div className="flex items-center gap-4 bg-zinc-50 p-3 rounded-2xl border border-zinc-150">
                <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white border border-zinc-200 flex-shrink-0">
                    {product.image || (product.thumbnails && product.thumbnails[0]) ? (
                        <Image 
                            src={product.image || (product.thumbnails && product.thumbnails[0])} 
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-200"></div>
                    )}
                </div>
                <div>
                    <h4 className="text-sm font-bold text-zinc-900 line-clamp-2 leading-tight">{product.name}</h4>
                </div>
            </div>

            {/* Reseller Question */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white gap-3 sm:gap-0">
                <span className="text-xs sm:text-[13px] font-bold text-zinc-800">Are you reselling this product?</span>
                <div className="flex self-start sm:self-auto bg-zinc-100 rounded-full p-1 border border-zinc-200">
                    <button 
                        onClick={() => setIsReselling(false)}
                        className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${!isReselling ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        NO
                    </button>
                    <button 
                        onClick={() => setIsReselling(true)}
                        className={`px-4 py-1.5 rounded-full text-xs font-black transition-all ${isReselling ? 'bg-fuchsia-100 text-fuchsia-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                    >
                        YES
                    </button>
                </div>
            </div>

            <hr className="border-zinc-150" />

            {/* Share Options */}
            <div className="space-y-4">
                <h5 className="text-xs font-bold text-zinc-600">Choose an option to share</h5>
                
                <div className="flex flex-wrap gap-4 sm:gap-y-6 sm:gap-x-2">
                    <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 group w-[70px] sm:w-auto">
                        <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <MessageCircle className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-700 text-center leading-tight">WhatsApp</span>
                    </button>

                    <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2 group w-[70px] sm:w-auto">
                        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <FacebookIcon className="w-6 h-6 fill-current" />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-700 text-center leading-tight">Facebook</span>
                    </button>

                    <button onClick={() => handleShare('instagram')} className="flex flex-col items-center gap-2 group w-[70px] sm:w-auto">
                        <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <InstagramIcon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-700 text-center leading-tight">Instagram</span>
                    </button>

                    <button onClick={() => handleShare('telegram')} className="flex flex-col items-center gap-2 group w-[70px] sm:w-auto">
                        <div className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform pr-0.5">
                            <Send className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-700 text-center leading-tight">Telegram</span>
                    </button>

                    <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-2 group w-[70px] sm:w-auto">
                        <div className="w-12 h-12 bg-zinc-200 text-zinc-700 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <Copy className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-700 text-center">Copy Link</span>
                    </button>
                </div>
            </div>

            <hr className="border-zinc-150" />

            {/* Download Button */}
            <button 
                onClick={downloadPhotos}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-800 font-extrabold rounded-xl transition-all shadow-sm active:scale-98 text-xs tracking-wider uppercase"
            >
                <Download className="h-4.5 w-4.5" />
                Download Photos
            </button>

        </div>
      </div>
    </div>
  );
}
