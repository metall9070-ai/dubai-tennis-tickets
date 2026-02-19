import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import TermsClient from './TermsClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/terms-of-service',
  title: 'Terms of Service',
  description: `Terms of Service for ${config.brand}. Purchase terms, refund policy, and user agreements for ticket orders.`,
});

export default function TermsPage() {
  return <TermsClient />;
}
