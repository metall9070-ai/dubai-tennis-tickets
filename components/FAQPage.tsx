import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Tickets & Pricing
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

  // Event Information
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

  // Venue & Seating
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
    answer: "Dubai Duty Free Tennis Stadium is an open-air venue with partial shade from the roof structure. February weather in Dubai is typically pleasant (20-25°C/68-77°F) but we recommend sunscreen and hats for day sessions. Evening sessions offer cooler temperatures."
  },
  {
    category: "Venue & Seating",
    question: "Are there facilities for disabled visitors?",
    answer: "Yes, the venue is fully accessible with wheelchair spaces, accessible restrooms, and elevator access. Please contact us when booking to arrange accessible seating and any special assistance requirements."
  },

  // Policies
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

  // Practical Information
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
  }
];

interface FAQPageProps {
  cartCount: number;
  onHome: () => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onCart: () => void;
  onVenue?: () => void;
  onSeatingGuide?: () => void;
  onFAQ?: () => void;
  onPaymentDelivery?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
}

const FAQPage: React.FC<FAQPageProps> = ({
  cartCount,
  onHome,
  onTournament,
  onATPTickets,
  onWTATickets,
  onCart,
  onVenue,
  onSeatingGuide,
  onFAQ,
  onPaymentDelivery,
  onPrivacyPolicy,
  onTermsOfService,
  onContacts,
  onAboutUs
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQ = activeCategory === "All"
    ? faqData
    : faqData.filter(item => item.category === activeCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar
        isVisible={true}
        cartCount={cartCount}
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onCart={onCart}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
        onFAQ={onFAQ}
      />

      {/* Breadcrumbs */}
      <div className="bg-white border-b border-[#d2d2d7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/', onClick: onHome }
            ]}
            currentPage="Frequently Asked Questions"
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px] text-center">
          <h1 className="text-[40px] md:text-[56px] font-bold tracking-tight text-[#1d1d1f] mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-[#86868b] max-w-2xl mx-auto">
            Common questions about our ticket concierge service,
            the venue, and your match day experience.
          </p>

          {/* Disclaimer */}
          <div className="mt-8 p-4 bg-[#f5f5f7] rounded-2xl max-w-2xl mx-auto">
            <p className="text-[13px] text-[#86868b] leading-relaxed">
              Dubai Tennis Ticket Concierge is an independent ticket concierge service. We are not affiliated with, endorsed by, or connected to Dubai Duty Free, the Dubai Duty Free Tennis Championships, or any event organizer. Ticket prices may exceed face value.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="bg-[#f5f5f7] py-6 sticky top-[60px] z-40 border-b border-[#d2d2d7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#1d1d1f] text-white'
                    : 'bg-white text-[#1d1d1f] hover:bg-[#e8e8ed]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#f5f5f7]/50 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <span className="text-[11px] font-bold text-[#1e824c] uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-semibold text-[#1d1d1f]">
                      {item.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full bg-[#f5f5f7] flex items-center justify-center transition-transform duration-300 ${openIndex === index ? 'rotate-45' : ''}`}>
                    <svg className="w-4 h-4 text-[#1d1d1f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                  <div className="px-6 pb-5 text-[#86868b] leading-relaxed">
                    {item.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px] text-center">
          <h2 className="text-[32px] font-bold text-[#1d1d1f] mb-4">
            Still Have Questions?
          </h2>
          <p className="text-lg text-[#86868b] mb-8 max-w-xl mx-auto">
            Our customer service team is available 24/7 to help you with any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@dubaitennistickets.com"
              className="px-8 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-colors"
            >
              Contact Support
            </a>
            <button
              onClick={onHome}
              className="px-8 py-4 bg-[#f5f5f7] text-[#1d1d1f] font-semibold rounded-full hover:bg-[#e8e8ed] transition-colors"
            >
              Browse Tickets
            </button>
          </div>
        </div>
      </section>

      {/* Internal Links Section */}
      <section className="py-12 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <h2 className="text-2xl font-bold text-[#1d1d1f] mb-6 text-center">
            Helpful Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={onSeatingGuide}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Seating Guide</h3>
              <p className="text-sm text-[#86868b]">View stadium layout and choose your perfect seats</p>
            </button>
            <button
              onClick={onVenue}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">Venue Information</h3>
              <p className="text-sm text-[#86868b]">Getting there, parking, and stadium facilities</p>
            </button>
            <button
              onClick={onATPTickets}
              className="p-6 bg-white rounded-2xl text-left hover:shadow-lg transition-shadow"
            >
              <h3 className="font-semibold text-[#1d1d1f] mb-2">ATP 500 Tickets</h3>
              <p className="text-sm text-[#86868b]">Men's tournament February 23-28</p>
            </button>
          </div>
        </div>
      </section>

      <Footer
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onFAQ={onFAQ}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
      />
    </div>
  );
};

export default FAQPage;
