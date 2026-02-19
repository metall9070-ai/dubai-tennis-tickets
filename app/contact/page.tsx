import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import ContactClient from './ContactClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/contact',
  title: 'Contact Us',
  description: `Contact ${config.brand} for support. 24/7 customer service for event tickets.`,
});

export default function ContactPage() {
  return <ContactClient />;
}
