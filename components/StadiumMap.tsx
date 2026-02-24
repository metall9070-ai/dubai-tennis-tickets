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

  console.log('[StadiumMap] Rendering with venue:', venue);

  // Hide map for Jassim Bin Hamad Stadium (no schema available)
  // Check both "Hamad" and "Hammad" spellings
  if (venue?.includes('Jassim Bin Ham')) {
    console.log('[StadiumMap] Hiding map for Jassim Bin Hamad Stadium');

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

  console.log('[StadiumMap] SVG path selected:', svgPath);

  useEffect(() => {
    console.log('[StadiumMap] useEffect running, svgPath:', svgPath);

    const objectElement = objectRef.current;
    if (!objectElement) {
      console.log('[StadiumMap] No objectElement reference');
      return;
    }

    let cleanupFunctions: (() => void)[] = [];
    let loadCheckInterval: NodeJS.Timeout | null = null;

    const setupInteractivity = () => {
      console.log('[StadiumMap] setupInteractivity called');
      const svgDoc = objectElement.contentDocument;
      if (!svgDoc) {
        console.log('[StadiumMap] No contentDocument available');
        return false;
      }

      console.log('[StadiumMap] SVG Document loaded, setting up event listeners');

      const categories = ["category-1", "category-2", "category-3"];

      // Clean up previous listeners
      cleanupFunctions.forEach(fn => fn());
      cleanupFunctions = [];

      categories.forEach((category) => {
        const groups = svgDoc.querySelectorAll(`[data-category="${category}"]`);
        console.log(`[StadiumMap] Found ${groups.length} groups for ${category}`);

        if (groups.length === 0) return;

        groups.forEach((group) => {
          const element = group as SVGGElement;

          // Set cursor style - THIS MAKES IT CLICKABLE
          if (!soldOutCategories.includes(category)) {
            element.style.cursor = 'pointer';
          } else {
            element.style.cursor = 'not-allowed';
          }

          // Apply sold-out class if needed
          if (soldOutCategories.includes(category)) {
            element.classList.add("sold-out");
          } else {
            element.classList.remove("sold-out");
          }

          // Apply active class and brightness if this category is hovered from card
          if (activeCategory === category) {
            element.classList.add("active");
            if (!soldOutCategories.includes(category)) {
              element.style.filter = 'brightness(1.35)';
            }
            console.log(`[StadiumMap] Added active class to ${category}`);
          } else {
            element.classList.remove("active");
            if (!soldOutCategories.includes(category)) {
              element.style.filter = '';
            }
          }

          // Hover handlers
          const handleMouseEnter = () => {
            console.log(`[StadiumMap] Mouse enter on ${category}`);
            if (!soldOutCategories.includes(category) && onCategoryHover) {
              element.classList.add("active");
              // Apply brightness filter directly for immediate visual feedback
              element.style.filter = 'brightness(1.35)';
              onCategoryHover(category);
            }
          };

          const handleMouseLeave = () => {
            console.log(`[StadiumMap] Mouse leave from ${category}`);
            if (onCategoryHover) {
              if (activeCategory !== category) {
                element.classList.remove("active");
                // Remove inline styles when not active
                if (!soldOutCategories.includes(category)) {
                  element.style.filter = '';
                }
              }
              onCategoryHover(null);
            }
          };

          const handleClick = () => {
            console.log(`[StadiumMap] Click on ${category}`);
            if (!soldOutCategories.includes(category) && onCategoryClick) {
              onCategoryClick(category);
            }
          };

          // Add event listeners
          if (onCategoryHover) {
            element.addEventListener("mouseenter", handleMouseEnter);
            element.addEventListener("mouseleave", handleMouseLeave);

            cleanupFunctions.push(() => {
              element.removeEventListener("mouseenter", handleMouseEnter);
              element.removeEventListener("mouseleave", handleMouseLeave);
            });
          }

          if (onCategoryClick) {
            element.addEventListener("click", handleClick);

            cleanupFunctions.push(() => {
              element.removeEventListener("click", handleClick);
            });
          }
        });
      });

      return true;
    };

    const handleLoad = () => {
      console.log('[StadiumMap] Load event triggered');
      const success = setupInteractivity();
      if (success && loadCheckInterval) {
        clearInterval(loadCheckInterval);
        loadCheckInterval = null;
      }
    };

    objectElement.addEventListener("load", handleLoad);
    console.log('[StadiumMap] Added load event listener');

    // Check if already loaded
    if (objectElement.contentDocument?.readyState === "complete") {
      console.log('[StadiumMap] SVG already loaded, calling setupInteractivity immediately');
      const success = setupInteractivity();
      if (!success) {
        console.log('[StadiumMap] Setup failed, will retry with interval');
      }
    }

    // Fallback: Check every 100ms for 2 seconds
    let attempts = 0;
    loadCheckInterval = setInterval(() => {
      attempts++;
      console.log(`[StadiumMap] Interval check attempt ${attempts}`);

      if (objectElement.contentDocument) {
        console.log('[StadiumMap] contentDocument found via interval check');
        const success = setupInteractivity();
        if (success && loadCheckInterval) {
          clearInterval(loadCheckInterval);
          loadCheckInterval = null;
        }
      }

      if (attempts >= 20) {
        console.log('[StadiumMap] Giving up after 20 attempts');
        if (loadCheckInterval) {
          clearInterval(loadCheckInterval);
          loadCheckInterval = null;
        }
      }
    }, 100);

    return () => {
      objectElement.removeEventListener("load", handleLoad);
      if (loadCheckInterval) {
        clearInterval(loadCheckInterval);
      }
      cleanupFunctions.forEach(fn => fn());
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
        onError={(e) => {
          console.error('[StadiumMap] Failed to load SVG:', svgPath, e);
        }}
        onLoad={(e) => {
          console.log('[StadiumMap] SVG loaded successfully:', svgPath);
        }}
      >
        <img src={svgPath} alt="Stadium seating map" className="w-full h-auto" />
      </object>
    </div>
  );
}
