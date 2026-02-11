'use client';

import React from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  currentPage: string;
  light?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || '';

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, currentPage, light = false }) => {
  // Generate Schema.org BreadcrumbList JSON-LD
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      ...items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.label,
        "item": item.href ? `${SITE_URL}${item.href}` : undefined
      })),
      {
        "@type": "ListItem",
        "position": items.length + 1,
        "name": currentPage
      }
    ]
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="py-4">
        <ol className={`flex items-center flex-wrap text-sm ${light ? 'text-white/70' : 'text-[#86868b]'}`}>
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {item.onClick ? (
                <a
                  href={item.href || '#'}
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick?.();
                  }}
                  className={`transition-colors ${light ? 'hover:text-white' : 'hover:text-[#1e824c]'}`}
                >
                  {item.label}
                </a>
              ) : (
                <span>{item.label}</span>
              )}
              <svg
                className={`w-4 h-4 mx-2 ${light ? 'text-white/40' : 'text-[#d2d2d7]'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </li>
          ))}
          <li>
            <span className={`font-medium ${light ? 'text-white' : 'text-[#1d1d1f]'}`} aria-current="page">
              {currentPage}
            </span>
          </li>
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
