# Chat Reminder (EA)

Control panel for unread meeting-chat reminder emails. Settings are per **tenant** (they apply to every event of
that EA tenant), so the tab looks the same from any event.

**Route:** `/event/:id/settings?tab=chat-reminder` (own save buttons; the page Save Changes is hidden here).
Reminders are **off by default**.

## APIs

| Call | Used for |
|------|----------|
| `GET/PATCH /meeting/chat-reminder/config/` | Settings. PATCH sends only changed fields; `{set_go_live_now: true}` moves go-live to now. Turning `activate` on sets go-live if missing. |
| `GET /meeting/chat-reminder/status/` | Blockers, counts, active events, environment, schedule, kill switch |
| `POST /meeting/chat-reminder/preview/` | Dry run `{limit, receiver_evc_ids?, cutoff_minutes?}`; sends nothing |
| `POST /meeting/chat-reminder/send/` | Send now, same body + `confirm: true`; needs activate on and an active event |
| `GET /meeting/chat-reminder/activity/?limit=` | Latest digests and audit events |
| `POST /common-services/emailing/kill-switches/` | Emergency stop / resume (`email.chat_unread_reminder`) |
| `PATCH /celery-beat/tasks/status/`, `PATCH /celery-beat/tasks/:id/` | Schedule on/off and interval. **Shared by all tenants.** |

Settings errors come back as `400 {errors: {field: text}}`.

## Layout

| Path | Owns |
|------|------|
| `api/chatReminderApi.js` | All calls above |
| `domain/chatReminderConfig.js` | Field list + bounds (mirror EA), defaults, changed-field diff, validation |
| `domain/chatReminderStatus.js` | Schedule minutes, kill-switch lookup, receiver id parsing, labels |
| `domain/parseChatReminderError.js` | 401/403 text, `{errors}` → field messages |
| `domain/chatReminderTab.js` | Tab id |
| `hooks/useChatReminderConfig.js` | Load/edit/save settings (keeps unsaved edits when the switch saves) |
| `hooks/useChatReminderOverview.js` | Status + activity, schedule and kill-switch actions |
| `hooks/useChatReminderRun.js` | Dry run / send now |
| `ui/ChatReminderPage.jsx` | Tab content |
| `ui/ChatReminder*Card.jsx`, `ui/Banner.jsx` | Status, Settings, Schedule & emergency stop, Dry run & send, Activity |

## Wired from

- `src/pages/event-settings/index.jsx` (tab list, hides Save Changes on this tab)

Backend: EA `meeting/Views/chat_reminder/ChatReminderAdminViews.py`, docs `EA/docs/meeting/chat-unread_api.md`.
