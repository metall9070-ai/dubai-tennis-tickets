import type { Metadata } from 'next';
import SeatingGuideClient from './SeatingGuideClient';

export const metadata: Metadata = {
  title: 'Seating Guide | Dubai Tennis Championships 2026',
  description: 'Complete seating guide for Dubai Duty Free Tennis Stadium. Compare Courtside, Prime, and Grandstand seats. View pricing, amenities, and choose the best seats.',
  keywords: 'Dubai Tennis seating, Dubai Tennis Stadium seats, courtside tickets, tennis seating chart',
  openGraph: {
    title: 'Seating Guide | Dubai Tennis Stadium',
    description: 'Find the perfect seats at Dubai Tennis Stadium. Courtside, Prime, and Grandstand options available.',
  },
  alternates: {
    canonical: '/seating-guide',
  },
};

export default function SeatingGuidePage() {
  return <SeatingGuideClient />;
}
