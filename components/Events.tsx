import React from 'react';

export interface Event {
  id: number | string;
  type: 'WTA' | 'ATP';
  title: string;
  date: string;
  day: string;
  month: string;
  time: string;
  minPrice: number;
}

export const eventsData: Event[] = [
  { id: 1, type: 'WTA', month: 'FEB', date: '15', day: 'Sun', time: '11:00 AM', title: "Women's Day 1", minPrice: 150 },
  { id: 'shelby', type: 'WTA', month: 'FEB', date: '16', day: 'Mon', time: '11:00 AM', title: "Women's Day 2", minPrice: 150 },
  { id: 3, type: 'WTA', month: 'FEB', date: '17', day: 'Tue', time: '11:00 AM', title: "Women's Day 3", minPrice: 150 },
  { id: 4, type: 'WTA', month: 'FEB', date: '18', day: 'Wed', time: '11:00 AM', title: "Women's Day 4", minPrice: 150 },
  { id: 5, type: 'WTA', month: 'FEB', date: '19', day: 'Thu', time: '2:00 PM', title: "Women's Quarter-Finals", minPrice: 250 },
  { id: 6, type: 'WTA', month: 'FEB', date: '20', day: 'Fri', time: '1:00 PM', title: "Women's Semi-Finals", minPrice: 350 },
  { id: 7, type: 'WTA', month: 'FEB', date: '21', day: 'Sat', time: '4:30 PM', title: "Women's Finals", minPrice: 500 },
  { id: 8, type: 'ATP', month: 'FEB', date: '23', day: 'Mon', time: '2:00 PM', title: "Men's Day 1", minPrice: 150 },
  { id: 9, type: 'ATP', month: 'FEB', date: '24', day: 'Tue', time: '2:00 PM', title: "Men's Day 2", minPrice: 150 },
  { id: 10, type: 'ATP', month: 'FEB', date: '25', day: 'Wed', time: '2:00 PM', title: "Men's Day 3", minPrice: 150 },
  { id: 11, type: 'ATP', month: 'FEB', date: '26', day: 'Thu', time: '2:00 PM', title: "Men's Quarter-Finals", minPrice: 300 },
  { id: 12, type: 'ATP', month: 'FEB', date: '27', day: 'Fri', time: '1:30 PM', title: "Men's Semi-Finals", minPrice: 450 },
  { id: 13, type: 'ATP', month: 'FEB', date: '28', day: 'Sat', time: '4:30 PM', title: "Men's Finals", minPrice: 750 },
];

interface EventsProps {
  onSelectEvent: (event: any) => void;
}

const Events: React.FC<EventsProps> = ({ onSelectEvent }) => {
  return (
    <section id="tickets" className="py-12 md:py-24 bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
        <div className="mb-8 md:mb-20 text-center md:text-left">
          <h2 className="text-[32px] md:text-[56px] font-semibold tracking-tight mb-3 md:mb-4 leading-tight">Match Schedule</h2>
          <p className="text-[17px] md:text-xl text-[#86868b] font-normal max-w-2xl tracking-[-0.01em]">Discover the matches and get ready for an unforgettable experience.</p>
        </div>

        <div className="mb-10 md:mb-24">
          <div className="flex items-center justify-between mb-5 md:mb-8 px-2 md:px-4">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">WTA 1000 Tournament</h3>
            <span className="text-[12px] md:text-sm font-medium text-[#1e824c]">Women's Week</span>
          </div>
          <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
            {eventsData.filter(e => e.type === 'WTA').map((event, index, arr) => (
              <EventRow 
                key={event.id} 
                event={event} 
                isLast={index === arr.length - 1} 
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </div>
        </div>

        <div className="mb-0">
          <div className="flex items-center justify-between mb-5 md:mb-8 px-2 md:px-4">
            <h3 className="text-xl md:text-2xl font-semibold tracking-tight">ATP 500 Tournament</h3>
            <span className="text-[12px] md:text-sm font-medium text-[#1e824c]">Men's Week</span>
          </div>
          <div className="bg-white rounded-[24px] md:rounded-[32px] overflow-hidden shadow-sm border border-black/5">
            {eventsData.filter(e => e.type === 'ATP').map((event, index, arr) => (
              <EventRow 
                key={event.id} 
                event={event} 
                isLast={index === arr.length - 1} 
                onClick={() => onSelectEvent(event)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export const EventRow: React.FC<{ event: Event; isLast: boolean; onClick: () => void }> = ({ event, isLast, onClick }) => {
  return (
    <div
      id={`event-${event.id}`}
      onClick={onClick}
      className={`group cursor-pointer relative flex items-center justify-between p-4 sm:p-5 md:p-8 transition-all duration-300 hover:bg-[#f5f5f7]/50 active:bg-[#f5f5f7]/70 ${!isLast ? 'border-b border-[#f5f5f7]' : ''}`}
    >
      <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-12">
        <div className="flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-[48px] sm:h-[56px] md:h-[80px] bg-[#f5f5f7] rounded-xl md:rounded-2xl group-hover:bg-white transition-colors duration-300">
          <span className="text-[8px] sm:text-[9px] md:text-[11px] font-semibold text-[#86868b] uppercase tracking-widest leading-none mb-0.5 sm:mb-1">{event.month}</span>
          <span className="text-lg sm:text-xl md:text-3xl font-semibold tracking-tight leading-none">{event.date}</span>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex flex-wrap items-center gap-x-1.5 sm:gap-x-2 gap-y-0.5 mb-0.5 sm:mb-1">
             <span className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#1d1d1f]">{event.day}</span>
             <span className="w-1 h-1 rounded-full bg-[#d2d2d7]"></span>
             <span className="text-[11px] sm:text-[12px] md:text-[14px] font-medium text-[#86868b]">{event.time}</span>
          </div>
          <h4 className="text-[15px] sm:text-base md:text-2xl font-semibold tracking-tight text-[#1d1d1f] group-hover:text-[#1e824c] transition-colors duration-300 leading-snug">
            {event.title}
          </h4>
          <p className="hidden md:block text-[14px] text-[#86868b] mt-0.5">Dubai Duty Free Tennis Stadium</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
        <div className="flex flex-col items-end">
          <span className="text-[9px] sm:text-[10px] md:text-[11px] font-semibold text-[#86868b] uppercase tracking-wide sm:tracking-widest">From</span>
          <span className="text-[14px] sm:text-[15px] md:text-[17px] font-semibold text-[#1d1d1f]">${event.minPrice}</span>
        </div>
        <span className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] px-3 sm:px-4 md:px-4 py-2.5 sm:py-2 md:py-2 bg-[#1e824c] text-white text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-wider rounded-lg group-hover:scale-105 transition-transform">
          Buy
        </span>
      </div>
    </div>
  );
};

export default Events;