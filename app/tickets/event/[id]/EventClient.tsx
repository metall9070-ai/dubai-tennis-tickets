'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/CartContext';
import EventSelection from '@/components/EventSelection';

export default function EventClient() {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  useEffect(() => {
    // Retrieve selected event from sessionStorage
    const stored = sessionStorage.getItem('selectedEvent');
    if (stored) {
      setSelectedEvent(JSON.parse(stored));
    }
  }, []);

  const navigationHandlers = {
    onHome: () => router.push('/'),
    onTournament: () => router.push('/tournament'),
    onATPTickets: () => router.push('/tickets/atp'),
    onWTATickets: () => router.push('/tickets/wta'),
    onPaymentDelivery: () => router.push('/payment-and-delivery'),
    onPrivacyPolicy: () => router.push('/privacy-policy'),
    onTermsOfService: () => router.push('/terms-of-service'),
    onContacts: () => router.push('/contact'),
    onAboutUs: () => router.push('/about'),
    onCart: () => router.push('/checkout'),
    onFAQ: () => router.push('/faq'),
    onSeatingGuide: () => router.push('/seating-guide'),
    onVenue: () => router.push('/venue'),
  };

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#86868b] mb-4">Loading event details...</p>
          <button
            onClick={() => router.push('/')}
            className="text-[#1e824c] font-medium hover:underline"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <EventSelection
      event={selectedEvent}
      onBack={() => router.push('/#tickets')}
      cart={cart}
      setCart={setCart}
      onCheckout={() => router.push('/checkout')}
      {...navigationHandlers}
    />
  );
}
