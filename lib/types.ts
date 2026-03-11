/**
 * Shared type definitions for the WTI platform frontend.
 * All API response types and normalized frontend types live here.
 */

// ============================================================================
// NORMALIZED FRONTEND TYPES (camelCase)
// ============================================================================

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

export interface Category {
  id: string;
  name: string;
  price: number;
  color: string;
  seatsLeft: number;
  isActive?: boolean;
  showOnFrontend?: boolean;
}

// ============================================================================
// API RESPONSE TYPES (snake_case — mirrors Django REST API)
// ============================================================================

export interface APIEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  min_price: string | null;
  is_sold_out: boolean;
  type: string;
  venue: string;
  tournament_slug?: string;
  is_active?: boolean;
}

export interface APICategory {
  id: number | string;
  name: string;
  price: string | number;
  color?: string;
  seats_total?: number;
  seats_available?: number;
  seats_left: number;
  is_active?: boolean;
  show_on_frontend?: boolean;
}

export interface APIResponse<T> {
  data: T | null;
  fallback: boolean;
  error?: string;
}

