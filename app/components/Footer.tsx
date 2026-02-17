'use client';

import React from 'react';
import Link from 'next/link';
import { getFooterConfig } from '@/lib/nav-config';

const footerConfig = getFooterConfig();

const Footer: React.FC = () => {
  const { brandName, brandDescription, ticketLinks, infoLinks, disclaimer } = footerConfig;

  const legalLinks = [
    { name: 'Contact Us', href: '/contact' },
    { name: 'Payment & Delivery', href: '/payment-and-delivery' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  return (
    <footer className="bg-[#f5f5f7] border-t border-black/5">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-[1200px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Column 1: Brand & Contact - appears last on mobile */}
          <div className="col-span-2 lg:col-span-2 flex flex-col space-y-3 sm:space-y-4 order-3 lg:order-1">
            <span className="text-[#1d1d1f] text-[15px] sm:text-[16px] font-bold tracking-tight">
              {brandName}
            </span>
            <p className="text-[12px] sm:text-[13px] text-[#424245] leading-relaxed">
              {brandDescription}
            </p>
            <div className="space-y-1.5 sm:space-y-2 pt-1 sm:pt-2">
              <p className="text-[11px] sm:text-[12px] text-[#86868b]">
                <span className="font-medium text-[#1d1d1f]">Email:</span> support@dubaitennistickets.com
              </p>
              <p className="text-[11px] sm:text-[12px] text-[#86868b]">
                <span className="font-medium text-[#1d1d1f]">Hours:</span> 24/7 Customer Support
              </p>
              <p className="text-[11px] sm:text-[12px] text-[#86868b]">
                <span className="font-medium text-[#1d1d1f]">Company:</span> WORLD TICKETS 365 INC
              </p>
              <p className="text-[11px] sm:text-[12px] text-[#86868b]">
                <span className="font-medium text-[#1d1d1f]">Address:</span> 7901 4th St N STE 300, St. Petersburg, FL 33702, USA
              </p>
            </div>
          </div>

          {/* Column 2: Tickets - appears first on mobile */}
          <div className="order-1 lg:order-2">
            <h4 className="text-[11px] sm:text-[12px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 sm:mb-4">Tickets</h4>
            <ul className="flex flex-col space-y-2 sm:space-y-2.5">
              {ticketLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] sm:text-[13px] text-[#424245] hover:text-[var(--color-primary)] active:text-[var(--color-primary)] transition-colors duration-200 py-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information - appears first on mobile */}
          <div className="order-1 lg:order-3">
            <h4 className="text-[11px] sm:text-[12px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 sm:mb-4">Information</h4>
            <ul className="flex flex-col space-y-2 sm:space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] sm:text-[13px] text-[#424245] hover:text-[var(--color-primary)] active:text-[var(--color-primary)] transition-colors duration-200 py-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Support - appears before brand on mobile */}
          <div className="col-span-2 sm:col-span-1 order-2 lg:order-4">
            <h4 className="text-[11px] sm:text-[12px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 sm:mb-4">Support</h4>
            <ul className="flex flex-col space-y-2 sm:space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-[12px] sm:text-[13px] text-[#424245] hover:text-[var(--color-primary)] active:text-[var(--color-primary)] transition-colors duration-200 py-1 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-black/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4">
              <span className="text-[10px] sm:text-[11px] text-[#86868b] uppercase tracking-wider">We Accept:</span>
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Visa */}
                <div className="bg-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded border border-black/10">
                  <svg className="h-4 sm:h-5 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M278.198 334.228L311.536 138.244H364.795L331.443 334.228H278.198Z" fill="#00579F"/>
                    <path d="M524.308 142.687C513.618 138.715 496.939 134.355 476.217 134.355C423.571 134.355 386.568 162.104 386.296 202.265C385.891 231.958 413.152 248.479 433.423 258.393C454.161 268.543 461.306 275.056 461.203 284.182C461.065 298.277 444.131 304.659 428.326 304.659C406.184 304.659 394.368 301.628 376.279 293.476L369.133 290.088L361.289 338.147C374.213 344.029 398.186 349.227 423.071 349.527C479.005 349.527 515.293 322.078 515.713 279.166C515.895 255.578 501.267 237.429 470.079 222.444C451.47 213.018 439.986 206.611 440.115 196.815C440.115 188.055 450.128 178.665 471.619 178.665C489.48 178.384 502.559 182.205 512.795 186.177L517.755 188.543L525.425 141.845L524.308 142.687Z" fill="#00579F"/>
                    <path d="M661.615 138.244H621.169C608.839 138.244 599.575 141.708 594.085 154.282L515.988 334.228H571.818C571.818 334.228 581.012 308.851 583.24 302.822C589.363 302.822 643.545 302.909 651.427 302.909C653.189 310.765 658.608 334.228 658.608 334.228H708.196L661.615 138.244ZM599.222 261.022C603.699 249.515 621.169 203.947 621.169 203.947C620.897 204.441 625.647 192.003 628.389 184.322L632.165 202.265C632.165 202.265 642.869 253.145 645.068 261.022H599.222Z" fill="#00579F"/>
                    <path d="M232.903 138.244L180.694 267.454L175.166 241.053C165.782 209.655 137.061 175.477 104.82 158.521L152.563 334.035H208.825L289.165 138.244H232.903Z" fill="#00579F"/>
                    <path d="M119.076 138.244H32.2892L31.5532 142.353C98.5902 158.856 143.462 199.967 166.095 249.422L143.14 154.54C139.141 142.179 129.981 138.639 119.076 138.244Z" fill="#FAA61A"/>
                  </svg>
                </div>
                {/* Mastercard */}
                <div className="bg-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded border border-black/10">
                  <svg className="h-4 sm:h-5 w-auto" viewBox="0 0 152 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="101" cy="50" r="40" fill="#F79E1B"/>
                    <circle cx="51" cy="50" r="40" fill="#EB001B"/>
                    <path d="M76 20.4C67.4 27.3 62 37.9 62 50C62 62.1 67.4 72.7 76 79.6C84.6 72.7 90 62.1 90 50C90 37.9 84.6 27.3 76 20.4Z" fill="#FF5F00"/>
                  </svg>
                </div>
                {/* Amex */}
                <div className="bg-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded border border-black/10">
                  <svg className="h-4 sm:h-5 w-auto" viewBox="0 0 750 471" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="750" height="471" rx="40" fill="#006FCF"/>
                    <path d="M0 235.5H750" stroke="white" strokeWidth="2"/>
                    <text x="375" y="200" textAnchor="middle" fill="white" fontSize="90" fontWeight="bold" fontFamily="Arial">AMEX</text>
                  </svg>
                </div>
                {/* Apple Pay */}
                <div className="bg-white px-2 sm:px-2.5 py-1.5 sm:py-2 rounded border border-black/10">
                  <svg className="h-4 sm:h-5 w-auto" viewBox="0 0 165 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150.7 0H14.3C6.4 0 0 6.4 0 14.3V90.7C0 98.6 6.4 105 14.3 105H150.7C158.6 105 165 98.6 165 90.7V14.3C165 6.4 158.6 0 150.7 0Z" fill="black"/>
                    <path d="M43.6 35.1C45.2 33.1 46.3 30.4 46 27.7C43.6 27.8 40.7 29.3 39 31.3C37.5 33 36.2 35.8 36.5 38.4C39.2 38.6 41.9 37 43.6 35.1Z" fill="white"/>
                    <path d="M46 39.1C42.4 38.9 39.3 41.2 37.6 41.2C35.9 41.2 33.2 39.2 30.3 39.3C26.5 39.4 23 41.5 20.9 44.8C16.6 51.5 19.8 61.4 23.9 66.8C26 69.5 28.4 72.4 31.5 72.3C34.3 72.2 35.4 70.4 38.9 70.4C42.4 70.4 43.4 72.3 46.4 72.2C49.5 72.1 51.6 69.5 53.7 66.8C56.1 63.7 57 60.7 57.1 60.5C57 60.4 51.3 58.3 51.2 51.7C51.1 46.2 55.6 43.6 55.8 43.5C53.2 39.7 49.2 39.2 46 39.1Z" fill="white"/>
                    <path d="M79.1 29.7C88.8 29.7 95.5 36.3 95.5 46C95.5 55.8 88.6 62.4 78.8 62.4H69V77.2H61.6V29.7H79.1ZM69 55.7H77.1C83.8 55.7 87.7 52 87.7 46C87.7 40 83.8 36.4 77.2 36.4H69V55.7Z" fill="white"/>
                    <path d="M98.6 65.5C98.6 58.9 103.5 54.7 112.4 54.2L122.7 53.6V50.5C122.7 46.2 119.8 43.7 114.8 43.7C110.3 43.7 107.4 45.8 106.7 49.1H100C100.3 42.6 106.1 37.7 115.1 37.7C124.1 37.7 130 42.4 130 50V77.2H122.9V70.9H122.7C120.6 75.1 116 77.9 110.6 77.9C103.1 77.9 98.6 73.3 98.6 65.5ZM122.7 61.4V58.2L113.5 58.8C108.6 59.1 105.9 61.2 105.9 64.8C105.9 68.5 108.8 70.8 113.4 70.8C119.3 70.8 122.7 66.8 122.7 61.4Z" fill="white"/>
                    <path d="M136.8 87.2V81.1C137.4 81.2 138.7 81.2 139.4 81.2C143.2 81.2 145.3 79.6 146.5 75.7L147.2 73.4L133.1 38.5H141L151.3 67.5H151.5L161.8 38.5H169.5L154.8 75.3C151.5 84.2 147.7 87.5 140 87.5C139.3 87.5 137.4 87.4 136.8 87.2Z" fill="white"/>
                  </svg>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] sm:text-[11px] text-[#86868b]">SSL Secured Checkout</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-black/5">
          <p className="text-[10px] sm:text-[11px] text-[#86868b] leading-relaxed text-center mb-3 sm:mb-4">
            {disclaimer}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-black/5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4 text-[10px] sm:text-[11px] text-[#86868b]">
            <p>© 2026 WORLD TICKETS 365 INC. All rights reserved.</p>
            <p>7901 4th St N STE 300, St. Petersburg, FL 33702, USA</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
