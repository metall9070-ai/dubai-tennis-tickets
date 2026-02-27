/* ------------------------------------------------------------------ */
/*  Per-site configuration — drives layout, metadata, JSON-LD, GA     */
/* ------------------------------------------------------------------ */

export interface SiteConfig {
  brand: string
  defaultTitle: string
  defaultDescription: string
  defaultKeywords: string
  supportEmail: string
  ogImage?: string
  gaId?: string
  gtmId?: string
  gscVerification?: string
  jsonLdType: "tennis" | "finalissima" | "generic"
  navigation: Array<{
    label: string
    href: string
  }>
  colors: {
    primary: string
    primaryHover: string
    header: string
  }
  geo?: {
    region: string
    placename: string
    position: string
    icbm: string
  }
  hero?: {
    title: string
    titleLine2?: string
    subtitle: string
    badge?: string
    description: string
    image?: string
    buttonText?: string
  }
  footer?: {
    brandTitle: string
    description: string
    disclaimer: string
  }
  topDisclaimer?: string
  /**
   * Allowed event types for this site (presentation policy).
   * Used for frontend read-only filtering across catalog, schedule, and sitemap.
   * - If undefined: no events will be shown (neutral fallback)
   * - If empty array: no events will be shown
   * - If defined: only events matching these types will be displayed
   *
   * This is NOT business logic - it's presentation policy.
   * Backend remains site-agnostic.
   *
   * Examples:
   * - tennis: ["ATP", "WTA"]
   * - finalissima: ["FOOTBALL"]
   * - ufc: ["UFC"]
   */
  allowedEventTypes?: string[]
}

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || "default"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

/* ------------------------------------------------------------------ */
/*  Configs per site_code                                              */
/* ------------------------------------------------------------------ */

const SITE_CONFIGS: Record<string, SiteConfig> = {
  tennis: {
    brand: "Dubai Tennis Tickets",
    supportEmail: "support@dubaitennistickets.com",
    defaultTitle:
      "Dubai Tennis Tickets 2026 | ATP 500 & WTA 1000 Championships",
    defaultDescription:
      "Dubai Tennis Tickets for Dubai Duty Free Tennis Championships 2026. Feb 15-28 at Aviation Club. ATP 500 & WTA 1000. Prices from $200. Secure checkout.",
    defaultKeywords:
      "Dubai Tennis, Dubai Duty Free Tennis Championships, ATP 500 Dubai, WTA 1000 Dubai, tennis tickets Dubai, Dubai Tennis Stadium, tennis 2026, buy tennis tickets",
    ogImage:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a4bd13?q=80&w=1200&auto=format&fit=crop",
    gaId: "G-1R8HSPFZ1S",
    gscVerification: "Kut3VjgQnCtxdcmziGTy5PxqZRF5BOAX3s9OtOmcwKY",
    jsonLdType: "tennis",
    allowedEventTypes: ["ATP", "WTA"],
    colors: {
      primary: "#1e824c",
      primaryHover: "#166b3e",
      header: "#111842",
    },
    geo: {
      region: "AE-DU",
      placename: "Dubai",
      position: "25.2048;55.2708",
      icbm: "25.2048, 55.2708",
    },
    navigation: [
      { label: 'Tickets', href: '/#tickets' },
      { label: 'ATP Tickets', href: '/tickets/atp' },
      { label: 'WTA Tickets', href: '/tickets/wta' },
      { label: 'Seating Guide', href: '/seating-guide' },
      { label: 'Venue', href: '/venue' },
      { label: 'FAQ', href: '/faq' }
    ],
    hero: {
      title: "Dubai Duty Free",
      titleLine2: "Tennis Championships 2026",
      subtitle: "February 15th – 28th, 2026",
      badge: "ATP 500 & WTA 1000 | Dubai Tennis Stadium",
      description:
        "Tickets for world-class tennis at the iconic Dubai Duty Free Tennis Stadium.",
      image:
        "https://s1.ticketm.net/dam/a/d9b/fe4ff027-d207-4fcd-976c-499a54e4fd9b_SOURCE",
    },
    footer: {
      brandTitle: "Dubai Tennis Tickets",
      description: "Independent ticket service for Dubai Duty Free Tennis Championships. Secure booking and guaranteed authentic tickets.",
      disclaimer: "This website is operated by WORLD TICKETS 365 INC, an independent ticket concierge service. We are not affiliated with, endorsed by, or connected to Dubai Duty Free, the Dubai Duty Free Tennis Championships, or any venue or event organizer. All trademarks, logos, and brand names are the property of their respective owners and are used for identification purposes only. Prices listed on this website differ from face value and may be higher than the original ticket price.",
    },
  },

  finalissima: {
    brand: "Football Festival Qatar",
    supportEmail: "support@footballfestivalqatar.com",
    defaultTitle:
      "Football Festival Qatar – Finalissima 2026 | Lusail Stadium",
    defaultDescription:
      "Football Festival Qatar 2026 features Finalissima Spain vs Argentina and international friendlies. March 27-31 at world-class Qatar stadiums.",
    defaultKeywords:
      "Finalissima 2026 tickets, Spain vs Argentina Qatar, Lusail Stadium football, Football Festival Qatar, intercontinental football final, Qatar football March 2026, international friendly matches Qatar, Finalissima Lusail",
    gaId: process.env.NEXT_PUBLIC_GA_ID,
    ogImage: "/images/lusail-stadium-hero.png",
    gscVerification: process.env.NEXT_PUBLIC_GSC_VERIFICATION,
    jsonLdType: "finalissima",
    allowedEventTypes: ["MATCH"],
    colors: {
      primary: "#00627B",
      primaryHover: "#004F63",
      header: "#800D2F",
    },
    geo: {
      region: "QA",
      placename: "Lusail",
      position: "25.4195;51.4906",
      icbm: "25.4195, 51.4906",
    },
    navigation: [
      { label: 'Tickets', href: '/#tickets' },
      { label: 'Schedule', href: '/schedule' },
      { label: 'About Tournament', href: '/about-tournament' },
      { label: 'Venue', href: '/venue' },
      { label: 'FAQ', href: '/faq' }
    ],
    hero: {
      title: "Football Festival Qatar",
      titleLine2: "Finalissima 2026",
      subtitle: "Spain vs Argentina — March 27, Lusail Stadium",
      badge: "UEFA EURO Champion vs Copa América Champion",
      description:
        "International football celebration headlined by the Finalissima intercontinental final. Six days of world-class matches across Qatar.",
      image: "/images/lusail-stadium-hero.png",
      buttonText: "Get Tickets Now",
    },
    footer: {
      brandTitle: "Football Festival Qatar",
      description: "Independent ticket concierge service for Football Festival Qatar 2026. Secure booking and guaranteed authentic tickets for all matches.",
      disclaimer: "Independent ticket concierge service providing ticket sourcing, booking, and delivery through a global network of secondary market partners. We are not affiliated with FIFA, UEFA, CONMEBOL, national associations, venues, or event organizers; all trademarks and brand names are used for identification purposes only, and prices are market-based and may exceed face value.",
    },
    topDisclaimer: "Independent ticket concierge service in the secondary ticket market. Prices are market-based and may exceed face value.",
  },

}

