import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Etihad Arena — Venue Guide, History & Visitor Information",
  description:
    "Explore Etihad Arena on Yas Island, Abu Dhabi. Venue history, seating layout, facilities, and everything you need to know before attending an event at Abu Dhabi's premier indoor arena.",
  keywords: [
    "about Etihad Arena",
    "Etihad Arena history",
    "Etihad Arena seating",
    "Yas Island arena guide",
    "Etihad Arena capacity",
    "Abu Dhabi indoor venue",
  ],
  h1: "Etihad Arena — Venue Guide & Information",
  breadcrumbLabel: "About Venue",
  heroSubtitle: "Yas Island, Abu Dhabi",
  heroDescription:
    "Abu Dhabi's largest indoor entertainment venue — concerts, shows, and sporting events on Yas Bay.",

  highlights: [
    {
      icon: "🏟️",
      title: "18,000 Capacity",
      body: "Abu Dhabi's largest indoor arena, with flexible configurations for concerts, sports, and exhibitions.",
    },
    {
      icon: "🎶",
      title: "World-Class Events",
      body: "Hosts international touring artists, championship boxing, UFC fights, comedy shows, and esports tournaments.",
    },
    {
      icon: "🌊",
      title: "Yas Bay Waterfront",
      body: "Situated within the Yas Bay development, surrounded by dining, leisure, and waterfront promenades.",
    },
    {
      icon: "🅿️",
      title: "Easy Access",
      body: "On-site parking, rideshare drop-off zones, and proximity to Abu Dhabi International Airport.",
    },
    {
      icon: "♿",
      title: "Accessible Design",
      body: "Dedicated accessible entrances, seating areas, and facilities available across all levels of the arena.",
    },
    {
      icon: "🎭",
      title: "Flexible Staging",
      body: "Adaptable staging configurations that transform the arena for intimate shows or large-scale productions.",
    },
  ],
  stats: [
    { label: "Capacity", value: "18,000" },
    { label: "Opened", value: "2021" },
    { label: "Location", value: "Yas Island" },
    { label: "From Airport", value: "~15 min" },
  ],
  sections: [
    {
      heading: "About Etihad Arena",
      body: `<p><strong>Etihad Arena</strong> is the largest indoor entertainment venue in Abu Dhabi, located on Yas Island as part of the Yas Bay waterfront development. With a maximum capacity of 18,000, the arena opened in January 2021 and has rapidly established itself as the UAE capital's premier destination for live entertainment.</p>
<p>The venue was designed to host a diverse programme of events — from arena-scale concerts and international touring productions to championship-level sporting events and large-scale conferences. Its flexible floor plan allows staging configurations that adapt from intimate setups to full-capacity arena shows, making it suitable for a wide range of formats and audience sizes.</p>
<p>Yas Island itself is a well-known leisure destination, home to attractions such as Yas Marina Circuit, Ferrari World, and Warner Bros. World. Etihad Arena adds a dedicated live entertainment anchor to the island's offering, drawing visitors from across the Emirates and the wider Gulf region.</p>`,
    },
    {
      heading: "Seating & Arena Layout",
      body: `<p>The arena's bowl design offers clear sightlines from every section. Seating is arranged across multiple tiers, allowing organisers to configure the layout to suit the event format — whether a centre-stage concert, an end-stage production, or a sporting ring in the middle of the floor.</p>
<p>Premium hospitality areas are available for select events, offering enhanced viewing positions with dedicated food and beverage service. General admission and seated categories are typically available, though exact configurations vary by event and promoter.</p>
<p>The concourses are spacious and fully air-conditioned, with food and drink outlets, merchandise points, and rest facilities distributed across each level. Wayfinding signage throughout the arena helps attendees navigate to their seats efficiently.</p>`,
    },
    {
      heading: "Facilities & Services",
      body: `<p>Etihad Arena provides a modern spectator experience with amenities designed for comfort and convenience. Key facilities include:</p>
<ul>
  <li><strong>Food & beverage</strong> — multiple outlets across all concourse levels, offering a range of dining options from quick snacks to sit-down meals</li>
  <li><strong>Accessibility</strong> — dedicated accessible entrances, wheelchair-accessible seating, accessible restrooms, and companion seating areas</li>
  <li><strong>Wi-Fi</strong> — venue-wide connectivity available for attendees</li>
  <li><strong>Cloakroom</strong> — bag storage available on event days, subject to event policy</li>
  <li><strong>First aid</strong> — on-site medical support during all events</li>
</ul>
<p>The arena's location within Yas Bay means attendees can also access nearby restaurants, cafés, and waterfront promenades before or after events. The surrounding area offers a relaxed environment for pre-show dining or post-event socialising.</p>`,
    },
    {
      heading: "Location & Surroundings",
      body: `<p>Yas Island sits in the eastern waters of Abu Dhabi, connected to the mainland by road bridges. The island is approximately 15 minutes from Abu Dhabi International Airport and around 30 minutes from Abu Dhabi city centre by car. Visitors arriving from Dubai can reach Yas Island in roughly 50 minutes via the E11 highway.</p>
<p>Abu Dhabi's climate is warm year-round, with cooler months from November to March offering particularly comfortable conditions for visitors. The island's compact layout means most attractions, hotels, and dining options are within a short drive or shuttle ride of the arena.</p>
<p>For detailed directions, parking information, and transport options, see the <a href="/getting-there">Getting There</a> guide. For questions about your booking or event logistics, visit the <a href="/faq">FAQ</a> or contact <strong>support@yasarena.com</strong>.</p>`,
    },
  ],
  cta: {
    text: "Browse Events",
    href: "/",
  },
  internalLinks: [
    {
      label: "Events",
      sublabel: "Upcoming shows & schedule",
      href: "/events",
    },
    {
      label: "Getting There",
      sublabel: "Directions & parking",
      href: "/getting-there",
    },
    { label: "FAQ", sublabel: "Questions & policies", href: "/faq" },
    { label: "All Events", sublabel: "Browse the full calendar", href: "/" },
  ],
}

export default seo
