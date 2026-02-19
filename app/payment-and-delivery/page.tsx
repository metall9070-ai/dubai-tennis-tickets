import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import PaymentClient from './PaymentClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/payment-and-delivery',
  title: 'Payment & Delivery',
  description: `Secure payment via Stripe with instant e-ticket delivery. All orders confirmed within minutes. Multiple payment methods accepted.`,
});

export default function PaymentPage() {
  return <PaymentClient />;
}
