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
import type { Event, APIEvent, APICategory, APIResponse } from '@/lib/types';
import { isReservedSlug } from '@/lib/reserved-slugs';
import { logger } from '@/lib/logger';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || '';
const API_TIMEOUT = 10000; // 10 seconds - increased for reliable local dev

// Log API configuration on module load (client-side only)
if (typeof window !== 'undefined') {
  logger.log('[API CONFIG] Base URL:', API_BASE_URL || '(NOT SET - API calls will fail!)');
  logger.log('[API CONFIG] Timeout:', API_TIMEOUT, 'ms');
  if (!API_BASE_URL) {
    logger.error('[API CONFIG] CRITICAL: NEXT_PUBLIC_API_BASE_URL is not set in .env.local');
  }
}

// ============================================================================
// INTERFACES
// ============================================================================

interface APIHealthResponse {
  status: string;
  use_django_prices: boolean;
  use_django_availability: boolean;
}

// ============================================================================
// SOLD OUT HELPER
// ============================================================================

/**
 * Check if a category is NOT PURCHASABLE (sold out / disabled).
 *
 * A category is NOT PURCHASABLE if ANY of these conditions is true:
 * - is_active === false (admin manually disabled / CLOSED)
 * - show_on_frontend === false (SOLD OUT / Legacy - visible but disabled)
 * - seats_available === 0 (no seats left)
 *
 * IMPORTANT: show_on_frontend=false does NOT mean hidden.
 * It means: visible but disabled (greyed out, not clickable, not purchasable)
 *
 * @param isActive - Whether the category is active (from API is_active)
 * @param seatsAvailable - Number of available seats (from API)
 * @param showOnFrontend - Whether the category is purchasable on frontend (from API show_on_frontend)
 * @returns true if the category should be shown as SOLD OUT / NOT PURCHASABLE
 */
