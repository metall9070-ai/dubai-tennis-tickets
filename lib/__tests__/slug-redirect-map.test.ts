describe('slug-redirect-map', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.unstubAllEnvs()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns null when no redirects exist for the site', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'nonexistent')
    const { getRedirectSlug } = await import('@/lib/slug-redirect-map')
    expect(getRedirectSlug('any-slug')).toBeNull()
  })

  it('returns null when slug has no redirect mapping', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')
    const { getRedirectSlug } = await import('@/lib/slug-redirect-map')
    expect(getRedirectSlug('unknown-slug')).toBeNull()
  })

  it('hasRedirectMapping returns false when no redirect exists', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')
    const { hasRedirectMapping } = await import('@/lib/slug-redirect-map')
    expect(hasRedirectMapping('nonexistent-slug')).toBe(false)
  })

  it('uses default site code when env not set', async () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', '')
    const { getRedirectSlug } = await import('@/lib/slug-redirect-map')
    // With empty env, falls back to 'default' which has no redirects
    expect(getRedirectSlug('any-slug')).toBeNull()
  })
})
