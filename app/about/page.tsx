import { redirect } from "next/navigation"

/**
 * Redirect /about → /about-us (canonical URL).
 * Prevents duplicate content for SEO.
 */
export default function AboutRedirect() {
  redirect("/about-us")
}
