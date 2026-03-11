/**
 * Per-site FAQ data. Keyed by NEXT_PUBLIC_SITE_CODE.
 * FAQClient reads from here instead of hardcoding tennis content.
 */

export interface FAQItem {
  category: string
  question: string
  answer: string
}

export interface FAQContent {
  subtitle: string
  items: FAQItem[]
}

const GENERIC_TICKETS_FAQ: FAQItem[] = [
  {
    category: "Tickets & Pricing",
    question: "What types of tickets are available?",
    answer: "We offer tickets across all seating categories. Prices vary based on event, seating location, and availability. Browse our schedule to see current options."
  },
  {
    category: "Tickets & Pricing",
    question: "How does your ticket concierge service work?",
    answer: "We operate as an independent ticket concierge service. We search, select, and secure tickets on your behalf from various sources on the secondary market. All tickets are verified for authenticity before delivery. Every purchase comes with our money-back protection if the event is cancelled."
  },
  {
    category: "Tickets & Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and Apple Pay. All transactions are secured with 256-bit SSL encryption. Prices are displayed in USD but you can pay in your local currency."
  },
  {
    category: "Policies",
    question: "Can I get a refund?",
    answer: "Full refunds are provided if the event is cancelled by the organizer. For postponed events, tickets remain valid for the new date, or you can request a refund. Voluntary cancellations are generally not refundable. Please review our Terms of Service for complete details."
  },
  {
    category: "Policies",
    question: "Can I transfer tickets to someone else?",
    answer: "Yes, tickets can be transferred to another person. E-tickets can be forwarded directly. For name-specific tickets, please contact our customer service at least 72 hours before the event to arrange the transfer."
  },
  {
    category: "Policies",
    question: "What is your cancellation policy?",
    answer: "All sales are generally final. Event cancellation by the organizer triggers a refund process within 14 business days. For rescheduled events, tickets remain valid for the new date. Please contact our support team for any questions."
  },
]

