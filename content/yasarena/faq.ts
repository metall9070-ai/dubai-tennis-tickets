import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "Common Questions — Etihad Arena Events & Visitor Guide",
  description:
    "Find answers about attending events at Etihad Arena. Ordering process, mobile ticket delivery, venue facilities, parking, refund procedures, and practical event day tips.",
  keywords: [
    "Etihad Arena FAQ",
    "Etihad Arena visitor questions",
    "Yas Arena concierge help",
    "Etihad Arena event queries",
    "Abu Dhabi arena information",
  ],
  h1: "Frequently Asked Questions",
  breadcrumbLabel: "FAQ",
  heroSubtitle: "Etihad Arena — Visitor Information",
  heroDescription:
    "Answers to common questions about ordering, delivery, and attending events.",

  faq: [
    {
      question: "Who is Yas Arena Concierge?",
      answer:
        "Yas Arena Concierge is an independent ticket concierge service for Etihad Arena. We are not affiliated with, endorsed by, or connected to any venue, promoter, or event organiser.",
    },
    {
      question: "How will my tickets be delivered?",
      answer:
        "Tickets are delivered no later than 2 days before the event date. They are delivered as mobile tickets via a ticketing app. In rare cases, tickets may be provided as a PDF.",
    },
    {
      question: "Is parking available at the arena?",
      answer:
        "Yes, dedicated car parks serve Etihad Arena and the Yas Bay area. Accessible parking bays are located close to the venue entrance. For popular events, arrive early as parking is available on a first-come, first-served basis.",
    },
    {
      question: "What happens if an event is cancelled or rescheduled?",
      answer:
        "If the event is cancelled by the organiser, a full refund will be issued. If the event is postponed to a new date, your tickets remain valid for the rescheduled event. For specific cases, contact our support team at support@yasarena.com.",
    },
    {
      question: "What seating options are available?",
      answer:
        "We offer access to all officially released seating categories, subject to availability. Exact categories vary by event and are displayed on the event listing page when you make your selection.",
    },
    {
      question: "Can I purchase tickets for multiple events?",
      answer:
        "Yes, you can order tickets for as many events as you wish. Each event is ticketed separately — simply add your chosen events to the cart and complete checkout.",
    },
    {
      question: "Are food and drinks available inside the venue?",
      answer:
        "Etihad Arena has multiple food and beverage outlets across all concourse levels. Options range from quick snacks and soft drinks to more substantial meals. Outside food and beverages are generally not permitted inside the arena.",
    },
    {
      question: "What items are prohibited at the arena?",
      answer:
        "Prohibited items typically include large bags, professional cameras with detachable lenses, outside food and beverages, fireworks, and laser pointers. Security screening takes place at all venue entrances. Check the specific event listing for any additional restrictions.",
    },
    {
      question: "Can I transfer my tickets to another person?",
      answer:
        "Yes, tickets can generally be transferred to another person. The exact transfer process depends on the ticketing platform used for delivery. Contact support@yasarena.com if you need help with a ticket transfer.",
    },
    {
      question: "Can I cancel my order after purchase?",
      answer:
        "Cancellation requests are assessed on a case-by-case basis. Contact our support team at support@yasarena.com as early as possible to discuss your situation.",
    },
    {
      question: "When should I arrive at the arena?",
      answer:
        "Doors typically open 60–90 minutes before the advertised start time. Arriving at least 45 minutes before the show allows time for security screening, finding your seat, and settling in before the event begins.",
    },
  ],
  cta: {
    text: "Browse Events",
    href: "/",
  },
  internalLinks: [
    { label: "Events", sublabel: "Upcoming shows", href: "/events" },
    {
      label: "About Venue",
      sublabel: "Arena guide",
      href: "/about-venue",
    },
    {
      label: "Getting There",
      sublabel: "Directions & parking",
      href: "/getting-there",
    },
    { label: "All Events", sublabel: "Full event calendar", href: "/" },
  ],
}

export default seo
