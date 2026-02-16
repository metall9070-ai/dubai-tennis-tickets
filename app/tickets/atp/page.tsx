import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isTennisSite } from '@/lib/site-config';
import ATPTicketsClient from './ATPTicketsClient';
import { fetchATPEventsServer } from '@/lib/api-server';

export const metadata: Metadata = {
  title: 'ATP 500 Tickets Dubai 2026 | Dubai Tennis Championships',
  description: 'Buy ATP 500 Dubai 2026 tickets. Men\'s tournament February 23-28. See Djokovic, Sinner, Alcaraz compete at Dubai Tennis Stadium. Prime from $1500, Grandstand from $200.',
  keywords: 'ATP 500 Dubai, ATP Dubai tickets, men\'s tennis Dubai, Dubai Tennis 2026, Djokovic Dubai, tennis tickets',
  openGraph: {
    title: 'ATP 500 Dubai Tickets 2026 | Men\'s Tournament Feb 23-28',
    description: 'Premium tickets for ATP 500 Dubai. World\'s top men\'s players compete February 23-28, 2026.',
    images: ['/images/federer-dubai-atp.jpg'],
  },
  alternates: {
    canonical: '/tickets/atp',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: 'ATP 500 Dubai 2026 - Dubai Duty Free Tennis Championships',
  description: 'The Dubai Duty Free Tennis Championships ATP 500 tournament featuring top-ranked men\'s tennis players.',
  startDate: '2026-02-23',
  endDate: '2026-02-28',
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
    lowPrice: 200,
    highPrice: 3000,
    availability: 'https://schema.org/InStock',
    url: 'https://dubaitennistickets.com/tickets/atp',
  },
  sport: 'Tennis',
  competitor: [
    { '@type': 'Person', name: 'Novak Djokovic' },
    { '@type': 'Person', name: 'Jannik Sinner' },
    { '@type': 'Person', name: 'Carlos Alcaraz' },
  ],
};

export default async function ATPTicketsPage() {
  if (!isTennisSite()) notFound();

  const initialEvents = await fetchATPEventsServer();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ATPTicketsClient initialEvents={initialEvents} />
    </>
  );
}
