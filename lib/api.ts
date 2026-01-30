/**
 * API client for Django backend integration.
 *
 * ============================================================================
 * CRITICAL: DJANGO API IS SINGLE SOURCE OF TRUTH FOR PRICES
 * ============================================================================
 *
 * ARCHITECTURE (as of 2026-01-29):
 * - Django API is the ONLY authoritative source for event/category prices
 * - NO static fallback data is used in production
 * - If API is unreachable: frontend MUST show error, NOT stale prices
 * - All prices logged with [PRICE] tag for audit trail
 *
 * WHY THIS MATTERS:
 * - Prices are dynamic and change based on demand/availability
 * - Static fallback prices caused $150 bug (wrong prices shown to customers)
 * - Orders are validated server-side, so mismatched prices = payment failures
 *
 * DO NOT:
 * - Add fallback to static eventsData or category data
 * - Import eventsData from components/Events.tsx
 * - Return stale/cached prices when API fails
 *
 * SAFETY:
 * - All fetches wrapped in try/catch
 * - Timeout protection (3 seconds)
 * - Returns { data: null, fallback: true } on error
 * - UI components must handle null data by showing error state
 */

// STRICT: No static fallback data - Django API is single source of truth
// If API is unavailable, UI must show error - NOT stale prices
// NOTE: Event type moved to lib/types.ts to break circular dependency with components/Events.tsx
import type { Event } from '@/lib/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const API_TIMEOUT = 10000; // 10 seconds - increased for reliable local dev

// Log API configuration on module load (client-side only)
if (typeof window !== 'undefined') {
  console.log('[API CONFIG] Base URL:', API_BASE_URL || '(NOT SET - API calls will fail!)');
  console.log('[API CONFIG] Timeout:', API_TIMEOUT, 'ms');
  if (!API_BASE_URL) {
    console.error('[API CONFIG] CRITICAL: NEXT_PUBLIC_API_BASE_URL is not set in .env.local');
  }
}

// Shadow mode: fetch API data but don't use it - only log comparisons
const SHADOW_MODE = process.env.NEXT_PUBLIC_DJANGO_SHADOW_MODE === 'true';

// LIMITED LIVE MODE (B5.2): Only these event IDs use live Django prices
// "*" = all events use Django (single source of truth)
// "1,2,3" = only specific events use Django
// "" = all events use fallback (safe default)
const LIVE_EVENT_IDS_RAW = process.env.NEXT_PUBLIC_DJANGO_LIVE_EVENT_IDS || '';
const ALL_EVENTS_LIVE = LIVE_EVENT_IDS_RAW.trim() === '*';
const LIVE_EVENT_IDS: Set<number | string> = new Set(
  ALL_EVENTS_LIVE ? [] : LIVE_EVENT_IDS_RAW
    .split(',')
    .map(id => id.trim())
    .filter(id => id.length > 0)
    .map(id => {
      const num = parseInt(id, 10);
      return isNaN(num) ? id : num;
    })
);

// ============================================================================
// LIMITED LIVE MODE HELPERS (B5.2)
// ============================================================================

/**
 * Check if an event should use LIVE Django prices.
 * Returns true only if:
 * - Shadow mode is OFF
 * - LIVE_EVENT_IDS is "*" (all events) OR Event ID is in the list
 */
export function isEventLive(eventId: number | string): boolean {
  if (SHADOW_MODE) return false;
  if (ALL_EVENTS_LIVE) return true;  // "*" = all events use Django API
  if (LIVE_EVENT_IDS.size === 0) return false;

  // Check both number and string versions
  const numId = typeof eventId === 'string' ? parseInt(eventId, 10) : eventId;
  return LIVE_EVENT_IDS.has(eventId) || LIVE_EVENT_IDS.has(numId);
}

/**
 * Get list of live event IDs for debugging
 */
export function getLiveEventIds(): (number | string)[] {
  return Array.from(LIVE_EVENT_IDS);
}

// ============================================================================
// INTERFACES
// ============================================================================

interface APIHealthResponse {
  status: string;
  use_django_prices: boolean;
  use_django_availability: boolean;
}

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
  is_active?: boolean;
}

