'use client';

import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { CartItem } from '@/app/CartContext';

interface CheckoutProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onBack: () => void;
  onHome: () => void;
  onTournament?: () => void;
  onATPTickets?: () => void;
  onWTATickets?: () => void;
  onPaymentDelivery?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
  onCart?: () => void;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({
  cart, setCart, onBack, onHome, onTournament, onATPTickets, onWTATickets,
  onPaymentDelivery, onPrivacyPolicy, onTermsOfService, onContacts, onAboutUs, onCart,
  onFAQ, onSeatingGuide, onVenue
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: ''
  });
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    // Validation check
    if (!formData.name) {
      alert('Please enter your name');
      return;
    }
    if (!formData.email) {
      alert('Please enter your email');
      return;
    }
    if (!formData.phone || formData.phone.length < 8) {
      alert('Please enter a valid phone number (at least 8 digits including country code)');
      return;
    }
    if (!agree) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

    if (!API_BASE_URL) {
      alert('Configuration error: API URL not set');
      setIsLoading(false);
      return;
    }

    try {
      // Build items array from cart
      const items = cart.map(item => ({
        event_id: parseInt(item.id.split('-')[0]),
        category_id: parseInt(item.id.split('-')[1]),
        quantity: item.quantity,
      }));

      // Build E.164 phone: add + prefix (user only enters digits)
      const cleanPhone = '+' + formData.phone.replace(/[^\d]/g, '');

      console.log('[Checkout] Creating order with items:', items);
      console.log('[Checkout] Phone (cleaned):', cleanPhone);

      // Create single order with all items
      const orderResponse = await fetch(`${API_BASE_URL}/api/orders/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: cleanPhone,
          comments: formData.comments,
          items: items,
        }),
      });

      const orderData = await orderResponse.json();
      console.log('[Checkout] Order API response:', orderResponse.status, orderData);

      if (!orderResponse.ok || !orderData.order?.id) {
        // Extract detailed error message from validation response
        let errorMessage = 'Failed to create order';

        if (orderData.details) {
          // Check for field-specific errors
          const fieldErrors = [];
          for (const [field, errors] of Object.entries(orderData.details)) {
            if (Array.isArray(errors)) {
              fieldErrors.push(...errors);
            } else if (typeof errors === 'string') {
              fieldErrors.push(errors);
            }
          }
          if (fieldErrors.length > 0) {
            errorMessage = fieldErrors.join('. ');
          }
        } else if (orderData.message && orderData.message !== 'Validation error') {
          errorMessage = orderData.message;
        } else if (orderData.error) {
          errorMessage = orderData.error;
        }

        throw new Error(errorMessage);
      }

      // Create Stripe checkout session
      const stripeResponse = await fetch(`${API_BASE_URL}/api/stripe/create-checkout-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order_id: orderData.order.id,
        }),
      });

      const stripeData = await stripeResponse.json();

      if (!stripeResponse.ok) {
        throw new Error(stripeData.error || 'Payment failed');
      }

      if (stripeData.checkout_url) {
        // Clear cart before redirect
        setCart([]);
        // Redirect to Stripe Checkout
        window.location.href = stripeData.checkout_url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const totalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex flex-col font-sans">
      <Navbar
        isVisible={true}
        cartCount={cartTotalItems}
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
        onPaymentDelivery={onPaymentDelivery}
        onCart={onCart}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
        onFAQ={onFAQ}
      />

      <main className="flex-1 pt-20 md:pt-24 pb-12 md:pb-20">
        <div className="max-w-[900px] mx-auto px-6">
          
          <nav className="flex items-center space-x-2 text-[13px] font-semibold text-[#86868b] mb-6 md:mb-8">
            <button onClick={onHome} className="hover:text-[#1d1d1f] transition-colors">Home</button>
            <span className="text-[#d2d2d7]">/</span>
            <button onClick={onBack} className="hover:text-[#1d1d1f] transition-colors">Cart</button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f]">Order</span>
          </nav>

          {/* Progress Steps */}
          <div className="mb-8 md:mb-12">
            <div className="flex items-center justify-between max-w-md mx-auto md:mx-0">
              {/* Step 1: Cart */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#1e824c] text-white flex items-center justify-center font-semibold text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[11px] font-semibold text-[#1e824c] mt-2">Cart</span>
              </div>

              {/* Connector 1 */}
              <div className="flex-1 h-0.5 bg-[#1e824c] mx-2"></div>

              {/* Step 2: Details */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#1e824c] text-white flex items-center justify-center font-semibold text-sm">
                  2
                </div>
                <span className="text-[11px] font-semibold text-[#1e824c] mt-2">Details</span>
              </div>

              {/* Connector 2 */}
              <div className="flex-1 h-0.5 bg-[#d2d2d7] mx-2"></div>

              {/* Step 3: Payment */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] text-[#86868b] flex items-center justify-center font-semibold text-sm border-2 border-[#d2d2d7]">
                  3
                </div>
                <span className="text-[11px] font-semibold text-[#86868b] mt-2">Payment</span>
              </div>
            </div>
          </div>

          <h1 className="text-[36px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-8 md:mb-12 leading-tight">
            Complete Your <span className="text-[#1e824c]">Order</span>
          </h1>

          <div className="space-y-10 md:space-y-12">
            
            <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-black/5">
              <h2 className="text-2xl font-semibold mb-6 md:mb-8 tracking-tight border-b border-[#f5f5f7] pb-6">Order Summary</h2>
              
              {cart.length === 0 ? (
                <div className="text-center py-10 md:py-12">
                  <p className="text-lg text-[#86868b] mb-4 md:mb-6">Your cart is empty.</p>
                  <button onClick={onHome} className="text-[#1e824c] font-semibold hover:underline">Return to Events</button>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <div key={item.id} className={`mb-8 md:mb-10 last:mb-0 ${idx !== cart.length - 1 ? 'pb-8 md:pb-10 border-b border-[#f5f5f7]' : ''}`}>
                    <div className="flex flex-col space-y-8">
                      
                      {/* Header Row: Event Name and Location */}
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex-1">
                          <p className="text-[14px] md:text-[16px] font-bold text-[#1e824c] uppercase tracking-[0.1em] mb-1.5">{item.eventTitle}</p>
                          <div className="flex items-center space-x-3">
                            <span className="text-[16px] md:text-[18px] font-semibold text-[#1d1d1f]">{item.eventDate} {item.eventMonth} {item.eventDay}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#d2d2d7]"></span>
                            <span className="text-[16px] md:text-[18px] font-semibold text-[#86868b]">{item.eventTime}</span>
                          </div>
                        </div>

                        <div className="bg-[#f5f5f7] p-4 md:p-5 rounded-2xl flex-shrink-0 md:max-w-[400px]">
                          <div className="flex items-start space-x-3">
                            <svg className="w-5 h-5 text-[#1e824c] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            <div>
                              <p className="text-[14px] font-semibold text-[#1d1d1f]">{item.venue}</p>
                              <p className="text-[13px] text-[#86868b] font-normal leading-relaxed">Dubai Duty Free Tennis Stadium, Al Garhoud, Dubai, UAE</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detail Row: Category (Left) and Quantity + Remove Icon (Right) */}
                      <div className="flex items-center justify-between border-t border-[#f5f5f7] pt-8">
                        <div className="text-left">
                          <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.12em] mb-1.5">Category / Sector</p>
                          <p className="text-xl md:text-2xl font-semibold text-[#1d1d1f] tracking-tight">{item.categoryName}</p>
                        </div>

                        <div className="flex items-center space-x-4 md:space-x-6">
                          <div className="text-right">
                            <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-[0.12em] mb-1.5">Quantity</p>
                            <p className="text-xl md:text-2xl font-semibold text-[#1d1d1f] tabular-nums">{item.quantity} {item.quantity > 1 ? 'tickets' : 'ticket'}</p>
                          </div>
                          
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-[#fff1f1] text-[#ff4d4f] rounded-xl md:rounded-2xl hover:bg-[#ffe4e4] transition-all transform active:scale-95 border border-[#ffe4e4] shadow-sm group"
                            title="Remove from cart"
                          >
                            <svg className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>

                    <div className="flex flex-col space-y-3 md:flex-row md:space-y-0 md:justify-between md:items-baseline mt-8 pt-6 border-t border-[#f5f5f7]">
                       <div className="flex items-baseline space-x-2">
                          <span className="text-[14px] text-[#86868b]">Price per ticket:</span>
                          <span className="text-[16px] font-semibold text-[#1d1d1f]">${item.price.toLocaleString()}</span>
                       </div>
                       <div className="flex items-baseline space-x-2">
                          <span className="text-[14px] text-[#86868b]">Total for this day:</span>
                          <span className="text-[18px] font-bold text-[#1e824c] tabular-nums">${(item.price * item.quantity).toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </section>

            {cart.length > 0 && (
              <>
                <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-black/5">
                  <h2 className="text-2xl font-semibold mb-6 md:mb-8 tracking-tight">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1" htmlFor="name">Full Name</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        className="bg-[#f5f5f7] border-0 rounded-[18px] px-6 py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1" htmlFor="email">Email Address</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="example@mail.com"
                        className="bg-[#f5f5f7] border-0 rounded-[18px] px-6 py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1" htmlFor="phone">Phone Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-4 bg-[#e8e8ed] text-[#1d1d1f] font-semibold rounded-l-[18px] border-r border-[#d2d2d7]">+</span>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={(e) => {
                            // Only allow digits
                            const value = e.target.value.replace(/[^\d]/g, '');
                            setFormData(prev => ({ ...prev, phone: value }));
                          }}
                          placeholder="971501234567"
                          className="flex-1 bg-[#f5f5f7] border-0 rounded-r-[18px] px-6 py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-[#86868b] mt-1.5 ml-1">Enter country code and number (e.g., 971501234567 for UAE)</p>
                    </div>
                    <div className="flex flex-col md:col-span-2">
                      <label className="text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-2 ml-1" htmlFor="comments">Order Comments</label>
                      <textarea 
                        id="comments" 
                        name="comments"
                        rows={4}
                        value={formData.comments}
                        onChange={handleInputChange}
                        placeholder="Any special requests or instructions?"
                        className="bg-[#f5f5f7] border-0 rounded-[18px] px-6 py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-black/5">
                  <h2 className="text-2xl font-semibold mb-6 md:mb-8 tracking-tight">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="block p-4 md:p-6 rounded-[20px] md:rounded-[24px] border-2 border-[#1e824c] bg-[#1e824c]/5 transition-all">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 w-5 h-5 flex items-center justify-center">
                          <div className="w-5 h-5 rounded-full border-2 border-[#1e824c] flex items-center justify-center">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#1e824c]"></div>
                          </div>
                        </div>
                        <div>
                          <span className="text-lg font-semibold block mb-2">Pay by card</span>
                          <p className="text-[13px] text-[#86868b] leading-relaxed font-normal italic tracking-[-0.01em]">
                            Card payment processing occurs on a secure page with international certification. This means your data is confidential, and card details are not transmitted online.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-[24px] md:rounded-[32px] p-6 md:p-10 shadow-sm border border-black/5">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 pb-6 md:pb-8 border-b border-[#f5f5f7]">
                     <div className="mb-4 md:mb-0">
                        <span className="text-xl font-semibold text-[#1d1d1f]">Total Amount</span>
                        <p className="text-[14px] text-[#86868b] font-normal">Including all taxes and fees</p>
                     </div>
                     <div className="flex items-baseline space-x-2">
                        <span className="text-[18px] md:text-xl font-semibold text-[#86868b] uppercase">USD</span>
                        <span className="text-[32px] md:text-[36px] font-semibold text-[#1d1d1f] tracking-tight leading-none tabular-nums">${totalValue.toLocaleString()}</span>
                     </div>
                  </div>

                  <div className="mb-8 md:mb-10">
                    <label className="flex items-start space-x-4 cursor-pointer group">
                      <div className="relative flex items-center h-5">
                        <input 
                          type="checkbox" 
                          className="w-6 h-6 rounded-lg text-[#1e824c] border-[#d2d2d7] focus:ring-[#1e824c] transition-all cursor-pointer"
                          checked={agree}
                          onChange={(e) => setAgree(e.target.checked)}
                        />
                      </div>
                      <span className="text-[14px] font-medium text-[#86868b] leading-tight select-none group-hover:text-[#1d1d1f] transition-colors">
                        I have read and agree to the <button onClick={(e) => { e.preventDefault(); onPrivacyPolicy?.(); }} className="text-[#1e824c] underline hover:text-[#166d3e]">privacy policy</button> and <button onClick={(e) => { e.preventDefault(); onTermsOfService?.(); }} className="text-[#1e824c] underline hover:text-[#166d3e]">Terms of Service</button>.
                      </span>
                    </label>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={!agree || !formData.name || !formData.email || formData.phone.length < 8 || isLoading}
                    className={`w-full py-4 md:py-5 rounded-[20px] md:rounded-[24px] text-lg md:text-xl font-semibold transition-all transform active:scale-[0.98] shadow-2xl flex items-center justify-center space-x-3
                      ${agree && formData.name && formData.email && formData.phone.length >= 8 && !isLoading
                        ? 'bg-[#1e824c] text-white hover:bg-[#166d3e] shadow-[#1e824c]/30'
                        : 'bg-[#ebebed] text-[#86868b] cursor-not-allowed shadow-none'}
                    `}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Go to Checkout</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </>
                    )}
                  </button>
                </section>
              </>
            )}
          </div>
        </div>
      </main>
      <Footer
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
        onFAQ={onFAQ}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
      />
    </div>
  );
};

export default Checkout;