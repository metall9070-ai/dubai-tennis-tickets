import type { Metadata } from 'next';
import { loadSEOStrict } from '@/lib/seo-loader';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContentPage from '@/app/components/ContentPage';
import VenueClient from './VenueClient';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadSEOStrict(siteCode, 'venue');

  if (seo?.h1) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return {
      title: seo.title,
      description: seo.description,
      alternates: { canonical: `${baseUrl}/venue` },
    };
  }

  return {
    title: 'Venue & Directions | Dubai Tennis Stadium',
    description:
      'Dubai Duty Free Tennis Stadium location, directions, and facilities. Aviation Club Tennis Centre, Al Garhoud. Getting there by metro, taxi, and car.',
    keywords:
      'Dubai Tennis Stadium, Aviation Club, Dubai Tennis venue, how to get to Dubai Tennis',
    openGraph: {
      title: 'Dubai Tennis Stadium | Venue & Directions',
      description:
        'Find your way to Dubai Duty Free Tennis Stadium at Aviation Club.',
    },
    alternates: { canonical: '/venue' },
  };
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

  return <VenueClient />;
}
