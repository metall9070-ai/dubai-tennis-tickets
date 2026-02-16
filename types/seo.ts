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

export type SEOContent = {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  og?: { title?: string; description?: string; image?: string }
  h1?: string
  sections?: SEOSection[]
  faq?: FAQItem[]
  cta?: { text: string; href: string }
  internalLinks?: InternalLink[]
}
