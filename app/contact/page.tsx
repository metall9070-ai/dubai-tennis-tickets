import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import ContactClient from './ContactClient';

const { brand } = getSiteConfig();

export const metadata: Metadata = {
  title: `Contact Us | ${brand}`,
  description: `Contact ${brand} for support. 24/7 customer service for event tickets.`,
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
