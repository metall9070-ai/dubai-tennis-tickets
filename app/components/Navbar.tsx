'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '../CartContext';
import { getNavItems, getFooterConfig } from '@/lib/nav-config';
import { getSiteConfig } from '@/lib/site-config';

interface NavbarProps {
  isVisible?: boolean;
}

export default function Navbar({ isVisible = true }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { cartTotalItems } = useCart();

  // Get config inside component to ensure correct site_code is used
  const navItems = getNavItems();
  const { brandName } = getFooterConfig();
  const siteConfig = getSiteConfig();

  // Get site_code from environment variable (works in client component)
  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || 'tennis';
  const isFinalissimaLogo = siteCode === 'finalissima';

  const handleNavItemClick = (label: string, href: string, e: React.MouseEvent) => {
    setIsMenuOpen(false);

    if (label === 'Tickets') {
      e.preventDefault();
      router.push('/');
      setTimeout(() => {
        const ticketsSection = document.getElementById('tickets');
        if (ticketsSection) {
          ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  return (
    <>
      {/* Top Disclaimer Bar */}
      {siteConfig.topDisclaimer && (
        <div
          className={`fixed top-0 left-0 right-0 z-[61] bg-black text-white flex items-center justify-center px-4 transition-opacity duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ height: '32px' }}
        >
          <p className="text-[12px] font-normal leading-tight max-w-[1200px] text-center">
            {siteConfig.topDisclaimer}
          </p>
        </div>
      )}

      <header
        className={`fixed left-0 right-0 z-[60] bg-[var(--color-header)]/95 backdrop-blur-md border-b border-white/10 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          top: siteConfig.topDisclaimer ? '32px' : '0',
          paddingTop: 'env(safe-area-inset-top)'
        }}
      >
        <div className="max-w-[1200px] mx-auto h-12 flex items-center justify-between px-4 sm:px-6">
          <div className="flex-shrink-0">
            <Link
              href="/"
              onClick={(e) => {
                setIsMenuOpen(false);
                // If already on home page, scroll to top instead of navigating
                if (window.location.pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center group cursor-pointer"
              aria-label={brandName}
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
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavItemClick(item.label, item.href, e)}
                className="text-[15px] font-medium text-white/90 hover:text-white transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link
              href="/checkout"
              onClick={() => setIsMenuOpen(false)}
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
                {cartTotalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[var(--color-primary)] rounded-full text-[9px] flex items-center justify-center text-white font-bold animate-fadeIn">
                    {cartTotalItems}
                  </span>
                )}
              </div>
            </Link>

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
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavItemClick(item.label, item.href, e)}
                className="text-[28px] font-semibold text-white/90 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pb-12">
            <p className="text-white/50 text-[13px] font-medium tracking-tight">
              {brandName}<br />
              Independent ticket service
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
