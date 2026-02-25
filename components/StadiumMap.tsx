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
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  if (venue?.includes('Jassim Bin Ham')) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center px-6">
          Stadium seating map will be available soon
        </p>
      </div>
    );
  }

  const svgPath = venue?.includes('Lusail') ? '/lusail.svg?v=6' : '/stadium.svg';

  // Active category is either controlled (from parent) or local hover
  const effectiveActiveCategory = activeCategory || hoveredCategory;

  // Load SVG once and immediately apply sold-out state
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fetch(svgPath)
      .then(res => res.text())
      .then(svgText => {
        container.innerHTML = svgText;

        // IMMEDIATELY apply sold-out classes after SVG loads (before setSvgLoaded)
        // This prevents flash of colored categories before sold-out state is applied
        const categories = ["category-1", "category-2", "category-3"];
        categories.forEach((category) => {
          const groups = container.querySelectorAll(`[data-category="${category}"]`);
          groups.forEach((group) => {
            if (soldOutCategories.includes(category)) {
              group.classList.add('sold-out');
              (group as SVGGElement).style.cursor = 'not-allowed';
            }
          });
        });

        setSvgLoaded(true);
        console.log(`[StadiumMap] Loaded ${svgPath}`);
      })
      .catch(err => console.error('[StadiumMap] Failed to load SVG:', err));
  }, [svgPath, soldOutCategories]);

  // Apply CSS classes to categories based on state
  useEffect(() => {
    if (!svgLoaded || !containerRef.current) return;

    const container = containerRef.current;
    const categories = ["category-1", "category-2", "category-3"];

    categories.forEach((category) => {
      const groups = container.querySelectorAll(`[data-category="${category}"]`);

      groups.forEach((group) => {
        // Remove all state classes
        group.classList.remove('active', 'sold-out', 'inactive');

        // Add sold-out class
        if (soldOutCategories.includes(category)) {
          group.classList.add('sold-out');
        }

        // Add active class if this category is hovered
        if (effectiveActiveCategory === category && !soldOutCategories.includes(category)) {
          group.classList.add('active');
        }

        // Add inactive class if another category is hovered (dimmed effect)
        if (effectiveActiveCategory && effectiveActiveCategory !== category && !soldOutCategories.includes(category)) {
          group.classList.add('inactive');
        }

        // Set cursor
        (group as SVGGElement).style.cursor = soldOutCategories.includes(category)
          ? 'not-allowed'
          : 'pointer';
      });
    });
  }, [svgLoaded, effectiveActiveCategory, soldOutCategories]);

  // Set up event handlers
  useEffect(() => {
    if (!svgLoaded || !containerRef.current) return;

    const container = containerRef.current;
    const categories = ["category-1", "category-2", "category-3"];

    // Helper: get category from element or its parents
    const getCategoryFromElement = (element: Element | null): string | null => {
      let current = element;
      while (current && current !== container) {
        const category = current.getAttribute('data-category');
        if (category && categories.includes(category)) {
          return category;
        }
        current = current.parentElement;
      }
      return null;
    };

    const handleMouseOver = (e: MouseEvent) => {
      const category = getCategoryFromElement(e.target as Element);
      if (category && !soldOutCategories.includes(category)) {
        setHoveredCategory(category);
        onCategoryHover?.(category);
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const fromCategory = getCategoryFromElement(e.target as Element);
      const toCategory = getCategoryFromElement(e.relatedTarget as Element);

      if (fromCategory && fromCategory !== toCategory) {
        setHoveredCategory(null);
        onCategoryHover?.(null);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const category = getCategoryFromElement(e.target as Element);
      if (category && !soldOutCategories.includes(category)) {
        onCategoryClick?.(category);
      }
    };

    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
      container.removeEventListener("click", handleClick);
    };
  }, [svgLoaded, onCategoryHover, onCategoryClick, soldOutCategories]);

  return (
    <div className="stadium-map-container w-full" style={{ minHeight: '400px' }}>
      <style jsx global>{`
        .stadium-map-container {
          /* Category base colors */
          --category-1-base: #800D2F;
          --category-1-hover: #A61C47;  /* Subtle - +8% lightness (reduced by 2 tones) */

          --category-2-base: #C73866;
          --category-2-hover: #D44B7A;  /* Subtle - +8% lightness (reduced by 2 tones) */

          --category-3-base: #FFB5A7;
          --category-3-hover: #FFC2B8;  /* Subtle - +3% lightness (reduced by 2 tones) */

          --sold-out-color: #CFCFCF;
        }

        /* Category 1 - Burgundy */
        [data-category="category-1"] {
          color: var(--category-1-base);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        [data-category="category-1"].active {
          color: var(--category-1-hover);
        }

        /* Category 2 - Pink */
        [data-category="category-2"] {
          color: var(--category-2-base);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        [data-category="category-2"].active {
          color: var(--category-2-hover);
        }

        /* Category 3 - Peach */
        [data-category="category-3"] {
          color: var(--category-3-base);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        [data-category="category-3"].active {
          color: var(--category-3-hover);
        }

        /* Inactive state - dimmed when another category is hovered */
        [data-category].inactive {
          opacity: 0.35;
          filter: none;
        }

        /* Sold out state */
        [data-category].sold-out {
          color: var(--sold-out-color) !important;
          cursor: not-allowed;
        }

        /* All shapes inherit color from parent */
        [data-category] polygon,
        [data-category] path,
        [data-category] rect,
        [data-category] circle {
          fill: currentColor !important;
        }

        /* Text labels always white */
        [data-category] text {
          fill: white !important;
          pointer-events: none;
        }
      `}</style>
      <div ref={containerRef} className="w-full" />
    </div>
  );
}
