import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML string to prevent XSS.
 * Allows safe HTML tags (headings, paragraphs, lists, links, formatting).
 */
export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'a', 'strong', 'em', 'b', 'i', 'u',
      'span', 'div', 'blockquote',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'img',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'width', 'height'],
  });
}

/**
 * Sanitize SVG string to prevent XSS while preserving SVG structure.
 * Allows SVG elements, presentation attributes, and data-* attributes
 * needed for interactive stadium maps.
 */
export function sanitizeSVG(svg: string): string {
  return DOMPurify.sanitize(svg, {
    USE_PROFILES: { svg: true, svgFilters: true },
    ADD_ATTR: ['data-category', 'viewBox', 'xmlns', 'style'],
  });
}
