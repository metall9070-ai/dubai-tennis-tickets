import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import PaymentClient from './PaymentClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/payment-and-delivery',
  title: `Payment & Delivery | ${config.brand}`,
  description: `Payment methods and ticket delivery information for ${config.brand}. Secure payment via Stripe. Instant e-ticket delivery after purchase.`,
});

export default function PaymentPage() {
  return <PaymentClient />;
}
