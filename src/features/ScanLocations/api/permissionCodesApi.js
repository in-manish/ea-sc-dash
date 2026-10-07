import { getApiUrl } from '../../../config';
import { readApiError } from './readApiError';

function authHeaders(token, extra = {}) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
    ...extra,
  };
}

function codesUrl(eventId, id) {
  const base = `${getApiUrl()}/events/${eventId}/permission-codes/`;
  return id == null ? base : `${base}${id}/`;
}

/** GET /events/:eventId/permission-codes/ — organizer, scan, print, kiosk. */
export async function listPermissionCodes(token, eventId) {
  const response = await fetch(codesUrl(eventId), { headers: authHeaders(token) });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to load permission codes.',
      forbidden: 'You do not have access to permission codes for this event.',
    });
  }
  return response.json();
}

/** POST /events/:eventId/permission-codes/ — organizer only. */
export async function createPermissionCode(token, eventId, body) {
  const response = await fetch(codesUrl(eventId), {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to create the permission code.',
      forbidden: 'Only an organizer can create permission codes.',
    });
  }
  return response.json();
}

/** PATCH changed fields. The code itself is not renamed. */
export async function updatePermissionCode(token, eventId, id, body) {
  const response = await fetch(codesUrl(eventId, id), {
    method: 'PATCH',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to update the permission code.',
      forbidden: 'Only an organizer can edit permission codes.',
      notFound: 'Permission code does not exist.',
    });
  }
  return response.json();
}

/** DELETE returns 204. Refused while a location or badge uses the code. */
export async function deletePermissionCode(token, eventId, id) {
  const response = await fetch(codesUrl(eventId, id), {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to delete the permission code.',
      forbidden: 'Only an organizer can delete permission codes.',
      notFound: 'Permission code does not exist.',
    });
  }
}
