'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useStore } from '../context/StoreContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, ChevronRight, X, User, Phone, MapPin, Mail, Landmark, Info } from 'lucide-react';
import { formatINR } from '../utils/currency';
import { API_BASE } from '../../lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    cart, 
    cartCount, 
    cartSubtotal, 
    clearCart,
    appliedCoupon,
    couponDiscount,
    shippingFee,
    cartTotal,
    settings,
    user,
    logoutUser
  } = useStore();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pinCode: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'upi' | 'cod'
  const [cardData, setCardData] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState('');

  // Saved Addresses State
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressModalMode, setAddressModalMode] = useState('add'); // 'add' | 'edit'
  const [addressForm, setAddressForm] = useState({ label: 'Home', name: '', phone: '', street: '', city: '', state: '', pinCode: '', isDefault: false });
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Fetch addresses on mount
  useEffect(() => {
    if (user && user.token) {
      fetch(`${API_BASE}/api/addresses/`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSavedAddresses(data);
          const defaultAddr = data.find(addr => addr.is_default) || data[0];
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setFormData({
              name: defaultAddr.recipient_name,
              email: user.email || '',
              phone: defaultAddr.phone,
              street: defaultAddr.street_address,
              city: defaultAddr.city,
              state: defaultAddr.state,
              pinCode: defaultAddr.pin_code
            });
          } else {
            setSelectedAddressId('new');
          }
        } else {
          setSelectedAddressId('new');
        }
      })
      .catch(err => {
        console.error("Error fetching addresses:", err);
        setSelectedAddressId('new');
      });
    } else {
      setSelectedAddressId('new');
    }
  }, [user]);

  const handleAddressSelect = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === 'new') {
      setFormData(prev => ({
        ...prev,
        street: '',
        city: '',
        state: '',
        pinCode: ''
      }));
    } else {
      const selected = savedAddresses.find(addr => addr.id === addrId);
      if (selected) {
        setFormData({
          name: selected.recipient_name,
          email: user?.email || '',
          phone: selected.phone,
          street: selected.street_address,
          city: selected.city,
          state: selected.state,
          pinCode: selected.pin_code
        });
      }
    }
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.phone || !addressForm.street || !addressForm.city || !addressForm.pinCode) {
      alert('Please fill out all address fields.');
      return;
    }

    const payload = {
      label: addressForm.label || 'Home',
      recipient_name: addressForm.name,
      phone: addressForm.phone,
      street_address: addressForm.street,
      city: addressForm.city,
      state: addressForm.state || '',
      pin_code: addressForm.pinCode,
      is_default: addressForm.isDefault
    };

    const url = addressModalMode === 'edit'
      ? `${API_BASE}/api/addresses/${selectedAddressId}/`
      : `${API_BASE}/api/addresses/`;

    const method = addressModalMode === 'edit' ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const updatedAddr = await res.json();
        // Refresh address list
        const listRes = await fetch(`${API_BASE}/api/addresses/`, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        const listData = await listRes.json();
        if (Array.isArray(listData)) {
          setSavedAddresses(listData);
          setSelectedAddressId(updatedAddr.id);
          setFormData({
            name: updatedAddr.recipient_name,
            email: user?.email || '',
            phone: updatedAddr.phone,
            street: updatedAddr.street_address,
            city: updatedAddr.city,
            state: updatedAddr.state,
            pinCode: updatedAddr.pin_code
          });
        }
        setIsAddressModalOpen(false);
      } else {
        alert('Failed to save address. Please check inputs.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving address.');
    }
  };

  const handleAddressDelete = async (addrId) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      const res = await fetch(`${API_BASE}/api/addresses/${addrId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (res.ok) {
        setSavedAddresses(prev => {
          const remaining = prev.filter(a => a.id !== addrId);
          if (selectedAddressId === addrId) {
            const nextSelect = remaining[0];
            if (nextSelect) {
              setSelectedAddressId(nextSelect.id);
              setFormData({
                name: nextSelect.recipient_name,
                email: user?.email || '',
                phone: nextSelect.phone,
                street: nextSelect.street_address,
                city: nextSelect.city,
                state: nextSelect.state,
                pinCode: nextSelect.pin_code
              });
            } else {
              setSelectedAddressId(null);
              setFormData(prev => ({
                ...prev,
                street: '',
                city: '',
                state: '',
                pinCode: ''
              }));
            }
          }
          return remaining;
        });
      } else {
        alert('Failed to delete address.');
      }
    } catch (err) {
      console.error(err);
      alert('Network error deleting address.');
    }
  };


  useEffect(() => {
    AOS.init({
      duration: 700,
      once: false,
      easing: 'ease-out-cubic',
    });
  }, []);

  // Pre-fill form with authenticated user details
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || (user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username || ''),
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  // Redirect to home if cart is empty
  useEffect(() => {
    if (cart.length === 0 && !isProcessing) {
      // Allow minor delay or check
    }
  }, [cart, isProcessing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.street || !formData.city || !formData.pinCode) {
      alert('Please fill out all required shipping fields.');
      return;
    }

    setIsProcessing(true);
    setProcessStep('Verifying address parameters...');

    // Auto-save address if user checked the box and has entered a new address
    if (user && user.token && selectedAddressId === 'new' && saveAddressForFuture) {
      setProcessStep('Saving new address to account...');
      try {
        const addressPayload = {
          recipient_name: formData.name,
          phone: formData.phone,
          street_address: formData.street,
          city: formData.city,
          state: formData.state || '',
          pin_code: formData.pinCode,
          is_default: savedAddresses.length === 0
        };
        await fetch(`${API_BASE}/api/addresses/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(addressPayload)
        });
      } catch (err) {
        console.error("Failed to auto-save address:", err);
      }
    }

    const generatedOrderId = `TRD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderPayload = {
      order_id: generatedOrderId,
      customer_name: formData.name,
      email: formData.email || '',
      phone: formData.phone,
      street_address: formData.street,
      city: formData.city,
      state: formData.state || '',
      pin_code: formData.pinCode,
      payment_method: paymentMethod,
      subtotal: cartSubtotal,
      discount_amount: couponDiscount,
      shipping_fee: shippingFee,
      total_amount: cartTotal,
      items: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        selected_color: item.selectedColor || '',
        selected_size: item.selectedSize || ''
      }))
    };

    setTimeout(() => {
      setProcessStep('Saving order details in secure database...');
      
      const headers = { 'Content-Type': 'application/json' };
      if (user && user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      // Perform actual fetch to Django API
      fetch(`${API_BASE}/api/orders/`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(orderPayload)
      })
      .then(async res => {
        if (!res.ok) {
          if (res.status === 401) {
            logoutUser();
            throw new Error('Your session has expired. You have been logged out. Please try placing the order again to checkout as a guest, or log in again.');
          }
          let errorDetail = `Status ${res.status}`;
          try {
            const errData = await res.json();
            errorDetail = typeof errData === 'object' ? JSON.stringify(errData) : errData;
          } catch {}
          throw new Error(errorDetail);
        }
        return res.json();
      })
      .then(data => {
        setProcessStep('Authenticating SSL encrypted transaction...');
        setTimeout(() => {
          setProcessStep('Confirming final order details...');
          setTimeout(() => {
            const orderDetails = {
              orderId: data.order_id || generatedOrderId,
              customerName: formData.name,
              itemsCount: cartCount,
              totalAmount: cartTotal,
              shippingAddress: `${formData.street}, ${formData.city}, ${formData.state} - ${formData.pinCode}`,
              paymentMethod: paymentMethod === 'card' ? 'Credit Card' : paymentMethod === 'upi' ? 'UPI Transfer' : 'Cash on Delivery',
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            };
            
            sessionStorage.setItem('vdgfashion_last_order', JSON.stringify(orderDetails));
            clearCart();
            setIsProcessing(false);
            router.push('/order-success');
          }, 1000);
        }, 1000);
      })
      .catch(err => {
        console.error('Order placement failed:', err);
        setIsProcessing(false);
        setProcessStep('');
        alert(`⚠️ Order could not be placed. Error: ${err.message}`);
      });
    }, 1000);
  };

  const discountValue = couponDiscount;
  const finalTotal = cartTotal;

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
          <div className="px-4 sm:px-8 py-6 sm:py-8 w-full max-w-[1600px] mx-auto space-y-6 flex-grow">
            
            <div className="flex items-center justify-between gap-3">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-zinc-950">Secure Checkout</h1>
              <button 
                onClick={() => router.push('/cart')}
                className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Back to Cart
              </button>
            </div>

            {isProcessing ? (
              <div className="bg-white border border-zinc-150 rounded-[2rem] p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[450px] space-y-5 animate-fade-in">
                <div className="relative h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                  <ShieldCheck className="h-10 w-10 text-indigo-600 relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Securing Your Order</h3>
                  <p className="text-sm sm:text-base text-zinc-500 font-normal">{processStep}</p>
                </div>
                <p className="text-xs text-zinc-400 font-normal">Please do not refresh the page or click back button.</p>
              </div>
            ) : settings && !settings.isStoreOpen ? (
              <div className="bg-white border border-zinc-150 rounded-[2rem] p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[350px] space-y-4 animate-fade-in">
                <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-950">Store Under Maintenance</h3>
                  <p className="text-sm text-zinc-500 font-normal max-w-md mx-auto leading-relaxed">
                    Our boutique is currently undergoing scheduled maintenance or database updates. Please check back shortly to complete your checkout. We apologize for any inconvenience!
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => router.push('/')}
                  className="rounded-xl bg-zinc-950 hover:bg-zinc-800 px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  Return to Storefront
                </button>
              </div>
            ) : cart.length === 0 ? (
              <div className="bg-white border border-zinc-150 rounded-[2rem] p-12 shadow-xs text-center flex flex-col items-center justify-center min-h-[350px] space-y-4" data-aos="fade-up">
                <CheckCircle2 className="h-12 w-12 text-zinc-300" />
                <h3 className="text-lg font-black text-zinc-950">No items to checkout</h3>
                <p className="text-sm text-zinc-500 font-normal max-w-sm leading-relaxed">Your shopping cart is empty. Add products from our summer collections to proceed with placing an order.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="rounded-xl bg-[#5c51db] hover:bg-[#4b41ca] px-6 py-3 text-sm font-semibold text-white transition-colors cursor-pointer"
                >
                  Discover Products
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch pt-2">
                
                {/* Left Column: Forms */}
                <div className="xl:col-span-8 space-y-6 flex flex-col justify-between h-full">
                  
                  {/* Shipping Form Card */}
                  <div className="bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-6" data-aos="fade-up">
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">1. Delivery Address</h3>
                    
                    {user && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-zinc-800">Select Saved Address</label>
                          <button
                            type="button"
                            onClick={() => {
                              setAddressForm({ name: '', phone: '', street: '', city: '', state: '', pinCode: '', isDefault: false });
                              setAddressModalMode('add');
                              setIsAddressModalOpen(true);
                            }}
                            className="text-xs font-bold text-[#5c51db] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            + Add New Address
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {savedAddresses.map((addr) => (
                            <div
                              key={addr.id}
                              onClick={() => handleAddressSelect(addr.id)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                                selectedAddressId === addr.id
                                  ? 'border-[#5c51db] bg-indigo-50/10'
                                  : 'border-zinc-200 hover:border-zinc-300 bg-white'
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <div className="flex items-center gap-2">
                                  <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${selectedAddressId === addr.id ? 'border-[#5c51db] bg-[#5c51db]' : 'border-zinc-300'}`}>
                                    {selectedAddressId === addr.id && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="text-xs font-bold text-zinc-900 truncate max-w-[125px]">{addr.recipient_name}</span>
                                    <span className={`inline-block px-1.5 py-0.5 rounded-[4px] text-[9px] font-bold text-white mt-1 w-fit ${
                                      addr.is_default ? 'bg-rose-500' : 'bg-zinc-400'
                                    }`}>
                                      {addr.label || 'Home'}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setAddressForm({
                                        label: addr.label || 'Home',
                                        name: addr.recipient_name,
                                        phone: addr.phone,
                                        street: addr.street_address,
                                        city: addr.city,
                                        state: addr.state,
                                        pinCode: addr.pin_code,
                                        isDefault: addr.is_default
                                      });
                                      setSelectedAddressId(addr.id);
                                      setAddressModalMode('edit');
                                      setIsAddressModalOpen(true);
                                    }}
                                    className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <span className="text-zinc-200 select-none">|</span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAddressDelete(addr.id);
                                    }}
                                    className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <p className="text-xs text-zinc-500 font-normal line-clamp-2 leading-tight">{addr.street_address}, {addr.city}, {addr.state} - {addr.pin_code}</p>
                              <p className="text-[10px] text-zinc-400 font-normal">{addr.phone}</p>
                            </div>
                          ))}
                          {savedAddresses.length === 0 && (
                            <div
                              onClick={() => {
                                setAddressForm({ name: '', phone: '', street: '', city: '', state: '', pinCode: '', isDefault: false });
                                setAddressModalMode('add');
                                setIsAddressModalOpen(true);
                              }}
                              className="col-span-1 sm:col-span-2 p-6 border-2 border-dashed border-[#e2e8f0] hover:border-[#5c51db] rounded-[2rem] text-center cursor-pointer transition-colors bg-[#f8fafc]/50 flex flex-col items-center justify-center gap-2 py-8"
                            >
                              <MapPin className="h-8 w-8 text-[#cbd5e1]" />
                              <span className="text-sm font-bold text-[#5c51db] hover:underline">+ Add Delivery Address</span>
                              <span className="text-xs text-[#94a3b8] font-normal">You have no saved addresses. Click here to add one.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {!user && (
                      <div className="space-y-5 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-normal text-zinc-650">Recipient Name *</label>
                            <input
                              type="text"
                              name="name"
                              required
                              value={formData.name}
                              onChange={handleInputChange}
                              placeholder="John Doe"
                              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700"
                            />
                          </div>
                          
                          <div className="space-y-1.5">
                            <label className="text-sm font-normal text-zinc-650">Phone Number *</label>
                            <input
                              type="tel"
                              name="phone"
                              required
                              value={formData.phone}
                              onChange={handleInputChange}
                              placeholder="+91 98765 43210"
                              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700"
                            />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-sm font-normal text-zinc-650">Street Address *</label>
                          <input
                            type="text"
                            name="street"
                            required
                            value={formData.street}
                            onChange={handleInputChange}
                            placeholder="Apartment, suite, unit, building, street address"
                            className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-normal text-zinc-650">City *</label>
                            <input
                              type="text"
                              name="city"
                              required
                              value={formData.city}
                              onChange={handleInputChange}
                              placeholder="Chennai"
                              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-sm font-normal text-zinc-650">State *</label>
                            <input
                              type="text"
                              name="state"
                              required
                              value={formData.state}
                              onChange={handleInputChange}
                              placeholder="Tamil Nadu"
                              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-sm font-normal text-zinc-650">PIN Code *</label>
                            <input
                              type="text"
                              name="pinCode"
                              required
                              value={formData.pinCode}
                              onChange={handleInputChange}
                              placeholder="600002"
                              className="w-full px-4 py-3 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm sm:text-base font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 focus:border-zinc-300 focus:bg-white transition-all text-zinc-700"
                            />
                          </div>
                        </div>

                        {user && (
                          <div className="flex items-center gap-2 pt-2">
                            <input
                              type="checkbox"
                              id="saveAddressForFuture"
                              checked={saveAddressForFuture}
                              onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                              className="h-4.5 w-4.5 rounded border-zinc-300 text-[#5c51db] focus:ring-[#5c51db] cursor-pointer"
                            />
                            <label htmlFor="saveAddressForFuture" className="text-xs text-zinc-600 font-semibold select-none cursor-pointer">
                              Save this address to my account for future orders
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Payment Selector Card */}
                  <div className="bg-white border border-zinc-150 rounded-[2rem] p-6 sm:p-8 shadow-xs space-y-5" data-aos="fade-up" data-aos-delay="50">
                    <h3 className="text-xl sm:text-2xl font-black text-zinc-950 tracking-tight">2. Payment Method</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Card Selection */}
                      <div 
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          paymentMethod === 'card' ? 'border-[#5c51db] bg-indigo-50/10' : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <CreditCard className={`h-5 w-5 ${paymentMethod === 'card' ? 'text-[#5c51db]' : 'text-zinc-400'}`} />
                          <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'card' ? 'border-[#5c51db] bg-[#5c51db]' : 'border-zinc-300'}`}>
                            {paymentMethod === 'card' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-zinc-900 leading-tight">Card Payment</p>
                          <p className="text-xs text-zinc-500 font-normal mt-1 leading-tight">Visa, Mastercard, AMEX</p>
                        </div>
                      </div>

                      {/* UPI Selection */}
                      <div 
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          paymentMethod === 'upi' ? 'border-[#5c51db] bg-indigo-50/10' : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <Landmark className={`h-5 w-5 ${paymentMethod === 'upi' ? 'text-[#5c51db]' : 'text-zinc-400'}`} />
                          <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'upi' ? 'border-[#5c51db] bg-[#5c51db]' : 'border-zinc-300'}`}>
                            {paymentMethod === 'upi' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-zinc-900 leading-tight">UPI Transfer</p>
                          <p className="text-xs text-zinc-500 font-normal mt-1 leading-tight">Google Pay, PhonePe, Paytm</p>
                        </div>
                      </div>

                      {/* COD Selection */}
                      <div 
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                          paymentMethod === 'cod' ? 'border-[#5c51db] bg-indigo-50/10' : 'border-zinc-200 hover:border-zinc-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <Truck className={`h-5 w-5 ${paymentMethod === 'cod' ? 'text-[#5c51db]' : 'text-zinc-400'}`} />
                          <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${paymentMethod === 'cod' ? 'border-[#5c51db] bg-[#5c51db]' : 'border-zinc-300'}`}>
                            {paymentMethod === 'cod' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-semibold text-zinc-900 leading-tight">Cash on Delivery</p>
                          <p className="text-xs text-zinc-500 font-normal mt-1 leading-tight">Pay securely upon delivery</p>
                        </div>
                      </div>
                    </div>

                    {/* Conditional Input Fields */}
                    {paymentMethod === 'card' && (
                      <div className="p-5 bg-zinc-50/50 border border-zinc-150 rounded-2xl space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">Card Number</label>
                            <input
                              type="text"
                              name="number"
                              value={cardData.number}
                              onChange={handleCardChange}
                              placeholder="4111 2222 3333 4444"
                              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-1 focus:ring-[#5c51db]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">Cardholder Name</label>
                            <input
                              type="text"
                              name="name"
                              value={cardData.name}
                              onChange={handleCardChange}
                              placeholder="Johnathan Doe"
                              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-1 focus:ring-[#5c51db]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">Expiry Date</label>
                            <input
                              type="text"
                              name="expiry"
                              value={cardData.expiry}
                              onChange={handleCardChange}
                              placeholder="MM/YY"
                              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-1 focus:ring-[#5c51db]"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-zinc-500">CVV</label>
                            <input
                              type="password"
                              name="cvv"
                              value={cardData.cvv}
                              onChange={handleCardChange}
                              placeholder="123"
                              maxLength="3"
                              className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-1 focus:ring-[#5c51db]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'upi' && (
                      <div className="p-5 bg-zinc-50/50 border border-zinc-150 rounded-2xl space-y-3 animate-fade-in">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-zinc-500">Enter UPI ID *</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="johndoe@okaxis, john@ybl"
                            className="w-full px-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-normal focus:outline-none focus:ring-1 focus:ring-[#5c51db]"
                          />
                        </div>
                        <p className="text-[10px] text-zinc-400 font-normal leading-normal">
                          * A payment request will be sent to your UPI app. Please approve within 5 minutes.
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'cod' && (
                      <div className="p-5 bg-emerald-50/30 border border-emerald-100 rounded-2xl animate-fade-in flex items-start gap-2.5">
                        <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-emerald-800 font-normal leading-relaxed">
                          You have selected Cash on Delivery. A mock representative will dispatch items quickly. Ensure cash/card is ready at the address during mock delivery.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Order Summary */}
                <div className="xl:col-span-4" data-aos="fade-left" data-aos-delay="100">
                  <div className="bg-white border border-zinc-150 rounded-[2rem] p-5.5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between h-full relative">
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-zinc-950 border-b border-zinc-150 pb-2">Order Items ({cartCount})</h3>
                      
                      {/* Products scroll list */}
                      <div className="max-h-[220px] overflow-y-auto divide-y divide-zinc-100 pr-1">
                        {cart.map((item, idx) => (
                          <div key={idx} className="flex gap-3 py-2.5 items-center">
                            <div 
                              className="relative h-14 w-14 rounded-xl border border-zinc-150 p-1 bg-zinc-50/50 shrink-0"
                              style={{ backgroundColor: item.product.colorHex || '#f4f4f5' }}
                            >
                              {item.product.image ? (
                                <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" />
                              ) : null}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-xs sm:text-sm font-bold text-zinc-900 line-clamp-1">{item.product.name}</h4>
                              <p className="text-[11px] text-zinc-500 mt-0.5">Qty: {item.quantity} / {item.selectedSize}</p>
                            </div>
                            <span className="text-xs sm:text-sm font-extrabold text-zinc-950 shrink-0">{formatINR(item.product.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      <hr className="border-zinc-150" />

                      <div className="space-y-2 text-sm sm:text-base">
                        <div className="flex items-center justify-between text-zinc-650 font-normal">
                          <span>Subtotal</span>
                          <span className="text-zinc-800 font-normal">{formatINR(cartSubtotal)}</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-650 font-normal">
                          <span>Boutique Discount {appliedCoupon ? `(${appliedCoupon})` : ''}</span>
                          <span className="text-rose-600 font-normal">- {formatINR(discountValue)}</span>
                        </div>
                        <div className="flex items-center justify-between text-zinc-650 font-normal">
                          <span>Delivery Fee</span>
                          <span className="text-zinc-800 font-normal">{shippingFee === 0 ? 'FREE' : formatINR(shippingFee)}</span>
                        </div>
                        <div className="border-t border-zinc-200 pt-2 flex items-center justify-between">
                          <span className="text-base sm:text-lg font-black text-zinc-950">Payable Total</span>
                          <span className="text-xl sm:text-2xl font-black text-zinc-950">{formatINR(finalTotal)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <button
                        type="submit"
                        className="w-full py-4 bg-[#5c51db] hover:bg-[#4b41ca] !text-white text-sm sm:text-base font-black tracking-wider uppercase rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
                      >
                        Place Order • {formatINR(finalTotal)}
                      </button>
                      <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-400 font-normal">
                        <ShieldCheck className="h-4 w-4" />
                        100% Safe SSL Cryptographic Checkout
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            )}

          </div>
          <Footer />
        </main>
      </div>

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in text-black">
          <div className="w-full max-w-[500px] bg-white rounded-[2rem] border border-zinc-200 p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all transform scale-100">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-150">
              <h3 className="text-lg font-bold">
                {addressModalMode === 'edit' ? 'Edit Shipping Address' : 'Add New Address'}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddressModalOpen(false);
                }}
                className="p-1.5 rounded-full hover:bg-zinc-100 text-zinc-550 transition-all cursor-pointer flex items-center justify-center"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddressSave} className="space-y-4 text-left text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Address Label / Tag</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Home, Office, Work"
                  value={addressForm.label}
                  onChange={(e) => setAddressForm({ ...addressForm, label: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Recipient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={addressForm.name}
                  onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Mobile Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Complete Shipping Address</label>
                <textarea
                  required
                  rows="2"
                  placeholder="e.g. Apartment, House No., Street Address"
                  value={addressForm.street}
                  onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">City</label>
                  <input
                    type="text"
                    required
                    placeholder="Chennai"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">State</label>
                  <input
                    type="text"
                    required
                    placeholder="Tamil Nadu"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">PIN Code</label>
                  <input
                    type="text"
                    required
                    placeholder="600002"
                    value={addressForm.pinCode}
                    onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-normal focus:outline-none focus:ring-2 focus:ring-[#5c51db]/10 text-black shadow-3xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="modalIsDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="h-4.5 w-4.5 rounded border-zinc-300 text-[#5c51db] focus:ring-[#5c51db] cursor-pointer"
                />
                <label htmlFor="modalIsDefault" className="text-xs text-zinc-650 font-bold select-none cursor-pointer">
                  Set as default shipping address
                </label>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-150 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddressModalOpen(false);
                  }}
                  className="py-2.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-[#5c51db] hover:bg-[#4b41ca] text-white font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CartDrawer />
    </div>
  );
}
