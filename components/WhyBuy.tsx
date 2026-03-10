'use client';

import React, { useRef, useEffect, useState } from 'react';
import { getSiteConfig } from '@/lib/site-config';

const WhyBuy: React.FC = () => {
  const { brand } = getSiteConfig();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      title: 'Verified Tickets',
      description: 'We guarantee the authenticity of all tickets. Your purchase is fully protected.',
      icon: (
        <svg className="w-7 h-7 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Fast & Easy',
      description: 'Purchasing tickets takes just a few minutes with our streamlined booking flow.',
      icon: (
        <svg className="w-7 h-7 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Secure Payments',
      description: 'Protected by modern encryption. Credit cards and digital wallets supported.',
      icon: (
        <svg className="w-7 h-7 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      )
    },
    {
      title: '24/7 Support',
      description: 'Our concierge team is always available to assist with any inquiries.',
      icon: (
        <svg className="w-7 h-7 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-20 bg-[#f5f5f7]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[1100px]">
        <div className={`text-center mb-8 md:mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <h2 className="text-[24px] md:text-[36px] font-bold tracking-tight text-[#1d1d1f] mb-3">
            Premium Booking Experience
          </h2>
          <p className="text-[15px] md:text-lg text-[#6e6e73] font-medium max-w-2xl mx-auto">
            Secure and trusted way to experience {brand} events.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={`bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl border border-black/5 hover:bg-[#f9f9fb] transition-all duration-500 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: isVisible ? `${index * 100 + 200}ms` : '0ms' }}
            >
              <div className="w-11 h-11 md:w-12 md:h-12 bg-[#f5f5f7] rounded-xl md:rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                {benefit.icon}
              </div>
              <h3 className="text-[15px] md:text-base font-bold text-[#1d1d1f] mb-1.5">{benefit.title}</h3>
              <p className="text-[#6e6e73] text-[13px] md:text-[14px] leading-relaxed font-medium">
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