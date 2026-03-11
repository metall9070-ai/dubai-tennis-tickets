import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/site-config', () => ({
  getSiteConfig: () => ({
    brand: 'Dubai Tennis Tickets',
    ogImage: 'https://images.unsplash.com/photo-tennis.jpg',
  }),
  getSiteUrl: () => 'https://dubaitennistickets.com',
}))

import { buildMetadata } from '@/lib/seo/buildMetadata'

describe('buildMetadata', () => {
  it('generates complete metadata with all options', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ — Dubai Tennis Tickets',
      description: 'Frequently asked questions about Dubai Tennis Championships',
      keywords: 'faq, help, tennis',
    })

    expect(meta.title).toBe('FAQ — Dubai Tennis Tickets')
    expect(meta.description).toBe('Frequently asked questions about Dubai Tennis Championships')
    expect(meta.keywords).toBe('faq, help, tennis')
  })

  it('canonical URL is self-referential and equals og:url', () => {
    const meta = buildMetadata({
      path: '/schedule',
      title: 'Schedule',
      description: 'Event schedule',
    })

    expect(meta.alternates?.canonical).toBe('https://dubaitennistickets.com/schedule')
    expect(meta.openGraph?.url).toBe(meta.alternates?.canonical)
  })

  it('og:image level 1: uses page-level ogImage', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
      ogImage: 'https://custom.com/image.jpg',
    })

    const images = meta.openGraph?.images as any[]
    expect(images[0].url).toBe('https://custom.com/image.jpg')
  })

  it('og:image level 2: falls back to site-config ogImage', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
      // no ogImage → falls back to config
    })

    const images = meta.openGraph?.images as any[]
    expect(images[0].url).toBe('https://images.unsplash.com/photo-tennis.jpg')
  })

  it('og:image level 3: falls back to /og/default.jpg when no config ogImage', () => {
    // Need a config without ogImage — use siteConfig override
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
      siteConfig: {
        brand: 'Test',
        // no ogImage set
      } as any,
    })

    const images = meta.openGraph?.images as any[]
    expect(images[0].url).toBe('https://dubaitennistickets.com/og/default.jpg')
  })

  it('converts relative ogImage to absolute URL', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
      ogImage: '/og/custom.jpg',
    })

    const images = meta.openGraph?.images as any[]
    expect(images[0].url).toBe('https://dubaitennistickets.com/og/custom.jpg')
  })

  it('sets noindex when flag is true', () => {
    const meta = buildMetadata({
      path: '/checkout',
      title: 'Checkout',
      description: 'Checkout',
      noindex: true,
    })

    expect(meta.robots).toEqual({ index: false, follow: false })
  })

  it('allows indexing by default', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
    })

    expect(meta.robots).toEqual({ index: true, follow: true })
  })

  it('omits keywords when not provided', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
    })

    expect(meta.keywords).toBeUndefined()
  })

  it('sets siteName from config brand', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
    })

    expect(meta.openGraph?.siteName).toBe('Dubai Tennis Tickets')
  })

  it('sets og:image dimensions', () => {
    const meta = buildMetadata({
      path: '/faq',
      title: 'FAQ',
      description: 'FAQ',
    })

    const images = meta.openGraph?.images as any[]
    expect(images[0].width).toBe(1200)
    expect(images[0].height).toBe(630)
  })
})
