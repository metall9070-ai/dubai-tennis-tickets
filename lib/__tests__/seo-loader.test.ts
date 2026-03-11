import { loadSEO, loadSEOStrict } from '@/lib/seo-loader'

// Mock dynamic imports
vi.mock('@/content/tennis/home', () => ({
  default: { title: 'Tennis Home', description: 'Tennis home desc' },
}))

vi.mock('@/content/default/home', () => ({
  default: { title: 'Default Home', description: 'Default home desc' },
}))

describe('loadSEO', () => {
  it('loads site-specific SEO content', async () => {
    const seo = await loadSEO('tennis', 'home')
    expect(seo.title).toBe('Tennis Home')
    expect(seo.description).toBe('Tennis home desc')
  })

  it('falls back to default when site content not found', async () => {
    const seo = await loadSEO('nonexistent', 'home')
    expect(seo.title).toBe('Default Home')
    expect(seo.description).toBe('Default home desc')
  })

  it('returns empty when both site and default not found', async () => {
    const seo = await loadSEO('nonexistent', 'nonexistent-page')
    expect(seo.title).toBe('')
    expect(seo.description).toBe('')
  })
})

describe('loadSEOStrict', () => {
  it('loads site-specific SEO content', async () => {
    const seo = await loadSEOStrict('tennis', 'home')
    expect(seo).not.toBeNull()
    expect(seo!.title).toBe('Tennis Home')
  })

  it('returns null when content not found (no fallback)', async () => {
    const seo = await loadSEOStrict('nonexistent', 'nonexistent-page')
    expect(seo).toBeNull()
  })
})
