import { loadSEO } from "@/lib/seo-loader"
import { buildMetadata } from "@/lib/seo/buildMetadata"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"
import RefundClient from "./RefundClient"

const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"

export async function generateMetadata() {
  const seo = await loadSEO(siteCode, "refund")

  return buildMetadata({
    path: "/refund-policy",
    title: seo.title || "Refund Policy",
    description: seo.description || "",
  })
}

export default async function RefundPolicyPage() {
  const seo = await loadSEO(siteCode, "refund")

  if (seo.sections && seo.sections.length > 0) {
    return (
      <div className="relative min-h-screen bg-[#f5f5f7]">
        <Navbar isVisible />
        <ContentPage content={seo} />
        <Footer />
      </div>
    )
  }

  return <RefundClient />
}
