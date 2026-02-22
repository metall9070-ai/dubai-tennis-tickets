# Slug Redirect Guide

**Version:** 1.0
**Date:** 2026-02-22
**Status:** P1 SEO Hardening Fix

---

## Purpose

Preserve SEO equity and backlinks when event slugs change in CRM.

**Problem solved:**
- Old URLs returning 404 after slug changes
- Loss of backlink value
- Broken historical URLs
- SEO ranking drops

**Solution:**
- Automatic 301 redirects from old slug → new slug
- Frontend-only implementation (no backend changes)
- Multi-site isolated
- ISR-safe

---

## How It Works

### User Journey

**Before slug change:**
```
/tickets/event/atp-finals-2025 → 200 OK
```

**After slug change in CRM:**
```
Event slug changed: "atp-finals-2025" → "atp-finals-2026"
```

**Without redirect (OLD BEHAVIOR):**
```
/tickets/event/atp-finals-2025 → 404 Not Found ❌
Backlinks die
SEO equity lost
```

**With redirect (NEW BEHAVIOR):**
```
/tickets/event/atp-finals-2025 → 301 → /tickets/event/atp-finals-2026 ✅
Backlinks preserved
SEO equity transferred
```

---

## Implementation

### Files Modified

1. **`lib/slug-redirect-map.ts`** (NEW)
   - Site-specific redirect mapping
   - Configuration per deployment

2. **`app/tickets/event/[slug]/page.tsx`** (MODIFIED)
   - 301 redirect logic before 404
   - ISR-safe implementation

### Architecture Compliance

✅ **SEO_ARCHITECTURE v1.6 §3:** SEO is frontend-only
✅ **CANON_FRONTEND_RULES v1.3 §14:** Multi-site isolation
✅ **No backend changes required**
✅ **No CRM SEO logic**
✅ **ISR compatible (revalidate: 60s)**

---

## Usage Instructions

### When Slug Changes in CRM

**Step 1: Identify the change**
```
Admin changes slug in CRM:
  Old: "wimbledon-final-old"
  New: "wimbledon-final-2026"
```

**Step 2: Add redirect mapping**

Edit `lib/slug-redirect-map.ts`:

```typescript
const SLUG_REDIRECTS_BY_SITE: Record<string, Record<string, string>> = {
  tennis: {
    "wimbledon-final-old": "wimbledon-final-2026",  // ADD THIS LINE
  },
};
```

**Step 3: Deploy**

The redirect becomes active immediately after deployment.

**Step 4: Verify**

Test the redirect:
```bash
curl -I https://your-domain.com/tickets/event/wimbledon-final-old
# Expected: HTTP/1.1 301 Moved Permanently
# Location: /tickets/event/wimbledon-final-2026
```

---

## Multi-Site Configuration

Each site maintains its own redirect map:

```typescript
const SLUG_REDIRECTS_BY_SITE: Record<string, Record<string, string>> = {
  tennis: {
    "atp-finals-old": "atp-finals-2026",
    "wimbledon-old": "wimbledon-2026",
  },

  finalissima: {
    "old-session-name": "new-session-name",
  },

  ufc: {
    "ufc-300-old": "ufc-300-new",
  },
};
```

**IMPORTANT:**
- Each deployment uses `NEXT_PUBLIC_SITE_CODE` to select its redirects
- No cross-site redirects
- No cross-domain redirects
- Site isolation enforced

---

## Redirect Behavior

### Execution Flow

```
User visits: /tickets/event/old-slug
         ↓
    fetchEventBySlugServer(old-slug)
         ↓
    event === null
         ↓
    getRedirectSlug(old-slug)
         ↓
    Found: "new-slug"
         ↓
    redirect("/tickets/event/new-slug") → 301
```

### HTTP Status Codes

| Scenario | Status | Behavior |
|----------|--------|----------|
| Valid current slug | 200 | Render event page |
| Old slug with redirect | 301 | Redirect to new slug |
| Unknown slug (no redirect) | 404 | Not Found page |
| Reserved slug | 404 | Not Found (protected) |
| Deleted event | 404 | Not Found |

---

## Testing Scenarios

### Valid Slug
```
GET /tickets/event/current-slug
→ 200 OK
→ Event page rendered
```

### Changed Slug (with redirect)
```
GET /tickets/event/old-slug
→ 301 Moved Permanently
→ Location: /tickets/event/new-slug
```

### Unknown Slug
```
GET /tickets/event/never-existed
→ 404 Not Found
```