const TENNIS_FAQ: FAQContent = {
  subtitle: "Find answers to common questions about Dubai Tennis Championships tickets.",
  items: [
    {
      category: "Tickets & Pricing",
      question: "What types of tickets are available?",
      answer: "We offer tickets across all seating categories: Prime A (courtside), Prime B (lower level sides), Grandstand Lower, and Grandstand Upper. Prices vary based on match round, seating location, and availability. Browse our schedule to see current options for each session."
    },
    {
      category: "Tickets & Pricing",
      question: "How does your ticket concierge service work?",
      answer: "We operate as an independent ticket concierge service. We search, select, and secure tickets on your behalf from various sources on the secondary market. All tickets are verified for authenticity before delivery. Every purchase comes with our money-back protection if the event is cancelled."
    },
    {
      category: "Tickets & Pricing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and Apple Pay. All transactions are secured with 256-bit SSL encryption. Prices are displayed in USD but you can pay in your local currency."
    },
    {
      category: "Tickets & Pricing",
      question: "Can I buy tickets for multiple matches?",
      answer: "Yes, you can purchase tickets for as many matches as you like. Many fans choose to attend multiple days to see different rounds of the tournament. Contact our concierge team if you need assistance planning your schedule across multiple sessions."
    },
    {
      category: "Event Information",
      question: "When is Dubai Duty Free Tennis Championships 2026?",
      answer: "The Dubai Duty Free Tennis Championships 2026 will be held from February 15 to February 28, 2026. The WTA 1000 Women's tournament runs February 15-21, followed by the ATP 500 Men's tournament from February 23-28."
    },
    {
      category: "Event Information",
      question: "What time do matches start?",
      answer: "Early round matches typically start at 11:00 AM or 2:00 PM local time (GMT+4). Quarter-finals begin at 2:00 PM, Semi-finals at 1:00-1:30 PM, and Finals at 4:30 PM. The schedule is subject to change based on match duration."
    },
    {
      category: "Event Information",
      question: "Which players compete at Dubai Tennis Championships?",
      answer: "Dubai Tennis Championships attracts the world's elite players. The ATP 500 and WTA 1000 status ensures participation from top 20 ranked players. Past champions include Roger Federer (8-time winner), Novak Djokovic, Rafael Nadal, Iga Swiatek, and Aryna Sabalenka."
    },
    {
      category: "Event Information",
      question: "How long do tennis matches last?",
      answer: "Match duration varies significantly. First-round matches typically last 1-2 hours, while finals can extend to 2-3 hours. Men's matches are best of 3 sets. We recommend arriving early and being prepared for matches to run longer than scheduled."
    },
    {
      category: "Venue & Seating",
      question: "Where is the Dubai Tennis Stadium located?",
      answer: "Dubai Duty Free Tennis Stadium is located at the Aviation Club in Al Garhoud, just 10 minutes from Dubai International Airport. The full address is: Aviation Club Tennis Centre, Al Garhoud, Dubai, UAE."
    },
    {
      category: "Venue & Seating",
      question: "What is the best seating at Dubai Tennis Stadium?",
      answer: "Prime A seats offer courtside, player-level views with the closest proximity to the action. Prime B provides excellent angles from the lower level sides. Grandstand Lower delivers elevated sightlines while staying close to the court, and Grandstand Upper offers panoramic views of the entire stadium. All seats have unobstructed Centre Court views."
    },
    {
      category: "Venue & Seating",
      question: "Is the stadium covered or open-air?",
      answer: "Dubai Duty Free Tennis Stadium is an open-air venue with partial shade from the roof structure. February weather in Dubai is typically pleasant (20-25\u00b0C/68-77\u00b0F) but we recommend sunscreen and hats for day sessions. Evening sessions offer cooler temperatures."
    },
    {
      category: "Venue & Seating",
      question: "Are there facilities for disabled visitors?",
      answer: "Yes, the venue is fully accessible with wheelchair spaces, accessible restrooms, and elevator access. Please contact us when booking to arrange accessible seating and any special assistance requirements."
    },
    {
      category: "Policies",
      question: "Can I get a refund on Dubai Tennis tickets?",
      answer: "Full refunds are provided if the event is cancelled by the organizer. For postponed events, tickets remain valid for the new date, or you can request a refund. Voluntary cancellations are generally not refundable. Please review our Terms of Service for complete details on our refund policy."
    },
    {
      category: "Policies",
      question: "Can I transfer tickets to someone else?",
      answer: "Yes, tickets can be transferred to another person. E-tickets can be forwarded directly. For name-specific tickets, please contact our customer service at least 72 hours before the event to arrange the transfer."
    },
    {
      category: "Policies",
      question: "What is your cancellation policy?",
      answer: "All sales are generally final. Event cancellation by the organizer triggers a refund process within 14 business days. For rescheduled events, tickets remain valid for the new date. Please contact our support team for any questions regarding specific situations."
    },
    {
      category: "Practical Information",
      question: "How do I get to Dubai Tennis Stadium?",
      answer: "By Metro: Take the Green Line to GGICO station (5-minute walk). By Taxi/Uber: Direct drop-off at venue entrance. By Car: Parking available on-site (limited spaces, arrive early). The venue is 10 minutes from Dubai International Airport and 20 minutes from Downtown Dubai."
    },
    {
      category: "Practical Information",
      question: "Is there a dress code?",
      answer: "There is no strict dress code for general admission. Smart casual attire is recommended. For VIP and hospitality areas, business casual is expected. Comfortable footwear is advised. Dubai is cosmopolitan but modest dress is appreciated in public areas."
    },
    {
      category: "Practical Information",
      question: "Can I bring food and drinks into the venue?",
      answer: "Outside food and beverages are not permitted. The venue offers a variety of food outlets, cafes, and bars. Water bottles (sealed, under 500ml) may be allowed. VIP ticket holders have access to premium catering facilities."
    },
    {
      category: "Practical Information",
      question: "What items are prohibited at the venue?",
      answer: "Prohibited items include: professional cameras with detachable lenses, video recording equipment, large bags (over A4 size), glass bottles, alcohol, laser pointers, and any items that could be used as weapons. Bag checks are conducted at entry."
    },
  ],
}

