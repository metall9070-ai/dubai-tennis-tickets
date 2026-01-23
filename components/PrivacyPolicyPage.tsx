import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface PrivacyPolicyPageProps {
  onHome: () => void;
  onTournament: () => void;
  onATPTickets: () => void;
  onWTATickets: () => void;
  onPaymentDelivery: () => void;
  onPrivacyPolicy: () => void;
  onTermsOfService: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
  onCart?: () => void;
  cartCount: number;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
}

const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({
  onHome,
  onTournament,
  onATPTickets,
  onWTATickets,
  onPaymentDelivery,
  onPrivacyPolicy,
  onTermsOfService,
  onContacts,
  onAboutUs,
  onCart,
  cartCount,
  onFAQ,
  onSeatingGuide,
  onVenue
}) => {
  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar
        isVisible={true}
        cartCount={cartCount}
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
        onCart={onCart}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
        onFAQ={onFAQ}
      />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">
          
          {/* Breadcrumbs */}
          <div className="mb-12">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/', onClick: onHome }
              ]}
              currentPage="Privacy Policy"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[40px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-6 leading-tight">
            Privacy <span className="text-[#1e824c]">Policy</span>
          </h1>
          <p className="text-[13px] text-[#86868b] font-medium mb-12 uppercase tracking-widest">Publication date: February 1, 2026</p>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-12">
            
            <section>
              <p className="mb-6">
                This Privacy Policy defines the procedures for collecting, using, storing, and protecting personal data of users and clients of the Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) service (hereinafter referred to as “we”, “our”, or “us”). Users and clients are individuals who use the Dubai Tennis Ticket Concierge website (hereinafter referred to as “you”, “your”, or the “Client”).
              </p>
              <div className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5 mb-8">
                <p className="text-[15px] font-semibold text-[#1e824c] mb-0 italic">
                  Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) operates as a secondary marketplace, providing services for the purchase, sale, and resale of tickets for various events. Ticket prices may exceed face value.
                </p>
              </div>
            </section>

            {/* Section 1 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">1. General Provisions</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>1.1. This Policy applies to all personal data provided by users when using the website, services, and other platforms of Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC), including the purchase and processing of tickets for events organized by third parties.</p>
                <p>1.2. This Policy also applies to information obtained through social networks, other online sources, as well as to personal data of third parties, including minors, if such data has been provided by the Client.</p>
                <p>1.3. By using the services of Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC), the Client confirms consent to the processing of their personal data, as well as the data of third parties, in accordance with this Policy and applicable laws of the United States of America.</p>
                <p>1.4. Use of the website and services indicates that the Client has reviewed this Privacy Policy and agrees to its terms in full.</p>
                <p>1.5. If the Client does not agree with any provisions of this Policy, they must refrain from using the website and services of Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC).</p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">2. Personal Data and Consent to Processing</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>2.1. In the course of providing services, we may collect and process personal data including, but not limited to, name, contact information, identity documents, and payment details.</p>
                <p>2.2. Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) is not responsible for how third-party websites or services, links to which may appear on our website, process personal data.</p>
                <p>2.3. We do not verify the accuracy of personal data provided and assume that the information submitted by the Client is accurate and up to date.</p>
                <p>2.4. The Client is responsible for ensuring the accuracy and relevance of their personal data.</p>
                <p>2.5. The Client bears all risks and consequences associated with providing inaccurate or outdated information.</p>
                <p>2.6. Providing any data beyond what is strictly required for service delivery constitutes voluntary consent to its processing.</p>
                <p>2.7. When providing personal data of third parties, the Client confirms that they have obtained the consent of those individuals.</p>
                <p>2.8. The Client may withdraw consent to the processing of personal data by submitting a written request. However, we may continue to store and process such data as required by law.</p>
                <p>2.9. Withdrawal of consent may affect our ability to continue providing services.</p>
                <p>2.10. Consent to the processing of personal data remains valid for the entire period during which the Client uses our services.</p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">3. Purposes of Personal Data Processing</h2>
              <p className="mb-6">Personal data is processed for the following purposes:</p>
              <ul className="list-disc pl-10 space-y-3 text-[16px] border-l-2 border-[#1e824c]/20 ml-1">
                <li>identifying Clients and fulfilling orders;</li>
                <li>providing services under contractual relationships;</li>
                <li>communicating with Clients;</li>
                <li>improving website functionality and services;</li>
                <li>conducting marketing and promotional activities;</li>
                <li>collecting anonymized statistical and analytical data;</li>
                <li>informing Clients about products, services, and special offers;</li>
                <li>processing payments and financial transactions;</li>
                <li>complying with applicable legal obligations.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">4. Data Processing and Disclosure to Third Parties</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>4.1. Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) processes personal data in accordance with U.S. law and applicable international standards.</p>
                <p>4.2. When handling payment data, PCI DSS security standards are observed.</p>
                <p>4.3. Personal data may be processed using automated and non-automated methods.</p>
                <p>4.4. Processing includes any actions involving personal data, including collection, storage, organization, use, transfer, and deletion.</p>
                <p>4.5. We ensure the confidentiality of personal data, except where disclosure is required by law or authorized by the Client.</p>
                <p>4.6. Clients may submit requests to update or delete their personal data.</p>
                <p>4.7. Personal data is retained only for as long as necessary to achieve processing purposes or to comply with legal requirements.</p>
                <p>4.8. Personal data may be disclosed to third parties in the following cases: to provide services to the Client; as required by U.S. law; in the event of business transfer or reorganization, provided this Policy is upheld; to protect the legal rights and interests of Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC); in anonymized form for analytical purposes.</p>
                <p>4.9. Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) does not store, sell, transfer, or lease cardholder data.</p>
                <p>4.10. Payment data is not transferred to third parties.</p>
                <p>4.11. We are not responsible for the privacy practices of external websites.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">5. Modification and Deletion of Personal Data</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>5.1. The Client may request the modification or deletion of personal data by contacting customer support.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">6. Cookies and Tracking Technologies</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>6.1. The website uses cookies and similar technologies for personalization, analytics, and advertising purposes.</p>
                <p>6.2. Clients may disable cookies through their browser settings.</p>
                <p>6.3. Disabling cookies may limit website functionality.</p>
                <p>6.4. Cookie settings and technical parameters may be changed without prior notice.</p>
                <p>6.5. Analytical tools may collect data on website usage and performance.</p>
              </div>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6">7. Data Security</h2>
              <div className="space-y-4 pl-4 border-l-2 border-[#1e824c]/20">
                <p>7.1. We apply reasonable technical and organizational measures to protect personal data.</p>
                <p>7.2. Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) is not responsible for data loss caused by the Client.</p>
                <p>7.3. The Client acknowledges that online data transmission always involves certain risks.</p>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-[#f5f5f7] p-8 rounded-[32px] border border-black/5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-6">8. Changes to the Privacy Policy</h2>
              <div className="space-y-4 font-medium text-[#1d1d1f]/80">
                <p>8.1. Dubai Tennis Ticket Concierge (WORLD TICKETS 365 INC) reserves the right to amend this Privacy Policy at any time.</p>
                <p>8.2. The updated version of the Policy becomes effective upon publication.</p>
                <p>8.3. Continued use of the website and services constitutes acceptance of the updated Policy.</p>
                <p>8.4. This Privacy Policy is governed by and interpreted in accordance with the laws of the United States of America.</p>
                <p>8.5. Clients are encouraged to periodically review this Privacy Policy.</p>
              </div>
            </section>

          </article>

          <div className="mt-16 pt-12 border-t border-[#f5f5f7] text-center">
            <button 
              onClick={onHome}
              className="px-10 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-all transform active:scale-95 shadow-xl shadow-[#1e824c]/20"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
      
      <Footer
        onHome={onHome}
        onTournament={onTournament}
        onATPTickets={onATPTickets}
        onWTATickets={onWTATickets}
        onPaymentDelivery={onPaymentDelivery}
        onPrivacyPolicy={onPrivacyPolicy}
        onTermsOfService={onTermsOfService}
        onContacts={onContacts}
        onAboutUs={onAboutUs}
        onFAQ={onFAQ}
        onSeatingGuide={onSeatingGuide}
        onVenue={onVenue}
      />
    </div>
  );
};

export default PrivacyPolicyPage;