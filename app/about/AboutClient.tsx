'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function AboutClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-white text-[#1d1d1f] flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6">

          {/* Breadcrumbs */}
          <div className="mb-8 md:mb-12">
            <Breadcrumbs
              items={breadcrumbItems}
              currentPage="About Us"
            />
          </div>

          {/* Page Heading */}
          <h1 className="text-[32px] md:text-[56px] font-semibold tracking-tight text-[#1d1d1f] mb-8 md:mb-12 leading-tight">
            About <span className="text-[#1e824c]">Us</span>
          </h1>

          {/* Content Sections */}
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal space-y-8 md:space-y-12">

            <section>
              <div className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/5 mb-6 md:mb-10">
                <p className="text-[17px] md:text-[22px] font-semibold text-[#1d1d1f] mb-0 leading-relaxed">
                  Dubai Tennis Ticket Concierge is a professional ticket concierge service specializing in premium access to sports and entertainment events.
                </p>
              </div>

              <div className="pl-4 border-l-2 border-[#1e824c]/20 space-y-4 md:space-y-6">
                <p className="text-[15px] md:text-[16px]">
                  We provide a full range of services related to events, including ticket selection and booking, personalized recommendations, delivery coordination, and comprehensive event information support. Our goal is to make the process of attending an event simple, transparent, and comfortable for our clients.
                </p>

                <p className="text-[15px] md:text-[16px]">
                  We work with both individual clients and corporate customers, assisting in finding optimal options based on preferences, availability, and budget. From initial inquiry to event attendance, we accompany our clients at every stage, ensuring clarity, reliability, and timely communication.
                </p>

                <p className="font-semibold text-[#1d1d1f] text-[15px] md:text-[16px]">
                  Dubai Tennis Ticket Concierge is focused on delivering a high-quality service experience, helping clients save time and confidently plan their visit to major events.
                </p>
              </div>
            </section>

            <section className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/5">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-4">Company Information</h2>
              <div className="space-y-2 text-[15px] md:text-[16px]">
                <p><span className="font-semibold text-[#1d1d1f]">Legal Entity:</span> WORLD TICKETS 365 INC</p>
                <p><span className="font-semibold text-[#1d1d1f]">Address:</span> 7901 4th St N STE 300, St. Petersburg, FL 33702, United States</p>
                <p><span className="font-semibold text-[#1d1d1f]">Email:</span> <a href="mailto:support@dubaitennistickets.com" className="text-[#1e824c] hover:underline">support@dubaitennistickets.com</a></p>
              </div>
              <p className="text-[13px] text-[#86868b] mt-4 italic">
                We are an independent ticket concierge service and are not affiliated with, endorsed by, or connected to Dubai Duty Free, the Dubai Duty Free Tennis Championships, or any venue or event organizer.
              </p>
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
