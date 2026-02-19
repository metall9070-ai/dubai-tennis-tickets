import fs from "fs"
import path from "path"
import { MetadataRoute } from "next"
import { fetchEventsServer } from "@/lib/api-server"
import { getSiteUrl } from "@/lib/site-config"

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || "default"
// Use getSiteUrl() — same source as buildMetadata() — guarantees no trailing slash
// and prevents URL rsynch between sitemap and canonical.
const SITE_URL = getSiteUrl()

/**
 * Known page candidates with SEO priority.
 * Included in sitemap ONLY if /content/{site_code}/{key}.ts exists.
 */
const STATIC_PAGES: Record<
  string,
  { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }
> = {
  // key = content filename stem (without .ts)
  // path = actual Next.js route — MUST match app/ directory structure exactly
  homepage:              { path: "/",                      priority: 1.0, changeFrequency: "weekly" },
  schedule:              { path: "/schedule",               priority: 0.9, changeFrequency: "weekly" },
  "about-tournament":    { path: "/about-tournament",       priority: 0.7, changeFrequency: "monthly" },
  venue:                 { path: "/venue",                  priority: 0.8, changeFrequency: "monthly" },
  faq:                   { path: "/faq",                    priority: 0.8, changeFrequency: "monthly" },
  "seating-guide":       { path: "/seating-guide",          priority: 0.7, changeFrequency: "monthly" },
  tournament:            { path: "/tournament",             priority: 0.7, changeFrequency: "monthly" },
  guarantee:             { path: "/guarantee",              priority: 0.6, changeFrequency: "monthly" },
  contact:               { path: "/contact",                priority: 0.6, changeFrequency: "monthly" },
  about:                 { path: "/about",                  priority: 0.6, changeFrequency: "monthly" },
  "terms-of-service":    { path: "/terms-of-service",       priority: 0.3, changeFrequency: "yearly" },
  "privacy-policy":      { path: "/privacy-policy",         priority: 0.3, changeFrequency: "yearly" },
  "payment-and-delivery":{ path: "/payment-and-delivery",   priority: 0.5, changeFrequency: "monthly" },
  "tickets-atp":         { path: "/tickets/atp",            priority: 0.9, changeFrequency: "weekly" },
  "tickets-wta":         { path: "/tickets/wta",            priority: 0.9, changeFrequency: "weekly" },
}

const STATIC_KEYS = new Set(Object.keys(STATIC_PAGES))

/**
 * Read content slugs from /content/{siteCode}/.
 * Returns filename stems (without .ts), excluding _ prefixed files.
 */
function getContentSlugs(siteCode: string): string[] {
  const dir = path.join(process.cwd(), "content", siteCode)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_"))
    .map((f) => f.replace(".ts", ""))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = getContentSlugs(SITE_CODE)

  // No content folder → fallback to homepage only
  if (slugs.length === 0) {
    return [{ url: `${SITE_URL}/`, lastModified: new Date(), priority: 1.0 }]
  }

  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // 1. Static pages — known candidates with assigned priority
  for (const [key, config] of Object.entries(STATIC_PAGES)) {
    if (slugs.includes(key)) {
      entries.push({
        url: `${SITE_URL}${config.path}`,
        lastModified: now,
        changeFrequency: config.changeFrequency,
        priority: config.priority,
      })
    }
  }

  // 2. Dynamic flat pages — everything else from content folder
  for (const slug of slugs) {
    if (STATIC_KEYS.has(slug)) continue
    entries.push({
      url: `${SITE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  }

  // 3. Event pages from API (backward compat for sites with /tickets/event/ routes)
  try {
    const events = await fetchEventsServer("")
    for (const event of events) {
      entries.push({
        url: `${SITE_URL}/tickets/event/${event.slug}`,
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      })
    }
  } catch {
    // API unavailable — skip event pages silently
  }

  return entries
}
