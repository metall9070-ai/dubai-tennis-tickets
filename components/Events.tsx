'use client';

import React, { useState, useEffect } from 'react';
import { fetchEvents } from '@/lib/api';
import { getSiteCode, getSiteConfig } from '@/lib/site-config';
import { logger } from '@/lib/logger';
import { FootballEventCard } from './FootballEventCard';
import { Moon, Sun, Sunrise } from 'lucide-react';

export type { Event } from '@/lib/types';
import type { Event } from '@/lib/types';

interface EventsProps {
  onSelectEvent: (event: Event) => void;
  initialEvents?: Event[];
  title?: string;
  subtitle?: string;
}

const Events: React.FC<EventsProps> = ({ onSelectEvent, initialEvents, title, subtitle }) => {
  // Use initialEvents from SSR if available, otherwise empty array
  const [events, setEvents] = useState<Event[]>(initialEvents || []);
  // Skip loading state if we have SSR data
  const [isLoading, setIsLoading] = useState(!initialEvents || initialEvents.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip CSR fetch if we already have SSR data
    if (initialEvents && initialEvents.length > 0) {
      logger.log(`[SSR] Using ${initialEvents.length} events from server-side render`);
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
          logger.error('[Events] REJECTED fallback data - Django API required for prices');
          setError('Unable to load prices');
          setEvents([]);
          return;
        }

        if (result.data) {
          setEvents(result.data);
          // Log each event with LIVE FETCH format for network verification
          result.data.forEach(event => {
            logger.log(`[LIVE FETCH] Homepage event "${event.title}" min_price=${event.minPrice}`);
          });
          logger.log(`[LIVE FETCH] Homepage loaded ${result.data.length} events from Django API`);
        }
      } catch (err) {
        logger.error('[Events] Failed to load events:', err);
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

  // Detect if we're on Finalissima site
  const siteCode = getSiteCode();
  const isFinalissimaLayout = siteCode === 'finalissima' && !isTennisLayout;

  // Shared header for all states
  const header = (
    <div className="mb-8 md:mb-20 text-center md:text-left">
      <h2 className="text-[32px] md:text-[56px] font-semibold tracking-tight mb-3 md:mb-4 leading-tight">{title ?? 'Match Schedule'}</h2>
      <p className="text-[17px] md:text-xl text-[#6e6e73] font-normal max-w-2xl tracking-[-0.01em]">{subtitle ?? 'Discover the matches and get ready for an unforgettable experience.'}</p>
    </div>
  );

  // Loading state
  if (isLoading) {
    return (
      <section id="tickets" className="pt-6 pb-12 md:pt-10 md:pb-24 bg-white text-[#1d1d1f]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          {header}
          <div className="bg-white rounded-[24px] md:rounded-[32px] p-8 text-center text-[#6e6e73]">
            <div className="animate-pulse">Loading sessions...</div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="tickets" className="pt-6 pb-12 md:pt-10 md:pb-24 bg-white text-[#1d1d1f]">
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
    <section id="tickets" aria-label="Event schedule" className="pt-6 pb-12 md:pt-10 md:pb-24 bg-white text-[#1d1d1f]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
        {header}

        {isTennisLayout ? (
          <>
            <div className="mb-10 md:mb-24" role="region" aria-label="WTA Tournament">
              <div className="flex items-center justify-between mb-5 md:mb-8 px-2 md:px-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">WTA 1000 Tournament</h3>
                <span className="text-[12px] md:text-sm font-medium text-[var(--color-primary)]">Women&apos;s Week</span>
              </div>
              <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5" role="list" aria-label="WTA events">
                {wtaEvents.length === 0 ? (
                  <div className="p-8 text-center text-[#6e6e73]">No sessions available.</div>
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

            <div className="mb-0" role="region" aria-label="ATP Tournament">
              <div className="flex items-center justify-between mb-5 md:mb-8 px-2 md:px-4">
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight">ATP 500 Tournament</h3>
                <span className="text-[12px] md:text-sm font-medium text-[var(--color-primary)]">Men&apos;s Week</span>
              </div>
              <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5" role="list" aria-label="ATP events">
                {atpEvents.length === 0 ? (
                  <div className="p-8 text-center text-[#6e6e73]">No sessions available.</div>
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
        ) : isFinalissimaLayout ? (
          // NEW FOOTBALL CARD DESIGN FOR FINALISSIMA
          <div className="mb-0">
            {events.length === 0 ? (
              <div className="bg-white rounded-[24px] md:rounded-[32px] p-8 text-center text-[#6e6e73]">
                No sessions available yet. Check back soon.
              </div>
            ) : (
              <div className="flex flex-col gap-6" role="list" aria-label="Match schedule">
                {events
                  .sort((a, b) => {
                    // Custom order: saudi-arabia-egypt-mar-26 first, then sort by date
                    if (a.slug === 'saudi-arabia-egypt-mar-26') return -1;
                    if (b.slug === 'saudi-arabia-egypt-mar-26') return 1;
                    // For other events, sort by date (assuming date format is consistent)
                    const dateA = `${a.month}-${a.date}`;
                    const dateB = `${b.month}-${b.date}`;
                    return dateA.localeCompare(dateB);
                  })
                  .map((event) => (
                    <FootballEventCard
                      key={event.id}
                      event={event}
                      onClick={() => onSelectEvent(event)}
                    />
                  ))}
              </div>
            )}
          </div>
        ) : (
          // FALLBACK: OLD DESIGN FOR OTHER SITES
          <div className="mb-0">
            <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5" role="list" aria-label="Event schedule">
              {events.length === 0 ? (
                <div className="p-8 text-center text-[#6e6e73]">No sessions available yet. Check back soon.</div>
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
    // GA4: Track view_item event (use brand as category, not event type)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        items: [{
          item_id: event.id,
          item_name: event.title,
          item_category: getSiteConfig().brand,
          item_variant: event.type
        }]
      });
    }
    onClick();
  };

  // Determine session type based on time
  const getSessionType = (time: string): { label: string; icon: React.ReactNode; bgColor: string; textColor: string } => {
    const hour = parseInt(time.split(':')[0]);
    const isPM = time.includes('PM');
    const hour24 = isPM
      ? (hour === 12 ? 12 : hour + 12)
      : (hour === 12 ? 0 : hour);

    if (hour24 >= 16) {
      return { label: 'Evening', icon: <Moon size={10} />, bgColor: 'bg-[#1d1d1f]', textColor: 'text-white' };
    } else if (hour24 >= 13) {
      return { label: 'Afternoon', icon: <Sun size={10} />, bgColor: 'bg-[#f59e0b]/15', textColor: 'text-[#92400e]' };
    } else {
      return { label: 'Morning', icon: <Sunrise size={10} />, bgColor: 'bg-[#3b82f6]/10', textColor: 'text-[#2563eb]' };
    }
  };

  const session = getSessionType(event.time);

  return (
    <div
      id={`event-${event.id}`}
      role="listitem"
      aria-label={`${event.title} — ${event.day} ${event.month} ${event.date}, ${event.time}${hasValidPrice ? `, from $${event.minPrice}` : ''}${event.isSoldOut ? ', sold out' : ''}`}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
      className={`group cursor-pointer relative flex items-center justify-between p-4 sm:p-5 md:p-8 transition-all duration-300 hover:bg-[#f5f5f7]/50 active:bg-[#f5f5f7]/70 ${!isLast ? 'border-b border-[#f5f5f7]' : ''}`}
    >
      {/* Left accent stripe */}
      <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-12">
        <div className="flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-[48px] sm:h-[56px] md:h-[80px] bg-[#f5f5f7] rounded-xl md:rounded-2xl group-hover:bg-white transition-colors duration-300">
          <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold text-[#6e6e73] uppercase tracking-widest leading-none mb-0.5 sm:mb-1">{event.month}</span>
          <span className="text-lg sm:text-xl md:text-3xl font-semibold tracking-tight leading-none">{event.date}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 mb-0.5 sm:mb-1">
             <span className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#1d1d1f]">{event.day}</span>
             <span className="w-1 h-1 rounded-full bg-[#d2d2d7]"></span>
             <span className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#6e6e73]">{event.time}</span>
             <span className={`hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] md:text-[11px] font-semibold ${session.bgColor} ${session.textColor}`}>
               {session.icon}
               {session.label}
             </span>
          </div>
          <h4 className="text-[15px] sm:text-base md:text-2xl font-semibold tracking-tight text-[#1d1d1f] group-hover:text-[var(--color-primary)] transition-colors duration-300 leading-snug">
            {event.title}
          </h4>
          {event.venue && (
            <p className="hidden md:block text-[14px] text-[#6e6e73] mt-0.5">{event.venue}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
        {event.isSoldOut ? (
          <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 sm:px-4 md:px-5 py-2.5 sm:py-2 md:py-2.5 bg-[#6e6e73] text-white text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-lg">
            Sold out
          </span>
        ) : (
          <>
            <div className="flex flex-col items-end">
              {hasValidPrice ? (
                <>
                  <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-[#6e6e73] uppercase tracking-wide sm:tracking-widest">From</span>
                  <span className="text-[16px] sm:text-[18px] md:text-[22px] font-bold text-[#1d1d1f]">${event.minPrice}</span>
                </>
              ) : (
                <span className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-[#6e6e73]">Price unavailable</span>
              )}
            </div>
            <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 sm:px-4 md:px-4 py-2.5 sm:py-2 md:py-2 bg-[var(--color-primary)] text-white text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-lg group-hover:scale-105 active:scale-95 transition-transform">
              Buy tickets
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default Events;