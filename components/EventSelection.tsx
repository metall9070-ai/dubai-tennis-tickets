'use client';

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from '@/app/components/Footer';
import WhyBuy from './WhyBuy';
import WTASessionInfo from './WTASessionInfo';
import ATPSessionInfo from './ATPSessionInfo';
import StaticSeatingMap, { CATEGORY_COLORS } from './StaticSeatingMap';
import StadiumMap from './StadiumMap';
import EventSEOContent from './EventSEOContent';
import RelatedMatches from './RelatedMatches';
import { CartItem } from '@/app/CartContext';
import { fetchEventCategories, isSoldOut } from '@/lib/api';
import { getSiteConfig } from '@/lib/site-config';
import type { EventSEO } from '@/types/seo';

interface EventSelectionProps {
  event: any;
  initialCategories?: Category[];
  eventSEO?: EventSEO | null;
  onBack: () => void;
  onCart?: () => void;
  onHome: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onCheckout: () => void;
}

interface Category {
  id: string;
  name: string;
  price: number;
  color: string;
  seatsLeft: number;
  isActive?: boolean;
  showOnFrontend?: boolean;
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

// Finalissima category colors (matching stadium map)
const FINALISSIMA_CATEGORY_COLORS: Record<string, string> = {
  'category-1': '#3F8ABF', // Blue
  'category-2': '#137F3A', // Green
  'category-3': '#E3122B', // Red
};

const EventSelection: React.FC<EventSelectionProps> = ({
  event, initialCategories, eventSEO, onBack, onCart, onHome,
  cart, setCart, onCheckout
}) => {
  // Detect if this is a Finalissima event (check env at build time)
  const isFinalissima = process.env.NEXT_PUBLIC_SITE_CODE === 'finalissima';
  const siteConfig = getSiteConfig();
  const hasTopDisclaimer = !!siteConfig.topDisclaimer;

  // Parse team names and venue from event title for Finalissima events
  const getTeamInfo = () => {
    if (!isFinalissima || !event?.title) return null;

    const titlePart = event.title.split('—')[0]?.trim() || event.title;
    const teams = titlePart.includes('vs')
      ? titlePart.split('vs').map((t: string) => t.trim())
      : titlePart.includes(' - ')
      ? titlePart.split(' - ').map((t: string) => t.trim())
      : [];

    if (teams.length !== 2) return null;

    // Map team names to country codes
    const codeMap: Record<string, string> = {
      'Argentina': 'ar', 'Spain': 'es', 'Brazil': 'br', 'Germany': 'de',
      'France': 'fr', 'Italy': 'it', 'Portugal': 'pt', 'Netherlands': 'nl',
      'England': 'gb-eng', 'Uruguay': 'uy', 'Mexico': 'mx', 'Japan': 'jp',
      'Qatar': 'qa', 'Serbia': 'rs', 'Saudi Arabia': 'sa', 'Egypt': 'eg',
      'United States': 'us', 'Belgium': 'be', 'Croatia': 'hr', 'Denmark': 'dk',
      'Morocco': 'ma', 'South Korea': 'kr',
    };

    return {
      team1: teams[0],
      team2: teams[1],
      team1Code: codeMap[teams[0]] || 'un',
      team2Code: codeMap[teams[1]] || 'un',
    };
  };

  const teamInfo = getTeamInfo();

  // Parse venue from eventSEO h1 for Finalissima (fallback if event.venue is empty)
  const getVenueFromSEO = () => {
    if (!isFinalissima || !eventSEO?.h1 || event?.venue) return event?.venue;

    // Format: "Team1 vs Team2 — Date, Venue"
    const lastCommaIndex = eventSEO.h1.lastIndexOf(',');
    if (lastCommaIndex !== -1) {
      return eventSEO.h1.substring(lastCommaIndex + 1).trim();
    }
    return event?.venue;
  };

  const displayVenue = getVenueFromSEO();

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
          color: cat.color || Object.values(CATEGORY_COLORS)[index] || 'var(--color-primary)',
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

  const openModal = (cat: Category) => {
    setSelectedCategory(cat);
    setTicketCount(1);
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

    // GA4: Track add_to_cart event
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'add_to_cart', {
        items: [{
          item_id: event.id,
          item_name: event.title,
          item_category: selectedCategory.name,
          price: selectedCategory.price,
          quantity: ticketCount
        }],
        value: selectedCategory.price * ticketCount,
        currency: 'USD'
      });
    }

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
  };

  // Checkout: add to cart + go to checkout page
  const handleCheckoutClick = () => {
    handleAddToCart();
    onCheckout();
  };

  // Continue Shopping: add to cart + close modal
  const handleContinueShopping = () => {
    handleAddToCart();
    closeModal();
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
    // Don't open modal for sold out / disabled categories
    if (cat && !isSoldOut(cat.isActive, cat.seatsLeft, cat.showOnFrontend)) {
      openModal(cat);
    }
  };

  // Compute sold out / disabled category slugs for the seating map
  // Categories with show_on_frontend=false are included here (visible but disabled)
  const soldOutCategories = categories
    .filter(cat => isSoldOut(cat.isActive, cat.seatsLeft, cat.showOnFrontend))
    .map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'));

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotalValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar isVisible={true} cartCount={cartTotalItems} onHome={onHome} onCart={onCart} />

      {/* Main Header Section */}
      <div className={`${hasTopDisclaimer ? 'pt-[84px] md:pt-[92px]' : 'pt-20 md:pt-24'} pb-6 md:pb-8 bg-white border-b border-[#f5f5f7]`}>
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
            <div className="w-full md:w-auto">
              {/* Title with flags for Finalissima */}
              {isFinalissima && teamInfo ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://flagcdn.com/w80/${teamInfo.team1Code}.png`}
                        alt={teamInfo.team1}
                        className="w-6 h-4 md:w-8 md:h-6 object-cover rounded shadow-sm border border-slate-200"
                      />
                      <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                        {teamInfo.team1}
                      </h2>
                    </div>
                    <span className="text-sm md:text-base font-bold text-slate-400">VS</span>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
                        {teamInfo.team2}
                      </h2>
                      <img
                        src={`https://flagcdn.com/w80/${teamInfo.team2Code}.png`}
                        alt={teamInfo.team2}
                        className="w-6 h-4 md:w-8 md:h-6 object-cover rounded shadow-sm border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <h2 className="text-xl md:text-3xl font-semibold mb-1 tracking-tight text-[#1d1d1f]">
                  {event?.title || "Dubai Duty Free Tennis Championships"}
                </h2>
              )}

              {/* Date, Time, and Venue */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-[#1d1d1f] text-[13px] md:text-[15px] font-medium mt-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{event?.date} {event?.month}, {event?.day}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event?.time}</span>
                </div>
                {displayVenue && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 md:mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="font-semibold">{displayVenue}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 self-start md:self-auto">
              {event?.isSoldOut && (
                <span className="inline-flex items-center px-4 py-1.5 bg-[#86868b] text-white text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-full">
                  Sold out
                </span>
              )}
              <button
                onClick={onBack}
                className="text-[13px] md:text-[14px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5 transition-all px-6 md:px-8 py-2 md:py-2.5 bg-white rounded-full border border-[#d2d2d7] shadow-sm whitespace-nowrap active:scale-95"
              >
                Change Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Selection Grid */}
      <div className="flex-1 max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-12 w-full grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-12 border-b border-[#f5f5f7]">

        {/* Left: Venue Map - статичная SVG схема */}
        <div className="lg:col-span-2 flex flex-col">
          <div className="w-full mb-4 md:mb-6 flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-semibold tracking-tight">Select Seating Area</h3>
            <span className="text-[10px] md:text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] px-2.5 md:px-3 py-1 rounded-full">Live availability</span>
          </div>

          <div className={`${isFinalissima && event?.venue?.includes('Lusail') ? 'bg-white' : 'bg-[#f8f9fb]'} rounded-[16px] md:rounded-[24px] p-3 md:p-6 border border-black/5`}>
            {/* Category Legend - only for Finalissima */}
            {isFinalissima && categories.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6 px-2">
                {[...categories]
                  .sort((a, b) => {
                    const numA = parseInt(a.name.match(/\d+/)?.[0] || '999');
                    const numB = parseInt(b.name.match(/\d+/)?.[0] || '999');
                    return numA - numB;
                  })
                  .map((cat) => {
                    const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
                    const categoryColor = FINALISSIMA_CATEGORY_COLORS[catSlug] || cat.color;
                    const categoryIsSoldOut = isSoldOut(cat.isActive, cat.seatsLeft, cat.showOnFrontend);

                    return (
                      <div
                        key={cat.id}
                        className="flex items-center gap-2 bg-white px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-gray-200 shadow-sm"
                      >
                        <div
                          className="w-3 h-3 md:w-4 md:h-4 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: categoryIsSoldOut ? '#CFCFCF' : categoryColor
                          }}
                        ></div>
                        <span className="text-xs md:text-sm font-medium text-gray-700 whitespace-nowrap">
                          {cat.name}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}

            {isFinalissima ? (
              <StadiumMap
                activeCategory={hoveredCategory}
                onCategoryHover={setHoveredCategory}
                onCategoryClick={handleSelectCategory}
                soldOutCategories={soldOutCategories}
                venue={event?.venue}
              />
            ) : (
              <StaticSeatingMap
                hoveredCategory={hoveredCategory}
                onHoverCategory={setHoveredCategory}
                onSelectCategory={handleSelectCategory}
                eventType={event?.type}
                soldOutCategories={soldOutCategories}
              />
            )}
          </div>
        </div>

        {/* Right: Sidebar - категории с bidirectional hover */}
        <div className="flex flex-col h-full">
          <h3 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 tracking-tight text-[#1d1d1f]">Price Categories</h3>
          <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
            {(isFinalissima
              ? [...categories].sort((a, b) => {
                  // Sort by category number for Finalissima (Category 1, Category 2, Category 3)
                  const numA = parseInt(a.name.match(/\d+/)?.[0] || '999');
                  const numB = parseInt(b.name.match(/\d+/)?.[0] || '999');
                  return numA - numB;
                })
              : categories
            ).map((cat) => {
              // Normalize name to slug for map compatibility (e.g., "Prime A" -> "prime-a")
              const catSlug = cat.name.toLowerCase().replace(/\s+/g, '-');
              const isHovered = hoveredCategory === cat.id || hoveredCategory === catSlug;
              const isOtherHovered = hoveredCategory !== null && !isHovered;
              const categoryIsSoldOut = isSoldOut(cat.isActive, cat.seatsLeft, cat.showOnFrontend);

              return (
                <div
                  key={cat.id}
                  onTouchStart={(e) => {
                    // On mobile, open modal immediately without hover state
                    if (!categoryIsSoldOut) {
                      e.preventDefault();
                      openModal(cat);
                    }
                  }}
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
                    boxShadow: isHovered && !categoryIsSoldOut
                      ? `0 20px 40px -10px ${isFinalissima ? (FINALISSIMA_CATEGORY_COLORS[catSlug] || cat.color) : cat.color}40`
                      : undefined,
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5 md:mb-3">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      {/* Show icon only for non-Finalissima events */}
                      {!isFinalissima && (
                        <div
                          className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center font-semibold text-white shadow-md text-base md:text-lg transition-all duration-300`}
                          style={{
                            backgroundColor: categoryIsSoldOut ? '#86868b' : cat.color,
                            filter: isHovered && !categoryIsSoldOut ? 'brightness(1.15) saturate(1.2)' : 'none',
                          }}
                        >
                          {cat.id === 'prime-a' ? 'A' : cat.id === 'prime-b' ? 'B' : 'G'}
                        </div>
                      )}
                      <div>
                        <h4 className={`font-semibold text-[16px] md:text-[18px] tracking-tight ${categoryIsSoldOut ? 'text-[#86868b]' : 'text-[#1d1d1f]'}`}>{cat.name}</h4>
                        {categoryIsSoldOut ? (
                          <span className={`inline-flex items-center gap-1 text-[9px] md:text-[10px] font-bold text-[#86868b] ${!isFinalissima ? 'uppercase tracking-wide' : ''}`}>
                            <span className="w-1.5 h-1.5 bg-[#86868b] rounded-full"></span>
                            Sold Out
                          </span>
                        ) : cat.seatsLeft < (isFinalissima ? 50 : 30) ? (
                          <span
                            className={`inline-flex items-center gap-1 ${isFinalissima ? 'text-[11px] md:text-[12px]' : 'text-[9px] md:text-[10px]'} font-semibold animate-pulse ${!isFinalissima ? 'uppercase tracking-wide' : ''}`}
                            style={{
                              color: isFinalissima ? FINALISSIMA_CATEGORY_COLORS[catSlug] || cat.color : '#ef4444'
                            }}
                          >
                            <span
                              className={isFinalissima ? 'w-2 h-2 rounded-full' : 'w-1.5 h-1.5 rounded-full'}
                              style={{
                                backgroundColor: isFinalissima ? FINALISSIMA_CATEGORY_COLORS[catSlug] || cat.color : '#ef4444'
                              }}
                            ></span>
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
                          className={`h-full rounded-full transition-all`}
                          style={{
                            width: `${Math.max(5, 100 - (cat.seatsLeft / 2))}%`,
                            backgroundColor: isFinalissima
                              ? FINALISSIMA_CATEGORY_COLORS[catSlug] || cat.color
                              : cat.seatsLeft < 20 ? '#ef4444' : cat.seatsLeft < 50 ? '#fb923c' : 'var(--color-primary)'
                          }}
                        ></div>
                      </div>
                      <span
                        className={`${isFinalissima ? 'text-[12px] md:text-[13px]' : 'text-[10px] md:text-[11px]'} font-semibold whitespace-nowrap ${!isFinalissima ? 'uppercase tracking-wide' : ''}`}
                        style={{
                          color: isFinalissima
                            ? FINALISSIMA_CATEGORY_COLORS[catSlug] || cat.color
                            : cat.seatsLeft < 20 ? '#ef4444' : cat.seatsLeft < 50 ? '#fb923c' : 'var(--color-primary)'
                        }}
                      >
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
                <span className="text-[11px] md:text-[12px] font-medium text-white/50">Your Cart</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] md:text-[11px] bg-white/10 px-2.5 md:px-3 py-1 rounded-full font-medium">
                    {cartTotalItems} {cartTotalItems === 1 ? 'ticket' : 'tickets'}
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
                className="w-full py-3.5 md:py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl md:rounded-2xl hover:bg-[var(--color-primary-hover)] transition-all transform active:scale-[0.98] text-[15px] md:text-[16px] shadow-lg shadow-[var(--color-primary)]/20"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* WTA Session Info - only shown for WTA events */}
      {event?.type === 'WTA' && <WTASessionInfo eventTitle={event?.title || ''} />}

      {/* ATP Session Info - only shown for ATP events */}
      {event?.type === 'ATP' && <ATPSessionInfo eventTitle={event?.title || ''} />}

      {/* Event-Level SEO Content Block (if exists) */}
      {eventSEO && <EventSEOContent eventSEO={eventSEO} />}

      {/* Related Matches - Internal Linking */}
      <RelatedMatches currentSlug={event?.slug || ''} currentEvent={event} />

      <WhyBuy />
      <Footer />

      {/* Modal Window */}
      {isModalOpen && selectedCategory && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-fadeIn">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white w-full max-w-[440px] max-h-[92vh] rounded-[32px] md:rounded-[42px] shadow-2xl overflow-y-auto animate-modalSlide border border-black/5">
            <div className="p-5 md:p-8">
                  <div className="flex items-center justify-between mb-0.5 md:mb-1">
                    <span className="text-[14px] md:text-[15px] font-semibold text-[#86868b]">Select Quantity</span>
                    <button onClick={closeModal} className="p-1 hover:bg-[#f5f5f7] rounded-full transition-colors">
                      <svg className="w-5 h-5 text-[#d2d2d7]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>

                  <div className="mb-3 md:mb-4">
                    <h3 className="text-[22px] md:text-[28px] font-bold tracking-tight text-[#1d1d1f] mb-1.5 md:mb-4">{selectedCategory.name}</h3>
                    <div className="flex items-baseline space-x-1.5">
                       <span className="text-[15px] md:text-[17px] text-[#86868b]">Price:</span>
                       <span className="text-[20px] md:text-[24px] font-bold text-[var(--color-primary)]">${selectedCategory.price.toLocaleString()}</span>
                       <span className="text-[14px] md:text-[16px] text-[#86868b]">/ ticket</span>
                    </div>
                  </div>

                  <div className="bg-[#f8f9fb] rounded-[20px] md:rounded-[24px] p-4 md:p-6 mb-4 md:mb-6">
                    <div className="flex items-center justify-between mb-3 md:mb-4">
                      <div className="flex flex-col">
                        <span className="text-[15px] md:text-[17px] font-bold text-[#1d1d1f]">Quantity</span>
                        <span className="text-[10px] md:text-[11px] text-[#86868b] font-medium mt-0.5">Max 4 per order</span>
                      </div>
                      <div className="flex items-center space-x-4 md:space-x-5">
                        <button
                          onClick={handleMinus}
                          className="w-9 h-9 md:w-10 md:h-10 flex items-center justify-center bg-white rounded-full hover:bg-white/80 active:scale-90 transition-all shadow-sm border border-[#f0f0f0]"
                        >
                          <svg className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                        </button>
                        <span className="text-[17px] md:text-[19px] font-bold text-[#1d1d1f] tabular-nums w-4 text-center">{ticketCount}</span>
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
                       <span className="text-[15px] md:text-[17px] font-bold text-[var(--color-primary)]">
                         {selectedCategory.seatsLeft - ticketCount} seats left
                       </span>
                    </div>

                    <div className="flex justify-between items-center">
                       <span className="text-[18px] md:text-[20px] font-bold text-[#1d1d1f]">Total</span>
                       <span className="text-[22px] md:text-[28px] font-bold text-[#1d1d1f] tracking-tight tabular-nums">${(selectedCategory.price * ticketCount).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="px-2 md:px-4 mb-5 md:mb-8">
                    <p className="text-center text-[12px] md:text-[14px] text-[#86868b] leading-relaxed italic font-medium">
                      When ordering two or more tickets, your seats will be next to each other.
                    </p>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <button
                      onClick={handleCheckoutClick}
                      className="w-full py-4 md:py-5 bg-[var(--color-primary)] text-white font-bold rounded-[16px] md:rounded-[20px] shadow-lg hover:bg-[var(--color-primary-hover)] transition-all transform active:scale-[0.98] text-[16px] md:text-[18px]"
                    >
                      Checkout
                    </button>
                    <button
                      onClick={handleContinueShopping}
                      className="w-full py-2.5 text-[var(--color-primary)] font-semibold hover:underline transition-all text-[14px] md:text-[15px]"
                    >
                      Continue Shopping
                    </button>
                  </div>
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
