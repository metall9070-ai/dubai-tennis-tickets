'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface OrderItem {
  event_id: number;
  category_id: number;
  quantity: number;
  unit_price: string;
  subtotal: string;
  event_title: string;
  category_name: string;
}

interface TrackPurchaseProps {
  orderId: string;
  orderNumber: string;
  totalAmount: string;
  status: string;
  items: OrderItem[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export default function TrackPurchase({ orderId, orderNumber, totalAmount, status, items }: TrackPurchaseProps) {
  const hasFired = useRef(false);
  const [currentStatus, setCurrentStatus] = useState(status);

  const firePurchase = useCallback(() => {
    if (hasFired.current) return;

    // Deduplicate across page refreshes within the same browser session
    const key = `purchase_tracked_${orderId}`;
    if (sessionStorage.getItem(key)) return;

    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'purchase', {
        transaction_id: orderId,
        affiliation: 'Dubai Tennis Tickets',
        value: parseFloat(totalAmount),
        currency: 'USD',
        tax: 0,
        shipping: 0,
        items: items.map((item, i) => ({
          item_id: `${item.event_id}-${item.category_id}`,
          item_name: item.event_title,
          item_variant: item.category_name,
          price: parseFloat(item.unit_price),
          quantity: item.quantity,
          index: i,
        })),
      });

      console.log(`[GA4] purchase event fired for order ${orderNumber} ($${totalAmount})`);
      hasFired.current = true;
      sessionStorage.setItem(key, '1');
    }
  }, [orderId, orderNumber, totalAmount, items]);

  // Fire immediately if already paid on SSR
  useEffect(() => {
    if (currentStatus === 'paid') {
      firePurchase();
    }
  }, [currentStatus, firePurchase]);

  // Poll for status change: pending/confirmed → paid (handles Stripe webhook delay)
  useEffect(() => {
    if (currentStatus === 'paid' || currentStatus === 'cancelled' || currentStatus === 'refunded') return;
    if (!API_BASE_URL) return;

    let attempts = 0;
    const maxAttempts = 15; // 15 × 2s = 30s max wait
    const interval = setInterval(async () => {
      attempts++;
      if (attempts > maxAttempts) {
        console.log('[GA4] Stopped polling — webhook did not arrive within 30s');
        clearInterval(interval);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'paid') {
            setCurrentStatus('paid');
            clearInterval(interval);
          }
        }
      } catch {
        // Ignore polling errors — will retry on next interval
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [orderId, currentStatus]);

  return null;
}
