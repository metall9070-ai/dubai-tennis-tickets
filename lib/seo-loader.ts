import { SEOContent } from "@/types/seo"

export async function loadSEO(
  siteCode: string,
  page: string
): Promise<SEOContent> {
  try {
    const content = await import(`@/content/${siteCode}/${page}`)
    return content.default as SEOContent
  } catch {
    try {
      const fallback = await import(`@/content/default/${page}`)
      return fallback.default as SEOContent
    } catch {
      return { title: "", description: "" }
    }
  }
}

/**
 * Strict loader: returns null if no content file exists for this site+page.
 * No fallback to default. Used by [slug] to enforce 404 on unknown slugs.
 */
export async function loadSEOStrict(
  siteCode: string,
  page: string
): Promise<SEOContent | null> {
  try {
    const content = await import(`@/content/${siteCode}/${page}`)
    return content.default as SEOContent
  } catch {
    return null
  }
}
