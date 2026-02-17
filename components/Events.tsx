'use client';

import React, { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/api';

// Re-export Event type from lib/types.ts for backward compatibility
// This breaks the circular dependency: api.ts <-> Events.tsx
export type { Event } from '@/lib/types';
import type { Event } from '@/lib/types';

// ============================================================================
// WARNING: THIS STATIC DATA IS FOR TYPE REFERENCE ONLY
// DO NOT USE FOR PRICES - Django API is the SINGLE SOURCE OF TRUTH
// lib/api.ts does NOT import this data anymore
// If you see $150 anywhere, it's a BUG - report immediately
// ============================================================================
// WTA min_price = $300 (Grandstand), ATP min_price = $200 (Grandstand Upper)
// Slugs are now the primary identifier - IDs are kept for backward compatibility
export const eventsData: Event[] = [
  { id: 1, slug: 'womens-day-1-feb-15', type: 'WTA', month: 'FEB', date: '15', day: 'Sun', time: '11:00 AM', title: "Women's Day 1", minPrice: 300, isSoldOut: false },
  { id: 2, slug: 'womens-day-2-feb-16', type: 'WTA', month: 'FEB', date: '16', day: 'Mon', time: '11:00 AM', title: "Women's Day 2", minPrice: 300, isSoldOut: false },
  { id: 3, slug: 'womens-day-3-feb-17', type: 'WTA', month: 'FEB', date: '17', day: 'Tue', time: '11:00 AM', title: "Women's Day 3", minPrice: 300, isSoldOut: false },
  { id: 4, slug: 'womens-day-4-feb-18', type: 'WTA', month: 'FEB', date: '18', day: 'Wed', time: '11:00 AM', title: "Women's Day 4", minPrice: 300, isSoldOut: false },
  { id: 5, slug: 'womens-quarter-finals-feb-19', type: 'WTA', month: 'FEB', date: '19', day: 'Thu', time: '2:00 PM', title: "Women's Quarter-Finals", minPrice: 300, isSoldOut: false },
  { id: 6, slug: 'womens-semi-finals-feb-20', type: 'WTA', month: 'FEB', date: '20', day: 'Fri', time: '1:00 PM', title: "Women's Semi-Finals", minPrice: 300, isSoldOut: false },
  { id: 7, slug: 'womens-finals-feb-21', type: 'WTA', month: 'FEB', date: '21', day: 'Sat', time: '4:30 PM', title: "Women's Finals", minPrice: 300, isSoldOut: false },
  { id: 8, slug: 'mens-day-1-feb-23', type: 'ATP', month: 'FEB', date: '23', day: 'Mon', time: '2:00 PM', title: "Men's Day 1", minPrice: 200, isSoldOut: false },
  { id: 9, slug: 'mens-day-2-feb-24', type: 'ATP', month: 'FEB', date: '24', day: 'Tue', time: '2:00 PM', title: "Men's Day 2", minPrice: 200, isSoldOut: false },
  { id: 10, slug: 'mens-day-3-feb-25', type: 'ATP', month: 'FEB', date: '25', day: 'Wed', time: '2:00 PM', title: "Men's Day 3", minPrice: 200, isSoldOut: false },
  { id: 11, slug: 'mens-quarter-finals-feb-26', type: 'ATP', month: 'FEB', date: '26', day: 'Thu', time: '2:00 PM', title: "Men's Quarter-Finals", minPrice: 200, isSoldOut: false },
  { id: 12, slug: 'mens-semi-finals-feb-27', type: 'ATP', month: 'FEB', date: '27', day: 'Fri', time: '1:30 PM', title: "Men's Semi-Finals", minPrice: 200, isSoldOut: false },
  { id: 13, slug: 'mens-finals-feb-28', type: 'ATP', month: 'FEB', date: '28', day: 'Sat', time: '4:30 PM', title: "Men's Finals", minPrice: 200, isSoldOut: false },
];

interface EventsProps {
  onSelectEvent: (event: any) => void;
  initialEvents?: Event[];
}

const Events: React.FC<EventsProps> = ({ onSelectEvent, initialEvents }) => {
  // Use initialEvents from SSR if available, otherwise empty array
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  // Skip loading state if we have SSR data
  const [isLoading, setIsLoading] = useState(!initialEvents || initialEvents.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip CSR fetch if we already have SSR data
    if (initialEvents && initialEvents.length > 0) {
      console.log(`[SSR] Using ${initialEvents.length} events from server-side render`);
      return;
    }

    let mounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        const result = await fetchEvents();

        if (!mounted) return;

        // STRICT: Reject fallback data - only use Django API prices
        if (result.fallback) {
          console.error('[Events] REJECTED fallback data - Django API required for prices');
          setError('Unable to load prices');
          setEvents([]);
          return;
        }

        if (result.data) {
          setEvents(result.data);
          // Log each event with LIVE FETCH format for network verification
          result.data.forEach(event => {
            console.log(`[LIVE FETCH] Homepage event "${event.title}" min_price=${event.minPrice}`);
          });
          console.log(`[LIVE FETCH] Homepage loaded ${result.data.length} events from Django API`);
        }
      } catch (err) {
        console.error('[Events] Failed to load events:', err);
        if (mounted) {
          setError('Unable to load prices');
          setEvents([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, [initialEvents]);

  const wtaEvents = events.filter(e => e.type === 'WTA');
  const atpEvents = events.filter(e => e.type === 'ATP');
  const isTennisLayout = wtaEvents.length > 0 || atpEvents.length > 0;

  // Shared header for all states
  const header = (
    <div className="mb-8 md:mb-20 text-center md:text-left">
      <h2 className="text-[32px] md:text-[56px] font-semibold tracking-tight mb-3 md:mb-4 leading-tight">Match Schedule</h2>
      <p className="text-[17px] md:text-xl text-[#86868b] font-normal max-w-2xl tracking-[-0.01em]">Discover the matches and get ready for an unforgettable experience.</p>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <section id="tickets" className="py-12 md:py-24 bg-[#f5f5f7] text-[#1d1d1f]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          {header}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-8 text-center text-[#86868b]">
            <div className="animate-pulse">Loading sessions...</div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="tickets" className="py-12 md:py-24 bg-[#f5f5f7] text-[#1d1d1f]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          {header}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-8 text-center text-red-500">
            {error}. Please refresh the page.
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="tickets" className="py-12 md:py-24 bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
        {header}

        {isTennisLayout ? (
          <>
            <div className="mb-10 md:mb-24">
              <div className="flex items-center justify-between mb-5 md:mb-8 px-2 md:px-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">WTA 1000 Tournament</h3>
                <span className="text-[12px] md:text-sm font-medium text-[var(--color-primary)]">Women&apos;s Week</span>
              </div>
              <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
                {wtaEvents.length === 0 ? (
                  <div className="p-8 text-center text-[#86868b]">No sessions available.</div>
                ) : (
                  wtaEvents.map((event, index, arr) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      isLast={index === arr.length - 1}
                      onClick={() => onSelectEvent(event)}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="mb-0">
              <div className="flex items-center justify-between mb-5 md:mb-8 px-2 md:px-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">ATP 500 Tournament</h3>
                <span className="text-[12px] md:text-sm font-medium text-[var(--color-primary)]">Men&apos;s Week</span>
              </div>
              <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
                {atpEvents.length === 0 ? (
                  <div className="p-8 text-center text-[#86868b]">No sessions available.</div>
                ) : (
                  atpEvents.map((event, index, arr) => (
                    <EventRow
                      key={event.id}
                      event={event}
                      isLast={index === arr.length - 1}
                      onClick={() => onSelectEvent(event)}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="mb-0">
            <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
              {events.length === 0 ? (
                <div className="p-8 text-center text-[#86868b]">No sessions available yet. Check back soon.</div>
              ) : (
                events.map((event, index, arr) => (
                  <EventRow
                    key={event.id}
                    event={event}
                    isLast={index === arr.length - 1}
                    onClick={() => onSelectEvent(event)}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export const EventRow: React.FC<{ event: Event; isLast: boolean; onClick: () => void }> = ({ event, isLast, onClick }) => {
  // Check if price is valid (from Django API)
  const hasValidPrice = event.minPrice != null && event.minPrice > 0;

  const handleClick = () => {
    // GA4: Track view_item event
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'view_item', {
        items: [{
          item_id: event.id,
          item_name: event.title,
          item_category: 'tennis_event',
          item_variant: event.type
        }]
      });
    }
    onClick();
  };

  // Determine session type based on time
  const getSessionType = (time: string): { label: string; icon: string; bgColor: string; textColor: string } => {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM && hour !== 12 ? hour + 12 : hour;

    if (hour24 >= 16) {
      return { label: 'Evening', icon: '🌙', bgColor: 'bg-[#1d1d1f]', textColor: 'text-white' };
    } else if (hour24 >= 13) {
      return { label: 'Afternoon', icon: '☀️', bgColor: 'bg-[#f59e0b]/10', textColor: 'text-[#d97706]' };
    } else {
      return { label: 'Morning', icon: '🌅', bgColor: 'bg-[#3b82f6]/10', textColor: 'text-[#2563eb]' };
    }
  };

  const session = getSessionType(event.time);

  return (
    <div
      id={`event-${event.id}`}
      onClick={handleClick}
      className={`group cursor-pointer relative flex items-center justify-between p-4 sm:p-5 md:p-8 transition-all duration-300 hover:bg-[#f5f5f7]/50 active:bg-[#f5f5f7]/70 ${!isLast ? 'border-b border-[#f5f5f7]' : ''}`}
    >
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-12">
        <div className="flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-[48px] sm:h-[56px] md:h-[80px] bg-[#f5f5f7] rounded-xl md:rounded-2xl group-hover:bg-white transition-colors duration-300">
          <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold text-[#86868b] uppercase tracking-widest leading-none mb-0.5 sm:mb-1">{event.month}</span>
          <span className="text-lg sm:text-xl md:text-3xl font-semibold tracking-tight leading-none">{event.date}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 mb-0.5 sm:mb-1">
             <span className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#1d1d1f]">{event.day}</span>
             <span className="w-1 h-1 rounded-full bg-[#d2d2d7]"></span>
             <span className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#86868b]">{event.time}</span>
             <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold ${session.bgColor} ${session.textColor}`}>
               <span className="text-[10px]">{session.icon}</span>
               {session.label}
             </span>
          </div>
          <h4 className="text-[15px] sm:text-base md:text-2xl font-semibold tracking-tight text-[#1d1d1f] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-snug">
            {event.title}
          </h4>
          {event.venue && (
            <p className="hidden md:block text-[14px] text-[#86868b] mt-0.5">{event.venue}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
        {event.isSoldOut ? (
          <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 sm:px-4 md:px-5 py-2.5 sm:py-2 md:py-2.5 bg-[#86868b] text-white text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-lg">
            Sold out
          </span>
        ) : (
          <>
            <div className="flex flex-col items-end">
              {hasValidPrice ? (
                <>
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-[#86868b] uppercase tracking-wide sm:tracking-widest">From</span>
                  <span className="text-[14px] sm:text-[15px] md:text-[17px] font-semibold text-[#1d1d1f]">${event.minPrice}</span>
                </>
              ) : (
                <span className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-[#86868b]">Price unavailable</span>
              )}
            </div>
            <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 sm:px-4 md:px-4 py-2.5 sm:py-2 md:py-2 bg-[var(--color-primary)] text-white text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-lg group-hover:scale-105 transition-transform">
              Buy tickets
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Events;