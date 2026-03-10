'use client';

import Image from 'next/image';
import { getSiteConfig } from '@/lib/site-config';

interface HeroProps {
  isVisible: boolean;
  onAction?: () => void;
}

export default function Hero({ isVisible, onAction }: HeroProps) {
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
          <>
            <Image
              src={bgImage}
              alt={`${brand} — ${title}`}
              fill
              priority
              quality={85}
              className="object-cover object-[center_40%] hero-image-zoom"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/60 z-10" />
          </>
        )}
        {!bgImage && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        )}
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        {/* Title — stagger 1 */}
        <div className={`transition-all duration-[1000ms] delay-[400ms] ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
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
        </div>

        {/* Subtitle — stagger 2 */}
        <div className={`my-6 sm:my-8 md:my-10 transition-all duration-[1000ms] delay-[700ms] ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {subtitle && (
            <span className="text-[20px] sm:text-2xl md:text-4xl font-semibold text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
              {subtitle}
            </span>
          )}
        </div>

        {/* Description — stagger 3 */}
        <div className={`transition-all duration-[1000ms] delay-[1000ms] ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <p className="text-base sm:text-lg md:text-xl font-normal text-white/85 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto leading-relaxed tracking-[-0.01em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.3)]">
            {description}
          </p>
        </div>

        {/* Button — stagger 4 */}
        <div className={`flex items-center justify-center transition-all duration-[1000ms] delay-[1300ms] ease-out transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          <button
            onClick={onAction}
            className="min-w-[180px] sm:min-w-[200px] px-8 sm:px-10 py-4 bg-white text-black font-medium rounded-full hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.03] active:scale-[0.97] text-base sm:text-lg shadow-2xl inline-block"
          >
            {buttonText}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={onAction}
          className="flex flex-col items-center gap-1 text-white/40 hover:text-white/70 transition-colors duration-300"
          aria-label="Scroll to content"
        >
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  );
}