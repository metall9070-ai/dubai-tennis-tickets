
import React from 'react';

const AboutTournament: React.FC = () => {
  const highlights = [
    { label: 'Founded', value: '1993', icon: '🏆' },
    { label: 'Category', value: 'ATP 500 / WTA 1000', icon: '🎾' },
    { label: 'Venue', value: 'DDF Tennis Stadium', icon: '📍' },
  ];

  return (
    <section className="relative w-full bg-white py-24 overflow-hidden">
      <div className="container mx-auto px-6 max-w-[1200px]">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Side: Content */}
          <div className="flex-1 order-2 lg:order-1">
            <div className="max-w-xl">
              <div className="inline-block px-3 py-1 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-[12px] font-bold tracking-widest uppercase mb-6">
                Legacy of Excellence
              </div>
              
              <h2 className="text-[42px] md:text-[56px] font-bold text-[#1d1d1f] leading-[1.1] mb-8 tracking-tight">
                About the <br />
                <span className="text-[var(--color-primary)]">Tournament</span>
              </h2>
              
              <p className="text-lg md:text-xl text-[#86868b] leading-relaxed mb-10 font-medium">
                The Dubai Duty Free Tennis Championships is a cornerstone of the global tennis calendar. Hosting the world's elite players, it offers an unparalleled blend of high-stakes competition and luxury hospitality in the heart of the Middle East.
              </p>

              {/* Highlights/Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {highlights.map((item, idx) => (
                  <div key={idx} className="bg-[#f5f5f7] p-5 rounded-2xl border border-black/5 hover:border-[var(--color-primary)]/30 transition-colors duration-300">
                    <span className="text-2xl mb-2 block">{item.icon}</span>
                    <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-[14px] md:text-[16px] font-bold text-[#1d1d1f] leading-tight">{item.value}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-10 py-4 bg-[var(--color-primary)] text-white font-bold text-[15px] rounded-full hover:bg-[var(--color-primary-hover)] transition-all duration-300 transform active:scale-95 shadow-lg">
                  Learn More
                </button>
                <button className="px-10 py-4 bg-transparent text-[#1d1d1f] font-bold text-[15px] rounded-full border-2 border-[#1d1d1f]/10 hover:border-[#1d1d1f]/20 transition-all duration-300">
                  View History
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Framed Image */}
          <div className="flex-1 order-1 lg:order-2 w-full">
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl group">
              <img 
                src="https://images.unsplash.com/photo-1595435064212-0104e78c4447?q=80&w=2000&auto=format&fit=crop" 
                alt="Dubai Duty Free Tennis Stadium"
                className="w-full h-[500px] md:h-[650px] object-cover transition-transform duration-[12s] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[12px] font-bold text-[#86868b] uppercase tracking-widest mb-1">Fan Favorite</p>
                <p className="text-[18px] font-bold text-[#1d1d1f]">Best ATP 500 Venue</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default AboutTournament;
