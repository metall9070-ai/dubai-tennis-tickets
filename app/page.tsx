import { loadSEO } from '@/lib/seo-loader';
import { resolveTemplate } from '@/lib/template-resolver';
import type { TemplateType } from '@/types/template';

export async function generateMetadata() {
  const siteCode = process.env.NEXT_PUBLIC_SITE_CODE || "default"
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
  const seo = await loadSEO(siteCode, "homepage")

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: baseUrl,
    },
  }
}

export default async function HomePage() {
  const templateType =
    (process.env.NEXT_PUBLIC_TEMPLATE_TYPE as TemplateType) || "tournament"
  const Template = resolveTemplate(templateType)

  return <Template />
}
