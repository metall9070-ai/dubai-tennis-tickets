import { getSiteCode } from '@/lib/site-config';
import { loadSEOStrict } from '@/lib/seo-loader';
import HomeClient from './HomeClient';
import { fetchEventsServer } from '@/lib/api-server';
import type { SEOContent } from '@/types/seo';

export default async function HomePage() {
  const initialEvents = await fetchEventsServer();
  const seo = await loadSEOStrict(getSiteCode(), 'homepage');

  return (
    <HomeClient
      initialEvents={initialEvents}
      seoContent={seo || undefined}
    />
  );
}
