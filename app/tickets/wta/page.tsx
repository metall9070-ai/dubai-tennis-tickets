import type { Metadata } from 'next';
import WTATicketsClient from './WTATicketsClient';
import { fetchWTAEventsServer } from '@/lib/api-server';

export const metadata: Metadata = {
  title: 'WTA 1000 Tickets Dubai 2026 | Dubai Tennis Championships',
  description: 'Buy WTA 1000 Dubai 2026 tickets. Women\'s tournament February 15-21. See Swiatek, Sabalenka, Gauff compete at Dubai Tennis Stadium. Prime from $1000, Grandstand from $300.',
  keywords: 'WTA 1000 Dubai, WTA Dubai tickets, women\'s tennis Dubai, Dubai Tennis 2026, Swiatek Dubai, tennis tickets',
  openGraph: {
    title: 'WTA 1000 Dubai Tickets 2026 | Women\'s Tournament Feb 15-21',
    description: 'Premium tickets for WTA 1000 Dubai. World\'s top women\'s players compete February 15-21, 2026.',
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1200&auto=format&fit=crop'],
  },
  alternates: {
    canonical: '/tickets/wta',
  },
};

export default async function WTATicketsPage() {
  const initialEvents = await fetchWTAEventsServer();
  return <WTATicketsClient initialEvents={initialEvents} />;
}
