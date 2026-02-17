// Dynamic slug-based route: /tickets/event/[slug]
// SSR/ISR with parallel API fetching for optimal performance.

import type { Metadata } from 'next';
import EventClient from './EventClient';
import { fetchEventWithCategoriesServer } from '@/lib/api-server';
import { getSiteConfig } from '@/lib/site-config';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch event data for dynamic metadata
  const { event } = await fetchEventWithCategoriesServer(slug);

  const { brand } = getSiteConfig();

  if (event) {
    return {
      title: `${event.title} Tickets | ${brand}`,
      description: `Get tickets for ${event.title}. ${event.type} event on ${event.date} ${event.month}. Secure checkout.`,
      alternates: {
        canonical: `/tickets/event/${event.slug}`,
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
      canonical: `/tickets/event/${slug}`,
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
