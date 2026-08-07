# Attendees feature

Event attendee list, filters, WhatsApp send, e-badge jobs, SC badge sync, and attendees report.

**Entry:** `ui/AttendeesPage.jsx` (default export via `index.js`)  
**Page re-export:** `src/pages/Attendees.jsx`

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Pill colors, action button style, filter URL keys |
| `api/` | Attendees report fetch (`GET …/attendees/report/`) |
| `domain/` | Pure helpers — WhatsApp preview, job timing, field groups |
| `hooks/` | List / search / filters / types / selection + WhatsApp / e-badge / SC / jobs / report |
| `ui/` | Page composition, table, toolbar, modals, report panel |

## Key UI files

- `AttendeesPage.jsx` — composes hooks + tabs / list / tasks / modals
- `AttendeesListView.jsx` — report panel, search, filter pills, selection bar, table
- `AttendeesReportPanel.jsx` — collapsible badge counts by attendee type (ES/DB)
- `AttendeesReportCharts.jsx` — event total + vertical bar + pie charts
- `AttendeesModals.jsx` — detail / filter / WhatsApp / SC / e-badge / create
- `WhatsAppTemplatePreviewPane.jsx` — raw/preview pane (split from picker)

## Common edits

- Filters UI → `ui/AttendeeFilterDrawer.jsx` + `hooks/useAttendeeFilters.js` + `hooks/useAttendeeTypes.js`
- Attendees report → `ui/AttendeesReportPanel.jsx` + `ui/AttendeesReportCharts.jsx` + `hooks/useAttendeesReport.js` + `api/attendeesReportApi.js`
- Table row actions → `ui/AttendeeTableRow.jsx`
- WhatsApp send → `hooks/useWhatsAppSend.js` + `ui/WhatsAppSendModal.jsx`
- E-badge create/poll → `hooks/useEBadgeActions.js` + `hooks/useEBadgeJobs.js`
