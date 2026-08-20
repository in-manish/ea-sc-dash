# WhatsApp templates

Communication → WhatsApp tab. List, create, edit, preview, archive, and restore templates.

**Entry:** `ui/WhatsAppConfig.jsx` (default export from this feature)  
**Page:** `src/pages/Communication.jsx` (`?tab=whatsapp`)  
**Send (active only):** Attendees `hooks/useWhatsAppSend.js` via `src/services/whatsappService.js`

## Layout

| Path | Owns |
|------|------|
| `constants.js` | Status, category, provider, Active/Archived scope |
| `api/whatsappTemplateApi.js` | GET list, POST create, PATCH update/restore, DELETE archive |
| `domain/templateHelpers.js` | Variables, preview HTML |
| `domain/templateListQuery.js` | List query; omit `is_active` for active-only |
| `hooks/useWhatsAppTemplateList.js` | List + archive + restore |
| `hooks/useWhatsAppTemplateEditor.js` | Create/edit/preview form |
| `ui/` | Config, list, card, form, preview, scope toggle |

## API

- `GET /wa/template/list/` — omit `is_active` (or true) = active; `is_active=false` = archived
- `DELETE /wa/template/:id/` — archives (`is_active: false`); row still GET-able
- `PATCH /wa/template/:id/` `{ is_active: true }` — restore
- Create / PUT / GET-by-id / preview / test unchanged. Token auth, no `/api` prefix.

## Common edits

- Archive / restore / Active-Archived toggle → `hooks/useWhatsAppTemplateList.js` + `ui/TemplateScopeToggle.jsx`
- Alerts / confirms → shared `useAlert` (`src/components/alert/` + `AlertContext`)
- List filters (category, status, search) → `ui/TemplateList.jsx`
- Form / variables → `hooks/useWhatsAppTemplateEditor.js` + `ui/TemplateForm.jsx`