interface APICategory {
  id: number;
  name: string;
  price: string;
  color: string;
  seats_total: number;
  seats_available: number;
  seats_left: number;
  is_active: boolean;
  show_on_frontend: boolean;
}

interface APIResponse<T> {
  data: T | null;
  fallback: boolean;
  error?: string;
}

// ============================================================================
// SOLD OUT HELPER
// ============================================================================

/**
 * Check if a category is SOLD OUT.
 * A category is SOLD OUT if:
 * - is_active === false (admin disabled)
 * - seats_available === 0 (no seats left)
 *
 * @param isActive - Whether the category is active (from API)
 * @param seatsAvailable - Number of available seats (from API)
 * @returns true if the category should be shown as SOLD OUT
 */
export function isSoldOut(isActive: boolean | undefined, seatsAvailable: number): boolean {
  // If is_active is explicitly false, it's sold out
  if (isActive === false) return true;
  // If no seats available, it's sold out
  if (seatsAvailable <= 0) return true;
  return false;
}

// ============================================================================
// SHADOW MODE LOGGING - DEPRECATED
// Django API is now single source of truth - no static data to compare
// ============================================================================

// logShadowCategoryComparison - REMOVED
// Django API is single source of truth - no static data to compare

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch with timeout protection and detailed error reporting
 */
async function fetchWithTimeout(url: string, timeout: number = API_TIMEOUT): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  console.log(`[API FETCH] Requesting: ${url}`);
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      cache: 'no-store',  // CRITICAL: Never cache - always fetch fresh prices from Django API
      next: { revalidate: 0 },  // Next.js: disable ISR caching
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      }
    });
    clearTimeout(timeoutId);

    const elapsed = Date.now() - startTime;
    console.log(`[API FETCH] Response: ${response.status} in ${elapsed}ms`);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;

    // Provide specific error messages for common issues
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error(`[API FETCH] TIMEOUT after ${elapsed}ms: ${url}`);
        throw new Error(`API timeout after ${timeout}ms - is Django server running?`);
      }
      if (error.message.includes('fetch')) {
        console.error(`[API FETCH] NETWORK ERROR after ${elapsed}ms: ${url}`);
        console.error(`[API FETCH] Is Django running at ${API_BASE_URL}?`);
        throw new Error(`Network error - Django server unreachable at ${API_BASE_URL}`);
      }
    }

    console.error(`[API FETCH] ERROR after ${elapsed}ms:`, error);
    throw error;
  }
}

/**
 * Check API health and feature flags.
 * Returns safe defaults if API is unavailable.
 */
