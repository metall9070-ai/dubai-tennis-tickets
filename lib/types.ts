/**
 * Shared type definitions.
 * Extracted to break circular dependency between api.ts and components/Events.tsx
 */

export interface Event {
  id: number | string;
  slug: string;
  type: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  minPrice: number | null;
  isSoldOut: boolean;
  tournamentSlug?: string;
  venue?: string;
}
