# ScEmailTemplates

SC admin email templates (`/email-templates`). Manage/edit modal matches EA: sidebar + device preview canvas.

| Path | Role |
|------|------|
| `ui/EmailTemplatesPage.jsx` | List + create + edit |
| `ui/EmailTemplateFilters.jsx` | Type / audience / event / title / from name / active |
| `ui/EmailTemplateTable.jsx` | Title, Type, Audience, Event, From name, Active, Updated |
| `ui/EmailTemplateEditModal.jsx` | GET-one; overview then edit |
| `ui/CreateEmailTemplateModal.jsx` | Create (starts in edit) |
| `ui/EmailTemplateFormModalShell.jsx` | EA-sized overlay (1600px / 95vh) + header actions |
| `ui/EmailTemplateEditorLayout.jsx` | Sidebar + DeviceToggle + canvas |
| `ui/EmailTemplateEditorSidebar.jsx` | Title / subject / type / audience / event / status / variables |
| `ui/EmailTemplatePreviewCanvas.jsx` | Device frame; Visual (Jodit) / Code / iframe preview |
| `ui/EmailTemplateVisualEditor.jsx` | Jodit rich text |
| `ui/EmailTemplateFileImport.jsx` | Browse local HTML into Code mode |
| `ui/EmailTemplateVariableChips.jsx` | Add / remove / insert `{{ name }}` |
| `hooks/useEmailTemplateList.js` | Fetch + filter + pagination |
| `hooks/useCreateEmailTemplate.js` | POST create |
| `hooks/useEmailTemplateDetail.js` | GET one, PUT, PATCH archive, revert |
| `api/emailTemplateApi.js` | List / one / create / PUT / PATCH |

## Modal (EA-like)

- Open a row → **Template overview** (read-only sidebar + 14" preview). **Edit Template** switches to modify mode.
- Create starts in edit. Header: Cancel / Save / Archive / Close.
- Right pane: Mobile / Tablet / 13" / **14"** / 16" device frames (same presets as EA).
- Edit canvas: **Visual** (Jodit) or **Code** (textarea + insert from file). Overview uses a sandboxed iframe.
- No DELETE. Archive / Reactivate via PATCH `is_active`.
- `from_sender_name` is optional; omit on create to use settings default. GET always returns the effective from-name.
- List query: `from_sender_name` (alias `from_name`). `filters.from_sender_name` and `filters.titles` are unscoped dropdowns.
