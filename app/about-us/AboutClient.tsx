'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteConfig } from '@/lib/site-config';

export default function AboutClient() {
  const router = useRouter();
  const config = getSiteConfig();
  const hasTopDisclaimer = !!config.topDisclaimer;
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar />

      <main className={`flex-1 ${hasTopDisclaimer ? 'pt-[80px] sm:pt-[88px] md:pt-[96px]' : 'pt-24 sm:pt-28 md:pt-32'} pb-12 md:pb-20`}>
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <div className="pt-4 mb-2">
            <Breadcrumbs
              items={breadcrumbItems}
              currentPage="About Us"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold tracking-tight text-[#1d1d1f] mb-8 sm:mb-10 md:mb-12 leading-tight">
            About <span className="text-[var(--color-primary)]">Us</span>
          </h1>

          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-8 md:space-y-12">

            {/* About Us Content */}
            <section>
              <p className="text-[16px] md:text-[18px] mb-4">
                {config.brand} is a professional ticket concierge service specializing in premium access to sports and entertainment events.
              </p>
              <p className="text-[16px] md:text-[18px] mb-4">
                We provide a full range of services related to events, including ticket selection and booking, personalized recommendations, delivery coordination, and comprehensive event information support. Our goal is to make the process of attending an event simple, transparent, and comfortable for our clients.
              </p>
              <p className="text-[16px] md:text-[18px] mb-4">
                We work with both individual clients and corporate customers, assisting in finding optimal options based on preferences, availability, and budget. From initial inquiry to event attendance, we accompany our clients at every stage, ensuring clarity, reliability, and timely communication.
              </p>
              <p className="text-[16px] md:text-[18px]">
                {config.brand} is focused on delivering a high-quality service experience, helping clients save time and confidently plan their visit to major events.
              </p>
            </section>

            {/* What We Do */}
            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">What We Do</h2>
              <div className="pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p className="text-[16px] md:text-[18px] mb-4">Our services include:</p>
                <ul className="list-disc pl-6 space-y-2 text-[16px] md:text-[18px]">
                  <li>ticket sourcing and booking</li>
                  <li>premium and hard-to-find ticket access</li>
                  <li>personalized ticket recommendations</li>
                  <li>ticket transfer coordination</li>
                  <li>support before and after purchase</li>
                </ul>
              </div>
            </section>

            {/* Contact Section */}
            <section className="pt-8 md:pt-12 border-t border-[#f5f5f7]">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6 md:mb-8">Contact Our Concierge Team</h2>
              <p className="text-[16px] md:text-[18px] mb-6">
                Our concierge team is available to assist you with ticket requests, event information, and order support.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Business Hours</h2>
              <div className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/5 mb-4">
                <p className="text-[15px] md:text-[17px] font-semibold text-[#1d1d1f] mb-2 italic">
                  Monday to Sunday
                </p>
                <p className="text-xl md:text-[24px] font-bold text-[var(--color-primary)]">
                  24/7
                </p>
              </div>
              <p className="text-[13px] md:text-[15px] text-[#636366] font-medium pl-4 border-l-2 border-[var(--color-primary)]/20">
                Our concierge team is available around the clock to assist you.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Response Time</h2>
              <div className="pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p className="text-[16px] md:text-[18px]">
                  Our dedicated concierge team works around the clock. All requests are processed within <span className="font-bold text-[var(--color-primary)]">1 business day</span>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Direct Contact</h2>
              <div className="pl-4 border-l-2 border-[var(--color-primary)]/20">
                <p className="text-[16px] md:text-[18px] mb-2 md:mb-4">You can reach us directly via email:</p>
                <a
                  href={`mailto:${config.supportEmail}`}
                  className="text-lg md:text-[32px] font-bold text-[var(--color-primary)] hover:underline transition-all break-all"
                >
                  {config.supportEmail}
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Company Information</h2>
              <div className="pl-4 border-l-2 border-[var(--color-primary)]/20 space-y-2">
                <p className="text-[16px] md:text-[18px]"><span className="font-semibold">Legal Entity:</span> WORLD TICKETS 365 INC</p>
                <p className="text-[16px] md:text-[18px]"><span className="font-semibold">Address:</span> 7901 4th St N STE 300, St. Petersburg, FL 33702, United States</p>
              </div>
            </section>

            {/* Disclaimer */}
            {config.footer?.disclaimer && (
              <section className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/5">
                <p className="text-[13px] md:text-[14px] text-[#636366] leading-relaxed">
                  {config.footer.disclaimer}
                </p>
              </section>
            )}

            {/* Send a Message Form */}
            <section className="pt-8 md:pt-12 border-t border-[#f5f5f7]">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6 md:mb-8">Send a Message</h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <label className="text-[12px] md:text-[13px] font-medium text-[#636366] mb-1.5 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[12px] md:text-[13px] font-medium text-[#636366] mb-1.5 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="example@mail.com"
                        className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[12px] md:text-[13px] font-medium text-[#636366] mb-1.5 ml-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Ticket inquiry / Partnership / Feedback"
                      className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[12px] md:text-[13px] font-medium text-[#636366] mb-1.5 ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you today?"
                      className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[var(--color-primary)] transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-all transform active:scale-95 shadow-xl shadow-[var(--color-primary)]/20"
                  >
                    Submit Request
                  </button>
                </form>
              ) : (
                <div className="bg-[#f5f5f7] p-8 md:p-10 rounded-[24px] md:rounded-[32px] text-center border border-black/5 animate-fadeIn">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">Message Sent</h3>
                  <p className="text-[14px] md:text-[16px] text-[#636366]">Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              )}
            </section>

          </article>

          <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#f5f5f7] text-center">
            <button
              onClick={() => router.push('/')}
              className="w-full md:w-auto px-10 py-4 bg-[var(--color-primary)] text-white font-semibold rounded-full hover:bg-[var(--color-primary-hover)] transition-all transform active:scale-95 shadow-xl shadow-[var(--color-primary)]/20"
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
