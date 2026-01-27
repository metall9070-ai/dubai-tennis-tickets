import type { Metadata } from 'next';
import PaymentClient from './PaymentClient';

export const metadata: Metadata = {
  title: 'Payment & Delivery | Dubai Tennis Tickets',
  description: 'Payment methods and ticket delivery information for Dubai Tennis Championships tickets.',
  alternates: { canonical: '/payment-and-delivery' },
};

export default function PaymentPage() {
  return <PaymentClient />;
}
