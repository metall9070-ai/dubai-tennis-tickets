'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

const facilities = [
  {
    icon: "🍽️",
    title: "Food & Beverage",
    description: "Multiple restaurants, cafes, and bars throughout the venue. International cuisine, premium dining options, and quick refreshment stands."
  },
  {
    icon: "🚻",
    title: "Restrooms",
    description: "Clean, well-maintained facilities located throughout the stadium. Accessible restrooms available on all levels."
  },
  {
    icon: "🛍️",
    title: "Official Merchandise",
    description: "Tournament shop with official Dubai Tennis merchandise, player apparel, and exclusive souvenirs."
  },
  {
    icon: "📶",
    title: "Free WiFi",
    description: "Complimentary high-speed WiFi available throughout the venue for all ticket holders."
  },
  {
    icon: "🏧",
    title: "ATM & Currency",
    description: "ATM machines available on-site. Most vendors accept credit cards and Apple Pay."
  },
  {
    icon: "🩺",
    title: "First Aid",
    description: "Medical stations staffed with trained personnel. Located near main entrances and VIP areas."
  }
];

const transportOptions = [
  {
    mode: "Metro",
    icon: "🚇",
    details: "Take the Green Line to GGICO station. 5-minute walk to venue. Trains run every 5-10 minutes.",
    tip: "Most convenient option during peak hours"
  },
  {
    mode: "Taxi / Ride-Share",
    icon: "🚕",
    details: "Uber, Careem, and taxis available. Drop-off point at Gate 1. Dedicated pickup area after matches.",
    tip: "Book in advance for finals matches"
  },
  {
    mode: "Car / Parking",
    icon: "🚗",
    details: "On-site parking available (limited). Additional parking at nearby Dubai Festival City Mall with shuttle.",
    tip: "Arrive 90 minutes early for parking"
  },
  {
    mode: "Hotel Shuttle",
    icon: "🚌",
    details: "Many nearby hotels offer complimentary shuttle service to the venue during tournament dates.",
    tip: "Check with your hotel concierge"
  }
];

