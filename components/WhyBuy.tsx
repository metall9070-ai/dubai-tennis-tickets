'use client';

import React from 'react';

const WhyBuy: React.FC = () => {
  const benefits = [
    {
      title: 'Verified Tickets & Guarantee',
      description: 'Your data is fully protected, and the service is provided in full. We also guarantee the authenticity of all tickets.',
      icon: (
        <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Fast & Easy Purchase',
      description: 'Thanks to a user-friendly interface, purchasing tickets on our website takes just a few minutes.',
      icon: (
        <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      )
    },
    {
      title: 'Secure Payments',
      description: 'Your payments are protected by modern encryption standards. International credit cards and digital wallets are supported.',
      icon: (
        <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: 'Concierge Support 24/7',
      description: 'Our concierge team is available 24/7 to assist with any inquiries and provide complete event information.',
      icon: (
        <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="text-[28px] md:text-[40px] font-bold tracking-tight text-[#1d1d1f] mb-4">
            Premium Booking Experience
          </h2>
          <p className="text-[16px] md:text-lg text-[#86868b] font-medium max-w-2xl mx-auto">
            We provide a secure and premium way to experience world-class tennis in Dubai.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-[#f5f5f7] p-6 md:p-8 rounded-[24px] md:rounded-[32px] border border-black/5 hover:bg-[#ebebed] transition-all duration-500 group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6 shadow-sm group-hover:scale-110 transition-transform duration-500">
                {benefit.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-[#1d1d1f] mb-2 md:mb-3">{benefit.title}</h3>
              <p className="text-[#86868b] text-[14px] md:text-[15px] leading-relaxed font-medium">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyBuy;