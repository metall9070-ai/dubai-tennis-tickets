import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import React from 'react'

vi.mock('@/lib/logger', () => ({
  logger: { log: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}))

// We need to test CartContext exports: CartProvider, useCart, isValidCartItem
// Since isValidCartItem is not exported, we test it indirectly via loadCartFromStorage behavior

describe('CartContext', () => {
  let CartProvider: typeof import('@/app/CartContext').CartProvider
  let useCart: typeof import('@/app/CartContext').useCart
  let CART_STORAGE_KEY: string
  let CART_VERSION_KEY: string

  const mockLocalStorage = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => { store[key] = value }),
      removeItem: vi.fn((key: string) => { delete store[key] }),
      clear: vi.fn(() => { store = {} }),
      get _store() { return store },
    }
  })()

  beforeEach(async () => {
    vi.resetModules()
    vi.stubEnv('NEXT_PUBLIC_SITE_CODE', 'tennis')
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage, writable: true })
    Object.defineProperty(window, 'sessionStorage', {
      value: { removeItem: vi.fn(), getItem: vi.fn(), setItem: vi.fn(), clear: vi.fn() },
      writable: true,
    })
    mockLocalStorage.clear()
    // Set correct version to avoid module-level clear
    mockLocalStorage.setItem('tennis-cart-version', '3')

    const mod = await import('@/app/CartContext')
    CartProvider = mod.CartProvider
    useCart = mod.useCart
    CART_STORAGE_KEY = mod.CART_STORAGE_KEY
    CART_VERSION_KEY = mod.CART_VERSION_KEY
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  // Helper component to access cart context
  function CartConsumer({ onRender }: { onRender: (ctx: ReturnType<typeof useCart>) => void }) {
    const ctx = useCart()
    onRender(ctx)
    return <div data-testid="consumer">{ctx.cartTotalItems}</div>
  }

  it('provides cart context to children', () => {
    let ctx: ReturnType<typeof useCart> | null = null
    render(
      <CartProvider>
        <CartConsumer onRender={(c) => { ctx = c }} />
      </CartProvider>
    )
    expect(ctx).not.toBeNull()
    expect(ctx!.cart).toEqual([])
    expect(ctx!.cartTotalItems).toBe(0)
    expect(typeof ctx!.setCart).toBe('function')
  })

  it('useCart throws when used outside CartProvider', () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    function BadComponent() {
      useCart()
      return null
    }
    expect(() => render(<BadComponent />)).toThrow('useCart must be used within a CartProvider')
    spy.mockRestore()
  })

  it('setCart updates cart state', async () => {
    let latestCtx: ReturnType<typeof useCart> | null = null
    const item = {
      id: '14-2',
      eventTitle: 'ATP Finals',
      categoryName: 'Grandstand',
      price: 200,
      quantity: 2,
      eventDate: '15',
      eventMonth: 'FEB',
      eventDay: 'Sun',
      eventTime: '11:00 AM',
      venue: 'Dubai Stadium',
    }

    render(
      <CartProvider>
        <CartConsumer onRender={(c) => { latestCtx = c }} />
      </CartProvider>
    )

    await act(async () => {
      latestCtx!.setCart([item])
    })

    expect(latestCtx!.cart).toHaveLength(1)
    expect(latestCtx!.cart[0].eventTitle).toBe('ATP Finals')
  })

  it('cartTotalItems sums quantities correctly', async () => {
    let latestCtx: ReturnType<typeof useCart> | null = null
    const items = [
      { id: '1-1', eventTitle: 'E1', categoryName: 'C1', price: 100, quantity: 2, eventDate: '1', eventMonth: 'JAN', eventDay: 'Mon', eventTime: '10:00', venue: 'V' },
      { id: '2-3', eventTitle: 'E2', categoryName: 'C2', price: 200, quantity: 3, eventDate: '2', eventMonth: 'FEB', eventDay: 'Tue', eventTime: '14:00', venue: 'V' },
    ]

    render(
      <CartProvider>
        <CartConsumer onRender={(c) => { latestCtx = c }} />
      </CartProvider>
    )

    await act(async () => {
      latestCtx!.setCart(items)
    })

    expect(latestCtx!.cartTotalItems).toBe(5) // 2 + 3
  })

  it('loads valid cart items from localStorage', async () => {
    // Pre-populate localStorage with valid items
    const validItems = [
      { id: '14-2', eventTitle: 'ATP Finals', categoryName: 'Grandstand', price: 200, quantity: 1, eventDate: '15', eventMonth: 'FEB', eventDay: 'Sun', eventTime: '11:00 AM', venue: 'Dubai' },
    ]
    mockLocalStorage.setItem(CART_STORAGE_KEY, JSON.stringify(validItems))

    let latestCtx: ReturnType<typeof useCart> | null = null
    await act(async () => {
      render(
        <CartProvider>
          <CartConsumer onRender={(c) => { latestCtx = c }} />
        </CartProvider>
      )
    })

    expect(latestCtx!.cart).toHaveLength(1)
    expect(latestCtx!.cart[0].id).toBe('14-2')
  })

  it('filters out invalid cart items (old slug format)', async () => {
    const mixedItems = [
      { id: '14-2', eventTitle: 'Valid', categoryName: 'C', price: 100, quantity: 1, eventDate: '1', eventMonth: 'JAN', eventDay: 'Mon', eventTime: '10:00', venue: 'V' },
      { id: '14-grandstand', eventTitle: 'Invalid', categoryName: 'C', price: 100, quantity: 1, eventDate: '1', eventMonth: 'JAN', eventDay: 'Mon', eventTime: '10:00', venue: 'V' },
    ]
    mockLocalStorage.setItem(CART_STORAGE_KEY, JSON.stringify(mixedItems))

    let latestCtx: ReturnType<typeof useCart> | null = null
    await act(async () => {
      render(
        <CartProvider>
          <CartConsumer onRender={(c) => { latestCtx = c }} />
        </CartProvider>
      )
    })

    expect(latestCtx!.cart).toHaveLength(1)
    expect(latestCtx!.cart[0].id).toBe('14-2')
  })

  it('saves cart to localStorage when cart changes', async () => {
    let latestCtx: ReturnType<typeof useCart> | null = null
    const item = { id: '5-3', eventTitle: 'E', categoryName: 'C', price: 50, quantity: 1, eventDate: '1', eventMonth: 'JAN', eventDay: 'Mon', eventTime: '10:00', venue: 'V' }

    await act(async () => {
      render(
        <CartProvider>
          <CartConsumer onRender={(c) => { latestCtx = c }} />
        </CartProvider>
      )
    })

    await act(async () => {
      latestCtx!.setCart([item])
    })

    const stored = mockLocalStorage.getItem(CART_STORAGE_KEY)
    expect(stored).not.toBeNull()
    const parsed = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
    expect(parsed[0].id).toBe('5-3')
  })
})
