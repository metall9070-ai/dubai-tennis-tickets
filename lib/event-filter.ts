/**
 * event-filter.ts — Unified event filtering layer
 *
 * Architecture rules:
 * - Site-config driven (CANON_FRONTEND_RULES §10)
 * - Read-only presentation filtering
 * - NO business logic
 * - NO Visibility coupling
 * - NO backend modifications
 * - Pure function - no side effects
 *
 * Purpose:
 * Enforces multi-site isolation (SEO_ARCHITECTURE §3C) by filtering events
 * based on site presentation policy (allowedEventTypes).
 *
 * Used by:
 * - Sitemap generation
 * - Homepage catalog
 * - Schedule page
 * - All event listing pages
 *
 * This eliminates cross-site contamination and enables infinite scaling
 * without conditional branching.
 */

import type { Event } from '@/lib/types'
import { getSiteConfig } from '@/lib/site-config'

/**
 * Filters events based on current site's presentation policy.
 *
 * This is NOT business logic - it's a presentation layer filter that determines
 * which events are SHOWN to users on this particular frontend deployment.
 *
 * The backend remains site-agnostic. The CRM stores all events.
 * This function only decides what THIS site displays.
 *
 * @param events - Array of events to filter
 * @returns Filtered events matching site policy
 *
 * SAFETY BEHAVIOR (fail-open, not fail-closed):
 * - If allowedEventTypes is undefined → returns ALL events (safe fallback)
 * - If allowedEventTypes is empty array → returns ALL events (safe fallback)
 * - If allowedEventTypes is defined → returns only matching events
 *
 * Production must fail-open to prevent empty pages due to misconfiguration.
 *
 * Examples:
 * - Tennis site (allowedEventTypes: ["ATP", "WTA"]) → shows only ATP/WTA events
 * - Football site (allowedEventTypes: ["FOOTBALL"]) → shows only FOOTBALL events
 * - Misconfigured site (no allowedEventTypes) → shows ALL events (safe)
 */
export function filterEventsForCurrentSite(events: Event[]): Event[] {
  const config = getSiteConfig()

  // SAFETY: If no policy defined → return events unchanged (fail-open)
  // This prevents production breakage if site-config is misconfigured
  if (!config.allowedEventTypes || config.allowedEventTypes.length === 0) {
    return events
  }

  // Filter events to only those matching site policy
  return events.filter(event =>
    config.allowedEventTypes!.includes(event.type)
  )
}

/**
 * Filters events by specific type (e.g., ATP, WTA).
 * Used for type-specific pages like /tickets/atp or /tickets/wta.
 *
 * SAFETY BEHAVIOR:
 * - If no policy defined → returns events of requested type (fail-open)
 * - If type is allowed → returns events of that type
 * - If type is NOT allowed → returns empty array
 *
 * This function is DEPRECATED for direct use.
 * Pages should filter by type FIRST, then apply site policy.
 *
 * @param events - Array of events to filter
 * @param type - Event type to filter by
 * @returns Filtered events matching the specific type
 */
export function filterEventsByType(events: Event[], type: string): Event[] {
  const config = getSiteConfig()

  // SAFETY: If no policy defined → filter by type only (fail-open)
  if (!config.allowedEventTypes || config.allowedEventTypes.length === 0) {
    return events.filter(event => event.type === type)
  }

  // If this type isn't allowed on this site, return empty
  if (!config.allowedEventTypes.includes(type)) {
    return []
  }

  // Filter to specific type
  return events.filter(event => event.type === type)
}
