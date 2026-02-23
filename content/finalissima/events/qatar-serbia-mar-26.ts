import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Football Festival Qatar 2026: Qatar vs Serbia
 * March 26, 2026 — Lusail Stadium
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Qatar vs Serbia Tickets March 26 2026 | Football Festival Qatar',
  description:
    'Buy Qatar vs Serbia tickets March 26, 2026 at Lusail Stadium. Opening match Football Festival Qatar. Secure seats early, premium categories available, instant delivery.',
  h1: 'Qatar vs Serbia — March 26, 2026, Lusail Stadium',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 26, 2026</strong>, Qatar hosts Serbia in the opening fixture of Football Festival Qatar 2026 at Lusail Stadium. This 4:00 PM kickoff launches a week-long celebration of international football at the venue that hosted the 2022 World Cup Final. Serbia brings a squad built around experienced European professionals competing across top leagues, while Qatar leverages home advantage and familiarity with Lusail's world-class facilities. The <strong>Qatar vs Serbia tickets March 26</strong> provide access to the tournament's inaugural match, setting the tone for multiple high-profile friendlies throughout the week.</p>

    <h2>Why Buy Qatar vs Serbia Tickets Early</h2>
    <p>Securing <strong>Qatar vs Serbia tickets</strong> early offers strategic advantages for this opening Football Festival match. As the tournament's first fixture, demand often peaks among fans eager to experience Lusail Stadium and establish momentum for attending subsequent matches. Independent ticket platforms operate on market-based pricing that adjusts with inventory levels—early purchases typically access broader seating category selection before premium lower-tier sections and optimal viewing positions sell through. Opening matches historically attract strong interest from both traveling supporters and regional football enthusiasts, making advance booking valuable for preferred seat selection.</p>

    <h2>Lusail Stadium & Matchday Experience</h2>
    <p>The <strong>Qatar vs Serbia match March 26</strong> takes place at Lusail Stadium, Qatar's flagship 80,000+ capacity venue located 15 kilometers north of central Doha. This FIFA World Cup Final host stadium features comprehensive climate control, optimal sightlines from all seating tiers, and modern amenities including hospitality zones and premium concessions. Doha Metro Red Line provides direct access via Lusail South Station (25-30 minutes from city center). For detailed facility information and accessibility features, review the <a href="/venue">venue guide</a>. Arrive 90 minutes before the 4:00 PM kickoff for efficient security processing.</p>

    <h2>Ticket Categories & Availability</h2>
    <p><strong>Qatar vs Serbia tickets March 26 2026</strong> are distributed across tiered seating categories—lower sections near pitch level, elevated upper-tier positions, and various angular placements around Lusail's bowl configuration. Independent resale platforms provide inventory access through secondary channels, with pricing reflecting real-time demand dynamics, remaining availability, and proximity to match day. Premium categories offering close-to-action views typically experience faster inventory turnover for opening fixtures. All tickets arrive via electronic delivery 48 hours before kickoff, compatible with mobile or printable formats. Ticket transfers are supported through straightforward digital reassignment if plans change.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing <strong>Qatar vs Serbia tickets</strong> through independent platforms follows a streamlined workflow: select category, specify quantity, proceed to encrypted checkout. Payment via secure gateways generates instant confirmation. Multiple-ticket orders prioritize adjacent seating where inventory permits. Refund policies cover cancellations (full refund) and postponements (tickets valid for rescheduled date). Customer support assists via email, chat, or phone throughout the purchase process. Review the <a href="/schedule">complete Football Festival Qatar schedule</a> to coordinate attendance across multiple matches during your visit, or explore <a href="/about-tournament">tournament background</a> for additional context on this week-long international football celebration.</p>
  `,

  faq: [
    {
      question: 'When will I receive my Qatar vs Serbia March 26 tickets?',
      answer:
        'Qatar vs Serbia tickets are delivered electronically 48 hours before the March 26, 2026 kickoff at 4:00 PM. You receive a secure digital file via email, compatible with mobile devices or printable. Early booking ensures tickets arrive well before match day with ample preparation time.',
    },
    {
      question: 'What ticket categories are available for Qatar vs Serbia at Lusail Stadium?',
      answer:
        'Qatar vs Serbia tickets March 26 include lower tier sections near pitch level, upper tier elevated positions, and various viewing angles around Lusail Stadium. Premium lower sections offer closest action proximity and typically sell faster for opening fixtures. Category availability fluctuates based on demand—booking early provides broader selection.',
    },
    {
      question: 'Can I transfer Qatar vs Serbia tickets if I cannot attend?',
      answer:
        'Yes, Qatar vs Serbia tickets support digital transfer to another person. Transfer instructions arrive with your ticket delivery email. The process involves simple digital reassignment through the platform or forwarding the ticket file to your designated attendee.',
    },
    {
      question: 'What happens if Qatar vs Serbia March 26 is cancelled?',
      answer:
        'If Qatar vs Serbia is cancelled, full refunds are processed. If postponed to a new date, your tickets remain valid for the rescheduled match. Notification is sent immediately via email if any schedule changes occur for the March 26 opening fixture.',
    },
    {
      question: 'Why buy Qatar vs Serbia tickets early for the opening match?',
      answer:
        'Buying Qatar vs Serbia tickets early ensures access to preferred seating categories before premium sections sell through. As the Football Festival opening fixture, demand peaks among fans attending multiple matches. Independent platforms use market-based pricing that increases as availability decreases, making early purchases strategically valuable.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Qatar vs Serbia – Football Festival Qatar 2026',
    description:
      'International friendly match between Qatar and Serbia at Lusail Stadium, part of Football Festival Qatar 2026.',
    startDate: '2026-03-26T16:00:00+03:00',
    endDate: '2026-03-26T18:00:00+03:00',
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
Long-tail keyword cluster (match-specific only):

Purchase Intent:
- buy qatar vs serbia tickets march 26 2026
- qatar serbia march 26 lusail tickets
- tickets qatar vs serbia football festival qatar
- how to buy qatar serbia march 26 tickets
- qatar serbia international friendly tickets 2026

Pricing & Comparison:
- qatar vs serbia ticket prices march 26
- qatar serbia lusail stadium ticket costs
- compare qatar serbia march 26 tickets
- qatar vs serbia march 2026 ticket deals
- best price qatar serbia football festival tickets

Venue-Specific:
- lusail stadium qatar serbia march 26 tickets
- qatar vs serbia lusail seating categories
- best seats qatar serbia lusail stadium
- qatar serbia lusail stadium march 26 seating
- lusail stadium qatar vs serbia seating chart

Event-Specific:
- qatar serbia march 26 2026 international friendly
- qatar vs serbia football festival qatar tickets
- qatar serbia march 26 doha tickets
- serbia vs qatar march 26 lusail tickets
- qatar national team serbia march 26 tickets

Travel & Logistics:
- qatar vs serbia march 26 tickets for tourists
- attend qatar serbia march 26 lusail
- qatar serbia march 26 travel packages
- qatar vs serbia doha march 26 tickets visitors
- how to attend qatar serbia football festival march 26
*/
