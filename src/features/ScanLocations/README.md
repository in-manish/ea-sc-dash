# Scan locations

Event scan gates and the permission codes required at each one.

**Route:** `/event/:id/settings?tab=scan-location`  
**Sub-tabs:** `?panel=locations` (default), `?panel=codes`, `?panel=service` and `?panel=metrics`  
**Focus one code:** `?panel=codes&permission=<id>` (from an attendee-list chip)  
**Attendees with a code:** each row’s Attendees link opens `/event/:id/attendees?permission_ids=<id>`

## APIs

| Call | Who | Notes |
|------|-----|--------|
| GET `/events/:eventId/locations/scan/` | organizer, scan, print, kiosk, staff | newest first; `permissions: []` is open entry; UI hides `deleted: true` |
| POST `/events/:eventId/locations/scan/` | organizer, scan, print, kiosk, staff write | `permissions` are ids; Special defaults false unless ids are sent without the key |
| PATCH `/events/:eventId/locations/scan/:id/` | organizer, scan, print, kiosk | `location` required; `permissions` ids replace the list; `[]` clears codes but not Special unless `special_permission` is sent |
| DELETE `/events/:eventId/locations/scan/:id/` | organizer, scan, print, kiosk | 204 soft delete |
| GET `/events/:eventId/permission-codes/` | organizer, scan, print, kiosk | `{ id, code, name, from_date, end_date, from_time, end_time, is_active }` |
| POST `/events/:eventId/permission-codes/` | organizer | code and name required; dates, times, and `is_active` optional |
| PATCH `/events/:eventId/permission-codes/:id/` | organizer | send only changed fields; code is not renamed; `null` clears a date or both times |
| DELETE `/events/:eventId/permission-codes/:id/` | organizer | 204; 400 while a location or badge uses the code |
| GET `/events/:eventId/permission-codes/metrics/` | organizer | badges per permission and the locations that require it; `group_by=attendee_type` adds a breakdown; cached 10 minutes |
| GET `/events/:eventId/permission-codes/scan-metrics/` | organizer | scans per location and permission; `date` or `from`/`to`, `scanned_in=IN\|OUT`, `group_by=date`; cached 10 minutes |
| GET/POST `/events/:eventId/permission-sources/options/` | organizer | the SurveyJS options (id, price, title, date, `12:30 PM` times); GET adds the mapped permissions, suggestions by date and time, and waiting attendees |
| PUT `/events/:eventId/permission-sources/mapping/` | organizer | `{mappings: [{source_option_id, permission_ids}]}` replaces the permissions of each option (one option can grant several); waiting attendees are updated |
| POST `/events/:eventId/permission-sources/backfill/` | organizer | `{records: [{uuid, badge_permission \| surveyjs_attendee_permission}], dry_run, retry_pending}`, at most 500 records; EA matches a `badge_permission` to an option by price |
| GET `/events/:eventId/permission-sources/ledger/` | organizer | what changed or is waiting (a permission added, an option with no mapping, an unknown attendee, an error); a permission the attendee already holds is not written. Columns: action, how it arrived, batch; one record per attendee: a `permissions` list (everything added) and an `entries` list (one per option: action, how, batch, resolved); `action`, `via` and `batch_id` are the latest sync; filters `badge_uuid`, `source_option_id` (any entry), `permission_id`, `batch_id`, `action`, `via`, paging |
| GET `{SurveyJS}/api/get-form-question`, `/api/badge-permissions` | logged-in EA token | `eventCode=reconnect_<id>`, `form_value`, and the optional extra query. **Fetch purchases** also sends `page` and `size` and walks every page (`total` / `totalPages`) before the backfill summary |
| POST/PATCH attendees | existing badge APIs | optional `permissions` id list on each attendee; `[]` clears on update |

