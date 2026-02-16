import { isTennisSite, getSiteCode } from '@/lib/site-config';
import { loadSEOStrict } from '@/lib/seo-loader';
import HomeClient from './HomeClient';
import { fetchEventsServer } from '@/lib/api-server';
import Navbar from '@/app/components/Navbar';
import Footer from '@/app/components/Footer';
import ContentPage from '@/app/components/ContentPage';

export default async function HomePage() {
  if (isTennisSite()) {
    const initialEvents = await fetchEventsServer();
    return <HomeClient initialEvents={initialEvents} />;
  }

  // Non-tennis sites: render content-driven homepage
  const seo = await loadSEOStrict(getSiteCode(), 'homepage');

  if (!seo?.h1) {
    // No content — show empty layout (site operator must add content)
    return (
      <div className="relative min-h-screen bg-[#f5f5f7]">
        <Navbar isVisible />
        <div className="pt-24 pb-12 text-center text-[#86868b]">
          <p>No homepage content configured for this site.</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible />
      <ContentPage content={seo} />
      <Footer />
    </div>
  );
}
