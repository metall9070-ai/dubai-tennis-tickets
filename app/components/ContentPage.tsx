import Link from "next/link"
import type { SEOContent } from "@/types/seo"

export default function ContentPage({ content }: { content: SEOContent }) {
  if (!content.h1) return null

  return (
    <article className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16 bg-[#f5f5f7] text-[#1d1d1f]">
      <div className="container mx-auto px-4 sm:px-6 max-w-[980px]">
        {/* H1 */}
        <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-bold tracking-tight mb-8 sm:mb-10 md:mb-12 leading-tight">
          {content.h1}
        </h1>

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
