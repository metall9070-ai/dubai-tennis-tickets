'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function TournamentClient() {
  const router = useRouter();
  const breadcrumbItems = [{ label: 'Home', href: '/', onClick: () => router.push('/') }];

  const handleViewSchedule = () => {
    router.push('/#tickets');
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/dubai-tennis-stadium-tournament.jpg"
            alt="Dubai Duty Free Tennis Championships - ATP 500 and WTA 1000 Tournament"
            title="Dubai Tennis Championships 2026 - World-class tennis event"
            className="w-full h-full object-cover object-top opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f] via-[#1d1d1f]/40 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
          <Breadcrumbs items={breadcrumbItems} currentPage="Tournament Info" light />

          <div className="mt-8 md:mt-12 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--color-primary)] rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Since 1993
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              Dubai Duty Free Tennis Championships
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl">
              February 15-28, 2026 • Dubai Duty Free Tennis Stadium
            </p>
            <p className="text-base text-white/60 mt-4 max-w-2xl">
              One of the most prestigious tennis events in the Middle East. ATP 500 & WTA 1000 tournaments featuring the world's top players.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
          <article className="prose prose-lg max-w-none text-[#1d1d1f]/90 leading-relaxed font-normal">
            <p className="mb-6 md:mb-8 text-[16px] md:text-[18px]">
              The Dubai Duty Free Tennis Championships is one of the most prestigious and eagerly anticipated sporting events in the United Arab Emirates and a major highlight on the global tennis calendar. Owned and organised by Dubai Duty Free, the tournament is held under the patronage of HH Sheikh Mohammed Bin Rashid Al Maktoum, Vice President and Prime Minister of the UAE and Ruler of Dubai.
            </p>

            <p className="mb-4 text-[16px] md:text-[18px]">
              The event takes place over two consecutive weeks in Dubai and features two elite competitions:
            </p>
            <ul className="list-disc pl-6 mb-6 md:mb-8 space-y-2 text-[16px]">
              <li>a WTA 1000 women's tournament, followed by</li>
              <li>an ATP 500 men's tournament.</li>
            </ul>

            <p className="mb-10 md:mb-12 text-[16px]">
              The 2026 edition represents an important milestone, marking the 34th year of the ATP tournament and the 26th year of the WTA tournament, reinforcing its reputation as one of the longest-running and most respected tennis tournaments in the world.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Legendary Players and World-Class Matches</h2>
            <p className="mb-6 md:mb-8 text-[16px]">
              Throughout its history, the tournament has welcomed some of the greatest players in tennis. Past women's champions include Jasmine Paolini, Barbora Krejcikova, Elina Svitolina, Venus Williams, Serena Williams, Martina Hingis, Justine Henin, Lindsay Davenport, Simona Halep, Garbiñe Muguruza, and Caroline Wozniacki, all of whom delivered top-level tennis in front of sell-out crowds at the Dubai Duty Free Tennis Stadium.
            </p>
            <p className="mb-10 md:mb-12 text-[16px]">
              The men's tournament has consistently attracted the biggest names in the sport, including Novak Djokovic, Daniil Medvedev, Andy Murray, Roger Federer, Rafael Nadal, Andre Agassi, along with recent champions Aslan Karatsev and Ugo Humbert.
            </p>

            <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-[#1d1d1f] mb-4 md:mb-6">Tournament Schedule and Match Planning</h2>
            <p className="mb-10 md:mb-12 text-[16px]">
              Fans planning to attend the event can explore match dates, session times, and daily order of play by visiting the Dubai Duty Free Tennis Championships schedule. The schedule allows visitors to easily plan their visit, choose preferred sessions, and purchase tickets for specific match days across both the ATP and WTA tournaments.
            </p>

            <div
              onClick={handleViewSchedule}
              className="bg-[var(--color-primary)] rounded-[24px] md:rounded-[32px] p-6 md:p-10 text-white shadow-xl cursor-pointer hover:bg-[var(--color-primary-hover)] transition-all group"
            >
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-4">Buy Tickets for the Dubai Duty Free Tennis Championships</h2>
              <p className="mb-6 md:mb-8 opacity-90 text-[15px] md:text-[17px]">
                Book your Dubai Duty Free Tennis Championships tickets and experience elite ATP and WTA tennis live in Dubai. Check the official tournament schedule, select your preferred sessions, and secure the best seats.
              </p>
              <button
                className="w-full md:w-auto px-8 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-full group-hover:bg-white/90 transition-all transform active:scale-95"
              >
                View Schedule
              </button>
            </div>
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}
