# Matchmaking Feature

Matchmaking questions, exhibitor portal Q&A, SurveyJS mapping, and SurveyJS backfill.

## Layout

```text
api/matchmakingFormApi.js              GET/POST questions/matchmaking + make_copy
api/matchmakingApi.js                  re-exports form + exhibitor + survey + backfill
api/matchmakingSurveyApi.js            SurveyJS mapping + OTM form list / get-form-json
api/matchmakingSurveyBackfillApi.js    mapping CSV, mapping list, run backfill, logs
api/matchmakingSurveyBackfillUploadsApi.js  upload history list/detail/download
domain/parseBackfillMappingResult.js   normalize CSV + log responses (+ upload_id)
domain/parseBackfillMappingList.js     normalize GET mapping/ groups
domain/parseBackfillMappingUploads.js  normalize upload list/detail
hooks/useSurveyBackfill*.js            CSV, uploads, mapping list, run, logs poll
ui/AttendeeMatchmakingAnswers.jsx      attendee Seeking/Offering (answer_for filter)
ui/SurveyMapping/                      interactive SurveyJS ↔ EA choice mapping
ui/SurveyBackfill/                     CSV + upload history + mappings + run + logs
ui/Matchmaking.jsx                     tabs via ?tab=questions|exhibitor|mapping|backfill
ui/MatchmakingQuestions.jsx            questions tab orchestrator
ui/MatchmakingEmptySetup.jsx           404: create new form + copy from another event
ui/CopyMatchmakingModal.jsx            copy wizard (empty state only)
```

## Form flow (must follow)

1. GET `/events/{current}/questions/matchmaking/`
   - 404 → empty state: Create new form + Copy. Copy is allowed only here.
   - 200 (form or any questions) → editor. Hide copy. Never copy/merge/overwrite.
2. Create (404 only): POST same URL **without** `form_id`. Need ≥1 question. Use returned `id` as `form_id`.
3. Edit: POST with dest `form_id`. Only changed dest questions. Never source question IDs.
4. Copy: POST `/evc/matchmaking/make_copy/` only after current GET 404.
   - Source picker GETs the **source** event (read-only). 404 → block Continue.
   - Copy all omits `question_ids`. Selected sends checked source IDs (≥1).
   - Dest-already-exists → reload GET, open editor. Do not retry as create/edit.
5. After copy: GET current event and edit with dest IDs only.

Do not use `/registration/forms/` for create/copy/edit.

Tabs (URL, required):

- `/event/:id/matchmaking` or `?tab=questions` — Matchmaking Questions
- `?tab=exhibitor` — Exhibitor Portal Questions
- `?tab=mapping` — SurveyJS Mapping
- `?tab=backfill` — **New** surveyjs mapping & backfill (CSV + mappings + run + logs).
  Filters in URL: `status`, `form_value`, `map_search`, `page`, `page_size=20|50|100`.
  Badge UUID opens `/event/:id/attendees?q=`.

Deep links `?create=product` and `?question=` open the questions tab.

## SurveyJS mapping (OTM form JSON)

Host follows dashboard env:

- STAGE / LOCAL → `https://api-stage.otm.co.in`
- PROD → `https://api-prod.otm.co.in`

`GET {host}/api/get-form-list?eventCode=reconnect_{eventId}` fills the Source Form dropdown.
Selecting a value POSTs `{host}/api/get-form-json` with `showAfterSubmit: true`.
Mapping GET/POST stays on dashboard
`getApiUrl()` (`/events/:id/matchmaking/surveyjs-question-mapping/`).

## SurveyJS backfill (`?tab=backfill`)

1. POST `/events/:id/matchmaking/surveyjs-backfill/mapping-csv/` — multipart `file` + `dry_run`.
   UI always dry-runs first; confirm saves (`dry_run=false`) and replaces mappings per form in the CSV.
   Save response includes `upload_id` (null on dry run).
2. GET `/events/:id/matchmaking/surveyjs-backfill/mapping-uploads/` — upload history (paged).
   GET `.../mapping-uploads/{id|latest}/` — detail + content + report.
   GET `...?download=true` — original CSV via authenticated blob download.
3. GET `/events/:id/matchmaking/surveyjs-backfill/mapping/` — EA-question groups (`form_value`, `search`).
   Top-level `forms` ignores filters (dropdown). Saves refresh this list.
4. POST `/events/:id/matchmaking/surveyjs-backfill/run/` — queues Celery (`form_value?`, `force?`); 202.
5. GET `/events/:id/matchmaking/surveyjs-backfill/logs/` — counts + paged rows; poll after queue (no job-status API).
