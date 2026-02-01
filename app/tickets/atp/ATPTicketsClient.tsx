'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Event, EventRow } from '@/components/Events';
import { fetchEvents } from '@/lib/api';
import { useCart } from '@/app/CartContext';

interface ATPTicketsClientProps {
  initialEvents?: Event[];
}

export default function ATPTicketsClient({ initialEvents }: ATPTicketsClientProps) {
  const router = useRouter();
  const { cartTotalItems } = useCart();

  // Use initialEvents from SSR if available
  const [atpEvents, setAtpEvents] = useState<Event[]>(initialEvents || []);
  const [isLoading, setIsLoading] = useState(!initialEvents || initialEvents.length === 0);
  const [error, setError] = useState<string | null>(null);

  // Skip CSR fetch if we have SSR data
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      console.log(`[SSR] Using ${initialEvents.length} ATP events from server-side render`);
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
          console.error('[TOURNAMENT PAGE] REJECTED fallback data - Django API required for prices');
          setError('Unable to load prices. Please try again.');
          setAtpEvents([]);
          return;
        }

        if (result.data) {
          const atp = result.data.filter(e => e.type === 'ATP');
          setAtpEvents(atp);
          console.log(`[CSR FALLBACK] /tickets/atp loaded ${atp.length} ATP events from Django API`);
        }
      } catch (err) {
        console.error('[TOURNAMENT PAGE] Failed to load events:', err);
        if (mounted) {
          setError('Unable to load prices. Please try again.');
          setAtpEvents([]);
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

  const handleSelectEvent = (eventData: Event) => {
    // Use slug for SEO-friendly URLs, fallback to id for backward compatibility
    const eventSlug = eventData.slug || `event-${eventData.id}`;
    sessionStorage.setItem('selectedEvent', JSON.stringify(eventData));
    router.push(`/tickets/event/${eventSlug}`);
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/federer-dubai-atp.jpg"
            alt="Roger Federer playing at Dubai Duty Free Tennis Championships - ATP 500 Tournament"
            title="ATP 500 Dubai - World-class tennis at Dubai Duty Free Tennis Stadium"
            className="w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f] via-[#1d1d1f]/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="ATP 500 Tickets" light />

          <div className="mt-8 md:mt-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e824c] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Men's Tournament
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              ATP 500 Dubai 2026
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              February 23-28, 2026 • Dubai Duty Free Tennis Stadium
            </p>
            <p className="text-base text-white/60 mt-4 max-w-2xl">
              Experience world-class men's tennis. Past champions include Roger Federer, Novak Djokovic, and Andy Murray.
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="flex items-center justify-between mb-6 md:mb-10 px-2">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1d1d1f]">
              Select Your Session
            </h2>
            <span className="text-sm font-medium text-[#1e824c]">
              {isLoading ? '...' : `${atpEvents.length} sessions`}
            </span>
          </div>

          <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
            {isLoading ? (
              <div className="p-8 text-center text-[#86868b]">
                <div className="animate-pulse">Loading sessions...</div>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                {error}. Please refresh the page.
              </div>
            ) : atpEvents.length === 0 ? (
              <div className="p-8 text-center text-[#86868b]">
                No sessions available.
              </div>
            ) : (
              atpEvents.map((event, index, arr) => (
                <EventRow
                  key={event.id}
                  event={event}
                  isLast={index === arr.length - 1}
                  onClick={() => handleSelectEvent(event)}
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      <section className="py-12 md:py-16 bg-white" itemScope itemType="https://schema.org/SportsEvent">
        <meta itemProp="name" content="ATP 500 Dubai 2026 - Dubai Duty Free Tennis Championships" />
        <meta itemProp="startDate" content="2026-02-23" />
        <meta itemProp="endDate" content="2026-02-28" />
        <div itemProp="location" itemScope itemType="https://schema.org/Place">
          <meta itemProp="name" content="Dubai Duty Free Tennis Stadium" />
          <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
            <meta itemProp="addressLocality" content="Dubai" />
            <meta itemProp="addressCountry" content="UAE" />
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/80">
            <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-6">
              ATP 500 Tickets – Dubai Duty Free Tennis Championships
            </h2>

            <p className="mb-4 leading-relaxed">
              Looking to buy ATP 500 tickets in Dubai? The Dubai Duty Free Tennis Championships is one of the most established ATP 500 tournaments on the global tennis calendar, attracting top-ranked players and international fans every season. Held at the Dubai Duty Free Tennis Stadium, the tournament combines elite-level competition with a premium spectator experience in one of the world's most dynamic cities.
            </p>

            <p className="mb-4 leading-relaxed">
              The ATP 500 event in Dubai is known for its fast-paced matches, evening sessions under the lights, and a strong lineup throughout the draw. From early rounds to the finals, fans can expect high-quality tennis, intense rallies, and a lively atmosphere that reflects Dubai's international character. The tournament's timing early in the season often delivers exciting matchups as players compete for form and ranking points.
            </p>

            <p className="mb-4 leading-relaxed">
              Tickets for ATP 500 matches in Dubai are available across a range of seating options, from general admission areas to reserved seats with clear views of the court. Different sessions allow fans to choose between daytime matches or popular night sessions, depending on their schedule and preferences. Seating availability and pricing may vary by match and round, making early selection important for the best options.
            </p>

            <p className="mb-4 leading-relaxed">
              Attending tennis in Dubai offers more than just world-class sport. The venue is modern, comfortable, and easy to access, while the city itself provides exceptional dining, hotels, and entertainment. Many visitors combine the tournament with a winter getaway, enjoying warm weather and a premium lifestyle alongside top-tier tennis.
            </p>

            <p className="leading-relaxed">
              Browse the current match schedule above to explore available ATP 500 Dubai tickets and secure seats that match your plans. Availability can change quickly, especially for later rounds, so selecting tickets in advance helps ensure you don't miss out on one of Dubai's most anticipated tennis events.
            </p>
          </article>

          {/* Cross-linking to WTA */}
          <div className="mt-10 pt-8 border-t border-[#d2d2d7]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm text-[#86868b] mb-1">Also at Dubai Tennis Championships</p>
                <p className="text-lg font-semibold text-[#1d1d1f]">WTA 1000 Women's Tournament</p>
                <p className="text-sm text-[#86868b]">February 15-21, 2026</p>
              </div>
              <button
                onClick={() => router.push('/tickets/wta')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-colors"
              >
                View WTA 1000 Tickets
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
