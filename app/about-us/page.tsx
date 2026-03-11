import { loadSEO } from "@/lib/seo-loader"
import { buildMetadata } from "@/lib/seo/buildMetadata"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"
import AboutClient from "./AboutClient"

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"

export async function generateMetadata() {
  const seo = await loadSEO(siteCode, "about-us")

  return buildMetadata({
    path: "/about-us",
    title: seo.title || "About Us",
    description: seo.description || "",
  })
}

export default async function AboutUsPage() {
  const seo = await loadSEO(siteCode, "about-us")

  // Content-driven: render via ContentPage when content file exists
  if (seo.sections && seo.sections.length > 0) {
    return (
      <div className="relative min-h-screen bg-[#f5f5f7]">
        <Navbar isVisible />
        <ContentPage content={seo} />
        <Footer />
      </div>
    )
  }

  // Fallback: legacy hardcoded component for sites without content file
  return <AboutClient />
}
