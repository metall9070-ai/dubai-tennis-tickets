export type SEOSection = {
  heading: string
  body: string
}

export type FAQItem = {
  question: string
  answer: string
}

export type InternalLink = {
  label: string
  sublabel?: string
  href: string
}

export type StatItem = {
  label: string
  value: string
}

export type HighlightItem = {
  icon: string   // emoji, e.g. "🏟️", "🚇", "☀️"
  title: string
  body: string
}

export type SEOContent = {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  og?: { title?: string; description?: string; image?: string }
  h1?: string
  heroImage?:       string     // URL of hero background image (HTTPS required)
  heroAlt?:         string     // alt text for hero; falls back to h1
  heroSubtitle?:    string     // subtitle line below h1 in hero (e.g. venue location)
  heroDescription?: string     // secondary description below subtitle in hero
  breadcrumbLabel?: string     // current page label in breadcrumbs (e.g. "Venue & Directions")
  stats?:           StatItem[]      // infographic stats grid; recommended max 4 items
  highlights?:      HighlightItem[] // icon cards grid; recommended max 6 items
  sections?: SEOSection[]
  faq?: FAQItem[]
  cta?: { text: string; href: string }
  internalLinks?: InternalLink[]
}

/**
 * Event-level SEO content.
 * Stored in /content/{site_code}/events/{slug}.ts
 * Frontend-only. CRM does not store SEO.
 */
export type EventSEO = {
  title: string              // Page title (<title> tag)
  description: string        // Meta description
  h1: string                // Main heading
  content: string           // HTML content (informational block)
  faq?: FAQItem[]           // Event-specific FAQ items
  jsonLd?: Record<string, unknown>  // Custom JSON-LD structured data
}
