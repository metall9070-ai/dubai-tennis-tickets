import { notFound } from "next/navigation"
import { loadSEOStrict } from "@/lib/seo-loader"
import { buildMetadata } from "@/lib/seo/buildMetadata"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"

export async function generateMetadata() {
  const seo = await loadSEOStrict(siteCode, "privacy")

  if (!seo) return {}

  return buildMetadata({
    path: "/privacy",
    title: seo.title,
    description: seo.description,
  })
}

export default async function PrivacyPage() {
  const seo = await loadSEOStrict(siteCode, "privacy")

  if (!seo) notFound()

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible />
      <ContentPage content={seo} />
      <Footer />
    </div>
  )
}
