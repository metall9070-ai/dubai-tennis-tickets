'use server';

import { redirect } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

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
  error?: string;
}

/**
 * Server Action to create an order.
 * Called from the event page when user clicks "Buy".
 * On success, redirects to /checkout/{order_id}
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderActionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/orders/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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

      // Handle validation errors
      if (errorData.items) {
        return { success: false, error: errorData.items };
      }
      if (errorData.non_field_errors) {
        return { success: false, error: errorData.non_field_errors[0] };
      }
      if (errorData.detail) {
        return { success: false, error: errorData.detail };
      }

      return { success: false, error: 'Failed to create order' };
    }

    const data = await response.json();
    const order = data.order;

    if (!order?.id) {
      return { success: false, error: 'Invalid order response' };
    }

    return {
      success: true,
      order_id: order.id,
      order_number: order.order_number,
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
 * Server Action to create order and redirect.
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

  if (result.success && result.order_id) {
    redirect(`/checkout/${result.order_id}`);
  }

  // If we reach here, there was an error
  // The redirect above will throw, so this only runs on error
  // For form actions, we can't return error state directly
  // The component should use useFormState for error handling
}
