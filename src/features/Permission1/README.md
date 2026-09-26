# Permission 1

Event code map (`permission1_codes`) and the attendee code picker that sends `permission1` as `A|B`.

**Settings:** `/event/:id/settings?tab=attendees`  
**Attendees:** create modal and edit modal on `/event/:id/attendees`

## Layout

| Path | Owns |
|------|------|
| `domain/permission1Codes.js` | Map/rows, validation, `A\|B` wire value (`\|` clears on update) |
| `ui/Permission1CodesEditor.jsx` | Settings rows: next free letter (A, B, C) is filled in, with a dropdown of the rest |
| `ui/Permission1CodePicker.jsx` | Create/edit checkboxes from the event map |
| `hooks/useEventPermission1Codes.js` | GET event details → `{ codeMap, ready }` |

Save the event with the rest of Settings. Create omits an empty selection. Update sends the joined codes, or `|` when every box is cleared and the event has codes.
