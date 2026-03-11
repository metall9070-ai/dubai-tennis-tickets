import { redirect } from "next/navigation"

/**
 * Redirect /terms → /terms-of-service (canonical URL).
 * Prevents duplicate content for SEO.
 */
export default function TermsRedirect() {
  redirect("/terms-of-service")
}
