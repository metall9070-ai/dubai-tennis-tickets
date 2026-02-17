/**
 * Server-side API functions for Next.js App Router.
 * Used in Server Components for SSR/ISR data fetching.
 */

import type { Event } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || '';

interface APIEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  min_price: string | null;
  is_sold_out: boolean;
  type: 'WTA' | 'ATP';
  venue: string;
  tournament_slug?: string;
}

/**
 * Fetch events from Django API (server-side).
 * Uses ISR with 60s revalidation for optimal SEO + freshness.
 *
 * @param siteCode - Site code for visibility filtering.
 *   undefined = use NEXT_PUBLIC_SITE_CODE env (default for listing pages).
 *   '' = skip visibility filter (used by sitemap — SEO must not depend on visibility).
 */
export async function fetchEventsServer(siteCode?: string): Promise<Event[]> {
  if (!API_BASE_URL) {
    console.error('[SERVER API] No API URL configured');
    return [];
  }

  const effectiveSiteCode = siteCode !== undefined ? siteCode : SITE_CODE;

  try {
    let url = `${API_BASE_URL}/api/events/`;
    if (effectiveSiteCode) {
      url += `?site_code=${encodeURIComponent(effectiveSiteCode)}`;
    }

    const response = await fetch(url, {
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
      minPrice: e.min_price != null ? parseFloat(e.min_price) : null,
      isSoldOut: e.is_sold_out ?? false,
      tournamentSlug: e.tournament_slug,
      venue: e.venue,
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

// ============================================================================
// EVENT DETAIL PAGE - SSR/ISR Functions
// ============================================================================

interface APICategory {
  id: number | string;
  name: string;
  price: string | number;
  color?: string;
  seats_left: number;
  is_active?: boolean;
  show_on_frontend?: boolean;
}

export interface Category {
  id: string;
  name: string;
  price: number;
  color: string;
  seatsLeft: number;
  isActive?: boolean;
  showOnFrontend?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  'prime-a': '#8B5CF6',
  'prime-b': '#F59E0B',
  'grandstand': '#10B981',
  'grandstand-lower': '#10B981',
  'grandstand-upper': '#3B82F6',
};

/**
 * Fetch single event by slug or ID (server-side).
 * Uses ISR with 60s revalidation.
 */
export async function fetchEventBySlugServer(slugOrId: string): Promise<Event | null> {
  if (!API_BASE_URL) {
    console.error('[SERVER API] No API URL configured');
    return null;
  }

  try {
    let url = `${API_BASE_URL}/api/events/${slugOrId}/`;
    if (SITE_CODE) {
      url += `?site_code=${encodeURIComponent(SITE_CODE)}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[SERVER API] Event fetch failed:', response.status);
      return null;
    }

    const e: APIEvent = await response.json();

    const event: Event = {
      id: e.id,
      slug: e.slug || `event-${e.id}`,
      type: e.type,
      title: e.title,
      date: e.date,
      day: e.day,
      month: e.month,
      time: e.time,
      minPrice: e.min_price != null ? parseFloat(e.min_price) : null,
      isSoldOut: e.is_sold_out ?? false,
      tournamentSlug: e.tournament_slug,
    };

    console.log(`[SERVER API] Loaded event "${event.title}" for SSR`);
    return event;

  } catch (error) {
    console.error('[SERVER API] Event fetch error:', error);
    return null;
  }
}

/**
 * Fetch categories for an event (server-side).
 * Uses ISR with 60s revalidation.
 */
export async function fetchEventCategoriesServer(eventId: number | string): Promise<Category[]> {
  if (!API_BASE_URL) {
    console.error('[SERVER API] No API URL configured');
    return [];
  }

  try {
    let url = `${API_BASE_URL}/api/events/${eventId}/categories/`;
    if (SITE_CODE) {
      url += `?site_code=${encodeURIComponent(SITE_CODE)}`;
    }

    const response = await fetch(url, {
      next: { revalidate: 60 },
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('[SERVER API] Categories fetch failed:', response.status);
      return [];
    }

    const json = await response.json();
    const results = json.results || json;

    // IMPORTANT: Do NOT filter out show_on_frontend=false categories
    // They should be visible but disabled (greyed out, not clickable, not purchasable)
    const categories: Category[] = results.map((cat: APICategory, index: number) => {
      const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
      return {
        id: String(cat.id),
        name: cat.name,
        price: typeof cat.price === 'string' ? parseFloat(cat.price) : cat.price,
        color: cat.color || CATEGORY_COLORS[slug] || Object.values(CATEGORY_COLORS)[index] || '#1e824c',
        seatsLeft: cat.seats_left,
        isActive: cat.is_active !== false,
        showOnFrontend: cat.show_on_frontend !== false,
      };
    });

    console.log(`[SERVER API] Loaded ${categories.length} categories for event ${eventId}`);
    return categories;

  } catch (error) {
    console.error('[SERVER API] Categories fetch error:', error);
    return [];
  }
}

/**
 * Fetch event with categories in PARALLEL (server-side).
 * This is the main function for SSR/ISR on event detail page.
 * Uses Promise.all for parallel fetching.
 */
export async function fetchEventWithCategoriesServer(slugOrId: string): Promise<{
  event: Event | null;
  categories: Category[];
}> {
  // First fetch the event to get its ID
  const event = await fetchEventBySlugServer(slugOrId);

  if (!event) {
    return { event: null, categories: [] };
  }

  // Then fetch categories using the event ID (parallel would require ID upfront)
  const categories = await fetchEventCategoriesServer(event.id);

  console.log(`[SERVER API] SSR complete: event "${event.title}" with ${categories.length} categories`);
  return { event, categories };
}
