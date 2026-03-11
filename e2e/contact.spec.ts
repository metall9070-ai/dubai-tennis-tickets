import { test, expect } from '@playwright/test'

test.describe('Contact form', () => {
  test('contact page renders form fields', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Verify page heading
    await expect(page.locator('h1')).toContainText('Touch')

    // Verify all form fields are visible
    await expect(page.locator('input[placeholder="John Doe"]')).toBeVisible()
    await expect(page.locator('input[placeholder="example@mail.com"]')).toBeVisible()
    await expect(page.locator('input[placeholder*="Ticket inquiry"]')).toBeVisible()
    await expect(page.locator('textarea[placeholder*="How can we help"]')).toBeVisible()

    // Submit button present
    await expect(page.locator('button:has-text("Submit Request")')).toBeVisible()
  })

  test('fill and submit contact form — shows success', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    // Fill form fields
    await page.locator('input[placeholder="John Doe"]').fill('Test User')
    await page.locator('input[placeholder="example@mail.com"]').fill('test@example.com')
    await page.locator('input[placeholder*="Ticket inquiry"]').fill('General Inquiry')
    await page.locator('textarea[placeholder*="How can we help"]').fill('This is a test message for the contact form.')

    // Submit
    await page.locator('button:has-text("Submit Request")').click()

    // Verify success message
    await expect(page.locator('text=Message Sent')).toBeVisible()
    await expect(page.locator('text=Thank you for reaching out')).toBeVisible()

    // Form should be replaced with success state
    await expect(page.locator('input[placeholder="John Doe"]')).not.toBeVisible()
  })

  test('contact page has Back to Home button', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const backButton = page.locator('button:has-text("Back to Home")')
    await expect(backButton).toBeVisible()

    await backButton.click()
    await page.waitForURL('/')
    await expect(page).toHaveURL('/')
  })

  test('contact page shows business hours and support email', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('text=Business Hours')).toBeVisible()
    await expect(page.locator('h2:has-text("Business Hours") + div >> text=24/7').first()).toBeVisible()
    await expect(page.locator('text=Response Time')).toBeVisible()

    // Support email should exist as a mailto link on the page
    const emailLinks = page.locator('a[href^="mailto:"]')
    await expect(emailLinks.first()).toBeAttached()
  })
})
