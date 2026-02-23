import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Football Festival Qatar 2026: Qatar vs Argentina
 * March 31, 2026 — Lusail Stadium
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Qatar vs Argentina Tickets March 31 2026 | Lusail Stadium',
  description:
    'Buy Qatar vs Argentina tickets March 31, 2026 at Lusail Stadium. World Cup champions closing match at Football Festival Qatar. Premium seats, secure checkout, instant delivery.',
  h1: 'Qatar vs Argentina — March 31, 2026, Lusail Stadium',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 31, 2026</strong>, Lusail Stadium hosts the closing fixture of <a href="/">Football Festival Qatar 2026</a> as <strong>Qatar faces Argentina</strong> in an international friendly that reunites the 2022 World Cup venue with the reigning champions. This <strong>7:00 PM kickoff</strong> brings Argentina back to the stadium where they claimed their third World Cup title just over three years earlier, creating a symbolic full-circle moment for traveling supporters and neutral football fans. Qatar enters this fixture seeking to test their progress against elite opposition, while Argentina uses the match to maintain competitive rhythm between major tournaments. The <strong>Qatar vs Argentina tickets March 31</strong> provide access to a rare head-to-head between the Gulf hosts and world football's current standard-bearers, closing a week-long celebration that featured multiple international fixtures across Qatar's World Cup legacy infrastructure.</p>

    <h2>Why Buy Qatar vs Argentina Tickets Early</h2>
    <p>Securing <strong>Qatar vs Argentina tickets</strong> in advance is critical for accessing premium seating categories before availability tightens. This closing match attracts significant interest from Argentine supporter groups traveling to see their team return to Lusail, coupled with regional fans eager to witness world champions compete on home soil. Independent resale platforms operate on market-driven pricing—inventory moves faster as kickoff approaches, and lower-tier sections offering closest pitch proximity typically sell through first. Buyers who commit early benefit from wider category selection and avoid the premium pricing that emerges when match day nears. Digital delivery 48 hours before kickoff ensures tickets arrive with ample preparation time, while transfer capabilities provide flexibility if circumstances change unexpectedly.</p>

    <h2>Lusail Stadium & Matchday Experience</h2>
    <p>The <strong>Qatar Argentina March 31 match</strong> unfolds at Qatar's flagship sporting venue—an 80,000-capacity arena featuring climate-controlled comfort, comprehensive sightlines across all seating tiers, and World Cup-standard hospitality zones. Doha Metro Red Line provides direct access via Lusail South Station, with travel time from central districts averaging 25-30 minutes. Stadium infrastructure includes accessible seating areas, modern concession facilities, and integrated audiovisual systems designed for elite international fixtures. Arriving 90 minutes before the <strong>7:00 PM kickoff</strong> allows smooth security processing and time to explore stadium amenities. Review the <a href="/venue">complete venue guide</a> for detailed facility information, accessibility features, and transportation recommendations to maximize your matchday experience.</p>

    <h2>Ticket Categories & Availability</h2>
    <p><strong>Qatar vs Argentina tickets March 31 2026</strong> span multiple seating tiers—premium lower sections near pitch level delivering immersive action views, elevated upper-tier positions offering panoramic stadium perspectives, and varied angular placements around the pitch perimeter. Independent resale channels provide access to secondary market inventory, with pricing adjusting to real-time demand, remaining capacity, and proximity to kickoff. Premium categories move fastest, reflecting strong preference among buyers for optimal viewing positions and closest proximity to world-class talent on display. All tickets deliver electronically 48 hours before kickoff via mobile-compatible or printable formats, eliminating physical mail risks and enabling secure digital storage. Transfer capabilities support flexible reassignment through simple platform-managed processes if your plans shift before match day arrives.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing <strong>Qatar vs Argentina tickets</strong> through independent platforms follows a streamlined process: select category, specify quantity, complete encrypted checkout via established payment gateways. Instant confirmation generates upon successful transaction, with adjacent seating prioritized for multi-ticket orders where inventory allows. Refund policies cover cancellations (full refund) and postponements (tickets valid for rescheduled dates). Customer support assists via email, chat, or phone throughout the booking journey. International visitors attending this closing match should finalize accommodation early—late March demand peaks during Football Festival week. Explore the <a href="/schedule">full tournament schedule</a> to coordinate attendance across multiple fixtures and extend your Qatar football experience beyond this <a href="/about-tournament">signature closing match</a>.</p>
  `,

  faq: [
    {
      question: 'When will I receive my Qatar vs Argentina March 31 tickets?',
      answer:
        'Qatar vs Argentina tickets are delivered electronically 48 hours before the March 31, 2026 kickoff at 7:00 PM. You receive a secure digital file via email, compatible with mobile devices or printable. Early booking ensures tickets arrive well before match day with ample preparation time.',
    },
    {
      question: 'What ticket categories are available for Qatar vs Argentina?',
      answer:
        'Qatar vs Argentina tickets March 31 include lower tier sections near pitch level, upper tier elevated positions, and various viewing angles across Lusail Stadium. Premium lower sections offer closest action proximity and typically sell faster. Category availability fluctuates based on demand—booking early provides broader selection.',
    },
    {
      question: 'Can I transfer Qatar vs Argentina tickets if I cannot attend?',
      answer:
        'Yes, Qatar vs Argentina tickets support digital transfer to another person. Transfer instructions arrive with your ticket delivery email. The process involves simple digital reassignment through the platform or forwarding the ticket file to your designated attendee.',
    },
    {
      question: 'What happens if Qatar vs Argentina March 31 is cancelled?',
      answer:
        'If Qatar vs Argentina is cancelled, full refunds are processed. If postponed to a new date, your tickets remain valid for the rescheduled match. Notification is sent immediately via email if any schedule changes occur for the March 31 fixture.',
    },
    {
      question: 'How do I get to Lusail Stadium for Qatar vs Argentina?',
      answer:
        'Lusail Stadium is accessible via Doha Metro Red Line (exit at Lusail South Station), approximately 25-30 minutes from central Doha. Arrive at least 90 minutes before the 7:00 PM kickoff for security screening and entry. Taxis and ride-sharing services are also available.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Qatar vs Argentina – Football Festival Qatar 2026',
    description:
      'International friendly match between Qatar and Argentina at Lusail Stadium, closing fixture of Football Festival Qatar 2026.',
    startDate: '2026-03-31T19:00:00+03:00',
    endDate: '2026-03-31T21:00:00+03:00',
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
        name: 'Qatar National Football Team',
      },
      {
        '@type': 'SportsTeam',
        name: 'Argentina National Football Team',
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
Long-tail keyword cluster (match-specific only):

Purchase Intent:
- buy qatar vs argentina tickets march 31 2026
- qatar argentina march 31 lusail stadium tickets
- tickets qatar vs argentina football festival closing match
- how to buy qatar argentina march 31 tickets online
- qatar argentina international friendly tickets 2026

Pricing & Comparison:
- qatar vs argentina ticket prices march 31 2026
- qatar argentina lusail stadium ticket costs march 2026
- compare qatar argentina march 31 tickets prices
- qatar vs argentina march 31 2026 ticket deals
- best price qatar argentina football festival tickets

Venue-Specific:
- lusail stadium qatar argentina march 31 tickets
- qatar vs argentina lusail seating categories march 31
- best seats qatar argentina lusail stadium march 2026
- qatar argentina lusail stadium march 31 seating chart
- lusail stadium qatar vs argentina march 31 premium seats

Event-Specific:
- qatar argentina march 31 2026 closing match tickets
- qatar vs argentina football festival qatar final match
- qatar argentina march 31 world cup champions tickets
- argentina vs qatar march 31 lusail international friendly
- qatar national team argentina march 31 tickets

Travel & Logistics:
- qatar vs argentina march 31 tickets for international visitors
- attend qatar argentina march 31 lusail stadium
- qatar argentina march 31 travel packages doha
- qatar vs argentina doha march 31 tickets tourists
- how to attend qatar argentina football festival closing match

Tournament Context:
- football festival qatar closing match march 31 tickets
- qatar argentina march 31 finalissima week tickets
- qatar vs argentina march 31 2026 lusail stadium
- argentina qatar march 31 2026 world cup venue tickets
- football festival qatar march 31 final fixture tickets
*/
