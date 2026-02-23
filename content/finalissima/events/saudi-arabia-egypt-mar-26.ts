import type { EventSEO } from '@/types/seo'

/**
 * Event-level SEO for Football Festival Qatar 2026: Saudi Arabia vs Egypt
 * March 26, 2026 — Ahmad Bin Ali Stadium
 *
 * Frontend-only SEO content.
 * CRM does not store SEO.
 */
export const eventSEO: EventSEO = {
  title: 'Saudi Arabia vs Egypt Tickets March 26 2026 | Ahmad Bin Ali',
  description:
    'Buy Saudi Arabia vs Egypt tickets for March 26, 2026 at Ahmad Bin Ali Stadium. High-demand international friendly. Secure your seats early for this regional rivalry clash at Football Festival Qatar.',
  h1: 'Saudi Arabia vs Egypt Tickets — March 26, 2026',

  content: `
    <h2>About the Match</h2>
    <p>On <strong>March 26, 2026</strong>, <strong>Saudi Arabia</strong> faces <strong>Egypt</strong> in a highly anticipated international friendly at <strong>Ahmad Bin Ali Stadium</strong>, part of the <strong>Football Festival Qatar 2026</strong>. Kick-off is at 5:00 PM local time. This regional rivalry brings together two of the Arab world's most passionate football nations, each with deep competitive heritage and strong national team programs.</p>

    <p>Both teams use this fixture to prepare for upcoming World Cup qualifiers and continental championships. <strong>Saudi Arabia vs Egypt on March 26</strong> showcases contrasting styles: Saudi Arabia's technical fluidity against Egypt's tactical discipline. For fans, this matchup offers elite international football in a world-class venue, with both nations bringing dedicated supporter bases and creating an electric atmosphere.</p>

    <h2>Why Buy Saudi Arabia vs Egypt Tickets Early</h2>
    <p>Tickets for <strong>Saudi Arabia vs Egypt</strong> are in high demand due to the regional rivalry and limited availability across premium seating categories. International friendlies featuring top-tier Arab nations attract strong interest from local fans, expatriate communities, and traveling supporters. Early booking secures better seat selection and avoids late-stage price increases driven by scarcity.</p>

    <p>As the March 26 date approaches, category availability narrows, particularly in lower-tier and central sections. Independent resale markets reflect real-time demand, meaning prices fluctuate based on remaining inventory. Securing tickets now ensures access to your preferred viewing position and eliminates the risk of complete sellout, especially for group bookings requiring adjacent seating.</p>

    <h2>Ahmad Bin Ali Stadium & Matchday Experience</h2>
    <p><strong>Ahmad Bin Ali Stadium</strong> in Al Rayyan hosted multiple FIFA World Cup 2022 matches and features modern amenities, climate control, and optimal sightlines from all sections. The venue accommodates over 40,000 spectators and combines architectural elegance with functional design. Access via Doha Metro Green Line (Al Riffa Station) takes approximately 30-35 minutes from central Doha.</p>

    <p>Matchday atmosphere benefits from passionate supporter groups, pre-match entertainment, and comprehensive concession services. Plan to arrive 90 minutes before kickoff to navigate security screening and locate your section. For additional venue details, visit the <a href="/venue">stadium guide</a>. The <a href="/schedule">full festival schedule</a> allows multi-match planning during your Qatar visit.</p>

    <h2>Ticket Categories & Availability</h2>
    <p><strong>Saudi Arabia vs Egypt tickets for March 26</strong> are distributed across multiple seating categories: lower-tier sections near pitch level, upper-tier sections with elevated views, and various angular positions. Pricing reflects proximity, category designation, and current market demand. Independent platforms provide access to inventory beyond primary sales, with availability updated in real time.</p>

    <p>Premium categories offer closer viewing angles and enhanced atmosphere, while upper sections provide panoramic perspectives at more accessible price points. Category availability shifts as the event date nears, making early purchase strategically advantageous. Tickets are delivered electronically within 48 hours of kickoff, compatible with mobile devices or printable formats. Groups benefit from adjacent seat allocation where inventory permits.</p>

    <h2>Secure Booking & Delivery</h2>
    <p>Purchasing <strong>Saudi Arabia vs Egypt tickets</strong> follows a secure, encrypted checkout process. Select your preferred category, specify quantity, and complete payment via verified gateways. Instant confirmation is issued upon transaction completion. Digital delivery eliminates shipping delays and provides immediate access credentials.</p>

    <p>Tickets can be transferred if plans change, with reassignment instructions included in delivery emails. Refund policies cover cancellations (full refund) and postponements (tickets valid for rescheduled date). Customer support assists with purchase inquiries, delivery questions, and transfer procedures. International visitors should coordinate accommodation and travel early—explore the <a href="/">Football Festival Qatar</a> for complete fixture planning.</p>
  `,

  faq: [
    {
      question: 'Why should I buy Saudi Arabia vs Egypt tickets early for March 26?',
      answer:
        'Saudi Arabia vs Egypt is a high-demand regional rivalry fixture. Premium seating categories sell quickly, and prices increase as availability narrows. Booking early guarantees your preferred section and locks in current pricing before market-driven adjustments occur closer to the March 26 kickoff.',
    },
    {
      question: 'What ticket categories are available for Saudi Arabia vs Egypt at Ahmad Bin Ali Stadium?',
      answer:
        'Categories include lower-tier sections near the pitch, upper-tier sections with panoramic views, and various angular positions. Lower-tier seats offer closer proximity and enhanced atmosphere, while upper sections provide broader sightlines at different price points. Availability fluctuates based on demand for this March 26 match.',
    },
    {
      question: 'When will I receive my Saudi Arabia vs Egypt tickets?',
      answer:
        'Tickets are delivered electronically within 48 hours before the March 26, 2026 kickoff at 5:00 PM. You will receive an email with digital tickets compatible with mobile devices or printable format, ensuring secure, instant access without shipping delays.',
    },
    {
      question: 'Can I transfer my tickets if I cannot attend the Saudi Arabia vs Egypt match?',
      answer:
        'Yes, tickets can be transferred to another person. Transfer instructions are included in your delivery email and typically involve digital reassignment through the ticketing platform. This flexibility ensures your tickets are not wasted if your March 26 plans change.',
    },
    {
      question: 'How do I get to Ahmad Bin Ali Stadium for the Saudi Arabia vs Egypt match on March 26?',
      answer:
        'Ahmad Bin Ali Stadium is accessible via Doha Metro Green Line (Al Riffa Station), approximately 30-35 minutes from central Doha. Taxis and ride-sharing are also available. Arrive 90 minutes before the 5:00 PM kickoff to allow time for security screening and finding your seat.',
    },
  ],

  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: 'Saudi Arabia vs Egypt – Football Festival Qatar 2026',
    description:
      'International friendly match between Saudi Arabia and Egypt at Ahmad Bin Ali Stadium, part of Football Festival Qatar 2026.',
    startDate: '2026-03-26T17:00:00+03:00',
    endDate: '2026-03-26T19:00:00+03:00',
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: 'Ahmad Bin Ali Stadium',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Al Rayyan',
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
        name: 'Egypt National Football Team',
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

Primary Commercial Keywords:
- buy saudi arabia vs egypt tickets march 26 2026
- saudi arabia egypt tickets march 26 ahmad bin ali
- saudi arabia vs egypt march 26 ticket prices
- book saudi arabia egypt tickets football festival qatar
- secure saudi arabia egypt march 26 seats

High-Intent Purchase Queries:
- saudi arabia egypt tickets march 26 availability
- saudi arabia vs egypt ahmad bin ali stadium tickets
- purchase saudi arabia egypt international friendly tickets
- saudi arabia egypt march 26 best ticket deals
- saudi arabia vs egypt march 2026 premium seats

Urgency & Demand Keywords:
- saudi arabia egypt tickets selling fast march 26
- limited saudi arabia vs egypt tickets march 26
- early booking saudi arabia egypt ahmad bin ali
- saudi arabia egypt march 26 high demand tickets
- secure tickets saudi arabia vs egypt before sellout

Category & Seating Queries:
- saudi arabia egypt lower tier tickets march 26
- ahmad bin ali stadium seating saudi arabia egypt
- best seats saudi arabia vs egypt march 26
- saudi arabia egypt premium category tickets
- saudi arabia vs egypt ahmad bin ali seating chart

Event-Specific Long-Tail:
- saudi arabia national team vs egypt march 26 tickets
- egypt vs saudi arabia football festival qatar tickets
- saudi arabia egypt al rayyan march 26 2026
- international friendly saudi arabia egypt ahmad bin ali
- saudi arabia vs egypt doha tickets march 26
*/
