import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import TermsClient from './TermsClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/terms-of-service',
  title: 'Terms of Service',
  description: `Review purchase terms, refund policy, and booking conditions for Dubai Tennis Tickets. Transparent terms, no hidden fees.`,
});

export default function TermsPage() {
  return <TermsClient />;
}
