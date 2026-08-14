import { getApiUrl } from '../../../config';
import {
  parseAttendeeError,
  attendeeFieldErrors,
} from '../domain/parseAttendeeError';

const authHeaders = (token) => ({
  Accept: 'application/json, text/plain, */*',
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json',
});

async function throwParsed(response) {
  const result =
    response.status === 404
      ? null
      : await response.json().catch(() => null);
  const error = new Error(parseAttendeeError(result, response.status));
  error.status = response.status;
  error.data = result;
  error.fieldErrors = attendeeFieldErrors(result);
  throw error;
}

export const attendeeApi = {
  /** GET /events/:eventId/attendees/:uuid/ */
  async getAttendee(eventId, uuid, token) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/attendees/${uuid}/`,
      { method: 'GET', headers: authHeaders(token) },
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },

  /**
   * PATCH /events/:eventId/attendees/:uuid/
   * Full body (not sparse). Mirror GET then change fields.
   */
  async updateAttendee(eventId, uuid, token, payload) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/attendees/${uuid}/`,
      {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
      },
    );
    if (!response.ok) await throwParsed(response);
    return response.json();
  },
};
