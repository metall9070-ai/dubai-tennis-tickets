import type { EventSEO } from '@/types/seo'

/**
 * Load event-level SEO content from /content/{site_code}/events/{slug}.ts
 *
 * Returns null if file doesn't exist (no fallback to other sites).
 * Frontend-only. CRM does not store SEO.
 *
 * Uses explicit imports to ensure Webpack bundles all event files correctly.
 * Dynamic imports with template literals don't work reliably in production.
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
    // Explicit imports for Webpack static analysis
    // This ensures all event SEO files are included in the production bundle
    if (siteCode === 'finalissima') {
      switch (slug) {
        case 'argentina-spain-finalissima-2026-mar-27': {
          const mod = await import('@/content/finalissima/events/argentina-spain-finalissima-2026-mar-27')
          return mod.eventSEO
        }
        case 'qatar-argentina-mar-31': {
          const mod = await import('@/content/finalissima/events/qatar-argentina-mar-31')
          return mod.eventSEO
        }
        case 'qatar-serbia-mar-26': {
          const mod = await import('@/content/finalissima/events/qatar-serbia-mar-26')
          return mod.eventSEO
        }
        case 'saudi-arabia-egypt-mar-26': {
          const mod = await import('@/content/finalissima/events/saudi-arabia-egypt-mar-26')
          return mod.eventSEO
        }
        case 'serbia-saudi-arabia-mar-30': {
          const mod = await import('@/content/finalissima/events/serbia-saudi-arabia-mar-30')
          return mod.eventSEO
        }
        case 'egypt-spain-mar-30': {
          const mod = await import('@/content/finalissima/events/egypt-spain-mar-30')
          return mod.eventSEO
        }
        default:
          return null
      }
    }

    // Add other site codes here as needed
    // if (siteCode === 'tennis') { ... }

    return null
  } catch (error) {
    console.error(`[loadEventSEO] Failed to load SEO for ${siteCode}/${slug}:`, error)
    return null
  }
}
