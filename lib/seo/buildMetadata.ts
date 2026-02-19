/**
 * buildMetadata — universal per-page metadata builder.
 *
 * Architecture contract (seo_architecture.md §3B, §12.4, canon_frontend_rules.md §14.2):
 * - openGraph.url is ALWAYS equal to canonical (self-referential)
 * - canonical is ALWAYS built from NEXT_PUBLIC_SITE_URL + path
 * - No fallback to other site configs
 * - No hardcoded brand or domain
 * - No API data used for metadata
 * - metadataBase lives in layout.tsx only
 *
 * og:image 3-level fallback (guaranteed — never omitted):
 *   1. page-level ogImage (passed into buildMetadata)
 *   2. site-config ogImage
 *   3. ${siteUrl}/og/default.jpg  — absolute, per-site, no external domain
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
  /** Optional override og:image URL. Falls back to siteConfig.ogImage, then /og/default.jpg. */
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

  // og:image — 3-level fallback, always resolves to an absolute URL:
  //   1. page-level ogImage param
  //   2. site-config ogImage (per-site, set in site-config.ts)
  //   3. ${siteUrl}/og/default.jpg — absolute, uses current site domain, no external dependency
  const resolvedOgImage =
    ogImage ??
    config.ogImage ??
    `${siteUrl}/og/default.jpg`

  // DEV-only warning when a storefront has no ogImage configured.
  // Does NOT throw — purely diagnostic.
  if (!config.ogImage && process.env.NODE_ENV === 'development') {
    console.warn(
      `[SEO WARNING] Missing ogImage in site-config for "${config.brand}". Using neutral fallback: ${siteUrl}/og/default.jpg`
    )
  }

  // og:image object with explicit dimensions — always present, never conditional
  const ogImageEntry = {
    url: resolvedOgImage,
    width: 1200,
    height: 630,
  }

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
      images: [ogImageEntry],
      locale: 'en_US',
      siteName: config.brand,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [resolvedOgImage],
    },
  }
}
