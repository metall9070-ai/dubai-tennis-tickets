'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/CartContext';
import EventSelection from '@/components/EventSelection';
import { fetchEventBySlug } from '@/lib/api';
import type { Event } from '@/lib/types';

// Storage version - must match CartContext.tsx
const CART_VERSION_KEY = 'dubai-tennis-cart-version';
const CURRENT_CART_VERSION = 3;

// Check if sessionStorage should be trusted (version matches)
function isStorageVersionValid(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const storedVersion = localStorage.getItem(CART_VERSION_KEY);
    const version = storedVersion ? parseInt(storedVersion, 10) : 0;
    return version === CURRENT_CART_VERSION;
  } catch {
    return false;
  }
}

interface EventClientProps {
  slug: string;
}

export default function EventClient({ slug }: EventClientProps) {
  const router = useRouter();
  const { cart, setCart } = useCart();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadEvent() {
      console.log(`[EventClient] Starting load for slug: "${slug}"`);
      setIsLoading(true);
      setError(null);

      // First check sessionStorage for backward compatibility
      // BUT only if storage version is valid (prevents using stale data after cart format change)
      if (isStorageVersionValid()) {
        const stored = sessionStorage.getItem('selectedEvent');
        if (stored) {
          try {
            const storedEvent = JSON.parse(stored);

            // Check if the stored event matches the current slug
            // This handles the case where user navigated via event selection
            if (storedEvent.slug === slug || String(storedEvent.id) === slug) {
              console.log(`[EventClient] Found matching event in sessionStorage (version valid)`);
              if (mounted) {
                setSelectedEvent(storedEvent);
                setIsLoading(false);

                // If user came with ID, redirect to slug URL for SEO
                if (String(storedEvent.id) === slug && storedEvent.slug) {
                  router.replace(`/tickets/event/${storedEvent.slug}`);
                }
              }
              return;
            }
          } catch {
            // Invalid JSON in sessionStorage, ignore
            console.log(`[EventClient] Invalid sessionStorage data, fetching from API`);
          }
        }
      } else {
        console.log(`[EventClient] Storage version mismatch, clearing stale sessionStorage`);
        sessionStorage.removeItem('selectedEvent');
      }

      // Fetch event from API by slug (or ID for backward compatibility)
      console.log(`[EventClient] Fetching event from API: ${slug}`);

      try {
        const result = await fetchEventBySlug(slug);

        if (!mounted) {
          console.log(`[EventClient] Component unmounted, ignoring result`);
          return;
        }

        if (result.fallback || !result.data) {
          console.error(`[EventClient] API returned error:`, result.error);
          setError(result.error || 'Event not found');
          setIsLoading(false);
          return;
        }

        const event = result.data;
        console.log(`[EventClient] Loaded event: "${event.title}"`);

        // If user came with numeric ID, redirect to slug URL for SEO
        const isNumericSlug = /^\d+$/.test(slug);
        if (isNumericSlug && event.slug && event.slug !== slug) {
          // Store event in sessionStorage before redirect
          sessionStorage.setItem('selectedEvent', JSON.stringify(event));
          router.replace(`/tickets/event/${event.slug}`);
          return;
        }

        // Store in sessionStorage for components that need it
        sessionStorage.setItem('selectedEvent', JSON.stringify(event));
        setSelectedEvent(event);
        setIsLoading(false);
      } catch (err) {
        // This catch handles any unexpected errors not caught by fetchEventBySlug
        console.error(`[EventClient] Unexpected error:`, err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load event');
          setIsLoading(false);
        }
      }
    }

    loadEvent();

    return () => {
      mounted = false;
    };
  }, [slug, router]);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e824c] mx-auto mb-4"></div>
          <p className="text-[#86868b]">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !selectedEvent) {
    const isNetworkError = error?.includes('Network') || error?.includes('unreachable') || error?.includes('timeout');

    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">{isNetworkError ? '🔌' : '🎾'}</div>
          <h1 className="text-2xl font-bold text-[#1d1d1f] mb-2">
            {isNetworkError ? 'Connection Error' : 'Event Not Found'}
          </h1>
          <p className="text-[#86868b] mb-6">
            {isNetworkError
              ? 'Unable to connect to the server. Please check if the backend is running and try again.'
              : error || "We couldn't find the event you're looking for. It may have been moved or no longer exists."}
          </p>
          {isNetworkError && (
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-[#1e824c] text-white rounded-full font-medium hover:bg-[#166638] transition-colors mb-4"
            >
              Try Again
            </button>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/tickets/wta')}
              className="px-6 py-3 bg-[#1e824c] text-white rounded-full font-medium hover:bg-[#166638] transition-colors"
            >
              View WTA Events
            </button>
            <button
              onClick={() => router.push('/tickets/atp')}
              className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full font-medium hover:bg-[#333] transition-colors"
            >
              View ATP Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <EventSelection
      event={selectedEvent}
      onBack={() => {
        // Navigate back to appropriate tournament page based on event type
        if (selectedEvent.type === 'WTA') {
          router.push('/tickets/wta');
        } else {
          router.push('/tickets/atp');
        }
      }}
      cart={cart}
      setCart={setCart}
      onCheckout={() => router.push('/checkout')}
      {...navigationHandlers}
    />
  );
}
