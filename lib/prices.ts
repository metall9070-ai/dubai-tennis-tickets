// Server-side price configuration
// These prices are the source of truth - never trust client-sent prices

export const TICKET_PRICES = {
  // WTA (Women's) event prices
  WTA: {
    'prime-a': 650,
    'prime-b': 1200,
    'grandstand': 250,
  },
  // ATP (Men's) event prices
  ATP: {
    'prime-a': 750,
    'prime-b': 1400,
    'grandstand-lower': 350,
    'grandstand-upper': 200,
  },
} as const;

export type EventType = keyof typeof TICKET_PRICES;
export type WTACategoryId = keyof typeof TICKET_PRICES.WTA;
export type ATPCategoryId = keyof typeof TICKET_PRICES.ATP;
export type CategoryId = WTACategoryId | ATPCategoryId;

/**
 * Validates and returns the correct price for a ticket
 * Returns null if the category is invalid for the event type
 */
export function getValidatedPrice(
  eventType: string,
  categoryId: string
): number | null {
  const normalizedEventType = eventType.toUpperCase();

  if (normalizedEventType === 'WTA') {
    const price = TICKET_PRICES.WTA[categoryId as WTACategoryId];
    return price !== undefined ? price : null;
  }

  if (normalizedEventType === 'ATP') {
    const price = TICKET_PRICES.ATP[categoryId as ATPCategoryId];
    return price !== undefined ? price : null;
  }

  return null;
}

/**
 * Extracts event type from event title or ID
 * Returns 'ATP' or 'WTA' based on keywords
 */
export function detectEventType(eventTitle: string): EventType {
  const title = eventTitle.toUpperCase();
  if (title.includes('WTA') || title.includes('WOMEN')) {
    return 'WTA';
  }
  return 'ATP'; // Default to ATP for men's events
}
