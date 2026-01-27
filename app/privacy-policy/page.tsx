import type { Metadata } from 'next';
import PrivacyClient from './PrivacyClient';

export const metadata: Metadata = {
  title: 'Privacy Policy | Dubai Tennis Tickets',
  description: 'Privacy Policy for Dubai Tennis Tickets. How we collect, use, and protect your personal information.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
