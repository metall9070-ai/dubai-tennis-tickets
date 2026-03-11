import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Event } from '@/lib/types'

// Mock site-config to control getSiteConfig() return value per test
vi.mock('@/lib/site-config', () => ({
  getSiteConfig: vi.fn(),
}))

import { filterEventsForCurrentSite, filterEventsByType } from '@/lib/event-filter'
import { getSiteConfig } from '@/lib/site-config'

const mockGetSiteConfig = vi.mocked(getSiteConfig)

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 1,
    slug: 'test-event',
    type: 'ATP',
    title: 'Test Event',
    date: '15',
    day: 'Sun',
    month: 'FEB',
    time: '11:00 AM',
    minPrice: 200,
    isSoldOut: false,
    ...overrides,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
})

// ── filterEventsForCurrentSite ──

describe('filterEventsForCurrentSite', () => {
  it('tennis config: returns only ATP/WTA events', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: ['ATP', 'WTA'] } as any)

    const events = [
      makeEvent({ type: 'ATP', id: 1 }),
      makeEvent({ type: 'WTA', id: 2 }),
      makeEvent({ type: 'MATCH', id: 3 }),
      makeEvent({ type: 'CONCERT', id: 4 }),
    ]

    const result = filterEventsForCurrentSite(events)
    expect(result).toHaveLength(2)
    expect(result.map(e => e.type)).toEqual(['ATP', 'WTA'])
  })

  it('finalissima config: returns only MATCH events', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: ['MATCH'] } as any)

    const events = [
      makeEvent({ type: 'ATP', id: 1 }),
      makeEvent({ type: 'MATCH', id: 2 }),
    ]

    const result = filterEventsForCurrentSite(events)
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('MATCH')
  })

  it('fail-open: undefined allowedEventTypes returns ALL events', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: undefined } as any)

    const events = [makeEvent({ id: 1 }), makeEvent({ id: 2 }), makeEvent({ id: 3 })]
    expect(filterEventsForCurrentSite(events)).toHaveLength(3)
  })

  it('fail-open: empty allowedEventTypes returns ALL events', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: [] } as any)

    const events = [makeEvent({ id: 1 }), makeEvent({ id: 2 })]
    expect(filterEventsForCurrentSite(events)).toHaveLength(2)
  })

  it('returns empty array when no events match policy', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: ['UFC'] } as any)

    const events = [
      makeEvent({ type: 'ATP', id: 1 }),
      makeEvent({ type: 'WTA', id: 2 }),
    ]

    expect(filterEventsForCurrentSite(events)).toHaveLength(0)
  })

  it('handles empty events array', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: ['ATP'] } as any)
    expect(filterEventsForCurrentSite([])).toHaveLength(0)
  })
})

// ── filterEventsByType ──

describe('filterEventsByType', () => {
  it('returns events of requested type when type is allowed', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: ['ATP', 'WTA'] } as any)

    const events = [
      makeEvent({ type: 'ATP', id: 1 }),
      makeEvent({ type: 'WTA', id: 2 }),
      makeEvent({ type: 'ATP', id: 3 }),
    ]

    const result = filterEventsByType(events, 'ATP')
    expect(result).toHaveLength(2)
    expect(result.every(e => e.type === 'ATP')).toBe(true)
  })

  it('returns empty when type is not in allowed list', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: ['ATP', 'WTA'] } as any)

    const events = [
      makeEvent({ type: 'MATCH', id: 1 }),
      makeEvent({ type: 'CONCERT', id: 2 }),
    ]

    expect(filterEventsByType(events, 'MATCH')).toEqual([])
  })

  it('fail-open: no policy filters by type only', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: undefined } as any)

    const events = [
      makeEvent({ type: 'ATP', id: 1 }),
      makeEvent({ type: 'WTA', id: 2 }),
      makeEvent({ type: 'MATCH', id: 3 }),
    ]

    const result = filterEventsByType(events, 'ATP')
    expect(result).toHaveLength(1)
    expect(result[0].type).toBe('ATP')
  })

  it('fail-open: empty policy filters by type only', () => {
    mockGetSiteConfig.mockReturnValue({ allowedEventTypes: [] } as any)

    const events = [
      makeEvent({ type: 'WTA', id: 1 }),
      makeEvent({ type: 'ATP', id: 2 }),
    ]

    expect(filterEventsByType(events, 'WTA')).toHaveLength(1)
  })
})
