import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import AboutClient from './AboutClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/about',
  title: 'About Us',
  description: `Dubai Tennis Tickets is an independent concierge service. Verified tickets, secure booking, and 24/7 support for every order.`,
});

export default function AboutPage() {
  return <AboutClient />;
}
