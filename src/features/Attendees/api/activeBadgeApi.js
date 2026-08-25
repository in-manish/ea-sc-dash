import { getApiUrl } from '../../../config';

const authHeaders = (token) => ({
  Accept: 'application/json, text/plain, */*',
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json',
});

async function parseError(response) {
  const result = await response.json().catch(() => null);
  const message =
    result?.error ||
    result?.detail ||
    (typeof result?.message === 'string' ? result.message : null) ||
    `Request failed (${response.status})`;
  const error = new Error(message);
  error.status = response.status;
  error.data = result;
  throw error;
}

function statusUrl(eventId) {
  return `${getApiUrl()}/events/${eventId}/attendees/active_badge/status/`;
}

function createUrl(eventId) {
  return `${getApiUrl()}/events/${eventId}/attendees/active_badge/`;
}

export const activeBadgeApi = {
  /** POST /events/:eventId/attendees/active_badge/status/ */
  async getStatus(eventId, token, body) {
    const response = await fetch(statusUrl(eventId), {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) await parseError(response);
    return response.json();
  },

  /** POST /events/:eventId/attendees/active_badge/ */
  async create(eventId, token, body) {
    const response = await fetch(createUrl(eventId), {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) await parseError(response);
    return response.json();
  },
};
