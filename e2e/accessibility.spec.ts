import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * Accessibility tests using axe-core.
 * Asserts zero critical/serious violations on key pages.
 * Moderate/minor issues are logged as warnings but do not fail the test.
 */

test.describe('Accessibility (axe-core)', () => {
  test('homepage has no critical accessibility violations', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')

    if (results.violations.length > critical.length) {
      const moderate = results.violations.filter(v => v.impact === 'moderate' || v.impact === 'minor')
      console.log(`[a11y] Homepage: ${moderate.length} moderate/minor issues:`)
      moderate.forEach(v => console.log(`  - ${v.id}: ${v.description} (${v.impact})`))
    }

    expect(critical, formatViolations(critical)).toHaveLength(0)
  })

  test('contact page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/contact')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')

    if (results.violations.length > critical.length) {
      const moderate = results.violations.filter(v => v.impact === 'moderate' || v.impact === 'minor')
      console.log(`[a11y] Contact: ${moderate.length} moderate/minor issues:`)
      moderate.forEach(v => console.log(`  - ${v.id}: ${v.description} (${v.impact})`))
    }

    expect(critical, formatViolations(critical)).toHaveLength(0)
  })

  test('checkout page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/checkout')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')

    if (results.violations.length > critical.length) {
      const moderate = results.violations.filter(v => v.impact === 'moderate' || v.impact === 'minor')
      console.log(`[a11y] Checkout: ${moderate.length} moderate/minor issues:`)
      moderate.forEach(v => console.log(`  - ${v.id}: ${v.description} (${v.impact})`))
    }

    expect(critical, formatViolations(critical)).toHaveLength(0)
  })

  test('FAQ page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/faq')
    await page.waitForLoadState('networkidle')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    const critical = results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')

    if (results.violations.length > critical.length) {
      const moderate = results.violations.filter(v => v.impact === 'moderate' || v.impact === 'minor')
      console.log(`[a11y] FAQ: ${moderate.length} moderate/minor issues:`)
      moderate.forEach(v => console.log(`  - ${v.id}: ${v.description} (${v.impact})`))
    }

    expect(critical, formatViolations(critical)).toHaveLength(0)
  })
})

/**
 * Format violations for readable assertion messages.
 */
function formatViolations(violations: any[]): string {
  if (violations.length === 0) return 'No violations'
  return violations
    .map(v => `[${v.impact}] ${v.id}: ${v.description}\n  Nodes: ${v.nodes.map((n: any) => n.html).join('\n  ')}`)
    .join('\n\n')
}
