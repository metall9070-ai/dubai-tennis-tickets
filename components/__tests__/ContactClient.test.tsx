import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Mock dependencies
const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))
vi.mock('@/app/components/Navbar', () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}))
vi.mock('@/app/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))
vi.mock('@/components/Breadcrumbs', () => ({
  default: ({ currentPage }: { currentPage: string }) => (
    <nav data-testid="breadcrumbs">{currentPage}</nav>
  ),
}))
vi.mock('@/lib/site-config', () => ({
  getSiteConfig: () => ({
    brand: 'Test Site',
    topDisclaimer: '',
    supportEmail: 'support@testsite.com',
    logoType: 'tennis-ball',
  }),
}))

import ContactClient from '@/app/contact/ContactClient'

describe('ContactClient', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders the page heading', () => {
    render(<ContactClient />)
    expect(screen.getByText('Get in')).toBeInTheDocument()
    expect(screen.getByText('Touch')).toBeInTheDocument()
  })

  it('renders the contact form with all fields', () => {
    render(<ContactClient />)
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('example@mail.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ticket inquiry / Partnership / Feedback')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('How can we help you today?')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<ContactClient />)
    expect(screen.getByRole('button', { name: /submit request/i })).toBeInTheDocument()
  })

  it('shows success message after form submission', async () => {
    const user = userEvent.setup()
    render(<ContactClient />)

    // Fill required fields
    await user.type(screen.getByPlaceholderText('John Doe'), 'John Doe')
    await user.type(screen.getByPlaceholderText('example@mail.com'), 'john@example.com')
    await user.type(screen.getByPlaceholderText('Ticket inquiry / Partnership / Feedback'), 'Question')
    await user.type(screen.getByPlaceholderText('How can we help you today?'), 'Hello')

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit request/i }))

    // Verify success state
    expect(screen.getByText('Message Sent')).toBeInTheDocument()
    expect(screen.getByText(/thank you for reaching out/i)).toBeInTheDocument()

    // Form should no longer be visible
    expect(screen.queryByPlaceholderText('John Doe')).not.toBeInTheDocument()
  })

  it('displays support email from site config', () => {
    render(<ContactClient />)
    expect(screen.getByText('support@testsite.com')).toBeInTheDocument()
  })

  it('renders business hours section', () => {
    render(<ContactClient />)
    expect(screen.getByText('Business Hours')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
  })

  it('renders response time section', () => {
    render(<ContactClient />)
    expect(screen.getByText('Response Time')).toBeInTheDocument()
    expect(screen.getByText('1 business day')).toBeInTheDocument()
  })

  it('renders company information', () => {
    render(<ContactClient />)
    expect(screen.getByText('Company Information')).toBeInTheDocument()
    expect(screen.getByText(/WORLD TICKETS 365 INC/)).toBeInTheDocument()
  })

  it('has a Back to Home button that navigates to /', async () => {
    const user = userEvent.setup()
    render(<ContactClient />)

    const backButton = screen.getByRole('button', { name: /back to home/i })
    expect(backButton).toBeInTheDocument()

    await user.click(backButton)
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('renders breadcrumbs with Contact Us as current page', () => {
    render(<ContactClient />)
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Contact Us')
  })
})
