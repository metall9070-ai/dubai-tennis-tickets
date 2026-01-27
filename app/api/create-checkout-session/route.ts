import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getValidatedPrice, detectEventType } from '@/lib/prices';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface CartItem {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventMonth: string;
  eventDay: string;
  eventTime: string;
  venue: string;
  categoryName: string;
  price: number;
  quantity: number;
}

interface CheckoutRequestBody {
  cart: CartItem[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    comments?: string;
  };
}

// Map category names to IDs for price validation
const CATEGORY_NAME_TO_ID: Record<string, string> = {
  'Prime A': 'prime-a',
  'Prime B': 'prime-b',
  'Grandstand': 'grandstand',
  'Grandstand Lower': 'grandstand-lower',
  'Grandstand Upper': 'grandstand-upper',
};

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutRequestBody = await request.json();
    const { cart, customerInfo } = body;

    if (!cart || cart.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 }
      );
    }

    // Validate and create line items with server-side prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    for (const item of cart) {
      // Detect event type from title
      const eventType = detectEventType(item.eventTitle);

      // Map category name to ID
      const categoryId = CATEGORY_NAME_TO_ID[item.categoryName];
      if (!categoryId) {
        return NextResponse.json(
          { error: `Invalid category: ${item.categoryName}` },
          { status: 400 }
        );
      }

      // Get validated price from server (never trust client price)
      const validatedPrice = getValidatedPrice(eventType, categoryId);
      if (validatedPrice === null) {
        return NextResponse.json(
          { error: `Invalid price configuration for ${item.categoryName} in ${eventType} event` },
          { status: 400 }
        );
      }

      // Log if client price doesn't match server price (potential manipulation attempt)
      if (item.price !== validatedPrice) {
        console.warn(`Price mismatch detected: client sent $${item.price}, server expects $${validatedPrice} for ${item.categoryName}`);
      }

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${item.eventTitle} - ${item.categoryName}`,
            description: `${item.eventDate} ${item.eventMonth} ${item.eventDay} at ${item.eventTime} | ${item.venue}`,
          },
          unit_amount: validatedPrice * 100, // Use validated price, convert to cents
        },
        quantity: item.quantity,
      });
    }

    // Use environment variable for origin (production safety)
    const origin = process.env.NEXT_PUBLIC_SITE_URL ||
                   request.headers.get('origin') ||
                   'http://localhost:3000';

    // Generate idempotency key from cart content to prevent duplicate sessions
    const idempotencyKey = `checkout_${customerInfo.email}_${Date.now()}_${cart.map(i => `${i.id}:${i.quantity}`).join('_')}`;

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout/cancel`,
        customer_email: customerInfo.email,
        metadata: {
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_comments: customerInfo.comments || '',
          cart_items: JSON.stringify(cart.map(i => ({ id: i.id, qty: i.quantity }))),
        },
      },
      {
        idempotencyKey,
      }
    );

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);

    // Handle idempotency errors gracefully
    if (error instanceof Stripe.errors.StripeError && error.code === 'idempotency_key_in_use') {
      return NextResponse.json(
        { error: 'Request already in progress. Please wait.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
