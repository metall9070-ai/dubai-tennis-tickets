import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Getting to Etihad Arena — Directions, Parking & Transport Guide",
  description:
    "Plan your journey to Etihad Arena on Yas Island, Abu Dhabi. Driving directions, parking options, taxi and rideshare access, and tips for reaching the venue from the city centre or airport.",
  keywords: [
    "how to get to Etihad Arena",
    "Etihad Arena directions",
    "Etihad Arena parking",
    "Yas Island transport guide",
    "Etihad Arena Abu Dhabi location",
    "getting to Yas Bay",
  ],
  h1: "Getting to Etihad Arena",
  breadcrumbLabel: "Getting There",
  heroSubtitle: "Yas Island, Abu Dhabi",
  heroDescription:
    "Directions, parking, and transport information for reaching the arena.",

  highlights: [
    {
      icon: "car",
      title: "By Car",
      body: "Yas Island is well-connected by road from Abu Dhabi city centre, Dubai, and Al Ain via major highways.",
    },
    {
      icon: "square-parking",
      title: "On-Site Parking",
      body: "Dedicated parking areas are available near the arena. Arrive early on event days to secure a spot.",
    },
    {
      icon: "car",
      title: "Taxi & Rideshare",
      body: "Uber, Careem, and Abu Dhabi taxis operate across the island with designated drop-off points at the venue.",
    },
    {
      icon: "plane",
      title: "Near the Airport",
      body: "Abu Dhabi International Airport is approximately 15 minutes from Yas Island by road.",
    },
    {
      icon: "hotel",
      title: "Stay on Yas Island",
      body: "Several hotels are within walking distance or a short shuttle ride from the arena.",
    },
    {
      icon: "accessibility",
      title: "Accessible Routes",
      body: "Accessible parking, drop-off zones, and venue entrances are available for visitors with mobility needs.",
    },
  ],
  sections: [
    {
      heading: "By Car from Abu Dhabi City Centre",
      body: `<p>Yas Island is located approximately 30 minutes from central Abu Dhabi by car, depending on traffic conditions. Head east towards the airport and follow the signs for Yas Island. Once on the island, directional signage leads to Yas Bay and Etihad Arena.</p>
<p>The arena is situated at the southern tip of the island within the Yas Bay waterfront district. Approach roads are clearly marked, and during major events temporary signage and traffic marshals guide vehicles towards the venue.</p>
<p>Allow extra time if travelling close to doors opening — traffic on approach roads can be heavier before popular shows.</p>`,
    },
    {
      heading: "By Car from Dubai",
      body: `<p>Visitors from Dubai should take the <strong>E11 (Sheikh Zayed Road)</strong> towards Abu Dhabi, then follow signs for Abu Dhabi Airport and Yas Island. The journey takes approximately 50–60 minutes without heavy traffic.</p>
<p>Salik tolls apply on the Dubai side. Navigation apps such as Google Maps and Waze provide reliable live traffic routing between the two cities and work well for finding the arena entrance directly.</p>
<p>For those preferring not to drive, inter-city rideshare services operate between Dubai and Yas Island. The journey is comfortable and straightforward along the highway.</p>`,
    },
    {
      heading: "Parking at Etihad Arena",
      body: `<p>Dedicated car parks serve Etihad Arena and the wider Yas Bay area. Parking is available on a first-come, first-served basis. For high-demand events, additional overflow parking may be opened in nearby zones with shuttle transfers to the venue.</p>
<p>Key points:</p>
<ul>
  <li><strong>Arrive early</strong> — parking areas can fill up quickly for popular shows. Arriving 60–90 minutes before doors open is recommended</li>
  <li><strong>Accessible parking</strong> — designated bays are located close to the venue entrance for visitors with mobility needs</li>
  <li><strong>Premium parking</strong> — some events offer enhanced parking options, typically communicated with the booking confirmation</li>
</ul>
<p>After the event, expect a gradual exit flow from the car parks. The Yas Bay area offers dining and nightlife options nearby if you prefer to wait and avoid the immediate post-event rush.</p>`,
    },
    {
      heading: "Taxi, Rideshare & Drop-Off",
      body: `<p>Uber, Careem, and Abu Dhabi taxis all operate to and from Yas Island. A designated drop-off area near the arena entrance makes arrival by rideshare straightforward.</p>
<p>Taxis are metered in Abu Dhabi, and rideshare apps display the fare estimate before you confirm the ride. From central Abu Dhabi, the journey to Yas Island is typically around 20–30 minutes depending on traffic.</p>
<p>After events, a rideshare pickup zone is located within walking distance of the main exits. Demand can be high immediately after popular shows, so consider waiting briefly at one of the nearby Yas Bay restaurants while surge pricing settles.</p>`,
    },
    {
      heading: "From Abu Dhabi International Airport",
      body: `<p>Yas Island is one of the closest leisure destinations to <strong>Abu Dhabi International Airport</strong> — the drive takes approximately 15 minutes. This makes it particularly convenient for visitors combining an event with a stopover or a longer UAE trip.</p>
<p>Taxis are readily available outside the airport terminals, and rideshare apps work from the arrivals area. Several hotels on Yas Island also offer airport transfer services for their guests.</p>`,
    },
    {
      heading: "Accessibility Information",
      body: `<p>Etihad Arena and the surrounding Yas Bay area are designed to be accessible for visitors with mobility requirements. Key provisions include:</p>
<ul>
  <li><strong>Accessible parking</strong> — designated bays located close to the arena entrance</li>
  <li><strong>Drop-off zones</strong> — level access from vehicle drop-off points to the arena concourse</li>
  <li><strong>Wheelchair access</strong> — ramps and lifts provide access to all seating levels</li>
  <li><strong>Accessible seating</strong> — dedicated positions with companion seating available across the arena</li>
  <li><strong>Accessible restrooms</strong> — available on every concourse level</li>
</ul>
<p>If you have specific accessibility requirements, contact <strong>support@yasarena.com</strong> before your visit so arrangements can be confirmed. For more on venue facilities, see the <a href="/about-venue">About Venue</a> page. Common questions about attending events are answered in the <a href="/faq">FAQ</a>.</p>`,
    },
  ],
  cta: {
    text: "Browse Events",
    href: "/",
  },
  internalLinks: [
    { label: "Events", sublabel: "Upcoming shows", href: "/events" },
    {
      label: "About Venue",
      sublabel: "Arena guide & facilities",
      href: "/about-venue",
    },
    { label: "FAQ", sublabel: "Questions & policies", href: "/faq" },
    { label: "All Events", sublabel: "Full event calendar", href: "/" },
  ],
}

export default seo
