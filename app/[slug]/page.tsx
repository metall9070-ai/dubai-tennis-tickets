import { notFound } from "next/navigation"
import { loadSEOStrict } from "@/lib/seo-loader"
import { resolveTemplate } from "@/lib/template-resolver"
import type { TemplateType } from "@/types/template"

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

  const templateType =
    (process.env.NEXT_PUBLIC_TEMPLATE_TYPE as TemplateType) || "tournament"
  const Template = resolveTemplate(templateType)

  return <Template />
}
