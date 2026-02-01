'use client';

import React from 'react';

interface SEOSectionProps {
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
  onATPTickets?: () => void;
  onWTATickets?: () => void;
}

const SEOSection: React.FC<SEOSectionProps> = ({
  onFAQ,
  onSeatingGuide,
  onVenue,
  onATPTickets,
  onWTATickets
}) => {
  return (
    <section className="pt-12 sm:pt-16 md:pt-24 pb-0 bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
        <div className="flex flex-col space-y-8 sm:space-y-10 md:space-y-12">
          <div className="text-center md:text-left">
            <h2 className="text-[26px] sm:text-[32px] md:text-[48px] font-bold tracking-tight mb-4 sm:mb-6 md:mb-8 leading-tight">
              Dubai Tennis Championships 2026:<br />
              <span className="text-[#1e824c]">ATP 500 & WTA 1000 Tickets</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-start text-[#1d1d1f]/80 leading-relaxed text-[15px] sm:text-[16px] md:text-[17px] font-normal">
            <div className="space-y-6">
              <p>
                The <strong>Dubai Duty Free Tennis Championships</strong> is the premier professional tennis tournament in the Middle East. Since 1993, it has hosted the world's greatest players including <strong>Roger Federer</strong> (8-time champion), <strong>Novak Djokovic</strong>, <strong>Rafael Nadal</strong>, and <strong>Iga Swiatek</strong>.
              </p>
              <p>
                The tournament features both <strong>ATP 500</strong> and <strong>WTA 1000</strong> events, making it one of the most significant combined events on the tennis calendar. The 2026 edition runs from <strong>February 15-28</strong> at the iconic Dubai Duty Free Tennis Stadium.
              </p>
              <p>
                Voted "ATP 500 Tournament of the Year" eleven times by players, Dubai offers an unmatched combination of world-class tennis, perfect February weather, and the legendary hospitality Dubai is known for.
              </p>
            </div>

            <div className="space-y-6">
              <p>
                <strong>Dubai Tennis 2026 tickets</strong> are now available through our ticket concierge. Choose from Prime and Grandstand seating with prices starting from <strong>$200</strong>. All tickets include access to the tournament village with premium dining and entertainment.
              </p>
              <p>
                The men's <strong>ATP Dubai tournament</strong> (February 23-28) and women's <strong>WTA Dubai tournament</strong> (February 15-21) feature separate draws, allowing fans to experience different champions across two weeks of action.
              </p>
              <p>
                Located at the Aviation Club in Al Garhoud, just 10 minutes from Dubai International Airport, the venue is easily accessible and offers stunning open-air tennis under the Dubai sky.
              </p>
            </div>
          </div>

          {/* Internal Links Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6 md:pt-8">
            <button
              onClick={onATPTickets}
              className="min-h-[56px] p-3 sm:p-4 bg-white rounded-xl text-center hover:shadow-md active:bg-gray-50 transition-all"
            >
              <span className="text-[13px] sm:text-sm font-semibold text-[#1d1d1f] block">ATP 500 Tickets</span>
              <span className="text-[11px] sm:text-xs text-[#86868b]">Men's Feb 23-28</span>
            </button>
            <button
              onClick={onWTATickets}
              className="min-h-[56px] p-3 sm:p-4 bg-white rounded-xl text-center hover:shadow-md active:bg-gray-50 transition-all"
            >
              <span className="text-[13px] sm:text-sm font-semibold text-[#1d1d1f] block">WTA 1000 Tickets</span>
              <span className="text-[11px] sm:text-xs text-[#86868b]">Women's Feb 15-21</span>
            </button>
            <button
              onClick={onSeatingGuide}
              className="min-h-[56px] p-3 sm:p-4 bg-white rounded-xl text-center hover:shadow-md active:bg-gray-50 transition-all"
            >
              <span className="text-[13px] sm:text-sm font-semibold text-[#1d1d1f] block">Seating Guide</span>
              <span className="text-[11px] sm:text-xs text-[#86868b]">Compare & Choose</span>
            </button>
            <button
              onClick={onFAQ}
              className="min-h-[56px] p-3 sm:p-4 bg-white rounded-xl text-center hover:shadow-md active:bg-gray-50 transition-all"
            >
              <span className="text-[13px] sm:text-sm font-semibold text-[#1d1d1f] block">FAQ</span>
              <span className="text-[11px] sm:text-xs text-[#86868b]">Common Questions</span>
            </button>
          </div>

          <div className="py-8 sm:py-10 md:py-12 border-t border-[#d2d2d7]">
            <p className="text-[12px] sm:text-[13px] text-[#86868b] text-center leading-relaxed">
              Buy Dubai Tennis tickets online. Secure checkout, instant confirmation, and verified tickets for all sessions at Dubai Duty Free Tennis Stadium.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEOSection;
