import { sanitizeHTML, sanitizeSVG } from '@/lib/sanitize'

describe('sanitizeHTML', () => {
  it('allows safe HTML tags', () => {
    const input = '<p>Hello <strong>world</strong></p>'
    expect(sanitizeHTML(input)).toBe('<p>Hello <strong>world</strong></p>')
  })

  it('allows headings and lists', () => {
    const input = '<h1>Title</h1><ul><li>Item</li></ul>'
    expect(sanitizeHTML(input)).toBe('<h1>Title</h1><ul><li>Item</li></ul>')
  })

  it('allows links with href, target, rel', () => {
    const input = '<a href="https://example.com" target="_blank" rel="noopener">Link</a>'
    expect(sanitizeHTML(input)).toContain('href="https://example.com"')
    expect(sanitizeHTML(input)).toContain('target="_blank"')
  })

  it('allows images with safe attributes', () => {
    const input = '<img src="photo.jpg" alt="Photo" width="100" height="100">'
    const result = sanitizeHTML(input)
    expect(result).toContain('src="photo.jpg"')
    expect(result).toContain('alt="Photo"')
  })

  it('allows tables', () => {
    const input = '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>'
    expect(sanitizeHTML(input)).toContain('<table>')
    expect(sanitizeHTML(input)).toContain('<td>Cell</td>')
  })

  it('strips script tags (XSS prevention)', () => {
    const input = '<p>Safe</p><script>alert("xss")</script>'
    expect(sanitizeHTML(input)).not.toContain('<script>')
    expect(sanitizeHTML(input)).not.toContain('alert')
  })

  it('strips onclick attributes', () => {
    const input = '<div onclick="alert(1)">Click</div>'
    expect(sanitizeHTML(input)).not.toContain('onclick')
  })

  it('strips iframe tags', () => {
    const input = '<iframe src="https://evil.com"></iframe>'
    expect(sanitizeHTML(input)).not.toContain('<iframe')
  })

  it('handles empty input', () => {
    expect(sanitizeHTML('')).toBe('')
  })
})

describe('sanitizeSVG', () => {
  it('allows basic SVG structure', () => {
    const input = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="50" height="50"/></svg>'
    const result = sanitizeSVG(input)
    expect(result).toContain('<svg')
    expect(result).toContain('<rect')
    expect(result).toContain('viewBox')
  })

  it('allows data-category attribute', () => {
    const input = '<svg><path data-category="prime-a" d="M0 0"/></svg>'
    const result = sanitizeSVG(input)
    expect(result).toContain('data-category="prime-a"')
  })

  it('allows style attribute', () => {
    const input = '<svg><rect style="fill:red" width="50" height="50"/></svg>'
    const result = sanitizeSVG(input)
    expect(result).toContain('style=')
  })

  it('strips script tags from SVG', () => {
    const input = '<svg><script>alert("xss")</script><rect width="50" height="50"/></svg>'
    const result = sanitizeSVG(input)
    expect(result).not.toContain('<script>')
  })

  it('handles empty input', () => {
    expect(sanitizeSVG('')).toBe('')
  })
})
