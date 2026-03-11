import { redirect } from "next/navigation"

/**
 * Redirect /privacy → /privacy-policy (canonical URL).
 * Prevents duplicate content for SEO.
 */
export default function PrivacyRedirect() {
  redirect("/privacy-policy")
}
