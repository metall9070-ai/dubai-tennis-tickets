import type { Metadata } from 'next';
import Script from 'next/script';
import { CartProvider } from './CartContext';
import './globals.css';

// Google Tag Manager ID - replace with your actual GTM ID
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX';

export const metadata: Metadata = {
  title: 'Dubai Tennis Tickets 2026 | ATP 500 & WTA 1000 Championships',
  description: 'Dubai Tennis Tickets for Dubai Duty Free Tennis Championships 2026. Feb 15-28 at Aviation Club. ATP 500 & WTA 1000. Prices from $200. Secure checkout.',
  keywords: 'Dubai Tennis, Dubai Duty Free Tennis Championships, ATP 500 Dubai, WTA 1000 Dubai, tennis tickets Dubai, Dubai Tennis Stadium, tennis 2026, buy tennis tickets',
  authors: [{ name: 'Dubai Tennis Tickets' }],
  robots: 'index, follow',
  metadataBase: new URL('https://dubaitennistickets.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://dubaitennistickets.com/',
    title: 'Dubai Tennis Tickets | Dubai Duty Free Championships 2026',
    description: 'Get Dubai Tennis Tickets for the Dubai Duty Free Tennis Championships 2026. February 15-28 at Dubai Tennis Stadium. ATP 500 & WTA 1000.',
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1200&auto=format&fit=crop'],
    locale: 'en_US',
    siteName: 'Dubai Tennis Tickets',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dubai Tennis Tickets | Dubai Duty Free Championships 2026',
    description: 'Get Dubai Tennis Tickets for Dubai Duty Free Tennis Championships 2026. February 15-28. ATP 500 & WTA 1000 at Dubai Tennis Stadium.',
    images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1200&auto=format&fit=crop'],
  },
  other: {
    'geo.region': 'AE-DU',
    'geo.placename': 'Dubai',
    'geo.position': '25.2048;55.2708',
    'ICBM': '25.2048, 55.2708',
  },
};

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Dubai Tennis Tickets',
      url: 'https://dubaitennistickets.com',
      logo: 'https://dubaitennistickets.com/logo.png',
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['English', 'Arabic', 'Russian'],
      },
    },
    {
      '@type': 'SportsEvent',
      name: 'Dubai Duty Free Tennis Championships 2026',
      description: 'Premier ATP 500 and WTA 1000 professional tennis tournament featuring the world\'s top players at the iconic Dubai Duty Free Tennis Stadium',
      startDate: '2026-02-15T11:00:00+04:00',
      endDate: '2026-02-28T22:00:00+04:00',
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'StadiumOrArena',
        name: 'Dubai Duty Free Tennis Stadium',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Aviation Club, Al Garhoud',
          addressLocality: 'Dubai',
          postalCode: '25111',
          addressCountry: 'AE',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '25.2340',
          longitude: '55.3309',
        },
        maximumAttendeeCapacity: 5000,
      },
      organizer: {
        '@type': 'Organization',
        name: 'Dubai Duty Free',
        url: 'https://www.dubaidutyfree.com',
      },
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: '200',
        highPrice: '3000',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        validFrom: '2025-06-01',
        url: 'https://dubaitennistickets.com/',
        seller: {
          '@type': 'Organization',
          name: 'Dubai Tennis Tickets',
        },
        offerCount: '13',
      },
    },
    {
      '@type': 'WebSite',
      name: 'Dubai Tennis Tickets',
      url: 'https://dubaitennistickets.com',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content="#1e824c" />

        {/* Google Search Console Verification - replace with your actual code */}
        <meta name="google-site-verification" content="Kut3VjgQnCtxdcmziGTy5PxqZRF5BOAX3s9OtOmcwKY" />

        {/* Google Analytics 4 - Direct gtag (beforeInteractive ensures gtag is ready before user interactions) */}
        <Script
          id="gtag-js"
          src="https://www.googletagmanager.com/gtag/js?id=G-1R8HSPFZ1S"
          strategy="beforeInteractive"
        />
        <Script
          id="gtag-config"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-1R8HSPFZ1S', { debug_mode: true });
            `,
          }}
        />

        {/* Google Tag Manager */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
