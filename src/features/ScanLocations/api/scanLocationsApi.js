import { getApiUrl } from '../../../config';
import { readApiError } from './readApiError';

function authHeaders(token, extra = {}) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
    ...extra,
  };
}

function locationsUrl(eventId, id) {
  const base = `${getApiUrl()}/events/${eventId}/locations/scan/`;
  return id == null ? base : `${base}${id}/`;
}

/** GET /events/:eventId/locations/scan/ */
export async function getScanLocations(token, eventId) {
  const response = await fetch(locationsUrl(eventId), { headers: authHeaders(token) });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to load scan locations.',
      forbidden: 'You do not have access to scan locations for this event.',
    });
  }
  return response.json();
}

/** POST /events/:eventId/locations/scan/ — permissions are ids. */
export async function createScanLocation(token, eventId, body) {
  const response = await fetch(locationsUrl(eventId), {
    method: 'POST',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to create the scan location.',
      forbidden: 'You do not have access to create a scan location.',
    });
  }
  return response.json();
}

/**
 * PATCH /events/:eventId/locations/scan/:id/
 * location is required. permissions (ids) replaces the list. [] clears it.
 * special_permission is sent so the checkbox value is kept.
 */
export async function updateScanLocation(token, eventId, locationId, body) {
  const response = await fetch(locationsUrl(eventId, locationId), {
    method: 'PATCH',
    headers: authHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to update the scan location.',
      forbidden: 'You do not have access to update this scan location.',
      notFound: 'Location does not exist.',
    });
  }
  return response.json();
}

/** DELETE /events/:eventId/locations/scan/:id/ — 204, soft delete. */
export async function deleteScanLocation(token, eventId, locationId) {
  const response = await fetch(locationsUrl(eventId, locationId), {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  if (!response.ok) {
    await readApiError(response, {
      fallback: 'Failed to delete the scan location.',
      forbidden: 'You do not have access to delete this scan location.',
      notFound: 'Location does not exist.',
    });
  }
}
