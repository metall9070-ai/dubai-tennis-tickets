'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/CartContext';
import Checkout from '@/components/Checkout';

export default function CheckoutClient() {
  const router = useRouter();
  const { cart, setCart } = useCart();

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

  return (
    <Checkout
      cart={cart}
      setCart={setCart}
      onBack={() => router.back()}
      {...navigationHandlers}
    />
  );
}
