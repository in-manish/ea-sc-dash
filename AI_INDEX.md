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
| Matchmaking | `src/features/Matchmaking/` | Matchmaking UI |

## Common tasks → files

| Task | Start here |
|------|------------|
| Agenda list / edit session | `src/features/Agenda/ui/AgendaListPage.jsx`, `AgendaEditPage.jsx` |
| Agenda API create/update | `src/services/agendaService.js` + `domain/buildAgendaFormData.js` |
| Speaker/moderator payload shape | `src/features/Agenda/domain/normalizePeople.js` |

## Constraints

- Max **200 lines** per source file
- Feature code under `src/features/<Name>/`; thin pages in `src/pages/`
