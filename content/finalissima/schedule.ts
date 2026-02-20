import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Match Calendar — Football Festival Qatar 2026 (March 26-31)",
  description:
    "Complete match calendar for Football Festival Qatar 2026. Six days of international football from March 26 to 31 across Lusail, Al Rayyan, and Doha stadiums. Plan your multi-match visit.",
  keywords: [
    "Finalissima 2026 match dates",
    "Qatar football calendar March 2026",
    "when is Spain vs Argentina Finalissima",
    "Football Festival Qatar fixture list",
    "Lusail Stadium schedule",
    "international football Qatar timing",
  ],
  h1: "Schedule — Football Festival Qatar 2026",
  breadcrumbLabel: "Schedule",
  highlights: [
    { icon: "📅", title: "6 Days of Football", body: "The Qatar Football Festival runs from 26 to 31 March 2026 across three world-class stadiums in Qatar." },
    { icon: "🏟️", title: "Three Venues", body: "Matches take place at Lusail Stadium, Ahmad bin Ali Stadium (Al Rayyan), and Jassim bin Hamad Stadium (Doha)." },
    { icon: "🌟", title: "Finalissima — 27 March", body: "The headline fixture: Spain vs Argentina at Lusail Stadium. Kick-off at 21:00 local time." },
    { icon: "⚽", title: "International Friendlies", body: "Top national teams compete in high-profile friendly matches across the festival days surrounding the Finalissima." },
    { icon: "🎟️", title: "Individual Match Tickets", body: "Each match has separate ticketing. Browse available sessions on the home page and choose the matches that interest you." },
    { icon: "📍", title: "Plan Your Visit", body: "All venues are well connected by metro and taxi. Check the Venue page for transport details and directions to each stadium." },
  ],
  heroSubtitle:    "Football Festival Qatar 2026 — 26–31 March",
  heroDescription: "Six days of international football at Lusail Stadium, Ahmad bin Ali Stadium, and Jassim bin Hamad Stadium.",

  sections: [
    {
      heading: "Festival Dates & Structure",
      body: `<p>Football Festival Qatar 2026 runs from <strong>Wednesday 26 March to Tuesday 31 March 2026</strong> — six days of international football across three stadiums. The programme is designed so that each day features one or two match sessions, giving fans time to travel between venues and explore Qatar between fixtures.</p>
<p>Matches are spread across Lusail Stadium, Ahmad bin Ali Stadium, and Jassim bin Hamad Stadium. The headline fixture — the Finalissima — will take place at Lusail Stadium. Individual match pages will display exact kick-off times and seat availability as they are confirmed.</p>
<p>Evening kick-offs are typical for March events in Qatar, with temperatures dropping to a comfortable 22–25°C after sunset. Some daytime sessions may also be scheduled, particularly for friendly matches at smaller venues.</p>`,
    },
    {
      heading: "What to Expect Each Day",
      body: `<p>While specific kick-off times are confirmed closer to the event and displayed on individual match pages, the general pattern for football festivals of this kind follows a predictable rhythm:</p>
<ul>
  <li><strong>Opening days</strong> — friendly internationals that set the stage and allow teams to acclimatise</li>
  <li><strong>Mid-festival</strong> — higher-profile fixtures as the programme builds towards the main event</li>
  <li><strong>Final days</strong> — the Finalissima itself, typically scheduled as the closing showpiece</li>
</ul>
<p>Each session is a standalone experience. You can attend a single match or plan a multi-day trip to catch several fixtures. Venues are well-connected by Doha Metro, so moving between stadiums on the same day is feasible if the schedule allows.</p>
<p>Individual match pages show exact times, stadium assignments, and seat availability as they are confirmed.</p>`,
    },
    {
      heading: "Planning Your Visit",
      body: `<p>If you are travelling specifically for the festival, a stay of three to four nights is enough to see the Finalissima plus one or two supporting matches. Doha's hotel district in West Bay puts you within metro reach of all three venues.</p>
<p>For fans who want to prioritise the biggest fixture, the Finalissima alone is worth the trip — it's a rare intercontinental final in a world-class stadium. Those with more flexibility can build a longer itinerary around multiple sessions.</p>
<p>A few practical tips for planning:</p>
<ul>
  <li>Book accommodation early — Doha's hotel supply can tighten during major sporting events</li>
  <li>Check the <a href="/venue">venue guide</a> for transport options to each stadium</li>
  <li>Evening matches work well with daytime sightseeing — Souq Waqif, the Museum of Islamic Art, and Katara Cultural Village are all popular stops</li>
</ul>
<p>For questions about ordering, delivery, or refunds, visit the <a href="/faq">FAQ page</a>.</p>`,
    },
  ],
  cta: {
    text: "View All Matches",
    href: "/",
  },
  internalLinks: [
    { label: "About Tournament", sublabel: "Guide & format", href: "/about-tournament" },
    { label: "Venues", sublabel: "Stadiums & transport", href: "/venue" },
    { label: "FAQ", sublabel: "Common questions", href: "/faq" },
    { label: "All Matches", sublabel: "View available sessions", href: "/" },
  ],
}

export default seo
