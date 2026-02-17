import type { Metadata } from 'next';
import Script from 'next/script';
import { CartProvider } from './CartContext';
import { getSiteConfig, getSiteUrl, buildJsonLd } from '@/lib/site-config';
import './globals.css';

/* ------------------------------------------------------------------ */
/*  Resolve config at build time (env vars are static)                 */
/* ------------------------------------------------------------------ */

const siteConfig = getSiteConfig();
const siteUrl = getSiteUrl();
const jsonLd = buildJsonLd(siteConfig);
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

/* ------------------------------------------------------------------ */
/*  Metadata — driven by site-config                                   */
/* ------------------------------------------------------------------ */

export const metadata: Metadata = {
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  keywords: siteConfig.defaultKeywords,
  authors: [{ name: siteConfig.brand }],
  robots: 'index, follow',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: `${siteUrl}/`,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    ...(siteConfig.ogImage ? { images: [siteConfig.ogImage] } : {}),
    locale: 'en_US',
    siteName: siteConfig.brand,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    ...(siteConfig.ogImage ? { images: [siteConfig.ogImage] } : {}),
  },
  ...(siteConfig.geo
    ? {
        other: {
          'geo.region': siteConfig.geo.region,
          'geo.placename': siteConfig.geo.placename,
          'geo.position': siteConfig.geo.position,
          ICBM: siteConfig.geo.icbm,
        },
      }
    : {}),
};

/* ------------------------------------------------------------------ */
/*  Root Layout                                                        */
/* ------------------------------------------------------------------ */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{
        '--color-primary': siteConfig.colors.primary,
        '--color-primary-hover': siteConfig.colors.primaryHover,
        '--color-header': siteConfig.colors.header,
      } as React.CSSProperties}
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <meta name="theme-color" content={siteConfig.colors.primary} />

        {/* Google Search Console Verification — only if configured */}
        {siteConfig.gscVerification && (
          <meta
            name="google-site-verification"
            content={siteConfig.gscVerification}
          />
        )}

        {/* Google Analytics 4 — only if GA ID configured */}
        {siteConfig.gaId && (
          <>
            <Script
              id="gtag-js"
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.gaId}`}
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
                  gtag('config', '${siteConfig.gaId}'${process.env.NODE_ENV !== 'production' ? ", { debug_mode: true }" : ''});
                `,
              }}
            />
          </>
        )}

        {/* Google Tag Manager — only if GTM ID configured */}
        {GTM_ID && (
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
        )}

        {/* JSON-LD structured data */}
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}

        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
