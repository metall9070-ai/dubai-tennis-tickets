import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface SeatingCategory {
  name: string;
  location: string;
  description: string;
  color: string;
}

const seatingCategories: SeatingCategory[] = [
  {
    name: "Prime A",
    location: "Lower Level — Central",
    description: "The closest seats to the court with a central viewing angle. Experience every serve and volley up close, and feel the intensity of top-level tennis as it unfolds just meters away.",
    color: "#1e824c"
  },
  {
    name: "Prime B",
    location: "Lower Level — Side Sections",
    description: "First-tier seating positioned slightly off-center or at an angle. Excellent court visibility with a dynamic perspective on the match, offering a well-rounded live tennis experience.",
    color: "#2980b9"
  },
  {
    name: "Grandstand Lower",
    location: "Lower Grandstand Level",
    description: "Elevated seating on the lower tier of the grandstand with unobstructed sightlines. A comfortable option for watching full sessions while staying close to the action.",
    color: "#8e44ad"
  },
  {
    name: "Grandstand Upper",
    location: "Upper Grandstand Level",
    description: "Panoramic views from the upper tier, capturing the full scope of the court and stadium atmosphere. An ideal choice for first-time visitors or those who enjoy the big-picture view.",
    color: "#e67e22"
  }
];

interface SeatingGuidePageProps {
  cartCount: number;
  onHome: () => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onCart: () => void;
  onVenue?: () => void;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onPaymentDelivery?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
}

const SeatingGuidePage: React.FC<SeatingGuidePageProps> = ({
  cartCount,
  onHome,
  onTournament,
  onATPTickets,
  onWTATickets,
  onCart,
  onVenue,
  onFAQ,
  onSeatingGuide,
  onPaymentDelivery,
  onPrivacyPolicy,
  onTermsOfService,
  onContacts,
  onAboutUs
}) => {
  const handleViewSchedule = () => {
    onHome();
    setTimeout(() => {
      const ticketsSection = document.getElementById('tickets');
      if (ticketsSection) {
        ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

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

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-[#d2d2d7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/', onClick: onHome }
            ]}
            currentPage="Seating Guide"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="text-center mb-12">
            <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-[#1d1d1f] mb-6">
              Dubai Tennis Stadium<br />
              <span className="text-[#1e824c]">Seating Guide</span>
            </h1>
            <p className="text-xl text-[#86868b] max-w-2xl mx-auto">
              Find the perfect seats for Dubai Duty Free Tennis Championships 2026.
              Compare seating categories and choose the view that suits you best.
            </p>
          </div>

          {/* Stadium Visual */}
          <div className="relative bg-[#f5f5f7] rounded-3xl p-4 md:p-8 mb-12">
            <div className="max-w-2xl mx-auto">
              <img
                src="https://dubaidutyfreetennischampionships.com/wp-content/uploads/2024/01/DDFTC-STADIUM_JAN-10-2024-PORTRAIT_2392x2953-scaled.jpg"
                alt="Dubai Duty Free Tennis Championships Stadium Seating Chart"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seating Categories Detail */}
      <section className="py-16 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] text-center mb-12">
            Seating Categories
          </h2>

          <div className="space-y-6">
            {seatingCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-black/5 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white text-xl md:text-2xl font-bold shrink-0"
                    style={{ backgroundColor: category.color }}
                  >
                    {index + 1}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f] mb-1">{category.name}</h3>
                    <p className="text-sm text-[#86868b] mb-3">{category.location}</p>
                    <p className="text-[#424245] leading-relaxed">{category.description}</p>
                  </div>

                  <button
                    onClick={handleViewSchedule}
                    className="w-full md:w-auto px-6 py-3 rounded-full font-semibold text-white shrink-0 hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: category.color }}
                  >
                    View Schedule & Tickets
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-[32px] font-bold text-[#1d1d1f] text-center mb-8">
            Tips for Choosing Your Seats
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f5f5f7] p-6 rounded-2xl">
              <h3 className="font-bold text-[#1d1d1f] mb-3">For Photography</h3>
              <p className="text-[#86868b]">Prime B sections often provide the best angle for capturing match moments without being too close to the net.</p>
            </div>
            <div className="bg-[#f5f5f7] p-6 rounded-2xl">
              <h3 className="font-bold text-[#1d1d1f] mb-3">For Shade</h3>
              <p className="text-[#86868b]">Grandstand Upper rows on the west side receive afternoon shade earliest. Evening sessions offer cooler conditions throughout the stadium.</p>
            </div>
            <div className="bg-[#f5f5f7] p-6 rounded-2xl">
              <h3 className="font-bold text-[#1d1d1f] mb-3">For Families</h3>
              <p className="text-[#86868b]">Grandstand Lower offers comfortable views with convenient access to amenities. Aisle seats are recommended for families with children.</p>
            </div>
            <div className="bg-[#f5f5f7] p-6 rounded-2xl">
              <h3 className="font-bold text-[#1d1d1f] mb-3">For Atmosphere</h3>
              <p className="text-[#86868b]">Grandstand sections behind the baseline deliver the most vibrant crowd atmosphere and are popular with enthusiastic fan groups.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1d1d1f] text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px] text-center">
          <h2 className="text-[32px] font-bold mb-4">Ready to Choose Your Seats?</h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Browse available sessions and select the category that fits your preferences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleViewSchedule}
              className="px-8 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-colors"
            >
              View Schedule & Tickets
            </button>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onVenue}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Venue Information</h3>
              <p className="text-sm text-[#86868b]">Getting there, parking, and stadium facilities</p>
            </button>
            <button
              onClick={onFAQ}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">FAQ</h3>
              <p className="text-sm text-[#86868b]">Common questions about tickets and the event</p>
            </button>
            <button
              onClick={onTournament}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Tournament Info</h3>
              <p className="text-sm text-[#86868b]">Learn about Dubai Tennis Championships</p>
            </button>
          </div>
        </div>
      </section>

      <Footer
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onFAQ={onFAQ}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
      />
    </div>
  );
};

export default SeatingGuidePage;
