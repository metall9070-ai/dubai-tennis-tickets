'use server';

import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || '';

export interface CreateOrderInput {
  event_id: number;
  category_id: number;
  quantity: number;
  name: string;
  email: string;
  phone: string;
  comments?: string;
}

export interface OrderActionResult {
  success: boolean;
  order_id?: string;
  order_number?: string;
  checkout_url?: string;
  error?: string;
}

/**
 * Server Action to create an order + Stripe checkout session.
 * Uses the combined /api/checkout/create-session/ endpoint.
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/checkout/create-session/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        site_code: SITE_CODE,
        name: input.name,
        email: input.email,
        phone: input.phone,
        comments: input.comments || '',
        items: [
          {
            event_id: input.event_id,
            category_id: input.category_id,
            quantity: input.quantity,
          },
        ],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (errorData.details) {
        const fieldErrors: string[] = [];
        for (const [, errors] of Object.entries(errorData.details)) {
          if (Array.isArray(errors)) {
            fieldErrors.push(...errors);
          } else if (typeof errors === 'string') {
            fieldErrors.push(errors);
          }
        }
        if (fieldErrors.length > 0) {
          return { success: false, error: fieldErrors.join('. ') };
        }
      }
      if (errorData.message) {
        return { success: false, error: errorData.message };
      }
      if (errorData.error) {
        return { success: false, error: errorData.error };
      }

      return { success: false, error: 'Failed to create order' };
    }

    const data = await response.json();

    if (!data.order_id || !data.checkout_url) {
      return { success: false, error: 'Invalid response from server' };
    }

    return {
      success: true,
      order_id: data.order_id,
      order_number: data.order_number,
      checkout_url: data.checkout_url,
    };
  } catch (error) {
    console.error('[createOrder] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Connection error',
    };
  }
}

/**
 * Server Action to create order and redirect to Stripe checkout.
 * Use this for form submissions that should redirect on success.
 */
export async function createOrderAndRedirect(formData: FormData): Promise<void> {
  const input: CreateOrderInput = {
    event_id: Number(formData.get('event_id')),
    category_id: Number(formData.get('category_id')),
    quantity: Number(formData.get('quantity')),
    name: String(formData.get('name')),
    email: String(formData.get('email')),
    phone: String(formData.get('phone')),
    comments: String(formData.get('comments') || ''),
  };

  const result = await createOrder(input);

  if (result.success && result.checkout_url) {
    redirect(result.checkout_url);
  }
}
