import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Event, EventRow } from './Events';
import { fetchEvents } from '@/lib/api';

interface WTATicketsPageProps {
  onHome: () => void;
  onSelectEvent: (event: any) => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onPaymentDelivery: () => void;
  onPrivacyPolicy: () => void;
  onTermsOfService: () => void;
  cartCount: number;
}

const WTATicketsPage: React.FC<WTATicketsPageProps> = ({
  onHome,
  onSelectEvent,
  onTournament,
  onATPTickets,
  onWTATickets,
  onPaymentDelivery,
  onPrivacyPolicy,
  onTermsOfService,
  cartCount
}) => {
  // State for events - fetched from Django API
  const [wtaEvents, setWtaEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch events from Django API - NEVER use fallback data
  useEffect(() => {
    let mounted = true;

    async function loadEvents() {
      try {
        setIsLoading(true);
        const result = await fetchEvents();

        if (!mounted) return;

        // STRICT: Reject fallback data - only use Django API prices
        if (result.fallback) {
          console.error('[WTATicketsPage.FC] REJECTED fallback data - Django API required for prices');
          setError('Unable to load prices. Please try again.');
          setWtaEvents([]);
          return;
        }

        if (result.data) {
          const wta = result.data.filter(e => e.type === 'WTA');
          setWtaEvents(wta);

          // Log each event's price source explicitly
          wta.forEach(event => {
            console.log('[PRICE SOURCE]', event.title, event.minPrice);
          });

          console.log(`[WTATicketsPage.FC] Loaded ${wta.length} WTA events from Django API`);
        }
      } catch (err) {
        console.error('[WTATicketsPage.FC] Failed to load events:', err);
        if (mounted) {
          setError('Unable to load prices. Please try again.');
          setWtaEvents([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar isVisible={true} cartCount={cartCount} onHome={onHome} onTournament={onTournament} onATPTickets={onATPTickets} onWTATickets={onWTATickets} />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[800px] mx-auto px-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-[13px] font-semibold text-[#86868b] mb-12">
            <button onClick={onHome} className="hover:text-[#1d1d1f] transition-colors">Home</button>
            <span className="text-[#d2d2d7]">/</span>
            <span className="text-[#1d1d1f]">WTA Tickets</span>
          </nav>

          {/* Banner Image */}
          <div className="relative w-full h-[35vh] md:h-[40vh] overflow-hidden rounded-[32px] mb-12 shadow-sm border border-black/5">
            <img 
              src="https://images.unsplash.com/photo-1595435064212-0104e78c4447?q=80&w=2000&auto=format&fit=crop" 
              alt="WTA Tennis Action" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

          {/* Page Heading */}
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-10 leading-tight">
            WTA 1000 Tickets – Dubai Duty Free Tennis Championships
          </h1>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal">
            
            {/* Embedded Schedule Block */}
            <div id="wta-schedule" className="mb-16 scroll-mt-24">
              <div className="flex items-center justify-between mb-8 px-4">
                <h3 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">WTA 1000 Match Schedule</h3>
                <span className="text-[12px] font-bold text-[#1e824c] uppercase tracking-widest px-3 py-1 bg-[#1e824c]/10 rounded-full">Available Sessions</span>
              </div>
              <div className="bg-[#f5f5f7] rounded-[32px] overflow-hidden border border-black/5 shadow-inner">
                {wtaEvents.map((event, index, arr) => (
                  <EventRow 
                    key={event.id} 
                    event={event} 
                    isLast={index === arr.length - 1} 
                    onClick={() => onSelectEvent(event)}
                  />
                ))}
              </div>
              <p className="text-[13px] text-[#86868b] mt-4 text-center font-medium">
                Select a session above to view categories and book your seats.
              </p>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">What Is the WTA Tour?</h2>
            <p className="mb-12">
              The WTA Tour (Women’s Tennis Association) is the premier global circuit for professional women’s tennis. It governs the world ranking system and organises elite tournaments across multiple continents, featuring the highest-ranked female players in the sport.
              <br /><br />
              WTA tournaments are divided into several categories based on ranking points, prize money, and competitive level. These include WTA 250, WTA 500, WTA 1000, the WTA Finals, and the four Grand Slams. Among these, WTA 1000 tournaments represent the highest tier outside the Grand Slams.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">What Is a WTA 1000 Tournament?</h2>
            <p className="mb-6">
              A WTA 1000 tournament is one of the most prestigious and competitive levels on the women’s professional tennis calendar. The tournament winner earns 1,000 WTA ranking points, making these events critical for players competing for top rankings, Grand Slam seedings, and qualification for the WTA Finals.
            </p>
            <p className="mb-6">
              WTA 1000 tournaments are known for:
            </p>
            <ul className="list-disc pl-6 mb-12 space-y-2">
              <li>Participation of the world’s top-ranked players</li>
              <li>High-intensity matches from the early rounds</li>
              <li>Large prize pools and international media coverage</li>
              <li>Strong fan attendance and global visibility</li>
            </ul>
            <p className="mb-12">
              These events consistently deliver elite-level tennis and are considered must-watch tournaments for fans of the women’s game.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">WTA 1000 at the Dubai Duty Free Tennis Championships</h2>
            <p className="mb-8">
              The women’s event at the Dubai Duty Free Tennis Championships is officially classified as a WTA 1000 tournament, placing it among the most important stops on the WTA Tour.
            </p>
            <p className="mb-8">
              Now celebrating its 26th edition, the Dubai WTA 1000 tournament has a long history of hosting and crowning the sport’s biggest stars. Past champions include Jasmine Paolini, Barbora Krejcikova, Elina Svitolina, Venus Williams, Serena Williams, Martina Hingis, Justine Henin, Lindsay Davenport, Simona Halep, Garbiñe Muguruza, and Caroline Wozniacki.
            </p>
            <p className="mb-6">
              Matches are played at the Dubai Duty Free Tennis Stadium, offering:
            </p>
            <ul className="list-disc pl-6 mb-12 space-y-2">
              <li>Premium hard courts suited to high-level baseline and all-court play</li>
              <li>Day and night sessions in world-class conditions</li>
              <li>A professional tournament atmosphere with consistently sold-out crowds</li>
            </ul>
            <p className="mb-12">
              The Dubai WTA 1000 event is widely regarded by players and fans as one of the best-organised tournaments on the tour, combining elite competition with an exceptional spectator experience.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">Buy WTA 1000 Tickets in Dubai</h2>
            <p className="mb-12">
              Purchasing WTA 1000 tickets for the Dubai Duty Free Tennis Championships gives fans the opportunity to watch the very best women’s tennis players compete live in Dubai. From early-round matchups to finals week, WTA tickets offer access to top-tier competition and unforgettable on-court performances.
              <br /><br />
              To plan your visit, fans are advised to check the tournament schedule, where match dates, session times, and order of play are available for all WTA rounds throughout the week.
            </p>

            <div className="bg-[#1e824c] rounded-[32px] p-10 text-white shadow-xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Secure Your WTA 1000 Tickets</h2>
              <p className="mb-8 opacity-90 max-w-xl mx-auto">
                Don't miss the chance to see the world's best female tennis players competing live in Dubai. Select your seats now for an unparalleled sporting experience.
              </p>
              <button 
                onClick={() => {
                  const el = document.getElementById('wta-schedule');
                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="px-8 py-3 bg-white text-[#1e824c] font-semibold rounded-full hover:bg-white/90 transition-all transform active:scale-95 shadow-md"
              >
                Back to Schedule
              </button>
            </div>
          </article>
        </div>
      </main>
      
      <Footer 
        onTournament={onTournament} 
        onATPTickets={onATPTickets} 
        onWTATickets={onWTATickets} 
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
      />
    </div>
  );
};

export default WTATicketsPage;