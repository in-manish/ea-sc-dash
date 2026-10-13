import { getApiUrl } from '../../../config';
import { buildListQuery } from '../domain/attendeeFilters';
import { buildSendBody } from '../domain/sendPayload';
import { parseMeetingAttendeesError } from '../domain/parseMeetingAttendeesError';

const listUrl = (eventId) => `${getApiUrl()}/events/${eventId}/meetings/attendees/`;

async function readJson(response) {
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw parseMeetingAttendeesError(result, response.status);
  return result;
}

/** GET /events/:id/meetings/attendees/ — one page with pending / confirmed counts. */
export async function getMeetingAttendees(token, eventId, filters, page) {
  const response = await fetch(`${listUrl(eventId)}?${buildListQuery(filters, page)}`, {
    headers: { Accept: 'application/json', Authorization: `Token ${token}` },
  });
  return readJson(response);
}

/** POST /events/:id/meetings/attendees/email/ — queues the emails (202). */
export async function sendMeetingAttendeeEmail(token, eventId, filters, options) {
  const response = await fetch(`${listUrl(eventId)}email/`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(buildSendBody(filters, options)),
  });
  return readJson(response);
}

export const meetingAttendeesApi = { getMeetingAttendees, sendMeetingAttendeeEmail };
