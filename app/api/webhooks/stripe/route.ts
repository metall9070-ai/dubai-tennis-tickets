import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Telegram notification settings
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Send Telegram notification
async function sendTelegramNotification(message: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('Telegram not configured, skipping notification');
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        console.log('Customer email:', session.customer_email);
        console.log('Amount:', session.amount_total ? session.amount_total / 100 : 0, session.currency);
        console.log('Metadata:', session.metadata);

        // Get line items for order details
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Format tickets for notification
        const ticketsList = lineItems.data.map(item =>
          `• ${item.description || item.price?.product} x${item.quantity} - $${(item.amount_total / 100).toFixed(2)}`
        ).join('\n');

        // Send Telegram notification
        const amount = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0';
        const telegramMessage = `🎾 <b>NEW ORDER!</b>

<b>Event:</b> Dubai Tennis Championships 2026

<b>Customer:</b> ${session.metadata?.customer_name || 'N/A'}
<b>Email:</b> ${session.customer_email || 'N/A'}
<b>Phone:</b> ${session.metadata?.customer_phone || 'N/A'}

<b>Tickets:</b>
${ticketsList}

<b>TOTAL: $${amount}</b>

<b>Stripe ID:</b> <code>${session.payment_intent}</code>`;

        await sendTelegramNotification(telegramMessage);

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        console.log('Error:', paymentIntent.last_payment_error?.message);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Refund processed for charge:', charge.id);
        // TODO: Handle refund - update order status, notify customer
        break;
      }

      case 'charge.dispute.created': {
        const dispute = event.data.object as Stripe.Dispute;
        console.log('Dispute created:', dispute.id);
        // TODO: Handle dispute - notify admin, gather evidence
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
