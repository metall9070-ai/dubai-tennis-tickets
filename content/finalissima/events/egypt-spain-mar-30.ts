import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Football Festival Qatar 2026: Egypt vs Spain
 * March 30, 2026 — Stadium (TBD)
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Egypt vs Spain Tickets March 30 2026 | Football Festival Qatar',
  description:
    'Buy Egypt vs Spain tickets March 30, 2026 at Football Festival Qatar. European champions vs Egypt. Secure seats early, premium categories available, instant delivery.',
  h1: 'Egypt vs Spain — March 30, 2026, Football Festival Qatar',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 30, 2026</strong>, Egypt takes on Spain in a high-profile international friendly at <a href="/">Football Festival Qatar 2026</a>. This fixture brings together the Pharaohs and the reigning European champions, creating a rare showcase of contrasting tactical approaches. Spain's possession-based philosophy meets Egypt's disciplined defensive structure, making the <strong>Egypt vs Spain tickets March 30</strong> a must-have for fans seeking elite-level international football. With limited opportunities to see both nations compete outside major tournaments, demand for this Qatar showdown remains exceptionally strong across supporter bases and neutral football enthusiasts alike.</p>

    <h2>Why Buy Egypt vs Spain Tickets Early</h2>
    <p>Securing <strong>Egypt vs Spain tickets</strong> early is essential for accessing premium seating before availability narrows. International friendlies featuring European champions draw significant interest from traveling supporters and regional fans, driving inventory turnover faster than typical fixtures. Independent ticket platforms operate on market-driven pricing—early buyers benefit from wider category selection and avoid the price premiums that emerge as match day approaches. Lower-tier sections offering closest pitch proximity typically sell through first, making advance booking critical for those prioritizing optimal viewing positions and avoiding limited last-minute options.</p>

    <h2>Qatar Stadium & Matchday Experience</h2>
    <p>The <strong>Egypt vs Spain match March 30</strong> unfolds at a FIFA World Cup legacy stadium featuring climate control, comprehensive sightlines, and premium matchday amenities. These venues offer integrated hospitality zones, accessible seating, and modern concession facilities designed for international standards. Doha Metro provides direct stadium access within 20-35 minutes from central districts. Review the <a href="/venue">venue guide</a> for complete facility details and accessibility information. Arriving 90 minutes before kickoff ensures smooth security screening and time to explore stadium hospitality options before teams take the field.</p>

    <h2>Ticket Categories & Availability</h2>
    <p><strong>Egypt vs Spain tickets March 30 2026</strong> span multiple seating tiers—premium lower sections near pitch level, elevated upper-tier positions, and varied angular placements across the stadium bowl. Independent resale platforms provide access to inventory flowing through secondary channels, with pricing adjusting to real-time demand, remaining capacity, and proximity to kickoff. Categories offering closest action views move fastest, reflecting strong preference for immersive matchday experiences. All tickets deliver electronically 48 hours before kickoff via mobile-compatible or printable formats. Digital transfer capabilities support flexible reassignment if circumstances change, ensuring tickets retain value through simple platform-managed handoffs.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing <strong>Egypt vs Spain tickets</strong> through independent platforms follows a streamlined process: select category, specify quantity, complete encrypted checkout. Secure payment gateways generate instant confirmation, with multiple-ticket orders prioritizing adjacent seating where inventory allows. Refund policies cover cancellations (full refund) and postponements (tickets valid for rescheduled dates). Customer support assists via email, chat, or phone throughout the booking journey. Explore the <a href="/schedule">complete tournament schedule</a> to plan attendance across multiple <a href="/about-tournament">Football Festival Qatar</a> fixtures and maximize your week-long football experience.</p>
  `,

  faq: [
    {
      question: 'When will I receive my Egypt vs Spain March 30 tickets?',
      answer:
        'Egypt vs Spain tickets are delivered electronically 48 hours before the March 30, 2026 kickoff. You receive a secure digital file via email, compatible with mobile devices or printable. Early booking ensures tickets arrive well before match day with ample preparation time.',
    },
    {
      question: 'What ticket categories are available for Egypt vs Spain?',
      answer:
        'Egypt vs Spain tickets March 30 include lower tier sections near pitch level, upper tier elevated positions, and various viewing angles. Premium lower sections offer closest action proximity and typically sell faster. Category availability fluctuates based on demand—booking early provides broader selection.',
    },
    {
      question: 'Can I transfer Egypt vs Spain tickets if I cannot attend?',
      answer:
        'Yes, Egypt vs Spain tickets support digital transfer to another person. Transfer instructions arrive with your ticket delivery email. The process involves simple digital reassignment through the platform or forwarding the ticket file to your designated attendee.',
    },
    {
      question: 'What happens if Egypt vs Spain March 30 is cancelled?',
      answer:
        'If Egypt vs Spain is cancelled, full refunds are processed. If postponed to a new date, your tickets remain valid for the rescheduled match. Notification is sent immediately via email if any schedule changes occur for the March 30 fixture.',
    },
    {
      question: 'How early should I buy Egypt vs Spain tickets?',
      answer:
        'Buying Egypt vs Spain tickets early ensures access to preferred seating categories before premium sections sell through. Independent platforms use market-based pricing that increases as availability decreases. Early purchases provide better category selection and help avoid higher prices closer to March 30.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Egypt vs Spain – Football Festival Qatar 2026',
    description:
      'International friendly match between Egypt and Spain, part of Football Festival Qatar 2026.',
    startDate: '2026-03-30T19:00:00+03:00',
    endDate: '2026-03-30T21:00:00+03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Qatar Stadium',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Doha',
        addressRegion: 'Doha',
        addressCountry: 'QA',
      },
    },
    competitor: [
      {
        '@type': 'SportsTeam',
        name: 'Egypt National Football Team',
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
Long-tail keyword cluster (match-specific only):

Purchase Intent:
- buy egypt vs spain tickets march 30 2026
- egypt spain march 30 qatar tickets
- tickets egypt vs spain football festival qatar
- how to buy egypt spain march 30 tickets
- egypt spain international friendly tickets 2026

Pricing & Comparison:
- egypt vs spain ticket prices march 30
- egypt spain qatar stadium ticket costs march 2026
- compare egypt spain march 30 tickets
- egypt vs spain march 30 2026 ticket deals
- best price egypt spain football festival tickets

Venue-Specific:
- qatar stadium egypt spain march 30 tickets
- egypt vs spain qatar seating categories march 30
- best seats egypt spain qatar stadium
- egypt spain qatar stadium march 30 seating
- qatar stadium egypt vs spain march 2026 seating chart

Event-Specific:
- egypt spain march 30 2026 international friendly
- egypt vs spain football festival qatar tickets
- egypt spain march 30 doha tickets
- spain vs egypt march 30 qatar tickets
- egypt national team spain march 30 tickets

Travel & Logistics:
- egypt vs spain march 30 tickets for tourists
- attend egypt spain march 30 qatar
- egypt spain march 30 travel packages doha
- egypt vs spain doha march 30 tickets visitors
- how to attend egypt spain football festival march 30

Tournament Context:
- football festival qatar march 30 egypt spain
- egypt spain european champions march 30 tickets
- egypt vs spain march 30 2026 qatar tickets
- spain egypt march 30 football festival tickets
- football festival qatar egypt spain match tickets
*/