export async function checkAPIHealth(): Promise<{
  available: boolean;
  useDjangoPrices: boolean;
  useDjangoAvailability: boolean;
}> {
  if (!API_BASE_URL) {
    return { available: false, useDjangoPrices: false, useDjangoAvailability: false };
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/health/`);

    if (!response.ok) {
      console.warn('[API] Health check failed:', response.status);
      return { available: false, useDjangoPrices: false, useDjangoAvailability: false };
    }

    const data: APIHealthResponse = await response.json();

    return {
      available: data.status === 'ok',
      useDjangoPrices: data.use_django_prices ?? false,
      useDjangoAvailability: data.use_django_availability ?? false,
    };
  } catch (error) {
    console.warn('[API] Health check error:', error);
    return { available: false, useDjangoPrices: false, useDjangoAvailability: false };
  }
}

/**
 * Fetch events from Django API.
 *
 * SINGLE SOURCE OF TRUTH:
 * - Django API is the ONLY source for event prices
 * - If API is unavailable, returns null (UI must show error)
 * - NO fallback to static data
 */
export async function fetchEvents(): Promise<APIResponse<Event[]>> {
  // No API URL configured - return error (Django API is required)
  if (!API_BASE_URL) {
    console.error('[API] FATAL: No API URL configured - Django API is required for prices');
    return { data: null, fallback: true, error: 'API_URL_NOT_CONFIGURED' };
  }

  // SHADOW MODE DISABLED - Django API is single source of truth
  // Shadow mode was for comparing static vs API data - no longer applicable
  if (SHADOW_MODE) {
    console.warn('[API] Shadow mode is deprecated - Django API is single source of truth');
    // Fall through to normal API fetch
  }

  // DJANGO API - SINGLE SOURCE OF TRUTH
  // No fallback to static data - if API fails, UI must show error
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/events/`);

    if (!response.ok) {
      console.error('[API] Events fetch FAILED:', response.status);
      return { data: null, fallback: true, error: `HTTP ${response.status}` };
    }

    const json = await response.json();

    if (json.fallback === true) {
      console.error('[API] Server returned fallback - this should not happen');
      return { data: null, fallback: true, error: 'SERVER_RETURNED_FALLBACK' };
    }

    // Transform API response - THESE ARE THE AUTHORITATIVE PRICES
    const results = json.results || json;
    const djangoEvents: Event[] = results.map((e: APIEvent) => ({
      id: e.id,
      slug: e.slug || `event-${e.id}`,  // Fallback for legacy support
      type: e.type,
      title: e.title,
      date: e.date,
      day: e.day,
      month: e.month,
      time: e.time,
      minPrice: parseFloat(e.min_price) || 0,
      tournamentSlug: e.tournament_slug,
    }));

    // Log each event with price source for audit trail
    console.log(`[API] Loaded ${djangoEvents.length} events from Django API (SINGLE SOURCE OF TRUTH)`);
    djangoEvents.forEach(e => {
      console.log(`[PRICE] Event ${e.id} "${e.title}" (slug: ${e.slug}): $${e.minPrice} (source: Django API)`);
    });

    return { data: djangoEvents, fallback: false };

  } catch (error) {
    console.error('[API] Events fetch ERROR - UI must show error state:', error);
    return { data: null, fallback: true, error: String(error) };
  }
}

/**
 * Fetch categories for a specific event from Django API.
 *
 * SINGLE SOURCE OF TRUTH:
 * - Django API is the ONLY source for category prices
 * - If API is unavailable, returns null (UI must show error)
 * - NO fallback to static data
 *
 * VISIBILITY RULES:
 * - show_on_frontend=true: Category appears in UI (may be SOLD OUT or available)
 * - show_on_frontend=false: Legacy category, filtered out entirely
 * - is_active=false OR seats_available=0: Shown as SOLD OUT (but still visible)
 */
