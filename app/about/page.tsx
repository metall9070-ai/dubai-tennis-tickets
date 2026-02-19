import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import AboutClient from './AboutClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/about',
  title: `About Us | ${config.brand}`,
  description: `About ${config.brand} - independent ticket concierge service. Secure booking and guaranteed authentic tickets.`,
});

export default function AboutPage() {
  return <AboutClient />;
}
