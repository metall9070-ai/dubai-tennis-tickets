import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "About Us — {brand}",
  description:
    "{brand} is an independent ticket concierge service. Secure booking and dedicated support.",
  h1: "About Us",
  breadcrumbLabel: "About Us",
  sections: [
    {
      heading: "About {brand}",
      body: `<p>{brand} is a professional ticket concierge service specializing in premium access to sports and entertainment events.</p>
<p>We provide a full range of services related to events, including ticket selection and booking, personalized recommendations, delivery coordination, and comprehensive event information support. Our goal is to make the process of attending an event simple, transparent, and comfortable for our clients.</p>
<p>We work with both individual clients and corporate customers, assisting in finding optimal options based on preferences, availability, and budget. From initial inquiry to event attendance, we accompany our clients at every stage, ensuring clarity, reliability, and timely communication.</p>
<p>{brand} is focused on delivering a high-quality service experience, helping clients save time and confidently plan their visit to major events.</p>`,
    },
    {
      heading: "What We Do",
      body: `<p>Our services include:</p>
<ul>
<li>ticket sourcing and booking</li>
<li>premium and hard-to-find ticket access</li>
<li>personalized ticket recommendations</li>
<li>ticket transfer coordination</li>
<li>support before and after purchase</li>
</ul>`,
    },
    {
      heading: "Contact Our Concierge Team",
      body: `<p>Our concierge team is available to assist you with ticket requests, event information, and order support.</p>`,
    },
    {
      heading: "Business Hours",
      body: `<p><strong>Monday to Sunday — 24/7</strong></p>
<p>Our concierge team is available around the clock to assist you.</p>`,
    },
    {
      heading: "Response Time",
      body: `<p>Our dedicated concierge team works around the clock. All requests are processed within <strong>1 business day</strong>.</p>`,
    },
    {
      heading: "Direct Contact",
      body: `<p>You can reach us directly via email:</p>
<p><strong>{email}</strong></p>`,
    },
    {
      heading: "Company Information",
      body: `<p><strong>Legal Entity:</strong> WORLD TICKETS 365 INC</p>
<p><strong>Address:</strong> 7901 4th St N STE 300, St. Petersburg, FL 33702, United States</p>`,
    },
    {
      heading: "Disclaimer",
      body: `<p>Independent ticket concierge service. Not affiliated with venue, artists, or organizers.</p>`,
    },
  ],
}

export default seo
