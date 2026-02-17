import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { loadSEOStrict } from '@/lib/seo-loader';
import { isTennisSite } from '@/lib/site-config';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContentPage from '@/app/components/ContentPage';
import FAQClient from './FAQClient';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

export async function generateMetadata(): Promise<Metadata> {
  const seo = await loadSEOStrict(siteCode, 'faq');

  if (seo?.h1) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    return {
      title: seo.title,
      description: seo.description,
      alternates: { canonical: `${baseUrl}/faq` },
    };
  }

  if (isTennisSite()) {
    return {
      title: 'FAQ | Dubai Tennis Championships 2026 Tickets',
      description:
        'Frequently asked questions about Dubai Duty Free Tennis Championships 2026 tickets. Ticket delivery, refund policy, seating information, and event details.',
      keywords:
        'Dubai Tennis FAQ, ticket questions, refund policy, Dubai Tennis 2026 help',
      openGraph: {
        title: 'FAQ | Dubai Tennis Tickets 2026',
        description:
          'Get answers to common questions about Dubai Tennis Championships tickets.',
      },
      alternates: { canonical: '/faq' },
    };
  }

  return {};
}

export default async function FAQPage() {
  const seo = await loadSEOStrict(siteCode, 'faq');

  if (seo?.h1) {
    return (
      <div className="relative min-h-screen bg-[#f5f5f7]">
        <Navbar isVisible />
        <ContentPage content={seo} />
        <Footer />
      </div>
    );
  }

  if (isTennisSite()) {
    return <FAQClient />;
  }

  notFound();
}
