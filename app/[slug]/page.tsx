import { notFound } from "next/navigation"
import { loadSEOStrict } from "@/lib/seo-loader"
import Navbar from "@/app/components/Navbar"
import Footer from "@/app/components/Footer"
import ContentPage from "@/app/components/ContentPage"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ""
  const seo = await loadSEOStrict(siteCode, slug)

  if (!seo) return {}

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
  }
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params
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
