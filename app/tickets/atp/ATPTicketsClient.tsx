'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { eventsData, EventRow } from '@/components/Events';
import { useCart } from '@/app/CartContext';

export default function ATPTicketsClient() {
  const router = useRouter();
  const { cartTotalItems } = useCart();
  const atpEvents = eventsData.filter(e => e.type === 'ATP');

  const handleSelectEvent = (eventData: any) => {
    const eventId = eventData?.id || eventData?.title?.toLowerCase().replace(/\s+/g, '-') || 'select';
    sessionStorage.setItem('selectedEvent', JSON.stringify(eventData));
    router.push(`/tickets/event/${eventId}`);
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
            src="https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1920&auto=format&fit=crop"
            alt="ATP 500 Tennis"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1f]/80 to-[#1d1d1f]" />
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
            <span className="text-sm font-medium text-[#1e824c]">{atpEvents.length} sessions</span>
          </div>

          <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
            {atpEvents.map((event, index, arr) => (
              <EventRow
                key={event.id}
                event={event}
                isLast={index === arr.length - 1}
                onClick={() => handleSelectEvent(event)}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
