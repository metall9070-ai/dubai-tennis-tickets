import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrustSignals from './components/TrustSignals';
import Events from './components/Events';
import SEOSection from './components/SEOSection';
import WhyBuy from './components/WhyBuy';
import Footer from './components/Footer';
import EventSelection from './components/EventSelection';
import Checkout from './components/Checkout';
import TournamentPage from './components/TournamentPage';
import ATPTicketsPage from './components/ATPTicketsPage';
import WTATicketsPage from './components/WTATicketsPage';
import PaymentDeliveryPage from './components/PaymentDeliveryPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import TermsOfServicePage from './components/TermsOfServicePage';
import ContactsPage from './components/ContactsPage';
import AboutUsPage from './components/AboutUsPage';
import FAQPage from './components/FAQPage';
import SeatingGuidePage from './components/SeatingGuidePage';
import VenuePage from './components/VenuePage';

export interface CartItem {
  id: string; // Composite key like eventId-catId
  eventTitle: string;
  categoryName: string;
  price: number;
  quantity: number;
  eventDate: string;
  eventMonth: string;
  eventDay: string;
  eventTime: string;
  venue: string;
}

type ViewType = 'home' | 'event' | 'checkout' | 'tournament' | 'atp-tickets' | 'wta-tickets' | 'payment-delivery' | 'privacy-policy' | 'terms-of-service' | 'contacts' | 'about-us' | 'faq' | 'seating-guide' | 'venue';

// URL Route Map
const ROUTES: Record<string, ViewType> = {
  '/': 'home',
  '/tournament': 'tournament',
  '/tickets/atp': 'atp-tickets',
  '/tickets/wta': 'wta-tickets',
  '/checkout': 'checkout',
  '/faq': 'faq',
  '/seating-guide': 'seating-guide',
  '/venue': 'venue',
  '/payment-and-delivery': 'payment-delivery',
  '/privacy-policy': 'privacy-policy',
  '/terms-of-service': 'terms-of-service',
  '/contact': 'contacts',
  '/about': 'about-us',
};

// Reverse map: ViewType -> URL path
const VIEW_TO_PATH: Record<ViewType, string> = {
  'home': '/',
  'tournament': '/tournament',
  'atp-tickets': '/tickets/atp',
  'wta-tickets': '/tickets/wta',
  'event': '/tickets/event',
  'checkout': '/checkout',
  'faq': '/faq',
  'seating-guide': '/seating-guide',
  'venue': '/venue',
  'payment-delivery': '/payment-and-delivery',
  'privacy-policy': '/privacy-policy',
  'terms-of-service': '/terms-of-service',
  'contacts': '/contact',
  'about-us': '/about',
};

// Get view from current pathname
const getViewFromPath = (pathname: string): ViewType => {
  // Check for event page pattern: /tickets/event/:id
  if (pathname.startsWith('/tickets/event/')) {
    return 'event';
  }
  return ROUTES[pathname] || 'home';
};

