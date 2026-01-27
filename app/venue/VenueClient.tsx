'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function VenueClient() {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Venue" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">
            Venue & Directions
          </h1>
          <p className="text-lg text-[#86868b] mt-4 max-w-2xl">
            Dubai Duty Free Tennis Stadium at Aviation Club
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-black/5">
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Location</h2>
              <p className="text-[#424245] mb-4">
                <strong>Dubai Duty Free Tennis Stadium</strong><br />
                Aviation Club Tennis Centre<br />
                Al Garhoud, Dubai<br />
                United Arab Emirates
              </p>
              <p className="text-[#86868b] text-sm">
                10 minutes from Dubai International Airport
              </p>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-black/5">
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Getting There</h2>
              <ul className="space-y-3 text-[#424245]">
                <li className="flex items-start">
                  <span className="font-semibold w-20 flex-shrink-0">Metro:</span>
                  <span>GGICO Station (Green Line)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold w-20 flex-shrink-0">Taxi:</span>
                  <span>~15 mins from Downtown Dubai</span>
                </li>
                <li className="flex items-start">
                  <span className="font-semibold w-20 flex-shrink-0">Parking:</span>
                  <span>On-site parking available</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-black/5 md:col-span-2">
              <h2 className="text-2xl font-bold text-[#1d1d1f] mb-4">Stadium Facilities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['5,000 Capacity', 'VIP Lounges', 'Food Courts', 'Pro Shop', 'Air Conditioning', 'Practice Courts', 'Media Centre', 'First Aid'].map((facility) => (
                  <div key={facility} className="flex items-center">
                    <svg className="w-5 h-5 text-[#1e824c] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-[#424245]">{facility}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
