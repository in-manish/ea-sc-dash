# Meeting Stats (EA)

Organizer report of meeting stats grouped by event × attendee type.

**Route:** `/event/:id/meetings?tab=stats`  
**GET** `/meetings/stats/report/` — table rows (always send `event_ids`, default current event)  
**POST** `/meetings/stats/report/` — email CSV (`emails` ≥ 1; file is async, not in the HTTP body)

## Layout

| Path | Owns |
|------|------|
| `api/meetingStatsReportApi.js` | GET table + POST email |
| `domain/meetingStatsQuery.js` | GET query / POST body; range wins over single date |
| `domain/parseMeetingStatsError.js` | 400 `msg` / `emails`; 401/403/404/500 copy |
| `domain/meetingStatsRows.js` | Sort event then attendee_type; number commas; unique column |
| `domain/meetingStatsEmails.js` | Email chips + persist |
| `hooks/useMeetingStatsReport.js` | Filters + GET (`refresh=true` busts 10 min cache) |
| `hooks/useEmailMeetingStatsReport.js` | POST email; 5s cooldown; success alert |
| `hooks/useAttendeeTypeOptions.js` | Fetch types for every selected event; merge unique names |
| `domain/attendeeTypeNames.js` | Unique type names; drop contractors |
| `domain/excludeContractors.js` | Hide contractor events, types, and table rows |
| `hooks/useOrganizerEvents.js` | Organizer events for the picker (`user.events` or GET `/events/`) |
| `domain/organizerEvents.js` | Merge/search event list by name or ID |
| `ui/MeetingStatsReportTab.jsx` | Page compose |
| `ui/MeetingStatsFilters.jsx` | Optional filters + apply/reset |
| `ui/MeetingStatsEventPicker.jsx` | Multi-select events (≥1); default current |
| `domain/eventRowColors.js` | Distinct tint per event in the table |
| `ui/MeetingStatsTable.jsx` | Grouped table; Event is `#id` + title; Sent + Received columns |
| `ui/MeetingStatsHeader.jsx` | Cache/live, last refreshed, refresh, email |
| `ui/MeetingStatsEmailModal.jsx` | Recipient emails |
| `ui/MeetingStatsEmailChips.jsx` | Email chip input |

## Rules

- `event_ids` is required (≥1); picker defaults to the current event; Select all / This event only
- Contractor events, attendee types, and report rows are hidden
- Sender/receiver type name filters (case-insensitive); both sides set uses AND; same-side names union with IDs
- Bind `attendee_type` (not `attendee_category`); show `meeting_requests_sent` and `meeting_requests_received`
- `unique_participants` defaults true; when false the unique column is omitted
- Cache is per filter set (10 min); `refresh=true` forces a recompute
- Email report: 5s cooldown after send; success uses themed alert (`msg` or “Email sent”)

## Wired from

- `src/pages/meetings/Meetings.jsx` — tab `stats`
- `src/pages/meetings/MeetingsTabs.jsx` — List / Restore / Stats tabs
- `src/layouts/EventLayout.jsx` / `src/sc/layouts/EventLayout.jsx` — Meetings submenu
