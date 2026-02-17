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
    { label: "Seating Guide", href: "/seating-guide" },
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
      { name: "Venue & Directions", href: "/venue" },
      { name: "FAQ", href: "/faq" },
      { name: "About Us", href: "/about" },
    ],
    disclaimer:
      "This website is operated by WORLD TICKETS 365 INC, an independent ticket concierge service. We are not affiliated with, endorsed by, or connected to Dubai Duty Free, the Dubai Duty Free Tennis Championships, or any venue or event organizer. All trademarks, logos, and brand names are the property of their respective owners and are used for identification purposes only.",
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
