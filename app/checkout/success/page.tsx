'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface VerificationResult {
  verified: boolean;
  customerEmail?: string;
  amountTotal?: number;
  currency?: string;
  error?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [verificationState, setVerificationState] = useState<'loading' | 'verified' | 'failed'>('loading');
  const [orderDetails, setOrderDetails] = useState<VerificationResult | null>(null);

  useEffect(() => {
    async function verifyPayment() {
      if (!sessionId) {
        setVerificationState('failed');
        return;
      }

      try {
        const response = await fetch(`/api/verify-session?session_id=${sessionId}`);
        const data: VerificationResult = await response.json();

        if (data.verified) {
          setVerificationState('verified');
          setOrderDetails(data);
          // Clear the cart only after verification
          if (typeof window !== 'undefined') {
            localStorage.removeItem('dubai-tennis-cart');
          }
        } else {
          setVerificationState('failed');
        }
      } catch (error) {
        console.error('Payment verification failed:', error);
        setVerificationState('failed');
      }
    }

    verifyPayment();
  }, [sessionId]);

  // Loading state
  if (verificationState === 'loading') {
    return (
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
        <div className="w-20 h-20 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="animate-spin w-10 h-10 text-[#1e824c]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h1 className="text-[24px] md:text-[32px] font-bold text-[#1d1d1f] tracking-tight mb-4">
          Verifying Payment...
        </h1>
        <p className="text-[15px] text-[#86868b]">Please wait while we confirm your payment.</p>
      </div>
    );
  }

  // Failed state
  if (verificationState === 'failed') {
    return (
      <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
        <div className="w-20 h-20 bg-[#ff3b30]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-[#ff3b30]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">
          Payment Not Verified
        </h1>

        <p className="text-[17px] text-[#86868b] leading-relaxed mb-8">
          We couldn't verify your payment. If you completed the payment, please contact our support team with your order details.
        </p>

        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full py-4 bg-[#1e824c] text-white rounded-[18px] font-semibold text-lg hover:bg-[#166d3e] transition-colors"
          >
            Return to Home
          </Link>

          <p className="text-[13px] text-[#86868b]">
            Need help? Contact us at{' '}
            <a href="mailto:support@dubaitennistickets.com" className="text-[#1e824c] hover:underline">
              support@dubaitennistickets.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Verified success state
  return (
    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-black/5">
      <div className="w-20 h-20 bg-[#1e824c]/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-[32px] md:text-[40px] font-bold text-[#1d1d1f] tracking-tight mb-4">
        Payment Successful!
      </h1>

      <p className="text-[17px] text-[#86868b] leading-relaxed mb-6">
        Thank you for your order. Your tickets for the Dubai Duty Free Tennis Championships 2026 have been confirmed.
      </p>

      {orderDetails && (
        <div className="bg-[#f5f5f7] rounded-xl p-4 mb-6 text-left">
          <p className="text-[13px] text-[#86868b] mb-2">Order Details:</p>
          <p className="text-[15px] font-semibold text-[#1d1d1f]">
            Total: ${orderDetails.amountTotal?.toLocaleString()} {orderDetails.currency}
          </p>
          {orderDetails.customerEmail && (
            <p className="text-[13px] text-[#86868b] mt-1">
              Confirmation sent to: {orderDetails.customerEmail}
            </p>
          )}
        </div>
      )}

      {sessionId && (
        <p className="text-[13px] text-[#86868b] mb-8 font-mono bg-[#f5f5f7] p-3 rounded-lg break-all">
          Order ID: {sessionId.slice(-12).toUpperCase()}
        </p>
      )}

      <div className="space-y-4">
        <Link
          href="/"
          className="block w-full py-4 bg-[#1e824c] text-white rounded-[18px] font-semibold text-lg hover:bg-[#166d3e] transition-colors"
        >
          Return to Home
        </Link>

        <p className="text-[13px] text-[#86868b]">
          Questions? Contact us at{' '}
          <a href="mailto:support@dubaitennistickets.com" className="text-[#1e824c] hover:underline">
            support@dubaitennistickets.com
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
