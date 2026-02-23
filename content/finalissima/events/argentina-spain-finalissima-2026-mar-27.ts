import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Finalissima 2026: Argentina vs Spain
 * March 27, 2026 — Lusail Stadium
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Argentina vs Spain Tickets March 27 2026 | Finalissima Qatar',
  description:
    'Buy Argentina vs Spain Finalissima tickets for March 27, 2026 at Lusail Stadium. Secure seating for this intercontinental showdown. Market pricing, verified delivery.',
  h1: 'Argentina vs Spain Finalissima 2026 — March 27, Lusail Stadium',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 27, 2026</strong>, <strong>Argentina</strong> and <strong>Spain</strong> clash at Lusail Stadium in the <strong>Finalissima 2026</strong>, a prestigious intercontinental final bringing together South America's Copa América champions and Europe's reigning title holders. This match represents a rare high-profile meeting outside the World Cup, with both nations arriving in Qatar with recent continental success and world-class squads. As part of the <a href="/about-tournament">Football Festival Qatar 2026</a>, this fixture offers fans a unique chance to witness elite international football in a trophy-bearing contest that blends tactical excellence with competitive intensity.</p>

    <h2>Why Buy Argentina vs Spain Tickets Early</h2>
    <p>Demand for the <strong>Argentina vs Spain Finalissima</strong> is driven by the prestige of both teams and the rarity of this fixture. Matches featuring continental champions typically attract significant interest from international supporters, collectors, and neutral fans. Ticket inventory for high-profile fixtures at Lusail Stadium tends to tighten as the event approaches, particularly for premium seating categories offering optimal sightlines. Securing tickets early provides access to a wider selection of seating options and allows for better travel planning. Market-based pricing reflects availability fluctuations, with prices generally rising closer to match day as inventory becomes limited.</p>

    <h2>Lusail Stadium & Matchday Experience</h2>
    <p><strong>Lusail Stadium</strong> is Qatar's flagship venue, located 15 kilometers north of central Doha with an 80,000+ capacity. The stadium hosted the 2022 World Cup Final and features advanced climate control, premium hospitality zones, and engineered sightlines from all tiers. Access is straightforward via Doha Metro Red Line (Lusail South Station), with a 30-minute journey from central Doha. The venue's modern infrastructure supports a world-class matchday experience, while Qatar's moderate late-March climate adds comfort to the evening kickoff. Explore detailed <a href="/venue">venue facilities and access information</a> before your visit.</p>

    <h2>Ticket Categories & Availability</h2>
    <p>Tickets for <strong>Argentina vs Spain on March 27, 2026</strong> are available across multiple seating categories, including lower tier sections for close-to-pitch views, upper tier seating with elevated perspective, and various side and corner positions. Pricing is determined by market demand, category designation, and proximity to kickoff. Independent resale platforms provide access to released inventory when primary channels are exhausted or when buyers seek specific seating preferences. Availability fluctuates based on demand dynamics, so early purchase is recommended for securing preferred sections. Premium categories typically see the fastest inventory movement given limited allocation and high demand for this level of fixture.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing tickets follows a secure digital process: select your seating category, specify quantity, and proceed through encrypted checkout. Confirmation is issued immediately, and tickets are delivered electronically no later than two days before March 27. Digital delivery eliminates postal risk and ensures reliable access. Tickets can typically be transferred if plans change, with transfer procedures outlined in the delivery email. In the event of cancellation, full refunds are standard; if postponed, tickets remain valid for the rescheduled date. View the <a href="/schedule">complete tournament calendar</a> to coordinate attendance with other fixtures during Football Festival Qatar 2026.</p>
  `,

  faq: [
    {
      question: 'When is the best time to buy Argentina vs Spain Finalissima tickets?',
      answer:
        'Purchasing tickets as early as possible is recommended for the Argentina vs Spain match on March 27, 2026. Inventory for high-demand fixtures at Lusail Stadium typically tightens as the event approaches, especially for premium seating categories. Early buyers benefit from wider category selection and better pricing stability before demand-driven price adjustments occur closer to match day.',
    },
    {
      question: 'How are ticket prices determined for Argentina vs Spain on March 27?',
      answer:
        'Ticket prices for the Argentina vs Spain Finalissima reflect market demand, seating category, and availability. Independent resale platforms price tickets based on current inventory levels and buyer interest. Prices may differ from original face value depending on how close the event date is and which categories remain available. Premium sections typically command higher prices due to limited allocation and strong demand for this caliber of fixture.',
    },
    {
      question: 'When will I receive my Argentina vs Spain tickets after purchasing?',
      answer:
        'Tickets for the Argentina vs Spain match on March 27, 2026 are delivered electronically no later than 2 days before the event. You will receive an email with digital access instructions. This secure delivery method eliminates postal delays and ensures you have reliable entry credentials well before kickoff at Lusail Stadium.',
    },
    {
      question: 'Can I choose my exact seats for Argentina vs Spain at Lusail Stadium?',
      answer:
        'Seating is allocated within the category you select when purchasing Argentina vs Spain Finalissima tickets. While exact seat numbers may not be choosable in advance, tickets within the same order are seated together. Lower tier, upper tier, and various viewing angle categories are available depending on current inventory. All sections at Lusail Stadium offer clear sightlines and access to venue facilities.',
    },
    {
      question: 'What happens if the Argentina vs Spain match on March 27 is postponed or cancelled?',
      answer:
        'If the Argentina vs Spain Finalissima is cancelled, a full refund will be processed. If the match is postponed to a different date, your tickets remain valid for the rescheduled fixture. Any changes to the March 27, 2026 event will be communicated immediately via email, and buyer protections apply in either scenario.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Argentina vs Spain – Finalissima 2026',
    description:
      'Intercontinental final between Argentina and Spain at Lusail Stadium, Qatar on March 27, 2026.',
    startDate: '2026-03-27T19:00:00+03:00',
    endDate: '2026-03-27T21:00:00+03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Lusail Stadium',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Lusail',
        addressRegion: 'Doha',
        addressCountry: 'QA',
      },
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: 'Argentina National Football Team',
      },
      {
        '@type': 'SportsTeam',
        name: 'Spain National Football Team',
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
Long-tail keyword cluster (commercial intent — match-specific only):

High-Intent Purchase:
1. buy argentina vs spain finalissima tickets march 27 2026
2. argentina spain finalissima 2026 tickets lusail stadium
3. secure argentina vs spain march 27 tickets online
4. argentina spain intercontinental final tickets march 27

Pricing & Availability:
5. argentina vs spain finalissima ticket prices march 2026
6. best price argentina spain tickets march 27 lusail
7. argentina spain finalissima resale tickets march 27
8. argentina vs spain march 27 ticket availability

Seating & Categories:
9. premium seats argentina vs spain lusail march 27
10. lower tier tickets argentina spain finalissima 2026
11. argentina vs spain lusail stadium seating march 27
12. best view seats argentina spain finalissima qatar

Venue-Specific Commercial:
13. lusail stadium argentina spain tickets march 27 2026
14. argentina vs spain lusail qatar march 27 seating
15. buy lusail stadium argentina spain finalissima tickets

Timing & Urgency:
16. early booking argentina spain finalissima march 27
17. last minute argentina vs spain tickets march 2026
18. argentina spain march 27 2026 ticket demand

Event-Specific Long-Tail:
19. argentina vs spain qatar football festival march 27 tickets
20. finalissima 2026 argentina spain march 27 lusail tickets
*/
