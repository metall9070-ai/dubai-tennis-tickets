import { getVenueContent } from '@/lib/venue-data'

describe('getVenueContent', () => {
  it('returns tennis venue for tennis site code', () => {
    const venue = getVenueContent('tennis')
    expect(venue).not.toBeNull()
    expect(venue!.name).toBe('Dubai Duty Free Tennis Stadium')
    expect(venue!.location).toContain('Dubai')
    expect(venue!.stats.length).toBeGreaterThan(0)
    expect(venue!.transport.length).toBeGreaterThan(0)
    expect(venue!.facilities.length).toBeGreaterThan(0)
  })

  it('returns finalissima venue for finalissima site code', () => {
    const venue = getVenueContent('finalissima')
    expect(venue).not.toBeNull()
    expect(venue!.name).toBe('Lusail Stadium')
    expect(venue!.location).toContain('Qatar')
    expect(venue!.stats.length).toBeGreaterThan(0)
  })

  it('returns null for unknown site code', () => {
    expect(getVenueContent('unknown')).toBeNull()
    expect(getVenueContent('')).toBeNull()
  })

  it('venue data has complete transport info', () => {
    const venue = getVenueContent('tennis')!
    for (const t of venue.transport) {
      expect(t.mode).toBeTruthy()
      expect(t.details).toBeTruthy()
      expect(t.tip).toBeTruthy()
    }
  })

  it('venue data has hotels and weather', () => {
    const venue = getVenueContent('tennis')!
    expect(venue.hotels).toBeDefined()
    expect(venue.hotels!.length).toBeGreaterThan(0)
    expect(venue.weather).toBeDefined()
    expect(venue.weather!.rows.length).toBeGreaterThan(0)
  })

  it('venue data has valid address and map info', () => {
    for (const code of ['tennis', 'finalissima']) {
      const venue = getVenueContent(code)!
      expect(venue.address.length).toBeGreaterThan(0)
      expect(venue.mapQuery).toBeTruthy()
      expect(venue.ctaTitle).toBeTruthy()
      expect(venue.ctaDescription).toBeTruthy()
    }
  })
})
