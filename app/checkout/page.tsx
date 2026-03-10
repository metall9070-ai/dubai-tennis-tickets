import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import CheckoutClient from './CheckoutClient';

const config = getSiteConfig();

// Checkout is noindex/nofollow — not for search engines.
// Canonical is self-referential (/checkout), never pointing to homepage.
// (seo_architecture.md §12.4)
export const metadata = buildMetadata({
  path: '/checkout',
  title: 'Checkout',
  description: `Complete your ${config.brand} ticket purchase. Secure checkout powered by Stripe with instant e-ticket confirmation and 24/7 support.`,
  noindex: true,
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}
