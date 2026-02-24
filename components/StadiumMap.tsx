"use client";

import { useEffect, useRef, useState } from "react";

interface StadiumMapProps {
  activeCategory?: string | null;
  onCategoryHover?: (cat: string | null) => void;
  onCategoryClick?: (cat: string) => void;
  soldOutCategories?: string[];
  venue?: string;
}

export default function StadiumMap({
  activeCategory,
  onCategoryHover,
  onCategoryClick,
  soldOutCategories = [],
  venue = 'Lusail Stadium',
}: StadiumMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);

  if (venue?.includes('Jassim Bin Ham')) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center px-6">
          Stadium seating map will be available soon
        </p>
      </div>
    );
  }

  const svgPath = venue?.includes('Lusail') ? '/lusail.svg' : '/stadium.svg';

  // Category base colors - must match the SVG styles
  const categoryColors: Record<string, string> = {
    'category-1': '#800D2F',
    'category-2': '#C73866',
    'category-3': '#FFB5A7',
  };

  // Lighter versions of the same colors for hover effect (30% lighter)
  const categoryHoverColors: Record<string, string> = {
    'category-1': '#A61C47', // Lighter burgundy - same hue, more lightness
    'category-2': '#E05788', // Lighter pink - same hue, more lightness
    'category-3': '#FFD4CA', // Lighter peachy pink - same hue, more lightness
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fetch(svgPath)
      .then(res => res.text())
      .then(svgText => {
        container.innerHTML = svgText;
        setSvgLoaded(true);
        console.log('[StadiumMap] SVG loaded');
      })
      .catch(err => console.error('[StadiumMap] Failed to load SVG:', err));
  }, [svgPath]);

  useEffect(() => {
    if (!svgLoaded || !containerRef.current) return;

    const container = containerRef.current;
    const categories = ["category-1", "category-2", "category-3"];
    const cleanupFunctions: (() => void)[] = [];

    categories.forEach((category) => {
      const parentGroups = container.querySelectorAll(`[data-category="${category}"]`);
      
      parentGroups.forEach((parentGroup) => {
        const childSections = parentGroup.querySelectorAll('[data-section]');
        console.log(`[StadiumMap] ${category}: ${childSections.length} sections`);

        childSections.forEach((section) => {
          const element = section as SVGGElement;

          // Apply uniform base color to ALL shapes in this section
          const baseColor = categoryColors[category];
          if (baseColor && !soldOutCategories.includes(category)) {
            const shapes = element.querySelectorAll('path, rect, polygon, circle');
            shapes.forEach((shape) => {
              (shape as SVGElement).style.fill = baseColor;
            });
          }

          // Set cursor
          element.style.cursor = soldOutCategories.includes(category) ? 'not-allowed' : 'pointer';

          // Apply active state
          if (activeCategory === category && !soldOutCategories.includes(category)) {
            const hoverColor = categoryHoverColors[category];
            const shapes = element.querySelectorAll('path, rect, polygon, circle');
            shapes.forEach((shape) => {
              (shape as SVGElement).style.fill = hoverColor;
            });
          }

          const handleMouseEnter = () => {
            if (!soldOutCategories.includes(category)) {
              const hoverColor = categoryHoverColors[category];
              const shapes = element.querySelectorAll('path, rect, polygon, circle');
              shapes.forEach((shape) => {
                (shape as SVGElement).style.fill = hoverColor;
              });
              onCategoryHover?.(category);
            }
          };

          const handleMouseLeave = () => {
            if (!soldOutCategories.includes(category)) {
              if (activeCategory !== category) {
                const baseColor = categoryColors[category];
                const shapes = element.querySelectorAll('path, rect, polygon, circle');
                shapes.forEach((shape) => {
                  (shape as SVGElement).style.fill = baseColor;
                });
              }
              onCategoryHover?.(null);
            }
          };

          const handleClick = () => {
            if (!soldOutCategories.includes(category)) {
              onCategoryClick?.(category);
            }
          };

          element.addEventListener("mouseenter", handleMouseEnter);
          element.addEventListener("mouseleave", handleMouseLeave);
          element.addEventListener("click", handleClick);

          cleanupFunctions.push(() => {
            element.removeEventListener("mouseenter", handleMouseEnter);
            element.removeEventListener("mouseleave", handleMouseLeave);
            element.removeEventListener("click", handleClick);
          });
        });
      });
    });

    return () => cleanupFunctions.forEach(fn => fn());
  }, [svgLoaded, onCategoryHover, onCategoryClick, soldOutCategories, activeCategory]);

  return <div ref={containerRef} className="stadium-map w-full" style={{ minHeight: '400px' }} />;
}
