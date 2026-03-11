'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import type { Event } from '@/lib/types';
import { getCountryCode } from '@/lib/country-codes';

interface FootballEventCardProps {
  event: Event;
  onClick: () => void;
}

/**
 * Football Event Card — standardized typography system
 *
 * Typography hierarchy (3 levels):
 *   Primary   → #1d1d1f, font-bold    (team names, price, date number)
 *   Secondary → #6e6e73, font-medium  (time, venue, labels, month, weekday)
 *   Accent    → var(--color-primary)   (event badge, CTA button)
 *
 * All icons inherit parent text color. No hardcoded brand colors.
 */
export const FootballEventCard: React.FC<FootballEventCardProps> = ({ event, onClick }) => {
  // Extract team data from event
  const teams = event.title?.includes('vs')
    ? event.title.split('vs').map(t => t.trim())
    : event.title?.includes(' - ')
    ? event.title.split(' - ').map(t => t.trim())
    : [event.title || 'Team 1', 'Team 2'];

  const team1 = teams[0] || 'Team 1';
  const team2 = teams[1] || 'Team 2';

  const team1Code = getCountryCode(team1);
  const team2Code = getCountryCode(team2);

  const formatDate = () => {
    if (!event.date || !event.month) {
      return { month: 'MAR', day: '27', weekday: 'Thu' };
    }
    return {
      month: event.month.toUpperCase(),
      day: event.date,
      weekday: event.day || 'Thu',
    };
  };

  const dateInfo = formatDate();

  const isFinalissimaEvent = (event.title?.toLowerCase().includes('argentina') && event.title?.toLowerCase().includes('spain')) ||
                              (event.title?.toLowerCase().includes('spain') && event.title?.toLowerCase().includes('argentina'));

  const hasValidPrice = event.minPrice != null && event.minPrice > 0;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleClick = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'view_item', {
        items: [{
          item_id: event.id,
          item_name: event.title,
          item_category: event.type,
          price: event.minPrice
        }]
      });
    }
    onClick();
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      className={`group relative bg-white rounded-[24px] md:rounded-[32px] border border-black/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 overflow-hidden w-full cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
    >

      {/* --- DESKTOP LAYOUT (lg and up) --- */}
      <div className="hidden lg:flex flex-row items-center p-0 h-[140px]">
        {/* Date Section */}
        <div className="flex flex-col items-center justify-center min-w-[110px] h-full bg-[#f5f5f7] border-r border-black/5 group-hover:bg-[#eee] transition-colors duration-500">
          <span className="text-[11px] font-medium text-[#6e6e73] uppercase tracking-wider leading-none">{dateInfo.month}</span>
          <span className="text-[36px] font-bold text-[#1d1d1f] leading-none mt-1">{dateInfo.day}</span>
          <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider leading-none mt-1.5">{dateInfo.weekday}</span>
        </div>

        {/* Match Info Section */}
        <div className="flex-grow flex flex-col gap-3 px-8">
          {/* Finalissima badge */}
          {isFinalissimaEvent && (
            <div className="text-center -mb-1">
              <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider">
                Finalissima 2026
              </span>
            </div>
          )}

          {/* Teams */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/w80/${team1Code}.png`}
                alt={team1}
                width={80}
                height={60}
                className="w-8 h-6 object-cover rounded border border-black/5"
              />
              <span className="text-lg font-bold text-[#1d1d1f]">{team1}</span>
            </div>
            <span className="text-[10px] font-medium text-[#6e6e73] uppercase tracking-wider">vs</span>
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/w80/${team2Code}.png`}
                alt={team2}
                width={80}
                height={60}
                className="w-8 h-6 object-cover rounded border border-black/5"
              />
              <span className="text-lg font-bold text-[#1d1d1f]">{team2}</span>
            </div>
          </div>

          {/* Meta Info — unified color */}
          <div className="flex items-center gap-5 text-[13px] font-medium text-[#6e6e73]">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.time || '19:00'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{event.venue || 'Lusail Stadium'}</span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-6 px-8 border-l border-black/5 h-full">
          {!event.isSoldOut && hasValidPrice && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-medium text-[#6e6e73] uppercase tracking-wider">From</span>
                <span className="text-[28px] font-bold text-[#1d1d1f] leading-none mt-0.5">${event.minPrice}</span>
              </div>
              <button
                className="px-6 py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-95 text-white rounded-xl font-semibold text-[13px] uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <Ticket className="w-4 h-4" />
                Buy Tickets
              </button>
            </>
          )}
          {event.isSoldOut && (
            <span className="px-6 py-3.5 bg-[#f5f5f7] text-[#6e6e73] rounded-xl font-semibold text-[13px] uppercase tracking-wider">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* --- MOBILE LAYOUT (up to lg) --- */}
      <div className="lg:hidden p-5 flex flex-col gap-4">
        {/* Finalissima badge */}
        {isFinalissimaEvent && (
          <div className="text-center">
            <span className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider">
              Finalissima 2026
            </span>
          </div>
        )}

        {/* Teams Section */}
        <div className="flex items-center justify-center gap-4 w-full">
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-10 rounded-lg overflow-hidden border border-black/5">
              <img
                src={`https://flagcdn.com/w160/${team1Code}.png`}
                alt={team1}
                width={160}
                height={120}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[15px] font-bold text-[#1d1d1f] text-center">{team1}</span>
          </div>

          <span className="text-[10px] font-medium text-[#6e6e73] uppercase tracking-wider">vs</span>

          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="w-14 h-10 rounded-lg overflow-hidden border border-black/5">
              <img
                src={`https://flagcdn.com/w160/${team2Code}.png`}
                alt={team2}
                width={160}
                height={120}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[15px] font-bold text-[#1d1d1f] text-center">{team2}</span>
          </div>
        </div>

        {/* Date, Time & Venue — all same color */}
        <div className="flex flex-col items-center gap-1.5 text-[13px] font-medium text-[#6e6e73]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{dateInfo.weekday}, {dateInfo.day} {dateInfo.month}</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-[#d2d2d7]" />
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{event.time || '19:00'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.venue || 'Lusail Stadium'}</span>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex flex-col items-center gap-3 pt-4 border-t border-black/5">
          {!event.isSoldOut && hasValidPrice && (
            <>
              <div className="flex items-baseline gap-1.5">
                <span className="text-[11px] font-medium text-[#6e6e73] uppercase tracking-wider">From</span>
                <span className="text-[22px] font-bold text-[#1d1d1f] leading-none">${event.minPrice}</span>
              </div>
              <button
                className="w-full py-3.5 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] active:scale-[0.98] text-white rounded-xl font-semibold text-[13px] uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <Ticket className="w-4 h-4" />
                Buy Tickets
              </button>
            </>
          )}
          {event.isSoldOut && (
            <span className="w-full py-3.5 bg-[#f5f5f7] text-[#6e6e73] rounded-xl font-semibold text-[13px] uppercase tracking-wider text-center">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
