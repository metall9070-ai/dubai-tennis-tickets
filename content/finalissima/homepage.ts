import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Football Festival Qatar 2026 | Finalissima Tickets — Lusail & Doha",
  description:
    "Buy tickets for Football Festival Qatar 2026 featuring Finalissima and international football matches. March 26-31 at Lusail Stadium, Ahmad bin Ali Stadium & Jassim bin Hamad Stadium. Secure checkout.",
  keywords: [
    "Football Festival Qatar",
    "Finalissima 2026",
    "Finalissima tickets",
    "Qatar football tickets",
    "Lusail Stadium tickets",
    "international football Doha",
    "football matches Qatar 2026",
    "buy football tickets",
  ],
  h1: "Football Festival Qatar 2026 — Tickets",
  sections: [
    {
      heading: "About the Festival",
      body: `<p>Football Festival Qatar 2026 brings top international football to the world-class stadiums of Qatar. Featuring the <strong>Finalissima 2026</strong> and exciting friendly matches, this festival celebrates the beautiful game across multiple venues in Lusail, Al Rayyan, and Doha.</p>
<p>Experience world-class football at three iconic stadiums — <strong>Lusail Stadium</strong>, <strong>Ahmad bin Ali Stadium</strong>, and <strong>Jassim bin Hamad Stadium</strong> — from March 26 to March 31, 2026.</p>`,
    },
    {
      heading: "Matches & Schedule",
      body: `<p>The festival features a packed schedule of international football across six days:</p>
<ul>
  <li><strong>Finalissima 2026</strong> — the showpiece clash between continental champions</li>
  <li><strong>International friendly matches</strong> — top nations competing at world-class venues</li>
</ul>
<p>Check the full schedule for match dates, kick-off times, and venue details.</p>`,
    },
    {
      heading: "Venues",
      body: `<p>Matches are held across three stadiums in Qatar:</p>
<ul>
  <li><strong>Lusail Stadium</strong> (Lusail) — 80,000 capacity, the iconic FIFA World Cup 2022 final venue</li>
  <li><strong>Ahmad bin Ali Stadium</strong> (Al Rayyan) — 44,740 capacity, surrounded by the Qatari desert landscape</li>
  <li><strong>Jassim bin Hamad Stadium</strong> (Doha) — home of Al Sadd SC in the heart of Doha</li>
</ul>`,
    },
    {
      heading: "How to Buy Tickets",
      body: `<p>Purchasing tickets is simple and secure:</p>
<ul>
  <li>Browse available matches on our schedule page</li>
  <li>Select your preferred category and number of tickets</li>
  <li>Complete your purchase with our secure checkout powered by Stripe</li>
  <li>Receive your e-tickets via email</li>
</ul>
<p>All transactions are processed securely. Our dedicated support team is available at <strong>support@footballfestivalqatar.com</strong>.</p>`,
    },
  ],
  cta: {
    text: "Browse All Matches",
    href: "/",
  },
  internalLinks: [
    { label: "Schedule", sublabel: "All matches", href: "/schedule" },
    {
      label: "About Tournament",
      sublabel: "Festival details",
      href: "/about-tournament",
    },
    { label: "Venues", sublabel: "Stadiums & directions", href: "/venue" },
    { label: "FAQ", sublabel: "Common questions", href: "/faq" },
  ],
}

export default seo
