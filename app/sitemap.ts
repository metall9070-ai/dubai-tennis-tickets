/**
 * sitemap.ts — canonical sitemap for all public routes.
 *
 * Architecture rules (docs/SEO_ARCHITECTURE.md):
 * - Sitemap generated on frontend only.
 * - No dependency on visibility, availability, or backend SEO fields.
 * - No process.env direct usage — getSiteUrl() only.
 * - No hardcoded domains.
 * - Canonical URL === sitemap URL (both built from getSiteUrl() + path).
 * - Multi-site safe: getSiteUrl() resolves per-site at build time.
 */

import { MetadataRoute } from "next"
import { getSiteUrl, getSiteConfig } from "@/lib/site-config"
import { fetchEventsServer } from "@/lib/api-server"
import { filterEventsForCurrentSite } from "@/lib/event-filter"

const SITE_URL = getSiteUrl() // e.g. "https://dubaitennistickets.com" — no trailing slash

// ─────────────────────────────────────────────────────────────────────────────
// STATIC ROUTES
// All public pages that are always present regardless of content files.
// Must match actual app/ directory structure exactly.
// Excluded: /checkout, /checkout/*, /api/*, /admin/* (noindex or private).
// ─────────────────────────────────────────────────────────────────────────────

interface StaticRoute {
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}

const STATIC_ROUTES: StaticRoute[] = [
  { path: "/",                    priority: 1.0, changeFrequency: "weekly"  },
  { path: "/schedule",            priority: 0.9, changeFrequency: "weekly"  },
  { path: "/tickets/atp",         priority: 0.9, changeFrequency: "weekly"  },
  { path: "/tickets/wta",         priority: 0.9, changeFrequency: "weekly"  },
  { path: "/faq",                 priority: 0.8, changeFrequency: "monthly" },
  { path: "/venue",               priority: 0.8, changeFrequency: "monthly" },
  { path: "/tournament",          priority: 0.7, changeFrequency: "monthly" },
  { path: "/seating-guide",       priority: 0.7, changeFrequency: "monthly" },
  { path: "/about",               priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact",             priority: 0.6, changeFrequency: "monthly" },
  { path: "/payment-and-delivery",priority: 0.5, changeFrequency: "monthly" },
  { path: "/terms-of-service",    priority: 0.3, changeFrequency: "yearly"  },
  { path: "/privacy-policy",      priority: 0.3, changeFrequency: "yearly"  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SITEMAP GENERATOR
// ─────────────────────────────────────────────────────────────────────────────

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const seen = new Set<string>()
  const entries: MetadataRoute.Sitemap = []

  /**
   * Add entry only if URL has not been seen yet (deduplication).
   */
  function addEntry(
    path: string,
    opts: {
      priority: number
      changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
      lastModified?: Date
    }
  ) {
    // Guarantee: no double slashes, no trailing slash on non-root paths
    const url = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`

    if (seen.has(url)) return
    seen.add(url)

    entries.push({
      url,
      lastModified: opts.lastModified ?? now,
      changeFrequency: opts.changeFrequency,
      priority: opts.priority,
    })
  }

  // 1. Static routes — always included, no content-file dependency
  for (const route of STATIC_ROUTES) {
    addEntry(route.path, {
      priority: route.priority,
      changeFrequency: route.changeFrequency,
    })
  }

  // 2. Dynamic event pages from API — /tickets/event/{slug}
  //    fetchEventsServer('') skips visibility filter (SEO must not depend on visibility)
  //    Event filtering is done via unified filter layer (lib/event-filter.ts)
  //    (SEO_ARCHITECTURE §3C: Cross-Site SEO Isolation)
  //
  //    IMPORTANT: Sitemap is FAIL-CLOSED for SEO safety.
  //    - If allowedEventTypes is defined → include filtered events
  //    - If allowedEventTypes is missing → include NO events (prevents SEO contamination)
  //
  //    This differs from UI pages which are FAIL-OPEN (show all events if misconfigured).
  //    SEO safety and runtime stability are decoupled.
  try {
    const config = getSiteConfig()
    const allEvents = await fetchEventsServer("")

    // FAIL-CLOSED: Only include events if site policy is explicitly defined
    // This prevents cross-site SEO contamination if config is misconfigured
    // UI pages use filterEventsForCurrentSite() which is FAIL-OPEN
    const siteEvents =
      config.allowedEventTypes && config.allowedEventTypes.length > 0
        ? filterEventsForCurrentSite(allEvents)
        : []

    for (const event of siteEvents) {
      if (!event.slug) continue
      addEntry(`/tickets/event/${event.slug}`, {
        priority: 0.8,
        changeFrequency: "daily",
      })
    }
  } catch {
    // API unavailable at build time — skip event pages silently
    // Static pages are already included above
  }

  return entries
}
