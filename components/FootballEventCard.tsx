'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react';
import type { Event } from '@/lib/types';

interface FootballEventCardProps {
  event: Event;
  onClick: () => void;
}

/**
 * Football Event Card - Modern design for Finalissima
 * Based on Google AI Studio design with Framer Motion animations
 *
 * Features:
 * - Desktop: Horizontal layout with date badge, flags, meta info, and action button
 * - Mobile: Stacked vertical layout with centered teams
 * - Hover: Lift effect with shadow enhancement
 * - Special badge for featured matches (e.g., Finalissima)
 */
export const FootballEventCard: React.FC<FootballEventCardProps> = ({ event, onClick }) => {
  // Extract team data from event
  // Format: "Argentina vs Spain" or "Qatar - Argentina"
  const teams = event.title?.includes('vs')
    ? event.title.split('vs').map(t => t.trim())
    : event.title?.includes(' - ')
    ? event.title.split(' - ').map(t => t.trim())
    : [event.title || 'Team 1', 'Team 2'];

  const team1 = teams[0] || 'Team 1';
  const team2 = teams[1] || 'Team 2';

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
    };
    return codeMap[teamName] || 'un'; // 'un' for unknown
  };

  const team1Code = getCountryCode(team1);
  const team2Code = getCountryCode(team2);

  // Format date
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

  // Check if it's the Finalissima main event (Argentina vs Spain)
  const isFinalissimaEvent = (event.title?.toLowerCase().includes('argentina') && event.title?.toLowerCase().includes('spain')) ||
                              (event.title?.toLowerCase().includes('spain') && event.title?.toLowerCase().includes('argentina'));

  // Check if price is valid
  const hasValidPrice = event.minPrice != null && event.minPrice > 0;

  const handleClick = () => {
    // GA4 tracking
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'view_item', {
        items: [{
          item_id: event.id,
          item_name: event.title,
          item_category: 'football_event',
          price: event.minPrice
        }]
      });
    }
    onClick();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      onClick={handleClick}
      className="group relative bg-white rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden w-full cursor-pointer"
    >

      {/* --- DESKTOP LAYOUT (lg and up) --- */}
      <div className="hidden lg:flex flex-row items-center p-0 h-[160px]">
        {/* Date Section */}
        <div className="flex flex-col items-center justify-center min-w-[120px] h-full bg-slate-50 border-r border-slate-100 group-hover:bg-[#e6f0f2] transition-colors duration-500">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{dateInfo.month}</span>
          <span className="text-4xl font-display font-bold text-slate-900 leading-none">{dateInfo.day}</span>
          <span className="text-xs font-bold text-[#00627B] uppercase tracking-tighter mt-2">{dateInfo.weekday}</span>
        </div>

        {/* Match Info Section */}
        <div className="flex-grow flex flex-col gap-4 px-8">
          {/* Finalissima Title - Above Teams */}
          {isFinalissimaEvent && (
            <div className="text-center -mb-2">
              <span className="text-[11px] font-bold text-[#00627B] uppercase tracking-widest">
                Finalissima 2026
              </span>
            </div>
          )}

          {/* Teams */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/w80/${team1Code}.png`}
                alt={team1}
                className="w-8 h-6 object-cover rounded shadow-sm border border-slate-100"
              />
              <span className="text-xl font-display font-bold text-slate-900">{team1}</span>
            </div>
            <div className="px-2 py-0.5 bg-slate-50 rounded text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100">
              VS
            </div>
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/w80/${team2Code}.png`}
                alt={team2}
                className="w-8 h-6 object-cover rounded shadow-sm border border-slate-100"
              />
              <span className="text-xl font-display font-bold text-slate-900">{team2}</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-500 font-semibold">
              <Clock className="w-4 h-4 text-[#00627B]" />
              <span>{event.time || '19:00'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 font-medium">
              <MapPin className="w-4 h-4" />
              <span>{event.venue || 'Lusail Stadium'}</span>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-8 px-8 border-l border-slate-100 h-full">
          {!event.isSoldOut && hasValidPrice && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">From</span>
                <span className="text-3xl font-display font-bold text-slate-900 leading-none">${event.minPrice}</span>
              </div>
              <button
                className="px-8 py-4 bg-[#00627B] hover:bg-[#004e62] text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl shadow-[#00627B]/20 flex items-center gap-3 group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <Ticket className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                BUY TICKETS
              </button>
            </>
          )}
          {event.isSoldOut && (
            <span className="px-8 py-4 bg-slate-200 text-slate-500 rounded-2xl font-bold text-sm uppercase">
              Sold Out
            </span>
          )}
        </div>
      </div>

      {/* --- MOBILE LAYOUT (up to lg) --- */}
      <div className="lg:hidden p-8 flex flex-col gap-8">
        {/* Finalissima Title - Above Everything */}
        {isFinalissimaEvent && (
          <div className="text-center -mb-4">
            <span className="text-[11px] font-bold text-[#00627B] uppercase tracking-widest">
              Finalissima 2026
            </span>
          </div>
        )}

        {/* 1. Teams Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center justify-center gap-4 w-full">
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <img
                  src={`https://flagcdn.com/w160/${team1Code}.png`}
                  alt={team1}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-display font-bold text-slate-900 text-center">{team1}</span>
            </div>

            <div className="flex items-center justify-center px-3 py-1 bg-slate-50 rounded-lg text-[10px] font-black text-slate-300 uppercase tracking-widest border border-slate-100">
              VS
            </div>

            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="w-16 h-12 rounded-xl overflow-hidden shadow-sm border border-slate-100">
                <img
                  src={`https://flagcdn.com/w160/${team2Code}.png`}
                  alt={team2}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-lg font-display font-bold text-slate-900 text-center">{team2}</span>
            </div>
          </div>
        </div>

        {/* 2. Date & Time Line */}
        <div className="flex items-center justify-center gap-3 text-slate-500 text-sm font-semibold">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#00627B]" />
            <span>{dateInfo.weekday}, {dateInfo.day} {dateInfo.month}</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-300" />
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#00627B]" />
            <span>{event.time || '19:00'}</span>
          </div>
        </div>

        {/* 3. Venue Line */}
        <div className="flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
          <MapPin className="w-4 h-4" />
          <span>{event.venue || 'Lusail Stadium'}</span>
        </div>

        {/* 4. Bottom Action Section */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          {!event.isSoldOut && hasValidPrice && (
            <>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">From</span>
                <span className="text-3xl font-display font-bold text-slate-900 leading-none">${event.minPrice}</span>
              </div>
              <button
                className="px-8 py-4 bg-[#00627B] hover:bg-[#004e62] text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-xl shadow-[#00627B]/20 flex items-center gap-3 group/btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                <Ticket className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                BUY TICKETS
              </button>
            </>
          )}
          {event.isSoldOut && (
            <span className="px-8 py-4 bg-slate-200 text-slate-500 rounded-2xl font-bold text-sm uppercase w-full text-center">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
