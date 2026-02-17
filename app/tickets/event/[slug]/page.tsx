// Dynamic slug-based route: /tickets/event/[slug]
// SSR/ISR with parallel API fetching for optimal performance.
//
// SEO priority:
// 1. Content file (content/{site_code}/events/{slug}.ts) — rich, hand-crafted SEO
// 2. Auto-generated from API data (venue, date, price) — good default

import type { Metadata } from 'next';
import EventClient from './EventClient';
import { fetchEventWithCategoriesServer } from '@/lib/api-server';
import { getSiteConfig } from '@/lib/site-config';
import { loadSEOStrict } from '@/lib/seo-loader';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Priority 1: hand-crafted SEO from content file
  const seo = await loadSEOStrict(siteCode, `events/${slug}`);
  if (seo) {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords?.join(', '),
      openGraph: seo.og ? {
        title: seo.og.title,
        description: seo.og.description,
        images: seo.og.image ? [seo.og.image] : undefined,
      } : undefined,
      alternates: {
        canonical: `${baseUrl}/tickets/event/${slug}`,
      },
    };
  }

  // Priority 2: auto-generated from API data
  const { event } = await fetchEventWithCategoriesServer(slug);
  const { brand } = getSiteConfig();

  if (event) {
    const pricePart = event.minPrice ? ` Prices from $${event.minPrice}.` : '';
    const venuePart = event.venue ? ` at ${event.venue}` : '';
    const datePart = event.day && event.date && event.month
      ? `, ${event.day} ${event.date} ${event.month}`
      : '';

    return {
      title: `${event.title} Tickets | ${brand}`,
      description: `Buy tickets for ${event.title}${venuePart}${datePart}.${pricePart} Secure checkout.`,
      alternates: {
        canonical: `${baseUrl}/tickets/event/${event.slug}`,
      },
    };
  }

  // Fallback for not found events
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} Tickets | ${brand}`,
    description: `Get tickets for ${title}. Secure checkout and authentic tickets guaranteed.`,
    alternates: {
      canonical: `${baseUrl}/tickets/event/${slug}`,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // SSR: Fetch event + categories in parallel (ISR revalidate: 60s)
  const { event, categories } = await fetchEventWithCategoriesServer(slug);

  console.log(`[SSR] EventPage: event=${event?.title || 'null'}, categories=${categories.length}`);

  return (
    <EventClient
      slug={slug}
      initialEvent={event}
      initialCategories={categories}
    />
  );
}
