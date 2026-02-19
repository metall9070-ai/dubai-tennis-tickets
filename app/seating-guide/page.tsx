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
      'Compare Courtside, Prime, and Grandstand seats at Dubai Tennis Stadium. Find the best view for your budget — prices from $200.',
    keywords: 'Dubai Tennis seating, Dubai Tennis Stadium seats, courtside tickets, tennis seating chart',
  });
}

export default function SeatingGuidePage() {
  if (!isTennisSite()) notFound();
  return <SeatingGuideClient />;
}
