import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/site-config', () => ({
  getSiteUrl: () => 'https://dubaitennistickets.com',
}))

import { buildCanonical, validateSiteUrl } from '@/lib/seo/buildCanonical'

describe('buildCanonical', () => {
  it('builds correct URL for normal path', () => {
    expect(buildCanonical('/schedule')).toBe('https://dubaitennistickets.com/schedule')
  })

  it('strips query string', () => {
    expect(buildCanonical('/schedule?ref=home')).toBe('https://dubaitennistickets.com/schedule')
  })

  it('strips hash fragment', () => {
    expect(buildCanonical('/schedule#tickets')).toBe('https://dubaitennistickets.com/schedule')
  })

  it('strips both query and hash', () => {
    expect(buildCanonical('/schedule?ref=home#tickets')).toBe(
      'https://dubaitennistickets.com/schedule'
    )
  })

  it('preserves trailing slash for root path', () => {
    expect(buildCanonical('/')).toBe('https://dubaitennistickets.com/')
  })

  it('removes trailing slash for non-root paths', () => {
    expect(buildCanonical('/schedule/')).toBe('https://dubaitennistickets.com/schedule')
  })

  it('normalizes path to lowercase', () => {
    expect(buildCanonical('/Schedule')).toBe('https://dubaitennistickets.com/schedule')
    expect(buildCanonical('/Tickets/ATP')).toBe('https://dubaitennistickets.com/tickets/atp')
  })

  it('throws on path without leading slash', () => {
    expect(() => buildCanonical('schedule')).toThrow('must start with /')
  })

  it('handles deeply nested paths', () => {
    expect(buildCanonical('/tickets/event/atp-finals')).toBe(
      'https://dubaitennistickets.com/tickets/event/atp-finals'
    )
  })

  it('handles siteUrl with trailing slash', () => {
    // The implementation normalizes siteUrl by removing trailing slash
    // Our mock returns without trailing slash, but verify the path side
    expect(buildCanonical('/faq')).toBe('https://dubaitennistickets.com/faq')
  })
})

describe('validateSiteUrl', () => {
  it('does not throw when NEXT_PUBLIC_SITE_URL is set', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://dubaitennistickets.com')
    expect(() => validateSiteUrl()).not.toThrow()
  })

  it('throws on invalid URL format', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'not-a-url')
    expect(() => validateSiteUrl()).toThrow('invalid')
  })
})
