import { redirect } from "next/navigation"

/**
 * Redirect /payment-delivery → /payment-and-delivery (canonical URL).
 * Prevents duplicate content for SEO.
 */
export default function PaymentDeliveryRedirect() {
  redirect("/payment-and-delivery")
}
