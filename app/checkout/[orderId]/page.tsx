import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ClearCartOnSuccess from './ClearCartOnSuccess';
import TrackPurchase from './TrackPurchase';
import { buildMetadata } from '@/lib/seo/buildMetadata';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || '';
const SITE_BRAND = process.env.NEXT_PUBLIC_SITE_BRAND || 'Tickets';

interface OrderItem {
  id: string;
  event_id: number;
  category_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  event_title: string;
  event_date: string;
  event_month: string;
  event_day: string;
  event_time: string;
  category_name: string;
  venue: string;
}

interface Order {
  id: string;
  order_number: string;
  name: string;
  email: string;
  phone: string;
  comments: string;
  total_amount: string;
  status: string;
  total_tickets: number;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
  paid_at: string | null;
}

async function fetchOrder(orderId: string): Promise<Order | null> {
  try {
    let url = `${API_BASE_URL}/api/orders/${orderId}/`;
    if (SITE_CODE) {
      url += `?site_code=${encodeURIComponent(SITE_CODE)}`;
    }

    const response = await fetch(url, {
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch order: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('[fetchOrder] Error:', error);
    return null;
  }
}

interface Props {
  params: Promise<{ orderId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderId } = await params;
  return buildMetadata({
    path: `/checkout/${orderId}`,
    title: `Order ${orderId.slice(0, 8)}...`,
    description: 'Review your order details and complete payment.',
    noindex: true,
  });
}

export default async function OrderCheckoutPage({ params }: Props) {
  const { orderId } = await params;
  const order = await fetchOrder(orderId);

  if (!order) {
    notFound();
  }

  const formatStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Pending Payment', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
      paid: { label: 'Paid', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
      refunded: { label: 'Refunded', color: 'bg-gray-100 text-gray-800' },
    };
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const statusInfo = formatStatus(order.status);

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Clear cart when order is paid */}
      <ClearCartOnSuccess orderStatus={order.status} />

      {/* GA4: Fire purchase event for Google Ads / Analytics conversion tracking */}
      <TrackPurchase
        orderId={order.id}
        orderNumber={order.order_number}
        totalAmount={order.total_amount}
        status={order.status}
        items={order.items}
      />

      {/* Header */}
      <header className="bg-white border-b border-[#d2d2d7]">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <Link href="/" className="text-[var(--color-primary)] font-semibold text-lg hover:underline">
            {SITE_BRAND}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-[#1d1d1f]">Order Summary</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#86868b]">Order Number</span>
              <p className="font-mono font-semibold text-[#1d1d1f]">{order.order_number}</p>
            </div>
            <div>
              <span className="text-[#86868b]">Date</span>
              <p className="font-semibold text-[#1d1d1f]">
                {new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">Tickets</h2>

          <div className="space-y-4">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start p-4 bg-[#f5f5f7] rounded-xl"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1d1d1f]">{item.event_title}</h3>
                  <p className="text-sm text-[#86868b]">
                    {item.event_date} {item.event_month}, {item.event_day} at {item.event_time}
                  </p>
                  <p className="text-sm text-[#86868b]">{item.venue}</p>
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold rounded">
                      {item.category_name}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#1d1d1f]">${parseFloat(item.subtotal).toLocaleString()}</p>
                  <p className="text-sm text-[#86868b]">
                    {item.quantity} x ${parseFloat(item.unit_price).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-[#d2d2d7]">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-[#1d1d1f]">Total</span>
              <span className="text-2xl font-bold text-[#1d1d1f]">
                ${parseFloat(order.total_amount).toLocaleString()}
              </span>
            </div>
            <p className="text-sm text-[#86868b] mt-1">
              {order.total_tickets} {order.total_tickets === 1 ? 'ticket' : 'tickets'}
            </p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">Contact Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-[#86868b]">Name</span>
              <p className="font-semibold text-[#1d1d1f]">{order.name}</p>
            </div>
            <div>
              <span className="text-[#86868b]">Email</span>
              <p className="font-semibold text-[#1d1d1f]">{order.email}</p>
            </div>
            <div>
              <span className="text-[#86868b]">Phone</span>
              <p className="font-semibold text-[#1d1d1f]">{order.phone}</p>
            </div>
            {order.comments && (
              <div className="md:col-span-2">
                <span className="text-[#86868b]">Comments</span>
                <p className="font-semibold text-[#1d1d1f]">{order.comments}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Section - Only show for pending orders */}
        {order.status === 'pending' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#1d1d1f] mb-4">Payment</h2>
            <p className="text-[#86868b] mb-4">
              Complete your purchase to secure your tickets. Stripe payment integration coming soon.
            </p>
            <button
              disabled
              className="w-full py-4 bg-[var(--color-primary)] text-white font-semibold rounded-xl opacity-50 cursor-not-allowed"
            >
              Pay ${parseFloat(order.total_amount).toLocaleString()}
            </button>
            <p className="text-xs text-[#86868b] mt-3 text-center">
              Stripe integration not yet implemented
            </p>
          </div>
        )}

        {/* Paid Order Message */}
        {order.status === 'paid' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-green-700">
              Thank you for your purchase! Your tickets have been confirmed and a confirmation email has been sent to your email address.
            </p>
          </div>
        )}

        {/* Confirmed Order Message */}
        {order.status === 'confirmed' && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Order Confirmed</h2>
            <p className="text-blue-700">
              Your order has been confirmed. Check your email for details.
            </p>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-[var(--color-primary)] font-medium hover:underline">
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
