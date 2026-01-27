'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function ContactClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Contact" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">Contact Us</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="bg-white rounded-[24px] p-8 border border-black/5">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4 text-[#424245]">
              <p><strong>Email:</strong> support@dubaitennistickets.com</p>
              <p><strong>Hours:</strong> 24/7 Customer Support</p>
              <p><strong>Company:</strong> WORLD TICKETS 365 INC</p>
              <p><strong>Address:</strong> 7901 4th St N STE 300, St. Petersburg, FL 33702, USA</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
