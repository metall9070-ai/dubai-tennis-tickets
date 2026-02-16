import HomeClient from './HomeClient';
import { fetchEventsServer } from '@/lib/api-server';

export default async function HomePage() {
  // Server-side fetch with ISR (revalidate: 60s)
  const initialEvents = await fetchEventsServer();

  return <HomeClient initialEvents={initialEvents} />;
}
