'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { CART_STORAGE_KEY } from '@/app/CartContext';
import { getSiteConfig } from '@/lib/site-config';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { supportEmail, brand } = getSiteConfig();

  useEffect(() => {
    // Clear cart on success
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
      <div className="w-20 h-20 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">
        Payment Successful!
      </h1>

      <p className="text-[17px] text-[#86868b] leading-relaxed mb-6">
        Thank you for your order. Your {brand} tickets have been confirmed.
      </p>

      <p className="text-[15px] text-[#1d1d1f] mb-6">
        A confirmation email has been sent to your email address with all the details.
      </p>

      {sessionId && (
        <p className="text-[13px] text-[#86868b] mb-8 font-mono bg-[#f5f5f7] p-3 rounded-lg break-all">
          Reference: {sessionId.slice(-12).toUpperCase()}
        </p>
      )}

      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full py-4 bg-[var(--color-primary)] text-white rounded-[18px] font-semibold text-lg hover:bg-[var(--color-primary-hover)] transition-colors text-center"
        >
          Return to Home
        </Link>

        <p className="text-[13px] text-[#86868b]">
          Questions? Contact us at{' '}
          <a href={`mailto:${supportEmail}`} className="text-[var(--color-primary)] hover:underline">
            {supportEmail}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <Suspense fallback={
          <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
            <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse"></div>
            <div className="h-10 bg-[#f5f5f7] rounded-lg mb-4 animate-pulse"></div>
            <div className="h-20 bg-[#f5f5f7] rounded-lg mb-8 animate-pulse"></div>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
