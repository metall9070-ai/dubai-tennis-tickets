'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhyBuy from './WhyBuy';
import StaticSeatingMap, { CATEGORY_COLORS } from './StaticSeatingMap';
import { CartItem } from '@/app/CartContext';
import { fetchEventCategories, isSoldOut } from '@/lib/api';

interface EventSelectionProps {
  event: any;
  initialCategories?: Category[];
  onBack: () => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onPaymentDelivery?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
  onCart?: () => void;
  onHome: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckout: () => void;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
}

interface Category {
  id: string;
  name: string;
  price: number;
  color: string;
  seatsLeft: number;
  isActive?: boolean;
}

// ============================================================================
// DEPRECATED: These constants are NO LONGER USED in state initialization
// Django API is the SINGLE SOURCE OF TRUTH for category prices
// Keep for reference only - DO NOT use for fallback pricing
// ============================================================================
// WTA: Grandstand $300, Prime B $1000, Prime A $2000
const _WTA_REFERENCE_CATEGORIES: Category[] = [
  { id: 'grandstand', name: 'Grandstand', price: 300, color: CATEGORY_COLORS['grandstand'], seatsLeft: 100 },
  { id: 'prime-b', name: 'Prime B', price: 1000, color: CATEGORY_COLORS['prime-b'], seatsLeft: 100 },
  { id: 'prime-a', name: 'Prime A', price: 2000, color: CATEGORY_COLORS['prime-a'], seatsLeft: 100 },
];

// ATP: Grandstand Upper $200, Grandstand Lower $400, Prime B $1500, Prime A $3000
const _ATP_REFERENCE_CATEGORIES: Category[] = [
  { id: 'grandstand-upper', name: 'Grandstand Upper', price: 200, color: CATEGORY_COLORS['grandstand-upper'], seatsLeft: 100 },
  { id: 'grandstand-lower', name: 'Grandstand Lower', price: 400, color: CATEGORY_COLORS['grandstand-lower'], seatsLeft: 100 },
  { id: 'prime-b', name: 'Prime B', price: 1500, color: CATEGORY_COLORS['prime-b'], seatsLeft: 100 },
  { id: 'prime-a', name: 'Prime A', price: 3000, color: CATEGORY_COLORS['prime-a'], seatsLeft: 100 },
];

