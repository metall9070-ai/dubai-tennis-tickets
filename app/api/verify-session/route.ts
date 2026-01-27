import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required', verified: false },
        { status: 400 }
      );
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if payment was successful
    if (session.payment_status === 'paid') {
      return NextResponse.json({
        verified: true,
        customerEmail: session.customer_email,
        amountTotal: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency?.toUpperCase(),
        metadata: session.metadata,
      });
    }

    // Payment not completed
    return NextResponse.json({
      verified: false,
      status: session.payment_status,
    });
  } catch (error) {
    console.error('Session verification error:', error);

    // Handle invalid session ID
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: 'Invalid session', verified: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Verification failed', verified: false },
      { status: 500 }
    );
  }
}
