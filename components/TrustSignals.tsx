import React from 'react';

const TrustSignals: React.FC = () => {
  return (
    <div className="bg-white border-b border-black/5">
      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6 max-w-[980px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1e824c]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] leading-tight">100% Authentic</p>
              <p className="text-[10px] sm:text-[11px] text-[#86868b] leading-tight">Genuine tickets</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1e824c]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] leading-tight">Secure Payment</p>
              <p className="text-[10px] sm:text-[11px] text-[#86868b] leading-tight">SSL encryption</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1e824c]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] leading-tight">Money-Back</p>
              <p className="text-[10px] sm:text-[11px] text-[#86868b] leading-tight">If cancelled</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1e824c]/10 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[12px] sm:text-[13px] font-semibold text-[#1d1d1f] leading-tight">24/7 Support</p>
              <p className="text-[10px] sm:text-[11px] text-[#86868b] leading-tight">Always here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