const EventSelection: React.FC<EventSelectionProps> = ({
  event, initialCategories, onBack, onTournament, onATPTickets, onWTATickets,
  onPaymentDelivery, onPrivacyPolicy, onTermsOfService, onContacts, onAboutUs, onCart, onHome,
  cart, setCart, onCheckout, onFAQ, onSeatingGuide, onVenue
}) => {
  // State for categories - Django API is single source of truth
  // Use SSR data if available
  const [categories, setCategories] = useState<Category[]>(initialCategories || []);
  const [isLoading, setIsLoading] = useState(!initialCategories || initialCategories.length === 0);
  const [apiError, setApiError] = useState<string | null>(null);

  // Fetch categories from Django API - NO fallback to static data
  // Skip CSR fetch if SSR data was provided
  useEffect(() => {
    // Skip if we already have SSR data
    if (initialCategories && initialCategories.length > 0) {
      console.log(`[EventSelection] Using SSR data: ${initialCategories.length} categories`);
      initialCategories.forEach(cat => {
        console.log(`[SSR] category "${cat.name}" price=${cat.price}`);
      });
      return;
    }

    let mounted = true;

    async function loadCategories() {
      if (!event?.id) {
        setIsLoading(false);
        return;
      }

      console.log(`[EventSelection] No SSR data, fetching categories from API`);
      setIsLoading(true);
      setApiError(null);

      try {
        // Fetch categories from Django API (SINGLE SOURCE OF TRUTH)
        const result = await fetchEventCategories(event.id);

        if (!mounted) return;

        // STRICT: Reject if API returns fallback or null data
        if (result.fallback || !result.data || result.data.length === 0) {
          console.error('[EventSelection] Django API required for category prices - no fallback allowed');
          setApiError(result.error || 'Unable to load prices from server');
          setCategories([]);
          return;
        }

        // Map API response to Category format
        const apiCategories = result.data.map((cat, index) => ({
          ...cat,
          color: cat.color || Object.values(CATEGORY_COLORS)[index] || '#1e824c',
        }));

        // Log each category with LIVE FETCH format for network verification
        apiCategories.forEach(cat => {
          console.log(`[LIVE FETCH] /tickets/event category "${cat.name}" price=${cat.price}`);
        });

        setCategories(apiCategories);
        console.log(`[LIVE FETCH] /tickets/event loaded ${apiCategories.length} categories from Django API`);
      } catch (error) {
        console.error('[EventSelection] API fetch failed:', error);
        if (mounted) {
          setApiError('Unable to load prices. Please try again.');
          setCategories([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      mounted = false;
    };
  }, [event?.id, initialCategories]);

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [ticketCount, setTicketCount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const openModal = (cat: Category) => {
    setSelectedCategory(cat);
    setTicketCount(1);
    setIsAdded(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePlus = () => setTicketCount(prev => Math.min(prev + 1, Math.min(4, selectedCategory?.seatsLeft || 4)));
  const handleMinus = () => setTicketCount(prev => Math.max(prev - 1, 1));

  const handleAddToCart = () => {
    if (!selectedCategory) return;
    const cartId = `${event.id}-${selectedCategory.id}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartId);
      if (existing) {
        return prev.map(item => item.id === cartId ? { ...item, quantity: item.quantity + ticketCount } : item);
      }
      return [...prev, {
        id: cartId,
        eventTitle: event.title,
        categoryName: selectedCategory.name,
        price: selectedCategory.price,
        quantity: ticketCount,
        eventDate: event.date,
        eventMonth: event.month,
        eventDay: event.day,
        eventTime: event.time,
        venue: event.venue
      }];
    });

    setIsAdded(true);
  };

  const handleSelectCategory = (categoryId: string) => {
    // categoryId from seating map is a slug like "prime-a", "grandstand"
    // categories from API may have numeric IDs
    // Match by ID first, then by normalized name
    const normalizeToSlug = (name: string) => name.toLowerCase().replace(/\s+/g, '-');
    const cat = categories.find(c =>
      c.id === categoryId ||
      normalizeToSlug(c.name) === categoryId
    );
    // Don't open modal for sold out categories
    if (cat && !isSoldOut(cat.isActive, cat.seatsLeft)) {
      openModal(cat);
    }
  };

  // Compute sold out category slugs for the seating map
  const soldOutCategories = categories
    .filter(cat => isSoldOut(cat.isActive, cat.seatsLeft))
    .map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'));

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar isVisible={true} cartCount={cartTotalItems} onHome={onHome} onTournament={onTournament} onATPTickets={onATPTickets} onWTATickets={onWTATickets} onCart={onCart} onSeatingGuide={onSeatingGuide} onVenue={onVenue} onFAQ={onFAQ} />

      {/* Main Header Section */}
      <div className="pt-20 md:pt-24 pb-6 md:pb-8 bg-white border-b border-[#f5f5f7]">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">

          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-1.5 md:space-x-2 text-[11px] md:text-[13px] font-medium text-[#86868b] mb-5 md:mb-8 overflow-x-auto">
            <button onClick={onHome} className="hover:text-[#1d1d1f] transition-colors font-semibold whitespace-nowrap">Home</button>
            <span className="text-[#d2d2d7]">/</span>
            <button onClick={onBack} className="hover:text-[#1d1d1f] transition-colors font-semibold whitespace-nowrap">Tickets</button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f] font-semibold truncate max-w-[140px] md:max-w-none">{event?.title || 'Tennis Event'}</span>
          </nav>

          {/* Event Description */}
          <div className="bg-[#f5f5f7] p-5 md:p-8 rounded-[20px] md:rounded-[32px] flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 border border-black/5">
            <div>
              <h2 className="text-xl md:text-3xl font-semibold mb-1 tracking-tight text-[#1d1d1f]">{event?.title || "Dubai Duty Free Tennis Championships"}</h2>
              <p className="text-[#1e824c] font-semibold text-[14px] md:text-[17px] mb-3 md:mb-4">{event?.venue || "Dubai Duty Free Tennis Stadium"}</p>
              <div className="flex items-center space-x-4 md:space-x-6 text-[#86868b] text-[13px] md:text-[15px] font-medium">
                <div className="flex items-center">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event?.date} {event?.month}, {event?.day}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event?.time}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-[13px] md:text-[14px] font-semibold text-[#1e824c] hover:bg-[#1e824c]/5 transition-all px-6 md:px-8 py-2 md:py-2.5 bg-white rounded-full border border-[#d2d2d7] shadow-sm whitespace-nowrap active:scale-95 self-start md:self-auto"
            >
              Change Event
            </button>
          </div>
        </div>
      </div>

      {/* Main Selection Grid */}
      <div className="flex-1 max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 border-b border-[#f5f5f7]">

        {/* Left: Venue Map - статичная SVG схема */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="w-full mb-4 md:mb-6 flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold tracking-tight">Select Seating Area</h3>
            <span className="text-[9px] md:text-[11px] font-semibold text-[#86868b] uppercase tracking-[0.1em] md:tracking-[0.2em] bg-[#f5f5f7] px-2 md:px-3 py-1 rounded-full">Live Availability</span>
          </div>

          <div className="bg-[#f8f9fb] rounded-[16px] md:rounded-[24px] p-3 md:p-6 border border-black/5">
            <StaticSeatingMap
              hoveredCategory={hoveredCategory}
              onHoverCategory={setHoveredCategory}
              onSelectCategory={handleSelectCategory}
              eventType={event?.type}
              soldOutCategories={soldOutCategories}
            />
          </div>
        </div>

        {/* Right: Sidebar - категории с bidirectional hover */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 tracking-tight text-[#1d1d1f]">Price Categories</h3>
          <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
            {categories.map((cat) => {
              // Normalize name to slug for map compatibility (e.g., "Prime A" -> "prime-a")
              const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
              const isHovered = hoveredCategory === cat.id || hoveredCategory === catSlug;
              const isOtherHovered = hoveredCategory !== null && !isHovered;
              const categoryIsSoldOut = isSoldOut(cat.isActive, cat.seatsLeft);

              return (
                <div
                  key={cat.id}
                  onMouseEnter={() => !categoryIsSoldOut && setHoveredCategory(catSlug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  onClick={() => !categoryIsSoldOut && openModal(cat)}
                  className={`group bg-white border rounded-[18px] md:rounded-[24px] p-4 md:p-6 transition-all duration-300 transform
                    ${categoryIsSoldOut
                      ? 'cursor-not-allowed opacity-60 border-[#d2d2d7] grayscale'
                      : isHovered
                        ? 'cursor-pointer -translate-y-1 shadow-2xl border-transparent'
                        : isOtherHovered
                          ? 'cursor-pointer opacity-40 border-[#d2d2d7]'
                          : 'cursor-pointer border-[#d2d2d7] hover:shadow-lg hover:border-[#86868b]/30'
                    }
                  `}
                  style={{
                    boxShadow: isHovered && !categoryIsSoldOut ? `0 20px 40px -10px ${cat.color}40` : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5 md:mb-3">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div
                        className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-semibold text-white shadow-md text-base md:text-lg transition-all duration-300`}
                        style={{
                          backgroundColor: categoryIsSoldOut ? '#86868b' : cat.color,
                          filter: isHovered && !categoryIsSoldOut ? 'brightness(1.15) saturate(1.2)' : 'none',
                        }}
                      >
                        {cat.id === 'prime-a' ? 'A' : cat.id === 'prime-b' ? 'B' : 'G'}
                      </div>
                      <div>
                        <h4 className={`font-semibold text-[16px] md:text-[18px] tracking-tight ${categoryIsSoldOut ? 'text-[#86868b]' : 'text-[#1d1d1f]'}`}>{cat.name}</h4>
                        {categoryIsSoldOut ? (
                          <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-[#86868b] uppercase tracking-wide">
                            <span className="w-1.5 h-1.5 bg-[#86868b] rounded-full"></span>
                            Sold Out
                          </span>
                        ) : cat.seatsLeft < 30 ? (
                          <span className="inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-red-500 uppercase tracking-wide animate-pulse">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            Selling Fast
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right">
                      {categoryIsSoldOut ? (
                        <p className="text-[16px] md:text-[18px] font-bold text-[#86868b] uppercase">Sold Out</p>
                      ) : (
                        <p className="text-[18px] md:text-[20px] font-semibold text-[#1d1d1f]">${cat.price}</p>
                      )}
                    </div>
                  </div>
                  {/* Urgency indicator bar - hidden for sold out */}
                  {!categoryIsSoldOut && (
                    <div className="flex items-center gap-2.5 md:gap-3">
                      <div className="flex-1 h-1.5 bg-[#f5f5f7] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${cat.seatsLeft < 20 ? 'bg-red-500' : cat.seatsLeft < 50 ? 'bg-orange-400' : 'bg-[#1e824c]'}`}
                          style={{ width: `${Math.max(5, 100 - (cat.seatsLeft / 2))}%` }}
                        ></div>
                      </div>
                      <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-wide whitespace-nowrap ${cat.seatsLeft < 20 ? 'text-red-500' : cat.seatsLeft < 50 ? 'text-orange-500' : 'text-[#1e824c]'}`}>
                        {cat.seatsLeft} left
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Cart Summary Widget */}
          {cart.length > 0 && (
            <div className="mt-auto p-6 md:p-8 bg-[#1d1d1f] text-white rounded-[24px] md:rounded-[32px] shadow-2xl sticky bottom-4 animate-fadeIn border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.15em] md:tracking-[0.2em] text-white/50">Your Cart</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-[11px] bg-white/10 px-2.5 md:px-3 py-1 rounded-full font-semibold uppercase tracking-wider md:tracking-widest">
                    {cartTotalItems} {cartTotalItems === 1 ? 'Ticket' : 'Tickets'}
                  </span>
                  <button
                    onClick={() => setCart([])}
                    className="p-1.5 md:p-2 bg-white/10 hover:bg-red-500/80 rounded-full transition-all active:scale-90"
                    title="Clear cart"
                  >
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-5 md:mb-6">
                <span className="text-[14px] md:text-[15px] font-normal text-white/80">Subtotal</span>
                <span className="text-2xl md:text-3xl font-semibold">${cartTotalValue.toLocaleString()}</span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full py-3.5 md:py-4 bg-[#1e824c] text-white font-semibold rounded-xl md:rounded-2xl hover:bg-[#166d3e] transition-all transform active:scale-[0.98] text-[15px] md:text-[16px] shadow-lg shadow-[#1e824c]/20"
              >
                Go to Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      <WhyBuy />
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

      {/* Modal Window */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-[440px] max-h-[92vh] rounded-[32px] md:rounded-[42px] shadow-2xl overflow-y-auto animate-modalSlide border border-black/5">
            <div className="p-5 md:p-8">
              {!isAdded ? (
                <>
                  <div className="flex items-center justify-between mb-0.5 md:mb-1">
                    <span className="text-[14px] md:text-[15px] font-semibold text-[#86868b]">Select Quantity</span>
                    <button onClick={closeModal} className="p-1 hover:bg-[#f5f5f7] rounded-full transition-colors">
                      <svg className="w-5 h-5 text-[#d2d2d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h3 className="text-[22px] md:text-[28px] font-bold tracking-tight text-[#111842] mb-1.5 md:mb-4">{selectedCategory.name}</h3>
                    <div className="flex items-baseline space-x-2">
                       <span className="text-[16px] md:text-[19px] font-semibold text-[#1d1d1f]">Price:</span>
                       <span className="text-[22px] md:text-[28px] font-bold text-[#1e824c] tracking-tight">${selectedCategory.price.toLocaleString()}</span>
                       <span className="text-[14px] md:text-[17px] text-[#86868b] font-normal">/ ticket</span>
                    </div>
                  </div>

                  <div className="bg-[#f8f9fb] rounded-[20px] md:rounded-[24px] p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex flex-col">
                        <span className="text-[15px] md:text-[17px] font-bold text-[#111842]">Quantity</span>
                        <span className="text-[10px] md:text-[11px] text-[#86868b] font-medium mt-0.5">Max 4 per order</span>
                      </div>
                      <div className="flex items-center space-x-4 md:space-x-5">
                        <button
                          onClick={handleMinus}
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-white/80 active:scale-90 transition-all shadow-sm border border-[#f0f0f0]"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-[17px] md:text-[19px] font-bold text-[#111842] tabular-nums w-4 text-center">{ticketCount}</span>
                        <button
                          onClick={handlePlus}
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-white/80 active:scale-90 transition-all shadow-sm border border-[#f0f0f0]"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="border-t border-[#e2e8f0] my-3 md:my-4 opacity-50"></div>

                    <div className="flex justify-between items-center mb-4 md:mb-6">
                       <span className="text-[15px] md:text-[17px] font-semibold text-[#86868b]">Remaining Seats</span>
                       <span className="text-[15px] md:text-[17px] font-bold text-[#1e824c]">
                         {selectedCategory.seatsLeft - ticketCount} seats left
                       </span>
                    </div>

                    <div className="flex justify-between items-center">
                       <span className="text-[18px] md:text-[20px] font-bold text-[#111842]">Total</span>
                       <span className="text-[22px] md:text-[28px] font-bold text-[#111842] tracking-tight tabular-nums">${(selectedCategory.price * ticketCount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="px-2 md:px-4 mb-5 md:mb-8">
                    <p className="text-center text-[12px] md:text-[14px] text-[#86868b] leading-relaxed italic font-medium">
                      When ordering two or more tickets, your seats will be next to each other.
                    </p>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-4 md:py-5 bg-[#1e824c] text-white font-bold rounded-[16px] md:rounded-[20px] shadow-lg hover:bg-[#166638] transition-all transform active:scale-[0.98] text-[16px] md:text-[18px]"
                  >
                    Confirm Order
                  </button>
                </>
              ) : (
                <div className="text-center py-4 md:py-6">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-green-50 text-[#1e824c] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
                    <svg className="w-7 h-7 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-[24px] md:text-[28px] font-semibold text-[#1d1d1f] mb-1.5 md:mb-2 tracking-tight">Added to Cart</h3>
                  <p className="text-[14px] md:text-[15px] text-[#86868b] mb-8 md:mb-10 font-medium px-2 md:px-4">Your tickets have been successfully added to your cart.</p>

                  <div className="space-y-3 md:space-y-4 px-1 md:px-2">
                    <button
                      onClick={onCheckout}
                      className="w-full py-4 md:py-5 bg-[#1d1d1f] text-white font-semibold rounded-[20px] md:rounded-[24px] shadow-xl hover:bg-black transition-all transform active:scale-[0.98] text-[16px] md:text-[18px]"
                    >
                      Go to Checkout
                    </button>
                    <button
                      onClick={closeModal}
                      className="w-full py-2.5 text-[#1e824c] font-semibold hover:underline transition-all text-[14px] md:text-[15px]"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalSlide { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-modalSlide { animation: modalSlide 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
    </div>
  );
};

export default EventSelection;