export default function VenueClient() {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/dubai-duty-free-tennis-stadium.jpg"
            alt="Dubai Duty Free Tennis Stadium - Home of Dubai Tennis Championships"
            title="Dubai Duty Free Tennis Stadium venue and facilities"
            className="w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f] via-[#1d1d1f]/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Venue & Directions" light />

          <div className="mt-8 md:mt-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Venue Info
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Dubai Duty Free Tennis Stadium
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              Aviation Club, Al Garhoud, Dubai
            </p>
            <p className="text-base text-white/60 mt-4 max-w-2xl">
              The iconic home of Dubai Tennis Championships since 1993. Just 10 minutes from Dubai International Airport.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-8 bg-white border-b border-[#d2d2d7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">5,000</p>
              <p className="text-sm text-[#86868b]">Seat Capacity</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">1993</p>
              <p className="text-sm text-[#86868b]">Established</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">10 min</p>
              <p className="text-sm text-[#86868b]">From Airport</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">Open-Air</p>
              <p className="text-sm text-[#86868b]">Venue Type</p>
            </div>
          </div>
        </div>
      </section>

      {/* About the Venue */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-6">
                A Legendary Tennis Venue
              </h2>
              <div className="space-y-4 text-[#86868b] leading-relaxed">
                <p>
                  The Dubai Duty Free Tennis Stadium at the Aviation Club is one of the most
                  prestigious tennis venues in the world. Since hosting its first tournament in 1993,
                  it has witnessed countless memorable moments in tennis history.
                </p>
                <p>
                  The intimate open-air stadium offers spectators an unparalleled viewing experience,
                  with every seat providing excellent sightlines to Centre Court. The venue's unique
                  atmosphere combines world-class sporting facilities with the luxury and hospitality
                  that Dubai is famous for.
                </p>
                <p>
                  <strong className="text-[#1d1d1f]">Roger Federer</strong> holds the record for most titles here
                  with 8 championships, cementing the stadium's reputation as one of his favorite venues
                  on the ATP Tour.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/images/dubai-tennis-areal-view.jpg"
                alt="Dubai Duty Free Tennis Stadium aerial view - Centre Court and surrounding facilities"
                title="Aerial view of Dubai Tennis Stadium"
                className="rounded-3xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Location & Map */}
      <section className="py-16 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-8 text-center">
            Location & Directions
          </h2>

          <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-8">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Dubai+Duty+Free+Tennis+Stadium,Al+Garhoud,Dubai&zoom=15`}
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-3xl"
              title="Dubai Duty Free Tennis Stadium Location"
            />
          </div>

          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-2xl">🏟️</span>
              </div>
              <div>
                <h3 className="font-bold text-[#1d1d1f] mb-1">Full Address</h3>
                <p className="text-[#86868b]">
                  Dubai Duty Free Tennis Stadium<br />
                  Aviation Club Tennis Centre<br />
                  Al Garhoud Road, Al Garhoud<br />
                  Dubai, United Arab Emirates
                </p>
                <p className="text-sm text-[var(--color-primary)] mt-2">
                  GPS: 25.2340° N, 55.3309° E
                </p>
              </div>
            </div>
          </div>

          {/* Transport Options */}
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6">How to Get There</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transportOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{option.icon}</div>
                  <div>
                    <h4 className="font-bold text-[#1d1d1f] mb-2">{option.mode}</h4>
                    <p className="text-[#86868b] text-sm mb-2">{option.details}</p>
                    <p className="text-sm text-[var(--color-primary)] font-medium">💡 {option.tip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-8 text-center">
            Stadium Facilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <div key={index} className="bg-[#f5f5f7] rounded-2xl p-6">
                <div className="text-3xl mb-4">{facility.icon}</div>
                <h3 className="font-bold text-[#1d1d1f] mb-2">{facility.title}</h3>
                <p className="text-sm text-[#86868b]">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & What to Bring */}
      <section className="py-16 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Weather */}
            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6">☀️ February Weather</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-[#f5f5f7]">
                  <span className="text-[#86868b]">Average High</span>
                  <span className="font-semibold text-[#1d1d1f]">25°C / 77°F</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#f5f5f7]">
                  <span className="text-[#86868b]">Average Low</span>
                  <span className="font-semibold text-[#1d1d1f]">15°C / 59°F</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-[#f5f5f7]">
                  <span className="text-[#86868b]">Rainfall</span>
                  <span className="font-semibold text-[#1d1d1f]">Rare</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#86868b]">Conditions</span>
                  <span className="font-semibold text-[var(--color-primary)]">Ideal for tennis</span>
                </div>
              </div>
            </div>

            {/* What to Bring */}
            <div className="bg-white rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6">🎒 What to Bring</h3>
              <ul className="space-y-3">
                {['Sunscreen and sunglasses', 'Hat or cap for day sessions', 'Light jacket for evening matches', 'Comfortable walking shoes', 'Phone charger / power bank', 'Your printed or digital ticket'].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-[#1d1d1f]">
                    <span className="w-6 h-6 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-xs">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Nearby Hotels */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-4 text-center">
            Nearby Hotels
          </h2>
          <p className="text-center text-[#86868b] mb-8 max-w-2xl mx-auto">
            Recommended accommodations within 15 minutes of the stadium
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f5f5f7] rounded-2xl p-6">
              <div className="text-sm text-[var(--color-primary)] font-medium mb-2">5-Star • 5 min</div>
              <h3 className="font-bold text-[#1d1d1f] mb-2">Le Meridien Dubai</h3>
              <p className="text-sm text-[#86868b]">Adjacent to the venue with direct access. Official tournament hotel.</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-6">
              <div className="text-sm text-[var(--color-primary)] font-medium mb-2">5-Star • 10 min</div>
              <h3 className="font-bold text-[#1d1d1f] mb-2">Park Hyatt Dubai</h3>
              <p className="text-sm text-[#86868b]">Luxury waterfront resort at Dubai Creek. Shuttle service available.</p>
            </div>
            <div className="bg-[#f5f5f7] rounded-2xl p-6">
              <div className="text-sm text-[var(--color-primary)] font-medium mb-2">5-Star • 15 min</div>
              <h3 className="font-bold text-[#1d1d1f] mb-2">InterContinental Festival City</h3>
              <p className="text-sm text-[#86868b]">Modern hotel at Festival City Mall with excellent dining options.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#1d1d1f] text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px] text-center">
          <h2 className="text-[32px] font-bold mb-4">Experience World-Class Tennis</h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            Book your seats at Dubai Duty Free Tennis Stadium for an unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Browse All Tickets
            </button>
            <button
              onClick={() => router.push('/seating-guide')}
              className="px-8 py-4 bg-white text-[#1d1d1f] font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              View Seating Guide
            </button>
          </div>
        </div>
      </section>

      {/* Related Links */}
      <section className="py-12 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/seating-guide')}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Seating Guide</h3>
              <p className="text-sm text-[#86868b]">Compare seating categories and prices</p>
            </button>
            <button
              onClick={() => router.push('/faq')}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">FAQ</h3>
              <p className="text-sm text-[#86868b]">Common questions about the event</p>
            </button>
            <button
              onClick={() => router.push('/tournament')}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Tournament Info</h3>
              <p className="text-sm text-[#86868b]">History and champions of Dubai Tennis</p>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
