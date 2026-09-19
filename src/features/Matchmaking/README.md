# Matchmaking Feature

Matchmaking questions, exhibitor portal Q&A, and SurveyJS mapping.

## Layout

```text
api/matchmakingFormApi.js     GET/POST questions/matchmaking + make_copy
api/matchmakingApi.js         exhibitor answers, survey mapping, delete
api/matchmakingSurveyApi.js   SurveyJS mapping save/get + OTM get-form-json
domain/                       form-exists, copy payload, save payload, 404
domain/surveyJsApiUrl.js      OTM SurveyJS host: STAGE/LOCAL stage, PROD prod
hooks/useMatchmakingForm.js   load current event (404 = empty setup)
hooks/useCopyMatchmaking.js   copy wizard (source GET, all/selected, map)
ui/MatchmakingQuestions.jsx   questions tab orchestrator
ui/MatchmakingEmptySetup.jsx  404: create new form + copy from another event
ui/CopyMatchmakingModal.jsx   copy wizard (empty state only)
ui/SurveyMapping/             SurveyJs Mapping tab
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

## SurveyJS mapping form JSON

`getSurveyForm` POSTs `{form_value, eventCode}` to `{host}/api/get-form-json`.

- STAGE and LOCAL: `https://api-stage.otm.co.in`
- PROD: `https://api-prod.otm.co.in`

Save/load of mappings still uses dashboard `getApiUrl()` (`/events/:id/matchmaking/surveyjs-question-mapping/`).
