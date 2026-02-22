/**
 * SLUG REDIRECT MAP
 *
 * Purpose: P1 SEO hardening — preserve link equity when event slugs change.
 *
 * Architecture compliance:
 * - SEO_ARCHITECTURE v1.6 §3: SEO is frontend-only
 * - CANON_FRONTEND_RULES v1.3 §14: Multi-site isolation
 * - No backend changes required
 * - No CRM SEO logic
 * - Site-specific redirect mapping
 *
 * Usage:
 * When CRM admin changes event slug:
 *   OLD: /tickets/event/old-slug
 *   NEW: /tickets/event/new-slug
 *
 * Add mapping:
 *   "old-slug": "new-slug"
 *
 * Result:
 *   OLD URL → 301 redirect → NEW URL
 *
 * Behavior:
 * - Returns 301 (permanent redirect) for old slugs
 * - Preserves SEO equity and backlinks
 * - ISR-safe (cached redirect)
 * - Site-isolated (no cross-domain redirects)
 *
 * Maintenance:
 * - Add entries when slugs change
 * - Remove entries after sufficient time (e.g., 6-12 months)
 * - Keep historical mappings for long-lived backlinks
 *
 * IMPORTANT:
 * - This map is SITE-SPECIFIC
 * - Each frontend deployment maintains its own map
 * - Do NOT redirect across domains
 * - Do NOT redirect to reserved slugs
 */

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

/**
 * Slug redirect configuration per site.
 * Structure: { [site_code]: { [old_slug]: new_slug } }
 */
const SLUG_REDIRECTS_BY_SITE: Record<string, Record<string, string>> = {
  // Example for tennis site:
  // tennis: {
  //   "atp-finals-2025-old": "atp-finals-2026",
  //   "wimbledon-final-old": "wimbledon-final-2026",
  // },

  // Example for finalissima site:
  // finalissima: {
  //   "old-session-name": "new-session-name",
  // },
};

/**
 * Get new slug for a given old slug (site-specific).
 *
 * @param oldSlug - The old/previous slug to look up
 * @returns The new slug if redirect exists, null otherwise
 *
 * IMPORTANT: This function does NOT validate against reserved slugs.
 * Reserved slug validation happens in api-server.ts during event fetch.
 * Redirecting TO a reserved slug is a configuration error that will cause 404.
 */
export function getRedirectSlug(oldSlug: string): string | null {
  const siteRedirects = SLUG_REDIRECTS_BY_SITE[SITE_CODE];

  if (!siteRedirects) {
    return null;
  }

  return siteRedirects[oldSlug] || null;
}

/**
 * Check if slug has a redirect mapping.
 *
 * @param slug - The slug to check
 * @returns true if redirect exists for this slug
 */
export function hasRedirectMapping(slug: string): boolean {
  return getRedirectSlug(slug) !== null;
}
