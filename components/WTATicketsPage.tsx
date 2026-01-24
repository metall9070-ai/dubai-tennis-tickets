import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { eventsData, EventRow } from './Events';

interface WTATicketsPageProps {
  onHome: () => void;
  onSelectEvent: (event: any) => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onPaymentDelivery: () => void;
  onPrivacyPolicy: () => void;
  onTermsOfService: () => void;
  onContacts: () => void;
  onAboutUs: () => void;
  onCart: () => void;
  cartCount: number;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
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
  onContacts,
  onAboutUs,
  onCart,
  cartCount,
  onFAQ,
  onSeatingGuide,
  onVenue
}) => {
  const wtaEvents = eventsData.filter(e => e.type === 'WTA');

  // SEO: Update meta tags for this page
  useEffect(() => {
    document.title = 'WTA 1000 Tickets Dubai 2026 | Dubai Tennis Championships';

    // Update og:image meta tag
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop');
    }

    return () => {
      document.title = 'Dubai Tennis Championships 2026 Tickets | Best Seats Available';
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar
        isVisible={true}
        cartCount={cartCount}
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onCart={onCart}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
        onFAQ={onFAQ}
      />

      {/* Hero Section - Fullscreen like VenuePage */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* Background Image with SEO-friendly aria-label */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=2000&auto=format&fit=crop')"
          }}
          role="img"
          aria-label="WTA Dubai Tennis Championships tickets and court view"
        />
        {/* Overlay for text contrast - WCAG AA compliant */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />

        {/* Breadcrumbs */}
        <div className="absolute top-0 left-0 right-0 z-10" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 6rem)' }}>
          <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', onClick: onHome }
              ]}
              currentPage="WTA 1000 Tickets"
              light
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 sm:px-6 max-w-[980px] pb-12">
            <h1 className="text-[36px] md:text-[56px] font-bold tracking-tight text-white mb-4 leading-tight">
              WTA 1000 Tickets<br />
              <span className="text-white/90">Dubai Tennis Championships</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl">
              Watch the world's best women's tennis. February 15-21, 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-white">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 py-12 md:py-16">

          {/* Schedule Block */}
          <div id="wta-schedule" className="mb-16 scroll-mt-24">
            <div className="flex items-center justify-between mb-8 px-4">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">WTA 1000 Match Schedule</h2>
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

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal">
            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">What Is the WTA Tour?</h2>
            <p className="mb-12">
              The WTA Tour (Women's Tennis Association) is the premier global circuit for professional women's tennis. It governs the world ranking system and organises elite tournaments across multiple continents, featuring the highest-ranked female players in the sport.
              <br /><br />
              WTA tournaments are divided into several categories based on ranking points, prize money, and competitive level. These include WTA 250, WTA 500, WTA 1000, the WTA Finals, and the four Grand Slams. Among these, WTA 1000 tournaments represent the highest tier outside the Grand Slams.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">What Is a WTA 1000 Tournament?</h2>
            <p className="mb-6">
              A WTA 1000 tournament is one of the most prestigious and competitive levels on the women's professional tennis calendar. The tournament winner earns 1,000 WTA ranking points, making these events critical for players competing for top rankings, Grand Slam seedings, and qualification for the WTA Finals.
            </p>
            <p className="mb-6">
              WTA 1000 tournaments are known for:
            </p>
            <ul className="list-disc pl-6 mb-12 space-y-2">
              <li>Participation of the world's top-ranked players</li>
              <li>High-intensity matches from the early rounds</li>
              <li>Large prize pools and international media coverage</li>
              <li>Strong fan attendance and global visibility</li>
            </ul>
            <p className="mb-12">
              These events consistently deliver elite-level tennis and are considered must-watch tournaments for fans of the women's game.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">WTA 1000 at the Dubai Duty Free Tennis Championships</h2>
            <p className="mb-8">
              The women's event at the Dubai Duty Free Tennis Championships is classified as a WTA 1000 tournament, placing it among the most important stops on the WTA Tour.
            </p>
            <p className="mb-8">
              Now celebrating its 26th edition, the Dubai WTA 1000 tournament has a long history of hosting and crowning the sport's biggest stars. Past champions include Jasmine Paolini, Barbora Krejcikova, Elina Svitolina, Venus Williams, Serena Williams, Martina Hingis, Justine Henin, Lindsay Davenport, Simona Halep, Garbiñe Muguruza, and Caroline Wozniacki.
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
              Purchasing WTA 1000 tickets for the Dubai Duty Free Tennis Championships gives fans the opportunity to watch the very best women's tennis players compete live in Dubai. From early-round matchups to finals week, WTA tickets offer access to top-tier competition and unforgettable on-court performances.
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
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
        onFAQ={onFAQ}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
      />
    </div>
  );
};

export default WTATicketsPage;
