import Link from "next/link"
import Breadcrumbs from "@/components/Breadcrumbs"
import type { SEOContent } from "@/types/seo"

export default function ContentPage({ content, embedded, children }: { content: SEOContent; embedded?: boolean; children?: React.ReactNode }) {
  if (!content.h1) return null

  // When embedded, hero is suppressed — ContentPage is used as SEO text block below event listing
  const heroImage = !embedded ? content.heroImage : undefined
  // Show hero block on all standalone info pages (those with breadcrumbLabel)
  // Hero renders with dark gradient background; heroImage is optional on top
  const showHero = !embedded && !!content.breadcrumbLabel

  return (
    <article className={`${embedded
      ? 'pt-12 sm:pt-16 md:pt-24'
      : showHero
        ? ''
        : 'pt-24 sm:pt-28 md:pt-32'
    } pb-12 sm:pb-16 bg-[#f5f5f7] text-[#1d1d1f]`}>

      {/* Hero Section — shown on all standalone info pages (image is optional) */}
      {showHero && (
        <section className="relative pt-12 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#1d1d1f] to-[#2d2d2f] text-white overflow-hidden">
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

        {/* Stats Grid — infographic, shown below hero or below h1 */}
        {content.stats && content.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 sm:mb-12">
            {content.stats.map((stat, i) => (
              <div key={i} className="bg-white rounded-xl p-4 sm:p-5 text-center">
                <div className="text-[22px] sm:text-[26px] font-bold text-[#1d1d1f]">
                  {stat.value}
                </div>
                <div className="text-[12px] sm:text-[13px] text-[#86868b] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Highlights Grid — icon cards */}
        {content.highlights && content.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-10 sm:mb-12">
            {content.highlights.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1d1d1f] text-[15px] sm:text-[16px] mb-2">{item.title}</h3>
                <p className="text-[13px] sm:text-[14px] text-[#86868b] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        )}

        {/* Children slot — rendered after highlights, before sections */}
        {children}

        {/* Sections */}
        {content.sections?.map((section, i) => (
          <section key={i} className="mb-10 sm:mb-12">
            <h2 className="text-[22px] sm:text-[26px] md:text-[32px] font-bold tracking-tight mb-4 sm:mb-6 leading-tight">
              {section.heading}
            </h2>
            <div
              className="text-[15px] sm:text-[16px] md:text-[17px] text-[#1d1d1f]/80 leading-relaxed [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-1.5 [&_strong]:text-[#1d1d1f] [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: section.body }}
            />
          </section>
        ))}

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
                      className="w-5 h-5 text-[#86868b] shrink-0 ml-4 transition-transform group-open:rotate-45"
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
                  <div className="px-5 pb-4 text-[14px] sm:text-[15px] text-[#1d1d1f]/70 leading-relaxed">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        {content.cta && (
          <div className="text-center py-8 sm:py-10">
            <Link
              href={content.cta.href}
              className="inline-block bg-[var(--color-primary)] text-white px-8 py-3.5 rounded-full text-[15px] sm:text-[16px] font-semibold hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              {content.cta.text}
            </Link>
          </div>
        )}

        {/* Internal Links */}
        {content.internalLinks && content.internalLinks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 sm:pt-6">
            {content.internalLinks.map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="min-h-[56px] p-3 sm:p-4 bg-white rounded-xl text-center hover:shadow-md active:bg-gray-50 transition-all"
              >
                <span className="text-[13px] sm:text-sm font-semibold text-[#1d1d1f] block">
                  {link.label}
                </span>
                {link.sublabel && (
                  <span className="text-[11px] sm:text-xs text-[#86868b]">
                    {link.sublabel}
                  </span>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
