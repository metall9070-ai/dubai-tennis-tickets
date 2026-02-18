import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title:
    "Stadium Guide — Lusail, Ahmad bin Ali & Jassim bin Hamad",
  description:
    "Practical guide to the three Football Festival Qatar 2026 venues. Directions, metro access, facilities, and travel tips for Lusail Stadium, Ahmad bin Ali Stadium, and Jassim bin Hamad Stadium.",
  keywords: [
    "Lusail Stadium guide",
    "Ahmad bin Ali Stadium directions",
    "Jassim bin Hamad Stadium Doha",
    "Qatar stadium transport",
    "how to get to Lusail Stadium",
    "football venue Qatar metro",
  ],
  h1: "Venue Guide — Stadiums & Getting There",
  breadcrumbLabel: "Venue & Directions",
  heroSubtitle:    "Lusail Stadium, Lusail, Qatar",
  heroDescription: "Host venue of Finalissima 2026 and the 2022 FIFA World Cup Final. Located 20 minutes north of Doha.",

  highlights: [
    { icon: "🚇", title: "Metro Access", body: "Take the Red Line to Lusail QNB Station. The stadium is a short walk from the station exit." },
    { icon: "🚕", title: "Taxi & Rideshare", body: "Karwa taxis and Uber are widely available. Ask for Lusail Stadium — journey from central Doha takes around 20 minutes." },
    { icon: "🅿️", title: "Parking", body: "Large parking areas surround the stadium. Arrive early on match days as spaces fill quickly." },
    { icon: "🏟️", title: "World-Class Facilities", body: "80,000-seat capacity, fully air-conditioned concourses, multiple food and beverage outlets throughout the venue." },
    { icon: "♿", title: "Accessibility", body: "Dedicated accessible entrances, seating areas, and facilities are available across all levels of the stadium." },
    { icon: "🌡️", title: "Climate & Comfort", body: "March in Qatar is pleasant — expect 20–28°C. The stadium has cooling systems in spectator areas." },
  ],
  stats: [
    { label: "Lusail Capacity", value: "80,000" },
    { label: "Established", value: "2021" },
    { label: "From Doha Centre", value: "20 min" },
    { label: "Metro Access", value: "Red Line" },
  ],
  sections: [
    {
      heading: "Lusail Stadium, Lusail",
      body: `<p><strong>Lusail Stadium</strong> is the largest venue hosting Football Festival Qatar 2026 and the confirmed venue for the Finalissima. Located in Lusail City, roughly 20 km north of central Doha, this 80,000-capacity ground was purpose-built for the 2022 FIFA World Cup and hosted the final between Argentina and France.</p>
<p>The stadium's exterior features a distinctive golden facade inspired by traditional Arabic lanterns. Inside, the bowl design provides excellent sightlines from every tier.</p>
<p><strong>Getting there:</strong></p>
<ul>
  <li><strong>Metro</strong> — Lusail QNB Station on the Red Line is a short walk from the stadium. Trains run frequently from central Doha (Msheireb interchange) and the journey takes approximately 25 minutes</li>
  <li><strong>Taxi / rideshare</strong> — Uber and Karwa (local taxi app) operate throughout Qatar. From West Bay hotels, expect a 20–30 minute ride depending on traffic</li>
  <li><strong>Parking</strong> — dedicated car parks surround the stadium, though public transport is encouraged during event days</li>
</ul>
<p>Arrive at least 60 minutes before kick-off to clear security and find your seat comfortably.</p>`,
    },
    {
      heading: "Ahmad bin Ali Stadium, Al Rayyan",
      body: `<p><strong>Ahmad bin Ali Stadium</strong> sits on the western edge of metropolitan Doha in Al Rayyan. With a capacity of approximately 44,740, it offers a more intimate atmosphere than Lusail while still delivering a world-class matchday experience. The stadium's striking exterior panels glow at night, representing different aspects of Qatari culture — desert dunes, local flora, and national symbols.</p>
<p>The venue hosted several group-stage and round-of-16 matches during the 2022 World Cup and is home to Al Rayyan SC.</p>
<p><strong>Getting there:</strong></p>
<ul>
  <li><strong>Metro</strong> — Al Riffa Station on the Green Line is the nearest stop, with a pedestrian walkway to the ground. From Msheireb the journey is roughly 20 minutes</li>
  <li><strong>By road</strong> — the stadium is located near the Dukhan Highway, well-signposted from the city centre. Rideshare apps work reliably in the area</li>
</ul>
<p>The surrounding area is quieter than central Doha, so consider eating in the city before heading out or taking advantage of food and drink options inside the venue.</p>`,
    },
    {
      heading: "Jassim bin Hamad Stadium, Doha",
      body: `<p><strong>Jassim bin Hamad Stadium</strong> is the home ground of Al Sadd SC, located in the Al Waab area of Doha. It is the most centrally located of the three festival venues and the smallest, giving it a more concentrated, lively atmosphere on match nights.</p><!-- TODO: verify capacity -->
<p>The stadium has undergone renovations in recent years and regularly hosts Qatar Stars League fixtures as well as AFC Champions League matches.</p>
<p><strong>Getting there:</strong></p>
<ul>
  <li><strong>Metro</strong> — Al Waab Station on the Gold Line provides access, though a short taxi or bus ride from the station to the ground may be needed</li><!-- TODO: verify nearest metro station -->
  <li><strong>Taxi</strong> — being centrally located, rides from most Doha hotels are short and affordable (typically 10–20 minutes)</li>
</ul>
<p>The Al Waab neighbourhood has a range of restaurants and cafés within walking distance, making it easy to combine a match with dinner nearby.</p>`,
    },
    {
      heading: "General Travel Tips for Qatar",
      body: `<p>Qatar is well set up for international visitors, especially after the infrastructure investment around the 2022 World Cup. Here are some practical points for planning your trip:</p>
<ul>
  <li><strong>Visa</strong> — nationals of many countries receive visa-free or visa-on-arrival entry. Check Qatar's official portal for your nationality before booking</li>
  <li><strong>Weather</strong> — late March in Qatar is warm but not extreme, with daytime highs around 28–32°C and evenings cooling to 20–22°C. Bring light clothing and sunscreen for any daytime plans</li>
  <li><strong>Currency</strong> — Qatari Riyal (QAR). Credit cards are widely accepted. ATMs are common in malls, metro stations, and near stadiums</li>
  <li><strong>Transport apps</strong> — Uber and Karwa Taxi both operate in Qatar. The Doha Metro is clean, affordable, and connects all three venue areas</li>
  <li><strong>Language</strong> — Arabic is the official language, but English is widely spoken in hotels, restaurants, and at transport hubs</li>
</ul>
<p>For questions about the ordering process, delivery, or any event-related queries, see the <a href="/faq">FAQ page</a> or contact <strong>support@footballfestivalqatar.com</strong>.</p>`,
    },
  ],
  cta: {
    text: "View Schedule",
    href: "/schedule",
  },
  internalLinks: [
    { label: "Schedule", sublabel: "Dates & match days", href: "/schedule" },
    { label: "About Tournament", sublabel: "Guide & format", href: "/about-tournament" },
    { label: "FAQ", sublabel: "Common questions", href: "/faq" },
    { label: "All Matches", sublabel: "View available sessions", href: "/" },
  ],
}

export default seo
