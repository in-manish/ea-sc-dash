# Email campaigns

Communication → Email → **History/Scheduled**. Paginated campaign list with infinite scroll, status filter, campaign detail, and recipient log.

**Entry:** `ui/EmailCampaignsPage.jsx`  
**Page:** `src/pages/Communication.jsx` (`?tab=email&email_tab=history_scheduled`)

## Layout

| Path | Owns |
|------|------|
| `constants.js` | All/History/Scheduled filter, status keys, page size |
| `api/emailCampaignApi.js` | List, detail, recipients, reschedule, cancel |
| `domain/campaignHelpers.js` | Status filter, pagination parse, `campaignDateLines`, `formatCampaignCount` (list `count`), dates (`src/utils/formatDateTime.js`, en-IN/IST), HTML body |
| `hooks/useEmailCampaignList.js` | Infinite list + client All/History/Scheduled filter; persists list `count` |
| `hooks/useCampaignDetail.js` | GET single campaign |
| `hooks/useCampaignRecipients.js` | Infinite recipient pages |
| `ui/EmailCampaignsPage.jsx` | Filter + total campaigns (`count`) beside it; list and modals |
| `ui/CampaignStatusFilter.jsx` | All / History / Scheduled toggle |
| `ui/CampaignListRow.jsx` | Clickable row → CampaignDetailModal; Date column = Created + Updated (`formatCampaignDate`); Scheduled line when scheduled |
| `ui/HoverActionButton.jsx` | Teal pill + hover-reveal; stopPropagation so row click is not fired |
| `ui/CampaignRowActions.jsx` | Row-hover View details / View recipients; scheduled Reschedule/Cancel |
| `ui/RecipientRowActions.jsx` | Row-hover View attendee (`/event/:id/attendees?q=`) |
| `ui/` | Table, detail modal, recipients modal |

## API

EA has **no search or status filter** on these endpoints. Only `page` (DRF `PageNumberPagination`, size 10).

- `GET /events/:eventId/campaigns/email/?page=` — all email campaigns, newest first
- `GET /events/:eventId/campaigns/email/:id/` — same serializer, wrapped as `{ results: [row] }`
- `GET /campaigns/email_sent_details/:id/?page=` — recipient send log
- `PATCH /events/:eventId/campaigns/email/:id/` `{ datetime }` — scheduled only
- `DELETE /events/:eventId/campaigns/email/:id/` — cancel (not complete/failed/canceled)

All/History/Scheduled is filtered in the dashboard (`SCHEDULED`/`SCH` vs everything else). History and Scheduled filters load extra pages until the list has rows or there is no `next`. The list payload `count` is shown next to the filter as “N campaigns” (total for the event, not the Recipients column). Row Recipients stays `number_recipients`.

Clicking a campaign row opens the same **CampaignDetailModal** as **View details** (GET campaign). Hover pills (View details, View recipients, scheduled Reschedule/Cancel) `stopPropagation` so they do not fire the row click. Recipient row hover **View attendee** goes to `/event/:eventId/attendees?q=` (email, then `user_uuid`, then `reg_id`). Campaigns have no template FK; template ⋯ lives on the Templates tab.