export function isSoldOut(
  isActive: boolean | undefined,
  seatsAvailable: number,
  showOnFrontend?: boolean
): boolean {
  // If is_active is explicitly false, it's not purchasable (CLOSED)
  if (isActive === false) return true;
  // If show_on_frontend is explicitly false, it's not purchasable (SOLD OUT / Legacy)
  if (showOnFrontend === false) return true;
  // If no seats available, it's not purchasable
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

  logger.log(`[API FETCH] Requesting: ${url}`);
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
    logger.log(`[API FETCH] Response: ${response.status} in ${elapsed}ms`);

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    const elapsed = Date.now() - startTime;

    // Provide specific error messages for common issues
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        logger.error(`[API FETCH] TIMEOUT after ${elapsed}ms: ${url}`);
        throw new Error(`API timeout after ${timeout}ms - is Django server running?`);
      }
      if (error.message.includes('fetch')) {
        logger.error(`[API FETCH] NETWORK ERROR after ${elapsed}ms: ${url}`);
        logger.error(`[API FETCH] Is Django running at ${API_BASE_URL}?`);
        throw new Error(`Network error - Django server unreachable at ${API_BASE_URL}`);
      }
    }

    logger.error(`[API FETCH] ERROR after ${elapsed}ms:`, error);
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
      logger.warn('[API] Health check failed:', response.status);
      return { available: false, useDjangoPrices: false, useDjangoAvailability: false };
    }

    const data: APIHealthResponse = await response.json();

    return {
      available: data.status === 'ok',
      useDjangoPrices: data.use_django_prices ?? false,
      useDjangoAvailability: data.use_django_availability ?? false,
    };
  } catch (error) {
    logger.warn('[API] Health check error:', error);
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
    logger.error('[API] FATAL: No API URL configured - Django API is required for prices');
    return { data: null, fallback: true, error: 'API_URL_NOT_CONFIGURED' };
  }

  // DJANGO API - SINGLE SOURCE OF TRUTH
  // No fallback to static data - if API fails, UI must show error
  try {
    let eventsUrl = `${API_BASE_URL}/api/events/`;
    if (SITE_CODE) {
      eventsUrl += `?site_code=${encodeURIComponent(SITE_CODE)}`;
    }

    const response = await fetchWithTimeout(eventsUrl);

    if (!response.ok) {
      logger.error('[API] Events fetch FAILED:', response.status);
      return { data: null, fallback: true, error: `HTTP ${response.status}` };
    }

    const json = await response.json();

    if (json.fallback === true) {
      logger.error('[API] Server returned fallback - this should not happen');
      return { data: null, fallback: true, error: 'SERVER_RETURNED_FALLBACK' };
    }

    // Transform API response - THESE ARE THE AUTHORITATIVE PRICES
    const results = json.results || json;
    const djangoEvents: Event[] = results.map((e: APIEvent) => {
      const slug = e.slug || `event-${e.id}`;  // Fallback for legacy support

      // Validate against reserved slugs (SEO_ARCHITECTURE §12.3)
      if (isReservedSlug(slug)) {
        logger.error(
          `[API CLIENT] Reserved slug detected: "${slug}" (Event ID: ${e.id}). ` +
          `This slug conflicts with static routes and must be changed in CRM.`
        );
      }

      return {
        id: e.id,
        slug,
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
      };
    });

    // Log each event with price source for audit trail
    logger.log(`[API] Loaded ${djangoEvents.length} events from Django API (SINGLE SOURCE OF TRUTH)`);
    djangoEvents.forEach(e => {
      logger.log(`[PRICE] Event ${e.id} "${e.title}" (slug: ${e.slug}): $${e.minPrice} (source: Django API)`);
    });

    return { data: djangoEvents, fallback: false };

  } catch (error) {
    logger.error('[API] Events fetch ERROR - UI must show error state:', error);
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
 * VISIBILITY & AVAILABILITY RULES:
 * - ALL categories are returned (including show_on_frontend=false)
 * - show_on_frontend=false: Visible but DISABLED (greyed out, not clickable, not purchasable)
 * - is_active=false OR seats_available=0: Also shown as SOLD OUT
 *
 * IMPORTANT: show_on_frontend=false does NOT mean hidden!
 * It means visible but disabled (sold out / legacy category).
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
  showOnFrontend: boolean;
}[]>> {
  // No API URL configured
  if (!API_BASE_URL) {
    logger.error('[API] FATAL: No API URL configured - Django API is required for category prices');
    return { data: null, fallback: true, error: 'API_URL_NOT_CONFIGURED' };
  }

  // DJANGO API - SINGLE SOURCE OF TRUTH
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/api/events/${eventId}/categories/`);

    if (!response.ok) {
      logger.error('[API] Categories fetch FAILED:', response.status);
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
        logger.error('[API] Categories response has unknown structure:', JSON.stringify(json).slice(0, 200));
        return { data: null, fallback: true, error: 'UNKNOWN_RESPONSE_STRUCTURE' };
      }
    } else {
      // Null, undefined, or primitive - invalid response
      logger.error('[API] Categories response is not an array or object:', typeof json);
      return { data: null, fallback: true, error: 'INVALID_RESPONSE_TYPE' };
    }

    logger.log(`[API NORMALIZED] categories count: ${categories.length}`);

    // IMPORTANT: Do NOT filter out show_on_frontend=false categories
    // They should be visible but disabled (greyed out, not clickable, not purchasable)
    // Frontend uses showOnFrontend flag to determine availability
    const djangoCategories = categories.map(c => ({
      id: String(c.id),
      name: c.name,
      price: typeof c.price === 'number' ? c.price : (parseFloat(c.price) || 0),
      color: c.color || '#888888',
      seatsLeft: c.seats_available ?? c.seats_left ?? 0,
      isActive: c.is_active ?? true,
      showOnFrontend: c.show_on_frontend ?? true,
    }));

    // Log each category with price source for audit trail
    logger.log(`[API] Event ${eventId} categories loaded from Django (SINGLE SOURCE OF TRUTH):`);
    logger.log(`[API] Total: ${categories.length}`);
    djangoCategories.forEach(c => {
      const notPurchasable = isSoldOut(c.isActive, c.seatsLeft, c.showOnFrontend);
      logger.log(`[PRICE] Category "${c.name}": $${c.price} ${notPurchasable ? '(NOT PURCHASABLE)' : ''} [isActive=${c.isActive}, showOnFrontend=${c.showOnFrontend}]`);
    });

    return { data: djangoCategories, fallback: false };

  } catch (error) {
    logger.error('[API] Categories fetch ERROR - UI must show error state:', error);
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
  logger.log(`[API] fetchEventBySlug called with: "${slugOrId}"`);
  logger.log(`[API] API_BASE_URL = "${API_BASE_URL}"`);

  if (!API_BASE_URL) {
    const errorMsg = 'NEXT_PUBLIC_API_BASE_URL is not configured. Check .env.local file.';
    logger.error('[API] FATAL:', errorMsg);
    return { data: null, fallback: true, error: errorMsg };
  }

  const url = `${API_BASE_URL}/api/events/${slugOrId}/`;
  logger.log(`[API] Full URL: ${url}`);

  try {
    // API supports both slug and ID lookup
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      const errorMsg = `HTTP ${response.status} - ${response.status === 404 ? 'Event not found' : 'Server error'}`;
      logger.error('[API] Event fetch FAILED:', errorMsg);
      return { data: null, fallback: true, error: errorMsg };
    }

    const e: APIEvent = await response.json();

    const slug = e.slug || `event-${e.id}`;

    // Validate against reserved slugs (SEO_ARCHITECTURE §12.3)
    if (isReservedSlug(slug)) {
      logger.error(
        `[API CLIENT] Reserved slug detected: "${slug}" (Event ID: ${e.id}). ` +
        `This slug conflicts with static routes and must be changed in CRM.`
      );
    }

    const event: Event = {
      id: e.id,
      slug,
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

    logger.log(`[API] SUCCESS: Fetched event "${event.title}" (slug: ${event.slug}, id: ${event.id}, soldOut: ${event.isSoldOut})`);
    return { data: event, fallback: false };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error('[API] Event fetch ERROR:', errorMsg);
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
 * Get current API configuration status
 */
export function getAPIConfig(): {
  baseUrl: string;
  timeout: number;
} {
  return {
    baseUrl: API_BASE_URL,
    timeout: API_TIMEOUT,
  };
}