const FINALISSIMA_FAQ: FAQContent = {
  subtitle: "Find answers to common questions about Football Festival Qatar tickets.",
  items: [
    {
      category: "Tickets & Pricing",
      question: "What types of tickets are available?",
      answer: "We offer tickets across all seating categories from standard to premium. Prices vary based on the match, seating location, and availability. Browse our schedule to see current options for each match."
    },
    {
      category: "Tickets & Pricing",
      question: "How does your ticket concierge service work?",
      answer: "We operate as an independent ticket concierge service. We search, select, and secure tickets on your behalf from various sources on the secondary market. All tickets are verified for authenticity before delivery. Every purchase comes with our money-back protection if the event is cancelled."
    },
    {
      category: "Tickets & Pricing",
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and Apple Pay. All transactions are secured with 256-bit SSL encryption. Prices are displayed in USD but you can pay in your local currency."
    },
    {
      category: "Tickets & Pricing",
      question: "Can I buy tickets for multiple matches?",
      answer: "Yes, you can purchase tickets for as many matches as you like. The festival features multiple matches across several days. Contact our concierge team if you need assistance planning your schedule."
    },
    {
      category: "Event Information",
      question: "When is Football Festival Qatar 2026?",
      answer: "Football Festival Qatar 2026 runs from March 26 to March 31, 2026, featuring international friendlies and the Finalissima intercontinental final between Spain and Argentina."
    },
    {
      category: "Event Information",
      question: "What time do matches start?",
      answer: "Match times vary. Most matches kick off in the evening to take advantage of cooler temperatures. Exact kick-off times are confirmed closer to the event date. Check our schedule page for the latest updates."
    },
    {
      category: "Event Information",
      question: "Which teams are playing?",
      answer: "The headline match is the Finalissima between Spain (UEFA EURO champions) and Argentina (Copa Am\u00e9rica champions). Additional international friendly matches are scheduled throughout the festival period."
    },
    {
      category: "Venue & Getting There",
      question: "Where are the matches held?",
      answer: "Matches are held at world-class stadiums in Qatar, including the iconic Lusail Stadium which hosted the 2022 FIFA World Cup Final. The venues are well-connected by Qatar's modern transport infrastructure."
    },
    {
      category: "Venue & Getting There",
      question: "How do I get to the stadium?",
      answer: "Qatar's Doha Metro system connects to all major stadiums. Taxis and ride-sharing services are widely available. Many hotels offer shuttle services to stadiums on match days. The venues are easily accessible from Hamad International Airport."
    },
    {
      category: "Venue & Getting There",
      question: "Are there facilities for disabled visitors?",
      answer: "Yes, all Qatar stadiums are fully accessible with wheelchair spaces, accessible restrooms, and elevator access. Please contact us when booking to arrange accessible seating and any special assistance requirements."
    },
    {
      category: "Policies",
      question: "Can I get a refund?",
      answer: "Full refunds are provided if the event is cancelled by the organizer. For postponed events, tickets remain valid for the new date, or you can request a refund. Voluntary cancellations are generally not refundable. Please review our Terms of Service for complete details."
    },
    {
      category: "Policies",
      question: "Can I transfer tickets to someone else?",
      answer: "Yes, tickets can be transferred to another person. E-tickets can be forwarded directly. For name-specific tickets, please contact our customer service at least 72 hours before the event to arrange the transfer."
    },
    {
      category: "Policies",
      question: "What is your cancellation policy?",
      answer: "All sales are generally final. Event cancellation by the organizer triggers a refund process within 14 business days. For rescheduled events, tickets remain valid for the new date. Please contact our support team for any questions."
    },
    {
      category: "Practical Information",
      question: "Is there a dress code?",
      answer: "There is no strict dress code. Comfortable clothing and footwear are recommended. Qatar is a modern country, but modest dress is appreciated in public areas. Evening matches can be cooler, so consider bringing a light jacket."
    },
    {
      category: "Practical Information",
      question: "Can I bring food and drinks into the venue?",
      answer: "Outside food and beverages are not permitted. Stadiums offer a variety of food outlets and refreshment stands. Water bottles (sealed, under 500ml) may be allowed. Premium ticket holders have access to hospitality lounges."
    },
  ],
}

const YASARENA_FAQ: FAQContent = {
  subtitle: "Find answers to common questions about events at Etihad Arena.",
  items: [
    ...GENERIC_TICKETS_FAQ,
    {
      category: "Venue Information",
      question: "Where is Etihad Arena located?",
      answer: "Etihad Arena is located on Yas Island, Abu Dhabi, UAE. It is easily accessible from Abu Dhabi city center (30 minutes) and Abu Dhabi International Airport (15 minutes)."
    },
    {
      category: "Venue Information",
      question: "How do I get to Etihad Arena?",
      answer: "By Car: Yas Island is directly accessible from the main highway. By Taxi/Ride-share: Uber and Careem are widely available. Parking is available on-site. Some events offer complimentary shuttle buses from key locations."
    },
    {
      category: "Venue Information",
      question: "What facilities are available at Etihad Arena?",
      answer: "Etihad Arena is a state-of-the-art multi-purpose venue with a capacity of up to 18,000. It features premium seating options, food and beverage outlets, accessible facilities, and free WiFi throughout."
    },
    {
      category: "Practical Information",
      question: "Is there a dress code?",
      answer: "Dress codes vary by event. Generally, smart casual is appropriate. Some premium experiences may have specific requirements. Check the event details for any specific dress code information."
    },
  ],
}

const FAQ_DATA: Record<string, FAQContent> = {
  tennis: TENNIS_FAQ,
  finalissima: FINALISSIMA_FAQ,
  yasarena: YASARENA_FAQ,
}

const DEFAULT_FAQ: FAQContent = {
  subtitle: "Find answers to common questions about our ticket services.",
  items: GENERIC_TICKETS_FAQ,
}

export function getFAQContent(siteCode: string): FAQContent {
  return FAQ_DATA[siteCode] || DEFAULT_FAQ
}
