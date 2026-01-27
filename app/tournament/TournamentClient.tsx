'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function TournamentClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />
      <section className="pt-16 pb-12 bg-white border-b border-black/5">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Tournament" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mt-6">Tournament Information</h1>
        </div>
      </section>
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-[24px] p-8 border border-black/5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e824c]/10 text-[#1e824c] rounded-full text-xs font-semibold mb-4">
                ATP 500
              </div>
              <h2 className="text-2xl font-bold mb-2">Men's Tournament</h2>
              <p className="text-[#86868b] mb-4">February 23-28, 2026</p>
              <p className="text-[#424245]">The ATP 500 event attracts the world's top male players. Past champions include Roger Federer (8 titles), Novak Djokovic, and Andy Murray.</p>
              <button onClick={() => router.push('/tickets/atp')} className="mt-4 text-[#1e824c] font-medium hover:underline">
                View ATP Tickets →
              </button>
            </div>
            <div className="bg-white rounded-[24px] p-8 border border-black/5">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e824c]/10 text-[#1e824c] rounded-full text-xs font-semibold mb-4">
                WTA 1000
              </div>
              <h2 className="text-2xl font-bold mb-2">Women's Tournament</h2>
              <p className="text-[#86868b] mb-4">February 15-21, 2026</p>
              <p className="text-[#424245]">The WTA 1000 event features the world's best female players. Past champions include Iga Swiatek, Simona Halep, and Elina Svitolina.</p>
              <button onClick={() => router.push('/tickets/wta')} className="mt-4 text-[#1e824c] font-medium hover:underline">
                View WTA Tickets →
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
