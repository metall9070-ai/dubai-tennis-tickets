'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';
import { getSiteConfig, getSiteCode } from '@/lib/site-config';
import { getFAQContent } from '@/lib/faq-data';

export default function FAQClient() {
  const router = useRouter();
  const hasTopDisclaimer = !!getSiteConfig().topDisclaimer;
  const faqContent = getFAQContent(getSiteCode());

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <section className={`${hasTopDisclaimer ? 'pt-24' : 'pt-16'} pb-12 bg-white border-b border-black/5`}>
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="FAQ" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-[#636366] mt-4 max-w-2xl">
            {faqContent.subtitle}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="space-y-4">
            {faqContent.items.map((faq, index) => (
              <details
                key={index}
                className="group bg-white rounded-2xl border border-black/5 overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-[#f5f5f7] transition-colors">
                  <div className="flex-1 pr-4">
                    <span className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-wider block mb-1">
                      {faq.category}
                    </span>
                    <span className="font-semibold text-[#1d1d1f]">{faq.question}</span>
                  </div>
                  <svg
                    className="w-5 h-5 text-[#636366] group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-6 text-[#424245] leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
