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
| ManageUsers | `src/features/ManageUsers/` | Staff users / permissions |
| ScManageUsers | `src/features/ScManageUsers/` | SC admin users + saved cards |
| ScAuth / Profile | `src/features/ScAuth/`, `src/features/ScProfile/` | SC ADMIN login gate + profile |
| Matchmaking | `src/features/Matchmaking/` | Matchmaking UI |

## Common tasks → files

| Task | Start here |
|------|------------|
| Agenda list / edit session | `src/features/Agenda/ui/AgendaListPage.jsx`, `AgendaEditPage.jsx` |
| Agenda API create/update | `src/services/agendaService.js` + `domain/buildAgendaFormData.js` |
| Speaker/moderator payload shape | `src/features/Agenda/domain/normalizePeople.js` |
| SC manage users / detail page | `src/features/ScManageUsers/ui/UserDetailsPage.jsx`, `ManageUsersPage.jsx` |
| SC ADMIN login / profile | `src/features/ScAuth/domain/scLoginUser.js`, `src/features/ScProfile/ui/ScProfilePage.jsx` |
| SC user pending requests | `src/features/ScManageUsers/ui/PendingCardsTab.jsx`, `hooks/useUserPendingCards.js` |
| SC user card activity | `src/features/ScManageUsers/ui/CardRequestActivityTab.jsx`, `hooks/useUserCardRequests.js` |

## Constraints

- Max **200 lines** per source file
- Feature code under `src/features/<Name>/`; thin pages in `src/pages/`
