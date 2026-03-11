import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import RefundClient from './RefundClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/refund-policy',
  title: 'Refund Policy',
  description: `Refund policy for ${config.brand}. Learn about our cancellation and refund terms for ticket orders.`,
});

export default function RefundPolicyPage() {
  return <RefundClient />;
}
