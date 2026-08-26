# Visiq (EA)

Organizer subscriber CRM: browse subscribers and manage CSV/Excel import jobs.

**Route:** `/event/:id/visiq?tab=subscribers|imports`  
APIs are tenant-scoped under `/visiq/` (no event id in path). Auth: organizer `Token`.

## API groups

| Group | Endpoints |
|-------|-----------|
| Subscribers | `GET /visiq/subscribers/` (page, size, search, status); `GET /visiq/subscribers/:id/` |
| Imports | `GET /visiq/imports/`; `POST /visiq/imports/` (multipart → 202); `GET /visiq/imports/:id/` |
| Import file | Use `file` URL on the job payload; fetch + preview/download in browser |

## Layout

| Path | Owns |
|------|------|
| `api/subscriberApi.js` | List + detail subscribers |
| `api/importApi.js` | List / create / detail |
| `domain/loadImportCsvSource.js` | Fetch `job.file` URL; CSV parse / download |
| `domain/parseCsvPreview.js` | CSV text → headers/rows |
| `domain/formatDate.js` | List/detail dates via `src/utils/formatDateTime.js` (en-IN, IST) |
| `hooks/useImportFileActions.js` | Preview / download from `job.file` or local File |
| `ui/ImportPreviewModal.jsx` | In-browser table preview |
| `ui/ImportsTab.jsx` | Upload, history, preview, download |

## Wired from

- `src/pages/Visiq.jsx` — thin page
- `src/App.jsx` — `/event/:id/visiq`
- `src/layouts/EventLayout.jsx` — Visiq sidebar submenu
