import { notFound } from 'next/navigation';
import { loadSEOStrict } from '@/lib/seo-loader';
import { isTennisSite } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContentPage from '@/app/components/ContentPage';
import VenueClient from './VenueClient';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

export async function generateMetadata() {
  const seo = await loadSEOStrict(siteCode, 'venue');

  if (seo) {
    return buildMetadata({
      path: '/venue',
      title: seo.title,
      description: seo.description,
    });
  }

  if (isTennisSite()) {
    return buildMetadata({
      path: '/venue',
      title: 'Venue & Directions – Dubai Tennis Stadium',
      description:
        'Dubai Duty Free Tennis Stadium at Aviation Club, Al Garhoud. Metro, taxi, and parking guide — everything you need to arrive on time.',
      keywords: 'Dubai Tennis Stadium, Aviation Club, Dubai Tennis venue, how to get to Dubai Tennis',
    });
  }

  return {};
}

export default async function VenuePage() {
  const seo = await loadSEOStrict(siteCode, 'venue');

  if (seo?.h1) {
    return (
      <div className="relative min-h-screen bg-[#f5f5f7]">
        <Navbar isVisible />
        <ContentPage content={seo} />
        <Footer />
      </div>
    );
  }

  if (isTennisSite()) {
    return <VenueClient />;
  }

  notFound();
}
