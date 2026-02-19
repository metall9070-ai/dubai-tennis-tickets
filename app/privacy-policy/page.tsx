import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import PrivacyClient from './PrivacyClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/privacy-policy',
  title: 'Privacy Policy',
  description: `Privacy Policy for ${config.brand}. How we collect, use, and protect your personal information.`,
});

export default function PrivacyPage() {
  return <PrivacyClient />;
}
