'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteCode } from '@/lib/site-config';
import { getVenueContent } from '@/lib/venue-data';
import { UtensilsCrossed, Users, ShoppingBag, Wifi, CreditCard, HeartPulse, TrainFront, Car, SquareParking, Bus, Lightbulb, Landmark, Sun, Backpack } from 'lucide-react';

const facilityIcons: Record<string, React.ReactNode> = {
  "Food & Beverage": <UtensilsCrossed size={28} />,
  "Restrooms": <Users size={28} />,
  "Official Merchandise": <ShoppingBag size={28} />,
  "Merchandise": <ShoppingBag size={28} />,
  "Free WiFi": <Wifi size={28} />,
  "ATM & Currency": <CreditCard size={28} />,
  "ATM & Payments": <CreditCard size={28} />,
  "First Aid": <HeartPulse size={28} />,
};

const transportIcons: Record<string, React.ReactNode> = {
  "Metro": <TrainFront size={28} />,
  "Taxi / Ride-Share": <Car size={28} />,
  "Car / Parking": <SquareParking size={28} />,
  "Hotel Shuttle": <Bus size={28} />,
  "Shuttle Bus": <Bus size={28} />,
};

export default function VenueClient() {
  const router = useRouter();
  const venue = getVenueContent(getSiteCode());

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  if (!venue) {
    return (
      <div className="min-h-screen bg-[#f5f5f7]">
        <Navbar />
        <section className="pt-16 pb-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-[980px] text-center">
            <h1 className="text-4xl font-bold text-[#1d1d1f] mt-8">Venue Information</h1>
            <p className="text-lg text-[#636366] mt-4">Venue details are not available for this site.</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
        {venue.heroImage && (
          <div className="absolute inset-0 z-0">
            <img
              src={venue.heroImage}
              alt={`${venue.name} - venue exterior`}
              title={`${venue.name} venue and facilities`}
              className="w-full h-full object-cover object-top opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f] via-[#1d1d1f]/40 to-transparent" />
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Venue & Directions" light />

          <div className="mt-8 md:mt-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Venue Info
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {venue.name}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              {venue.location}
            </p>
            <p className="text-base text-white/60 mt-4 max-w-2xl">
              {venue.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-8 bg-white border-b border-[#d2d2d7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {venue.stats.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl md:text-3xl font-bold text-[var(--color-primary)]">{stat.value}</p>
                <p className="text-sm text-[#636366]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Venue */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className={`grid grid-cols-1 ${venue.aerialImage ? 'md:grid-cols-2' : ''} gap-12 items-center`}>
            <div>
              <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-6">
                {venue.aboutTitle}
              </h2>
              <div className="space-y-4 text-[#636366] leading-relaxed">
                {venue.aboutParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
            {venue.aerialImage && (
              <div className="relative">
                <img
                  src={venue.aerialImage}
                  alt={`${venue.name} aerial view`}
                  title={`Aerial view of ${venue.name}`}
                  className="rounded-3xl shadow-xl w-full"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location & Map */}
      <section className="py-16 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-8 text-center">
            Location & Directions
          </h2>

          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm mb-8">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${venue.mapQuery}&zoom=15`}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3xl"
                title={`${venue.name} Location`}
              />
            </div>
          )}

          {/* Address Card */}
          <div className="bg-white rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center shrink-0">
                <Landmark size={24} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <h3 className="font-bold text-[#1d1d1f] mb-1">Full Address</h3>
                <p className="text-[#636366]">
                  {venue.address.map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < venue.address.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
                {venue.gps && (
                  <p className="text-sm text-[var(--color-primary)] mt-2">
                    GPS: {venue.gps}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Transport Options */}
          <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6">How to Get There</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {venue.transport.map((option, index) => (
              <div key={index} className="bg-white rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="text-[var(--color-primary)]">
                    {transportIcons[option.mode] || <Car size={28} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1d1d1f] mb-2">{option.mode}</h4>
                    <p className="text-[#636366] text-sm mb-2">{option.details}</p>
                    <p className="text-sm text-[var(--color-primary)] font-medium flex items-center gap-1"><Lightbulb size={14} /> {option.tip}</p>
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
            {venue.facilities.map((facility, index) => (
              <div key={index} className="bg-[#f5f5f7] rounded-2xl p-6">
                <div className="text-[var(--color-primary)] mb-4">
                  {facilityIcons[facility.title] || <Landmark size={28} />}
                </div>
                <h3 className="font-bold text-[#1d1d1f] mb-2">{facility.title}</h3>
                <p className="text-sm text-[#636366]">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather & What to Bring */}
      {(venue.weather || venue.whatToBring) && (
        <section className="py-16 bg-[#f5f5f7]">
          <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
            <div className={`grid grid-cols-1 ${venue.weather && venue.whatToBring ? 'md:grid-cols-2' : ''} gap-8`}>
              {venue.weather && (
                <div className="bg-white rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2"><Sun size={24} className="text-[var(--color-primary)]" /> {venue.weather.title}</h3>
                  <div className="space-y-4">
                    {venue.weather.rows.map((row, index) => (
                      <div key={index} className={`flex justify-between items-center ${index < venue.weather!.rows.length - 1 ? 'pb-4 border-b border-[#f5f5f7]' : ''}`}>
                        <span className="text-[#636366]">{row.label}</span>
                        <span className={`font-semibold ${index === venue.weather!.rows.length - 1 ? 'text-[var(--color-primary)]' : 'text-[#1d1d1f]'}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {venue.whatToBring && (
                <div className="bg-white rounded-3xl p-8">
                  <h3 className="text-2xl font-bold text-[#1d1d1f] mb-6 flex items-center gap-2"><Backpack size={24} className="text-[var(--color-primary)]" /> What to Bring</h3>
                  <ul className="space-y-3">
                    {venue.whatToBring.map((item, index) => (
                      <li key={index} className="flex items-center gap-3 text-[#1d1d1f]">
                        <span className="w-6 h-6 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center text-xs">{'\u2713'}</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Nearby Hotels */}
      {venue.hotels && venue.hotels.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
            <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-4 text-center">
              Nearby Hotels
            </h2>
            <p className="text-center text-[#636366] mb-8 max-w-2xl mx-auto">
              Recommended accommodations near the stadium
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {venue.hotels.map((hotel, index) => (
                <div key={index} className="bg-[#f5f5f7] rounded-2xl p-6">
                  <div className="text-sm text-[var(--color-primary)] font-medium mb-2">{hotel.rating} &bull; {hotel.distance}</div>
                  <h3 className="font-bold text-[#1d1d1f] mb-2">{hotel.name}</h3>
                  <p className="text-sm text-[#636366]">{hotel.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-[#1d1d1f] text-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px] text-center">
          <h2 className="text-[32px] font-bold mb-4">{venue.ctaTitle}</h2>
          <p className="text-lg text-white/70 mb-8 max-w-xl mx-auto">
            {venue.ctaDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-8 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Browse All Tickets
            </button>
            <button
              onClick={() => router.push('/faq')}
              className="px-8 py-4 bg-white text-[#1d1d1f] font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              View FAQ
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
