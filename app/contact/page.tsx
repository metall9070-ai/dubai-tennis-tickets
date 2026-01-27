import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us | Dubai Tennis Tickets',
  description: 'Contact Dubai Tennis Tickets for support. 24/7 customer service for Dubai Tennis Championships 2026 tickets.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return <ContactClient />;
}
