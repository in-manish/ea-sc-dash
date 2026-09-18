# AiPresets (EA)

Organizer AI system prompt presets: list, create, edit, delete, and matchmaking preview.

**Route:** `/event/:id/ai`  
**Preview:** `/event/:id/ai/preview`  
APIs are tenant-scoped under `/ai/presets/` (no event id in path except preview query). Auth: organizer `Token` (`ea.org_perms`).

Matchmaking uses `preset_key` `mm_seeking_mapper`. That prompt must include `{{QUESTION_OPTIONS}}`.

## API

| Method | Path | Notes |
|--------|------|-------|
| GET | `/ai/presets/` | List |
| POST | `/ai/presets/` | Create (`preset_key` immutable after) |
| GET / PUT / PATCH | `/ai/presets/:preset_key/` or `/ai/presets/:id/` | Read / full / partial |
| DELETE | `/ai/presets/:id/` | Numeric id only; 204 |
| GET | `/ai/presets/mm_seeking_mapper/preview/?event_id=` | Fills event seeking catalog; optional `user_query`, `filters` (people-list pill JSON). Does not call the LLM. `used_fallback` if DB preset missing or has no `{{QUESTION_OPTIONS}}`. 400 if `event_id` missing; 404 if event missing. |

## Layout

| Path | Owns |
|------|------|
| `api/aiPresetsApi.js` | List / get / create / patch / put / delete / preview |
| `domain/presetPayload.js` | Create/PATCH body + local validation |
| `domain/parseAiPresetError.js` | Field errors + 400/401/403/404 copy |
| `domain/previewQuery.js` | Preview query + filters JSON parse |
| `domain/parsePreviewCatalog.js` | Parse catalog text into questions/options |
| `hooks/useAiPresetList.js` | Load list |
| `hooks/useAiPresetEditor.js` | Create + PATCH edit modal |
| `hooks/useDeleteAiPreset.js` | Confirm then DELETE by id |
| `hooks/useAiPresetPreview.js` | GET mm_seeking_mapper preview for current event |
| `ui/AiPresetsPage.jsx` | Page orchestrator |
| `ui/AiPresetPreviewPage.jsx` | Full-page catalog + filled prompts |
| `ui/AiPresetPreviewResult.jsx` | Tabs: catalog / system prompt / user prompt |
| `ui/AiPresetPreviewCatalog.jsx` | Searchable expandable catalog |
| `ui/AiPresetPreviewPromptPane.jsx` | Full-height prompt text + copy |
| `ui/AiPresetPreviewTabs.jsx` | Catalog / system / user tabs |
| `ui/AiPresetPreviewCopyButton.jsx` | Clipboard copy with confirmation |

## Wired from

- `src/pages/Ai.jsx` — thin page
- `src/pages/AiPreview.jsx` — thin preview page
- `src/App.jsx` — `/event/:id/ai`, `/event/:id/ai/preview`
- `src/layouts/event-layout/eventNavConfig.js` — AI sidebar item (Sparkles)
