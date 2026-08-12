# AI Index — EA SC Dash

React organizer dashboard for event operations (attendees, companies, agenda, etc.).

## Entry points

- `src/App.jsx` — routes
- `src/layouts/EventLayout.jsx` — event shell / nav
- `src/services/` — HTTP clients

## Feature map

| Feature | Path | Notes |
|---------|------|-------|
| Agenda | `src/features/Agenda/` | List + flat edit for speakers/moderators |
| Attendees | `src/features/Attendees/` | Attendee management |
| Companies | `src/features/Companies/` | EA create/edit/detail + portal checklist + reminder tab |
| ManageUsers | `src/features/ManageUsers/` | Staff users / permissions |
| ScManageUsers | `src/features/ScManageUsers/` | SC admin users + saved cards |
| ScAuth / Profile | `src/features/ScAuth/`, `src/features/ScProfile/` | SC ADMIN login gate + profile |
| Matchmaking | `src/features/Matchmaking/` | Matchmaking UI |

## Common tasks → files

| Task | Start here |
|------|------------|
| Create EA company / co-exhibitor | `src/features/Companies/ui/CreateCompanyPage.jsx` + `api/companyApi.js` |
| Edit EA company | `src/features/Companies/ui/EditCompanyPage.jsx` + `domain/buildCompanyPatchFormData.js` |
| Company Detail + Setup Progress | `src/features/Companies/ui/CompanyDetailsPage.jsx` + `SetupProgressSection.jsx` |
| Exhibitor overview / checklist | `api/companyApi.js` (`getExhibitorOverview`) + `hooks/useExhibitorOverview.js` |
| Checklist Reminder tab | `src/features/Companies/ui/ChecklistReminderTab.jsx` + `api/checklistReminderApi.js` |
| Company FormData / errors | `src/features/Companies/domain/buildCompanyFormData.js`, `parseCompanyError.js` |
| Agenda list / edit session | `src/features/Agenda/ui/AgendaListPage.jsx`, `AgendaEditPage.jsx` |
| Agenda API create/update | `src/services/agendaService.js` + `domain/buildAgendaFormData.js` |
| Speaker/moderator payload shape | `src/features/Agenda/domain/normalizePeople.js` |
| SC manage users / detail page | `src/features/ScManageUsers/ui/UserDetailsPage.jsx`, `ManageUsersPage.jsx` |
| SC ADMIN login / profile | `src/features/ScAuth/domain/scLoginUser.js`, `src/features/ScProfile/ui/ScProfilePage.jsx` |
| SC user pending requests | `src/features/ScManageUsers/ui/PendingCardsTab.jsx`, `hooks/useUserPendingCards.js` |
| SC user card activity | `src/features/ScManageUsers/ui/CardRequestActivityTab.jsx`, `hooks/useUserCardRequests.js` |
| SC saved cards Active/Archived | `src/features/ScManageUsers/ui/SavedCardsTab.jsx`, `hooks/useUserSavedCards.js` |
| SC restore / permanent delete card | `src/features/ScManageUsers/hooks/useSavedCardMutations.js`, `api/userCardsApi.js` |

## Constraints

- Max **200 lines** per source file
- Feature code under `src/features/<Name>/`; thin pages in `src/pages/`
