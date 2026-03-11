'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteConfig, getSiteUrl } from '@/lib/site-config';

export default function PrivacyClient() {
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
              currentPage="Privacy Policy"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-6 leading-tight">
            Privacy <span className="text-[var(--color-primary)]">Policy</span>
          </h1>
          <p className="text-[13px] text-[#636366] font-medium mb-12 uppercase tracking-widest">Version 1.1 — March 11, 2026</p>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-12">

            <section>
              <p className="mb-6">
                This Privacy Policy describes how personal data of users and customers of the {config.brand} (WORLD TICKETS 365 INC) service is collected, used, stored, and protected (hereinafter referred to as &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;). Users and customers are individuals who use the website {siteUrl} (hereinafter referred to as &quot;you&quot;, &quot;your&quot;, or the &quot;Client&quot;).
              </p>
              <div className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5 mb-8">
                <p className="text-[15px] font-semibold text-[var(--color-primary)] mb-0 italic">
                  {config.brand} (WORLD TICKETS 365 INC) operates as a ticket concierge and ticket sourcing service through a network of suppliers and partners. Tickets may be obtained from official platforms or secondary market providers. Ticket prices may differ from the original face value.
                </p>
              </div>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">1. General Provisions</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>1.1. This Policy applies to all personal data provided by users when using the website, services, and other platforms of {config.brand} (WORLD TICKETS 365 INC), including the purchase and processing of tickets for events organized by third parties.</p>
                <p>1.2. This Policy also applies to information obtained through social networks and other online sources.</p>
                <p className="italic text-[#636366]">This website is intended for use by adults. If the Client provides personal data of third parties, including minors, the Client confirms that they have the legal authority and consent of those individuals to provide such information.</p>
                <p>1.3. By using the services of {config.brand} (WORLD TICKETS 365 INC), the Client confirms consent to the processing of personal data in accordance with this Policy and applicable laws of the United States of America.</p>
                <p>1.4. Use of the website and services indicates that the Client has reviewed this Privacy Policy and agrees to its terms in full.</p>
                <p>1.5. If the Client does not agree with any provisions of this Policy, they must refrain from using the website and services of {config.brand} (WORLD TICKETS 365 INC).</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. Personal Data and Consent to Processing</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>2.1. In the course of providing services, we may collect and process personal data including, but not limited to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>name and surname</li>
                  <li>contact information</li>
                  <li>identity documents</li>
                  <li>payment details</li>
                </ul>
                <p>2.2. {config.brand} (WORLD TICKETS 365 INC) is not responsible for how third-party websites process personal data if links to such websites appear on our website.</p>
                <p>2.3. We do not verify the accuracy of personal data provided and assume that the information submitted by the Client is accurate and up to date.</p>
                <p>2.4. The Client is responsible for ensuring the accuracy and relevance of their personal data.</p>
                <p>2.5. The Client bears all risks and consequences associated with providing inaccurate or outdated information.</p>
                <p>2.6. Providing any data beyond what is strictly required for service delivery constitutes voluntary consent to its processing.</p>
                <p>2.7. When providing personal data of third parties, the Client confirms that they have obtained consent from those individuals.</p>
                <p>2.8. The Client may withdraw consent to the processing of personal data by submitting a written request.</p>
                <p>2.9. Withdrawal of consent may affect our ability to continue providing services.</p>
                <p>2.10. Consent to the processing of personal data remains valid for the entire period during which the Client uses our services.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Purposes of Personal Data Processing</h2>
              <p className="mb-6">Personal data is processed for the following purposes:</p>
              <ul className="list-disc pl-10 space-y-3 text-[16px] border-l-2 border-[var(--color-primary)]/20 ml-1">
                <li>identifying clients and fulfilling orders</li>
                <li>providing services</li>
                <li>communicating with clients</li>
                <li>improving website functionality</li>
                <li>sending service notifications and, where permitted by law, marketing communications</li>
                <li>collecting anonymized statistical data</li>
                <li>informing clients about products, services, and special offers</li>
                <li>processing payments</li>
                <li>complying with legal obligations</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">4. Data Processing and Disclosure to Third Parties</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>4.1. {config.brand} (WORLD TICKETS 365 INC) processes personal data in accordance with U.S. law and applicable international standards.</p>
                <p>4.2. When handling payment data, PCI DSS security standards are observed.</p>
                <p>4.3. Personal data may be processed using automated and non-automated methods.</p>
                <p>4.4. Processing includes collection, storage, organization, use, transfer, and deletion of data.</p>
                <p>4.5. We ensure the confidentiality of personal data except where disclosure is required by law.</p>
                <p>4.6. Clients may submit requests to update or delete their personal data.</p>
                <p>4.7. Personal data is retained only for as long as necessary to achieve the purposes of processing or to comply with legal requirements.</p>
                <p>4.8. Personal data may be processed and stored in the United States or in other jurisdictions where our service providers operate.</p>
                <p>4.9. {config.brand} (WORLD TICKETS 365 INC) does not store, sell, or lease cardholder data.</p>
                <p>4.10. Payment card data is not transferred to third parties.</p>
                <p>4.11. We are not responsible for the privacy practices of external websites.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">5. Modification and Deletion of Personal Data</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>5.1. The Client may request modification or deletion of personal data by contacting customer support.</p>
                <p>Requests related to personal data processing can be sent to: <a href={`mailto:${config.supportEmail}`} className="font-semibold text-[var(--color-primary)] hover:underline">{config.supportEmail}</a></p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">6. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>6.1. The website uses cookies and similar technologies for personalization, analytics, and improving website functionality.</p>
                <p className="italic text-[#636366]">We may use third-party analytics services such as Google Analytics to analyze website usage and improve our services.</p>
                <p>6.2. Clients may disable cookies through their browser settings.</p>
                <p>6.3. Disabling cookies may limit website functionality.</p>
                <p>6.4. Cookie settings may change without prior notice.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">7. Data Security</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p>7.1. We apply reasonable technical and organizational measures to protect personal data.</p>
                <p>7.2. {config.brand} (WORLD TICKETS 365 INC) is not responsible for data loss caused by the Client.</p>
                <p>7.3. The Client acknowledges that data transmission over the internet always involves certain risks.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">8. Changes to the Privacy Policy</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>8.1. {config.brand} (WORLD TICKETS 365 INC) reserves the right to amend this Privacy Policy at any time.</p>
                <p>8.2. The updated version of the Policy becomes effective upon publication.</p>
                <p>8.3. Continued use of the website and services constitutes acceptance of the updated Policy.</p>
                <p>8.4. This Privacy Policy is governed by the laws of the United States of America.</p>
                <p>8.5. Clients are encouraged to periodically review this Privacy Policy.</p>
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
