import { getCountryCode } from '@/lib/country-codes'

describe('getCountryCode', () => {
  it('returns correct code for known countries', () => {
    expect(getCountryCode('Argentina')).toBe('ar')
    expect(getCountryCode('Spain')).toBe('es')
    expect(getCountryCode('Qatar')).toBe('qa')
    expect(getCountryCode('England')).toBe('gb-eng')
    expect(getCountryCode('Saudi Arabia')).toBe('sa')
    expect(getCountryCode('South Korea')).toBe('kr')
  })

  it('returns "un" for unknown team names', () => {
    expect(getCountryCode('Unknown Team')).toBe('un')
    expect(getCountryCode('')).toBe('un')
    expect(getCountryCode('Random')).toBe('un')
  })

  it('is case-sensitive', () => {
    expect(getCountryCode('argentina')).toBe('un')
    expect(getCountryCode('SPAIN')).toBe('un')
  })
})
