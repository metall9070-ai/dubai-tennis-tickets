import { describe, it, expect, vi, beforeEach } from 'vitest'

// ── Tests using explicit siteCode parameter (no env mocking needed) ──

describe('getSiteConfig', () => {
  it('returns tennis config for "tennis" code', async () => {
    const { getSiteConfig } = await import('@/lib/site-config')
    const config = getSiteConfig('tennis')
    expect(config.brand).toBe('Dubai Tennis Tickets')
    expect(config.allowedEventTypes).toEqual(['ATP', 'WTA'])
    expect(config.jsonLdType).toBe('tennis')
    expect(config.supportEmail).toBe('support@dubaitennistickets.com')
  })

  it('returns finalissima config for "finalissima" code', async () => {
    const { getSiteConfig } = await import('@/lib/site-config')
    const config = getSiteConfig('finalissima')
    expect(config.brand).toBe('Football Festival Qatar')
    expect(config.allowedEventTypes).toEqual(['MATCH'])
    expect(config.jsonLdType).toBe('finalissima')
  })

  it('returns yasarena config for "yasarena" code', async () => {
    const { getSiteConfig } = await import('@/lib/site-config')
    const config = getSiteConfig('yasarena')
    expect(config.brand).toBe('Yas Arena Concierge')
    expect(config.allowedEventTypes).toEqual(['CONCERT', 'SHOW', 'SPORTS', 'EXHIBITION'])
    expect(config.jsonLdType).toBe('yasarena')
    expect(config.templateType).toBe('venue')
  })

  it('returns neutral fallback for unknown code', async () => {
    const { getSiteConfig } = await import('@/lib/site-config')
    const config = getSiteConfig('nonexistent')
    expect(config.brand).toBe('Event Tickets')
    expect(config.jsonLdType).toBe('generic')
    expect(config.allowedEventTypes).toBeUndefined()
    expect(config.navigation).toEqual([])
  })

  it('each config has required color fields', async () => {
    const { getSiteConfig } = await import('@/lib/site-config')
    for (const code of ['tennis', 'finalissima', 'yasarena']) {
      const config = getSiteConfig(code)
      expect(config.colors.primary).toMatch(/^#[0-9a-fA-F]{6}$/)
      expect(config.colors.header).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })

  it('each config has navigation links', async () => {
    const { getSiteConfig } = await import('@/lib/site-config')
    for (const code of ['tennis', 'finalissima', 'yasarena']) {
      const config = getSiteConfig(code)
      expect(config.navigation.length).toBeGreaterThan(0)
      config.navigation.forEach(link => {
        expect(link.label).toBeTruthy()
        expect(link.href).toMatch(/^\//)
      })
    }
  })
})

// ── Tests requiring env mocking ──

describe('isTennisSite', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns true when SITE_CODE is tennis', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')
    const { isTennisSite } = await import('@/lib/site-config')
    expect(isTennisSite()).toBe(true)
  })

  it('returns false when SITE_CODE is finalissima', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'finalissima')
    const { isTennisSite } = await import('@/lib/site-config')
    expect(isTennisSite()).toBe(false)
  })

  it('returns false when SITE_CODE is not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', '')
    const { isTennisSite } = await import('@/lib/site-config')
    expect(isTennisSite()).toBe(false)
  })
})

describe('getSiteUrl', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('returns NEXT_PUBLIC_SITE_URL value', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://dubaitennistickets.com')
    const { getSiteUrl } = await import('@/lib/site-config')
    expect(getSiteUrl()).toBe('https://dubaitennistickets.com')
  })

  it('returns fallback when env not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    const { getSiteUrl } = await import('@/lib/site-config')
    expect(getSiteUrl()).toBe('https://example.com')
  })
})

describe('buildJsonLd', () => {
  it('returns JSON-LD for tennis config', async () => {
    const { getSiteConfig, buildJsonLd } = await import('@/lib/site-config')
    const config = getSiteConfig('tennis')
    const jsonLd = buildJsonLd(config)
    expect(jsonLd).not.toBeNull()
    expect(jsonLd!['@context']).toBe('https://schema.org')
    expect(jsonLd!['@graph']).toBeInstanceOf(Array)
    expect(jsonLd!['@graph'][0]['@type']).toBe('Organization')
  })

  it('returns JSON-LD for finalissima config', async () => {
    const { getSiteConfig, buildJsonLd } = await import('@/lib/site-config')
    const config = getSiteConfig('finalissima')
    const jsonLd = buildJsonLd(config)
    expect(jsonLd).not.toBeNull()
    expect(jsonLd!['@graph'][0].name).toBe('Football Festival Qatar')
  })

  it('returns JSON-LD for yasarena config', async () => {
    const { getSiteConfig, buildJsonLd } = await import('@/lib/site-config')
    const config = getSiteConfig('yasarena')
    const jsonLd = buildJsonLd(config)
    expect(jsonLd).not.toBeNull()
    expect(jsonLd!['@graph'][0].name).toBe('Yas Arena Concierge')
  })

  it('returns null for generic/unknown config', async () => {
    const { getSiteConfig, buildJsonLd } = await import('@/lib/site-config')
    const config = getSiteConfig('nonexistent')
    const jsonLd = buildJsonLd(config)
    expect(jsonLd).toBeNull()
  })
})
