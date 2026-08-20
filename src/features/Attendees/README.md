# Attendees feature

Event attendee list, filters, WhatsApp send, attendee-type email drafts, e-badge jobs, SC badge sync, attendees report, and edit badge.

**Entry:** `ui/AttendeesPage.jsx` (default export via `index.js`)  
**Page re-export:** `src/pages/Attendees.jsx`

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Pill colors, action button style, filter URL keys |
| `api/` | Report + single-attendee GET/PATCH (`attendeeApi.js`) + attendee-type emails (`attendeeTypeEmailsApi.js`) + category emails (`categoryTypeEmailsApi.js`) |
| `domain/` | Pure helpers — WhatsApp preview, job timing, field groups, edit payload, exhibitor POC, attendee-type + category email parse |
| `hooks/` | List / search / filters / types / selection + WhatsApp / e-badge / SC / jobs / report / edit |
| `ui/` | Page composition, table, toolbar, modals, report panel, edit form |

## Key UI files

- `AttendeesPage.jsx` — composes hooks + tabs / list / tasks / modals
- `AttendeesListView.jsx` — report panel, search, filter pills, selection bar, table, email drafts modal
- `AttendeeEmailDraftsModal.jsx` — Send Mail: Badge Email + category email toggles; View attendee-type drafts
- `AttendeesReportPanel.jsx` — collapsible badge counts by attendee type (ES/DB)
- `AttendeesReportCharts.jsx` — event total + vertical bar + pie charts
- `AttendeesModals.jsx` — detail / filter / WhatsApp / SC / e-badge / create / edit
- `EditAttendeeModal.jsx` — GET then full-body PATCH edit form
- `AttendeeDetailModal.jsx` — exhibitor portal password reset enabled when `is_poc`
- `WhatsAppTemplatePreviewPane.jsx` — raw/preview pane (split from picker)

## Common edits

- Filters UI → `ui/AttendeeFilterDrawer.jsx` + `hooks/useAttendeeFilters.js` + `hooks/useAttendeeTypes.js`
- List attendee email drafts → `ui/AttendeeSelectionBar.jsx` + `hooks/useAttendeeTypeEmails.js` + `api/attendeeTypeEmailsApi.js`
- Send attendee emails → `ui/AttendeeEmailDraftsModal.jsx` (Badge Email + Categories Email) + `hooks/useCategoryTypeEmails.js` + `api/categoryTypeEmailsApi.js`
- Attendees report → `ui/AttendeesReportPanel.jsx` + `ui/AttendeesReportCharts.jsx` + `hooks/useAttendeesReport.js` + `api/attendeesReportApi.js`
- Edit attendee / badge → `ui/EditAttendeeModal.jsx` + `hooks/useEditAttendee.js` + `api/attendeeApi.js` + `domain/editAttendeeForm.js`
- Exhibitor portal password reset (POC) → `ui/AttendeeSelectionBar.jsx` (single selected POC) + `ui/AttendeeDetailModal.jsx` + `domain/exhibitorPoc.js`
- Table row actions → `ui/AttendeeTableRow.jsx`
- WhatsApp send → `hooks/useWhatsAppSend.js` + `ui/WhatsAppSendModal.jsx`
- E-badge create/poll → `hooks/useEBadgeActions.js` + `hooks/useEBadgeJobs.js`
