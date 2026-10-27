# Ratings

Meetings → **Ratings** (`/event/:id/meetings?tab=ratings&type=<id>`). Organizer setup of the EA rating system.

- `api/ratingConfigApi.js` — `rating/types/`, `rating/applicable-ratings/`, `rating/options/` (organizer token; no `/api` prefix).
- Options are loaded one scale at a time (`applicable_rating_id`); the unfiltered list groups by value and merges types.
- Type names are letters and underscores only (they appear in the attendee-app URL).
- Deleting a type cascades to its ratings; the UI warns and suggests setting it inactive.
- Not wired: `rating/profile/summary/` and `rating/profile/detail/` authenticate with `EA-TOKEN` (SnapCard JWT), so an organizer token is refused.