const App: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize view from current URL
  const [view, setView] = useState<ViewType>(() => getViewFromPath(window.location.pathname));

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const newView = getViewFromPath(window.location.pathname);
      setView(newView);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate function that updates URL and view
  const navigate = useCallback((newView: ViewType, eventId?: string) => {
    let path = VIEW_TO_PATH[newView];
    if (newView === 'event' && eventId) {
      path = `/tickets/event/${eventId}`;
    }

    if (window.location.pathname !== path) {
      window.history.pushState({ view: newView }, '', path);
    }
    setView(newView);
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenEvent = (eventData: any) => {
    setSelectedEvent(eventData);
    const eventId = eventData?.id || eventData?.title?.toLowerCase().replace(/\s+/g, '-') || 'select';
    navigate('event', eventId);
  };

  const handleBackToHome = () => {
    if (view === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('home');
    }
  };

  const handleGoToTournament = () => navigate('tournament');
  const handleGoToATPTickets = () => navigate('atp-tickets');
  const handleGoToWTATickets = () => navigate('wta-tickets');
  const handleGoToPaymentDelivery = () => navigate('payment-delivery');
  const handleGoToPrivacyPolicy = () => navigate('privacy-policy');
  const handleGoToTermsOfService = () => navigate('terms-of-service');
  const handleGoToContacts = () => navigate('contacts');
  const handleGoToAboutUs = () => navigate('about-us');
  const handleGoToFAQ = () => navigate('faq');
  const handleGoToSeatingGuide = () => navigate('seating-guide');
  const handleGoToVenue = () => navigate('venue');
  const handleGoToCheckout = () => navigate('checkout');

  const handleViewShelter = () => {
    if (view !== 'home') {
      navigate('home');
      setTimeout(() => {
        const ticketsSection = document.getElementById('tickets');
        if (ticketsSection) {
          ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const ticketsSection = document.getElementById('tickets');
      if (ticketsSection) {
        ticketsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleGoToShelby = () => {
    navigate('home');
    setTimeout(() => {
      const shelbyElement = document.getElementById('event-shelby');
      if (shelbyElement) {
        shelbyElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const cartTotalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Common props for legal pages and footer navigation
  const navigationHandlers = {
    onHome: handleBackToHome,
    onTournament: handleGoToTournament,
    onATPTickets: handleGoToATPTickets,
    onWTATickets: handleGoToWTATickets,
    onPaymentDelivery: handleGoToPaymentDelivery,
    onPrivacyPolicy: handleGoToPrivacyPolicy,
    onTermsOfService: handleGoToTermsOfService,
    onContacts: handleGoToContacts,
    onAboutUs: handleGoToAboutUs,
    onCart: handleGoToCheckout,
    onFAQ: handleGoToFAQ,
    onSeatingGuide: handleGoToSeatingGuide,
    onVenue: handleGoToVenue,
  };

  if (view === 'checkout') {
    return (
      <Checkout
        cart={cart}
        setCart={setCart}
        onBack={() => window.history.back()}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'event') {
    return (
      <EventSelection 
        event={selectedEvent} 
        onBack={handleViewShelter} // Change this to scroll to tickets on back
        cart={cart} 
        setCart={setCart} 
        onCheckout={handleGoToCheckout}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'tournament') {
    return (
      <TournamentPage 
        onGoToShelby={handleGoToShelby}
        onViewShelter={handleViewShelter}
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'atp-tickets') {
    return (
      <ATPTicketsPage
        onSelectEvent={handleOpenEvent}
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'wta-tickets') {
    return (
      <WTATicketsPage
        onSelectEvent={handleOpenEvent}
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'payment-delivery') {
    return (
      <PaymentDeliveryPage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'privacy-policy') {
    return (
      <PrivacyPolicyPage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'terms-of-service') {
    return (
      <TermsOfServicePage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'contacts') {
    return (
      <ContactsPage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'about-us') {
    return (
      <AboutUsPage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'faq') {
    return (
      <FAQPage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'seating-guide') {
    return (
      <SeatingGuidePage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  if (view === 'venue') {
    return (
      <VenuePage
        cartCount={cartTotalItems}
        {...navigationHandlers}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar
        isVisible={isLoaded}
        cartCount={cartTotalItems}
        onHome={handleBackToHome}
        onTournament={handleGoToTournament}
        onATPTickets={handleGoToATPTickets}
        onWTATickets={handleGoToWTATickets}
        onCart={handleGoToCheckout}
        onAboutUs={handleGoToAboutUs}
        onContacts={handleGoToContacts}
        onPaymentDelivery={handleGoToPaymentDelivery}
        onSeatingGuide={handleGoToSeatingGuide}
        onVenue={handleGoToVenue}
        onFAQ={handleGoToFAQ}
      />
      <Hero isVisible={isLoaded} onAction={handleViewShelter} />
      {isLoaded && (
        <>
          <TrustSignals />
          <Events onSelectEvent={handleOpenEvent} />
          <WhyBuy />
          <SEOSection
            onFAQ={handleGoToFAQ}
            onSeatingGuide={handleGoToSeatingGuide}
            onVenue={handleGoToVenue}
            onATPTickets={handleGoToATPTickets}
            onWTATickets={handleGoToWTATickets}
          />
          <Footer 
            {...navigationHandlers}
          />
        </>
      )}
    </div>
  );
};

export default App;