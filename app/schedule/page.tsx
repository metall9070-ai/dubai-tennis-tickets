import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { loadSEOStrict } from '@/lib/seo-loader';
import { fetchEventsServer } from '@/lib/api-server';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContentPage from '@/app/components/ContentPage';
import ScheduleClient from './ScheduleClient';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadSEOStrict(siteCode, 'schedule');
  if (!seo?.h1) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(', '),
    alternates: { canonical: `${baseUrl}/schedule` },
  };
}

export default async function SchedulePage() {
  const [seo, initialEvents] = await Promise.all([
    loadSEOStrict(siteCode, 'schedule'),
    fetchEventsServer(),
  ]);

  if (!seo?.h1) notFound();

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible />
      <ContentPage content={seo}>
        <ScheduleClient initialEvents={initialEvents} />
      </ContentPage>
      <Footer />
    </div>
  );
}
