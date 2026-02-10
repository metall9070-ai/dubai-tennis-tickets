import { MetadataRoute } from 'next';
import { fetchEventsServer } from '@/lib/api-server';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dubaitennistickets.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/tickets/atp`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tickets/wta`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/seating-guide`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/venue`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tournament`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Dynamic event pages — fetch ALL events (no site_code).
  // SEO must NOT depend on EventVisibility — event pages are always accessible.
  let eventPages: MetadataRoute.Sitemap = [];

  try {
    const events = await fetchEventsServer('');
    eventPages = events.map(event => ({
      url: `${SITE_URL}/tickets/event/${event.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('[Sitemap] Failed to fetch events:', error);
  }

  return [...staticPages, ...eventPages];
}
