# Attendees feature

Event attendee list, filters, WhatsApp send, e-badge jobs, and SC badge sync.

**Entry:** `ui/AttendeesPage.jsx` (default export via `index.js`)  
**Page re-export:** `src/pages/Attendees.jsx`

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Pill colors, action button style, filter URL keys |
| `domain/` | Pure helpers — WhatsApp preview, job timing, field groups |
| `hooks/` | List / search / filters / types / selection + WhatsApp / e-badge / SC / jobs |
| `ui/` | Page composition, table, toolbar, modals |

## Key UI files

- `AttendeesPage.jsx` — composes hooks + tabs / list / tasks / modals
- `AttendeesListView.jsx` — search, filter pills, selection bar, table
- `AttendeesModals.jsx` — detail / filter / WhatsApp / SC / e-badge / create
- `WhatsAppTemplatePreviewPane.jsx` — raw/preview pane (split from picker)

## Common edits

- Filters UI → `ui/AttendeeFilterDrawer.jsx` + `hooks/useAttendeeFilters.js` + `hooks/useAttendeeTypes.js`
- Table row actions → `ui/AttendeeTableRow.jsx`
- WhatsApp send → `hooks/useWhatsAppSend.js` + `ui/WhatsAppSendModal.jsx`
- E-badge create/poll → `hooks/useEBadgeActions.js` + `hooks/useEBadgeJobs.js`
