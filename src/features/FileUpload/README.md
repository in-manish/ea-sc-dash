# File Upload

Organizer general-file upload (`POST /uploads/files/`). Default call is still **file only**.

Optional form fields:

- `keep_name=true` — store the local basename (overwrite same name)
- `link` + `is_s3_link=true` — replace an existing tenant general-file object in place (same URL). Wins over `keep_name`.

In the floating utility: **Replace existing file** reveals a URL field. Do not send `is_s3_link=true` unless `link` matches `{schema}/general/{images|media-content|files}/{filename}`.

## Layout

| Path | Owns |
|------|------|
| `api/fileUploadApi.js` | POST multipart; Token auth; no `/api` prefix |
| `domain/buildUploadFormData.js` | Mode: create / keep_name / replace |
| `domain/generalFileLink.js` | Tenant general-file URL parse |
| `domain/keepNameFilename.js` | Basename validation |
| `domain/parseUploadResponse.js` | `msg` errors; replace keeps prior `file_url` |
| `hooks/useGeneralFileUpload.js` | File pick, keep-name, replace target |
| `hooks/useFileUploadHistory.js` | Local last-20 history |
| `hooks/useDraggablePanel.js` | FAB / panel drag + position |
| `ui/FloatingFileUploadTool.jsx` | Orchestrator |
| `ui/EventFloatingFileUploadTool.jsx` | Hide on Companies |

## Wired from

- `src/components/FloatingFileUploadTool.jsx` — re-export
- `src/services/fileUploadService.js` — re-export
- `src/layouts/EventLayout.jsx` / `src/sc/layouts/EventLayout.jsx`
