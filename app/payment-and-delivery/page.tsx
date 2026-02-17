import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import PaymentClient from './PaymentClient';

const { brand } = getSiteConfig();

export const metadata: Metadata = {
  title: `Payment & Delivery | ${brand}`,
  description: `Payment methods and ticket delivery information for ${brand}.`,
  alternates: { canonical: '/payment-and-delivery' },
};

export default function PaymentPage() {
  return <PaymentClient />;
}
