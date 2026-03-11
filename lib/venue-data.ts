/**
 * Per-site venue data. Keyed by NEXT_PUBLIC_SITE_CODE.
 * VenueClient reads from here instead of hardcoding tennis venue content.
 */

export interface VenueTransport {
  mode: string
  details: string
  tip: string
}

export interface VenueFacility {
  title: string
  description: string
}

export interface VenueHotel {
  rating: string
  distance: string
  name: string
  description: string
}

export interface VenueWeather {
  title: string
  rows: { label: string; value: string }[]
}

export interface VenueContent {
  name: string
  location: string
  tagline: string
  heroImage?: string
  aerialImage?: string
  stats: { value: string; label: string }[]
  aboutTitle: string
  aboutParagraphs: string[]
  address: string[]
  gps?: string
  mapQuery: string
  transport: VenueTransport[]
  facilities: VenueFacility[]
  weather?: VenueWeather
  whatToBring?: string[]
  hotels?: VenueHotel[]
  ctaTitle: string
  ctaDescription: string
}

const TENNIS_VENUE: VenueContent = {
  name: "Dubai Duty Free Tennis Stadium",
  location: "Aviation Club, Al Garhoud, Dubai",
  tagline: "The iconic home of Dubai Tennis Championships since 1993. Just 10 minutes from Dubai International Airport.",
  heroImage: "/images/dubai-duty-free-tennis-stadium.jpg",
  aerialImage: "/images/dubai-tennis-areal-view.webp",
  stats: [
    { value: "5,000", label: "Seat Capacity" },
    { value: "1993", label: "Established" },
    { value: "10 min", label: "From Airport" },
    { value: "Open-Air", label: "Venue Type" },
  ],
  aboutTitle: "A Legendary Tennis Venue",
  aboutParagraphs: [
    "The Dubai Duty Free Tennis Stadium at the Aviation Club is one of the most prestigious tennis venues in the world. Since hosting its first tournament in 1993, it has witnessed countless memorable moments in tennis history.",
    "The intimate open-air stadium offers spectators an unparalleled viewing experience, with every seat providing excellent sightlines to Centre Court. The venue's unique atmosphere combines world-class sporting facilities with the luxury and hospitality that Dubai is famous for.",
  ],
  address: [
    "Dubai Duty Free Tennis Stadium",
    "Aviation Club Tennis Centre",
    "Al Garhoud Road, Al Garhoud",
    "Dubai, United Arab Emirates",
  ],
  gps: "25.2340\u00b0 N, 55.3309\u00b0 E",
  mapQuery: "Dubai+Duty+Free+Tennis+Stadium,Al+Garhoud,Dubai",
  transport: [
    { mode: "Metro", details: "Take the Green Line to GGICO station. 5-minute walk to venue. Trains run every 5-10 minutes.", tip: "Most convenient option during peak hours" },
    { mode: "Taxi / Ride-Share", details: "Uber, Careem, and taxis available. Drop-off point at Gate 1. Dedicated pickup area after matches.", tip: "Book in advance for finals matches" },
    { mode: "Car / Parking", details: "On-site parking available (limited). Additional parking at nearby Dubai Festival City Mall with shuttle.", tip: "Arrive 90 minutes early for parking" },
    { mode: "Hotel Shuttle", details: "Many nearby hotels offer complimentary shuttle service to the venue during tournament dates.", tip: "Check with your hotel concierge" },
  ],
  facilities: [
    { title: "Food & Beverage", description: "Multiple restaurants, cafes, and bars throughout the venue. International cuisine, premium dining options, and quick refreshment stands." },
    { title: "Restrooms", description: "Clean, well-maintained facilities located throughout the stadium. Accessible restrooms available on all levels." },
    { title: "Official Merchandise", description: "Tournament shop with official Dubai Tennis merchandise, player apparel, and exclusive souvenirs." },
    { title: "Free WiFi", description: "Complimentary high-speed WiFi available throughout the venue for all ticket holders." },
    { title: "ATM & Currency", description: "ATM machines available on-site. Most vendors accept credit cards and Apple Pay." },
    { title: "First Aid", description: "Medical stations staffed with trained personnel. Located near main entrances and VIP areas." },
  ],
  weather: {
    title: "February Weather",
    rows: [
      { label: "Average High", value: "25\u00b0C / 77\u00b0F" },
      { label: "Average Low", value: "15\u00b0C / 59\u00b0F" },
      { label: "Rainfall", value: "Rare" },
      { label: "Conditions", value: "Ideal for tennis" },
    ],
  },
  whatToBring: [
    "Sunscreen and sunglasses",
    "Hat or cap for day sessions",
    "Light jacket for evening matches",
    "Comfortable walking shoes",
    "Phone charger / power bank",
    "Your printed or digital ticket",
  ],
  hotels: [
    { rating: "5-Star", distance: "5 min", name: "Le Meridien Dubai", description: "Adjacent to the venue with direct access. Official tournament hotel." },
    { rating: "5-Star", distance: "10 min", name: "Park Hyatt Dubai", description: "Luxury waterfront resort at Dubai Creek. Shuttle service available." },
    { rating: "5-Star", distance: "15 min", name: "InterContinental Festival City", description: "Modern hotel at Festival City Mall with excellent dining options." },
  ],
  ctaTitle: "Experience World-Class Tennis",
  ctaDescription: "Book your seats at Dubai Duty Free Tennis Stadium for an unforgettable experience.",
}

