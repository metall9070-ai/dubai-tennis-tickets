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

  // Hide map for Jassim Bin Hamad Stadium
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

  // Load SVG and inject into DOM
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fetch(svgPath)
      .then(res => res.text())
      .then(svgText => {
        container.innerHTML = svgText;
        setSvgLoaded(true);
        console.log('[StadiumMap] SVG loaded and injected');
      })
      .catch(err => console.error('[StadiumMap] Failed to load SVG:', err));
  }, [svgPath]);

  // Setup interactivity after SVG is loaded
  useEffect(() => {
    if (!svgLoaded || !containerRef.current) return;

    const container = containerRef.current;
    const categories = ["category-1", "category-2", "category-3"];
    const cleanupFunctions: (() => void)[] = [];

    categories.forEach((category) => {
      const groups = container.querySelectorAll(`[data-category="${category}"]`);
      console.log(`[StadiumMap] Found ${groups.length} groups for ${category}`);

      groups.forEach((group) => {
        const element = group as SVGGElement;

        // Set cursor
        element.style.cursor = soldOutCategories.includes(category) ? 'not-allowed' : 'pointer';

        // Apply active state brightness
        if (activeCategory === category && !soldOutCategories.includes(category)) {
          element.style.filter = 'brightness(1.35)';
        } else {
          element.style.filter = '';
        }

        const handleMouseEnter = () => {
          if (!soldOutCategories.includes(category)) {
            element.style.filter = 'brightness(1.35)';
            onCategoryHover?.(category);
          }
        };

        const handleMouseLeave = () => {
          if (!soldOutCategories.includes(category)) {
            if (activeCategory !== category) {
              element.style.filter = '';
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

    return () => cleanupFunctions.forEach(fn => fn());
  }, [svgLoaded, onCategoryHover, onCategoryClick, soldOutCategories, activeCategory]);

  return <div ref={containerRef} className="stadium-map w-full" style={{ minHeight: '400px' }} />;
}
