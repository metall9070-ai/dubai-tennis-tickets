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
                Ticket payment is made online after placing an order on the website.
              </p>

              <div className="space-y-8 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">1.1. Payment by Bank Card</h3>
                  <p className="mb-4">1.1.1. We accept the following bank cards: VISA, Mastercard, Maestro, Visa Electron.</p>
                  <p className="mb-4">1.1.2. Payment is processed on the bank's secure payment page. To complete the payment, the buyer must enter the following card details:</p>
                  <ul className="list-none space-y-1 mb-4 pl-4 text-[16px]">
                    <li>a) card number;</li>
                    <li>b) card expiration date;</li>
                    <li>c) cardholder's name (in Latin letters, exactly as shown on the card);</li>
                    <li>d) security code CVC2 / CVV2.</li>
                  </ul>
                  <p className="mb-4">1.1.3. After entering the details, the buyer must click the "Pay" button.</p>
                  <p className="mb-4">1.1.4. For additional payment security, 3D Secure technology is used. If this technology is supported by the issuing bank, the buyer will be redirected to the bank's website to confirm the transaction.</p>
                  <p className="mb-4">1.1.5. Payment processing and data security comply with the international PCI DSS standard.</p>
                  <p className="mb-4">1.1.6. After successful payment, a payment confirmation is sent to the email address specified during checkout.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">1.2. Contactless Payment for Legal Entities</h3>
                  <p className="mb-4">1.2.1. Special payment terms are available for legal entities and corporate clients.</p>
                  <p className="mb-4">1.2.2. To conclude an agreement and receive an invoice, the buyer must send the company's banking and legal details to the following email address: <span className="font-semibold text-[var(--color-primary)]">{config.supportEmail}</span></p>
                  <p className="mb-4">1.2.3. After receiving the details, a manager will contact the buyer to coordinate payment terms and next steps.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. Ticket Delivery</h2>
              <p className="mb-6">2.1. The method of ticket delivery depends on the ticket format and is determined at the time of purchase.</p>

              <div className="space-y-8 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">2.1. Electronic Tickets (PDF)</h3>
                  <p className="mb-2">2.1.1. Electronic tickets in PDF format are sent to the email address specified during checkout.</p>
                  <p className="mb-4">2.1.2. The delivery time depends on the event conditions and payment confirmation.</p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-[#1d1d1f] mb-4">2.2. Mobile Tickets</h3>
                  <p className="mb-2">2.2.1. Mobile tickets are a separate ticket format.</p>
                  <p className="mb-4">2.2.2. Mobile tickets are delivered electronically by transferring them from one account to another via the website or mobile application of a ticket operator or an official ticket seller.</p>
                </div>
              </div>
            </section>

            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Important Information</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>3.1. The buyer is responsible for the safekeeping of the received tickets.</p>
                <p>3.2. Transferring tickets to third parties is not recommended, as this may result in loss of access or inability to use the tickets.</p>
                <p>3.3. The buyer is responsible for the accuracy of the information provided when placing an order.</p>
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