### Cross-Site Slug
```
Site: finalissima
GET /tickets/event/tennis-event-slug
→ 404 Not Found
(No cross-site redirects)
```

### Reserved Slug
```
GET /tickets/event/schedule
→ 404 Not Found
(Protected by reserved slug validation)
```

---

## ISR Compatibility

**Next.js ISR Strategy:**
- revalidate: 60 seconds
- Redirect is server-side (before component render)
- 301 redirect is cacheable by Next.js
- No performance impact

**Redirect Cache Behavior:**
```
First request: old-slug → API fetch → not found → check redirect → 301
Cached (60s): old-slug → cached 301 response
After cache: old-slug → revalidate → still 301 (or 200 if mapping removed)
```

---

## Maintenance Guidelines

### When to Add Redirects

✅ Event slug changed in CRM
✅ Historical backlinks exist
✅ SEO equity needs preservation

### When to Remove Redirects

After sufficient time (recommended: 6-12 months):
- Most backlinks updated
- Search engines indexed new URL
- Traffic on old URL negligible

### Redirect Lifetime

Recommend keeping redirects for:
- **High-value events:** 12+ months
- **Regular events:** 6 months
- **One-time events:** 3 months

Monitor analytics to determine safe removal time.

---

## Validation Checklist

After adding a redirect:

- [ ] Redirect mapping added to correct site_code
- [ ] Old slug correctly mapped to new slug
- [ ] New slug is valid (not reserved)
- [ ] No redirect loops (A→B, B→A)
- [ ] No chain redirects (A→B→C)
- [ ] Deployment successful
- [ ] 301 redirect verified in browser/curl
- [ ] ISR revalidation working
- [ ] Multi-site isolation confirmed

---

## Architecture Guarantees

### ✅ SEO Compliance

- SEO logic stays in frontend
- No backend modifications
- No CRM SEO fields
- Canonical unchanged
- Sitemap unaffected

### ✅ Multi-Site Isolation

- Site-specific redirect maps
- No cross-domain redirects
- No fallback to other sites
- NEXT_PUBLIC_SITE_CODE enforced

### ✅ ISR Safety

- Redirect executes before render
- Cached by Next.js
- Revalidation preserves redirect
- No hydration errors

### ✅ Business Logic Separation

- No Visibility coupling
- No availability impact
- No pricing logic
- Presentation-only

---

## Troubleshooting

### Redirect Not Working

**Check:**
1. Is redirect mapping in correct site_code?
2. Is NEXT_PUBLIC_SITE_CODE set correctly?
3. Has deployment completed?
4. Is ISR cache stale? (wait 60s or redeploy)

### Redirect Loop

**Cause:** Circular mapping
```typescript
// ❌ WRONG
"slug-a": "slug-b",
"slug-b": "slug-a",  // Loop!
```

**Fix:** Remove one mapping

### 404 After Redirect

**Cause:** New slug doesn't exist or is reserved

**Check:**
1. Does event with new slug exist in CRM?
2. Is new slug a reserved slug?
3. Is new slug correct in mapping?

---

## Example Configuration

```typescript
// lib/slug-redirect-map.ts

const SLUG_REDIRECTS_BY_SITE: Record<string, Record<string, string>> = {
  tennis: {
    // ATP Finals slug change (2026-02-22)
    "atp-finals-2025": "atp-finals-2026",

    // Wimbledon Finals (2026-02-15)
    "wimbledon-final": "wimbledon-championship-2026",

    // Roland Garros (2026-01-10)
    "french-open-old": "roland-garros-2026",
  },

  finalissima: {
    // Session name update (2026-02-20)
    "old-session-slug": "finalissima-2026-session",
  },
};
```

---

## Migration Path (Future)

If backend adds `previous_slugs` field:

1. Backend returns:
   ```json
   {
     "slug": "new-slug",
     "previous_slugs": ["old-slug-1", "old-slug-2"]
   }
   ```

2. Frontend can query all events for matches
3. Redirect map becomes optional fallback
4. Automatic redirect without manual configuration

This is **Strategy A** - deferred until backend support available.

---

## Summary

**What:** 301 redirects for changed event slugs
**Why:** Preserve SEO equity and backlinks
**How:** Frontend mapping + redirect before 404
**Where:** `lib/slug-redirect-map.ts`
**When:** Add mapping when CRM slug changes
**Who:** Frontend deployment per site

**Result:**
- ✅ Backlinks preserved
- ✅ SEO equity transferred
- ✅ Zero backend changes
- ✅ Multi-site isolated
- ✅ ISR-safe
- ✅ Architecture compliant

---

**End of Guide**
