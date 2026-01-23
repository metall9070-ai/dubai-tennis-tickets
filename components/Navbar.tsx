import React, { useState } from 'react';

interface NavbarProps {
  isVisible: boolean;
  cartCount?: number;
  onHome?: () => void;
  onTournament?: () => void;
  onATPTickets?: () => void;
  onWTATickets?: () => void;
  onCart?: () => void;
  onContacts?: () => void;
  onAboutUs?: () => void;
  onPaymentDelivery?: () => void;
  onSeatingGuide?: () => void;
  onVenue?: () => void;
  onFAQ?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isVisible,
  cartCount = 0,
  onHome,
  onTournament,
  onATPTickets,
  onWTATickets,
  onCart,
  onContacts,
  onAboutUs,
  onPaymentDelivery,
  onSeatingGuide,
  onVenue,
  onFAQ
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Tickets', href: '/#tickets' },
    { label: 'ATP Tickets', href: '/tickets/atp' },
    { label: 'WTA Tickets', href: '/tickets/wta' },
    { label: 'Seating Guide', href: '/seating-guide' },
    { label: 'Venue', href: '/venue' },
    { label: 'FAQ', href: '/faq' }
  ];

  const handleLogoClick = (e: React.MouseEvent) => {
    if (onHome) {
      e.preventDefault();
      setIsMenuOpen(false);
      onHome();
    }
  };

  const handleNavItemClick = (label: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsMenuOpen(false);

    if (label === 'Tickets') {
      if (onHome) onHome();
      setTimeout(() => {
        const ticketsSection = document.getElementById('tickets');
        if (ticketsSection) {
          ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (label === 'Tournament') {
      if (onTournament) onTournament();
    } else if (label === 'ATP Tickets') {
      if (onATPTickets) onATPTickets();
    } else if (label === 'WTA Tickets') {
      if (onWTATickets) onWTATickets();
    } else if (label === 'Seating Guide') {
      if (onSeatingGuide) onSeatingGuide();
    } else if (label === 'Venue') {
      if (onVenue) onVenue();
    } else if (label === 'FAQ') {
      if (onFAQ) onFAQ();
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
        className={`fixed top-0 left-0 right-0 z-[60] bg-[#111842]/95 backdrop-blur-md border-b border-white/10 transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-[1200px] mx-auto h-12 flex items-center justify-between px-4 sm:px-6">
          <div className="flex-shrink-0">
            <a 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center group cursor-pointer" 
              aria-label="Home"
            >
              <span className="text-white text-[13px] font-bold tracking-[0.05em]">
                Dubai Tennis Ticket Concierge
              </span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavItemClick(item.label, e)}
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
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#1e824c] rounded-full text-[9px] flex items-center justify-center text-white font-bold animate-fadeIn">
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
        className={`fixed inset-0 z-[55] bg-[#111842] backdrop-blur-3xl transition-transform duration-500 ease-in-out ${
          isMenuOpen ? 'translate-y-0' : '-translate-y-full'
        } md:hidden`}
      >
        <div className="flex flex-col h-full pt-20 px-8">
          <nav className="flex flex-col space-y-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavItemClick(item.label, e)}
                className="text-[28px] font-semibold text-white/90 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="mt-auto pb-12">
            <p className="text-white/50 text-[13px] font-medium tracking-tight">
              Dubai Tennis Ticket Concierge<br />
              Independent ticket service
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;