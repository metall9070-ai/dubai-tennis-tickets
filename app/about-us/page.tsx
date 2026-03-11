import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import AboutClient from './AboutClient';

const config = getSiteConfig();

export const metadata = buildMetadata({
  path: '/about-us',
  title: 'About Us',
  description: `${config.brand} is a professional ticket concierge service specializing in premium access to sports and entertainment events.`,
});

export default function AboutUsPage() {
  return <AboutClient />;
}
