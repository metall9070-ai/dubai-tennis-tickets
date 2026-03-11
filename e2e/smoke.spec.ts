import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads and has content', async ({ page }) => {
    await page.goto('/')
    // Page loaded without 500 error
    await expect(page).toHaveTitle(/.+/)
    // Main content rendered
    await expect(page.locator('body')).toBeVisible()
    // Navigation exists
    await expect(page.locator('header').first()).toBeVisible()
  })

  test('FAQ page loads', async ({ page }) => {
    await page.goto('/faq')
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('contact page loads', async ({ page }) => {
    await page.goto('/contact')
    await expect(page).toHaveTitle(/.+/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms-of-service')
    await expect(page).toHaveTitle(/.+/)
  })

  test('checkout page loads', async ({ page }) => {
    await page.goto('/checkout')
    await expect(page).toHaveTitle(/.+/)
  })
})
