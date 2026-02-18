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

export type SEOContent = {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  og?: { title?: string; description?: string; image?: string }
  h1?: string
  heroImage?:       string     // URL of hero background image (HTTPS required)
  heroAlt?:         string     // alt text for hero; falls back to h1
  breadcrumbLabel?: string     // current page label in breadcrumbs (e.g. "Venue & Directions")
  stats?:           StatItem[] // infographic stats grid; recommended max 4 items
  sections?: SEOSection[]
  faq?: FAQItem[]
  cta?: { text: string; href: string }
  internalLinks?: InternalLink[]
}
