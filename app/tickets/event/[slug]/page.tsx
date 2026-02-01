// Dynamic slug-based route: /tickets/event/[slug]
// SSR/ISR with parallel API fetching for optimal performance.

import type { Metadata } from 'next';
import EventClient from './EventClient';
import { fetchEventWithCategoriesServer } from '@/lib/api-server';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch event data for dynamic metadata
  const { event } = await fetchEventWithCategoriesServer(slug);

  if (event) {
    return {
      title: `${event.title} Tickets | Dubai Tennis Championships 2026`,
      description: `Get tickets for ${event.title} at Dubai Tennis Championships 2026. ${event.type} tournament at ${event.date} ${event.month}. Courtside, Prime, and Grandstand options available.`,
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
    title: `${title} Tickets | Dubai Tennis Championships 2026`,
    description: `Get tickets for ${title} at Dubai Tennis Championships 2026. Courtside, Prime, and Grandstand options available.`,
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
