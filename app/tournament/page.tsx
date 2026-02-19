import { notFound } from 'next/navigation';
import { isTennisSite } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import TournamentClient from './TournamentClient';

export function generateMetadata() {
  if (!isTennisSite()) return {};

  return buildMetadata({
    path: '/tournament',
    title: 'Tournament Info – Dubai Tennis Championships 2026',
    description:
      'Everything about Dubai Duty Free Tennis Championships 2026. ATP 500 & WTA 1000 events, Feb 15–28 at Dubai Tennis Stadium.',
  });
}

export default function TournamentPage() {
  if (!isTennisSite()) notFound();
  return <TournamentClient />;
}
