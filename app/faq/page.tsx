import type { Metadata } from 'next';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'FAQ | Dubai Tennis Championships 2026 Tickets',
  description: 'Frequently asked questions about Dubai Duty Free Tennis Championships 2026 tickets. Ticket delivery, refund policy, seating information, and event details.',
  keywords: 'Dubai Tennis FAQ, ticket questions, refund policy, Dubai Tennis 2026 help',
  openGraph: {
    title: 'FAQ | Dubai Tennis Tickets 2026',
    description: 'Get answers to common questions about Dubai Tennis Championships tickets.',
  },
  alternates: {
    canonical: '/faq',
  },
};

export default function FAQPage() {
  return <FAQClient />;
}
