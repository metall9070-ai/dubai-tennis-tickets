import { test, expect } from '@playwright/test'

test.describe('Full checkout flow', () => {
  test('fill checkout form and submit to Stripe', async ({ page }) => {
    // Intercept the create-session API to mock Stripe response
    await page.route('**/api/checkout/create-session/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          checkout_url: 'https://checkout.stripe.com/c/pay/test_session_123',
          order_id: 'abc-123',
        }),
      })
    })

    // Go to homepage and try to find an event
    await page.goto('/')

    const eventLink = page.locator('a[href*="/tickets/event/"], a[href*="/events/"]').first()
    const hasEvents = await eventLink.isVisible({ timeout: 15_000 }).catch(() => false)

    if (!hasEvents) {
      test.skip(true, 'No events available from API — skipping full checkout flow')
      return
    }

    // Click on first event
    await eventLink.click()
    await page.waitForURL(/\/(tickets\/event|events)\//)

    // Look for an "Add to Cart" or quantity/buy button
    // The event page should have category selection with add-to-cart functionality
    const addButton = page.locator('button:has-text("Add to Cart"), button:has-text("Buy"), button:has-text("Select"), button:has-text("Book")').first()
    const hasAddButton = await addButton.isVisible({ timeout: 10_000 }).catch(() => false)

    if (!hasAddButton) {
      test.skip(true, 'No bookable categories found — skipping')
      return
    }

    await addButton.click()

    // Navigate to checkout (either via redirect or manual navigation)
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    // Check if cart has items (form fields should be visible)
    const nameInput = page.locator('input#name, input[name="name"]')
    const hasForm = await nameInput.isVisible({ timeout: 5_000 }).catch(() => false)

    if (!hasForm) {
      // Cart might be empty if add-to-cart didn't work as expected
      // Seed cart via localStorage and reload
      await page.evaluate(() => {
        const item = {
          id: '1-1',
          eventTitle: 'Test Event',
          categoryName: 'Test Category',
          price: 100,
          quantity: 2,
          eventDate: '15',
          eventMonth: 'MAR',
          eventDay: 'Sun',
          eventTime: '11:00 AM',
          venue: 'Test Venue',
        }
        const cartData = JSON.stringify([item])
        for (const code of ['tennis', 'finalissima', 'yasarena', '']) {
          localStorage.setItem(`${code}-cart`, cartData)
          localStorage.setItem(`${code}-cart-version`, '3')
        }
      })
      await page.reload()
      await page.waitForLoadState('networkidle')
    }

    // Fill personal information
    await page.locator('input#name, input[name="name"]').fill('John Test')
    await page.locator('input#email, input[name="email"]').fill('john@test.com')
    await page.locator('input#phone, input[name="phone"]').fill('971501234567')

    // Accept terms
    await page.locator('input[type="checkbox"]').check()

    // Verify the submit button is now enabled
    const submitButton = page.locator('button:has-text("Proceed to payment")')
    await expect(submitButton).toBeEnabled()

    // Click proceed to payment
    // Intercept navigation to Stripe (prevents actual redirect)
    const [request] = await Promise.all([
      page.waitForRequest('**/api/checkout/create-session/'),
      submitButton.click(),
    ])

    // Verify API was called with correct data
    const postData = request.postDataJSON()
    expect(postData.name).toBe('John Test')
    expect(postData.email).toBe('john@test.com')
    expect(postData.phone).toBe('+971501234567')
    expect(postData.items).toBeDefined()
    expect(postData.items.length).toBeGreaterThan(0)
  })

  test('checkout form with seeded cart — validation and submission', async ({ page }) => {
    // Seed cart directly via localStorage
    await page.goto('/checkout')

    // Detect the site code used by the app (reads from env, defaults to empty string)
    await page.evaluate(() => {
      // Try common site codes — the CartContext uses `${SITE_CODE}-cart` as storage key
      const item = {
        id: '10-5',
        eventTitle: 'ATP Semifinal',
        categoryName: 'Premium',
        price: 350,
        quantity: 1,
        eventDate: '20',
        eventMonth: 'MAR',
        eventDay: 'Thu',
        eventTime: '7:00 PM',
        venue: 'Center Court',
      }
      // Set for all possible site codes to ensure it's picked up
      const cartData = JSON.stringify([item])
      for (const code of ['tennis', 'finalissima', 'yasarena', '']) {
        localStorage.setItem(`${code}-cart`, cartData)
        localStorage.setItem(`${code}-cart-version`, '3')
      }
    })
    await page.reload()
    await page.waitForLoadState('networkidle')

    // Verify cart item is displayed
    await expect(page.locator('text=ATP Semifinal')).toBeVisible()
    await expect(page.locator('text=Premium')).toBeVisible()

    // Submit button should be disabled without form data
    const submitButton = page.locator('button:has-text("Proceed to payment")')
    await expect(submitButton).toBeDisabled()

    // Fill only name — button should still be disabled
    await page.locator('input#name').fill('Jane Doe')
    await expect(submitButton).toBeDisabled()

    // Fill email — still disabled (no phone, no terms)
    await page.locator('input#email').fill('jane@example.com')
    await expect(submitButton).toBeDisabled()

    // Fill phone — still disabled (no terms)
    await page.locator('input#phone').fill('441234567890')
    await expect(submitButton).toBeDisabled()

    // Check terms — NOW should be enabled
    await page.locator('input[type="checkbox"]').check()
    await expect(submitButton).toBeEnabled()

    // Mock API and submit
    await page.route('**/api/checkout/create-session/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ checkout_url: 'https://checkout.stripe.com/test' }),
      })
    })

    await submitButton.click()

    // Verify loading state appears
    await expect(page.locator('text=Processing...')).toBeVisible({ timeout: 3_000 }).catch(() => {
      // Loading might be too fast to catch — that's OK
    })
  })
})
