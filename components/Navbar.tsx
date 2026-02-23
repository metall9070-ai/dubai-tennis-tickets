'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSiteConfig } from '@/lib/site-config';

interface NavbarProps {
  isVisible: boolean;
  cartCount?: number;
  onHome?: () => void;
  onCart?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isVisible,
  cartCount = 0,
  onHome,
  onCart
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Get site_code from environment variable (works in client component)
  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'tennis';
  const { navigation } = getSiteConfig();
  const navItems = navigation;
  const isFinalissimaLogo = siteCode === 'finalissima';

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      setIsMenuOpen(false);
      onHome();
    }
  };

  const handleNavItemClick = (href: string, label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (label === 'Tickets' && href === '/#tickets') {
      if (onHome) onHome();
      setTimeout(() => {
        const ticketsSection = document.getElementById('tickets');
        if (ticketsSection) {
          ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      router.push(href);
    }
  };

  const handleCartClick = (e: React.MouseEvent) => {
    if (onCart) {
      e.preventDefault();
      setIsMenuOpen(false);
      onCart();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[60] bg-[var(--color-header)]/95 backdrop-blur-md border-b border-white/10 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-[1200px] mx-auto h-12 flex items-center justify-between px-4 sm:px-6">
          <div className="flex-shrink-0">
            <a
              href="/"
              onClick={handleLogoClick}
              className="flex items-center group cursor-pointer"
              aria-label={isFinalissimaLogo ? "Football Festival Qatar" : "Dubai Tennis Tickets"}
            >
              {isFinalissimaLogo ? (
                // Finalissima Trophy Logo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 120 120"
                  className="w-7 h-7 md:w-8 md:h-8"
                >
                  <path
                    fill="#FFC54D"
                    d="M101,35.3l-0.2-1.7h-10c0.5-3.4,0.8-6.9,1-10.5c0.1-1.9-1.4-3.5-3.1-3.5H31.4c-1.8,0-3.2,1.6-3.1,3.5  c0.1,3.6,0.5,7.1,1,10.5h-10L19,35.3c-0.1,0.4-1.2,10.6,5.4,19.8c4.3,6,11,10.1,19.7,12.2c2.8,2.8,5.9,4.9,9.2,6.2  c-0.4,4.1-0.9,8.1-1.4,11.8h-3.2c-5,0-9,4-9,9v6.2h40.6v-6.2c0-5-4-9-9-9h-3.1c-0.6-3.8-1.1-7.7-1.5-11.8c3.3-1.2,6.4-3.3,9.2-6.2  c8.7-2.1,15.4-6.2,19.7-12.2C102.2,45.9,101,35.7,101,35.3z M27.3,52.6c-4.2-5.8-4.7-12.1-4.7-15.1h7.3c1.9,9.5,5.3,17.9,9.6,24.2  C34.3,59.7,30.2,56.6,27.3,52.6z M92.7,52.6c-2.9,4-7,7.1-12.2,9.1c4.4-6.4,7.7-14.7,9.6-24.2h7.3C97.4,40.5,96.8,46.8,92.7,52.6z"
                  />
                </svg>
              ) : (
                // Tennis Ball Logo
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  className="w-7 h-7 md:w-8 md:h-8"
                >
                  <circle cx="50" cy="50" r="48" fill="#C9E600"/>
                  <path d="M10 50a40 40 0 0 1 80 0" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round"/>
                  <path d="M90 50a40 40 0 0 1-80 0" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round"/>
                </svg>
              )}
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavItemClick(item.href, item.label, e)}
                className="text-[12px] font-normal text-white/80 hover:text-white transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={handleCartClick}
              className="text-white/80 hover:text-white transition-colors duration-300 relative group flex items-center justify-center w-11 h-11 -mr-2 cursor-pointer"
              aria-label="Cart"
            >
              <div className="relative">
                <svg
                  className="w-[20px] h-[20px] sm:w-[18px] sm:h-[18px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-primary)] rounded-full text-[9px] flex items-center justify-center text-white font-bold animate-fadeIn">
                    {cartCount}
                  </span>
                )}
              </div>
            </button>

            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white/80 hover:text-white transition-colors duration-300 flex items-center justify-center w-11 h-11 -mr-2"
                aria-label="Toggle Menu"
              >
                {isMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div 
        className={`fixed inset-0 z-[55] bg-[var(--color-header)] backdrop-blur-3xl transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full pt-20 px-8">
          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavItemClick(item.href, item.label, e)}
                className="text-[28px] font-semibold text-white/90 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="mt-auto pb-12">
            <p className="text-white/50 text-[13px] font-medium tracking-tight">
              Dubai Tennis Tickets<br />
              Independent ticket service
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;