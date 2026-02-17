import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import AboutClient from './AboutClient';

const { brand } = getSiteConfig();

export const metadata: Metadata = {
  title: `About Us | ${brand}`,
  description: `About ${brand} - independent ticket concierge service. Secure booking and guaranteed authentic tickets.`,
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return <AboutClient />;
}
