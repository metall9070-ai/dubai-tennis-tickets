import { notFound } from "next/navigation"
import { loadSEOStrict } from "@/lib/seo-loader"
import { buildMetadata } from "@/lib/seo/buildMetadata"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"

/**
 * Slugs that have dedicated routes at different URLs.
 * Blocked here to prevent duplicate content (SEO).
 *
 * Content file slug  →  Canonical dedicated route
 * refund             →  /refund-policy
 * privacy            →  /privacy-policy
 * terms              →  /terms-of-service
 * homepage           →  / (internal content, not a standalone page)
 */
const BLOCKED_SLUGS = new Set([
  "refund",
  "privacy",
  "terms",
  "homepage",
])

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  if (BLOCKED_SLUGS.has(slug)) return {}

  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"
  const seo = await loadSEOStrict(siteCode, slug)

  if (!seo) return {}

  return buildMetadata({
    path: `/${slug}`,
    title: seo.title,
    description: seo.description,
  })
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
  if (BLOCKED_SLUGS.has(slug)) notFound()

  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"
  const seo = await loadSEOStrict(siteCode, slug)

  if (!seo) notFound()

  return (
    <div className="relative min-h-screen bg-[#f5f5f7]">
      <Navbar isVisible />
      <ContentPage content={seo} />
      <Footer />
    </div>
  )
}
