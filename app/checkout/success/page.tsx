import { buildMetadata } from '@/lib/seo/buildMetadata';
import SuccessClient from './SuccessClient';

export const metadata = buildMetadata({
  path: '/checkout/success',
  title: 'Order Confirmed',
  description: 'Your ticket purchase has been confirmed. Check your email for details.',
  noindex: true,
});

export default function CheckoutSuccessPage() {
  return <SuccessClient />;
}
