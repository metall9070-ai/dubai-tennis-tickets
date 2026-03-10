'use client';

import Image from 'next/image';
import { getSiteConfig } from '@/lib/site-config';

// Venue → image mapping (reuses existing assets in /public/)
const VENUE_IMAGES: Record<string, string> = {
  'dubai duty free tennis stadium': '/images/dubai-duty-free-tennis-stadium.jpg',
  'dubai tennis stadium': '/images/dubai-duty-free-tennis-stadium.jpg',
  'lusail stadium': '/images/lusail-stadium-hero.webp',
  'lusail iconic stadium': '/images/lusail-stadium-hero.webp',
  'jassim bin hamad stadium': '/jassim-stadium.png',
  'jassim bin hammad stadium': '/jassim-stadium.png',
  'ahmad bin ali stadium': '/ahmad-bin-ali-stadium.png',
};

function getVenueImage(venue?: string): string | null {
  if (!venue) return null;
  const key = venue.toLowerCase().trim();
  // Exact match first
  if (VENUE_IMAGES[key]) return VENUE_IMAGES[key];
  // Partial match — check if venue name contains or is contained by any pattern
  for (const [pattern, image] of Object.entries(VENUE_IMAGES)) {
    if (key.includes(pattern) || pattern.includes(key)) return image;
  }
  // Keyword match — first significant word (skip common words)
  const keywords = key.split(/\s+/).filter(w => w.length > 3 && !['stadium', 'arena', 'centre', 'center'].includes(w));
  for (const [pattern, image] of Object.entries(VENUE_IMAGES)) {
    for (const kw of keywords) {
      if (pattern.includes(kw)) return image;
    }
  }
  return null;
}

interface TeamInfo {
  team1: string;
  team2: string;
  team1Code: string;
  team2Code: string;
}

interface EventHeroProps {
  event: {
    title?: string;
    date?: string;
    day?: string;
    month?: string;
    time?: string;
    venue?: string;
    isSoldOut?: boolean;
  };
  teamInfo?: TeamInfo | null;
  displayVenue?: string;
  onHome: () => void;
  onBack: () => void;
}

export default function EventHero({ event, teamInfo, displayVenue, onHome, onBack }: EventHeroProps) {
  const siteConfig = getSiteConfig();
  const hasTopDisclaimer = !!siteConfig.topDisclaimer;

  // Resolve hero image: venue-specific → site-config hero → null
  const venueImage = getVenueImage(event.venue || displayVenue);
  const heroImage = venueImage || siteConfig.hero?.image || null;

  return (
    <section
      className={`relative w-full overflow-hidden bg-[#1d1d1f] ${hasTopDisclaimer ? 'pt-[32px]' : ''}`}
      style={{ minHeight: '340px' }}
    >
      {/* Background image */}
      {heroImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt={`${event.title || 'Event'} — ${displayVenue || event.venue || siteConfig.brand}`}
            fill
            priority
            quality={80}
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80 z-10" />
        </div>
      )}

      {/* No-image fallback gradient */}
      {!heroImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d1d1f] via-[#2d2d3f] to-[#1d1d1f]" />
      )}

      {/* Content — flex column, breadcrumbs top, event info bottom */}
      <div className="relative z-20 max-w-[1200px] mx-auto px-4 md:px-6 flex flex-col justify-between" style={{ minHeight: 'inherit' }}>
        {/* Breadcrumbs — top, right under header */}
        <nav className="flex items-center space-x-1.5 md:space-x-2 text-[13px] md:text-[15px] font-medium text-white/80 pt-14 md:pt-16">
          <button onClick={onHome} className="hover:text-white transition-colors whitespace-nowrap">
            Home
          </button>
          <span>/</span>
          <button onClick={onBack} className="hover:text-white transition-colors whitespace-nowrap">
            Tickets
          </button>
          <span>/</span>
          <span className="font-semibold truncate max-w-[200px] md:max-w-none">
            {event.title || 'Event'}
          </span>
        </nav>

        {/* Event info — pushed to bottom */}
        <div className="pb-8 md:pb-10">
          {/* Event title */}
          {teamInfo ? (
            <div className="flex items-center gap-3 md:gap-4 flex-wrap mb-4 md:mb-5">
              <div className="flex items-center gap-2">
                <img
                  src={`https://flagcdn.com/w80/${teamInfo.team1Code}.png`}
                  alt={teamInfo.team1}
                  width={80}
                  height={60}
                  className="w-7 h-5 md:w-10 md:h-7 object-cover rounded shadow-sm border border-white/20"
                />
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                  {teamInfo.team1}
                </h1>
              </div>
              <span className="text-base md:text-lg font-bold text-white/40">VS</span>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white">
                  {teamInfo.team2}
                </h1>
                <img
                  src={`https://flagcdn.com/w80/${teamInfo.team2Code}.png`}
                  alt={teamInfo.team2}
                  width={80}
                  height={60}
                  className="w-7 h-5 md:w-10 md:h-7 object-cover rounded shadow-sm border border-white/20"
                />
              </div>
            </div>
          ) : (
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-white mb-4 md:mb-5 leading-tight">
              {event.title || 'Event'}
            </h1>
          )}

          {/* Event meta: date, time, venue */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5 text-white/80 text-[13px] md:text-[15px] font-medium">
            {event.date && event.month && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{event.date} {event.month}{event.day ? `, ${event.day}` : ''}</span>
              </div>
            )}
            {event.time && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{event.time}</span>
              </div>
            )}
            {displayVenue && (
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{displayVenue}</span>
              </div>
            )}
          </div>

          {/* Sold out badge */}
          {event.isSoldOut && (
            <span className="inline-flex items-center mt-4 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-full border border-white/10">
              Sold out
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
