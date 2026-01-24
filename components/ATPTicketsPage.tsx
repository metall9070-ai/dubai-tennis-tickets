import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import { eventsData, EventRow } from './Events';

interface ATPTicketsPageProps {
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

const ATPTicketsPage: React.FC<ATPTicketsPageProps> = ({
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
  const atpEvents = eventsData.filter(e => e.type === 'ATP');

  // SEO: Update meta tags for this page
  useEffect(() => {
    document.title = 'ATP 500 Tickets Dubai 2026 | Dubai Tennis Championships';

    // Update og:image meta tag
    let ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.setAttribute('content', 'https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1200&auto=format&fit=crop');
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
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=2000&auto=format&fit=crop"
          alt="ATP Dubai Tennis Championships tickets and seating overview"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
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
              currentPage="ATP 500 Tickets"
              light
            />
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-end">
          <div className="container mx-auto px-4 sm:px-6 max-w-[980px] pb-12">
            <h1 className="text-[36px] md:text-[56px] font-bold tracking-tight text-white mb-4 leading-tight">
              ATP 500 Tickets<br />
              <span className="text-white/90">Dubai Tennis Championships</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl">
              Experience world-class men's tennis. February 23-28, 2026.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="bg-white">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 py-12 md:py-16">

          {/* Schedule Block */}
          <div id="atp-schedule" className="mb-16 scroll-mt-24">
            <div className="flex items-center justify-between mb-8 px-4">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f]">ATP 500 Match Schedule</h2>
              <span className="text-[12px] font-bold text-[#1e824c] uppercase tracking-widest px-3 py-1 bg-[#1e824c]/10 rounded-full">Available Sessions</span>
            </div>
            <div className="bg-[#f5f5f7] rounded-[32px] overflow-hidden border border-black/5 shadow-inner">
              {atpEvents.map((event, index, arr) => (
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
            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">What Is the ATP Tour?</h2>
            <p className="mb-12">
              The ATP Tour (Association of Tennis Professionals) is the world's leading professional men's tennis circuit, governing elite tournaments and ranking the top male players globally. ATP events are played across multiple continents and form the foundation of the ATP World Rankings, which determine player standings, seedings, and qualification for major tournaments.
              <br /><br />
              The ATP Tour is structured into several tournament categories, each offering different levels of ranking points, prize money, and competitive intensity. These categories include ATP 250, ATP 500, ATP Masters 1000, and the ATP Finals, with Grand Slams organised separately.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">What Is an ATP 500 Tournament?</h2>
            <p className="mb-6">
              An ATP 500 tournament represents a high-prestige tier within the ATP Tour. Winners earn 500 ATP ranking points, making these events critically important for players competing for higher rankings, seedings, and qualification for year-end championships.
            </p>
            <p className="mb-6">
              ATP 500 tournaments typically feature:
            </p>
            <ul className="list-disc pl-6 mb-12 space-y-2">
              <li>Top-ranked international players</li>
              <li>Highly competitive matchups from early rounds</li>
              <li>Larger prize pools compared to ATP 250 events</li>
              <li>Strong global media coverage and fan attendance</li>
            </ul>
            <p className="mb-12">
              These tournaments strike a balance between elite competition and fan accessibility, offering spectators world-class tennis throughout the week.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">ATP 500 at the Dubai Duty Free Tennis Championships</h2>
            <p className="mb-8">
              The men's event at the Dubai Duty Free Tennis Championships is classified as an ATP 500 tournament, placing it among the most respected stops on the ATP Tour.
            </p>
            <p className="mb-8">
              Now in its 34th edition, the Dubai ATP 500 tournament has built a reputation for attracting the world's best players. Past champions and participants include Novak Djokovic, Roger Federer, Rafael Nadal, Andy Murray, Daniil Medvedev, and Andre Agassi, along with recent title winners Aslan Karatsev and Ugo Humbert.
            </p>
            <p className="mb-6">
              Held at the Dubai Duty Free Tennis Stadium, the tournament offers:
            </p>
            <ul className="list-disc pl-6 mb-12 space-y-2">
              <li>Day and night sessions under world-class conditions</li>
              <li>Fast, high-quality hard courts suited to aggressive play</li>
              <li>Consistently sold-out crowds and premium hospitality</li>
            </ul>
            <p className="mb-12">
              The Dubai ATP 500 has also been voted ATP 500 Tournament of the Year eleven times, an award decided by ATP players themselves—an exceptional achievement that reflects both organisation quality and player satisfaction.
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">Buy ATP Tickets in Dubai</h2>
            <p className="mb-12">
              Purchasing ATP tickets for the Dubai Duty Free Tennis Championships gives fans the opportunity to experience top-level men's tennis in one of the world's most iconic destinations. Whether attending early-round matches or finals week, ATP 500 Dubai tickets provide access to elite competition, global tennis stars, and an unforgettable live sporting atmosphere.
              <br /><br />
              Fans are encouraged to review the tournament schedule to select preferred match days and sessions, as ATP matches are spread across multiple rounds throughout the week.
            </p>

            <div className="bg-[#1e824c] rounded-[32px] p-10 text-white shadow-xl text-center">
              <h2 className="text-2xl font-semibold tracking-tight mb-4">Secure Your Tickets</h2>
              <p className="mb-8 opacity-90 max-w-xl mx-auto">
                Don't miss the chance to see the world's best male tennis players competing live in Dubai. Select your seats now for an unparalleled sporting experience.
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById('atp-schedule');
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

export default ATPTicketsPage;
