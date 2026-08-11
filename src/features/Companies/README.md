# Companies (EA)

Organizer company create/edit/detail helpers for the EA dashboard.

**Create:** `ui/CreateCompanyPage.jsx` → `/event/:id/companies/new`  
**Edit:** `ui/EditCompanyPage.jsx` → `/event/:id/companies/:companyId/edit`  
**Detail:** `ui/CompanyDetailsPage.jsx` → `/event/:id/companies/:companyId`  
**API:** multipart `FormData` + `Authorization: Token …` (no `/api` prefix)

## Layout

| Path | Owns |
|------|------|
| `api/companyApi.js` | GET/POST/PATCH company, filter options, exhibitor overview, checklist remind |
| `api/checklistReminderApi.js` | Reminder settings GET/PATCH + reminder log list |
| `domain/checklistReminderHelpers.js` | Defaults, offset parse, sent_at / step labels |
| `domain/buildCompanyFormData.js` | Create → multipart |
| `domain/buildCompanyPatchFormData.js` | Edit → changed fields only (+ `company_name`) |
| `domain/companyFromApi.js` | GET response → form state |
| `domain/parseCompanyError.js` | 400 ERROR / field errors |
| `domain/formatCompanySearchLabel.js` | Parent search display |
| `domain/companyFormDefaults.js` | Empty form + validation |
| `domain/setupChecklistHelpers.js` | Step sort, urgency chips, portal_route → organizer path |
| `hooks/useCreateCompany.js` | Create form submit |
| `hooks/useEditCompany.js` | Load + patch submit |
| `hooks/useCompanyCountries.js` | Country keys from filter options |
| `hooks/useExhibitorOverview.js` | Soft-fail Overview API for Setup Progress |
| `hooks/useChecklistReminderList.js` | Paginated reminder log |
| `hooks/useChecklistReminderSettings.js` | Load/save reminder settings |
| `ui/CreateCompanyPage.jsx` | Full-page create |
| `ui/EditCompanyPage.jsx` | Full-page edit |
| `ui/CompanyDetailsPage.jsx` | Detail compose (header → compact Setup Progress → 4 cards → tabs) |
| `ui/CompanyDetailsHeader.jsx` | Back + identity + Edit / View Orders |
| `ui/CompanyDetailsInfoGrid.jsx` | Overview / Badge / Contact / System (company detail API) |
| `ui/CompanyDetailsLowerSection.jsx` | Co-exhibitors + matchmaking tabs |
| `ui/SetupProgressSection.jsx` | Setup Progress card (Overview API only) |
| `ui/SetupProgressStep.jsx` | Checklist step row + Open / Remind |
| `ui/SetupProgressSkeleton.jsx` | Setup Progress loading skeleton |
| `ui/ChecklistReminderTab.jsx` | Companies tab: reminder log + setup reminder |
| `ui/ChecklistReminderFilters.jsx` | Reminder log filters |
| `ui/ChecklistReminderTable.jsx` | Reminder log table |
| `ui/ChecklistReminderSettingsForm.jsx` | Enable / portal URL / offsets |
| `ui/CreateCompanyButton.jsx` | Navigates to create page |
| `ui/CreateCompanyBasicsFields.jsx` | Shared basics (create + edit) |
| `ui/CreateCompanyProfileFields.jsx` | Shared profile + logo |
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

## Checklist Reminder (Companies tab)

- Route: `/event/:id/companies?tab=checklist_reminder` (`cr_view=list|settings`)
- Log: `GET /events/:id/exhibitor/setup-checklist/reminders/`
- Settings: `GET|PATCH /events/:id/exhibitor-setup-checklist/` (no steps)

## Edit rules

- PATCH sends only changed fields; **`company_name` always included**.
- Nested `product` / `link` sent as `JSON.stringify(...)`.
- Booleans as `"true"` / `"false"`.
- Logo: new file → upload; remove checkbox → empty `company_logo`; unchanged → omit field.

## Wired from

- `src/pages/Companies.jsx` — Add company + Checklist Reminder tab
- `src/pages/CompanyDetails.jsx` — thin re-export of `CompanyDetailsPage`
- `src/pages/CreateCompany.jsx` / `EditCompany.jsx` — thin re-exports
