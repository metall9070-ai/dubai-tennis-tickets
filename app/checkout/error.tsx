'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Checkout error
        </h2>
        <p className="text-gray-600 mb-6">
          Something went wrong during checkout. Your cart data has been preserved. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-6 py-3 text-white rounded-lg font-medium transition-colors"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Try again
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
