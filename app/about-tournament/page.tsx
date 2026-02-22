import { notFound } from "next/navigation"
import { loadSEOStrict } from "@/lib/seo-loader"
import { buildMetadata } from "@/lib/seo/buildMetadata"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"

export async function generateMetadata() {
  const seo = await loadSEOStrict(siteCode, "about-tournament")

  if (!seo) return {}

  return buildMetadata({
    path: "/about-tournament",
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords?.join(", "),
  })
}

export default async function AboutTournamentPage() {
  const seo = await loadSEOStrict(siteCode, "about-tournament")

  if (!seo) notFound()

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible />
      <ContentPage content={seo} />
      <Footer />
    </div>
  )
}
