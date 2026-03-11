import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

// Mock dependencies
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

// Mock next/link to render a plain anchor
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: any) => (
    <a href={href} onClick={onClick} {...props}>{children}</a>
  ),
}))

let mockCartTotalItems = 0
vi.mock('@/app/CartContext', () => ({
  useCart: () => ({ cartTotalItems: mockCartTotalItems }),
}))

let mockSiteConfig = {
  brand: 'Dubai Tennis',
  topDisclaimer: '',
  supportEmail: 'test@example.com',
  logoType: 'tennis-ball' as string,
}
let mockNavItems = [
  { label: 'Home', href: '/' },
  { label: 'Tickets', href: '/#tickets' },
  { label: 'FAQ', href: '/faq' },
]
vi.mock('@/lib/site-config', () => ({
  getSiteConfig: () => mockSiteConfig,
  getNavItems: () => mockNavItems,
}))

import Navbar from '@/app/components/Navbar'

describe('Navbar', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockCartTotalItems = 0
    mockSiteConfig = {
      brand: 'Dubai Tennis',
      topDisclaimer: '',
      supportEmail: 'test@example.com',
      logoType: 'tennis-ball',
    }
  })

  it('renders navbar with nav items', () => {
    render(<Navbar />)
    // Desktop + mobile nav both render items, so use getAllByText
    expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Tickets').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('FAQ').length).toBeGreaterThanOrEqual(1)
  })

  it('renders tennis-ball logo when logoType is tennis-ball', () => {
    mockSiteConfig.logoType = 'tennis-ball'
    const { container } = render(<Navbar />)
    // Tennis ball SVG has a circle element
    const circle = container.querySelector('circle')
    expect(circle).not.toBeNull()
    expect(circle?.getAttribute('fill')).toBe('#C9E600')
  })

  it('renders trophy logo when logoType is trophy', () => {
    mockSiteConfig.logoType = 'trophy'
    const { container } = render(<Navbar />)
    const path = container.querySelector('path[fill="#FFC54D"]')
    expect(path).not.toBeNull()
  })

  it('renders star logo when logoType is star', () => {
    mockSiteConfig.logoType = 'star'
    const { container } = render(<Navbar />)
    const path = container.querySelector('path[fill="#DD900C"]')
    expect(path).not.toBeNull()
  })

  it('renders generic fallback logo for unknown logoType', () => {
    mockSiteConfig.logoType = 'unknown'
    render(<Navbar />)
    expect(screen.getByText('D')).toBeInTheDocument() // first letter of 'Dubai Tennis'
  })

  it('shows cart badge when cart has items', () => {
    mockCartTotalItems = 3
    render(<Navbar />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show cart badge when cart is empty', () => {
    mockCartTotalItems = 0
    render(<Navbar />)
    // No badge number should be present
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('cart link points to /checkout', () => {
    render(<Navbar />)
    const cartLink = screen.getByLabelText('Cart')
    expect(cartLink).toHaveAttribute('href', '/checkout')
  })

  it('renders top disclaimer bar when configured', () => {
    mockSiteConfig.topDisclaimer = 'This is not an official site'
    render(<Navbar />)
    expect(screen.getByText('This is not an official site')).toBeInTheDocument()
  })

  it('does not render disclaimer bar when empty', () => {
    mockSiteConfig.topDisclaimer = ''
    render(<Navbar />)
    expect(screen.queryByText('This is not an official site')).not.toBeInTheDocument()
  })

  it('toggles mobile menu on button click', () => {
    render(<Navbar />)
    const menuButton = screen.getByLabelText('Toggle Menu')

    // Initially mobile menu should be off-screen (translate-y-full)
    fireEvent.click(menuButton)
    // After click, the menu should be visible (translate-y-0)
    // We check for support links that only appear in mobile menu
    expect(screen.getByText('Contact Us')).toBeInTheDocument()
  })

  it('renders support email in mobile menu', () => {
    render(<Navbar />)
    // Open mobile menu
    fireEvent.click(screen.getByLabelText('Toggle Menu'))
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  it('renders brand aria-label on logo link', () => {
    render(<Navbar />)
    expect(screen.getByLabelText('Dubai Tennis')).toBeInTheDocument()
  })
})
