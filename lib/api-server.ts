/**
 * Server-side API functions for Next.js App Router.
 * Used in Server Components for SSR/ISR data fetching.
 */

import type { Event } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

interface APIEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  min_price: string;
  type: 'WTA' | 'ATP';
  venue: string;
  tournament_slug?: string;
}

/**
 * Fetch events from Django API (server-side).
 * Uses ISR with 60s revalidation for optimal SEO + freshness.
 */
export async function fetchEventsServer(): Promise<Event[]> {
  if (!API_BASE_URL) {
    console.error('[SERVER API] No API URL configured');
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/events/`, {
      next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[SERVER API] Events fetch failed:', response.status);
      return [];
    }

    const json = await response.json();
    const results = json.results || json;

    const events: Event[] = results.map((e: APIEvent) => ({
      id: e.id,
      slug: e.slug || `event-${e.id}`,
      type: e.type,
      title: e.title,
      date: e.date,
      day: e.day,
      month: e.month,
      time: e.time,
      minPrice: parseFloat(e.min_price) || 0,
      tournamentSlug: e.tournament_slug,
    }));

    console.log(`[SERVER API] Loaded ${events.length} events for SSR`);
    return events;

  } catch (error) {
    console.error('[SERVER API] Events fetch error:', error);
    return [];
  }
}

/**
 * Fetch ATP events from Django API (server-side).
 */
export async function fetchATPEventsServer(): Promise<Event[]> {
  const allEvents = await fetchEventsServer();
  const atpEvents = allEvents.filter(e => e.type === 'ATP');
  console.log(`[SERVER API] Filtered ${atpEvents.length} ATP events for SSR`);
  return atpEvents;
}

/**
 * Fetch WTA events from Django API (server-side).
 */
export async function fetchWTAEventsServer(): Promise<Event[]> {
  const allEvents = await fetchEventsServer();
  const wtaEvents = allEvents.filter(e => e.type === 'WTA');
  console.log(`[SERVER API] Filtered ${wtaEvents.length} WTA events for SSR`);
  return wtaEvents;
}
