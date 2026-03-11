'use client';

import React from 'react';

export interface SessionData {
  about: string;
  seating: string[];
  beforeYouGo: string[];
}

interface SessionInfoProps {
  eventTitle: string;
  sessionData: Record<string, SessionData>;
}

const SessionInfo: React.FC<SessionInfoProps> = ({ eventTitle, sessionData }) => {
  const normalizedTitle = eventTitle.toLowerCase().trim();
  const data = sessionData[normalizedTitle];

  if (!data) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 border-b border-[#f5f5f7]">
      <div className="max-w-[800px]">
        {/* About this session */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] mb-3 md:mb-4 tracking-tight">
            About this session
          </h3>
          <div className="text-[14px] md:text-[15px] text-[#636366] leading-relaxed whitespace-pre-line">
            {data.about}
          </div>
        </div>

        {/* Recommended seating */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] mb-3 md:mb-4 tracking-tight">
            Recommended seating
          </h3>
          <ul className="space-y-2 md:space-y-3">
            {data.seating.map((item, index) => (
              <li key={index} className="flex items-start gap-2 md:gap-3 text-[14px] md:text-[15px] text-[#636366] leading-relaxed">
                <span className="text-[var(--color-primary)] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Before you go */}
        <div>
          <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] mb-3 md:mb-4 tracking-tight">
            Before you go
          </h3>
          <ul className="space-y-2 md:space-y-3">
            {data.beforeYouGo.map((item, index) => (
              <li key={index} className="flex items-start gap-2 md:gap-3 text-[14px] md:text-[15px] text-[#636366] leading-relaxed">
                <span className="text-[var(--color-primary)] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SessionInfo;
