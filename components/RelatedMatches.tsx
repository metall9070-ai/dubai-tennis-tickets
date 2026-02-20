'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Event } from '@/lib/types';

interface RelatedMatchesProps {
  currentSlug: string;
  currentEvent?: Event | null;
}

/**
 * RelatedMatches component
 * Shows 3-5 events from the same tournament
 * Excludes current event
 * Improves internal linking and weight distribution
 */
const RelatedMatches: React.FC<RelatedMatchesProps> = ({ currentSlug, currentEvent }) => {
  const router = useRouter();
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRelatedEvents() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
        const response = await fetch(`${apiUrl}/events/`);

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        const events = data.events || [];

        // Filter: same tournament type, exclude current event, limit to 5
        const related = events
          .filter((event: Event) => {
            // Exclude current event
            if (event.slug === currentSlug || String(event.id) === currentSlug) {
              return false;
            }

            // If current event has type, match by type
            if (currentEvent?.type) {
              return event.type === currentEvent.type;
            }

            // Otherwise show any events
            return true;
          })
          .slice(0, 5);

        setRelatedEvents(related);
        setIsLoading(false);
      } catch (error) {
        console.error('[RelatedMatches] Error loading related events:', error);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {relatedEvents.map((event) => (
          <button
            key={event.id}
            onClick={() => router.push(`/tickets/event/${event.slug || event.id}`)}
            className="bg-[#f5f5f7] rounded-2xl p-5 md:p-6 text-left hover:bg-[#e8e8ed] transition-all group border border-transparent hover:border-[var(--color-primary)] active:scale-[0.98]"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                {event.title}
              </h3>
            </div>

            <div className="space-y-2">
              {event.venue && (
                <p className="text-[13px] md:text-[14px] text-[#86868b] flex items-center">
                  <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="truncate">{event.venue}</span>
                </p>
              )}

              {event.date && event.month && (
                <p className="text-[13px] md:text-[14px] text-[#86868b] flex items-center">
                  <svg className="w-4 h-4 mr-1.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>
                    {event.day && `${event.day}, `}{event.date} {event.month}
                  </span>
                </p>
              )}

              {event.minPrice && (
                <p className="text-[15px] md:text-[16px] font-semibold text-[var(--color-primary)] mt-3">
                  From ${event.minPrice}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RelatedMatches;
