import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "Payment & Delivery — Yas Arena Concierge",
  description:
    "Secure payment via Stripe with electronic ticket delivery for all Yas Arena Concierge events. Multiple payment methods accepted.",
  h1: "Payment and Delivery",
  breadcrumbLabel: "Payment & Delivery",
  sections: [
    {
      heading: "1. Payment",
      body: `<p>Payment for tickets is made online after placing an order on the website.</p>
<p><strong>1.1. Payment by Bank Card</strong></p>
<p>1.1.1. We accept major international bank cards including Visa and Mastercard.</p>
<p>1.1.2. Payment is processed on the bank's secure payment page. To complete the payment, the buyer must enter the following card details:</p>
<ul>
<li>card number</li>
<li>card expiration date</li>
<li>cardholder's name (in Latin letters exactly as shown on the card)</li>
<li>security code CVC2 / CVV2</li>
</ul>
<p>1.1.3. After entering the card details the buyer must click the "Pay" button.</p>
<p>1.1.4. For additional payment security <strong>3D Secure technology</strong> is used. If this technology is supported by the issuing bank, the buyer will be redirected to the bank's website to confirm the transaction.</p>
<p>1.1.5. Payment processing and data protection comply with the international <strong>PCI DSS security standard</strong>.</p>
<p>1.1.6. After successful payment a payment confirmation and order details will be sent to the email address provided during checkout.</p>
<p><strong>1.2. Corporate Payments</strong></p>
<p>1.2.1. Special payment terms may be available for legal entities and corporate clients.</p>
<p>1.2.2. To receive an invoice and coordinate payment terms the buyer must send the company's legal and banking details to the following email address: <strong>support@yasarena.com</strong></p>
<p>1.2.3. After receiving the details a company representative will contact the buyer to coordinate payment terms and next steps.</p>`,
    },
    {
      heading: "2. Ticket Delivery",
      body: `<p>The method and format of ticket delivery depend on the ticket type and the distribution policies established by the event organizer or official ticketing platform.</p>
<p><em>For many major events mobile tickets are released by the event organizer only shortly before the event date. In such cases ticket delivery may occur closer to the event date. The company guarantees that tickets or instructions for obtaining them will be delivered to the buyer before the start of the event.</em></p>
<p><strong>2.1. Electronic Tickets (PDF)</strong></p>
<p>2.1.1. Electronic tickets in PDF format are sent to the email address specified by the buyer during checkout.</p>
<p>2.1.2. Delivery timing depends on the conditions of the specific event, payment confirmation, and ticket release timing by the organizer or official ticket provider.</p>
<p><strong>2.2. Mobile Tickets</strong></p>
<p>2.2.1. Mobile tickets are digital tickets that are delivered through official ticketing systems or platforms used by the event organizer.</p>
<p>2.2.2. Mobile tickets may be transferred electronically from one account to another through the official website or mobile application of the ticket operator.</p>
<p>2.2.3. To receive mobile tickets the buyer may be required to create an account with the official ticket provider or install the relevant mobile application.</p>
<p>2.2.4. In some cases the buyer must accept the ticket transfer through the ticket operator's system by following the instructions sent via email.</p>`,
    },
    {
      heading: "3. Important Information",
      variant: "highlighted",
      body: `<p>3.1. The buyer is responsible for providing a valid and correct email address when placing an order.</p>
<p>3.2. The company is not responsible for ticket delivery issues caused by incorrect contact information provided by the buyer.</p>
<p>3.3. If the ticket email or delivery instructions are not visible in the inbox the buyer is advised to check spam or junk mail folders.</p>
<p>3.4. Ticket delivery is considered completed once tickets or transfer instructions have been sent to the buyer's email address.</p>
<p>3.5. The buyer is responsible for the safekeeping of the received tickets and for any transfer of tickets to third parties after delivery.</p>
<p>3.6. The company reserves the right to request additional verification information if a transaction is flagged by the payment security system.</p>
<p>3.7. The company reserves the right to cancel an order and issue a refund if tickets cannot be obtained from suppliers or if the transaction is suspected to be fraudulent.</p>`,
    },
  ],
}

export default seo
