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
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="About Us" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">About Us</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="bg-white rounded-[24px] p-8 border border-black/5 prose prose-lg max-w-none">
            <p>Dubai Tennis Tickets is an independent ticket concierge service specializing in Dubai Duty Free Tennis Championships.</p>
            <p>We source premium tickets from the secondary market, ensuring authenticity and competitive pricing for tennis enthusiasts worldwide.</p>
            <p><strong>Our Promise:</strong></p>
            <ul>
              <li>100% Authentic Tickets</li>
              <li>Secure Payment Processing</li>
              <li>24/7 Customer Support</li>
              <li>Money-Back Guarantee for Cancelled Events</li>
            </ul>
            <p className="text-sm text-[#86868b]">We are not affiliated with Dubai Duty Free or the official tournament organizers.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
