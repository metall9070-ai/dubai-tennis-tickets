import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteCode } from '@/lib/site-config';
import { loadSEOStrict } from '@/lib/seo-loader';
import HomeClient from './HomeClient';
import { fetchEventsServer } from '@/lib/api-server';
import { filterEventsForCurrentSite } from '@/lib/event-filter';
import type { SEOContent } from '@/types/seo';

export async function generateMetadata() {
  const siteCode = getSiteCode();
  const seo = await loadSEOStrict(siteCode, 'homepage');

  if (!seo) {
    // Fallback to layout metadata (current behavior)
    return {};
  }

  return buildMetadata({
    path: '/',
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    ogImage: seo.og?.image,
  });
}

export default async function HomePage() {
  const allEvents = await fetchEventsServer();
  const initialEvents = filterEventsForCurrentSite(allEvents);
  const seo = await loadSEOStrict(getSiteCode(), 'homepage');

  return (
    <HomeClient
      initialEvents={initialEvents}
      seoContent={seo || undefined}
    />
  );
}
