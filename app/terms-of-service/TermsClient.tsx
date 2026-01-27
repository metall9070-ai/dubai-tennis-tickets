'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function TermsClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Terms of Service" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">Terms of Service</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="bg-white rounded-[24px] p-8 border border-black/5 prose prose-lg max-w-none">
            <p>Last updated: January 2026</p>
            <h2>Ticket Purchases</h2>
            <p>All ticket sales are final. Tickets are sourced from the secondary market and may be priced above face value.</p>
            <h2>Refund Policy</h2>
            <p>Full refunds are provided if the event is cancelled. Rescheduled events may be subject to different terms.</p>
            <h2>Ticket Delivery</h2>
            <p>Tickets are delivered electronically within 24-48 hours of purchase.</p>
            <h2>Disclaimer</h2>
            <p>We are an independent ticket concierge, not affiliated with official tournament organizers.</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
