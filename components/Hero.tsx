'use client';

import React from 'react';
import { getSiteConfig } from '@/lib/site-config';

interface HeroProps {
  isVisible: boolean;
  onAction?: () => void;
}

const Hero: React.FC<HeroProps> = ({ isVisible, onAction }) => {
  const { hero, brand } = getSiteConfig();

  const title = hero?.title || brand;
  const titleLine2 = hero?.titleLine2;
  const subtitle = hero?.subtitle;
  const badge = hero?.badge;
  const description = hero?.description || `Tickets for ${brand} events.`;
  const bgImage = hero?.image;
  const buttonText = hero?.buttonText || 'Get Tickets Now';

  return (
    <section className="relative h-[100vh] w-full overflow-hidden bg-black flex items-center justify-center">
      <div
        className={`absolute inset-0 z-0 transition-opacity duration-[2000ms] ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {bgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center hero-image-zoom"
            style={{
              backgroundImage: `url(${bgImage})`,
              backgroundPosition: 'center 40%',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className={`transition-all duration-[1200ms] delay-500 ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
        }`}>
          <h1 className="text-[32px] sm:text-5xl md:text-7xl lg:text-[88px] font-semibold tracking-[-0.02em] text-white leading-[1.08] drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]">
            {title}
            {titleLine2 && (
              <>
                <br />
                <span className="text-white/90">{titleLine2}</span>
              </>
            )}
          </h1>

          <div className="my-8 sm:my-12 md:my-16">
            {subtitle && (
              <span className="text-[22px] sm:text-3xl md:text-5xl font-semibold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
                {subtitle}
              </span>
            )}
            {badge && (
              <p className="text-base sm:text-lg text-white/60 mt-2 sm:mt-3">{badge}</p>
            )}
          </div>

          <p className="text-base sm:text-lg md:text-2xl font-normal text-white/90 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed tracking-[-0.01em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
            {description}
          </p>

          <div className="flex items-center justify-center">
            <button
              onClick={onAction}
              className="min-w-[180px] sm:min-w-[200px] px-8 sm:px-10 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] text-base sm:text-lg shadow-2xl inline-block"
            >
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;