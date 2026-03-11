import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock logger to suppress noisy output during tests
vi.mock('@/lib/logger', () => ({
  logger: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

// ── isSoldOut (pure function, no mocking needed) ──

describe('isSoldOut', () => {
  let isSoldOut: typeof import('@/lib/api').isSoldOut

  beforeEach(async () => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')
    const mod = await import('@/lib/api')
    isSoldOut = mod.isSoldOut
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('returns true when isActive is false', () => {
    expect(isSoldOut(false, 10, true)).toBe(true)
  })

  it('returns true when showOnFrontend is false', () => {
    expect(isSoldOut(true, 10, false)).toBe(true)
  })

  it('returns true when seatsAvailable is 0', () => {
    expect(isSoldOut(true, 0, true)).toBe(true)
  })

  it('returns true when seatsAvailable is negative', () => {
    expect(isSoldOut(true, -1, true)).toBe(true)
  })

  it('returns false when active, visible, and seats available', () => {
    expect(isSoldOut(true, 10, true)).toBe(false)
  })

  it('returns false when isActive is undefined and seats available', () => {
    expect(isSoldOut(undefined, 10, true)).toBe(false)
  })

  it('returns false when showOnFrontend is undefined and seats available', () => {
    expect(isSoldOut(true, 10, undefined)).toBe(false)
  })

  it('returns true when all bad: inactive, no seats, hidden', () => {
    expect(isSoldOut(false, 0, false)).toBe(true)
  })
})

// ── fetchEvents ──

describe('fetchEvents', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('returns error when API_BASE_URL is not configured', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '')
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')
    const { fetchEvents } = await import('@/lib/api')
    const result = await fetchEvents()
    expect(result.data).toBeNull()
    expect(result.fallback).toBe(true)
    expect(result.error).toBe('API_URL_NOT_CONFIGURED')
  })

  it('returns transformed events on successful API call', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

    const mockApiResponse = {
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          results: [
            {
              id: 1,
              slug: 'atp-finals-feb-15',
              type: 'ATP',
              title: 'ATP Finals',
              date: '15',
              day: 'Sun',
              month: 'FEB',
              time: '11:00 AM',
              min_price: '200.00',
              is_sold_out: false,
              venue: 'Dubai Stadium',
            },
            {
              id: 2,
              slug: 'wta-day-1',
              type: 'WTA',
              title: 'WTA Day 1',
              date: '16',
              day: 'Mon',
              month: 'FEB',
              time: '2:00 PM',
              min_price: '150.50',
              is_sold_out: true,
              venue: 'Dubai Stadium',
            },
          ],
        }),
    }
    vi.mocked(fetch).mockResolvedValue(mockApiResponse as any)

    const { fetchEvents } = await import('@/lib/api')
    const result = await fetchEvents()

    expect(result.fallback).toBe(false)
    expect(result.data).toHaveLength(2)
    expect(result.data![0]).toEqual({
      id: 1,
      slug: 'atp-finals-feb-15',
      type: 'ATP',
      title: 'ATP Finals',
      date: '15',
      day: 'Sun',
      month: 'FEB',
      time: '11:00 AM',
      minPrice: 200,
      isSoldOut: false,
      tournamentSlug: undefined,
      venue: 'Dubai Stadium',
    })
    expect(result.data![1].minPrice).toBe(150.5)
    expect(result.data![1].isSoldOut).toBe(true)
  })

  it('returns error on HTTP failure', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as any)

    const { fetchEvents } = await import('@/lib/api')
    const result = await fetchEvents()
    expect(result.data).toBeNull()
    expect(result.fallback).toBe(true)
    expect(result.error).toContain('500')
  })

  it('returns error on network failure', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

    vi.mocked(fetch).mockRejectedValue(new Error('Network error'))

    const { fetchEvents } = await import('@/lib/api')
    const result = await fetchEvents()
    expect(result.data).toBeNull()
    expect(result.fallback).toBe(true)
  })

  it('handles null min_price gracefully', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              id: 1,
              slug: 'event-no-price',
              type: 'ATP',
              title: 'Event',
              date: '15',
              day: 'Sun',
              month: 'FEB',
              time: '11:00 AM',
              min_price: null,
              is_sold_out: false,
              venue: 'Stadium',
            },
          ],
        }),
    } as any)

    const { fetchEvents } = await import('@/lib/api')
    const result = await fetchEvents()
    expect(result.data![0].minPrice).toBeNull()
  })
})
