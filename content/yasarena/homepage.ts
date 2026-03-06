import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Etihad Arena Tickets | Concerts, Shows & Events in Abu Dhabi",
  description:
    "Browse and buy tickets for upcoming events at Etihad Arena, Yas Island, Abu Dhabi. Concerts, live shows, and sports events with premium seating options.",
  keywords: [
    "Etihad Arena tickets",
    "Yas Island events",
    "Abu Dhabi concerts",
    "Etihad Arena events",
    "live shows Abu Dhabi",
    "Yas Island concerts",
    "Abu Dhabi entertainment tickets",
    "premium seating Etihad Arena",
  ],
  h1: "Etihad Arena — Events & Tickets",
  sections: [
    {
      heading: "About Etihad Arena",
      body: `<p><strong>Etihad Arena</strong> is Abu Dhabi's largest indoor entertainment venue, located on Yas Island. With a capacity of up to 18,000, the arena hosts a diverse programme of concerts, live shows, comedy acts, and sporting events throughout the year.</p>
<p>Opened as part of the Yas Bay waterfront development, Etihad Arena has quickly become the premier destination for world-class entertainment in the UAE capital. The venue features flexible staging configurations that adapt to events of all sizes.</p>`,
    },
    {
      heading: "Upcoming Events",
      body: `<p>Etihad Arena welcomes international touring artists, global sports organisations, and major entertainment productions. The venue's calendar spans genres and formats — from arena-scale concerts and stand-up comedy to championship boxing and esports tournaments.</p>
<p>Browse the full events listing to find upcoming shows and secure your preferred seating category. New events are added regularly as the Abu Dhabi entertainment calendar evolves.</p>`,
    },
    {
      heading: "Venue Experience",
      body: `<p>Etihad Arena offers a modern spectator experience with excellent sightlines from every section. The venue is situated within Yas Bay, providing easy access to dining, hotels, and leisure facilities on Yas Island.</p>
<p>The arena is well-connected via road and is accessible from Abu Dhabi city centre, Dubai, and Abu Dhabi International Airport. On-site parking and rideshare drop-off points make arrival straightforward for all attendees.</p>`,
    },
    {
      heading: "Ticket Access & Booking",
      body: `<p>Tickets are available across multiple seating categories for each event. Select your preferred section and complete your purchase through secure checkout powered by Stripe.</p>
<p>Tickets are delivered electronically ahead of the event date. Yas Arena Concierge operates as an independent ticket concierge service with dedicated support at <strong>support@yasarena.com</strong>.</p>`,
    },
  ],
  cta: {
    text: "View Upcoming Events",
    href: "/",
  },
  internalLinks: [
    { label: "Events", sublabel: "Full event calendar", href: "/events" },
    {
      label: "About Venue",
      sublabel: "Arena guide & facilities",
      href: "/about-venue",
    },
    { label: "Getting There", sublabel: "Directions & transport", href: "/getting-there" },
    { label: "FAQ", sublabel: "Questions & policies", href: "/faq" },
  ],
}

export default seo
