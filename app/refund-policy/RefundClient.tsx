'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteConfig, getSiteUrl } from '@/lib/site-config';

export default function RefundClient() {
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
              currentPage="Refund Policy"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-12 leading-tight">
            Refund <span className="text-[var(--color-primary)]">Policy</span>
          </h1>

          {/* Introductory block */}
          <div className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5 mb-12">
            <p className="text-[15px] md:text-[17px] font-semibold text-[#1d1d1f] leading-relaxed">
              This Refund Policy describes the conditions under which refunds may be issued for orders placed on the website {siteUrl} operated by {config.brand} (WORLD TICKETS 365 INC).
            </p>
            <p className="text-[14px] md:text-[15px] text-[#636366] mt-3">
              By placing an order on the Website, the customer agrees to this Refund Policy.
            </p>
          </div>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-12">

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">1. General Rule</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p className="font-semibold">All sales are final.</p>
                <p>Because tickets are purchased or reserved specifically for each customer order through ticket suppliers and partners, orders cannot be cancelled after payment except in the cases described in this policy.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. Event Cancellation</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>Refunds may be issued only if an event is officially <strong>cancelled and not rescheduled</strong>.</p>
                <p>If an event is cancelled, customers may request a refund by contacting customer support.</p>
                <p>Refund requests must be submitted to: <a href={`mailto:${config.supportEmail}`} className="font-semibold text-[var(--color-primary)] hover:underline">{config.supportEmail}</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Event Postponement or Rescheduling</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>If an event is <strong>postponed or rescheduled</strong>, the tickets remain valid for the new event date.</p>
                <p>In such cases refunds are not provided.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">4. Non-Refundable Situations</h2>
              <div className="pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p className="mb-4">Refunds are not issued in the following situations:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>change of personal plans</li>
                  <li>illness or personal circumstances</li>
                  <li>travel problems or visa issues</li>
                  <li>inability to attend the event</li>
                  <li>unused tickets</li>
                  <li>loss or damage of tickets after delivery</li>
                  <li>partial changes in the event program</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">5. Service Fee</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>In cases where a refund is issued, the company may retain up to <strong>10% of the service cost</strong> to cover administrative, sourcing, and operational expenses related to the order.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">6. Ticket Delivery</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>Refunds are not issued once tickets have been successfully delivered to the customer, except in cases of event cancellation.</p>
                <p>Ticket delivery is considered completed once tickets or transfer instructions have been sent to the email address provided during checkout.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">7. Secondary Market Notice</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>Tickets may be sourced through partners and secondary market suppliers. Ticket prices may be above or below the original face value set by the event organizer.</p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">8. Contact Support Before Disputes</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>Customers agree to contact customer support to resolve any issue before initiating a payment dispute or chargeback with their bank.</p>
                <p>Our support team can be contacted at: <a href={`mailto:${config.supportEmail}`} className="font-semibold text-[var(--color-primary)] hover:underline">{config.supportEmail}</a></p>
              </div>
            </section>

            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">9. Organizer Decisions</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>The company is not responsible for decisions made by the event organizer, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>cancellation</li>
                  <li>postponement</li>
                  <li>venue change</li>
                  <li>changes to the event program</li>
                </ul>
                <p className="mt-4">Official information about event status is determined solely by the event organizer.</p>
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
