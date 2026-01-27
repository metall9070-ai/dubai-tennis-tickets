import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Checkout | Dubai Tennis Tickets',
  description: 'Complete your Dubai Tennis Championships ticket purchase. Secure checkout with instant confirmation.',
  robots: 'noindex, nofollow',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
