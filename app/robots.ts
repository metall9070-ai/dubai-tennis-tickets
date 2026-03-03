/**
 * robots.ts — dynamic robots.txt generation per site.
 *
 * Replaces the static public/robots.txt to ensure:
 * - Sitemap URL matches the deployed site (not hardcoded to one domain)
 * - Correct disallow rules for private paths
 *
 * Note: X-Robots-Tag header for .vercel.app domains is handled in vercel.json
 * to prevent preview/deployment URLs from being indexed.
 */

import { MetadataRoute } from "next"
import { getSiteUrl } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/checkout/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
