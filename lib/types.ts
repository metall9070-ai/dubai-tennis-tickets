/**
 * Shared type definitions.
 * Extracted to break circular dependency between api.ts and components/Events.tsx
 */

export interface Event {
  id: number | string;
  slug: string;
  type: 'WTA' | 'ATP';
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  minPrice: number;
  tournamentSlug?: string;
}
