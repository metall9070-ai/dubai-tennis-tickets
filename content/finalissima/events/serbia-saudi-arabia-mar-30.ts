import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Football Festival Qatar 2026: Saudi Arabia vs Serbia
 * March 30, 2026 — Jassim Bin Hammad Stadium
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Saudi Arabia vs Serbia Tickets March 30 2026 | Jassim Bin Hammad Stadium',
  description:
    'Buy Saudi Arabia vs Serbia tickets for March 30, 2026 at Jassim Bin Hammad Stadium. International friendly at Football Festival Qatar. Secure seats, verified marketplace, instant delivery.',
  h1: 'Saudi Arabia vs Serbia — March 30, 2026, Jassim Bin Hammad Stadium',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 30, 2026</strong>, <strong>Saudi Arabia</strong> faces <strong>Serbia</strong> at Jassim Bin Hammad Stadium as part of <strong>Football Festival Qatar 2026</strong>. This international friendly, scheduled for 6:30 PM local time, delivers a compelling intercontinental matchup where Asian tactical discipline meets European technical precision. Saudi Arabia arrives with momentum from competitive Asian Football Confederation campaigns and preparation for World Cup qualification cycles, while Serbia brings squad depth from Europe's top leagues. Both teams use this fixture to test tactical systems, evaluate squad depth, and build competitive rhythm ahead of crucial continental competition. With <strong>Saudi Arabia vs Serbia tickets March 30</strong> in high demand, early purchase secures access to this unique international encounter at a World Cup-caliber venue.</p>

    <h2>Why Buy Saudi Arabia vs Serbia Tickets Early</h2>
    <p>Ticket demand for <strong>Saudi Arabia vs Serbia at Jassim Bin Hammad Stadium</strong> reflects multiple converging factors. This match falls within Football Festival Qatar's closing weekend, when visitor numbers peak and accommodation fills rapidly across Doha. International friendly fixtures featuring Asian and European nations attract diverse supporter bases, football enthusiasts traveling to Qatar specifically for the tournament, and local residents seeking access to world-class international football. Premium seating categories typically sell out first, particularly lower-tier sections offering proximity to pitch action. Independent ticket marketplaces operate on real-time inventory dynamics—seat availability decreases as kickoff approaches, while pricing responds to demand intensity. Securing <strong>tickets for Saudi Arabia vs Serbia March 30</strong> well in advance guarantees preferred seating positions, avoids last-minute scarcity, and provides certainty for travel planning.</p>

    <h2>Jassim Bin Hammad Stadium & Matchday Experience</h2>
    <p><strong>Jassim Bin Hammad Stadium</strong> is a modern venue in the Al Sadd district of Doha, designed for world-class international football. The stadium features climate-controlled environments ensuring comfortable viewing regardless of external temperatures, while the design creates concentrated acoustics enhancing atmosphere. Easy access from central Doha makes this venue convenient for both local fans and international visitors. The stadium offers premium hospitality zones, comprehensive concessions, and accessible seating provisions. Further details are available on the <a href="/venue">venue information page</a>. Plan to arrive 90 minutes before the 6:30 PM kickoff for security screening and seating navigation.</p>

    <h2>Ticket Categories & Availability</h2>
    <p><strong>Saudi Arabia vs Serbia tickets</strong> span multiple seating categories aligned with Jassim Bin Hammad Stadium's tiered architecture. Lower-tier sections positioned near pitch level deliver immersive viewing perspectives and direct engagement with match intensity—these premium categories experience highest demand and typically command premium pricing on independent marketplaces. Upper-tier sections provide elevated panoramic views ideal for tactical observation and stadium atmosphere absorption. Category-specific pricing reflects positioning, sightlines, and real-time market demand. Independent ticket platforms provide continued inventory access after primary distribution phases conclude, with availability fluctuating based on purchase activity and temporal proximity to March 30. Electronic delivery occurs within 48 hours before kickoff, enabling mobile storage or printable backup. Ticket transfer functionality permits digital reassignment if personal plans change, documented in delivery confirmation emails.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing <strong>Saudi Arabia vs Serbia March 30 tickets</strong> through independent resale channels follows secure encrypted checkout workflows. Select preferred seating category, specify quantity, and complete payment via established gateway providers with immediate digital confirmation. For multiple attendees, allocation algorithms prioritize adjacent seating where inventory permits. Pricing reflects prevailing market conditions and may differ from initial face values based on demand intensity and remaining time until kickoff. Full refund provisions apply if the match is cancelled without rescheduling; postponed fixtures honor original ticket validity for rescheduled dates. Customer support assists with pricing inquiries, delivery timelines, and transfer procedures via email, live chat, or telephone channels. Review the <a href="/schedule">complete Festival schedule</a> to coordinate attendance across multiple Qatar matches, or explore <a href="/about-tournament">tournament background</a> for broader context on Football Festival Qatar 2026.</p>
  `,

  faq: [
    {
      question: 'When are Saudi Arabia vs Serbia tickets delivered for the March 30 match?',
      answer:
        'Tickets for Saudi Arabia vs Serbia on March 30, 2026 are delivered electronically within 48 hours before the 6:30 PM kickoff. You will receive an email with digital ticket credentials compatible with mobile storage or printable as physical backup.',
    },
    {
      question: 'Why should I buy Saudi Arabia vs Serbia tickets early?',
      answer:
        'Early purchase secures preferred seating categories before premium lower-tier sections sell out. This match falls during Football Festival Qatar closing weekend when demand peaks. Independent marketplace pricing responds to real-time availability—securing tickets early avoids scarcity and provides certainty for travel planning.',
    },
    {
      question: 'What ticket categories are available for Saudi Arabia vs Serbia at Jassim Bin Hammad Stadium?',
      answer:
        'Categories include lower-tier sections near pitch level (highest demand, premium pricing), upper-tier sections with panoramic views, and various angular positions. Availability fluctuates based on purchase activity and proximity to March 30. All categories provide clear sightlines and full stadium amenity access.',
    },
    {
      question: 'Can I transfer Saudi Arabia vs Serbia tickets if I cannot attend the March 30 match?',
      answer:
        'Yes, tickets are typically transferable via digital reassignment. Transfer instructions are included in your delivery email and involve platform interface reassignment or secure forwarding to the alternative attendee.',
    },
    {
      question: 'How do I reach Jassim Bin Hammad Stadium for Saudi Arabia vs Serbia on March 30?',
      answer:
        'Jassim Bin Hammad Stadium is located in the Al Sadd district of Doha, easily accessible from central Doha. Transportation options include metro and taxi services. Arrive at least 90 minutes before the 6:30 PM kickoff for screening and seating navigation.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Saudi Arabia vs Serbia – Football Festival Qatar 2026',
    description:
      'International friendly match between Saudi Arabia and Serbia at Jassim Bin Hammad Stadium, part of Football Festival Qatar 2026.',
    startDate: '2026-03-30T18:30:00+03:00',
    endDate: '2026-03-30T20:30:00+03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Jassim Bin Hammad Stadium',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Al Sadd',
        addressRegion: 'Doha',
        addressCountry: 'QA',
      },
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: 'Saudi Arabia National Football Team',
      },
      {
        '@type': 'SportsTeam',
        name: 'Serbia National Football Team',
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
Long-tail commercial keyword cluster (Saudi Arabia vs Serbia March 30, 2026):

1. buy saudi arabia vs serbia tickets march 30 2026
2. saudi arabia serbia march 30 jassim bin hammad tickets
3. saudi arabia vs serbia football festival qatar tickets
4. saudi arabia serbia march 30 2026 ticket prices
5. jassim bin hammad stadium saudi arabia serbia march 30 tickets
6. best saudi arabia vs serbia tickets march 30
7. saudi arabia serbia march 30 seating categories
8. buy tickets saudi arabia serbia jassim bin hammad stadium
9. saudi arabia vs serbia march 30 premium seats
10. saudi arabia serbia march 30 2026 doha tickets
11. secure saudi arabia vs serbia tickets early
12. saudi arabia serbia jassim bin hammad march 30 lower tier
13. football festival qatar saudi arabia serbia march 30
14. saudi arabia vs serbia march 30 ticket availability
15. purchase saudi arabia serbia tickets march 30 2026
16. saudi arabia serbia march 30 resale tickets
17. jassim bin hammad saudi arabia vs serbia march 30 booking
18. saudi arabia serbia march 30 independent marketplace
19. early booking saudi arabia vs serbia march 30
20. saudi arabia serbia march 30 2026 verified tickets
*/
