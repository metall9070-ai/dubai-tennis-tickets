// Dynamic slug-based route: /tickets/event/[slug]
// Handles both slug and legacy ID URLs with automatic redirect.

import type { Metadata } from 'next';
import EventClient from './EventClient';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Convert slug to title format for SEO
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
  console.log('[RSC] EventPage EXECUTED - Server Component is running');
  const resolvedParams = await params;
  console.log('[RSC] Resolved slug:', resolvedParams.slug);
  return <EventClient slug={resolvedParams.slug} />;
}
