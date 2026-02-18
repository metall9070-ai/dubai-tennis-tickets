import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "FAQ — Football Festival Qatar 2026 | Common Questions",
  description:
    "Answers to frequently asked questions about Football Festival Qatar 2026. Learn about ordering, e-ticket delivery, venue entry, refund policy, and what to expect on match day.",
  keywords: [
    "Football Festival Qatar FAQ",
    "Finalissima questions",
    "e-ticket delivery football Qatar",
    "refund policy football festival",
    "Qatar match day guide",
  ],
  h1: "Frequently Asked Questions",
  breadcrumbLabel: "FAQ",
  highlights: [
    { icon: "📱", title: "Mobile Tickets", body: "Tickets are delivered as mobile tickets via a ticketing app. Keep your phone charged on match day." },
    { icon: "🔒", title: "Secure Checkout", body: "All orders are processed through an encrypted checkout. Payment is taken immediately upon confirmation." },
    { icon: "📧", title: "Order Confirmation", body: "You will receive a confirmation email immediately after your purchase. Check your spam folder if it doesn't arrive." },
    { icon: "🏟️", title: "Arrive Early", body: "Stadium gates typically open 2–3 hours before kick-off. Arriving early helps avoid queues at entry points." },
    { icon: "🪪", title: "ID Required", body: "Bring a valid photo ID that matches your booking details. This may be checked at the gate." },
    { icon: "💬", title: "Need Help?", body: "Our support team is available by email. Find the contact address on our Contact page for any questions about your order." },
  ],
  heroSubtitle:    "Finalissima Tickets — Common Questions",
  heroDescription: "Everything you need to know about ordering, delivery, and attending the matches.",

  faq: [
    {
      question: "How do I place an order?",
      answer:
        "Browse available matches on the homepage, select the session and category you want, choose the number of seats, and proceed to checkout. Payment is processed securely via Stripe.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit and debit cards (Visa, Mastercard, American Express) through our secure Stripe-powered checkout.",
    },
    {
      question: "What happens after I complete my purchase?",
      answer:
        "You will receive an order confirmation email immediately. Your tickets will be delivered no later than 2 days before the event date.",
    },
    {
      question: "How will I receive my tickets?",
      answer:
        "Tickets are delivered as mobile tickets via a ticketing app to your registered email address. In rare cases, tickets may be provided as a PDF. No physical delivery is required — simply present your ticket at the stadium entrance.",
    },
    {
      question: "How do I enter the stadium on match day?",
      answer:
        "Show your e-ticket (printed or on your phone screen) at the stadium gate. Security screening is standard at all venues. Arrive at least 60 minutes before kick-off to allow time for entry.",
    },
    {
      question: "Can I get a refund or change my order?",
      answer:
        "For any refund or modification requests, please contact our support team at support@footballfestivalqatar.com. Each case is reviewed individually and we will do our best to assist you.",
    },
    {
      question: "Is there a dress code for the stadiums?",
      answer:
        "Qatar does not impose a strict dress code at sporting events, but modest clothing is appreciated as a sign of respect for local customs. Casual sportswear and team jerseys are perfectly fine.",
    },
    {
      question: "What is the weather like in Qatar in late March?",
      answer:
        "Late March in Qatar is warm and dry, with daytime temperatures around 28–32°C and evenings cooling to 20–22°C. Sunscreen and a water bottle are recommended for any daytime sessions.",
    },
    {
      question: "Can I bring children to the matches?",
      answer:
        "Yes, children are welcome. Check individual match listings for any age-specific entry requirements or pricing. Younger children may need to be accompanied by an adult.",
    },
    {
      question: "Are food and drink available inside the stadiums?",
      answer:
        "All three venues have concession stands offering food and beverages. Note that alcohol availability varies by venue and event — check specific venue policies closer to the event date.",
    },
    {
      question: "How do I contact customer support?",
      answer:
        "Email us at support@footballfestivalqatar.com for any questions about your order, delivery, or general enquiries. Our team typically responds within 24 hours.",
    },
  ],
  cta: {
    text: "Explore Matches",
    href: "/",
  },
  internalLinks: [
    { label: "Schedule", sublabel: "Dates & match days", href: "/schedule" },
    { label: "Venues", sublabel: "Stadiums & transport", href: "/venue" },
    { label: "About Tournament", sublabel: "Guide & format", href: "/about-tournament" },
    { label: "All Matches", sublabel: "View available sessions", href: "/" },
  ],
}

export default seo
