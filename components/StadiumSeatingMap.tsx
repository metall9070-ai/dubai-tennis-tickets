'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Category {
  id: number;
  name: string;
  color: string;
}

interface StadiumSeatingMapProps {
  categories: Category[];
  hoveredCategory: number | null;
  onHoverCategory: (categoryId: number | null) => void;
  onSelectCategory: (categoryId: number) => void;
}

// Map SVG data-category values to our category IDs
const CATEGORY_MAP: Record<string, number> = {
  'prime-b': 1,           // Premium Courtside
  'prime-a': 2,           // Prime A
  'grandstand-upper': 3,  // Grandstand Upper
  'grandstand-lower': 4,  // Grandstand Lower
};

// SVG original dimensions from viewBox
const SVG_WIDTH = 2142.21;
const SVG_HEIGHT = 2019.85;

// Zoom constraints
const MAX_ZOOM_FACTOR = 4.0;
const ZOOM_PERCENT_STEP = 10;

const StadiumSeatingMap: React.FC<StadiumSeatingMapProps> = ({
  categories,
  hoveredCategory,
  onHoverCategory,
  onSelectCategory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Refs для стабильных callback'ов (не вызывают перезапуск эффектов)
  const onHoverCategoryRef = useRef(onHoverCategory);
  const onSelectCategoryRef = useRef(onSelectCategory);
  onHoverCategoryRef.current = onHoverCategory;
  onSelectCategoryRef.current = onSelectCategory;

  const [svgLoaded, setSvgLoaded] = useState(false);
  const [svgContent, setSvgContent] = useState<string>('');
  const [scaleReady, setScaleReady] = useState(false);
  const [svgRefReady, setSvgRefReady] = useState(false);

  // Transform state
  const [scale, setScale] = useState(0.2);
  const [initialScale, setInitialScale] = useState(0.2);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  // Drag state
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [translateStart, setTranslateStart] = useState({ x: 0, y: 0 });

  // Calculate initial scale to fit container
  const calculateFitScale = useCallback(() => {
    if (!containerRef.current) return 1;
    const containerWidth = containerRef.current.clientWidth - 32;
    const containerHeight = containerRef.current.clientHeight - 32;
    const scaleX = containerWidth / SVG_WIDTH;
    const scaleY = containerHeight / SVG_HEIGHT;
    return Math.min(scaleX, scaleY);
  }, []);

  // Load SVG
  useEffect(() => {
    fetch('/scheme.svg')
      .then(res => res.text())
      .then(content => {
        const modifiedSvg = content.replace(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2142.21 2019.85">',
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2142.21 2019.85" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" style="display:block;">`
        );
        setSvgContent(modifiedSvg);
        setSvgLoaded(true);
      })
      .catch(err => console.error('Failed to load SVG:', err));
  }, []);

  // Set initial scale
  useEffect(() => {
    if (!svgLoaded || !containerRef.current) return;
    const timer = setTimeout(() => {
      const fitScale = calculateFitScale();
      setInitialScale(fitScale);
      setScale(fitScale);
      setScaleReady(true);
    }, 50);
    return () => clearTimeout(timer);
  }, [svgLoaded, calculateFitScale]);

  // Get SVG ref
  useEffect(() => {
    if (!svgLoaded || !containerRef.current) return;
    const timer = setTimeout(() => {
      const svg = containerRef.current?.querySelector('svg');
      if (svg) {
        svgRef.current = svg as SVGSVGElement;
        setSvgRefReady(true);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [svgLoaded, svgContent]);

  // Apply hover styles
  useEffect(() => {
    if (!svgRefReady || !svgRef.current) return;

    const svg = svgRef.current;
    const categoryGroups = svg.querySelectorAll('[data-category]');

    categoryGroups.forEach((group) => {
      const categoryName = group.getAttribute('data-category');
      if (!categoryName) return;

      const categoryId = CATEGORY_MAP[categoryName];
      if (!categoryId) return;

      const isHovered = hoveredCategory === categoryId;
      const isOtherHovered = hoveredCategory !== null && hoveredCategory !== categoryId;

      const elements = group.querySelectorAll('path, polygon, rect');
      elements.forEach((el) => {
        const element = el as SVGElement;
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        element.style.cursor = 'pointer';

        if (isHovered) {
          element.style.filter = 'brightness(1.15) saturate(1.3) drop-shadow(0 4px 8px rgba(0,0,0,0.2))';
          element.style.opacity = '1';
        } else if (isOtherHovered) {
          element.style.filter = 'brightness(0.9) saturate(0.8)';
          element.style.opacity = '0.3';
        } else {
          element.style.filter = 'none';
          element.style.opacity = '0.85';
        }
      });

      const textElements = group.querySelectorAll('text, tspan');
      textElements.forEach((el) => {
        const textEl = el as SVGElement;
        textEl.style.transition = 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        textEl.style.opacity = isOtherHovered ? '0.3' : '1';
      });
    });
  }, [svgRefReady, hoveredCategory]);

  // Attach event listeners - ОДИН РАЗ при svgRefReady
  useEffect(() => {
    if (!svgRefReady || !svgRef.current) return;

    const svg = svgRef.current;

    const findCategoryFromTarget = (target: Element | null): number | null => {
      if (!target) return null;
      const categoryGroup = target.closest('[data-category]');
      if (categoryGroup) {
        const categoryName = categoryGroup.getAttribute('data-category');
        if (categoryName && CATEGORY_MAP[categoryName]) {
          return CATEGORY_MAP[categoryName];
        }
      }
      return null;
    };

    const handleMouseOver = (e: Event) => {
      if (isDraggingRef.current) return;
      const target = e.target as Element;
      const categoryId = findCategoryFromTarget(target);
      if (categoryId !== null) {
        onHoverCategoryRef.current(categoryId);
      }
    };

    const handleMouseOut = (e: Event) => {
      if (isDraggingRef.current) return;
      const relatedTarget = (e as MouseEvent).relatedTarget as Element | null;

      // Проверяем, уходит ли курсор за пределы SVG
      if (!relatedTarget || !svg.contains(relatedTarget)) {
        onHoverCategoryRef.current(null);
        return;
      }

      const newCategoryId = findCategoryFromTarget(relatedTarget);
      if (newCategoryId !== null) {
        onHoverCategoryRef.current(newCategoryId);
      }
    };

    const handleClick = (e: Event) => {
      if (isDraggingRef.current) return;
      const target = e.target as Element;
      const categoryId = findCategoryFromTarget(target);
      if (categoryId !== null) {
        onSelectCategoryRef.current(categoryId);
      }
    };

    svg.addEventListener('mouseover', handleMouseOver);
    svg.addEventListener('mouseout', handleMouseOut);
    svg.addEventListener('click', handleClick);

    return () => {
      svg.removeEventListener('mouseover', handleMouseOver);
      svg.removeEventListener('mouseout', handleMouseOut);
      svg.removeEventListener('click', handleClick);
    };
  }, [svgRefReady]); // Только svgRefReady - НЕ callbacks

  // Sync isDragging to ref
  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  // Calculate bounds for panning
  const calculateBounds = useCallback(() => {
    if (!containerRef.current) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const scaledWidth = SVG_WIDTH * scale;
    const scaledHeight = SVG_HEIGHT * scale;
    const excessWidth = Math.max(0, scaledWidth - containerWidth);
    const excessHeight = Math.max(0, scaledHeight - containerHeight);
    return {
      minX: -excessWidth / 2,
      maxX: excessWidth / 2,
      minY: -excessHeight / 2,
      maxY: excessHeight / 2,
    };
  }, [scale]);

  const clampTranslation = useCallback((x: number, y: number) => {
    const bounds = calculateBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: Math.max(bounds.minY, Math.min(bounds.maxY, y)),
    };
  }, [calculateBounds]);

  // Drag handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (scale <= initialScale * 1.1) return;
    const target = e.target as Element;
    if (target.closest('[data-category]')) return;

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setTranslateStart({ x: translateX, y: translateY });
    (e.target as Element).setPointerCapture(e.pointerId);
  }, [scale, initialScale, translateX, translateY]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    const newTranslate = clampTranslation(translateStart.x + dx, translateStart.y + dy);
    setTranslateX(newTranslate.x);
    setTranslateY(newTranslate.y);
  }, [isDragging, dragStart, translateStart, clampTranslation]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as Element).releasePointerCapture(e.pointerId);
    }
  }, [isDragging]);

  // Zoom
  const minZoom = React.useMemo(() => initialScale * 0.8, [initialScale]);
  const maxZoom = React.useMemo(() => initialScale * MAX_ZOOM_FACTOR, [initialScale]);
  const zoomStep = React.useMemo(() => initialScale * (ZOOM_PERCENT_STEP / 100), [initialScale]);

  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + zoomStep, maxZoom));
  }, [zoomStep, maxZoom]);

  const handleZoomOut = useCallback(() => {
    setScale(prev => {
      const newScale = Math.max(prev - zoomStep, minZoom);
      if (newScale <= initialScale * 1.05) {
        setTranslateX(0);
        setTranslateY(0);
      }
      return newScale;
    });
  }, [zoomStep, minZoom, initialScale]);

  const handleZoomReset = useCallback(() => {
    setScale(initialScale);
    setTranslateX(0);
    setTranslateY(0);
  }, [initialScale]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const target = e.target as Element;
    if (target.closest('[data-category]')) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
    setScale(prev => {
      const newScale = Math.max(minZoom, Math.min(maxZoom, prev + delta));
      if (newScale <= initialScale * 1.05) {
        setTranslateX(0);
        setTranslateY(0);
      }
      return newScale;
    });
  }, [zoomStep, minZoom, maxZoom, initialScale]);

  const canPan = scale > initialScale * 1.1;
  const rawZoomPercent = initialScale > 0 ? (scale / initialScale) * 100 : 100;
  const zoomPercent = Math.round(rawZoomPercent / 10) * 10;

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="relative w-full bg-[#f8f9fb] rounded-[24px] overflow-hidden border border-black/5"
        style={{ height: '520px' }}
        onWheel={handleWheel}
        onPointerMove={isDragging ? handlePointerMove : undefined}
        onPointerUp={isDragging ? handlePointerUp : undefined}
        onPointerLeave={isDragging ? handlePointerUp : undefined}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ padding: '16px' }}
        >
          <div
            className="stadium-svg-container"
            style={{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
              willChange: 'transform',
              opacity: scaleReady ? 1 : 0,
              cursor: canPan ? (isDragging ? 'grabbing' : 'grab') : 'default',
            }}
            onPointerDown={canPan ? handlePointerDown : undefined}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
          <button
            onClick={handleZoomIn}
            disabled={scale >= maxZoom}
            className="w-10 h-10 bg-white rounded-xl shadow-lg border border-black/5 flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
            </svg>
          </button>
          <button
            onClick={handleZoomReset}
            className="w-10 h-10 bg-white rounded-xl shadow-lg border border-black/5 flex items-center justify-center text-[11px] font-bold text-[#86868b] hover:bg-[#f5f5f7] active:scale-95 transition-all"
          >
            {zoomPercent}%
          </button>
          <button
            onClick={handleZoomOut}
            disabled={scale <= minZoom}
            className="w-10 h-10 bg-white rounded-xl shadow-lg border border-black/5 flex items-center justify-center text-[#1d1d1f] hover:bg-[#f5f5f7] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
        </div>

        {canPan && !isDragging && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1.5 rounded-full text-xs font-medium z-10 pointer-events-none">
            Drag to pan
          </div>
        )}

        {hoveredCategory && !isDragging && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1d1d1f] text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold z-10 pointer-events-none">
            {categories.find(c => c.id === hoveredCategory)?.name}
          </div>
        )}

        {(!svgLoaded || !scaleReady) && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#f8f9fb] z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-[#86868b] font-medium">Loading seating map...</span>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-3 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-2xl shadow-sm border border-black/5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${
              hoveredCategory === cat.id
                ? 'bg-black/5 scale-105'
                : hoveredCategory !== null && hoveredCategory !== cat.id
                  ? 'opacity-40'
                  : 'hover:bg-black/5'
            }`}
            onMouseEnter={() => onHoverCategory(cat.id)}
            onMouseLeave={() => onHoverCategory(null)}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div
              className="w-3.5 h-3.5 rounded-sm shadow-sm"
              style={{ backgroundColor: cat.color }}
            />
            <span className="text-[11px] font-semibold text-[#1d1d1f] whitespace-nowrap">
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .stadium-svg-container [data-category] path,
        .stadium-svg-container [data-category] polygon,
        .stadium-svg-container [data-category] rect {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default StadiumSeatingMap;
