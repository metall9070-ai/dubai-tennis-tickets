import { getFAQContent } from '@/lib/faq-data'

describe('getFAQContent', () => {
  it('returns tennis FAQ for tennis site code', () => {
    const content = getFAQContent('tennis')
    expect(content.subtitle).toContain('Dubai Tennis')
    expect(content.items.length).toBeGreaterThan(0)
    expect(content.items.some(i => i.category === 'Venue & Seating')).toBe(true)
  })

  it('returns finalissima FAQ for finalissima site code', () => {
    const content = getFAQContent('finalissima')
    expect(content.subtitle).toContain('Football Festival')
    expect(content.items.length).toBeGreaterThan(0)
    expect(content.items.some(i => i.question.includes('Football Festival Qatar'))).toBe(true)
  })

  it('returns yasarena FAQ for yasarena site code', () => {
    const content = getFAQContent('yasarena')
    expect(content.subtitle).toContain('Etihad Arena')
    expect(content.items.length).toBeGreaterThan(0)
    expect(content.items.some(i => i.question.includes('Etihad Arena'))).toBe(true)
  })

  it('returns default FAQ for unknown site code', () => {
    const content = getFAQContent('unknown')
    expect(content.subtitle).toContain('ticket services')
    expect(content.items.length).toBeGreaterThan(0)
  })

  it('all FAQ items have required fields', () => {
    for (const code of ['tennis', 'finalissima', 'yasarena']) {
      const content = getFAQContent(code)
      for (const item of content.items) {
        expect(item.category).toBeTruthy()
        expect(item.question).toBeTruthy()
        expect(item.answer).toBeTruthy()
      }
    }
  })
})
