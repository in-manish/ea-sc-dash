# Sponsor Promo Codes (EA)

Organizer UI for per-sponsor promo code pools. Emails that contain `{{slug.promotional_code}}` (slug uses underscores, e.g. `tata_motors`; a hyphen breaks Django email templates)
(badge or category email) give each attendee one code from that pool.

**Route:** `/event/:id/communication?tab=promo`

**APIs** (organizer token, no `/api` prefix):
- `GET|POST /events/:id/sponsor-promo-pool/`
- `PATCH /events/:id/sponsor-promo-pool/:slug/` (`name`, `slug`, `is_active`, `start_valid`, `end_valid`)
- `GET|POST /events/:id/sponsor-promo-pool/:slug/sponsor-promo-codes/` (POST = multipart CSV `file`, column `promotional_code`)
- `DELETE /events/:id/sponsor-promo-pool/:slug/sponsor-promo-codes/:codeId/` (unassigned only)

## Layout

| Path | Owns |
|------|------|
| `api/sponsorPromoApi.js` | All HTTP calls |
| `domain/parseSponsorPromoError.js` | Error text (401/403/500, `error` + `errors[]`, field errors) |
| `hooks/useSponsorPromo.js` | Pools, selected pool codes, create / toggle / import / delete |
| `ui/SponsorPromoPage.jsx` | Pool form + table, codes table, CSV import |

## Wired from

- `src/pages/Communication.jsx` (Promo Codes tab)
