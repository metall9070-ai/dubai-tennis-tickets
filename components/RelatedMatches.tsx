'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FootballEventCard } from './FootballEventCard';
import type { Event, APIEvent } from '@/lib/types';
import { logger } from '@/lib/logger';

interface RelatedMatchesProps {
  currentSlug: string;
  currentEvent?: Event | null;
}

/**
 * RelatedMatches component
 * Shows up to 3 events from the same site
 * Excludes current event
 * Uses the same FootballEventCard as the homepage
 */
const RelatedMatches: React.FC<RelatedMatchesProps> = ({ currentSlug, currentEvent }) => {
  const router = useRouter();
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRelatedEvents() {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || '';
        if (!apiBaseUrl) {
          setIsLoading(false);
          return;
        }
        const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || '';
        let eventsUrl = `${apiBaseUrl}/api/events/`;
        if (siteCode) {
          eventsUrl += `?site_code=${encodeURIComponent(siteCode)}`;
        }
        const response = await fetch(eventsUrl);

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        // API returns { results: [...] } (DRF pagination format)
        const events = (data.results || data.events || []).map((e: APIEvent) => ({
          ...e,
          minPrice: Math.round(Number(e.min_price || 0)) || undefined,
          isSoldOut: e.is_sold_out,
        }));

        // Filter: exclude current event, limit to 3
        const related = events
          .filter((event: Event) => {
            if (event.slug === currentSlug || String(event.id) === currentSlug) {
              return false;
            }
            return true;
          })
          .slice(0, 3);

        setRelatedEvents(related);
        setIsLoading(false);
      } catch (error) {
        logger.error('[RelatedMatches] Error loading related events:', error);
        setIsLoading(false);
      }
    }

    loadRelatedEvents();
  }, [currentSlug, currentEvent]);

  if (isLoading) {
    return null;
  }

  if (relatedEvents.length === 0) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 border-t border-[#f5f5f7]">
      <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-6 md:mb-8 tracking-tight">
        Other Matches
      </h2>

      <div className="flex flex-col gap-4 md:gap-5">
        {relatedEvents.map((event) => (
          <FootballEventCard
            key={event.id}
            event={event}
            onClick={() => router.push(`/tickets/event/${event.slug || event.id}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedMatches;
