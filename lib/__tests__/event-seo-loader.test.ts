import { loadEventSEO } from '@/lib/event-seo-loader'

// Mock all finalissima event SEO imports
vi.mock('@/content/finalissima/events/argentina-spain-finalissima-2026-mar-27', () => ({
  eventSEO: { title: 'Argentina vs Spain', description: 'Finalissima' },
}))

vi.mock('@/content/finalissima/events/qatar-argentina-mar-31', () => ({
  eventSEO: { title: 'Qatar vs Argentina', description: 'Friendly' },
}))

vi.mock('@/content/finalissima/events/qatar-serbia-mar-26', () => ({
  eventSEO: { title: 'Qatar vs Serbia', description: 'Friendly' },
}))

vi.mock('@/content/finalissima/events/saudi-arabia-egypt-mar-26', () => ({
  eventSEO: { title: 'Saudi Arabia vs Egypt', description: 'Friendly' },
}))

vi.mock('@/content/finalissima/events/serbia-saudi-arabia-mar-30', () => ({
  eventSEO: { title: 'Serbia vs Saudi Arabia', description: 'Friendly' },
}))

vi.mock('@/content/finalissima/events/egypt-spain-mar-30', () => ({
  eventSEO: { title: 'Egypt vs Spain', description: 'Friendly' },
}))

describe('loadEventSEO', () => {
  it('loads finalissima event SEO for known slugs', async () => {
    const seo = await loadEventSEO('finalissima', 'argentina-spain-finalissima-2026-mar-27')
    expect(seo).not.toBeNull()
    expect(seo!.title).toBe('Argentina vs Spain')
  })

  it('loads all finalissima event slugs', async () => {
    const slugs = [
      'qatar-argentina-mar-31',
      'qatar-serbia-mar-26',
      'saudi-arabia-egypt-mar-26',
      'serbia-saudi-arabia-mar-30',
      'egypt-spain-mar-30',
    ]
    for (const slug of slugs) {
      const seo = await loadEventSEO('finalissima', slug)
      expect(seo).not.toBeNull()
      expect(seo!.title).toBeTruthy()
    }
  })

  it('returns null for unknown slug within finalissima', async () => {
    const seo = await loadEventSEO('finalissima', 'unknown-match')
    expect(seo).toBeNull()
  })

  it('returns null for unknown site code', async () => {
    const seo = await loadEventSEO('tennis', 'any-slug')
    expect(seo).toBeNull()
  })

  it('returns null for empty site code', async () => {
    const seo = await loadEventSEO('', '')
    expect(seo).toBeNull()
  })
})
