# AI Index — EA SC Dash

React organizer dashboard for event operations (attendees, companies, agenda, etc.).

**Canonical project map** (with `AI_FILE_MAP.yaml`). Do not add a third map file.

**How to use (mandatory):** Consult this index and `AI_FILE_MAP.yaml` *before* exploring the repo. Open the listed feature/task files. After you add, move, or rename modules/files, update this index, the YAML map, and `src/features/<Feature>/README.md` in the same change. Skill: `.agents/skills/project-map/SKILL.md`.

## Entry points

- `src/App.jsx` — routes; bare host (no `/ea`|`/sc`) resumes an existing token
- `src/layouts/EventLayout.jsx` — event shell / nav
- `src/services/` — HTTP clients
- `src/contexts/authSession.js` — token restore, last path, landing URL

## Feature map

| Feature | Path | Notes |
|---------|------|-------|
| Agenda | `src/features/Agenda/` | List + flat edit for speakers/moderators |
| Attendees | `src/features/Attendees/` | List, create, edit badge, WhatsApp, e-badge, report |
| Companies | `src/features/Companies/` | EA list (sort) + create/edit/detail + portal checklist + reminder tab |
| ManageUsers | `src/features/ManageUsers/` | Staff users / permissions |
| ScManageUsers | `src/features/ScManageUsers/` | SC admin users + saved cards |
| ScAuth / Profile | `src/features/ScAuth/`, `src/features/ScProfile/` | SC ADMIN login gate + profile |
| ScEmailTemplates | `src/features/ScEmailTemplates/` | SC admin list; EA-like manage/edit modal |
| EaEmail | `src/components/email/` | Communication Email: category + templates; browse HTML into body |
| Matchmaking | `src/features/Matchmaking/` | GET 404 = create/copy; 200 = editor only |

## Common tasks → files

| Task | Start here |
|------|------------|
| Event settings / support email | `src/pages/event-settings/CommunicationSettings.jsx` (`support_email`) |
| Event settings / sender profile pic | `src/pages/event-settings/SenderDefaultProfilePicField.jsx` (`sender_default_profile_pic`) |
| Edit attendee / badge | `src/features/Attendees/ui/EditAttendeeModal.jsx` + `api/attendeeApi.js` + `domain/editAttendeeForm.js` |
| Create EA company / co-exhibitor | `src/features/Companies/ui/CreateCompanyPage.jsx` + `api/companyApi.js` |
| Edit EA company | `src/features/Companies/ui/EditCompanyPage.jsx` + `domain/buildCompanyPatchFormData.js` |
| Company Detail + Setup Progress | `src/features/Companies/ui/CompanyDetailsPage.jsx` + `SetupProgressSection.jsx` |
| Exhibitor overview / checklist | `api/companyApi.js` (`getExhibitorOverview`) + `hooks/useExhibitorOverview.js` |
| Checklist Reminder tab | `src/features/Companies/ui/ChecklistReminderTab.jsx` + `api/checklistReminderApi.js` |
| Checklist remind + progress poll | `hooks/useSetupChecklistRemind.js` + `ui/RemindSendProgress.jsx` |
| Reset exhibitor POC password | `src/features/Companies/ui/ExhibitorPasswordResetControl.jsx` + attendee bar: `ui/AttendeeSelectionBar.jsx` (single POC) |
| Bulk lock / feature companies | `src/features/Companies/ui/ExhibitorLockMenu.jsx` + `ExhibitorBulkActionBar.jsx` + `api/companyApi.js` (`bulkAction`) |
| Exhibitor list sort | `domain/companyListSort.js` + `hooks/useExhibitorList.js` + `ui/ExhibitorListSortControls.jsx` |
| Company FormData / errors | `src/features/Companies/domain/buildCompanyFormData.js`, `parseCompanyError.js` |
| Agenda list / edit session | `src/features/Agenda/ui/AgendaListPage.jsx`, `AgendaEditPage.jsx` |
| Agenda API create/update | `src/services/agendaService.js` + `domain/buildAgendaFormData.js` |
| Speaker/moderator payload shape | `src/features/Agenda/domain/normalizePeople.js` |
| SC manage users / detail page | `src/features/ScManageUsers/ui/UserDetailsPage.jsx`, `ManageUsersPage.jsx` |
| SC ADMIN login / profile | `src/features/ScAuth/domain/scLoginUser.js`, `src/features/ScProfile/ui/ScProfilePage.jsx` |
| Auth restore / host URL | `src/contexts/authSession.js`, `src/storage/webStorage.js`, `src/App.jsx`, `src/components/ProtectedRoute.jsx` |
| SC user pending requests | `src/features/ScManageUsers/ui/PendingCardsTab.jsx`, `hooks/useUserPendingCards.js` |
| SC user card activity | `src/features/ScManageUsers/ui/CardRequestActivityTab.jsx`, `hooks/useUserCardRequests.js` |
| SC saved cards Active/Archived | `src/features/ScManageUsers/ui/SavedCardsTab.jsx`, `hooks/useUserSavedCards.js` |
| SC restore / permanent delete card | `src/features/ScManageUsers/hooks/useSavedCardMutations.js`, `api/userCardsApi.js` |
| SC email templates | `src/features/ScEmailTemplates/ui/EmailTemplatesPage.jsx` + `api/emailTemplateApi.js` |
| SC email template create/edit content | `ui/EmailTemplateEditorLayout.jsx` + `EmailTemplatePreviewCanvas.jsx` + `EmailTemplateFormModalShell.jsx` |
| EA category / template body import | `src/components/email/shared/EmailBodyEditor.jsx` + `EmailFileImport.jsx` + `readHtmlFile.js` |
| EA template list filters | `src/components/email/templates/domain/parseTemplateFilters.js` + `EmailTemplateFilters.jsx` |
| EA template content_variables | `src/components/email/templates/domain/contentVariables.js` + `TemplateSupportingVariables.jsx` + `usePlaceholderHighlight.js` |
| Event settings AR tax list | `src/pages/event-settings/exhibitorPortalDefaults.js` + `ArTaxList.jsx` + `useAdditionalRequirement.js` |
| Matchmaking questions / copy | `src/features/Matchmaking/ui/MatchmakingQuestions.jsx` + `api/matchmakingFormApi.js` |

## Constraints

- Max **200 lines** per source file
- Feature code under `src/features/<Name>/`; thin pages in `src/pages/`
