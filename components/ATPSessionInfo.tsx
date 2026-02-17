'use client';

import React from 'react';

interface ATPSessionInfoProps {
  eventTitle: string;
}

const ATP_SESSION_DATA: Record<string, {
  about: string;
  seating: string[];
  beforeYouGo: string[];
}> = {
  "men's day 1": {
    about: "Men's Day 1 opens the ATP tournament at the Dubai Duty Free Tennis Championships.\nYour ticket provides access to all matches scheduled for this day, including Centre Court and outer courts.\n\nThis session is ideal for fans who want to experience the tournament atmosphere from the very start and watch multiple matches throughout the day.",
    seating: [
      "Prime A — the closest view to the court and the best choice for experiencing the power and speed of the men's game.",
      "Prime B — a strong balance between proximity and comfort for a full day of tennis.",
      "Grandstand Lower — excellent court-level atmosphere with good visibility.",
      "Grandstand Upper — a more relaxed option with a wider overview of the court."
    ],
    beforeYouGo: [
      "Gates usually open around 60 minutes before the first match.",
      "One ticket grants access to all matches scheduled for the day.",
      "Daytime sessions can be warm — a hat or sunglasses are recommended."
    ]
  },
  "men's day 2": {
    about: "Men's Day 2 continues the opening round of the ATP tournament.\nThe schedule features a high number of matches, including seeded players and rising talents.\n\nThis session suits spectators who want a long and varied day of top-level men's tennis.",
    seating: [
      "Prime A — ideal for fans who want to feel the intensity and pace of the matches up close.",
      "Prime B — a comfortable option for extended viewing with excellent sightlines.",
      "Grandstand Lower — lively atmosphere and strong connection to the court.",
      "Grandstand Upper — a calmer viewing experience with a broader perspective."
    ],
    beforeYouGo: [
      "Matches are spread throughout the day with short breaks in between.",
      "Tickets remain valid for the entire day.",
      "Comfortable clothing and footwear are recommended."
    ]
  },
  "men's day 3": {
    about: "Men's Day 3 is where the tournament begins to intensify.\nMatches become more competitive as players fight for a place in the later rounds.\n\nThis session is well suited for fans who want to see higher-stakes matches while still enjoying multiple games in one day.",
    seating: [
      "Prime A — the best choice for fully immersive, high-intensity tennis.",
      "Prime B — a balanced option combining value, comfort, and visibility.",
      "Grandstand Lower — ideal for fans who enjoy crowd energy and court-level views.",
      "Grandstand Upper — good for spectators who prefer an overall view of the action."
    ],
    beforeYouGo: [
      "Both daytime and evening matches may be scheduled.",
      "Tickets are mobile — simply present your phone at the entrance.",
      "Evening sessions can feel cooler, so a light jacket is recommended."
    ]
  },
  "men's day 4": {
    about: "Men's Day 4 marks the final stage before the quarterfinals.\nThe number of matches decreases, while the quality and intensity increase.\n\nThis session is ideal for spectators who want to watch strong matchups and feel the growing tension of the tournament.",
    seating: [
      "Prime A — maximum immersion in powerful baseline rallies and serving battles.",
      "Prime B — a comfortable and well-balanced viewing option.",
      "Grandstand Lower — vibrant atmosphere close to the action.",
      "Grandstand Upper — suitable for fans who prefer a strategic overview of the court."
    ],
    beforeYouGo: [
      "Matches may last longer due to increased competitiveness.",
      "Arriving early is recommended.",
      "Evening conditions are generally more comfortable."
    ]
  },
  "men's quarterfinals": {
    about: "The men's quarterfinals feature the strongest players remaining in the ATP tournament.\nMatches are more concentrated, with most attention focused on Centre Court.\n\nThis session is ideal for fans who want to witness elite-level tennis and decisive battles.",
    seating: [
      "Prime A — the best choice for experiencing the intensity of quarterfinal matches up close.",
      "Prime B — a strong alternative with excellent visibility and comfort.",
      "Grandstand Lower — energetic atmosphere and close connection to the court.",
      "Grandstand Upper — a calmer option with a clear overview of the match."
    ],
    beforeYouGo: [
      "Fewer matches are scheduled, but they often last longer.",
      "Demand is higher at this stage — arriving early is advised.",
      "Evening sessions may feel cooler."
    ]
  },
  "men's quarter-finals": {
    about: "The men's quarterfinals feature the strongest players remaining in the ATP tournament.\nMatches are more concentrated, with most attention focused on Centre Court.\n\nThis session is ideal for fans who want to witness elite-level tennis and decisive battles.",
    seating: [
      "Prime A — the best choice for experiencing the intensity of quarterfinal matches up close.",
      "Prime B — a strong alternative with excellent visibility and comfort.",
      "Grandstand Lower — energetic atmosphere and close connection to the court.",
      "Grandstand Upper — a calmer option with a clear overview of the match."
    ],
    beforeYouGo: [
      "Fewer matches are scheduled, but they often last longer.",
      "Demand is higher at this stage — arriving early is advised.",
      "Evening sessions may feel cooler."
    ]
  },
  "men's semifinals": {
    about: "The men's semifinals decide who advances to the final of the tournament.\nTypically, one or two high-profile matches are played with full focus on Centre Court.\n\nThis session is perfect for fans who want to see world-class tennis under maximum pressure.",
    seating: [
      "Prime A — the ultimate choice for maximum emotions and proximity to the action.",
      "Prime B — excellent visibility with a slightly more relaxed experience.",
      "Grandstand Lower — ideal for fans who enjoy crowd energy and atmosphere.",
      "Grandstand Upper — a composed viewing experience with a wider perspective."
    ],
    beforeYouGo: [
      "Matches are fewer but longer and more intense.",
      "Interest is high — early arrival is recommended.",
      "Evening temperatures can be cooler; a light jacket is advised."
    ]
  },
  "men's semi-finals": {
    about: "The men's semifinals decide who advances to the final of the tournament.\nTypically, one or two high-profile matches are played with full focus on Centre Court.\n\nThis session is perfect for fans who want to see world-class tennis under maximum pressure.",
    seating: [
      "Prime A — the ultimate choice for maximum emotions and proximity to the action.",
      "Prime B — excellent visibility with a slightly more relaxed experience.",
      "Grandstand Lower — ideal for fans who enjoy crowd energy and atmosphere.",
      "Grandstand Upper — a composed viewing experience with a wider perspective."
    ],
    beforeYouGo: [
      "Matches are fewer but longer and more intense.",
      "Interest is high — early arrival is recommended.",
      "Evening temperatures can be cooler; a light jacket is advised."
    ]
  },
  "men's final": {
    about: "The men's final is the highlight of the ATP tournament, where the champion is crowned.\nThe session features one headline match with maximum attention from fans and media.\n\nThis is the perfect choice for spectators who want to be part of the tournament's most important moment.",
    seating: [
      "Prime A — the best option for watching the final from the closest and most emotional perspective.",
      "Prime B — a comfortable choice with excellent overall court visibility.",
      "Grandstand Lower — strong atmosphere and close engagement with the match.",
      "Grandstand Upper — ideal for fans who prefer a full-court overview of the final."
    ],
    beforeYouGo: [
      "The final attracts the largest crowds — arriving early is strongly recommended.",
      "Security checks may be more thorough than on previous days.",
      "Evening conditions are cooler; a light jacket is recommended."
    ]
  },
  "men's finals": {
    about: "The men's final is the highlight of the ATP tournament, where the champion is crowned.\nThe session features one headline match with maximum attention from fans and media.\n\nThis is the perfect choice for spectators who want to be part of the tournament's most important moment.",
    seating: [
      "Prime A — the best option for watching the final from the closest and most emotional perspective.",
      "Prime B — a comfortable choice with excellent overall court visibility.",
      "Grandstand Lower — strong atmosphere and close engagement with the match.",
      "Grandstand Upper — ideal for fans who prefer a full-court overview of the final."
    ],
    beforeYouGo: [
      "The final attracts the largest crowds — arriving early is strongly recommended.",
      "Security checks may be more thorough than on previous days.",
      "Evening conditions are cooler; a light jacket is recommended."
    ]
  }
};

const ATPSessionInfo: React.FC<ATPSessionInfoProps> = ({ eventTitle }) => {
  const normalizedTitle = eventTitle.toLowerCase().trim();
  const sessionData = ATP_SESSION_DATA[normalizedTitle];

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
            {sessionData.beforeYouGo.map((item, index) => (
              <li key={index} className="flex items-start gap-2 md:gap-3 text-[14px] md:text-[15px] text-[#86868b] leading-relaxed">
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

export default ATPSessionInfo;
