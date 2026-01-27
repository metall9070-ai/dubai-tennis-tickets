import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: 'About Us | Dubai Tennis Tickets',
  description: 'About Dubai Tennis Tickets - independent ticket concierge for Dubai Tennis Championships 2026.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
