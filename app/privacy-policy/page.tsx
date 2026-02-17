import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import PrivacyClient from './PrivacyClient';

const { brand } = getSiteConfig();

export const metadata: Metadata = {
  title: `Privacy Policy | ${brand}`,
  description: `Privacy Policy for ${brand}. How we collect, use, and protect your personal information.`,
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
