# Agenda

Session schedule management for an event: list, create/edit on a flat page (speakers + moderators).

## Layout

| Path | Owns |
|------|------|
| `ui/AgendaListPage.jsx` | List + pagination + view modal |
| `ui/AgendaEditPage.jsx` | Flat create/edit page |
| `ui/SessionDetailsFields.jsx` | Title, time, location, flags |
| `ui/SpeakerRosterSection.jsx` / `SpeakerCard.jsx` | Speakers + alpha/custom sort |
| `ui/ModeratorRosterSection.jsx` / `ModeratorCard.jsx` | Moderators |
| `hooks/useAgendaForm.js` | Form state + save |
| `hooks/usePersonImageCrop.js` | Crop + `speaker_image_N` blobs |
| `domain/buildAgendaFormData.js` | Multipart payload |
| `domain/normalizePeople.js` | Speaker/moderator shapes |
| `constants.js` | Empty defaults |

## Routes

- `/event/:id/agenda` — list
- `/event/:id/agenda/new` — create
- `/event/:id/agenda/:agendaId/edit` — update

## API

Uses `src/services/agendaService.js` (`POST .../create/`, `PATCH .../{id}/edit/`).
Speakers/moderators sent as JSON strings in FormData; images as `speaker_image_0`, `moderator_image_0`, …
