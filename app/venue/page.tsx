import type { Metadata } from 'next';
import VenueClient from './VenueClient';

export const metadata: Metadata = {
  title: 'Venue & Directions | Dubai Tennis Stadium',
  description: 'Dubai Duty Free Tennis Stadium location, directions, and facilities. Aviation Club Tennis Centre, Al Garhoud. Getting there by metro, taxi, and car.',
  keywords: 'Dubai Tennis Stadium, Aviation Club, Dubai Tennis venue, how to get to Dubai Tennis',
  openGraph: {
    title: 'Dubai Tennis Stadium | Venue & Directions',
    description: 'Find your way to Dubai Duty Free Tennis Stadium at Aviation Club.',
  },
  alternates: {
    canonical: '/venue',
  },
};

export default function VenuePage() {
  return <VenueClient />;
}
