import type { Metadata } from 'next';
import TournamentClient from './TournamentClient';

export const metadata: Metadata = {
  title: 'Tournament Info | Dubai Tennis Championships 2026',
  description: 'Dubai Duty Free Tennis Championships 2026 tournament information. ATP 500 and WTA 1000 events, schedule, and past champions.',
  alternates: { canonical: '/tournament' },
};

export default function TournamentPage() {
  return <TournamentClient />;
}
