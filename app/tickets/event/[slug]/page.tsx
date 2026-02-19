// Dynamic slug-based route: /tickets/event/[slug]
// SSR/ISR with parallel API fetching for optimal performance.
//
// SEO priority:
// 1. Content file (content/{site_code}/events/{slug}.ts) — rich, hand-crafted SEO
// 2. Auto-generated from API data (venue, date, price) — good default

import EventClient from './EventClient';
import { fetchEventWithCategoriesServer } from '@/lib/api-server';
import { getSiteConfig } from '@/lib/site-config';
import { loadSEOStrict } from '@/lib/seo-loader';
import { buildMetadata } from '@/lib/seo/buildMetadata';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const path = `/tickets/event/${slug}`;

  // Priority 1: hand-crafted SEO from content file
  const seo = await loadSEOStrict(siteCode, `events/${slug}`);
  if (seo) {
    return buildMetadata({
      path,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords?.join(', '),
      ogImage: seo.og?.image,
    });
  }

  // Priority 2: auto-generated from API data
  const { event } = await fetchEventWithCategoriesServer(slug);
  const config = getSiteConfig();

  if (event) {
    const pricePart = event.minPrice ? ` Prices from $${event.minPrice}.` : '';
    const venuePart = event.venue ? ` at ${event.venue}` : '';
    const datePart = event.day && event.date && event.month
      ? `, ${event.day} ${event.date} ${event.month}`
      : '';

    return buildMetadata({
      path,
      title: `${event.title} Tickets | ${config.brand}`,
      description: `Buy tickets for ${event.title}${venuePart}${datePart}.${pricePart} Secure checkout.`,
    });
  }

  // Fallback for not-found events
  const config2 = getSiteConfig();
  const title = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return buildMetadata({
    path,
    title: `${title} Tickets | ${config2.brand}`,
    description: `Get tickets for ${title}. Secure checkout and authentic tickets guaranteed.`,
  });
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
