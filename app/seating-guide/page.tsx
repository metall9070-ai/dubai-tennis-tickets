import { notFound } from 'next/navigation';
import { isTennisSite } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import SeatingGuideClient from './SeatingGuideClient';

export function generateMetadata() {
  if (!isTennisSite()) return {};

  return buildMetadata({
    path: '/seating-guide',
    title: 'Seating Guide – Dubai Tennis Championships 2026',
    description:
      'Complete seating guide for Dubai Duty Free Tennis Stadium. Compare Courtside, Prime, and Grandstand seats. View pricing, amenities, and choose the best seats.',
    keywords: 'Dubai Tennis seating, Dubai Tennis Stadium seats, courtside tickets, tennis seating chart',
  });
}

export default function SeatingGuidePage() {
  if (!isTennisSite()) notFound();
  return <SeatingGuideClient />;
}
