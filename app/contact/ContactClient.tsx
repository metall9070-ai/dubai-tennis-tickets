'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <div className="mb-8 md:mb-12">
            <Breadcrumbs
              items={breadcrumbItems}
              currentPage="Contact Us"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[32px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-8 md:mb-12 leading-tight">
            Get in <span className="text-[#1e824c]">Touch</span>
          </h1>

          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-8 md:space-y-12">

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Business Hours</h2>
              <div className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/5 mb-4">
                <p className="text-[15px] md:text-[17px] font-semibold text-[#1d1d1f] mb-2 italic">
                  Monday to Sunday
                </p>
                <p className="text-xl md:text-[24px] font-bold text-[#1e824c]">
                  10:00 AM – 8:00 PM
                </p>
              </div>
              <p className="text-[13px] md:text-[15px] text-[#86868b] font-medium pl-4 border-l-2 border-[#1e824c]/20">
                We operate seven days a week to ensure you never miss a match.
              </p>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Response Time</h2>
              <div className="pl-4 border-l-2 border-[#1e824c]/20">
                <p className="text-[16px] md:text-[18px]">
                  Our dedicated concierge team works around the clock. All requests are processed within <span className="font-bold text-[#1e824c]">1 business day</span>.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Direct Contact</h2>
              <div className="pl-4 border-l-2 border-[#1e824c]/20">
                <p className="text-[16px] md:text-[18px] mb-2 md:mb-4">You can reach us directly via email:</p>
                <a
                  href="mailto:support@dubaitennistickets.com"
                  className="text-lg md:text-[32px] font-bold text-[#1e824c] hover:underline transition-all break-all"
                >
                  support@dubaitennistickets.com
                </a>
              </div>
            </section>

            <section>
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Company Information</h2>
              <div className="pl-4 border-l-2 border-[#1e824c]/20 space-y-2">
                <p className="text-[16px] md:text-[18px]"><span className="font-semibold">Legal Entity:</span> WORLD TICKETS 365 INC</p>
                <p className="text-[16px] md:text-[18px]"><span className="font-semibold">Address:</span> 7901 4th St N STE 300, St. Petersburg, FL 33702, United States</p>
              </div>
            </section>

            <section className="pt-8 md:pt-12 border-t border-[#f5f5f7]">
              <h2 className="text-xl md:text-3xl font-semibold tracking-tight text-[#1d1d1f] mb-6 md:mb-8">Send a Message</h2>

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="flex flex-col">
                      <label className="text-[11px] md:text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-[11px] md:text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="example@mail.com"
                        className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[11px] md:text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-1.5 ml-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="Ticket inquiry / Partnership / Feedback"
                      className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-[11px] md:text-[13px] font-semibold text-[#86868b] uppercase tracking-widest mb-1.5 ml-1">Message</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="How can we help you today?"
                      className="bg-[#f5f5f7] border-0 rounded-xl md:rounded-[18px] px-5 py-3.5 md:px-6 md:py-4 font-medium text-[#1d1d1f] focus:ring-2 focus:ring-[#1e824c] transition-all outline-none resize-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full md:w-auto px-10 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-all transform active:scale-95 shadow-xl shadow-[#1e824c]/20"
                  >
                    Submit Request
                  </button>
                </form>
              ) : (
                <div className="bg-[#f5f5f7] p-8 md:p-10 rounded-[24px] md:rounded-[32px] text-center border border-black/5 animate-fadeIn">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1e824c]/10 text-[#1e824c] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                    <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2">Message Sent</h3>
                  <p className="text-[14px] md:text-[16px] text-[#86868b]">Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              )}
            </section>

          </article>

          <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-[#f5f5f7] text-center">
            <button
              onClick={() => router.push('/')}
              className="w-full md:w-auto px-10 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166d3e] transition-all transform active:scale-95 shadow-xl shadow-[#1e824c]/20"
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
