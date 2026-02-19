import { notFound } from 'next/navigation';
import { isTennisSite, getSiteUrl } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import WTATicketsClient from './WTATicketsClient';
import { fetchWTAEventsServer } from '@/lib/api-server';

export function generateMetadata() {
  if (!isTennisSite()) return {};

  return buildMetadata({
    path: '/tickets/wta',
    title: 'WTA 1000 Tickets Dubai 2026 | Dubai Tennis Championships',
    description:
      "Buy WTA 1000 Dubai 2026 tickets. Women's tournament February 15-21. See Swiatek, Sabalenka, Gauff compete at Dubai Tennis Stadium. Prime from $1000, Grandstand from $300.",
    keywords: "WTA 1000 Dubai, WTA Dubai tickets, women's tennis Dubai, Dubai Tennis 2026, Swiatek Dubai, tennis tickets",
    ogImage: '/images/federer-dubai-wta.jpg',
  });
}

export default async function WTATicketsPage() {
  if (!isTennisSite()) notFound();

  const siteUrl = getSiteUrl();
  const initialEvents = await fetchWTAEventsServer();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'WTA 1000 Dubai 2026 - Dubai Duty Free Tennis Championships',
    description: "The Dubai Duty Free Tennis Championships WTA 1000 tournament featuring top-ranked women's tennis players.",
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
      url: `${siteUrl}/tickets/wta`,
    },
    sport: 'Tennis',
    competitor: [
      { '@type': 'Person', name: 'Iga Swiatek' },
      { '@type': 'Person', name: 'Aryna Sabalenka' },
      { '@type': 'Person', name: 'Coco Gauff' },
    ],
  };

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
