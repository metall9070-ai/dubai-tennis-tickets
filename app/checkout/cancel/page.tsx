'use client';

import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center">
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
          <div className="w-20 h-20 bg-[#ff9500]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[#ff9500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">
            Payment Cancelled
          </h1>

          <p className="text-[17px] text-[#86868b] leading-relaxed mb-8">
            Your payment was cancelled. Don't worry, your cart items are still saved. You can return to checkout whenever you're ready.
          </p>

          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full py-4 bg-[var(--color-primary)] text-white rounded-[18px] font-semibold text-lg hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              Return to Home
            </Link>

            <p className="text-[13px] text-[#86868b]">
              Need help? Contact us at{' '}
              <a href="mailto:support@dubaitennistickets.com" className="text-[var(--color-primary)] hover:underline">
                support@dubaitennistickets.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
