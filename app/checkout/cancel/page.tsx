import { buildMetadata } from '@/lib/seo/buildMetadata';
import CancelClient from './CancelClient';

export const metadata = buildMetadata({
  path: '/checkout/cancel',
  title: 'Payment Cancelled',
  description: 'Your payment was cancelled. Your cart items are still saved.',
  noindex: true,
});

export default function CheckoutCancelPage() {
  return <CancelClient />;
}
