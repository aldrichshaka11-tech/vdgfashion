'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import { API_BASE } from '../../lib/api';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Package, 
  CheckCircle2, 
  Truck, 
  Info, 
  XCircle, 
  RotateCcw, 
  CreditCard,
  Calendar,
  MapPin,
  HelpCircle
} from 'lucide-react';
import { formatINR } from '../utils/currency';

const getPaginatedRange = (currentPage, totalPages) => {
  const maxVisible = 22;
  if (totalPages <= maxVisible) {
    return [...Array(totalPages)].map((_, i) => i + 1);
  }
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = start + maxVisible - 1;
  if (end > totalPages) {
    end = totalPages;
    start = end - maxVisible + 1;
  }
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { user, products } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All'); // 'All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  
  const itemsPerPage = 3; // Limit items per page as requested to demonstrate pagination clearly

  const fetchOrders = async () => {
    try {
      const headers = {};
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      const res = await fetch(`${API_BASE}/api/orders/`, { headers });
      if (res.ok) {
        const data = await res.json();
        // Backend already filters by authenticated user — use data directly
        const mapped = data.map(o => ({
          id: o.id,
          orderId: o.order_id,
          date: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          totalAmount: parseFloat(o.total_amount),
          paymentMethod: o.payment_method === 'card' ? 'Credit Card' : o.payment_method === 'upi' ? 'UPI Transfer' : 'Cash on Delivery',
          cardLast4: o.payment_method === 'card' ? 'CARD' : o.payment_method === 'upi' ? 'UPI' : 'COD',
          rawStatus: o.status || 'pending',
          status: o.status
            ? (o.status === 'out_for_delivery' ? 'Out for Delivery' : o.status.charAt(0).toUpperCase() + o.status.slice(1))
            : 'Pending',
          statusDate: new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
          shippingAddress: `${o.street_address}, ${o.city}, ${o.state} - ${o.pin_code}`,
          subtotal: parseFloat(o.subtotal),
          discount: parseFloat(o.discount_amount),
          shippingFee: parseFloat(o.shipping_fee),
          items: (o.items || []).map(item => {
            const productObj = products.find(p => p.id === (item.product || item.product_id));
            const resolvedImage = productObj && productObj.image ? productObj.image : '/products/accessories_category.png';
            return {
              name: item.product_name,
              qty: item.quantity,
              price: parseFloat(item.price),
              size: item.selected_size || '-',
              colorHex: item.selected_color || '#e6fcf5',
              image: resolvedImage
            };
          })
        }));
        setOrders(mapped);
      }
    } catch (e) {
      console.error('Failed to fetch orders', e);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!confirm('Are you sure you want to delete/cancel this order?')) return;
    try {
      const headers = {};
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
      const res = await fetch(`${API_BASE}/api/orders/${id}/`, {
        method: 'DELETE',
        headers
      });
      if (res.ok) {
        alert('Order deleted/cancelled successfully!');
        fetchOrders();
      } else {
        alert('Failed to delete order');
      }
    } catch (err) {
      alert('Network error deleting order');
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-out-cubic',
    });

    fetchOrders();
  }, [user, products]);

  // Filter orders based on Tab selection and search query
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // Status Filter
    if (activeTab !== 'All') {
      // Map display tab names to backend status values
      const tabStatusMap = {
        'Processing': ['pending', 'confirmed', 'packed'],
        'Shipped': ['shipped', 'out_for_delivery'],
        'Delivered': ['delivered'],
        'Cancelled': ['cancelled'],
        'Returned': ['returned', 'refunded'],
      };
      const allowedStatuses = tabStatusMap[activeTab] || [activeTab.toLowerCase()];
      result = result.filter(o => allowedStatuses.includes(o.rawStatus));
    }

    // Search Query Filter (Search by order number or item name)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(o => 
        o.orderId.toLowerCase().includes(q) || 
        o.items.some(item => item.name.toLowerCase().includes(q))
      );
    }

    return result;
  }, [orders, activeTab, searchQuery]);

  // Reset page when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Pagination Calculations
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case 'Delivered':
        return {
          bg: 'bg-emerald-600 text-white border-emerald-600 shadow-xs',
          icon: CheckCircle2,
          descColor: 'text-emerald-700 font-bold'
        };
      case 'Shipped':
      case 'Out for Delivery':
        return {
          bg: 'bg-indigo-600 text-white border-indigo-600 shadow-xs',
          icon: Truck,
          descColor: 'text-indigo-700 font-bold'
        };
      case 'Processing':
      case 'Pending':
      case 'Confirmed':
      case 'Packed':
        return {
          bg: 'bg-amber-500 text-white border-amber-500 shadow-xs',
          icon: Package,
          descColor: 'text-amber-600 font-bold animate-pulse'
        };
      case 'Cancelled':
        return {
          bg: 'bg-rose-600 text-white border-rose-600 shadow-xs',
          icon: XCircle,
          descColor: 'text-rose-700 font-bold'
        };
      case 'Returned':
      case 'Refunded':
        return {
          bg: 'bg-purple-600 text-white border-purple-600 shadow-xs',
          icon: RotateCcw,
          descColor: 'text-purple-700 font-bold'
        };
      default:
        return {
          bg: 'bg-zinc-650 text-white border-zinc-650 shadow-xs',
          icon: Package,
          descColor: 'text-zinc-600 font-bold'
        };
    }
  };

  return (
    <div className="flex bg-[#fafafa] min-h-screen text-black overflow-hidden relative font-sans">
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
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1600px] mx-auto space-y-6 flex-grow">
            
            {/* Header Title Section */}
            <div className="space-y-1" data-aos="fade-up">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">My Orders</h1>
              <p className="text-xs sm:text-sm text-zinc-500 font-normal">Track, manage and view details of all your orders.</p>
            </div>

            {/* Filter and Tab Section */}
            <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-zinc-200 pb-1" data-aos="fade-up" data-aos-delay="40">
              {/* Category tabs */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : 'border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-300 bg-white'
                    }`}
                  >
                    {tab === 'All' ? 'All Orders' : tab}
                  </button>
                ))}
              </div>

              {/* Search bar and Filters */}
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-64 focus-within:ring-2 focus-within:ring-zinc-950/10 rounded-full">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white pl-10 pr-4 py-2 border border-zinc-200 rounded-full text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-zinc-950 placeholder-zinc-400 text-black"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                
                <button className="flex items-center gap-1.5 border border-zinc-200 bg-white px-4 py-2 rounded-full text-xs font-bold text-zinc-650 hover:bg-zinc-50 transition-colors shadow-2xs cursor-pointer">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Filter
                </button>
              </div>
            </section>

            {/* Orders Cards List */}
            <section className="space-y-4 pt-1">
              {paginatedOrders.length === 0 ? (
                <div className="bg-white border border-zinc-150 rounded-[2rem] p-16 text-center flex flex-col items-center justify-center min-h-[350px] space-y-4" data-aos="fade-up">
                  <div className="h-14 w-14 bg-zinc-50 rounded-full flex items-center justify-center">
                    <Package className="h-7 w-7 text-zinc-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-zinc-950">No orders found</h3>
                    <p className="text-xs text-zinc-500 font-normal max-w-xs mx-auto">We couldn&apos;t find any matching orders for your filters or search keywords.</p>
                  </div>
                  <button 
                    onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
                    className="rounded-xl border border-zinc-200 bg-white px-4.5 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-50 cursor-pointer shadow-2xs"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                paginatedOrders.map((order, idx) => {
                  const statusInfo = getStatusClasses(order.status);
                  return (
                    <div 
                      key={order.orderId}
                      className="bg-white border border-zinc-150 rounded-[1.8rem] p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-all relative flex flex-col lg:grid lg:grid-cols-[1.5fr_1fr_1.3fr_0.8fr] gap-6 items-center"
                      data-aos="fade-up"
                      data-aos-delay={idx * 60}
                    >
                      {/* Left: Thumbnail Preview & Number */}
                      <div className="w-full flex flex-col sm:flex-row items-center gap-5 sm:border-r border-zinc-100 sm:pr-6">
                        {/* Order info details */}
                        <div className="text-center sm:text-left min-w-[140px] shrink-0">
                          <h3 className="text-sm font-extrabold text-zinc-900 tracking-tight">Order #{order.orderId.replace('TRD-2026-', 'TD')}</h3>
                          <p className="text-[11px] text-zinc-400 font-normal mt-1">Placed on {order.date}</p>
                        </div>

                        {/* Visual previews */}
                        <div className="flex items-center -space-x-2.5 overflow-x-auto no-scrollbar">
                          {order.items.slice(0, 3).map((item, itemIdx) => (
                            <div 
                              key={itemIdx}
                              className="relative h-13 w-13 rounded-lg border-2 border-white bg-zinc-50 flex items-center justify-center p-1.5 shadow-2xs shrink-0"
                              style={{ backgroundColor: item.colorHex || '#f4f4f5' }}
                              title={`${item.name} (${item.qty})`}
                            >
                              {item.image ? (
                                <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                              ) : null}
                            </div>
                          ))}
                          
                          {/* Plus count badge */}
                          {order.items.length > 3 && (
                            <div className="h-13 w-13 rounded-lg border-2 border-white bg-zinc-100 text-zinc-650 text-xs font-black flex items-center justify-center shadow-2xs shrink-0 relative z-10 pl-1 select-none">
                              +{order.items.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Center-Left: Item quantities & Payment Mode */}
                      <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-2 sm:border-r border-zinc-100 lg:pr-6">
                        <div>
                          <p className="text-xs font-extrabold text-zinc-900">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                          <p className="text-[11px] text-zinc-400 font-normal mt-0.5">{formatINR(order.totalAmount)}</p>
                        </div>
                        
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] font-bold text-zinc-600">
                          <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                          <span>{order.paymentMethod} {order.cardLast4 !== 'COD' && order.cardLast4 !== 'UPI' ? `•••• ${order.cardLast4}` : ''}</span>
                        </div>
                      </div>

                      {/* Center-Right: Styled Status Badges */}
                      <div className="w-full flex flex-col items-center lg:items-start gap-2.5 sm:border-r border-zinc-100 lg:pr-6">
                        <div className={`px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide flex items-center gap-1.5 w-fit ${statusInfo.bg}`}>
                          {statusInfo.icon && React.createElement(statusInfo.icon, { className: "h-3.5 w-3.5 text-white shrink-0" })}
                          {order.status}
                        </div>
                        
                        <div className="text-center lg:text-left">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                            {order.status === 'Delivered' ? 'Completed On' : order.status === 'Cancelled' ? 'Cancelled On' : order.status === 'Returned' ? 'Returned On' : 'Expected By'}
                          </span>
                          <span className={`text-[11.5px] font-bold mt-0.5 block ${statusInfo.descColor}`}>
                            {order.statusDate}
                          </span>
                        </div>
                      </div>

                      {/* Right: Price Total & Details Button */}
                      <div className="w-full flex sm:flex-row lg:flex-col lg:items-end justify-between items-center gap-4">
                        <div className="text-left lg:text-right">
                          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">Total Amount</span>
                          <span className="text-lg font-black text-zinc-950">{formatINR(order.totalAmount)}</span>
                        </div>
                        
                        <button 
                          onClick={() => setSelectedOrderDetails(order)}
                          className="rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-800 text-[11px] sm:text-xs font-bold tracking-wide py-2.5 px-4 cursor-pointer transition-all active:scale-98 flex items-center gap-1 hover:border-zinc-300"
                        >
                          View Details
                        </button>
                      </div>

                    </div>
                  );
                })
              )}
            </section>

            {/* Pagination Controls Section */}
            {filteredOrders.length > 0 && (
              <section className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-zinc-150" data-aos="fade-up">
                <p className="text-xs text-zinc-450 font-normal">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
                </p>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8.5 w-8.5 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-650 hover:bg-zinc-50 cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page numbers */}
                  {getPaginatedRange(currentPage, totalPages).map((pageNum) => {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`h-8.5 w-8.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer border ${
                          currentPage === pageNum
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-2xs font-black'
                            : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8.5 w-8.5 rounded-lg border border-zinc-200 bg-white flex items-center justify-center text-zinc-650 hover:bg-zinc-50 cursor-pointer disabled:opacity-40 disabled:hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </section>
            )}

          </div>
          <Footer />
        </main>
      </div>

      <CartDrawer />

      {/* Dynamic Detailed Order details Modal pop-up dialog */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center px-4">
          {/* overlay backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in" onClick={() => setSelectedOrderDetails(null)} />
          
          <div className="relative bg-white rounded-[2rem] max-w-2xl w-full p-6 sm:p-8 shadow-2xl animate-fade-in border border-zinc-200 max-h-[85vh] overflow-y-auto divide-y divide-zinc-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 tracking-tight">Order Details</h3>
                <p className="text-[11px] text-zinc-400 font-normal mt-0.5">Order ID: {selectedOrderDetails.orderId}</p>
              </div>
              <button 
                onClick={() => setSelectedOrderDetails(null)} 
                className="p-1 rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-black transition-colors"
              >
                <X className="h-5.5 w-5.5" />
              </button>
            </div>

            {/* Delivery address & Timeline info */}
            <div className="py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs leading-normal">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#e11d48]" />
                  Shipping Destination
                </span>
                <p className="font-normal text-zinc-700">{selectedOrderDetails.shippingAddress}</p>
              </div>
              
              <div className="space-y-1.5 sm:border-l border-zinc-150 sm:pl-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#5c51db]" />
                  Status Milestone
                </span>
                <div className={`px-3 py-1.5 rounded-full border text-[11px] font-black tracking-wide flex items-center gap-1.5 w-fit ${getStatusClasses(selectedOrderDetails.status).bg} mt-1`}>
                  {getStatusClasses(selectedOrderDetails.status).icon && React.createElement(getStatusClasses(selectedOrderDetails.status).icon, { className: "h-3.5 w-3.5 text-white shrink-0" })}
                  {selectedOrderDetails.status}
                </div>
                <p className="text-zinc-550 font-medium">Recorded date: {selectedOrderDetails.statusDate}</p>
              </div>
            </div>

            {/* Items list detail rows */}
            <div className="py-4 space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Items Purchased</span>
              {selectedOrderDetails.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div 
                    className="relative h-14 w-14 rounded-xl border border-zinc-150 p-1 shrinkage-0"
                    style={{ backgroundColor: item.colorHex || '#f4f4f5' }}
                  >
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-extrabold text-zinc-900 line-clamp-1">{item.name}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Size: {item.size} • Qty: {item.qty}</p>
                  </div>
                  <span className="text-xs sm:text-sm font-extrabold text-zinc-800 shrink-0">{formatINR(item.price * item.qty)}</span>
                </div>
              ))}
            </div>

            {/* Calculations and payment */}
            <div className="pt-4 space-y-3 text-zinc-650">
              <div className="space-y-1.5 text-xs font-normal">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-zinc-800 font-normal">{formatINR(selectedOrderDetails.subtotal)}</span>
                </div>
                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span className="text-rose-600 font-normal">- {formatINR(selectedOrderDetails.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="text-zinc-800 font-normal">{selectedOrderDetails.shippingFee === 0 ? 'FREE' : formatINR(selectedOrderDetails.shippingFee)}</span>
                </div>
                <div className="border-t border-zinc-200 pt-2 flex justify-between text-base font-black text-zinc-950">
                  <span>Grand Total Paid</span>
                  <span className="text-zinc-950 font-black">{formatINR(selectedOrderDetails.totalAmount)}</span>
                </div>
              </div>

              <div className="rounded-xl bg-zinc-50 p-3 flex justify-between items-center text-[11px] font-bold text-zinc-500">
                <span className="flex items-center gap-1">
                  <CreditCard className="h-3.5 w-3.5 text-zinc-400" />
                  Paid via {selectedOrderDetails.paymentMethod}
                </span>
                {selectedOrderDetails.cardLast4 !== 'COD' && selectedOrderDetails.cardLast4 !== 'UPI' && (
                  <span>Ending in {selectedOrderDetails.cardLast4}</span>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
