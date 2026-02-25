export type NavItem = {
  label: string
  href: string
}

export type FooterConfig = {
  brandName: string
  brandDescription: string
  ticketLinks: { name: string; href: string }[]
  infoLinks: { name: string; href: string }[]
  disclaimer: string
}

const SITE_CODE = process.env.NEXT_PUBLIC_SITE_CODE || "default"

/* ------------------------------------------------------------------ */
/*  Navigation items per site_code                                    */
/* ------------------------------------------------------------------ */

const NAV_ITEMS: Record<string, NavItem[]> = {
  tennis: [
    { label: "Tickets", href: "/#tickets" },
    { label: "ATP Tickets", href: "/tickets/atp" },
    { label: "WTA Tickets", href: "/tickets/wta" },
    { label: "Schedule", href: "/schedule" },
    { label: "Seating Guide", href: "/seating-guide" },
    { label: "Venue", href: "/venue" },
    { label: "FAQ", href: "/faq" },
  ],
  finalissima: [
    { label: "Home", href: "/" },
    { label: "Schedule", href: "/schedule" },
    { label: "About Tournament", href: "/about-tournament" },
    { label: "Venue", href: "/venue" },
    { label: "FAQ", href: "/faq" },
  ],
}

/* ------------------------------------------------------------------ */
/*  Footer config per site_code                                       */
/* ------------------------------------------------------------------ */

const FOOTER_CONFIGS: Record<string, FooterConfig> = {
  tennis: {
    brandName: "Dubai Tennis Tickets",
    brandDescription:
      "Independent ticket service for Dubai Duty Free Tennis Championships. Secure booking and guaranteed authentic tickets.",
    ticketLinks: [
      { name: "All Tickets", href: "/" },
      { name: "ATP 500 Tickets", href: "/tickets/atp" },
      { name: "WTA 1000 Tickets", href: "/tickets/wta" },
      { name: "Seating Guide", href: "/seating-guide" },
    ],
    infoLinks: [
      { name: "Tournament Info", href: "/tournament" },
      { name: "Schedule", href: "/schedule" },
      { name: "Venue & Directions", href: "/venue" },
      { name: "FAQ", href: "/faq" },
      { name: "About Us", href: "/about" },
    ],
    disclaimer:
      "This website is operated by WORLD TICKETS 365 INC, an independent ticket concierge service. We are not affiliated with, endorsed by, or connected to Dubai Duty Free, the Dubai Duty Free Tennis Championships, or any venue or event organizer. All trademarks, logos, and brand names are the property of their respective owners and are used for identification purposes only.",
  },
  finalissima: {
    brandName: "Football Festival Qatar",
    brandDescription:
      "Independent ticket concierge service for Football Festival Qatar 2026. Secure booking and guaranteed authentic tickets for all matches.",
    ticketLinks: [
      { name: "All Tickets", href: "/" },
      { name: "Schedule", href: "/schedule" },
    ],
    infoLinks: [
      { name: "About Tournament", href: "/about-tournament" },
      { name: "Venue & Directions", href: "/venue" },
      { name: "FAQ", href: "/faq" },
      { name: "About Us", href: "/about" },
    ],
    disclaimer:
      "Independent ticket concierge service providing ticket sourcing, booking, and delivery through a global network of secondary market partners. We are not affiliated with FIFA, UEFA, CONMEBOL, national associations, venues, or event organizers; all trademarks and brand names are used for identification purposes only, and prices are market-based and may exceed face value.",
  },
}

/* ------------------------------------------------------------------ */
/*  Public accessors                                                  */
/* ------------------------------------------------------------------ */

export function getNavItems(): NavItem[] {
  return NAV_ITEMS[SITE_CODE] || []
}

const NEUTRAL_FOOTER: FooterConfig = {
  brandName: "Event Tickets",
  brandDescription: "Secure ticket booking service.",
  ticketLinks: [],
  infoLinks: [],
  disclaimer:
    "This website is operated by WORLD TICKETS 365 INC, an independent ticket concierge service.",
}

export function getFooterConfig(): FooterConfig {
  return FOOTER_CONFIGS[SITE_CODE] || NEUTRAL_FOOTER
}
