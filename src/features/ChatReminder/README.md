# Chat Reminder (EA)

Tenant config for unread meeting-chat reminders. Lives on Event Settings → Meeting Diary.

**Route:** `/event/:id/settings?tab=meeting_diary`  
**GET** `/meeting/unread-reminder/config/` — current values (defaults if never saved)  
**POST** `/meeting/unread-reminder/config/` — save `{ activate, cooldown_minutes, cutoff_minutes, days_window }`

Saves via **Save chat reminder** on the card, or page **Save Changes** (if this tab is open and values changed).

## Layout

| Path | Owns |
|------|------|
| `api/unreadReminderApi.js` | GET + POST config |
| `domain/unreadReminderConfig.js` | Defaults, normalize, payload, dirty check |
| `domain/parseUnreadReminderError.js` | 401/403/404/500 + field errors |
| `domain/chatReminderSaveBridge.js` | Register save for page Save Changes |
| `hooks/useUnreadReminderConfig.js` | Load / edit / save |
| `ui/ChatReminderSettings.jsx` | Toggle + numeric fields + save |

## Wired from

- `src/pages/event-settings/MeetingDiarySettings.jsx`
