# Attendees feature

Event attendee list, filters, WhatsApp send, attendee-type email drafts, e-badge jobs, SC badge sync, attendees report, edit badge, and event upload history (Attendees tab).

**Entry:** `ui/AttendeesPage.jsx` (default export via `index.js`)  
**Page re-export:** `src/pages/Attendees.jsx`

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Pill colors, action button style, filter URL keys |
| `api/` | Report + single-attendee GET/PATCH (`attendeeApi.js`) + attendee-type emails (`attendeeTypeEmailsApi.js`) + category emails (`categoryTypeEmailsApi.js`) + active badge status/create (`activeBadgeApi.js`, supports `all_without_active`) + bulk CSV upload + dry-run validate + upload history (`attendeeUploadApi.js`) |
| `domain/` | Pure helpers — WhatsApp preview, job timing, field groups, edit payload, exhibitor POC, attendee-type + category email parse, active badge summaries/flow |
| `hooks/` | List / search / filters / types / selection + WhatsApp / e-badge / SC / jobs / report / edit / active badge |
| `ui/` | Page composition, table, toolbar, modals, report panel, edit form |

## Key UI files

- `AttendeesPage.jsx` — composes hooks + tabs / list / tasks / modals
- `AttendeeTableRow.jsx` — name / contact / company / permissions / type / status cells
- `AttendeePermissionChips.jsx` — list chips; click opens that code on Event Settings → Scan Location Permission (`?tab=scan-location&panel=codes&permission=<id>`)
- `AttendeeTableRowMenu.jsx` — row ⋯ menu: Matchmaking, Re-create E-badge, Sync SC
- Matchmaking answers modal lives in `src/features/Matchmaking/ui/AttendeeMatchmakingAnswers.jsx` (Seeking and Offering each request their own `answer_for`)
- `AttendeesListView.jsx` — report panel, search, filter pills, selection bar, table, email drafts modal
- `AttendeeEmailDraftsModal.jsx` — Send Mail: Badge Email + category email toggles; View attendee-type drafts
- `AttendeesReportPanel.jsx` — collapsible badge counts by attendee type (ES/DB)
- `AttendeesReportCharts.jsx` — event total + vertical bar + pie charts
- `AttendeesModals.jsx` — detail / filter / WhatsApp / SC / e-badge / create / edit / CSV upload
- `AttendeeUploadModal.jsx` — pick CSV, dry-run validate (per-row errors/warnings, no attendees created), then upload for real; results rendered via shared `components/common/CsvUploadResultPanel.jsx`
- `UploadsTabs.jsx` / `AttendeeUploadHistoryPanel.jsx` — event Uploads page Attendees tab
- `EditAttendeeModal.jsx` — GET then full-body PATCH edit form
- `AttendeeDetailModal.jsx` — exhibitor portal password reset enabled when `is_poc`; field values go through `formatDetailValue` so objects never render as React children
- `WhatsAppTemplatePreviewPane.jsx` — raw/preview pane (split from picker)

## Common edits

- Filters UI → `ui/AttendeeFilterDrawer.jsx` + `ui/AttendeePermissionFilter.jsx` + `hooks/useAttendeeFilters.js` + `hooks/useAttendeeTypes.js`. Filter state is the list URL. `permission_ids` and `permission_codes` are sent on `/attendees/search` with the same names.
- List attendee email drafts → `ui/AttendeeSelectionBar.jsx` + `hooks/useAttendeeTypeEmails.js` + `api/attendeeTypeEmailsApi.js`
- Send attendee emails → `ui/AttendeeEmailDraftsModal.jsx` (Badge Email + Categories Email) + `hooks/useCategoryTypeEmails.js` + `api/categoryTypeEmailsApi.js`
- Active badge status / create → `ui/ActiveBadgeToolbar.jsx` (preview/create all eligible) + `ui/AttendeeSelectionBar.jsx` (Check/Set selected) + `hooks/useActiveBadgeActions.js` + `api/activeBadgeApi.js` + `ui/ActiveBadgeResultModal.jsx`
- Attendees report → `ui/AttendeesReportPanel.jsx` + `ui/AttendeesReportCharts.jsx` + `hooks/useAttendeesReport.js` + `api/attendeesReportApi.js`
- Edit attendee / badge → `ui/EditAttendeeModal.jsx` + `hooks/useEditAttendee.js` + `api/attendeeApi.js` + `domain/editAttendeeForm.js`
- Exhibitor portal password reset (POC) → `ui/AttendeeSelectionBar.jsx` (single selected POC) + `ui/AttendeeDetailModal.jsx` + `domain/exhibitorPoc.js`
- Table row actions → `ui/AttendeeTableRowMenu.jsx` (⋯ menu: Matchmaking, Re-create E-badge, Sync SC)
- WhatsApp send → `hooks/useWhatsAppSend.js` + `ui/WhatsAppSendModal.jsx`
- E-badge create/poll → `hooks/useEBadgeActions.js` + `hooks/useEBadgeJobs.js`
- Bulk attendee CSV upload / dry-run validate → `ui/AttendeeUploadModal.jsx` + `hooks/useAttendeeUpload.js` (thin wrapper over the shared `src/hooks/useCsvUploadFlow.js`) + `api/attendeeUploadApi.js`; triggered from `ui/AttendeesPageHeader.jsx` (Upload CSV button), rendered from `ui/AttendeesModals.jsx`. Create-flow only (no replicate/update by Reg ID in this UI). The company bulk-upload flow (`src/components/companies/CompanyUploadModal.jsx`) shares the same hook + `components/common/CsvUploadResultPanel.jsx`.
- Event upload history (Attendees tab) → `src/pages/AttendeeUploads.jsx` + `ui/UploadsTabs.jsx` + `ui/AttendeeUploadHistoryPanel.jsx` + `hooks/useAttendeeUploadHistory.js` + `GET .../attendee/upload/report/`. Shared table: `src/components/uploadHistory/`.
