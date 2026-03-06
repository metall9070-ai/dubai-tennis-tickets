import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "About Us — Yas Arena Concierge",
  description:
    "Yas Arena Concierge is an independent ticket concierge service for events at Etihad Arena, Abu Dhabi. Secure booking and dedicated support.",
  h1: "About Us",
  sections: [
    {
      heading: "Who We Are",
      body: `<p><strong>Yas Arena Concierge</strong> is an independent ticket concierge service specializing in events at Etihad Arena, Abu Dhabi. We connect fans with tickets for concerts, live shows, and sporting events at one of the UAE's premier entertainment venues.</p>
<p>We are operated by WORLD TICKETS 365 INC and are not affiliated with Etihad Arena, Yas Island, Miral, or any event organizer.</p>`,
    },
    {
      heading: "What We Do",
      body: `<p>We source tickets through a global network of authorized secondary market partners. Every ticket is verified for authenticity before delivery, ensuring a reliable experience from booking to event day.</p>
<p>Our service includes secure checkout via Stripe, electronic ticket delivery, and dedicated customer support at <strong>support@yasarena.com</strong>.</p>`,
    },
    {
      heading: "Our Commitment",
      body: `<p>Transparent pricing, authentic tickets, and responsive support — that is our commitment to every customer. Prices are market-based and clearly displayed before purchase, with no hidden fees.</p>`,
    },
  ],
}

export default seo
