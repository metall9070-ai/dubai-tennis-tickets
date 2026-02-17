'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ContentPage from './components/ContentPage';
import Hero from '@/components/Hero';
import Events from '@/components/Events';
import WhyBuy from '@/components/WhyBuy';
import SEOSection from '@/components/SEOSection';
import type { Event } from '@/lib/types';
import type { SEOContent } from '@/types/seo';

interface HomeClientProps {
  initialEvents: Event[];
  seoContent?: SEOContent;
}

export default function HomeClient({ initialEvents, seoContent }: HomeClientProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectEvent = (eventData: any) => {
    const eventSlug = eventData?.slug || `event-${eventData?.id}`;
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
          <Events onSelectEvent={handleSelectEvent} initialEvents={initialEvents} />
          <WhyBuy />
          {seoContent?.h1 ? (
            <ContentPage content={seoContent} embedded />
          ) : (
            <SEOSection
              onFAQ={() => router.push('/faq')}
              onSeatingGuide={() => router.push('/seating-guide')}
              onVenue={() => router.push('/venue')}
              onATPTickets={() => router.push('/tickets/atp')}
              onWTATickets={() => router.push('/tickets/wta')}
            />
          )}
          <Footer />
        </>
      )}
    </div>
  );
}
