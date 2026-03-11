/**
 * Country name → flag code mapping for flagcdn.com.
 * Single source of truth — used by all football event components.
 */

const COUNTRY_CODE_MAP: Record<string, string> = {
  'Argentina': 'ar',
  'Spain': 'es',
  'Brazil': 'br',
  'Germany': 'de',
  'France': 'fr',
  'Italy': 'it',
  'Portugal': 'pt',
  'Netherlands': 'nl',
  'England': 'gb-eng',
  'Uruguay': 'uy',
  'Mexico': 'mx',
  'Japan': 'jp',
  'Qatar': 'qa',
  'Serbia': 'rs',
  'Saudi Arabia': 'sa',
  'Egypt': 'eg',
  'United States': 'us',
  'Belgium': 'be',
  'Croatia': 'hr',
  'Denmark': 'dk',
  'Morocco': 'ma',
  'South Korea': 'kr',
};

/** Returns the flagcdn.com country code for a team name, or 'un' if not found. */
export function getCountryCode(teamName: string): string {
  return COUNTRY_CODE_MAP[teamName] || 'un';
}
