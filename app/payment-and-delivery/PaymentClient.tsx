'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function PaymentClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Payment & Delivery" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">Payment & Delivery</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-8 border border-black/5">
              <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
              <ul className="space-y-3 text-[#424245]">
                <li>Visa / Mastercard</li>
                <li>American Express</li>
                <li>Apple Pay / Google Pay</li>
                <li>PayPal</li>
              </ul>
              <p className="text-sm text-[#86868b] mt-4">All payments are secured with SSL encryption.</p>
            </div>
            <div className="bg-white rounded-[24px] p-8 border border-black/5">
              <h2 className="text-2xl font-bold mb-4">Ticket Delivery</h2>
              <ul className="space-y-3 text-[#424245]">
                <li>Electronic tickets via email</li>
                <li>Delivery within 24-48 hours</li>
                <li>Mobile tickets accepted at venue</li>
                <li>Instant confirmation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
