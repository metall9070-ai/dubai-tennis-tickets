import { loadSEO } from "@/lib/seo-loader"
import { buildMetadata } from "@/lib/seo/buildMetadata"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"
import PrivacyClient from "./PrivacyClient"

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"

export async function generateMetadata() {
  const seo = await loadSEO(siteCode, "privacy")

  return buildMetadata({
    path: "/privacy-policy",
    title: seo.title || "Privacy Policy",
    description: seo.description || "",
  })
}

export default async function PrivacyPage() {
  const seo = await loadSEO(siteCode, "privacy")

  if (seo.sections && seo.sections.length > 0) {
    return (
      <div className="relative min-h-screen bg-[#f5f5f7]">
        <Navbar isVisible />
        <ContentPage content={seo} />
        <Footer />
      </div>
    )
  }

  return <PrivacyClient />
}
