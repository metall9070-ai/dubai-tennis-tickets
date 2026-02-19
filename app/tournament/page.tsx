import { notFound } from 'next/navigation';
import { isTennisSite } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import TournamentClient from './TournamentClient';

export function generateMetadata() {
  if (!isTennisSite()) return {};

  return buildMetadata({
    path: '/tournament',
    title: 'Tournament Info | Dubai Tennis Championships 2026',
    description:
      'Dubai Duty Free Tennis Championships 2026 tournament information. ATP 500 and WTA 1000 events, schedule, and past champions.',
  });
}

export default function TournamentPage() {
  if (!isTennisSite()) notFound();
  return <TournamentClient />;
}
