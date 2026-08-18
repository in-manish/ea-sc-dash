# Companies (EA)

Organizer company create/edit/detail helpers for the EA dashboard.

**Create:** `ui/CreateCompanyPage.jsx` → `/event/:id/companies/new`  
**Edit:** `ui/EditCompanyPage.jsx` → `/event/:id/companies/:companyId/edit`  
**Detail:** `ui/CompanyDetailsPage.jsx` → `/event/:id/companies/:companyId`  
**API:** multipart `FormData` + `Authorization: Token …` (no `/api` prefix)

## Layout

| Path | Owns |
|------|------|
| `api/companyApi.js` | GET company list (`sort_by`/`sort_order`), GET/POST/PATCH company, filter options, exhibitor overview, checklist remind POST, POC password reset, bulk lock/feature |
| `api/checklistReminderApi.js` | Reminder settings GET/PATCH + reminder log list + progress poll |
| `domain/checklistReminderHelpers.js` | Defaults, offsets, sent_status labels, progress %, `steps[]` / `step_ids` |
| `domain/buildCompanyFormData.js` | Create → multipart |
| `domain/buildCompanyPatchFormData.js` | Edit → changed fields only (+ `company_name`) |
| `domain/companyFromApi.js` | GET response → form state |
| `domain/parseCompanyError.js` | 400 ERROR / field errors |
| `domain/companyBulkActionPayload.js` | Lock/feature bulk PATCH body (`single`/`multiple`/`all`) |
| `domain/companyListSort.js` | List `sort_by` fields, defaults (`space`/`desc`), header mapping |
| `domain/exhibitorListFilters.js` | List filter keys + URL parse/apply |
| `hooks/useCompanyBulkAction.js` | PATCH bulk-action + success/error |
| `hooks/useExhibitorList.js` | Paginated list fetch + search/filters/sort URL state |
| `domain/formatCompanySearchLabel.js` | Parent search display |
| `domain/extractMatchmakingProductOptions.js` | Product option names from matchmaking `question_type=product` |
| `domain/buildAttendeePrefillFromCompany.js` | Prefill create-attendee from company detail |
| `domain/formatStallDetail.js` | Format stall_detail / contractor / requirements |
| `domain/parseHandoverDetails.js` | Normalize handover JSON (object or string) |
| `domain/companyFormDefaults.js` | Empty form + validation |
| `domain/setupChecklistHelpers.js` | Step sort, urgency chips, portal_route → organizer path |
| `hooks/useCreateCompany.js` | Create form submit |
| `hooks/useEditCompany.js` | Load + patch submit |
| `hooks/useCompanyCountries.js` | Country keys from filter options |
| `hooks/useMatchmakingProductOptions.js` | Matchmaking product question options for edit |
| `hooks/useExhibitorOverview.js` | Soft-fail Overview API for Setup Progress |
| `hooks/useSetupChecklistRemind.js` | POST remind + poll progress until completed/failed |
| `hooks/useChecklistReminderList.js` | Paginated reminder log |
| `hooks/useChecklistReminderSettings.js` | Load/save reminder settings |
| `ui/CompaniesPage.jsx` | Exhibitors / product matchmaking / AR tabs (list + sort) |
| `ui/CompaniesPageHeader.jsx` | Title, create/upload, search, sort, filter |
| `ui/CompaniesPageTabs.jsx` | Main tabs + exhibitor / AR sub-views |
| `ui/ExhibitorListSortControls.jsx` | `sort_by` select + asc/desc |
| `ui/ExhibitorFilterDrawer.jsx` | List filter drawer shell |
| `ui/ExhibitorFilterFields.jsx` | List filter fields |
| `ui/CreateCompanyPage.jsx` | Full-page create |
| `ui/EditCompanyPage.jsx` | Full-page edit |
| `ui/CompanyDetailsPage.jsx` | Detail compose (header → setup → cards → stall/catalog → tabs) |
| `ui/CompanyDetailsHeader.jsx` | Back + identity + Edit / View Orders |
| `ui/CompanyDetailsInfoGrid.jsx` | Overview / Badge / Contact / System (company detail API) |
| `ui/CompanyHandoverDetails.jsx` | Handover contact + signature image (copy URL) |
| `ui/CompanyStallDetailsCard.jsx` | Detail: stall + water coupon + category/products |
| `ui/CompanyDetailsLowerSection.jsx` | Co-exhibitors + matchmaking tabs |
| `ui/SetupProgressSection.jsx` | Setup Progress card (Overview API only) |
| `ui/SetupProgressStep.jsx` | Checklist step row + Open / Remind |
| `ui/SetupProgressSkeleton.jsx` | Setup Progress loading skeleton |
| `ui/ChecklistReminderTab.jsx` | Reminder log + settings (no bulk send) |
| `ui/ExhibitorsListPanel.jsx` | List + multi-select + remind all/selected |
| `domain/exhibitorPasswordResetPayload.js` | Single POC reset body (`badge_id` / `company_id` only) |
| `hooks/useExhibitorPasswordReset.js` | POST exhibitor POC password reset |
| `ui/ExhibitorPasswordResetControl.jsx` | Confirm + reset button (list + attendee detail) |
| `ui/ConfirmExhibitorPasswordResetModal.jsx` | Confirm POC password reset |
| `ui/ExhibitorRemindBar.jsx` | Remind all incomplete / remind selected (no step_id) + single-select POC reset |
| `ui/ExhibitorBulkActionBar.jsx` | List: lock menu + feature/rank selected |
| `ui/ExhibitorLockMenu.jsx` | One Lock dropdown: selected vs all parents |
| `ui/ConfirmCompanyLockModal.jsx` | Confirm lock/unlock; type `lock`/`unlock` for multiple or all |
| `ui/FeatureCompanyModal.jsx` | Per-company `is_featured` + `featured_rank` (unfeatured rank is 0) |
| `ui/CompanyLockFeatureControls.jsx` | Detail: lock/unlock this parent + feature/rank |
| `ui/RemindSendProgress.jsx` | Poll progress bar (percentage / counts) |
| `ui/ConfirmRemindSendModal.jsx` | Type `send` to confirm bulk remind (all or multi) |
| `ui/ExhibitorListTable.jsx` | Exhibitor table with selection + sortable Company / Details / Stall |
| `ui/ExhibitorListRow.jsx` | Single exhibitor row (Details: OBF + space number) |
| `hooks/useExhibitorListSelection.js` | Page multi-select for remind |
| `ui/ChecklistReminderFilters.jsx` | Reminder log filters (status, trigger, dates) |
| `ui/ChecklistReminderTable.jsx` | Batch reminder log table (expand for companies) |
| `ui/ChecklistReminderCompanies.jsx` | Per-company addl_data (`steps[]`) dump |
| `ui/ChecklistReminderSettingsForm.jsx` | Enable / portal URL / offsets |
| `ui/CreateCompanyButton.jsx` | Navigates to create page |
| `ui/CreateCompanyBasicsFields.jsx` | Shared basics (create + edit) |
| `ui/CreateCompanyProfileFields.jsx` | Shared profile (create includes category/logo) |
| `ui/CompanyLogoFields.jsx` | Logo upload / remove (top of edit form) |
| `ui/CompanyCategoryProductsSection.jsx` | Edit: category then products |
| `ui/CompanyProductSelectFields.jsx` | Edit: multi-select + setup Product question CTA |
| `ui/ProductMatchmakingPanel.jsx` | Exhibitors → Product Matchmaking (grouped listing / create) |
| `ui/EditCompanyLimitsFields.jsx` | Limits / status (edit only) |
| `ui/ParentCompanySearch.jsx` | Parent exhibitor typeahead |

