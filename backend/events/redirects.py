"""
Legacy slug redirects for SEO preservation.

Maps old event slugs to new theme-prefixed slugs.
Returns 301 Permanent Redirect to preserve SEO juice.

IMPORTANT:
- This is a static mapping, not database lookup
- Old slugs are hardcoded to avoid DB queries on every request
- Add new mappings here when migrating slugs
"""

# Old slug → New slug mapping
# Generated during slug migration on 2026-02-04
LEGACY_EVENT_SLUGS = {
    # WTA Events
    "womens-day-1-feb-15": "tennis-womens-day-1-feb-15",
    "womens-day-2-feb-16": "tennis-womens-day-2-feb-16",
    "womens-day-3-feb-17": "tennis-womens-day-3-feb-17",
    "womens-day-4-feb-18": "tennis-womens-day-4-feb-18",
    "womens-quarter-finals-feb-19": "tennis-womens-quarter-finals-feb-19",
    "womens-semi-finals-feb-20": "tennis-womens-semi-finals-feb-20",
    "womens-finals-feb-21": "tennis-womens-finals-feb-21",
    # ATP Events
    "mens-day-1-feb-23": "tennis-mens-day-1-feb-23",
    "mens-day-2-feb-24": "tennis-mens-day-2-feb-24",
    "mens-day-3-feb-25": "tennis-mens-day-3-feb-25",
    "mens-quarter-finals-feb-26": "tennis-mens-quarter-finals-feb-26",
    "mens-semi-finals-feb-27": "tennis-mens-semi-finals-feb-27",
    "mens-finals-feb-28": "tennis-mens-finals-feb-28",
}


def get_new_slug(old_slug: str) -> str | None:
    """
    Get new slug for legacy slug.

    Returns:
        New slug if mapping exists, None otherwise
    """
    return LEGACY_EVENT_SLUGS.get(old_slug)
