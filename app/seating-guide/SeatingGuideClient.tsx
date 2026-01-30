'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

// Seating categories for informational display
// Prices reflect current Django database (WTA: $300-$2000, ATP: $200-$3000)
const seatingCategories = [
  {
    name: 'Prime A',
    rows: '1-5',
    price: 'From $2,000',
    color: '#1e824c',
    features: ['Best court views', 'Premium cushioned seats', 'Center court position', 'Closest to action'],
  },
  {
    name: 'Prime B',
    rows: '6-15',
    price: 'From $1,000',
    color: '#3b82f6',
    features: ['Optimal viewing angles', 'Excellent court position', 'Comfortable seating', 'Great proximity'],
  },
  {
    name: 'Grandstand',
    rows: '16+',
    price: 'From $200',
    color: '#f59e0b',
    features: ['Full court overview', 'Great value', 'Elevated perspective', 'Multiple sections'],
  },
];

export default function SeatingGuideClient() {
  const router = useRouter();

  const breadcrumbItems = [
    { label: 'Home', href: '/', onClick: () => router.push('/') },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=1920&auto=format&fit=crop"
            alt="Tennis Stadium Seating"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1d1d1f]/80 to-[#1d1d1f]" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Seating Guide" light />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mt-6">
            Seating Guide
          </h1>
          <p className="text-lg text-white/80 mt-4 max-w-2xl">
            Choose the perfect seats at Dubai Duty Free Tennis Stadium
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {seatingCategories.map((category) => (
              <div
                key={category.name}
                className="bg-white rounded-[24px] p-6 border border-black/5 hover:shadow-lg transition-shadow"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: category.color }}
                >
                  {category.name[0]}
                </div>
                <h3 className="text-xl font-bold text-[#1d1d1f] mb-1">{category.name}</h3>
                <p className="text-sm text-[#86868b] mb-2">Rows {category.rows}</p>
                <p className="text-2xl font-bold text-[#1e824c] mb-4">{category.price}</p>
                <ul className="space-y-2">
                  {category.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-[#424245]">
                      <svg className="w-4 h-4 text-[#1e824c] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => router.push('/#tickets')}
              className="px-8 py-4 bg-[#1e824c] text-white font-semibold rounded-full hover:bg-[#166b3e] transition-colors"
            >
              Browse All Tickets
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
