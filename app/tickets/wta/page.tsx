import type { Metadata } from 'next';
import WTATicketsClient from './WTATicketsClient';
import { fetchWTAEventsServer } from '@/lib/api-server';

export const metadata: Metadata = {
  title: 'WTA 1000 Tickets Dubai 2026 | Dubai Tennis Championships',
  description: 'Buy WTA 1000 Dubai 2026 tickets. Women\'s tournament February 15-21. See Swiatek, Sabalenka, Gauff compete at Dubai Tennis Stadium. Prime from $1000, Grandstand from $300.',
  keywords: 'WTA 1000 Dubai, WTA Dubai tickets, women\'s tennis Dubai, Dubai Tennis 2026, Swiatek Dubai, tennis tickets',
  openGraph: {
    title: 'WTA 1000 Dubai Tickets 2026 | Women\'s Tournament Feb 15-21',
    description: 'Premium tickets for WTA 1000 Dubai. World\'s top women\'s players compete February 15-21, 2026.',
    images: ['/images/federer-dubai-wta.jpg'],
  },
  alternates: {
    canonical: '/tickets/wta',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: 'WTA 1000 Dubai 2026 - Dubai Duty Free Tennis Championships',
  description: 'The Dubai Duty Free Tennis Championships WTA 1000 tournament featuring top-ranked women\'s tennis players.',
  startDate: '2026-02-15',
  endDate: '2026-02-21',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    name: 'Dubai Duty Free Tennis Stadium',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Dubai',
      addressCountry: 'UAE',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'Dubai Duty Free Tennis Championships',
    url: 'https://dubaitennischampionships.com',
  },
  offers: {
    '@type': 'AggregateOffer',
    priceCurrency: 'USD',
    lowPrice: 300,
    highPrice: 2000,
    availability: 'https://schema.org/InStock',
    url: 'https://dubaitennistickets.com/tickets/wta',
  },
  sport: 'Tennis',
  competitor: [
    { '@type': 'Person', name: 'Iga Swiatek' },
    { '@type': 'Person', name: 'Aryna Sabalenka' },
    { '@type': 'Person', name: 'Coco Gauff' },
  ],
};

export default async function WTATicketsPage() {
  const initialEvents = await fetchWTAEventsServer();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <WTATicketsClient initialEvents={initialEvents} />
    </>
  );
}
