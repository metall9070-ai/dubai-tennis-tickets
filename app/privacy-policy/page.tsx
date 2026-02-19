import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import PrivacyClient from './PrivacyClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/privacy-policy',
  title: 'Privacy Policy',
  description: `How Dubai Tennis Tickets collects, uses, and protects your data. Your information is handled securely and never sold to third parties.`,
});

export default function PrivacyPage() {
  return <PrivacyClient />;
}
