import { notFound } from 'next/navigation';
import { isTennisSite, getSiteUrl } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import ATPTicketsClient from './ATPTicketsClient';
import { fetchATPEventsServer } from '@/lib/api-server';

export function generateMetadata() {
  if (!isTennisSite()) return {};

  return buildMetadata({
    path: '/tickets/atp',
    title: 'ATP 500 Tickets Dubai 2026',
    description:
      "ATP 500 Dubai 2026 tickets — Feb 23–28. See Djokovic, Sinner & Alcaraz live. Grandstand from $200. Secure booking, instant confirmation.",
    keywords: "ATP 500 Dubai, ATP Dubai tickets, men's tennis Dubai, Dubai Tennis 2026, Djokovic Dubai, tennis tickets",
    ogImage: '/images/federer-dubai-atp.jpg',
  });
}

export default async function ATPTicketsPage() {
  if (!isTennisSite()) notFound();

  const siteUrl = getSiteUrl();
  const initialEvents = await fetchATPEventsServer();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'ATP 500 Dubai 2026 - Dubai Duty Free Tennis Championships',
    description: "The Dubai Duty Free Tennis Championships ATP 500 tournament featuring top-ranked men's tennis players.",
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
      url: `${siteUrl}/tickets/atp`,
    },
    sport: 'Tennis',
    competitor: [
      { '@type': 'Person', name: 'Novak Djokovic' },
      { '@type': 'Person', name: 'Jannik Sinner' },
      { '@type': 'Person', name: 'Carlos Alcaraz' },
    ],
  };

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
