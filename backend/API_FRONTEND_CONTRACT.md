# API Frontend Integration Contract

## Overview

This document defines the contract between Django API and the frontend (Next.js).
The API is designed to be SAFE - frontend failures due to API issues should never
break the user experience.

## Feature Flags

### `USE_DJANGO_PRICES`
- **Location**: `settings.py` or env var `USE_DJANGO_PRICES`
- **Default**: `True`
- **When True**: Frontend should use prices from API responses
- **When False**: Frontend should use static/hardcoded fallback prices

### `USE_DJANGO_AVAILABILITY`
- **Location**: `settings.py` or env var `USE_DJANGO_AVAILABILITY`
- **Default**: `True`
- **When True**: Frontend should display seat counts from API
- **When False**: Frontend should show "Check availability" instead of counts

## Health Check

### Endpoint: `GET /api/health/`

Frontend MUST call this before relying on dynamic data.

**Response (always 200 OK):**
```json
{
  "status": "ok",
  "use_django_prices": true,
  "use_django_availability": true
}
```

### Frontend Logic:
```javascript
// Pseudocode for frontend integration
async function checkAPIHealth() {
  try {
    const response = await fetch('/api/health/', { timeout: 3000 });
    const data = await response.json();
    return {
      available: data.status === 'ok',
      useDjangoPrices: data.use_django_prices,
      useDjangoAvailability: data.use_django_availability
    };
  } catch (error) {
    // API unreachable - use fallbacks
    return {
      available: false,
      useDjangoPrices: false,
      useDjangoAvailability: false
    };
  }
}
```

## Fallback Behavior

### Scenario 1: API Request Fails
- Use static/hardcoded prices from local data
- Show "Check availability at checkout" instead of seat counts
- Log error for monitoring

### Scenario 2: API Returns Empty Results
- Display "Event information temporarily unavailable"
- Do NOT show "sold out" - user might miss valid tickets
- Provide contact information or retry button

### Scenario 3: API Returns `fallback: true`
- API had an internal error but returned safe response
- Treat same as Scenario 1
- Example response:
```json
{
  "results": [],
  "fallback": true,
  "message": "Data temporarily unavailable"
}
```

### Scenario 4: Feature Flags Disabled
- `use_django_prices: false` → Use static prices
- `use_django_availability: false` → Hide seat counts

## API Endpoints

| Endpoint | Purpose | Fallback Data |
|----------|---------|---------------|
| `/api/health/` | Health check | N/A (always 200) |
| `/api/events/` | List events | Static event list |
| `/api/events/{id}/` | Event details | Static event data |
| `/api/events/{id}/categories/` | Ticket categories | Static categories |
| `/api/categories/{id}/` | Category availability | "Check at checkout" |

## Error Handling

### Frontend Must NEVER:
- Hard-depend on API availability for page render
- Show raw error messages to users
- Assume API prices are always correct (validate at checkout)
- Cache API data without TTL

### Frontend SHOULD:
- Cache health check result for 30 seconds
- Retry failed requests once with exponential backoff
- Log all API errors for debugging
- Have static fallback data for all displayed prices

## Price Validation

**CRITICAL**: Final price validation MUST happen at checkout time.

Frontend prices are for DISPLAY ONLY. The actual charge amount is determined
server-side during order creation. If displayed price differs from actual:
- Show user the correct price before payment
- Allow user to cancel without penalty

## Versioning

This contract version: **1.0**
Last updated: 2026-01-29

Future changes to this contract require:
1. Version bump
2. Frontend notification
3. Deprecation period for breaking changes