const FINALISSIMA_VENUE: VenueContent = {
  name: "Lusail Stadium",
  location: "Lusail City, Qatar",
  tagline: "The iconic venue of the 2022 FIFA World Cup Final. A state-of-the-art stadium built for football's biggest moments.",
  heroImage: "/images/lusail-stadium-hero.webp",
  stats: [
    { value: "80,000", label: "Seat Capacity" },
    { value: "2022", label: "Opened" },
    { value: "25 min", label: "From Airport" },
    { value: "Enclosed", label: "Venue Type" },
  ],
  aboutTitle: "A World-Class Football Venue",
  aboutParagraphs: [
    "Lusail Stadium is the crown jewel of Qatar's sporting infrastructure. Designed by Foster + Partners, this 80,000-seat venue hosted the 2022 FIFA World Cup Final and represents the pinnacle of modern stadium design.",
    "The stadium features advanced cooling technology, ensuring comfortable temperatures for spectators and players. Its golden exterior, inspired by the interplay of light and shadow characteristic of traditional Arabic art, makes it one of the most visually stunning stadiums in the world.",
  ],
  address: [
    "Lusail Stadium",
    "Lusail Boulevard",
    "Lusail City",
    "Qatar",
  ],
  gps: "25.4195\u00b0 N, 51.4906\u00b0 E",
  mapQuery: "Lusail+Stadium,Lusail,Qatar",
  transport: [
    { mode: "Metro", details: "Take the Red Line to Lusail QNB station. The stadium is a short walk from the station.", tip: "Metro runs extended hours on match days" },
    { mode: "Taxi / Ride-Share", details: "Uber and Careem are widely available in Qatar. Dedicated drop-off and pickup zones at the stadium.", tip: "Allow extra time for match-day traffic" },
    { mode: "Car / Parking", details: "Large parking areas surround the stadium complex. Follow signage for your allocated parking zone.", tip: "Park-and-ride options available from city center" },
    { mode: "Shuttle Bus", details: "Free shuttle buses from key locations in Doha on match days. Check the official schedule for routes and times.", tip: "Shuttle buses start 3 hours before kickoff" },
  ],
  facilities: [
    { title: "Food & Beverage", description: "Multiple concessions offering international cuisine, local specialties, and refreshments throughout the venue." },
    { title: "Restrooms", description: "Modern facilities on all levels. Fully accessible restrooms with family rooms available." },
    { title: "Merchandise", description: "Official tournament merchandise available at multiple shop locations within the stadium." },
    { title: "Free WiFi", description: "High-speed WiFi available throughout the venue for all ticket holders." },
    { title: "ATM & Payments", description: "Contactless payments accepted everywhere. ATMs available on-site." },
    { title: "First Aid", description: "Medical stations on every level, staffed by trained medical professionals." },
  ],
  weather: {
    title: "March Weather in Qatar",
    rows: [
      { label: "Average High", value: "30\u00b0C / 86\u00b0F" },
      { label: "Average Low", value: "19\u00b0C / 66\u00b0F" },
      { label: "Rainfall", value: "Rare" },
      { label: "Conditions", value: "Warm & dry" },
    ],
  },
  whatToBring: [
    "Sunscreen and sunglasses",
    "Hat or cap",
    "Comfortable clothing and shoes",
    "Phone charger / power bank",
    "Your printed or digital ticket",
    "Light jacket for air-conditioned areas",
  ],
  hotels: [
    { rating: "5-Star", distance: "10 min", name: "Katara Hills Hotel", description: "Luxury hotel in Lusail with easy stadium access." },
    { rating: "5-Star", distance: "20 min", name: "The St. Regis Doha", description: "Premium resort on the Corniche with shuttle service on match days." },
    { rating: "5-Star", distance: "25 min", name: "W Doha", description: "Stylish hotel in West Bay with excellent dining and city views." },
  ],
  ctaTitle: "Experience World-Class Football",
  ctaDescription: "Book your seats at Lusail Stadium for an unforgettable football experience.",
}

const VENUE_DATA: Record<string, VenueContent> = {
  tennis: TENNIS_VENUE,
  finalissima: FINALISSIMA_VENUE,
}

export function getVenueContent(siteCode: string): VenueContent | null {
  return VENUE_DATA[siteCode] || null
}
