'use client';

import React from 'react';

interface WTASessionInfoProps {
  eventTitle: string;
}

const WTA_SESSION_DATA: Record<string, {
  about: string;
  seating: string[];
  beforeYouGo: string[];
}> = {
  "women's day 1": {
    about: "Women's Day 1 marks the opening day of the WTA tournament at the Dubai Duty Free Tennis Championships.\nYour ticket provides access to all matches scheduled for this day, including Centre Court and outer courts.\n\nThis session is ideal for visitors who want to experience the tournament atmosphere from the very beginning and watch multiple matches with a single ticket.",
    seating: [
      "Prime A — the best choice for fans who want to be closest to the court and the action.",
      "Prime B — a balanced option with excellent visibility for a full day of tennis.",
      "Grandstand — a good choice for families and casual fans who plan to move between courts."
    ],
    beforeYouGo: [
      "Gates usually open around 60 minutes before the first match.",
      "One ticket grants access to all matches scheduled for the day.",
      "Daytime sessions can be warm — a hat or sunglasses are recommended."
    ]
  },
  "women's day 2": {
    about: "Women's Day 2 continues the opening stage of the WTA tournament.\nThe schedule features a large number of matches, offering the chance to see both top players and rising stars.\n\nThis session is well suited for fans who want to spend a full and varied day watching tennis.",
    seating: [
      "Prime A — ideal for spectators who want maximum proximity to the court.",
      "Prime B — a comfortable and well-balanced option for extended viewing.",
      "Grandstand — a relaxed option for enjoying the overall tournament atmosphere."
    ],
    beforeYouGo: [
      "Matches take place throughout the day with breaks between sessions.",
      "Your ticket remains valid for the entire day.",
      "Comfortable clothing and footwear are recommended."
    ]
  },
  "women's day 3": {
    about: "Women's Day 3 is the stage where the tournament begins to intensify.\nMatches become more competitive, and the overall level of play noticeably increases.\n\nThis session is suitable for spectators who want to enjoy high-quality tennis while still experiencing multiple matches in one day.",
    seating: [
      "Prime A — the best option for focused viewing and a close connection to the game.",
      "Prime B — a strong balance between comfort, price, and visibility.",
      "Grandstand — a comfortable choice for longer stays at the stadium."
    ],
    beforeYouGo: [
      "Both daytime and evening matches may be scheduled.",
      "Tickets are mobile — simply present your ticket on your phone at the entrance.",
      "Evening sessions may feel cooler, so a light jacket is recommended."
    ]
  },
  "women's day 4": {
    about: "Women's Day 4 represents the final stage before the quarterfinals.\nThe number of matches decreases, while the importance of each match increases significantly.\n\nThis session is ideal for fans who want to see strong matchups and feel the growing tension of the tournament.",
    seating: [
      "Prime A — maximum immersion and emotional engagement with the matches.",
      "Prime B — an excellent option for clear views and comfortable seating.",
      "Grandstand — suitable for fans who value atmosphere and overall experience."
    ],
    beforeYouGo: [
      "Matches may last longer due to increased competitiveness.",
      "Arriving early is recommended.",
      "Evening sessions are generally more comfortable temperature-wise."
    ]
  },
  "women's quarterfinals": {
    about: "The women's quarterfinals feature the strongest players remaining in the tournament.\nMatches are more concentrated, with a primary focus on Centre Court.\n\nThis session is ideal for spectators who want to watch top-level tennis and decisive matches.",
    seating: [
      "Prime A — the best choice for experiencing the intensity of quarterfinal matches.",
      "Prime B — a strong alternative with excellent court visibility.",
      "Grandstand — a good option for fans who want to be part of the tournament atmosphere."
    ],
    beforeYouGo: [
      "Fewer matches are scheduled, but they often last longer.",
      "Interest is higher at this stage — arriving early is advised.",
      "Evening conditions may be cooler."
    ]
  },
  "women's semifinals": {
    about: "The women's semifinals determine which players advance to the final of the tournament.\nTypically, one or two key matches are played with full focus on Centre Court.\n\nThis session is perfect for fans who want to witness elite-level tennis and high-pressure competition.",
    seating: [
      "Prime A — the best option for maximum emotions and close-up views of the action.",
      "Prime B — an excellent choice for a more relaxed yet immersive experience.",
      "Grandstand — suitable for spectators who enjoy the shared atmosphere of major matches."
    ],
    beforeYouGo: [
      "Matches are fewer but may be longer and more intense.",
      "Demand is higher — arriving early is recommended.",
      "Evening sessions can be cool; a light jacket is advised."
    ]
  },
  "women's final": {
    about: "The women's final is the main highlight of the WTA tournament, where the champion is decided.\nThe session features one headline match with maximum attention from fans and media.\n\nThis is the perfect choice for spectators who want to be part of the tournament's most important moment.",
    seating: [
      "Prime A — the ultimate option for watching the final from the closest and most emotional perspective.",
      "Prime B — a comfortable choice with excellent overall visibility of the court.",
      "Grandstand — ideal for fans who want to experience the atmosphere of the final."
    ],
    beforeYouGo: [
      "The final attracts the largest crowds — arriving early is strongly recommended.",
      "Security checks may be more thorough than on previous days.",
      "Evening conditions are cooler; a light jacket is recommended."
    ]
  }
};

const WTASessionInfo: React.FC<WTASessionInfoProps> = ({ eventTitle }) => {
  const normalizedTitle = eventTitle.toLowerCase().trim();
  const sessionData = WTA_SESSION_DATA[normalizedTitle];

  if (!sessionData) {
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
          <div className="text-[14px] md:text-[15px] text-[#86868b] leading-relaxed whitespace-pre-line">
            {sessionData.about}
          </div>
        </div>

        {/* Recommended seating */}
        <div className="mb-8 md:mb-10">
          <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] mb-3 md:mb-4 tracking-tight">
            Recommended seating
          </h3>
          <ul className="space-y-2 md:space-y-3">
            {sessionData.seating.map((item, index) => (
              <li key={index} className="flex items-start gap-2 md:gap-3 text-[14px] md:text-[15px] text-[#86868b] leading-relaxed">
                <span className="text-[#1e824c] mt-1">•</span>
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
            {sessionData.beforeYouGo.map((item, index) => (
              <li key={index} className="flex items-start gap-2 md:gap-3 text-[14px] md:text-[15px] text-[#86868b] leading-relaxed">
                <span className="text-[#1e824c] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WTASessionInfo;
