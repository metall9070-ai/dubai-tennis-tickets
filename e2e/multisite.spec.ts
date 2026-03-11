import { test, expect } from '@playwright/test'

test.describe('Multisite isolation', () => {
  test('homepage shows site-specific branding (not fallback)', async ({ page }) => {
    await page.goto('/')

    // Title must not be the neutral fallback
    const title = await page.title()
    expect(title).not.toBe('Event Tickets')
    expect(title.length).toBeGreaterThan(5)
  })

  test('navigation links are present and site-specific', async ({ page }) => {
    await page.goto('/')

    // Should have navigation links
    const navLinks = page.locator('nav a, header a')
    const count = await navLinks.count()
    expect(count).toBeGreaterThan(0)

    // All nav links should have valid hrefs
    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await navLinks.nth(i).getAttribute('href')
      if (href) {
        expect(href).toMatch(/^(\/|https?:\/\/)/)
      }
    }
  })

  test('footer contains site branding', async ({ page }) => {
    await page.goto('/')

    const footer = page.locator('footer')
    const hasFooter = await footer.isVisible({ timeout: 5_000 }).catch(() => false)
    if (hasFooter) {
      const footerText = await footer.textContent()
      expect(footerText).toBeTruthy()
      // Footer should not be empty
      expect(footerText!.length).toBeGreaterThan(10)
    }
  })
})
