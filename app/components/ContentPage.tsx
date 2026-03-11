import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import type { SEOContent } from "@/types/seo"
import { getSiteConfig } from "@/lib/site-config"
import { icons } from "lucide-react"
import { sanitizeHTML } from "@/lib/sanitize"

function HighlightIcon({ name }: { name: string }) {
  // Convert kebab-case to PascalCase: "train-front" → "TrainFront"
  const pascalName = name.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase()) as keyof typeof icons
  const LucideIcon = icons[pascalName]
  if (!LucideIcon) return <span className="text-3xl">{name}</span>
  return <LucideIcon size={28} />
}

export default function ContentPage({ content, embedded, children }: { content: SEOContent; embedded?: boolean; children?: React.ReactNode }) {
  if (!content.h1) return null

  // When embedded, hero is suppressed — ContentPage is used as SEO text block below event listing
  const heroImage = !embedded ? content.heroImage : undefined
  // Show hero block on all standalone info pages (those with breadcrumbLabel)
  // Hero renders with dark gradient background; heroImage is optional on top
  const showHero = !embedded && !!content.breadcrumbLabel

  // Add extra padding if top disclaimer is present (32px disclaimer + 48px header = 80px total)
  const siteConfig = getSiteConfig()
  const hasTopDisclaimer = !!siteConfig.topDisclaimer
  const topPadding = hasTopDisclaimer
    ? (embedded ? 'pt-12 sm:pt-16 md:pt-24' : (showHero ? 'pt-8' : 'pt-[80px] sm:pt-[88px] md:pt-[96px]'))
    : (embedded ? 'pt-12 sm:pt-16 md:pt-24' : (showHero ? '' : 'pt-24 sm:pt-28 md:pt-32'))

  return (
    <article className={`${topPadding} pb-12 sm:pb-16 bg-white text-[#1d1d1f]`}>

      {/* Hero Section — shown on all standalone info pages (image is optional) */}
      {showHero && (
        <section className="relative pt-12 pb-6 md:pt-16 md:pb-8 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
          <div className="absolute inset-0 z-0">
            {/* NOTE: using <img> intentionally — next/image requires domain whitelisting
                incompatible with data-driven external URLs. fetchPriority=high for LCP. */}
            {heroImage && (
              <img
                src={heroImage}
                alt={content.heroAlt ?? content.h1 ?? ''}
                className="w-full h-full object-cover object-top opacity-50"
                fetchPriority="high"
                loading="eager"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1d1d1f] via-[#1d1d1f]/40 to-transparent" />
          </div>
          <div className="relative z-10 container mx-auto px-4 sm:px-6 max-w-[980px]">
            {content.breadcrumbLabel && (
              // TODO: "Home" label is hardcoded English — i18n blocker for future localization
              <Breadcrumbs
                items={[{ label: 'Home', href: '/' }]}
                currentPage={content.breadcrumbLabel}
                light
              />
            )}
            <div className="mt-8 md:mt-12">
              <h1 className="text-[32px] sm:text-[42px] md:text-[56px] font-bold tracking-tight leading-tight">
                {content.h1}
              </h1>
              {content.heroSubtitle && (
                <p className="text-lg md:text-xl text-white/80 max-w-2xl mt-3">
                  {content.heroSubtitle}
                </p>
              )}
              {content.heroDescription && (
                <p className="text-base text-white/60 max-w-2xl mt-3">
                  {content.heroDescription}
                </p>
              )}
            </div>
          </div>
          {/* Stats — floating row at bottom of hero */}
          {content.stats && content.stats.length > 0 && (
            <div className="relative z-10 mt-10 md:mt-14 container mx-auto px-4 sm:px-6 max-w-[980px] flex flex-wrap justify-between">
              {content.stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="text-[18px] sm:text-[22px] font-bold text-white">{stat.value}</span>
                  <span className="block text-[10px] sm:text-[11px] text-white/50 mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <div className={`container mx-auto px-4 sm:px-6 max-w-[980px] ${showHero ? 'pt-8 sm:pt-10' : ''}`}>

        {/* Breadcrumbs — no-hero fallback (pages without breadcrumbLabel) */}
        {!showHero && content.breadcrumbLabel && (
          <div className="pt-4 mb-2">
            {/* TODO: "Home" label is hardcoded English — i18n blocker for future localization */}
            <Breadcrumbs
              items={[{ label: 'Home', href: '/' }]}
              currentPage={content.breadcrumbLabel}
            />
          </div>
        )}

        {/* H1 — only when no hero */}
        {!showHero && (
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold tracking-tight mb-8 sm:mb-10 md:mb-12 leading-tight">
            {content.h1}
          </h1>
        )}

        {/* Stats Grid — fallback for pages without hero (stats render inside hero when available) */}
        {!showHero && content.stats && content.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 sm:mb-12">
            {content.stats.map((stat, i) => (
              <div key={i} className="bg-[#f5f5f7] rounded-xl p-4 sm:p-5 text-center">
                <div className="text-[22px] sm:text-[26px] font-bold text-[#1d1d1f]">
                  {stat.value}
                </div>
                <div className="text-[12px] sm:text-[13px] text-[#636366] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Highlights Grid — icon cards */}
        {content.highlights && content.highlights.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-10 sm:mb-12">
            {content.highlights.map((item, i) => (
              <div key={i} className="bg-[#f5f5f7] rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="text-[var(--color-primary)] mb-2 sm:mb-3"><HighlightIcon name={item.icon} /></div>
                <h3 className="font-bold text-[#1d1d1f] text-[13px] sm:text-[16px] mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-[11px] sm:text-[14px] text-[#636366] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Children slot — rendered after highlights, before sections */}
        {children}

        {/* Sections */}
        {content.sections?.map((section, i) => {
          const variant = section.variant ?? (embedded ? "plain" : "default")
          const isHighlighted = variant === "highlighted"
          const isPlain = variant === "plain"

          return (
            <section
              key={i}
              className={`mb-10 sm:mb-12 ${isHighlighted ? "bg-[#f5f5f7] p-6 sm:p-8 rounded-2xl sm:rounded-[32px] border border-black/5" : ""}`}
            >
              <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
                {section.heading}
              </h2>
              <div
                className={`text-[15px] sm:text-[16px] md:text-[17px] leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1.5 [&_strong]:text-[#1d1d1f] [&_strong]:font-semibold ${
                  isHighlighted
                    ? "text-[#1d1d1f]/80 font-medium"
                    : isPlain
                      ? "text-[#1d1d1f]/80"
                      : "text-[#1d1d1f]/80 pl-4 border-l-2 border-[var(--color-primary)]/20"
                }`}
                dangerouslySetInnerHTML={{ __html: sanitizeHTML(section.body) }}
              />
            </section>
          )
        })}

        {/* FAQ */}
        {content.faq && content.faq.length > 0 && (
          <section className="mb-10 sm:mb-12">
            <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold tracking-tight mb-6 leading-tight">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {content.faq.map((item, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-xl border border-black/5"
                >
                  <summary className="cursor-pointer select-none px-5 py-4 font-semibold text-[15px] sm:text-[16px] text-[#1d1d1f] list-none flex items-center justify-between">
                    {item.question}
                    <svg
                      className="w-5 h-5 text-[#636366] shrink-0 ml-4 transition-transform group-open:rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </summary>
                  <div className="px-5 pb-4 text-[14px] sm:text-[15px] text-[#1d1d1f]/70 leading-relaxed break-words">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA — hidden when embedded (user already scrolled past events) */}
        {!embedded && content.cta && (
          <div className="text-center py-8 sm:py-10">
            <Link
              href={content.cta.href}
              className="inline-block bg-[var(--color-primary)] text-white px-8 py-3.5 rounded-full text-[15px] sm:text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              {content.cta.text}
            </Link>
          </div>
        )}

        {/* Internal Links removed — duplicated by header nav + footer */}
      </div>
    </article>
  )
}
