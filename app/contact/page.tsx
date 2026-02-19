import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import ContactClient from './ContactClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/contact',
  title: 'Contact Us',
  description: `Reach our team 24/7 for help with Dubai Tennis ticket orders. Fast response, dedicated support from booking to event day.`,
});

export default function ContactPage() {
  return <ContactClient />;
}
