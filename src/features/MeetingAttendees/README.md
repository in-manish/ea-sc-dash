# Meeting Attendees (EA)

Organizer list of event attendees with their meeting counts, and a way to email them from the existing email templates.

**Route:** `/event/:id/meetings?tab=attendees`  
**GET** `/events/:id/meetings/attendees/` — one page (`page`, `page_size=50`); needs `attendee_type_ids`  
**POST** `/events/:id/meetings/attendees/email/` — queues the emails (202). Same filters as the list, so the people emailed are the people listed.

## How the screen works

1. Pick attendee types (required), set optional at-least / at-most boxes for **Pending received**, **Pending sent**, **Confirmed** and **Declined**, optionally "only with email", press **Apply**. The table shows the same four counts.
2. Tick attendees, or use **Select all N matching the filter** (sends `send_to_all`).
3. **Send email** opens the dialog: for each attendee type, pick a template from a searchable card list (name, subject, short text). Hovering a card previews the full email on the right; clicking selects it. "Use this template for all attendee types" copies the choice. Then choose up to 3 or 5 company names for the body.
4. Review step shows who gets which template; **Confirm and send** posts the request.

### Templates per attendee type

- Meeting templates are Email Templates whose type slug starts with `meeting_`. The slug for an attendee type is `meeting_` + its name in lowercase with `_` (Hosted Buyer - International → `meeting_hosted_buyer_international`).
- The dialog lists every selected attendee type: **Template already created: <name>** (and that template is pre-selected), or **No template yet. Slug: <slug>** with a **Create template** button.
- **Create template** saves the filters and selection, opens Communication → Email → Templates with `?create_type=<slug>&return_to=...`, and after saving or closing returns here with `?resume=1`, which restores the filters and selection and reopens the dialog.

Specific people (`uuids`) win over `send_to_all`; the API returns 400 if neither is sent.

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Page size, company-name choices, `COUNT_FILTERS` (one entry per meeting count: filter names, API prefix, row field, label) |
| `api/meetingAttendeesApi.js` | GET list + POST send |
| `domain/attendeeFilters.js` | Filters to GET query / POST body, validation |
| `domain/sendPayload.js` | Template grouping, send body (`uuids` or `send_to_all`) |
| `domain/parseMeetingAttendeesError.js` | API `msg` and status copy |
| `hooks/useMeetingAttendees.js` | Draft / applied filters, page, load |
| `hooks/useAttendeeTypes.js` | Event attendee types `{ id, name }` |
| `hooks/useEmailTemplateOptions.js` | Active templates (loaded when the dialog opens) |
| `hooks/useAttendeeSelection.js` | Chosen uuids or "all matching" |
| `hooks/useSendMeetingAttendeeEmail.js` | POST send, in-flight guard |
| `ui/MeetingAttendeesTab.jsx` | Page compose |
| `ui/MeetingAttendeesFilters.jsx` | Type chips, email-only |
| `ui/MeetingCountFilters.jsx` | At least / at most for each meeting count |
| `ui/MeetingAttendeesTable.jsx` / `MeetingAttendeesPager.jsx` | Rows with checkboxes, paging |
| `ui/MeetingAttendeesSelectionBar.jsx` | Selected count, select all matching, Send email |
| `ui/SendEmailModal.jsx` + `SendEmailPickStep.jsx` + `SendEmailReviewStep.jsx` | Template choice, then review and confirm |
| `ui/TemplatePicker.jsx` + `TemplateCard.jsx` | Searchable meeting template cards (name, subject, snippet, "For this type") |
| `ui/TypeTemplateStatus.jsx` | Per attendee type: template created, or slug + Create template |
| `domain/meetingTemplates.js` | Type slug, own template per type, default choices, create-template link |
| `domain/resumeState.js` | Save / restore filters and selection around creating a template |
| `ui/TemplatePreview.jsx` + `domain/templateText.js` | Sandboxed preview frame (no scripts); `{{ variables }}` highlighted; snippet text |

## Wired from

- `src/pages/meetings/Meetings.jsx` — tab `attendees`
- `src/pages/meetings/MeetingsTabs.jsx` — tab button
- `src/layouts/event-layout/eventNavConfig.js` and `src/sc/layouts/EventLayout.jsx` — Meetings submenu
