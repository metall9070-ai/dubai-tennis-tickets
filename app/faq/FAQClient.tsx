'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

const faqData = [
  {
    question: 'When is Dubai Duty Free Tennis Championships 2026?',
    answer: 'The Dubai Duty Free Tennis Championships 2026 runs from February 15 to February 28, 2026. The WTA 1000 tournament runs from February 15-21, followed by the ATP 500 tournament from February 23-28.',
  },
  {
    question: 'Where is the tournament held?',
    answer: 'The tournament is held at the Dubai Duty Free Tennis Stadium, located at the Aviation Club Tennis Centre in Al Garhoud, Dubai, UAE. The stadium has a capacity of 5,000 spectators.',
  },
  {
    question: 'How much do tickets cost?',
    answer: 'Ticket prices range from $150 for early round Grandstand seats to $750 for Men\'s Finals Courtside. Women\'s Finals start at $500. VIP hospitality packages are available from $1,500.',
  },
  {
    question: 'How will I receive my tickets?',
    answer: 'Tickets are delivered electronically via email as mobile tickets or e-tickets. You will receive them within 24-48 hours of purchase, or immediately for last-minute bookings.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Refunds are available if the event is cancelled or significantly rescheduled. For voluntary cancellations, tickets may be resold through our platform up to 48 hours before the match.',
  },
  {
    question: 'What is the best seating?',
    answer: 'The best seats are Courtside (rows 1-5) offering player-level views. Prime seats (rows 6-15) provide optimal court angles. Grandstand sections offer excellent visibility at accessible prices.',
  },
  {
    question: 'Are you affiliated with the tournament?',
    answer: 'No, we are an independent ticket concierge service. We source tickets from the secondary market and guarantee their authenticity. We are not affiliated with Dubai Duty Free or the tournament organizers.',
  },
  {
    question: 'How do I get to the venue?',
    answer: 'Dubai Tennis Stadium is 10 minutes from Dubai International Airport. Access via Dubai Metro (GGICO station), taxi, or ride-share. Parking is available on-site.',
  },
];

export default function FAQClient() {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="FAQ" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#86868b] mt-4 max-w-2xl">
            Find answers to common questions about Dubai Tennis Championships tickets.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="space-y-4">
            {faqData.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border border-black/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#f5f5f7] transition-colors">
                  <span className="font-semibold text-[#1d1d1f] pr-4">{faq.question}</span>
                  <svg
                    className="w-5 h-5 text-[#86868b] group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-[#424245] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
