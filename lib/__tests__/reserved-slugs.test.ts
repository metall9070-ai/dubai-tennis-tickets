import { describe, it, expect } from 'vitest'
import { isReservedSlug, validateEventSlug, RESERVED_SLUGS } from '@/lib/reserved-slugs'

describe('isReservedSlug', () => {
  it('returns true for known static route slugs', () => {
    const reserved = ['checkout', 'faq', 'venue', 'schedule', 'contact', 'tickets', 'admin']
    reserved.forEach(slug => {
      expect(isReservedSlug(slug)).toBe(true)
    })
  })

  it('case-insensitive matching', () => {
    expect(isReservedSlug('Checkout')).toBe(true)
    expect(isReservedSlug('FAQ')).toBe(true)
    expect(isReservedSlug('VENUE')).toBe(true)
  })

  it('returns false for non-reserved slugs', () => {
    expect(isReservedSlug('atp-finals-feb-15')).toBe(false)
    expect(isReservedSlug('womens-day-1')).toBe(false)
    expect(isReservedSlug('argentina-spain-finalissima')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(isReservedSlug('')).toBe(false)
  })

  it('handles extended reserved slugs (multisite routes)', () => {
    expect(isReservedSlug('about-tournament')).toBe(true)
    expect(isReservedSlug('about-venue')).toBe(true)
    expect(isReservedSlug('getting-there')).toBe(true)
    expect(isReservedSlug('events')).toBe(true)
  })
})

describe('validateEventSlug', () => {
  it('throws for reserved slug with descriptive message', () => {
    expect(() => validateEventSlug('checkout')).toThrow('reserved')
    expect(() => validateEventSlug('checkout')).toThrow('checkout')
  })

  it('does not throw for valid event slug', () => {
    expect(() => validateEventSlug('atp-finals-feb-15')).not.toThrow()
    expect(() => validateEventSlug('qatar-argentina-mar-31')).not.toThrow()
  })
})

describe('RESERVED_SLUGS', () => {
  it('is a Set', () => {
    expect(RESERVED_SLUGS).toBeInstanceOf(Set)
  })

  it('contains core static routes', () => {
    const expected = [
      'checkout', 'faq', 'venue', 'schedule', 'contact',
      'tickets', 'privacy-policy', 'terms-of-service', 'payment-and-delivery',
    ]
    expected.forEach(slug => {
      expect(RESERVED_SLUGS.has(slug)).toBe(true)
    })
  })

  it('has reasonable size (not accidentally empty or bloated)', () => {
    expect(RESERVED_SLUGS.size).toBeGreaterThan(10)
    expect(RESERVED_SLUGS.size).toBeLessThan(100)
  })
})
