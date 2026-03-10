import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Upcoming Events at Etihad Arena — Abu Dhabi Shows & Schedule",
  description:
    "Explore the full calendar of upcoming events at Etihad Arena on Yas Island. Concerts, live shows, sporting events, and entertainment — discover what's on in Abu Dhabi.",
  keywords: [
    "Etihad Arena upcoming events",
    "Etihad Arena event schedule",
    "what's on at Etihad Arena",
    "Yas Island entertainment calendar",
    "Abu Dhabi concerts schedule",
    "Etihad Arena shows",
  ],
  h1: "Events at Etihad Arena",
  breadcrumbLabel: "Events",
  heroSubtitle: "Concerts, Sports & Shows on Yas Island",
  heroDescription:
    "Explore the upcoming event calendar at Abu Dhabi's premier indoor arena.",

  highlights: [
    {
      icon: "music",
      title: "Live Concerts",
      body: "International touring artists and regional performers take the stage throughout the year.",
    },
    {
      icon: "swords",
      title: "Sporting Events",
      body: "Championship boxing, UFC, basketball, and more — world-class sport in an arena setting.",
    },
    {
      icon: "laugh",
      title: "Comedy & Theatre",
      body: "Stand-up comedians, theatrical productions, and family-friendly shows on the Yas Bay waterfront.",
    },
    {
      icon: "gamepad-2",
      title: "Esports & Expos",
      body: "Gaming tournaments, tech exhibitions, and immersive experiences for all ages.",
    },
    {
      icon: "calendar",
      title: "Year-Round Calendar",
      body: "New events are announced regularly, with a particularly busy season from October through April.",
    },
    {
      icon: "ticket",
      title: "Multiple Categories",
      body: "Choose from a range of seating options for each event, subject to availability.",
    },
  ],
  sections: [
    {
      heading: "What's On at Etihad Arena",
      body: `<p><strong>Etihad Arena</strong> on Yas Island hosts a diverse programme of live entertainment throughout the year. The venue's calendar spans genres and formats — from large-scale arena concerts featuring international headliners to intimate productions, sporting spectacles, and cultural experiences.</p>
<p>As Abu Dhabi's largest indoor arena, Etihad Arena attracts touring artists and event producers from around the world. The venue's flexible configuration means it can accommodate a wide range of show formats, ensuring every event delivers an atmosphere suited to the performance.</p>
<p>Whether you're looking for a weekend concert, a championship sporting fixture, or an interactive expo, the events listing above shows what's currently available. New events are added as they are announced by promoters and organisers.</p>`,
    },
    {
      heading: "Types of Events",
      body: `<p>The arena's programming falls broadly into several categories, each offering a different kind of experience:</p>
<ul>
  <li><strong>Music & concerts</strong> — headlining solo artists, band tours, orchestral performances, and regional music showcases</li>
  <li><strong>Sports</strong> — international boxing title fights, UFC cards, exhibition basketball, tennis showcases, and more</li>
  <li><strong>Comedy</strong> — global stand-up tours and comedy specials, often featuring household names on their Middle East legs</li>
  <li><strong>Family & kids</strong> — interactive shows, character-based productions, and educational entertainment</li>
  <li><strong>Conferences & expos</strong> — corporate gatherings, technology showcases, and industry events</li>
</ul>
<p>The mix of programming means the arena's audience is equally diverse — from concert-goers and sports fans to families and business professionals visiting Yas Island.</p>`,
    },
    {
      heading: "Planning Your Visit",
      body: `<p>Most events at Etihad Arena run during the evening, with doors typically opening 60–90 minutes before the scheduled start. Matinée and daytime events are scheduled on occasion, particularly for family-oriented productions.</p>
<p>Abu Dhabi's entertainment season peaks from October to April, when the weather is cooler and international touring schedules bring major acts to the region. However, the arena's indoor, climate-controlled environment means events run comfortably year-round regardless of outdoor temperatures.</p>
<p>Yas Island offers a full day out beyond the arena itself — attendees often combine an event with dining at Yas Bay, a visit to one of the island's theme parks, or an overnight stay at one of the nearby hotels. For transport and parking details, see the <a href="/getting-there">Getting There</a> page.</p>`,
    },
    {
      heading: "How It Works",
      body: `<p>Yas Arena Concierge is an independent ticket concierge service for Etihad Arena. Browse the event calendar, select your preferred seating category, and complete your order through a secure checkout process.</p>
<p>Tickets are delivered no later than 2 days before the event date. They are delivered as mobile tickets via a ticketing app. In rare cases, tickets may be provided as a PDF.</p>
<p>For questions about your order, delivery timelines, or venue information, visit the <a href="/faq">FAQ page</a> or contact our support team at <strong>support@yasarena.com</strong>. For a full overview of the venue itself, see the <a href="/about-venue">About Venue</a> guide.</p>`,
    },
  ],
  cta: {
    text: "Browse All Events",
    href: "/",
  },
  internalLinks: [
    {
      label: "About Venue",
      sublabel: "Arena guide & facilities",
      href: "/about-venue",
    },
    {
      label: "Getting There",
      sublabel: "Directions & transport",
      href: "/getting-there",
    },
    { label: "All Events", sublabel: "Full event calendar", href: "/" },
  ],
}

export default seo
