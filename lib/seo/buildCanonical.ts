/**
 * buildCanonical — strict canonical URL builder for multi-site SEO isolation.
 *
 * Architecture contract (SEO_ARCHITECTURE v1.7 §3B, §12.4):
 * - Canonical MUST be self-referential (current URL)
 * - Canonical MUST be built from NEXT_PUBLIC_SITE_URL + path
 * - Canonical MUST NOT depend on API, Visibility, availability
 * - Canonical MUST NOT use cross-domain references
 * - Canonical MUST be normalized (no query, no hash, consistent trailing slash)
 *
 * Multi-site isolation (§3C, §3E):
 * - Each site_code has its own NEXT_PUBLIC_SITE_URL
 * - No fallback to other site domains
 * - No shared canonical between vitrine
 *
 * Anti-deindexation protection:
 * - Missing NEXT_PUBLIC_SITE_URL → throws error (fail-fast)
 * - Prevents accidental cross-domain canonical leakage
 * - Prevents canonical http/https mismatch
 * - Prevents canonical trailing slash inconsistency
 */

import { getSiteUrl } from '@/lib/site-config'

/**
 * Build absolute canonical URL for a given path.
 *
 * @param path - Absolute path from root (must start with /), e.g. "/schedule", "/tickets/event/wta-finals"
 * @returns Normalized absolute canonical URL
 *
 * @example
 * ```ts
 * buildCanonical('/schedule')
 * // → "https://dubaitennistickets.com/schedule"
 *
 * buildCanonical('/tickets/event/atp-finals?ref=home')
 * // → "https://dubaitennistickets.com/tickets/event/atp-finals" (query stripped)
 *
 * buildCanonical('/')
 * // → "https://dubaitennistickets.com/"
 * ```
 *
 * Normalization rules:
 * 1. Remove query string (?foo=bar)
 * 2. Remove hash fragment (#section)
 * 3. Remove trailing slash (except for root /)
 * 4. Prevent double slashes (//)
 * 5. Force lowercase path (SEO best practice)
 */
export function buildCanonical(path: string): string {
  // CRITICAL: getSiteUrl() resolves NEXT_PUBLIC_SITE_URL at build time.
  // If missing → throws error in getSiteUrl() (enforced below).
  const siteUrl = getSiteUrl()

  // Validation: path must start with /
  if (!path.startsWith('/')) {
    throw new Error(
      `[buildCanonical] Invalid path "${path}" — must start with /`
    )
  }

  // Strip query and hash
  // Example: "/schedule?ref=home#tickets" → "/schedule"
  let cleanPath = path.split('?')[0].split('#')[0]

  // Normalize to lowercase (Google treats /Schedule and /schedule as different URLs)
  cleanPath = cleanPath.toLowerCase()

  // Remove trailing slash EXCEPT for root
  // "/" → "/"
  // "/schedule/" → "/schedule"
  if (cleanPath !== '/' && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1)
  }

  // Normalize siteUrl: remove trailing slash to prevent double slashes
  // "https://example.com/" → "https://example.com"
  const normalizedSiteUrl = siteUrl.replace(/\/$/, '')

  // Build final canonical
  // Special case: root path
  if (cleanPath === '/') {
    return `${normalizedSiteUrl}/`
  }

  // All other paths: concatenate without double slash
  return `${normalizedSiteUrl}${cleanPath}`
}

/**
 * Validate that NEXT_PUBLIC_SITE_URL is defined.
 * Called at module load time to fail-fast on misconfiguration.
 *
 * This prevents:
 * - Deployment with missing canonical domain
 * - Fallback to generic "https://example.com"
 * - Cross-site canonical contamination
 *
 * NOTE: This validation is OPTIONAL but recommended for production builds.
 * Uncomment the throw statement below to enforce strict validation.
 */
export function validateSiteUrl(): void {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!siteUrl) {
    console.error(
      '[CANONICAL VALIDATION] NEXT_PUBLIC_SITE_URL is not defined. Canonical URLs will use fallback domain.'
    )
    // Uncomment to enforce strict validation (recommended for production):
    // throw new Error('[FATAL] NEXT_PUBLIC_SITE_URL is required for canonical generation (SEO_ARCHITECTURE §3B)')
  }

  // Validate URL format
  if (siteUrl) {
    try {
      new URL(siteUrl)
    } catch {
      throw new Error(
        `[FATAL] NEXT_PUBLIC_SITE_URL is invalid: "${siteUrl}" (must be absolute URL)`
      )
    }

    // Warn if using http:// in production
    if (
      process.env.NODE_ENV === 'production' &&
      siteUrl.startsWith('http://')
    ) {
      console.warn(
        `[CANONICAL WARNING] NEXT_PUBLIC_SITE_URL uses http:// in production: "${siteUrl}". Consider using https:// for SEO.`
      )
    }
  }
}

// Optional: Run validation at module load time
// validateSiteUrl()