The **SurveyJS mapping** tab has three sections. *Options and mapping*: pick the SurveyJS form (the list the matchmaking tab uses, or type it) and an optional extra query, **Fetch options from SurveyJS** (each choice that has a `badge_permission` becomes an option, id = the choice value, price from the permission) or paste or upload JSON, then map by hand: the SurveyJS options are listed on the left and the event permissions on the right; pick an option, tick one or more permissions, Save. Nothing is mapped automatically; a "Suggested" tag by date and time is only a hint. Each option shows its price in a highlighted chip (attendees are matched by it) and a copy button next to its title (`ui/CopyTitleButton.jsx`); the title text can also be selected. The picked option's card has a violet fill, a thick ring and a "Selected" tag, and the permissions header turns violet with "Mapping this option"; each ticked permission gets the same fill, ring and "Selected" tag. The chosen SurveyJS form, the extra query, the section (Options and mapping, Backfill, Ledger) and the picked option are kept in this browser per event (`hooks/usePersistedState.js`, localStorage keys `ea_service_mapping:<eventId>:form|query|section|option`), so leaving the screen or reloading does not clear them. Unsaved ticks are not kept. The date and the time are highlighted as chips (`ui/TimingChips.jsx`) on both sides: blue on the options; on the permissions the date chip and the time chip are each green when they fit the picked option, red when they do not, and blue when they cannot be compared. Every permission is coloured against the picked option (`domain/serviceOptionMatch.js`): green when the date and daily time overlap (or cannot be compared) and the permission name appears in the option title, amber when the name differs or nothing could be compared, red when the date or time does not match. A mapped SurveyJS option says "Mapped with 2 EA options:" followed by the short codes (A, D), coloured by fit with the full name and reason in a tooltip; an unmapped one says "Not mapped", and unsaved ticks show "Unsaved: A, C". The card's left bar takes the worst colour. On a wide screen violet lines join the picked option to each ticked permission (`ui/ServiceMappingLines.jsx`, drawn from measured positions; redrawn on tick, scroll and resize, hidden when the lists stack). *Backfill*: **Fetch purchases from SurveyJS** loads every page (`page`, `size`, plus the extra query). While that runs, the row shows page, attendees loaded, and a percent bar (`ui/PurchaseFetchProgress.jsx`). It then sends `{uuid, badge_permission}` to EA in chunks of 500 (attendees with a null `badge_permission` are not sent); a dry run is the default; a JSON or CSV file works too. After a run, **Show the N record(s)** (inside `ui/BackfillRecords.jsx`) lists every record (uuid, option, status, permission count) with a status filter and 50 per page. The uuid links to `/event/:id/attendees?q=<uuid>` (the list's search box); the permission count expands to each permission's code, name and window. *Ledger*: filters and paging. An option nobody mapped yet, or an attendee EA does not know yet, is kept as waiting and updated when the mapping or the attendee appears.

Both metrics calls accept `refresh_cache=true`, which rebuilds the server cache; the **Refresh data** buttons send it. The page shows when the numbers were built and whether they were served from the cache (`cached`, `generated_at`). "With / without permission" per location uses each badge's permissions today, not when it was scanned. A 403 on both calls shows one organizer-only message. The Permission codes table also shows **Badges** and **Required at** from the holders call, and hides them (—) when that call is refused.

Dates and times are shown as returned (no `Date` parsing). Edit controls are organizer-only; a 403 hides them. 404 refreshes the code list. 401 signs out. Location and badge chips include the same window. Switching back to locations reloads that list.

## Layout

| Path | Owns |
|------|------|
| `domain/scanLocationPanels.js` | `?panel=` locations \| codes, plus the short purpose copy |
| `domain/permissionWindow.js` | Date/time display, validation, PATCH diff |
| `domain/parseApiError.js` | Banner text + field errors |
| `api/permissionCodesApi.js` | Code list / create / update / delete |
| `api/scanLocationsApi.js` | Location list + PATCH |
| `api/permissionMetricsApi.js` | Holder metrics and scan metrics GETs (`refresh_cache`) |
| `domain/parsePermissionMetrics.js` | API shapes to camelCase rows (counts default to 0; open entry is `null`) |
| `domain/scanMetricsFilters.js` | Scan filters to query params, date checks, range text |
| `hooks/usePermissionMetrics.js` | `usePermissionHolderMetrics`, `usePermissionScanMetrics` (`refresh(true)` rebuilds the cache) |
| `api/permissionSourcesApi.js`, `api/otmPermissionsApi.js` | EA permission-sources calls; the two SurveyJS calls |
| `domain/parsePermissionSources.js`, `parseOtmData.js`, `purchasePage.js`, `collectPurchaseRows.js`, `extraQueryParams.js`, `parseSourceOptionsInput.js`, `parseBackfillInput.js` | Shapes to camelCase, SurveyJS data to options and records, purchase pages, extra query, JSON and CSV input readers |
| `hooks/useServiceOptions.js`, `useOtmServiceData.js`, `useServiceBackfill.js`, `useServiceLedger.js` | Option list and mapping save, SurveyJS fetches, chunked backfill, ledger |
| `ui/ServiceMappingPanel.jsx` | SurveyJS mapping sub-tab: `ServiceFormPicker`, `ServiceOptionsImport`, `ServiceMappingBoard` (`ServiceOptionList` on the left, `ServicePermissionList` on the right), `ServiceBackfillSection` (`BackfillRecords`, `PurchaseFetchProgress`), `ServiceLedgerSection` |
| `ui/PermissionMetricsPanel.jsx` | Metrics sub-tab: `HolderMetricsSection`, `ScanMetricsSection`, `ScanMetricsFilters`, `MetricTile`, `MetricsFreshness` |
| `ui/ScanLocationsPage.jsx` | Sub-tabs and purpose |
| `ui/PermissionCodesPanel.jsx` | Codes |
| `ui/ScanLocationsPanel.jsx` | Locations |

Event Settings tab. The old Utils Config and staff URLs redirect here.