## Company Detail data ownership

| UI | Source |
|----|--------|
| Header, Overview, Badge, Contact, System | Company detail API (`eventService.getCompanyDetails`) |
| Setup Progress | `GET /exhibitor/events/:id/overview/?company_id=` only |

- Hide Setup Progress when `setup_checklist.visible === false`
- Soft-fail Overview (page stays usable)
- Organizer always passes `company_id`
- Checklist is **collapsed by default** (progress strip + next hint); expand for steps or use header **Exhibitor portal checklist** (next to View Orders)

## Checklist Reminder (Exhibitors sub-view)

- Route: `/event/:id/companies?exh_view=checklist_reminder` (`cr_view=list|settings`)
- Send: `POST .../setup-checklist/remind/` → if `async` + `log_id`, poll `GET .../reminders/{log_id}/` every ~2.5s until `completed`/`failed`
- Log: `GET /events/:id/exhibitor/setup-checklist/reminders/` (batch rows + `addl_data`)
- Settings: `GET|PATCH /events/:id/exhibitor-setup-checklist/` (no steps)

## Exhibitor POC password reset

- `POST /events/:id/exhibitor/password/reset/` with `badge_id` and/or `company_id` (no `email` / `bulk_email` yet)
- Exhibitors list: **Reset exhibitor POC password** enabled when exactly one company is selected
- Attendee detail: **Reset exhibitor portal password** shown for exhibitors, enabled when `is_poc`

## Bulk lock / feature

- `PATCH /events/:id/companies/bulk-action/`
- `operation_type`: `lock_company` | `feature_company`
- `selection`: `single` (1 id) | `multiple` (2+) | `all` (`lock_company` only, parent exhibitors)
- Lock and Feature / rank are disabled if any co-exhibitor is selected
- Feature: `is_featured: false` always sends `featured_rank: 0`
- List bar + company detail both use this endpoint
- List lock UX is one **Lock parent exhibitors** menu (selected vs all parents)
- Multiple or all lock/unlock: AWS type-to-confirm (`lock` / `unlock`); single is a click confirm

## Edit rules

- PATCH sends only changed fields; **`company_name` always included**.
- Nested `product` / `link` sent as `JSON.stringify(...)`.
- Booleans as `"true"` / `"false"`.
- Logo: new file → upload; remove checkbox → empty `company_logo`; unchanged → omit field.

## Exhibitor list sort

- `GET /evc/events/:id/company_list/?sort_by=&sort_order=`
- Fields: `company_slug`, `obf_number`, `space` (as `space_num`), `space_num`, `obf_number_numeric`, `obf_number_alphabet` (as `company_slug`), `featured_rank`
- Defaults: `space` / `desc`. Invalid `sort_by` → 404
- Ignored when `q` is set (relevance) or `is_featured=true` with no `q` (rank then name)
- Toolbar select + Company / Details / Stall column headers; `sort_by`/`sort_order` persist in the URL
- Details column shows OBF, space (number), and sales person

## Wired from

- `src/pages/Companies.jsx` — re-export of `ui/CompaniesPage.jsx`
- `src/pages/CompanyDetails.jsx` — thin re-export of `CompanyDetailsPage`
- `src/pages/CreateCompany.jsx` / `EditCompany.jsx` — thin re-exports
