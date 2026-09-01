# Attendees feature

Event attendee list, filters, WhatsApp send, attendee-type email drafts, e-badge jobs, SC badge sync, attendees report, and edit badge.

**Entry:** `ui/AttendeesPage.jsx` (default export via `index.js`)  
**Page re-export:** `src/pages/Attendees.jsx`

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Pill colors, action button style, filter URL keys |
| `api/` | Report + single-attendee GET/PATCH (`attendeeApi.js`) + attendee-type emails (`attendeeTypeEmailsApi.js`) + category emails (`categoryTypeEmailsApi.js`) + active badge status/create (`activeBadgeApi.js`, supports `all_without_active`) + bulk CSV upload + dry-run validate (`attendeeUploadApi.js`) |
| `domain/` | Pure helpers — WhatsApp preview, job timing, field groups, edit payload, exhibitor POC, attendee-type + category email parse, active badge summaries/flow |
| `hooks/` | List / search / filters / types / selection + WhatsApp / e-badge / SC / jobs / report / edit / active badge |
| `ui/` | Page composition, table, toolbar, modals, report panel, edit form |

## Key UI files

- `AttendeesPage.jsx` — composes hooks + tabs / list / tasks / modals
- `AttendeeTableRow.jsx` — name / contact / company / type / status cells
- `AttendeeTableRowMenu.jsx` — row ⋯ menu: Matchmaking, Re-create E-badge, Sync SC
- `AttendeesListView.jsx` — report panel, search, filter pills, selection bar, table, email drafts modal
- `AttendeeEmailDraftsModal.jsx` — Send Mail: Badge Email + category email toggles; View attendee-type drafts
- `AttendeesReportPanel.jsx` — collapsible badge counts by attendee type (ES/DB)
- `AttendeesReportCharts.jsx` — event total + vertical bar + pie charts
- `AttendeesModals.jsx` — detail / filter / WhatsApp / SC / e-badge / create / edit / CSV upload
- `AttendeeUploadModal.jsx` — pick CSV, dry-run validate (per-row errors/warnings, no attendees created), then upload for real
- `AttendeeUploadRowIssues.jsx` — row-level error/warning cards for the upload validator
- `EditAttendeeModal.jsx` — GET then full-body PATCH edit form
- `AttendeeDetailModal.jsx` — exhibitor portal password reset enabled when `is_poc`
- `WhatsAppTemplatePreviewPane.jsx` — raw/preview pane (split from picker)

## Common edits

- Filters UI → `ui/AttendeeFilterDrawer.jsx` + `hooks/useAttendeeFilters.js` + `hooks/useAttendeeTypes.js`
- List attendee email drafts → `ui/AttendeeSelectionBar.jsx` + `hooks/useAttendeeTypeEmails.js` + `api/attendeeTypeEmailsApi.js`
- Send attendee emails → `ui/AttendeeEmailDraftsModal.jsx` (Badge Email + Categories Email) + `hooks/useCategoryTypeEmails.js` + `api/categoryTypeEmailsApi.js`
- Active badge status / create → `ui/ActiveBadgeToolbar.jsx` (preview/create all eligible) + `ui/AttendeeSelectionBar.jsx` (Check/Set selected) + `hooks/useActiveBadgeActions.js` + `api/activeBadgeApi.js` + `ui/ActiveBadgeResultModal.jsx`
- Attendees report → `ui/AttendeesReportPanel.jsx` + `ui/AttendeesReportCharts.jsx` + `hooks/useAttendeesReport.js` + `api/attendeesReportApi.js`
- Edit attendee / badge → `ui/EditAttendeeModal.jsx` + `hooks/useEditAttendee.js` + `api/attendeeApi.js` + `domain/editAttendeeForm.js`
- Exhibitor portal password reset (POC) → `ui/AttendeeSelectionBar.jsx` (single selected POC) + `ui/AttendeeDetailModal.jsx` + `domain/exhibitorPoc.js`
- Table row actions → `ui/AttendeeTableRowMenu.jsx` (⋯ menu: Matchmaking, Re-create E-badge, Sync SC)
- WhatsApp send → `hooks/useWhatsAppSend.js` + `ui/WhatsAppSendModal.jsx`
- E-badge create/poll → `hooks/useEBadgeActions.js` + `hooks/useEBadgeJobs.js`
- Bulk attendee CSV upload / dry-run validate → `ui/AttendeeUploadModal.jsx` + `ui/AttendeeUploadRowIssues.jsx` + `hooks/useAttendeeUpload.js` + `api/attendeeUploadApi.js`; triggered from `ui/AttendeesPageHeader.jsx` (Upload CSV button), rendered from `ui/AttendeesModals.jsx`. Create-flow only (no replicate/update by Reg ID in this UI).
