'use client';

import React from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface FootballEventHeaderProps {
  h1: string;
  eventDate?: string;
  eventTime?: string;
}

/**
 * Football Event Header for Finalissima events
 * Parses H1 to extract teams and venue, displays with flags and venue icon
 *
 * Example H1 formats:
 * - "Qatar vs Argentina — March 31, 2026, Lusail Stadium"
 * - "Serbia vs Saudi Arabia — March 30, 2026, Al Janoub Stadium"
 */
export const FootballEventHeader: React.FC<FootballEventHeaderProps> = ({
  h1,
  eventDate,
  eventTime,
}) => {
  // Parse H1 to extract teams, date, and venue
  // Format: "Team1 vs Team2 — Date, Venue"
  const parseEventInfo = (h1Text: string) => {
    // Extract teams (before "—")
    const teamsPart = h1Text.split('—')[0]?.trim() || '';
    const teams = teamsPart.includes('vs')
      ? teamsPart.split('vs').map(t => t.trim())
      : teamsPart.includes(' - ')
      ? teamsPart.split(' - ').map(t => t.trim())
      : [];

    // Extract venue (after last comma)
    const lastCommaIndex = h1Text.lastIndexOf(',');
    const venue = lastCommaIndex !== -1 ? h1Text.substring(lastCommaIndex + 1).trim() : '';

    // Extract date (between "—" and last comma)
    const dashIndex = h1Text.indexOf('—');
    const datePart = (dashIndex !== -1 && lastCommaIndex !== -1)
      ? h1Text.substring(dashIndex + 1, lastCommaIndex).trim()
      : '';

    return {
      team1: teams[0] || '',
      team2: teams[1] || '',
      venue,
      date: datePart,
    };
  };

  const { team1, team2, venue, date } = parseEventInfo(h1);

  // Map team names to country codes for flags
  const getCountryCode = (teamName: string): string => {
    const codeMap: Record<string, string> = {
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
    return codeMap[teamName] || 'un'; // 'un' for unknown/United Nations flag as fallback
  };

  const team1Code = getCountryCode(team1);
  const team2Code = getCountryCode(team2);

  // If we can't parse teams, fall back to simple H1
  if (!team1 || !team2) {
    return (
      <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold tracking-tight mb-8 sm:mb-10 md:mb-12 leading-tight">
        {h1}
      </h1>
    );
  }

  return (
    <div className="mb-8 sm:mb-10 md:mb-12">
      {/* Teams Section with Flags */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-6">
        {/* Team 1 */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-12 h-9 md:w-16 md:h-12 rounded-lg overflow-hidden shadow-md border border-slate-200">
            <img
              src={`https://flagcdn.com/w160/${team1Code}.png`}
              alt={team1}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-[#1d1d1f] tracking-tight">
            {team1}
          </span>
        </div>

        {/* VS Badge */}
        <div className="px-4 py-2 bg-slate-100 rounded-xl text-[14px] md:text-[16px] font-black text-slate-400 uppercase tracking-widest border border-slate-200">
          VS
        </div>

        {/* Team 2 */}
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-[24px] md:text-[32px] lg:text-[40px] font-bold text-[#1d1d1f] tracking-tight">
            {team2}
          </span>
          <div className="w-12 h-9 md:w-16 md:h-12 rounded-lg overflow-hidden shadow-md border border-slate-200">
            <img
              src={`https://flagcdn.com/w160/${team2Code}.png`}
              alt={team2}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Event Details */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-[#86868b] text-[14px] md:text-[16px] font-medium">
        {/* Date */}
        {date && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
            <span>{date}</span>
          </div>
        )}

        {/* Separator */}
        {date && eventTime && (
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
        )}

        {/* Time */}
        {eventTime && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
            <span>{eventTime}</span>
          </div>
        )}

        {/* Separator */}
        {(date || eventTime) && venue && (
          <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
        )}

        {/* Venue */}
        {venue && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-primary)]" />
            <span className="font-semibold text-[#1d1d1f]">{venue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FootballEventHeader;
