import { ATP_SESSION_DATA, WTA_SESSION_DATA } from '@/lib/session-data'

describe('ATP_SESSION_DATA', () => {
  it('has entries for all ATP sessions', () => {
    const keys = Object.keys(ATP_SESSION_DATA)
    expect(keys.length).toBeGreaterThanOrEqual(10)
    expect(ATP_SESSION_DATA["men's day 1"]).toBeDefined()
    expect(ATP_SESSION_DATA["men's final"]).toBeDefined()
    expect(ATP_SESSION_DATA["men's quarterfinals"]).toBeDefined()
    expect(ATP_SESSION_DATA["men's semifinals"]).toBeDefined()
  })

  it('each session has about, seating, and beforeYouGo', () => {
    for (const [key, session] of Object.entries(ATP_SESSION_DATA)) {
      expect(session.about).toBeTruthy()
      expect(session.seating.length).toBeGreaterThan(0)
      expect(session.beforeYouGo.length).toBeGreaterThan(0)
    }
  })

  it('handles alternate spellings (quarter-finals vs quarterfinals)', () => {
    expect(ATP_SESSION_DATA["men's quarterfinals"]).toBeDefined()
    expect(ATP_SESSION_DATA["men's quarter-finals"]).toBeDefined()
    // Both should have the same content
    expect(ATP_SESSION_DATA["men's quarterfinals"].about)
      .toBe(ATP_SESSION_DATA["men's quarter-finals"].about)
  })
})

describe('WTA_SESSION_DATA', () => {
  it('has entries for all WTA sessions', () => {
    const keys = Object.keys(WTA_SESSION_DATA)
    expect(keys.length).toBeGreaterThanOrEqual(7)
    expect(WTA_SESSION_DATA["women's day 1"]).toBeDefined()
    expect(WTA_SESSION_DATA["women's final"]).toBeDefined()
    expect(WTA_SESSION_DATA["women's quarterfinals"]).toBeDefined()
  })

  it('each session has about, seating, and beforeYouGo', () => {
    for (const [key, session] of Object.entries(WTA_SESSION_DATA)) {
      expect(session.about).toBeTruthy()
      expect(session.seating.length).toBeGreaterThan(0)
      expect(session.beforeYouGo.length).toBeGreaterThan(0)
    }
  })
})
