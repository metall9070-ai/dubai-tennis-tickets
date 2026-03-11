'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteConfig, getSiteUrl } from '@/lib/site-config';

export default function TermsClient() {
  const router = useRouter();
  const config = getSiteConfig();
  const hasTopDisclaimer = !!config.topDisclaimer;
  const siteUrl = getSiteUrl();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar />

      <main className={`flex-1 ${hasTopDisclaimer ? 'pt-24' : 'pt-16'} pb-12 md:pb-20`}>
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
            Terms of <span className="text-[var(--color-primary)]">Service</span>
          </h1>

          {/* Introductory block */}
          <div className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5 mb-12">
            <p className="text-[17px] font-semibold text-[var(--color-primary)] italic">
              (Public Offer for Agency Services)
            </p>
          </div>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-12">

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">1. Terms and Definitions</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p><strong>Offer / Terms</strong> — this public offer published by {config.brand} (WORLD TICKETS 365 INC) (hereinafter referred to as the &quot;Agent&quot;), addressed to any individual or legal entity for the conclusion of an agency services agreement under the terms set forth in this document.</p>
                <p><strong>Website</strong> — the website located at {siteUrl} and operated by the Agent.</p>
                <p><strong>Agent</strong> — {config.brand} (WORLD TICKETS 365 INC), providing paid agency services related to searching, selecting, reserving, purchasing, and delivering tickets.</p>
                <p><strong>Client / Customer</strong> — any individual or legal entity that accepts these Terms by placing and paying for an order.</p>
                <p><strong>Acceptance</strong> — full and unconditional acceptance of these Terms by the Client, confirmed by payment of the order.</p>
                <p><strong>Ticket</strong> — an electronic or physical ticket granting the right to attend an event.</p>
                <p><strong>Event Organizer</strong> — a third party responsible for organizing and conducting the event.</p>
                <p><strong>Secondary Market</strong> — a ticket resale market where ticket prices may differ from their original face value.</p>
                <p><strong>Ticket Concierge Service</strong> — a service for sourcing and acquiring tickets through a network of partners and suppliers, including official ticket platforms and participants of the secondary ticket market.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. General Provisions</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>2.1. These Terms govern the relationship between the Agent and the Client.</p>
                <p>2.2. Browsing the Website and reviewing information is free of charge.</p>
                <p>2.3. The Agent is not the event organizer and is not affiliated with event organizers unless explicitly stated otherwise.</p>
                <p>2.4. The Agent provides services as an independent ticket concierge service that sources and purchases tickets through partner supplier networks.</p>
                <p>2.5. By placing an order, the Client acknowledges and agrees that tickets may be sourced from the secondary market.</p>
                <p>2.6. The Client understands and accepts that ticket prices may be above or below their original face value set by the event organizer.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Subject of the Agreement</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>3.1. At the Client&apos;s request, the Agent provides services related to searching, selecting, reserving, purchasing, and delivering tickets.</p>
                <p>3.2. Services are provided on behalf of and at the expense of the Client.</p>
                <p>3.3. The ticket price may include: the ticket acquisition cost; the Agent&apos;s service fee; operational and service expenses.</p>
                <p>3.4. The Agent does not guarantee the availability of specific seats or ticket categories until the order is finally confirmed by the ticket supplier.</p>
                <p>3.5. The Agent reserves the right to amend these Terms. The version of the Terms in effect at the time of order payment shall apply.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">4. Formation of the Agreement</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>4.1. The agreement is considered concluded at the moment the Client completes payment for the order.</p>
                <p>4.2. Payment constitutes full and unconditional Acceptance of these Terms.</p>
                <p>4.3. By placing an order, the Client confirms that they have reviewed the ticket delivery conditions, refund rules, and the specifics of purchasing tickets on the secondary market.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">5. Service Performance</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>5.1. Orders are placed through the forms available on the Website.</p>
                <p>5.2. Services may include: ticket search and selection; seating recommendations; reservation and booking; order processing; ticket delivery; notifications about event changes.</p>
                <p>5.3. Services are considered rendered once tickets are delivered to the Client.</p>
                <p>5.4. In some cases tickets may be transferred to the Client through official ticketing systems via electronic ticket transfer between accounts.</p>
                <p>5.5. Seat locations within the venue may differ from the originally listed seats provided that the ticket category remains equivalent or of higher value.</p>
                <p>5.6. The Agent may cancel an order and issue a refund in cases of suspected fraud or use of stolen payment data.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">6. Pricing and Payment</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>6.1. All prices are indicated in U.S. dollars or another currency specified on the Website.</p>
                <p>6.2. The Client agrees to pay the full cost of the services.</p>
                <p>6.3. Available payment methods are listed on the Website.</p>
                <p>6.4. The Client agrees that the order price may include service fees and the Agent&apos;s commission.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">7. Ticket Delivery</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>7.1. The delivery method depends on the ticket type.</p>
                <p>7.2. The Client is responsible for providing accurate contact information.</p>
                <p>7.3. The Agent is not responsible for delivery issues caused by incorrect Client data.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">8. Order Cancellation and Refunds</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>8.1. All sales are final.</p>
                <p>8.2. Refunds are available only if the event is completely cancelled and not rescheduled.</p>
                <p>8.3. If an event is rescheduled, tickets remain valid for the new date.</p>
                <p>8.4. The Agent may retain up to 10% of the service cost when issuing a refund.</p>
                <p>8.5. Refunds are not provided in cases of: change of the Client&apos;s personal plans; illness; travel issues; unused tickets.</p>
                <p>8.6. The Agent is not responsible for decisions of the event organizer including cancellation, postponement, program changes, or changes in participating performers.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">9. Rights and Obligations of the Parties</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>9.1. The Agent has the right to: substitute tickets with equivalent or higher-category tickets; refuse service in cases of suspected fraud; rely on information provided by the event organizer.</p>
                <p>9.2. The Client agrees to: review venue and event rules; provide accurate personal information; ensure the safekeeping of tickets.</p>
                <p>9.3. The Client agrees to contact customer support before initiating any payment dispute or chargeback with their bank.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">10. Limitation of Liability</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>10.1. The Agent&apos;s liability is limited to the amount paid by the Client for the services.</p>
                <p>10.2. The Agent is not responsible for: the content or quality of the event; actions of the event organizer; denied entry due to venue rules; the Client&apos;s subjective expectations.</p>
                <p>10.3. The Agent is not liable for indirect losses including travel expenses, accommodation costs, or other related expenses.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">11. Force Majeure</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>The parties shall not be liable for failure to perform obligations caused by force majeure events.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">12. Governing Law</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>12.1. These Terms are governed by applicable law.</p>
                <p>12.2. Disputes should be resolved through negotiations where possible.</p>
              </div>
            </section>

            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">13. Term</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>13.1. This Agreement enters into force upon Acceptance and remains valid until all obligations of the parties have been fulfilled.</p>
              </div>
            </section>

          </article>

          <div className="mt-16 pt-12 border-t border-[#f5f5f7] text-center">
            <button
              onClick={() => router.push('/')}
              className="px-10 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-all transform active:scale-95 shadow-xl shadow-[var(--color-primary)]/20"
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
