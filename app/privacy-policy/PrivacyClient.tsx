'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function PrivacyClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Privacy Policy" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">Privacy Policy</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="bg-white rounded-[24px] p-8 border border-black/5 prose prose-lg max-w-none">
            <p>Last updated: January 2026</p>
            <h2>Information We Collect</h2>
            <p>We collect information you provide when purchasing tickets, including name, email, and payment details.</p>
            <h2>How We Use Your Information</h2>
            <p>Your information is used to process orders, deliver tickets, and provide customer support.</p>
            <h2>Data Security</h2>
            <p>We use industry-standard SSL encryption to protect your personal and payment information.</p>
            <h2>Contact</h2>
            <p>For privacy inquiries, contact support@dubaitennistickets.com</p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
