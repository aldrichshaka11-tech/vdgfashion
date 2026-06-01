'use client';

import React, { useMemo, useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CartDrawer from './CartDrawer';
import ProductCard from './ProductCard';
import ProductDetailView from './ProductDetailView';
import { PRODUCTS } from '../data/products';
import { useStore } from '../context/StoreContext';
import { X } from 'lucide-react';

export default function CatalogPageLayout({ title, subtitle, type }) {
  const { products: allProducts, selectedProduct, wishlist, searchQuery } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const products = useMemo(() => {
    let result = [...allProducts];

    if (type === 'new-arrivals') result = result.filter((item) => item.isNew);
    if (type === 'best-sellers') result = result.filter((item) => item.tagType === 'bestseller' || item.rating >= 4.8);
    if (type === 'offers') result = result.filter((item) => item.tagType === 'discount');
    if (type === 'wishlist') result = result.filter((item) => wishlist.includes(item.id));

    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.category_name && item.category_name.toLowerCase().includes(q)) ||
          (typeof item.category === 'string' && item.category.toLowerCase().includes(q))
      );
    }

    return result;
  }, [type, wishlist, searchQuery]);

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative">
      <Sidebar className="hidden lg:flex fixed left-0 top-0 bottom-0 z-20" />

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

      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen min-w-0">
        <Header onMobileMenuToggle={() => setMobileSidebarOpen(true)} />

        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1400px] mx-auto space-y-6">
          {selectedProduct ? (
            <ProductDetailView />
          ) : (
            <>
              <section className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">{title}</h1>
                <p className="text-sm sm:text-base text-zinc-500 font-normal mt-1.5">{subtitle}</p>
              </section>

              <section className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.length === 0 ? (
                  <div className="col-span-full rounded-[2rem] border border-zinc-200 bg-white p-12 text-center">
                    <h3 className="text-base sm:text-lg font-black text-zinc-950">
                      {type === 'wishlist' ? 'Your wishlist is empty' : 'No products found'}
                    </h3>
                    <p className="text-sm sm:text-base text-zinc-500 mt-2 font-normal">
                      {type === 'wishlist'
                        ? 'Tap the heart icon on products to add them here.'
                        : 'Try a different keyword in search.'}
                    </p>
                  </div>
                ) : (
                  products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                )}
              </section>
            </>
          )}
        </main>
      </div>

      <CartDrawer />
    </div>
  );
}
