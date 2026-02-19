import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import CheckoutClient from './CheckoutClient';

const config = getSiteConfig();

// Checkout is noindex/nofollow — not for search engines.
// Canonical is self-referential (/checkout), never pointing to homepage.
// (seo_architecture.md §12.4)
export const metadata = buildMetadata({
  path: '/checkout',
  title: `Checkout | ${config.brand}`,
  description: 'Complete your ticket purchase. Secure checkout with instant confirmation.',
  noindex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
