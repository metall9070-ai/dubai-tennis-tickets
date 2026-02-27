// Dynamic slug-based route: /tickets/event/[slug]
// SSR/ISR with parallel API fetching for optimal performance.
//
// SEO priority:
// 1. Content file (content/{site_code}/events/{slug}.ts) — rich, hand-crafted SEO
// 2. Auto-generated from API data (venue, date, price) — good default

import EventClient from './EventClient';
import { fetchEventWithCategoriesServer } from '@/lib/api-server';
import { getSiteConfig, getSiteUrl } from '@/lib/site-config';
import { loadSEOStrict } from '@/lib/seo-loader';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import { loadEventSEO } from '@/lib/event-seo-loader';
import { notFound, permanentRedirect } from 'next/navigation';
import { getRedirectSlug } from '@/lib/slug-redirect-map';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';
const SITE_URL = getSiteUrl(); // Dynamic domain resolution (SEO_ARCHITECTURE §3C)

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const path = `/tickets/event/${slug}`;

  // Priority 1: EventSEO (event-level SEO with JSON-LD support)
  const eventSEO = await loadEventSEO(siteCode, slug);
  if (eventSEO) {
    const metadata = buildMetadata({
      path,
      title: eventSEO.title,
      description: eventSEO.description,
    });

    const breadcrumbList = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${SITE_URL}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Schedule',
          item: `${SITE_URL}/schedule`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: eventSEO.h1,
          item: `${SITE_URL}${path}`,
        },
      ],
    };

    // Inject JSON-LD structured data if provided
    if (eventSEO.jsonLd) {
      // Clone jsonLd to avoid mutating source object
      const eventJsonLd = JSON.parse(JSON.stringify(eventSEO.jsonLd));

      // Inject dynamic offers.url if offers object exists (SEO_ARCHITECTURE §3C)
      if (eventJsonLd.offers) {
        eventJsonLd.offers.url = `${SITE_URL}${path}`;
      }

      return {
        ...metadata,
        other: {
          'script:ld+json': JSON.stringify([eventJsonLd, breadcrumbList]),
        },
      };
    }

    return {
      ...metadata,
      other: {
        'script:ld+json': JSON.stringify(breadcrumbList),
      },
    };
  }

  // Priority 2: hand-crafted SEO from old content file structure (backward compatibility)
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
      title: `${event.title} Tickets`,
      description: `Secure your tickets for ${event.title}${venuePart}${datePart}.${pricePart} Verified seller, instant confirmation guaranteed.`,
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
    title: `${title} Tickets`,
    description: `Get tickets for ${title}. Secure checkout and authentic tickets guaranteed.`,
  });
}

export default async function EventPage({ params }: Props) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // SSR: Fetch event + categories + eventSEO in parallel (ISR revalidate: 60s)
  const { event, categories } = await fetchEventWithCategoriesServer(slug);

  // P1 FIX: SEO hardening — 308 permanent redirect for changed event slugs
  // If event not found, check if slug has a redirect mapping
  // This preserves backlinks and SEO equity when slugs change in CRM
  if (!event) {
    const newSlug = getRedirectSlug(slug);
    if (newSlug) {
      // Permanent redirect (308) to new slug
      // Next.js App Router uses 308 for permanent redirects (treated same as 301 by Google)
      // ISR-safe: Next.js will cache the redirect
      // Multi-site isolated: redirect stays within same domain
      permanentRedirect(`/tickets/event/${newSlug}`);
    }

    // No event and no redirect → proper 404
    // ISR-safe: Next.js will cache 404 response, revalidation restores 200 when event reappears
    notFound();
  }

  const eventSEO = await loadEventSEO(siteCode, slug);

  console.log(`[SSR] EventPage: event=${event?.title || 'null'}, categories=${categories.length}, eventSEO=${eventSEO ? 'loaded' : 'null'}`);

  return (
    <EventClient
      slug={slug}
      initialEvent={event}
      initialCategories={categories}
      eventSEO={eventSEO}
    />
  );
}
