/**
 * buildMetadata — universal per-page metadata builder.
 *
 * Architecture contract (seo_architecture.md §3B, §12.4, canon_frontend_rules.md §14.2):
 * - openGraph.url is ALWAYS equal to canonical (self-referential)
 * - canonical is ALWAYS built from NEXT_PUBLIC_SITE_URL + path
 * - No fallback to other site configs
 * - No hardcoded brand or domain
 * - No API data used for metadata
 * - metadataBase lives in layout.tsx only — this builder uses relative paths
 *   so Next.js resolves them against metadataBase automatically
 */

import type { Metadata } from 'next'
import type { SiteConfig } from '@/lib/site-config'
import { getSiteConfig, getSiteUrl } from '@/lib/site-config'

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export interface BuildMetadataOptions {
  /** Absolute path for this page, e.g. "/faq" or "/tickets/atp" */
  path: string
  /** Page-level title. Will be used as-is (no brand appended here). */
  title: string
  /** Page-level description. */
  description: string
  /** Optional override og:image URL. Falls back to siteConfig.ogImage. */
  ogImage?: string
  /** Set true to add robots: noindex, nofollow */
  noindex?: boolean
  /** Additional keywords */
  keywords?: string
  /** Override siteConfig — used when caller already resolved config */
  siteConfig?: SiteConfig
}

/* ------------------------------------------------------------------ */
/*  Builder                                                             */
/* ------------------------------------------------------------------ */

export function buildMetadata(options: BuildMetadataOptions): Metadata {
  const {
    path,
    title,
    description,
    ogImage,
    noindex = false,
    keywords,
    siteConfig: configOverride,
  } = options

  // Always resolved from site-config — never hardcoded, never from API
  const config = configOverride ?? getSiteConfig()
  const siteUrl = getSiteUrl()

  // Self-referential canonical and og:url — always matches current page
  // Uses absolute URL to guarantee correctness regardless of metadataBase
  const pageUrl = `${siteUrl}${path}`

  // og:image priority: explicit override > site-level ogImage > nothing
  const resolvedOgImage = ogImage ?? config.ogImage

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    alternates: {
      // Self-referential canonical (seo_architecture.md §12.4)
      canonical: pageUrl,
    },
    openGraph: {
      type: 'website',
      // og:url MUST equal canonical — always (seo_architecture.md §3B)
      url: pageUrl,
      title,
      description,
      ...(resolvedOgImage ? { images: [resolvedOgImage] } : {}),
      locale: 'en_US',
      siteName: config.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(resolvedOgImage ? { images: [resolvedOgImage] } : {}),
    },
  }
}
