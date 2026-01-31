'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function TermsClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <div className="mb-12">
            <Breadcrumbs
              items={breadcrumbItems}
              currentPage="Terms of Service"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-12 leading-tight">
            Terms of <span className="text-[#1e824c]">Service</span>
          </h1>

          {/* Introductory block */}
          <div className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5 mb-12">
            <p className="text-[17px] font-semibold text-[#1e824c] italic">
              (Public Offer for Agency Services)
            </p>
          </div>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-12">

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">1. Terms and Definitions</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p><strong>Offer / Terms</strong> — this public offer made by Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) (hereinafter referred to as the "Agent") to any individual or legal entity to enter into an agency services agreement under the terms set forth herein.</p>
                <p><strong>Website</strong> — the website located at dubaitennis.com, owned and operated by the Agent.</p>
                <p><strong>Agent</strong> — Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC), providing paid agency services related to searching, selecting, reserving, purchasing, and delivering tickets, acting in its own name but at the expense of the Client.</p>
                <p><strong>Client / Customer</strong> — any individual or legal entity that accepts these Terms by placing and paying for an order.</p>
                <p><strong>Acceptance</strong> — full and unconditional acceptance of these Terms by the Client, confirmed by payment.</p>
                <p><strong>Ticket</strong> — an electronic or physical ticket issued by the event organizer or its authorized ticketing system, granting the right to attend an event.</p>
                <p><strong>Order</strong> — a request submitted by the Client via the Website for the Agent's services.</p>
                <p><strong>Event Organizer</strong> — a third party responsible for organizing and conducting the event and issuing tickets.</p>
                <p><strong>Secondary Market</strong> — a ticket resale market where ticket prices may exceed face value.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. General Provisions</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>2.1. These Terms govern all contractual relations between the Agent and the Client.</p>
                <p>2.2. Browsing the Website and reviewing information is free of charge.</p>
                <p>2.3. The Agent is not the event organizer, does not provide event production services, and is not affiliated with event organizers, unless expressly stated otherwise.</p>
                <p>2.4. The Client acknowledges and agrees that tickets are sold on the secondary market and that their price may exceed face value.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Subject of the Agreement</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>3.1. Upon the Client's request, the Agent provides paid agency services related to searching, selecting, reserving, purchasing, and delivering tickets.</p>
                <p>3.2. All services are provided on behalf of and at the expense of the Client.</p>
                <p>3.3. The ticket price displayed on the Website includes: the ticket acquisition cost; the Agent's service fee; operational and service-related expenses.</p>
                <p>3.4. The Agent reserves the right to amend these Terms at any time. The version in effect at the time of payment shall apply.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">4. Formation of the Agreement</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>4.1. The agreement is deemed concluded at the moment the Client completes payment for the order.</p>
                <p>4.2. Payment constitutes full and unconditional Acceptance of these Terms.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">5. Service Performance</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>5.1. Orders are placed by the Client by completing the relevant forms on the Website.</p>
                <p>5.2. Services may include: ticket search and selection; seat recommendations; automated or manual booking; order processing; ticket delivery; notifications regarding event postponement or cancellation.</p>
                <p>5.3. Services are deemed fully rendered upon delivery of the ticket to the Client.</p>
                <p>5.4. Tickets are primarily delivered in electronic format.</p>
                <p>5.5. The Agent may cancel an order and issue a refund in cases of suspected fraud, unauthorized use of payment data, or violations of applicable legal requirements.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">6. Pricing and Payment</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>6.1. All prices are indicated in U.S. dollars or another currency specified on the Website.</p>
                <p>6.2. The Client agrees to pay the full cost of the services.</p>
                <p>6.3. Available payment methods are listed on the Website.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">7. Ticket Delivery</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>7.1. The delivery method depends on the ticket format and availability.</p>
                <p>7.2. The Client is responsible for providing accurate contact and delivery information.</p>
                <p>7.3. The Agent is not liable for delivery issues caused by incorrect Client data.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">8. Order Cancellation and Refund Policy</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>8.1. All sales are final, except as required by applicable law.</p>
                <p>8.2. Refunds are available only if the event is fully canceled and not rescheduled.</p>
                <p>8.3. If an event is rescheduled, tickets remain valid for the new date and refunds are not provided.</p>
                <p>8.4. In the event of a refund, the Agent may retain up to 10% of the service cost as compensation for services already rendered (including search, booking, processing, and ticket delivery).</p>
                <p>8.5. Refunds are not provided in the following cases: change of the Client's personal plans; illness, travel issues, or other personal circumstances; partial changes to the event program; lost, damaged, or unused tickets.</p>
                <p>8.6. Official and reliable information regarding event cancellation, postponement, or changes is determined solely by the Event Organizer.</p>
                <p>8.7. For any questions related to ticket refunds or payments, the Client must contact the Agent via email at: <span className="font-semibold text-[#1e824c]">support@dubaitennistickets.com</span></p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">9. Rights and Obligations of the Parties</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>9.1. Agent's Rights: The Agent has the right to substitute tickets with equivalent or higher-category tickets; refuse to provide services in cases of suspected fraud; rely on information provided by the Event Organizer.</p>
                <p>9.2. Client's Obligations: The Client agrees to review venue and event rules prior to purchase; provide accurate personal and payment information; ensure the safekeeping of tickets after delivery.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">10. Limitation of Liability</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>10.1. The Agent's liability is limited to the amount paid by the Client for the services.</p>
                <p>10.2. The Agent is not responsible for: the content or quality of the event; actions or omissions of the Event Organizer; denied entry due to venue rules; the Client's subjective expectations.</p>
                <p>10.3. The Agent provides no warranties beyond those expressly required by applicable law.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">11. Force Majeure</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>The parties shall not be liable for failure to perform obligations caused by force majeure events, including natural disasters, government actions, system failures, or decisions of the Event Organizer.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">12. Governing Law</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>12.1. These Terms shall be governed by and construed in accordance with applicable law, taking into account the nature of the legal relationship and without application of conflict-of-law rules.</p>
              </div>
            </section>

            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">13. Term</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>13.1. This Agreement enters into force upon Acceptance and remains valid until all obligations of the parties have been fully performed.</p>
              </div>
            </section>

          </article>

          <div className="mt-16 pt-12 border-t border-[#f5f5f7] text-center">
            <button
              onClick={() => router.push('/')}
              className="px-10 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-all transform active:scale-95 shadow-xl shadow-[#1e824c]/20"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
