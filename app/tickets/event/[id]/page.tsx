import type { Metadata } from 'next';
import EventClient from './EventClient';

export const metadata: Metadata = {
  title: 'Select Tickets | Dubai Tennis Championships 2026',
  description: 'Choose your seats for Dubai Tennis Championships 2026. Courtside, Prime, and Grandstand options available.',
};

export default function EventPage() {
  return <EventClient />;
}
