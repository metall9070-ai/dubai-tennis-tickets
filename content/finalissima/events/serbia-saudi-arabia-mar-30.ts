import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Football Festival Qatar 2026: Serbia vs Saudi Arabia
 * March 30, 2026 — Al Janoub Stadium
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Serbia vs Saudi Arabia Tickets March 30 2026 | Al Janoub Stadium',
  description:
    'Buy Serbia vs Saudi Arabia tickets for March 30, 2026 at Al Janoub Stadium. International friendly at Football Festival Qatar. Secure seats, verified marketplace, instant delivery.',
  h1: 'Serbia vs Saudi Arabia — March 30, 2026, Al Janoub Stadium',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 30, 2026</strong>, <strong>Serbia</strong> faces <strong>Saudi Arabia</strong> at Al Janoub Stadium as part of <strong>Football Festival Qatar 2026</strong>. This international friendly, scheduled for 6:30 PM local time, delivers a compelling intercontinental matchup where European technical precision meets Asian tactical discipline. Serbia brings squad depth from Europe's top leagues, while Saudi Arabia arrives with momentum from competitive Asian Football Confederation campaigns and preparation for World Cup qualification cycles. Both teams use this fixture to test tactical systems, evaluate squad depth, and build competitive rhythm ahead of crucial continental competition. With <strong>Serbia vs Saudi Arabia tickets March 30</strong> in high demand, early purchase secures access to this unique international encounter at a World Cup-caliber venue.</p>

    <h2>Why Buy Serbia vs Saudi Arabia Tickets Early</h2>
    <p>Ticket demand for <strong>Serbia vs Saudi Arabia at Al Janoub Stadium</strong> reflects multiple converging factors. This match falls within Football Festival Qatar's closing weekend, when visitor numbers peak and accommodation fills rapidly across Doha and Al Wakrah. International friendly fixtures featuring European and Asian nations attract diverse supporter bases, football enthusiasts traveling to Qatar specifically for the tournament, and local residents seeking access to world-class international football. Premium seating categories typically sell out first, particularly lower-tier sections offering proximity to pitch action. Independent ticket marketplaces operate on real-time inventory dynamics—seat availability decreases as kickoff approaches, while pricing responds to demand intensity. Securing <strong>tickets for Serbia vs Saudi Arabia March 30</strong> well in advance guarantees preferred seating positions, avoids last-minute scarcity, and provides certainty for travel planning.</p>

    <h2>Al Janoub Stadium & Matchday Experience</h2>
    <p><strong>Al Janoub Stadium</strong> in Al Wakrah hosted multiple FIFA World Cup 2022 matches and maintains world-class infrastructure designed for international competition. The 40,000-capacity venue features climate-controlled environments ensuring comfortable viewing regardless of external temperatures, while the bowl design creates concentrated acoustics enhancing atmosphere. Accessible via Doha Metro Gold Line (Al Wakrah Station, 30-40 minutes from city center), the stadium offers premium hospitality zones, comprehensive concessions, and accessible seating provisions. Transportation logistics favor metro over private vehicles on matchday due to streamlined security and reduced congestion. Further details are available on the <a href="/venue">venue information page</a>. Plan to arrive 90 minutes before the 6:30 PM kickoff for security screening and seating navigation.</p>

    <h2>Ticket Categories & Availability</h2>
    <p><strong>Serbia vs Saudi Arabia tickets</strong> span multiple seating categories aligned with Al Janoub Stadium's tiered architecture. Lower-tier sections positioned near pitch level deliver immersive viewing perspectives and direct engagement with match intensity—these premium categories experience highest demand and typically command premium pricing on independent marketplaces. Upper-tier sections provide elevated panoramic views ideal for tactical observation and stadium atmosphere absorption. Category-specific pricing reflects positioning, sightlines, and real-time market demand. Independent ticket platforms provide continued inventory access after primary distribution phases conclude, with availability fluctuating based on purchase activity and temporal proximity to March 30. Electronic delivery occurs within 48 hours before kickoff, enabling mobile storage or printable backup. Ticket transfer functionality permits digital reassignment if personal plans change, documented in delivery confirmation emails.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing <strong>Serbia vs Saudi Arabia March 30 tickets</strong> through independent resale channels follows secure encrypted checkout workflows. Select preferred seating category, specify quantity, and complete payment via established gateway providers with immediate digital confirmation. For multiple attendees, allocation algorithms prioritize adjacent seating where inventory permits. Pricing reflects prevailing market conditions and may differ from initial face values based on demand intensity and remaining time until kickoff. Full refund provisions apply if the match is cancelled without rescheduling; postponed fixtures honor original ticket validity for rescheduled dates. Customer support assists with pricing inquiries, delivery timelines, and transfer procedures via email, live chat, or telephone channels. Review the <a href="/schedule">complete Festival schedule</a> to coordinate attendance across multiple Qatar matches, or explore <a href="/about-tournament">tournament background</a> for broader context on Football Festival Qatar 2026.</p>
  `,

  faq: [
    {
      question: 'When are Serbia vs Saudi Arabia tickets delivered for the March 30 match?',
      answer:
        'Tickets for Serbia vs Saudi Arabia on March 30, 2026 are delivered electronically within 48 hours before the 6:30 PM kickoff. You will receive an email with digital ticket credentials compatible with mobile storage or printable as physical backup.',
    },
    {
      question: 'Why should I buy Serbia vs Saudi Arabia tickets early?',
      answer:
        'Early purchase secures preferred seating categories before premium lower-tier sections sell out. This match falls during Football Festival Qatar closing weekend when demand peaks. Independent marketplace pricing responds to real-time availability—securing tickets early avoids scarcity and provides certainty for travel planning.',
    },
    {
      question: 'What ticket categories are available for Serbia vs Saudi Arabia at Al Janoub Stadium?',
      answer:
        'Categories include lower-tier sections near pitch level (highest demand, premium pricing), upper-tier sections with panoramic views, and various angular positions. Availability fluctuates based on purchase activity and proximity to March 30. All categories provide clear sightlines and full stadium amenity access.',
    },
    {
      question: 'Can I transfer Serbia vs Saudi Arabia tickets if I cannot attend the March 30 match?',
      answer:
        'Yes, tickets are typically transferable via digital reassignment. Transfer instructions are included in your delivery email and involve platform interface reassignment or secure forwarding to the alternative attendee.',
    },
    {
      question: 'How do I reach Al Janoub Stadium for Serbia vs Saudi Arabia on March 30?',
      answer:
        'Use Doha Metro Gold Line (Al Wakrah Station exit), approximately 30-40 minutes from central Doha. Metro is recommended over private vehicles due to matchday security efficiency. Arrive at least 90 minutes before the 6:30 PM kickoff for screening and seating navigation.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Serbia vs Saudi Arabia – Football Festival Qatar 2026',
    description:
      'International friendly match between Serbia and Saudi Arabia at Al Janoub Stadium, part of Football Festival Qatar 2026.',
    startDate: '2026-03-30T18:30:00+03:00',
    endDate: '2026-03-30T20:30:00+03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Al Janoub Stadium',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Al Wakrah',
        addressRegion: 'Doha',
        addressCountry: 'QA',
      },
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: 'Serbia National Football Team',
      },
      {
        '@type': 'SportsTeam',
        name: 'Saudi Arabia National Football Team',
      },
    ],
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      // NOTE: url is dynamically injected by page.tsx using getSiteUrl()
      // Hardcoded URLs violate SEO_ARCHITECTURE §3C (Cross-Site SEO Isolation)
      priceCurrency: 'USD',
      validFrom: '2025-11-01T00:00:00+00:00',
    },
  },
}

/*
Long-tail commercial keyword cluster (Serbia vs Saudi Arabia March 30, 2026):

1. buy serbia vs saudi arabia tickets march 30 2026
2. serbia saudi arabia march 30 al janoub tickets
3. serbia vs saudi arabia football festival qatar tickets
4. serbia saudi arabia march 30 2026 ticket prices
5. al janoub stadium serbia saudi arabia march 30 tickets
6. best serbia vs saudi arabia tickets march 30
7. serbia saudi arabia march 30 seating categories
8. buy tickets serbia saudi arabia al janoub stadium
9. serbia vs saudi arabia march 30 premium seats
10. serbia saudi arabia march 30 2026 al wakrah tickets
11. secure serbia vs saudi arabia tickets early
12. serbia saudi arabia al janoub march 30 lower tier
13. football festival qatar serbia saudi arabia march 30
14. serbia vs saudi arabia march 30 ticket availability
15. purchase serbia saudi arabia tickets march 30 2026
16. serbia saudi arabia march 30 resale tickets
17. al janoub serbia vs saudi arabia march 30 booking
18. serbia saudi arabia march 30 independent marketplace
19. early booking serbia vs saudi arabia march 30
20. serbia saudi arabia march 30 2026 verified tickets
*/
