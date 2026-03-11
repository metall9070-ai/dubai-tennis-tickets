import { SEOContent } from "@/types/seo"

const seo: SEOContent = {
  title: "Privacy Policy — Football Festival Qatar",
  description:
    "How Football Festival Qatar collects, uses, and protects your data. Your information is handled securely and never sold to third parties.",
  h1: "Privacy Policy",
  sections: [
    {
      heading: "Information We Collect",
      body: `<p>When you place an order or contact us, we collect personal information necessary to fulfill your request. This includes your name, email address, phone number, and payment details.</p>
<p>We also collect non-personal information such as browser type, device information, and usage data through cookies and analytics tools to improve our service.</p>`,
    },
    {
      heading: "How We Use Your Information",
      body: `<p>Your personal information is used solely for order processing, ticket delivery, customer support, and communication related to your purchase. We do not sell, rent, or share your personal data with third parties for marketing purposes.</p>
<p>Non-personal data is used for website analytics, performance monitoring, and service improvement.</p>`,
    },
    {
      heading: "Data Security",
      body: `<p>All transactions are processed through Stripe, a PCI-DSS compliant payment processor. We do not store your credit card details on our servers.</p>
<p>We implement industry-standard security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>`,
    },
    {
      heading: "Cookies",
      body: `<p>Our website uses cookies for essential functionality and analytics (Google Analytics). You can manage cookie preferences through your browser settings.</p>`,
    },
    {
      heading: "Your Rights",
      body: `<p>You have the right to access, correct, or request deletion of your personal data. To exercise these rights, contact us at <strong>support@footballfestivalqatar.com</strong>.</p>`,
    },
    {
      heading: "Contact",
      body: `<p>For privacy-related inquiries, contact us at <strong>support@footballfestivalqatar.com</strong>.</p>`,
    },
  ],
}

export default seo
