# WTI Platform — Frontend Development Rules

## Quick Start

```bash
npm run dev          # Local dev server
npm run build        # Production build
npm run lint         # ESLint check
npm test             # Unit tests (Vitest)
npm run test:watch   # Unit tests in watch mode
npm run test:coverage # Coverage report (70% threshold)
npm run test:e2e     # E2E tests (Playwright)
```

Env vars: copy `.env.example` → `.env.local`, fill in values.

## Tech Stack

Next.js 16 (App Router only) · React 19 · TypeScript 5.8 (strict) · Tailwind CSS 4 · Vitest · Playwright · Stripe SDK · Sentry

Path alias: `@/*` → project root. Use `@/lib/...`, `@/components/...`.

## Canon Docs — READ BEFORE CODING

These are the **single source of truth** for architecture decisions:

- `docs/Canon_docs/canon_api_contract.md` — API contract, field naming, response format
- `docs/Canon_docs/canon_frontend_rules.md` — frontend rules, layout conventions, components
- `docs/Canon_docs/canon_crm.md` — CRM domain model, business invariants

Any code that contradicts canon docs is a bug.

## Architecture Invariants

1. **Frontend is NOT source of truth** — all prices, availability, sold-out status come from API
2. **No fallback prices** — if API fails, show error, never stale/hardcoded data
3. **API env var**: `NEXT_PUBLIC_API_BASE_URL` (NOT ~~`NEXT_PUBLIC_API_URL`~~ — common mistake)
4. **Rendering strategy**:
   - Event listings, detail pages → SSR + ISR (`revalidate: 60`)
   - Checkout, order status → SSR + `cache: 'no-store'` (always fresh)
   - Interactive elements (cart, selection, checkout form) → Client Components
5. **Data fetching**:
   - Server-side: `lib/api-server.ts` (ISR 60s)
   - Client-side: `lib/api.ts` (no-store, 10s timeout)
6. **Pages Router is NOT used** — App Router only (`app/` directory)

## Multi-Site Isolation (CRITICAL)

Platform serves multiple sites from one codebase. Site identity = `NEXT_PUBLIC_SITE_CODE`.

### Rules

- **All branding from `getSiteConfig()`** in `lib/site-config.ts` — never hardcode brand, domain, GA ID
- **GA / GSC / GTM** — only from env vars, conditional rendering (no default IDs)
- **JSON-LD** — generated from site-config, returns null for unknown sites
- **Neutral fallback** — unknown site_code → generic "Event Tickets" (not tennis)
- **Cart isolation** — localStorage key = `${SITE_CODE}-cart`
- **Tennis-specific routes** (`/tickets/atp`, `/tickets/wta`, `/seating-guide`) — protected with:
  ```ts
  if (!isTennisSite()) notFound()
  ```
- **Template types**: `tournament | artist | venue | festival` — each defines page set, navigation, catalogSlug. Never create pages belonging to another type.
- **Homepage routing**: tennis → `HomeClient` + `SEOSection`, others → `ContentPage`

### Env Vars per Site (minimum)

```
NEXT_PUBLIC_SITE_CODE        # tennis | finalissima | yasarena
NEXT_PUBLIC_SITE_URL         # https://dubaitennistickets.com
NEXT_PUBLIC_API_BASE_URL     # https://api.example.railway.app
NEXT_PUBLIC_GA_ID            # G-XXXXXXXXXX (optional)
NEXT_PUBLIC_GSC_VERIFICATION # google-site-verification string (optional)
NEXT_PUBLIC_SENTRY_DSN       # https://...@sentry.io/... (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY  # pk_live_... or pk_test_...
```

## Code Quality

- **Logger**: use `logger` from `lib/logger.ts`, not `console.error/log/warn`
- **Sanitization**: external HTML → `sanitizeHTML()`, SVG → `sanitizeSVG()` from `lib/sanitize.ts`. Never raw `innerHTML`
- **Accessibility**: add `aria-label` to buttons, interactive elements, navigation landmarks
- **ESLint**: `no-console: warn` is enforced. Logger utility is exempted.
- **TypeScript**: minimize `any` types. Use proper interfaces from `lib/types.ts`

## Security

- No hardcoded secrets, tokens, API keys in source code
- CSP header in `vercel.json` — update when adding new external services (scripts, images, APIs)
- Image domains whitelisted in `next.config.js` — add new domains there when needed
- All user/external content rendered through sanitize utilities
- Checkout pages: never cached, always fresh from API

## Testing

- **Unit tests**: `lib/__tests__/`, `components/__tests__/` — Vitest + jsdom
- **Coverage threshold**: 70% (lines, functions, branches, statements) for `lib/**/*.ts`
- **E2E tests**: `e2e/` directory — Playwright (desktop Chrome + mobile iPhone 13)
- **Run `npm test` before committing** to catch regressions early
- New features in `lib/` → add unit tests. New user flows → add E2E scenario.

## Key Files

| File | Purpose |
|------|---------|
| `lib/api.ts` | Client-side fetch (no-store, 10s timeout) |
| `lib/api-server.ts` | Server-side fetch (ISR 60s) |
| `lib/site-config.ts` | Multi-site configuration (brand, colors, nav, SEO) |
| `lib/logger.ts` | Structured logger (suppresses non-errors in prod) |
| `lib/sanitize.ts` | DOMPurify wrapper (HTML + SVG) |
| `lib/types.ts` | Shared TypeScript interfaces |
| `lib/event-filter.ts` | Event filtering by site/type |
| `lib/seo/buildCanonical.ts` | Canonical URL builder |
| `lib/seo/buildMetadata.ts` | Next.js Metadata builder |
| `vercel.json` | CSP, security headers, cache rules |

## Git Rules

Git repo is at `platform-frontend/.git` (not workspace root).

**Do NOT commit these files** (local/temporary):
- `.claude/settings.local.json`
- `app/globals.css`, `next-env.d.ts`, `tsconfig.tsbuildinfo`
- `app/tickets/atp/page.tsx`, `app/tickets/event/[slug]/page.tsx`, `app/tickets/wta/page.tsx`
- `components/Footer.tsx`
- `public/lusail.svg` and temp SVG files
- `design-preview/`, `*.backup`, `*.bak`, `*.old` files
- `STADIUM_MAP_INTEGRATION.md`, `lib/color-utils.ts`, `lib/nav-config.ts.backup`

Only commit files directly related to the current task.

## Anti-Patterns (DO NOT)

- Use `NEXT_PUBLIC_API_URL` (correct: `NEXT_PUBLIC_API_BASE_URL`)
- Hardcode brand/domain/analytics in components or layout
- Cache checkout or order status pages
- Calculate binding prices on frontend (display-only math is OK)
- Use `innerHTML` without sanitize
- Create pages for wrong templateType (e.g., `/schedule` on artist site)
- Fall back to tennis config for unknown sites
- Use `console.error` directly (use `logger.error`)
- Import from Pages Router (`pages/`) — App Router only