/* ------------------------------------------------------------------ */
/*  Neutral fallback — NOT tennis                                      */
/* ------------------------------------------------------------------ */

const NEUTRAL_FALLBACK: SiteConfig = {
  brand: "Event Tickets",
  supportEmail: "support@example.com",
  defaultTitle: "Event Tickets",
  defaultDescription:
    "Browse and purchase event tickets securely. Verified tickets, secure checkout, and dedicated customer support.",
  defaultKeywords: "event tickets, buy tickets, secure tickets",
  jsonLdType: "generic",
  navigation: [],
  colors: {
    primary: "#1e824c",
    primaryHover: "#166b3e",
    header: "#111842",
  },
}

/* ------------------------------------------------------------------ */
/*  Public accessors                                                   */
/* ------------------------------------------------------------------ */

export function getSiteConfig(siteCode?: string): SiteConfig {
  const code = siteCode || SITE_CODE
  return SITE_CONFIGS[code] || NEUTRAL_FALLBACK
}

export function getSiteCode(): string {
  return SITE_CODE
}

export function getSiteUrl(): string {
  return SITE_URL
}

export function isTennisSite(): boolean {
  return SITE_CODE === "tennis"
}

/* ------------------------------------------------------------------ */
/*  JSON-LD builder                                                    */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function buildJsonLd(config: SiteConfig): Record<string, any> | null {
  if (config.jsonLdType === "tennis") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "Dubai Tennis Tickets",
          url: SITE_URL,
          logo: `${SITE_URL}/logo.png`,
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "customer service",
            availableLanguage: ["English", "Arabic", "Russian"],
          },
        },
        {
          "@type": "WebSite",
          name: "Dubai Tennis Tickets",
          url: SITE_URL,
        },
      ],
    }
  }

  if (config.jsonLdType === "finalissima") {
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          name: "Football Festival Qatar",
          url: SITE_URL,
          email: "support@footballfestivalqatar.com",
        },
        {
          "@type": "WebSite",
          name: "Football Festival Qatar",
          url: SITE_URL,
        },
      ],
    }
  }

  // generic / unknown — no JSON-LD to avoid phantom structured data
  return null
}
