import type { Metadata } from 'next';
import ATPTicketsClient from './ATPTicketsClient';

export const metadata: Metadata = {
  title: 'ATP 500 Tickets Dubai 2026 | Dubai Tennis Championships',
  description: 'Buy ATP 500 Dubai 2026 tickets. Men\'s tournament February 23-28. See Djokovic, Sinner, Alcaraz compete at Dubai Tennis Stadium. Prime from $1500, Grandstand from $200.',
  keywords: 'ATP 500 Dubai, ATP Dubai tickets, men\'s tennis Dubai, Dubai Tennis 2026, Djokovic Dubai, tennis tickets',
  openGraph: {
    title: 'ATP 500 Dubai Tickets 2026 | Men\'s Tournament Feb 23-28',
    description: 'Premium tickets for ATP 500 Dubai. World\'s top men\'s players compete February 23-28, 2026.',
    images: ['https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=1200&auto=format&fit=crop'],
  },
  alternates: {
    canonical: '/tickets/atp',
  },
};

export default function ATPTicketsPage() {
  return <ATPTicketsClient />;
}
