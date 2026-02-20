import type { EventSEO } from '@/types/seo'

/**
 * Load event-level SEO content from /content/{site_code}/events/{slug}.ts
 *
 * Returns null if file doesn't exist (no fallback to other sites).
 * Frontend-only. CRM does not store SEO.
 *
 * @param siteCode - Site identifier (e.g., "finalissima", "tennis")
 * @param slug - Event slug (e.g., "argentina-spain-finalissima-2026-mar-27")
 * @returns EventSEO object or null if file missing
 */
export async function loadEventSEO(
  siteCode: string,
  slug: string
): Promise<EventSEO | null> {
  try {
    const eventContent = await import(`@/content/${siteCode}/events/${slug}`)
    return eventContent.eventSEO as EventSEO
  } catch {
    // No fallback — return null if file missing
    // Page will render without SEO block
    return null
  }
}
