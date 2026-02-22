/**
 * Reserved slugs that cannot be used for dynamic event/session slugs.
 *
 * These slugs correspond to static routes in /app and must be protected
 * to prevent routing conflicts (SEO_ARCHITECTURE §12.3).
 *
 * IMPORTANT: This list must be kept in sync with /app folder structure.
 * When adding new static routes, update this list.
 */

export const RESERVED_SLUGS = new Set<string>([
  // Static app routes
  'about',
  'actions',
  'api',
  'checkout',
  'contact',
  'faq',
  'payment-and-delivery',
  'privacy-policy',
  'schedule',
  'seating-guide',
  'terms-of-service',
  'tickets',
  'tournament',
  'venue',

  // Nested static routes
  'success',
  'cancel',

  // Additional reserved words (SEO_ARCHITECTURE §12.3)
  'about-tournament',  // Used by finalissima via [slug]
  'about-us',
  'guarantee',
  'admin',
]);

/**
 * Check if a slug is reserved and cannot be used for dynamic content.
 * @param slug - The slug to validate
 * @returns true if slug is reserved
 */
export function isReservedSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

/**
 * Validate event slug and throw error if reserved.
 * Use this in development/testing to catch CRM misconfigurations early.
 * @param slug - The event slug to validate
 * @throws Error if slug is reserved
 */
export function validateEventSlug(slug: string): void {
  if (isReservedSlug(slug)) {
    throw new Error(
      `Event slug "${slug}" is reserved and cannot be used. ` +
      `Reserved slugs: ${Array.from(RESERVED_SLUGS).join(', ')}`
    );
  }
}
