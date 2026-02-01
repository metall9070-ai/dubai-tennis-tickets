'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from '@/components/Hero';
import TrustSignals from '@/components/TrustSignals';
import Events from '@/components/Events';
import WhyBuy from '@/components/WhyBuy';
import SEOSection from '@/components/SEOSection';
import type { Event } from '@/lib/types';

interface HomeClientProps {
  initialEvents: Event[];
}

export default function HomeClient({ initialEvents }: HomeClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectEvent = (eventData: any) => {
    // Use slug for SEO-friendly URLs, fallback to id for backward compatibility
    const eventSlug = eventData?.slug || `event-${eventData?.id}`;
    // Store selected event in sessionStorage for the event page
    sessionStorage.setItem('selectedEvent', JSON.stringify(eventData));
    router.push(`/tickets/event/${eventSlug}`);
  };

  const handleViewShelter = () => {
    const ticketsSection = document.getElementById('tickets');
    if (ticketsSection) {
      ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible={isLoaded} />
      <Hero isVisible={isLoaded} onAction={handleViewShelter} />
      {isLoaded && (
        <>
          <TrustSignals />
          <Events onSelectEvent={handleSelectEvent} initialEvents={initialEvents} />
          <WhyBuy />
          <SEOSection
            onFAQ={() => router.push('/faq')}
            onSeatingGuide={() => router.push('/seating-guide')}
            onVenue={() => router.push('/venue')}
            onATPTickets={() => router.push('/tickets/atp')}
            onWTATickets={() => router.push('/tickets/wta')}
          />
          <Footer />
        </>
      )}
    </div>
  );
}
