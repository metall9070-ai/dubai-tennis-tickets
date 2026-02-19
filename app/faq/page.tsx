import { notFound } from 'next/navigation';
import { loadSEOStrict } from '@/lib/seo-loader';
import { isTennisSite } from '@/lib/site-config';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContentPage from '@/app/components/ContentPage';
import FAQClient from './FAQClient';

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'default';

export async function generateMetadata() {
  const seo = await loadSEOStrict(siteCode, 'faq');

  if (seo) {
    return buildMetadata({
      path: '/faq',
      title: seo.title,
      description: seo.description,
    });
  }

  if (isTennisSite()) {
    return buildMetadata({
      path: '/faq',
      title: 'FAQ – Dubai Tennis Championships 2026 Tickets',
      description:
        'Frequently asked questions about Dubai Duty Free Tennis Championships 2026 tickets. Ticket delivery, refund policy, seating information, and event details.',
      keywords: 'Dubai Tennis FAQ, ticket questions, refund policy, Dubai Tennis 2026 help',
    });
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
