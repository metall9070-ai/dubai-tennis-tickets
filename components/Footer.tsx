import React from 'react';

interface FooterProps {
  onHome?: () => void;
  onTournament?: () => void;
  onATPTickets?: () => void;
  onWTATickets?: () => void;
  onPaymentDelivery?: () => void;
  onPrivacyPolicy?: () => void;
  onTermsOfService?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
  onFAQ?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
}

const Footer: React.FC<FooterProps> = ({
  onHome,
  onTournament,
  onATPTickets,
  onWTATickets,
  onPaymentDelivery,
  onPrivacyPolicy,
  onTermsOfService,
  onContacts,
  onAboutUs,
  onFAQ,
  onSeatingGuide,
  onVenue
}) => {
  const ticketLinks = [
    { name: 'All Tickets', href: '/', handler: onHome },
    { name: 'ATP 500 Tickets', href: '/tickets/atp', handler: onATPTickets },
    { name: 'WTA 1000 Tickets', href: '/tickets/wta', handler: onWTATickets },
    { name: 'Seating Guide', href: '/seating-guide', handler: onSeatingGuide },
  ];

  const infoLinks = [
    { name: 'Tournament Info', href: '/tournament', handler: onTournament },
    { name: 'Venue & Directions', href: '/venue', handler: onVenue },
    { name: 'FAQ', href: '/faq', handler: onFAQ },
    { name: 'About Us', href: '/about', handler: onAboutUs },
  ];

  const legalLinks = [
    { name: 'Contact Us', href: '/contact', handler: onContacts },
    { name: 'Payment & Delivery', href: '/payment-and-delivery', handler: onPaymentDelivery },
    { name: 'Privacy Policy', href: '/privacy-policy', handler: onPrivacyPolicy },
    { name: 'Terms of Service', href: '/terms-of-service', handler: onTermsOfService },
  ];

  const handleLinkClick = (handler?: () => void) => (e: React.MouseEvent) => {
    if (handler) {
      e.preventDefault();
      handler();
    }
  };

  return (
    <footer className="bg-[#f5f5f7] border-t border-black/5">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 max-w-[1200px]">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Column 1: Brand & Contact */}
          <div className="col-span-2 lg:col-span-2 flex flex-col space-y-3 sm:space-y-4">
            <span className="text-[#1d1d1f] text-[15px] sm:text-[16px] font-bold tracking-tight">
              Dubai Tennis Ticket Concierge
            </span>
            <p className="text-[12px] sm:text-[13px] text-[#424245] leading-relaxed">
              Independent ticket concierge service for Dubai Duty Free Tennis Championships.
              Secure booking and guaranteed authentic tickets.
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

          {/* Column 2: Tickets */}
          <div>
            <h4 className="text-[11px] sm:text-[12px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 sm:mb-4">Tickets</h4>
            <ul className="flex flex-col space-y-2 sm:space-y-2.5">
              {ticketLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={handleLinkClick(link.handler)}
                    className="text-[12px] sm:text-[13px] text-[#424245] hover:text-[#1e824c] active:text-[#1e824c] transition-colors duration-200 py-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Information */}
          <div>
            <h4 className="text-[11px] sm:text-[12px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 sm:mb-4">Information</h4>
            <ul className="flex flex-col space-y-2 sm:space-y-2.5">
              {infoLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={handleLinkClick(link.handler)}
                    className="text-[12px] sm:text-[13px] text-[#424245] hover:text-[#1e824c] active:text-[#1e824c] transition-colors duration-200 py-1 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[11px] sm:text-[12px] font-bold text-[#1d1d1f] uppercase tracking-wider mb-3 sm:mb-4">Support</h4>
            <ul className="flex flex-col space-y-2 sm:space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={handleLinkClick(link.handler)}
                    className="text-[12px] sm:text-[13px] text-[#424245] hover:text-[#1e824c] active:text-[#1e824c] transition-colors duration-200 py-1 inline-block"
                  >
                    {link.name}
                  </a>
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
                <div className="bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded border border-black/10">
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#1a1f71]">VISA</span>
                </div>
                <div className="bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded border border-black/10">
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#eb001b]">MC</span>
                </div>
                <div className="bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded border border-black/10">
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#006fcf]">AMEX</span>
                </div>
                <div className="bg-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded border border-black/10">
                  <span className="text-[11px] sm:text-[12px] font-bold text-[#000]">Pay</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[#1e824c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-[10px] sm:text-[11px] text-[#86868b]">SSL Secured Checkout</span>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-black/5">
          <p className="text-[10px] sm:text-[11px] text-[#86868b] leading-relaxed text-center mb-3 sm:mb-4">
            This website is operated by WORLD TICKETS 365 INC, an independent ticket concierge service. We are not affiliated with, endorsed by, or connected to Dubai Duty Free, the Dubai Duty Free Tennis Championships, or any venue or event organizer. All trademarks, logos, and brand names are the property of their respective owners and are used for identification purposes only.
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