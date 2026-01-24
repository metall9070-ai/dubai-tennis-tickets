import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface TournamentPageProps {
  onHome: () => void;
  onGoToShelby: () => void;
  onViewShelter: () => void;
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
  onTournament?: () => void;
}

const TournamentPage: React.FC<TournamentPageProps> = ({
  onHome,
  onGoToShelby,
  onViewShelter,
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
  onVenue,
  onTournament
}) => {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar isVisible={true} cartCount={cartCount} onHome={onHome} onTournament={() => {}} onATPTickets={onATPTickets} onWTATickets={onWTATickets} onCart={onCart} onSeatingGuide={onSeatingGuide} onVenue={onVenue} onFAQ={onFAQ} />
      
      <main className="flex-1 pb-12 md:pb-20" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 4rem)' }}>
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <div className="mb-8 md:mb-12">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', onClick: onHome }
              ]}
              currentPage="Tournament Info"
            />
          </div>

          {/* Tournament Banner Image */}
          <div className="relative w-full h-[25vh] md:h-[40vh] overflow-hidden rounded-[24px] md:rounded-[32px] mb-8 md:mb-16 shadow-sm border border-black/5">
            <img
              src="https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=2000&auto=format&fit=crop"
              alt="Dubai Duty Free Tennis Stadium"
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Page Heading */}
          <h1 className="text-[32px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-6 md:mb-10 leading-tight">
            Dubai Duty Free Tennis Championships
          </h1>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal">
            <p className="mb-6 md:mb-8 text-[16px] md:text-[18px]">
              The Dubai Duty Free Tennis Championships is one of the most prestigious and eagerly anticipated sporting events in the United Arab Emirates and a major highlight on the global tennis calendar. Owned and organised by Dubai Duty Free, the tournament is held under the patronage of HH Sheikh Mohammed Bin Rashid Al Maktoum, Vice President and Prime Minister of the UAE and Ruler of Dubai.
            </p>

            <p className="mb-4 text-[16px] md:text-[18px]">
              The event takes place over two consecutive weeks in Dubai and features two elite competitions:
            </p>
            <ul className="list-disc pl-6 mb-6 md:mb-8 space-y-2 text-[16px]">
              <li>a WTA 1000 women’s tournament, followed by</li>
              <li>an ATP 500 men’s tournament.</li>
            </ul>

            <p className="mb-10 md:mb-12 text-[16px]">
              The 2026 edition represents an important milestone, marking the 34th year of the ATP tournament and the 26th year of the WTA tournament, reinforcing its reputation as one of the longest-running and most respected tennis tournaments in the world.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Legendary Players and World-Class Matches</h2>
            <p className="mb-6 md:mb-8 text-[16px]">
              Throughout its history, the tournament has welcomed some of the greatest players in tennis. Past women’s champions include Jasmine Paolini, Barbora Krejcikova, Elina Svitolina, Venus Williams, Serena Williams, Martina Hingis, Justine Henin, Lindsay Davenport, Simona Halep, Garbiñe Muguruza, and Caroline Wozniacki, all of whom delivered top-level tennis in front of sell-out crowds at the Dubai Duty Free Tennis Stadium.
            </p>
            <p className="mb-10 md:mb-12 text-[16px]">
              The men’s tournament has consistently attracted the biggest names in the sport, including Novak Djokovic, Daniil Medvedev, Andy Murray, Roger Federer, Rafael Nadal, Andre Agassi, along with recent champions Aslan Karatsev and Ugo Humbert.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Tournament Schedule and Match Planning</h2>
            <p className="mb-10 md:mb-12 text-[16px]">
              Fans planning to attend the event can explore match dates, session times, and daily order of play by visiting the Dubai Duty Free Tennis Championships schedule. The schedule allows visitors to easily plan their visit, choose preferred sessions, and purchase tickets for specific match days across both the ATP and WTA tournaments.
            </p>

            <div 
              onClick={onViewShelter}
              className="bg-[#1e824c] rounded-[24px] md:rounded-[32px] p-6 md:p-10 text-white shadow-xl cursor-pointer hover:bg-[#166d3e] transition-all group"
            >
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">Buy Tickets for the Dubai Duty Free Tennis Championships</h2>
              <p className="mb-6 md:mb-8 opacity-90 text-[15px] md:text-[17px]">
                Book your Dubai Duty Free Tennis Championships tickets and experience elite ATP and WTA tennis live in Dubai. Check the official tournament schedule, select your preferred sessions, and secure the best seats.
              </p>
              <button 
                className="w-full md:w-auto px-8 py-3 bg-white text-[#1e824c] font-semibold rounded-full group-hover:bg-white/90 transition-all transform active:scale-95"
              >
                View Schedule
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

export default TournamentPage;