import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

const SITE_BRAND = process.env.NEXT_PUBLIC_SITE_BRAND || 'Tickets';

export const metadata: Metadata = {
  title: `Checkout | ${SITE_BRAND}`,
  description: 'Complete your Dubai Tennis Championships ticket purchase. Secure checkout with instant confirmation.',
  robots: 'noindex, nofollow',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
