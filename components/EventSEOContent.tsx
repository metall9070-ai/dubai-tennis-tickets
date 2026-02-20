'use client';

import React from 'react';
import type { EventSEO } from '@/types/seo';

interface EventSEOContentProps {
  eventSEO: EventSEO;
}

/**
 * Event-level SEO content block
 * Renders below ticket selection, above WhyBuy
 *
 * Frontend-only. CRM does not store SEO.
 */
const EventSEOContent: React.FC<EventSEOContentProps> = ({ eventSEO }) => {
  return (
    <>
      {/* SEO Content Block */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 border-b border-[#f5f5f7]">
        <div className="prose prose-lg max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1d1d1f] mb-6 tracking-tight">
            {eventSEO.h1}
          </h1>

          <div
            className="text-[#1d1d1f] leading-relaxed event-seo-content"
            dangerouslySetInnerHTML={{ __html: eventSEO.content }}
          />
        </div>
      </div>

      {/* FAQ Block */}
      {eventSEO.faq && eventSEO.faq.length > 0 && (
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-8 md:py-12 border-b border-[#f5f5f7]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1d1d1f] mb-6 md:mb-8 tracking-tight">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {eventSEO.faq.map((item, index) => (
              <div key={index} className="bg-[#f5f5f7] rounded-2xl p-6 md:p-8">
                <h3 className="text-lg md:text-xl font-semibold text-[#1d1d1f] mb-3">
                  {item.question}
                </h3>
                <p className="text-[15px] md:text-[17px] text-[#86868b] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Styling for SEO content */}
      <style jsx>{`
        .event-seo-content :global(h2) {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1d1d1f;
          margin-top: 2rem;
          margin-bottom: 1rem;
          line-height: 1.3;
        }

        .event-seo-content :global(h3) {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1d1d1f;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }

        .event-seo-content :global(p) {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: #1d1d1f;
        }

        .event-seo-content :global(ul),
        .event-seo-content :global(ol) {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .event-seo-content :global(li) {
          margin-bottom: 0.5rem;
          line-height: 1.6;
          color: #1d1d1f;
        }

        .event-seo-content :global(strong) {
          font-weight: 600;
          color: #1d1d1f;
        }

        .event-seo-content :global(a) {
          color: var(--color-primary);
          text-decoration: underline;
        }

        .event-seo-content :global(a:hover) {
          color: var(--color-primary-hover);
        }
      `}</style>
    </>
  );
};

export default EventSEOContent;
