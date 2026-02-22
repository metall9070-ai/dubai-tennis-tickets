/**
 * app/not-found.tsx — Global 404 handler
 *
 * SEO Policy (SEO_ARCHITECTURE v1.7 §4C):
 * - 404 pages are noindex/nofollow
 * - Canonical points to /404 (self-referential)
 * - NEVER canonicalize 404 to homepage (prevents deindexation of homepage)
 * - Multi-site isolated (no cross-domain references)
 */

import Link from 'next/link';
import { buildMetadata } from '@/lib/seo/buildMetadata';
import { getSiteConfig } from '@/lib/site-config';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const siteConfig = getSiteConfig();

/**
 * 404 metadata — HARD RULE:
 * - noindex: true (prevent 404 from appearing in search results)
 * - canonical: /404 (self-referential, NOT homepage)
 * - This prevents accidental deindexation of homepage if 404s are indexed
 */
export const metadata = buildMetadata({
  path: '/404',
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist or has been moved.',
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible />

      <main className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[var(--color-primary)]/10 rounded-full">
              <svg
                className="w-12 h-12 text-[var(--color-primary)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1d1d1f] mb-4">
            404 - Page Not Found
          </h1>

          {/* Description */}
          <p className="text-lg text-[#86868b] mb-8 max-w-2xl mx-auto">
            The page you are looking for might have been removed, had its name changed,
            or is temporarily unavailable.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold rounded-xl transition-colors"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Back to Home
            </Link>

            <Link
              href="/schedule"
              className="inline-flex items-center px-6 py-3 bg-white hover:bg-[#f5f5f7] text-[var(--color-primary)] font-semibold rounded-xl border-2 border-[var(--color-primary)] transition-colors"
            >
              View Schedule
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-[#d2d2d7]">
            <p className="text-sm text-[#86868b]">
              Need help?{' '}
              <Link href="/contact" className="text-[var(--color-primary)] hover:underline">
                Contact our support team
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
