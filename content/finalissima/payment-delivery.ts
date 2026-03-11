import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "Payment & Delivery — Football Festival Qatar",
  description:
    "Secure payment via Stripe with electronic ticket delivery for all Football Festival Qatar events. Multiple payment methods accepted.",
  h1: "Payment & Delivery",
  sections: [
    {
      heading: "Payment Methods",
      body: `<p>All payments are processed securely through Stripe. We accept Visa, Mastercard, American Express, and other major payment methods supported by Stripe.</p>
<p>The full amount is charged at the time of purchase. All prices are displayed in US Dollars (USD) unless otherwise noted.</p>`,
    },
    {
      heading: "Ticket Delivery",
      body: `<p>Tickets are delivered electronically — as mobile tickets via a ticketing app or as PDF e-tickets. Delivery occurs no later than 2 days before the event date.</p>
<p>You will receive an email with delivery instructions and any necessary access details. Ensure your email address is correct at checkout.</p>`,
    },
    {
      heading: "Order Confirmation",
      body: `<p>After completing your purchase, you will receive an order confirmation email. This confirms your booking and includes your order reference number.</p>
<p>If you do not receive a confirmation within 30 minutes, check your spam folder and contact <strong>support@footballfestivalqatar.com</strong>.</p>`,
    },
    {
      heading: "Questions",
      body: `<p>For any questions about payment or delivery, contact our support team at <strong>support@footballfestivalqatar.com</strong>. We are available to assist with all order-related inquiries.</p>`,
    },
  ],
}

export default seo
