import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/site-config';
import TermsClient from './TermsClient';

const { brand } = getSiteConfig();

export const metadata: Metadata = {
  title: `Terms of Service | ${brand}`,
  description: `Terms of Service for ${brand}. Purchase terms, refund policy, and user agreements.`,
  alternates: { canonical: '/terms-of-service' },
};

export default function TermsPage() {
  return <TermsClient />;
}
