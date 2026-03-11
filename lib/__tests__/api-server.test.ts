vi.mock('@/lib/logger', () => ({
  logger: { log: vi.fn(), error: vi.fn(), warn: vi.fn() },
}))

vi.mock('@/lib/reserved-slugs', () => ({
  isReservedSlug: vi.fn((slug: string) => slug === 'checkout' || slug === 'contact'),
}))

describe('api-server', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  describe('fetchEventsServer', () => {
    it('returns empty array when no API URL is configured', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '')
      const { fetchEventsServer } = await import('@/lib/api-server')
      const result = await fetchEventsServer()
      expect(result).toEqual([])
    })

    it('fetches and transforms events', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      const mockEvents = {
        results: [
          {
            id: 1,
            slug: 'atp-day-1',
            type: 'ATP',
            title: 'ATP Day 1',
            date: '15',
            day: 'Mon',
            month: 'Feb',
            time: '11:00 AM',
            min_price: '100.00',
            is_sold_out: false,
            tournament_slug: 'dubai-2026',
            venue: 'Tennis Stadium',
          },
        ],
      }

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockEvents),
      })

      const { fetchEventsServer } = await import('@/lib/api-server')
      const events = await fetchEventsServer()

      expect(events).toHaveLength(1)
      expect(events[0].slug).toBe('atp-day-1')
      expect(events[0].minPrice).toBe(100)
      expect(events[0].isSoldOut).toBe(false)
    })

    it('handles API error responses', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 500,
      })

      const { fetchEventsServer } = await import('@/lib/api-server')
      const result = await fetchEventsServer()
      expect(result).toEqual([])
    })

    it('handles network errors', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Network error'))

      const { fetchEventsServer } = await import('@/lib/api-server')
      const result = await fetchEventsServer()
      expect(result).toEqual([])
    })

    it('generates fallback slug when none provided', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 42, title: 'Test' }] }),
      })

      const { fetchEventsServer } = await import('@/lib/api-server')
      const events = await fetchEventsServer()
      expect(events[0].slug).toBe('event-42')
    })

    it('handles null min_price', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [{ id: 1, slug: 's', min_price: null }] }),
      })

      const { fetchEventsServer } = await import('@/lib/api-server')
      const events = await fetchEventsServer()
      expect(events[0].minPrice).toBeNull()
    })

    it('appends site_code query param', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ results: [] }),
      })

      const { fetchEventsServer } = await import('@/lib/api-server')
      await fetchEventsServer()

      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.stringContaining('?site_code=tennis'),
        expect.anything()
      )
    })
  })

  describe('fetchATPEventsServer', () => {
    it('filters ATP events only', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { id: 1, slug: 'atp-1', type: 'ATP' },
            { id: 2, slug: 'wta-1', type: 'WTA' },
          ],
        }),
      })

      const { fetchATPEventsServer } = await import('@/lib/api-server')
      const events = await fetchATPEventsServer()
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('ATP')
    })
  })

  describe('fetchWTAEventsServer', () => {
    it('filters WTA events only', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { id: 1, slug: 'atp-1', type: 'ATP' },
            { id: 2, slug: 'wta-1', type: 'WTA' },
          ],
        }),
      })

      const { fetchWTAEventsServer } = await import('@/lib/api-server')
      const events = await fetchWTAEventsServer()
      expect(events).toHaveLength(1)
      expect(events[0].type).toBe('WTA')
    })
  })

  describe('fetchEventBySlugServer', () => {
    it('returns null when no API URL configured', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '')
      const { fetchEventBySlugServer } = await import('@/lib/api-server')
      const result = await fetchEventBySlugServer('test')
      expect(result).toBeNull()
    })

    it('fetches and transforms a single event', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          id: 5,
          slug: 'atp-final',
          type: 'ATP',
          title: 'ATP Final',
          date: '28',
          day: 'Sat',
          month: 'Feb',
          time: '4:30 PM',
          min_price: '250.00',
          is_sold_out: false,
          venue: 'Tennis Stadium',
        }),
      })

      const { fetchEventBySlugServer } = await import('@/lib/api-server')
      const event = await fetchEventBySlugServer('atp-final')
      expect(event).not.toBeNull()
      expect(event!.title).toBe('ATP Final')
      expect(event!.minPrice).toBe(250)
    })

    it('returns null on API error', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 404,
      })

      const { fetchEventBySlugServer } = await import('@/lib/api-server')
      const result = await fetchEventBySlugServer('nonexistent')
      expect(result).toBeNull()
    })
  })

  describe('fetchEventCategoriesServer', () => {
    it('returns empty array when no API URL configured', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '')
      const { fetchEventCategoriesServer } = await import('@/lib/api-server')
      const result = await fetchEventCategoriesServer(1)
      expect(result).toEqual([])
    })

    it('fetches and transforms categories', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            {
              id: 10,
              name: 'Prime A',
              price: '350.00',
              color: '#8B5CF6',
              seats_left: 50,
              is_active: true,
              show_on_frontend: true,
            },
            {
              id: 11,
              name: 'Grandstand',
              price: 100,
              seats_left: 200,
            },
          ],
        }),
      })

      const { fetchEventCategoriesServer } = await import('@/lib/api-server')
      const cats = await fetchEventCategoriesServer(5)
      expect(cats).toHaveLength(2)
      expect(cats[0].name).toBe('Prime A')
      expect(cats[0].price).toBe(350)
      expect(cats[0].color).toBe('#8B5CF6')
      expect(cats[1].name).toBe('Grandstand')
      expect(cats[1].price).toBe(100)
    })

    it('uses fallback color from CATEGORY_COLORS map', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          results: [
            { id: 10, name: 'Prime A', price: '100', seats_left: 10 },
          ],
        }),
      })

      const { fetchEventCategoriesServer } = await import('@/lib/api-server')
      const cats = await fetchEventCategoriesServer(5)
      // prime-a should match CATEGORY_COLORS['prime-a'] = '#8B5CF6'
      expect(cats[0].color).toBe('#8B5CF6')
    })
  })

  describe('fetchEventWithCategoriesServer', () => {
    it('returns null event when event not found', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
        ok: false,
        status: 404,
      })

      const { fetchEventWithCategoriesServer } = await import('@/lib/api-server')
      const result = await fetchEventWithCategoriesServer('nonexistent')
      expect(result.event).toBeNull()
      expect(result.categories).toEqual([])
    })

    it('fetches event and categories together', async () => {
      vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:8000')
      vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')

      let callCount = 0
      ;(globalThis.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++
        if (callCount === 1) {
          // First call: fetchEventBySlugServer
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({
              id: 5, slug: 'atp-final', type: 'ATP', title: 'Final',
              min_price: '200', is_sold_out: false,
            }),
          })
        }
        // Second call: fetchEventCategoriesServer
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            results: [{ id: 10, name: 'Prime A', price: '300', seats_left: 20 }],
          }),
        })
      })

      const { fetchEventWithCategoriesServer } = await import('@/lib/api-server')
      const result = await fetchEventWithCategoriesServer('atp-final')
      expect(result.event).not.toBeNull()
      expect(result.event!.title).toBe('Final')
      expect(result.categories).toHaveLength(1)
    })
  })
})
