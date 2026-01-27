import type { Metadata } from 'next';
import TermsClient from './TermsClient';

export const metadata: Metadata = {
  title: 'Terms of Service | Dubai Tennis Tickets',
  description: 'Terms of Service for Dubai Tennis Tickets. Purchase terms, refund policy, and user agreements.',
  alternates: { canonical: '/terms-of-service' },
};

export default function TermsPage() {
  return <TermsClient />;
}
