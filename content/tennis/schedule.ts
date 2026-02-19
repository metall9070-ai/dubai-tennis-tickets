import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "Dubai Tennis 2026 Schedule — ATP 500 & WTA 1000 Match Days",
  description:
    "Full schedule for Dubai Duty Free Tennis Championships 2026. WTA 1000 runs Feb 15–21, ATP 500 Feb 23–28. Plan your visit and buy tickets for any session.",
  keywords: [
    "Dubai Tennis 2026 schedule",
    "Dubai Tennis Championships dates",
    "ATP 500 Dubai schedule",
    "WTA 1000 Dubai schedule",
    "Dubai tennis match days",
    "Dubai Duty Free Tennis timetable",
  ],
  h1: "Dubai Tennis 2026 — Full Schedule",
  breadcrumbLabel: "Schedule",
  highlights: [
    { icon: "📅", title: "WTA 1000 — Feb 15–21", body: "The women's tournament opens the Championships. Top seeds including Swiatek, Sabalenka, and Gauff compete across seven days at Dubai Tennis Stadium." },
    { icon: "🎾", title: "ATP 500 — Feb 23–28", body: "The men's draw follows immediately. Djokovic, Sinner, Alcaraz and the world's best compete across six days of world-class tennis." },
    { icon: "🏟️", title: "One Venue", body: "All matches take place at Dubai Duty Free Tennis Stadium, Aviation Club, Al Garhoud — one of the fastest hard courts on the tour." },
    { icon: "🌟", title: "Finals Weekend", body: "WTA Final on Feb 21, ATP Final on Feb 28. Premium seating categories sell out first — book early to secure your seats." },
    { icon: "🎟️", title: "Per-Session Tickets", body: "Each match session is ticketed separately. Browse available sessions below and choose the round or day that suits you." },
    { icon: "☀️", title: "Evening Sessions", body: "Most matches are scheduled in the afternoon and evening, with temperatures of 22–27°C in late February — ideal outdoor conditions." },
  ],
  heroSubtitle: "Dubai Duty Free Tennis Championships 2026 — Feb 15–28",
  heroDescription:
    "Two back-to-back world-class tournaments at Dubai Tennis Stadium. WTA 1000 and ATP 500 on the fastest hard court in the Middle East.",

  sections: [
    {
      heading: "Tournament Structure",
      body: `<p>The Dubai Duty Free Tennis Championships 2026 runs as two consecutive tournaments at the same venue — Dubai Duty Free Tennis Stadium at Aviation Club, Al Garhoud.</p>
<ul>
  <li><strong>WTA 1000 — February 15–21, 2026:</strong> The women's draw features 56 players across seven days, with qualifying matches in the first two days and the main draw from Feb 17. The final is scheduled for Saturday Feb 21.</li>
  <li><strong>ATP 500 — February 23–28, 2026:</strong> The men's draw runs across six days. The final takes place on Saturday Feb 28, traditionally one of the most atmospheric sessions of the year.</li>
</ul>
<p>Individual match pages display exact court times and seat availability as they are confirmed closer to the event.</p>`,
    },
    {
      heading: "How to Choose Your Session",
      body: `<p>Each ticket covers one session (typically one match on centre court plus supporting matches). Here is how most fans plan their visit:</p>
<ul>
  <li><strong>Finals only:</strong> Feb 21 (WTA Final) or Feb 28 (ATP Final) — the highest intensity, highest demand sessions. Book early.</li>
  <li><strong>Quarterfinals / Semifinals:</strong> Feb 19–20 (WTA) or Feb 26–27 (ATP) — top players guaranteed, better seat availability than finals.</li>
  <li><strong>Early rounds:</strong> Feb 15–18 (WTA) or Feb 23–25 (ATP) — most affordable, multiple matches per session, good for casual fans.</li>
  <li><strong>Multi-day trips:</strong> Attending both WTA and ATP events gives a complete experience across two weekends.</li>
</ul>
<p>Check individual session pages for current availability and pricing across Courtside, Prime, and Grandstand categories.</p>`,
    },
    {
      heading: "Venue & Practical Information",
      body: `<p>All sessions take place at <strong>Dubai Duty Free Tennis Stadium</strong>, Aviation Club, Al Garhoud, Dubai. The stadium seats up to 5,000 spectators with excellent sightlines from all categories.</p>
<p>Getting there:</p>
<ul>
  <li><strong>Metro:</strong> GGICO Metro Station (Green Line) — 10-minute walk</li>
  <li><strong>Taxi / Ride-hailing:</strong> Uber and Careem available throughout Dubai</li>
  <li><strong>By car:</strong> Parking available at Aviation Club</li>
</ul>
<p>Gates typically open 60 minutes before the first match. Evening sessions in late February benefit from comfortable temperatures of 22–26°C. For full directions and transport details, see the <a href="/venue">venue page</a>.</p>`,
    },
  ],
  cta: {
    text: "Browse Available Sessions",
    href: "/",
  },
  internalLinks: [
    { label: "ATP 500 Tickets", sublabel: "Men's draw Feb 23–28", href: "/tickets/atp" },
    { label: "WTA 1000 Tickets", sublabel: "Women's draw Feb 15–21", href: "/tickets/wta" },
    { label: "Venue & Directions", sublabel: "Dubai Tennis Stadium", href: "/venue" },
    { label: "FAQ", sublabel: "Common questions", href: "/faq" },
  ],
}

export default seo
