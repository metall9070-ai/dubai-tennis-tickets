'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Event, EventRow } from '@/components/Events';
import { fetchEvents } from '@/lib/api';
import { useCart } from '@/app/CartContext';

export default function WTATicketsClient() {
  const router = useRouter();
  const { cartTotalItems } = useCart();

  // State for events - fetched from Django API
  const [wtaEvents, setWtaEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from Django API - NEVER use fallback data
  useEffect(() => {
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
          setWtaEvents([]);
          return;
        }

        if (result.data) {
          const wta = result.data.filter(e => e.type === 'WTA');
          setWtaEvents(wta);

          // Log each event with LIVE FETCH format for network verification
          wta.forEach(event => {
            console.log(`[LIVE FETCH] /tickets/wta event "${event.title}" min_price=${event.minPrice}`);
          });

          console.log(`[LIVE FETCH] /tickets/wta loaded ${wta.length} WTA events from Django API`);
        }
      } catch (err) {
        console.error('[TOURNAMENT PAGE] Failed to load events:', err);
        if (mounted) {
          setError('Unable to load prices. Please try again.');
          setWtaEvents([]);
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
  }, []);

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
            src="https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1920&auto=format&fit=crop"
            alt="WTA 1000 Tennis"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1f]/80 to-[#1d1d1f]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="WTA 1000 Tickets" light />

          <div className="mt-8 md:mt-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e824c] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Women's Tournament
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              WTA 1000 Dubai 2026
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              February 15-21, 2026 • Dubai Duty Free Tennis Stadium
            </p>
            <p className="text-base text-white/60 mt-4 max-w-2xl">
              Experience elite women's tennis. Past champions include Iga Swiatek, Elena Rybakina, and Simona Halep.
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
              {isLoading ? '...' : `${wtaEvents.length} sessions`}
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
            ) : wtaEvents.length === 0 ? (
              <div className="p-8 text-center text-[#86868b]">
                No sessions available.
              </div>
            ) : (
              wtaEvents.map((event, index, arr) => (
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

      <Footer />
    </div>
  );
}
