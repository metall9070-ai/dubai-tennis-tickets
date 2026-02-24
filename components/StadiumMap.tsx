"use client";

import { useEffect, useRef } from "react";

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
  const objectRef = useRef<HTMLObjectElement>(null);

  // Hide map for Jassim Bin Hamad Stadium (no schema available)
  // Check both "Hamad" and "Hammad" spellings
  if (venue?.includes('Jassim Bin Ham')) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-center px-6">
          Stadium seating map will be available soon
        </p>
      </div>
    );
  }

  // Determine which SVG to use based on venue
  // Lusail Stadium uses lusail.svg, all other stadiums use stadium.svg
  const svgPath = venue?.includes('Lusail') ? '/lusail.svg' : '/stadium.svg';

  useEffect(() => {
    const objectElement = objectRef.current;
    if (!objectElement) return;

    const handleLoad = () => {
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) return;

      const categories = ["category-1", "category-2", "category-3"];

      categories.forEach((category) => {
        const groups = svgDoc.querySelectorAll(`[data-category="${category}"]`);
        if (groups.length === 0) return;

        groups.forEach((group) => {
          // Apply sold-out class if needed
          if (soldOutCategories.includes(category)) {
            group.classList.add("sold-out");
          } else {
            group.classList.remove("sold-out");
          }

          // Apply active class if this category is hovered from card
          if (activeCategory === category) {
            group.classList.add("active");
          } else {
            group.classList.remove("active");
          }

          // Remove existing listeners to prevent duplicates
          const newGroup = group.cloneNode(true) as SVGGElement;
          group.parentNode?.replaceChild(newGroup, group);

          // Re-apply classes after cloning
          if (soldOutCategories.includes(category)) {
            newGroup.classList.add("sold-out");
          }
          if (activeCategory === category) {
            newGroup.classList.add("active");
          }

          // Hover handler
          if (onCategoryHover) {
            newGroup.addEventListener("mouseenter", () => {
              if (!soldOutCategories.includes(category)) {
                onCategoryHover(category);
              }
            });

            newGroup.addEventListener("mouseleave", () => {
              onCategoryHover(null);
            });
          }

          // Click handler
          if (onCategoryClick) {
            newGroup.addEventListener("click", () => {
              if (!soldOutCategories.includes(category)) {
                onCategoryClick(category);
              }
            });
          }
        });
      });
    };

    objectElement.addEventListener("load", handleLoad);

    // Check if already loaded
    if (objectElement.contentDocument?.readyState === "complete") {
      handleLoad();
    }

    return () => {
      objectElement.removeEventListener("load", handleLoad);
    };
  }, [onCategoryHover, onCategoryClick, soldOutCategories, activeCategory, svgPath]);

  return (
    <div className={`stadium-map ${activeCategory ?? ""}`}>
      <object
        ref={objectRef}
        type="image/svg+xml"
        data={svgPath}
        className="w-full h-auto"
        aria-label="Stadium seating map"
      />
    </div>
  );
}