export async function fetchEventCategories(
  eventId: number | string
): Promise<APIResponse<{
  id: string;
  name: string;
  price: number;
  color: string;
  seatsLeft: number;
  isActive: boolean;
}[]>> {
  // No API URL configured
  if (!API_BASE_URL) {
    console.error('[API] FATAL: No API URL configured - Django API is required for category prices');
    return { data: null, fallback: true, error: 'API_URL_NOT_CONFIGURED' };
  }

  // DJANGO API - SINGLE SOURCE OF TRUTH
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/events/${eventId}/categories/`);

    if (!response.ok) {
      console.error('[API] Categories fetch FAILED:', response.status);
      return { data: null, fallback: true, error: `HTTP ${response.status}` };
    }

    const json = await response.json();

    // ========================================================================
    // NORMALIZE RESPONSE: Handle ANY Django response shape
    // Django REST Framework can return: { results: [] }, { data: [] },
    // { categories: [] }, or plain []
    // ========================================================================
    let categories: APICategory[];

    if (Array.isArray(json)) {
      // Plain array response
      categories = json;
    } else if (json && typeof json === 'object') {
      // Wrapped response - try common keys in order of likelihood
      if (Array.isArray(json.results)) {
        categories = json.results;
      } else if (Array.isArray(json.data)) {
        categories = json.data;
      } else if (Array.isArray(json.categories)) {
        categories = json.categories;
      } else {
        // Unknown object structure - log and return error
        console.error('[API] Categories response has unknown structure:', JSON.stringify(json).slice(0, 200));
        return { data: null, fallback: true, error: 'UNKNOWN_RESPONSE_STRUCTURE' };
      }
    } else {
      // Null, undefined, or primitive - invalid response
      console.error('[API] Categories response is not an array or object:', typeof json);
      return { data: null, fallback: true, error: 'INVALID_RESPONSE_TYPE' };
    }

    console.log(`[API NORMALIZED] categories count: ${categories.length}`);

    // CRITICAL: Filter by show_on_frontend FIRST
    // Legacy categories (show_on_frontend=false) are hidden entirely from UI
    // Inactive/sold-out categories (is_active=false OR seats_available=0) are still shown as SOLD OUT
    const visibleCategories = categories.filter(c => c.show_on_frontend === true);

    const djangoCategories = visibleCategories.map(c => ({
      id: String(c.id),
      name: c.name,
      price: parseFloat(c.price) || 0,
      color: c.color,
      seatsLeft: c.seats_available,
      isActive: c.is_active,
    }));

    // Log each category with price source for audit trail
    console.log(`[API] Event ${eventId} categories loaded from Django (SINGLE SOURCE OF TRUTH):`);
    console.log(`[API] Total: ${categories.length}, Visible (show_on_frontend=true): ${visibleCategories.length}`);
    djangoCategories.forEach(c => {
      const soldOut = isSoldOut(c.isActive, c.seatsLeft);
      console.log(`[PRICE] Category "${c.name}": $${c.price} ${soldOut ? '(SOLD OUT)' : ''}`);
    });

    return { data: djangoCategories, fallback: false };

  } catch (error) {
    console.error('[API] Categories fetch ERROR - UI must show error state:', error);
    return { data: null, fallback: true, error: String(error) };
  }
}

/**
 * Fetch a single event by slug or ID.
 *
 * @param slugOrId - Event slug (preferred) or ID (fallback)
 * @returns Event data or null if not found
 */
export async function fetchEventBySlug(
  slugOrId: string
): Promise<APIResponse<Event>> {
  console.log(`[API] fetchEventBySlug called with: "${slugOrId}"`);
  console.log(`[API] API_BASE_URL = "${API_BASE_URL}"`);

  if (!API_BASE_URL) {
    const errorMsg = 'NEXT_PUBLIC_API_BASE_URL is not configured. Check .env.local file.';
    console.error('[API] FATAL:', errorMsg);
    return { data: null, fallback: true, error: errorMsg };
  }

  const url = `${API_BASE_URL}/api/events/${slugOrId}/`;
  console.log(`[API] Full URL: ${url}`);

  try {
    // API supports both slug and ID lookup
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      const errorMsg = `HTTP ${response.status} - ${response.status === 404 ? 'Event not found' : 'Server error'}`;
      console.error('[API] Event fetch FAILED:', errorMsg);
      return { data: null, fallback: true, error: errorMsg };
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
      minPrice: parseFloat(e.min_price) || 0,
      tournamentSlug: e.tournament_slug,
    };

    console.log(`[API] SUCCESS: Fetched event "${event.title}" (slug: ${event.slug}, id: ${event.id})`);
    return { data: event, fallback: false };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error('[API] Event fetch ERROR:', errorMsg);
    return { data: null, fallback: true, error: errorMsg };
  }
}

/**
 * Hook-friendly wrapper that handles loading state.
 * STRICT: Returns empty array if API fails - NO fallback to static data
 */
export async function safeLoadEvents(): Promise<{
  events: Event[];
  fromAPI: boolean;
  error?: string;
}> {
  const result = await fetchEvents();
  return {
    events: result.data || [],  // Empty array if API fails - NO static fallback
    fromAPI: !result.fallback,
    error: result.error,
  };
}

/**
 * Check if shadow mode is enabled
 */
export function isShadowMode(): boolean {
  return SHADOW_MODE;
}

/**
 * Get current API configuration status
 */
export function getAPIConfig(): {
  baseUrl: string;
  shadowMode: boolean;
  liveEventIds: (number | string)[];
  timeout: number;
} {
  return {
    baseUrl: API_BASE_URL,
    shadowMode: SHADOW_MODE,
    liveEventIds: Array.from(LIVE_EVENT_IDS),
    timeout: API_TIMEOUT,
  };
}
