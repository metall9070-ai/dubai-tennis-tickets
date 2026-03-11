'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteConfig } from '@/lib/site-config';

export default function PaymentClient() {
  const router = useRouter();
  const config = getSiteConfig();
  const hasTopDisclaimer = !!config.topDisclaimer;
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
              currentPage="Payment & Delivery"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-12 leading-tight">
            Payment and <span className="text-[var(--color-primary)]">Delivery</span>
          </h1>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-12">

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">1. Payment</h2>
              <p className="mb-6">
                Payment for tickets is made online after placing an order on the website.
              </p>

              <div className="space-y-8 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">1.1. Payment by Bank Card</h3>
                  <p className="mb-4">1.1.1. We accept major international bank cards including Visa and Mastercard.</p>
                  <p className="mb-4">1.1.2. Payment is processed on the bank&apos;s secure payment page. To complete the payment, the buyer must enter the following card details:</p>
                  <ul className="list-none space-y-1 mb-4 pl-4 text-[16px]">
                    <li>— card number</li>
                    <li>— card expiration date</li>
                    <li>— cardholder&apos;s name (in Latin letters exactly as shown on the card)</li>
                    <li>— security code CVC2 / CVV2</li>
                  </ul>
                  <p className="mb-4">1.1.3. After entering the card details the buyer must click the &quot;Pay&quot; button.</p>
                  <p className="mb-4">1.1.4. For additional payment security <strong>3D Secure technology</strong> is used. If this technology is supported by the issuing bank, the buyer will be redirected to the bank&apos;s website to confirm the transaction.</p>
                  <p className="mb-4">1.1.5. Payment processing and data protection comply with the international <strong>PCI DSS security standard</strong>.</p>
                  <p className="mb-4">1.1.6. After successful payment a payment confirmation and order details will be sent to the email address provided during checkout.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">1.2. Corporate Payments</h3>
                  <p className="mb-4">1.2.1. Special payment terms may be available for legal entities and corporate clients.</p>
                  <p className="mb-4">1.2.2. To receive an invoice and coordinate payment terms the buyer must send the company&apos;s legal and banking details to the following email address: <a href={`mailto:${config.supportEmail}`} className="font-semibold text-[var(--color-primary)] hover:underline">{config.supportEmail}</a></p>
                  <p className="mb-4">1.2.3. After receiving the details a company representative will contact the buyer to coordinate payment terms and next steps.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. Ticket Delivery</h2>
              <p className="mb-6">
                The method and format of ticket delivery depend on the ticket type and the distribution policies established by the event organizer or official ticketing platform.
              </p>
              <p className="mb-6 italic text-[#636366]">
                For many major events mobile tickets are released by the event organizer only shortly before the event date. In such cases ticket delivery may occur closer to the event date. The company guarantees that tickets or instructions for obtaining them will be delivered to the buyer before the start of the event.
              </p>

              <div className="space-y-8 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">2.1. Electronic Tickets (PDF)</h3>
                  <p className="mb-2">2.1.1. Electronic tickets in PDF format are sent to the email address specified by the buyer during checkout.</p>
                  <p className="mb-4">2.1.2. Delivery timing depends on the conditions of the specific event, payment confirmation, and ticket release timing by the organizer or official ticket provider.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">2.2. Mobile Tickets</h3>
                  <p className="mb-2">2.2.1. Mobile tickets are digital tickets that are delivered through official ticketing systems or platforms used by the event organizer.</p>
                  <p className="mb-2">2.2.2. Mobile tickets may be transferred electronically from one account to another through the official website or mobile application of the ticket operator.</p>
                  <p className="mb-2">2.2.3. To receive mobile tickets the buyer may be required to create an account with the official ticket provider or install the relevant mobile application.</p>
                  <p className="mb-4">2.2.4. In some cases the buyer must accept the ticket transfer through the ticket operator&apos;s system by following the instructions sent via email.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Important Information</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>3.1. The buyer is responsible for providing a valid and correct email address when placing an order.</p>
                <p>3.2. The company is not responsible for ticket delivery issues caused by incorrect contact information provided by the buyer.</p>
                <p>3.3. If the ticket email or delivery instructions are not visible in the inbox the buyer is advised to check spam or junk mail folders.</p>
                <p>3.4. Ticket delivery is considered completed once tickets or transfer instructions have been sent to the buyer&apos;s email address.</p>
                <p>3.5. The buyer is responsible for the safekeeping of the received tickets and for any transfer of tickets to third parties after delivery.</p>
                <p>3.6. The company reserves the right to request additional verification information if a transaction is flagged by the payment security system.</p>
                <p>3.7. The company reserves the right to cancel an order and issue a refund if tickets cannot be obtained from suppliers or if the transaction is suspected to be fraudulent.</p>
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
