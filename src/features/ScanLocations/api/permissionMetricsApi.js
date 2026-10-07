import { getApiUrl } from '../../../config';
import { readApiError } from './readApiError';

function authHeaders(token) {
  return { Accept: 'application/json', Authorization: `Token ${token}` };
}

function metricsUrl(eventId, path, params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== '' && value != null && value !== false) query.set(key, String(value));
  });
  const text = query.toString();
  return `${getApiUrl()}/events/${eventId}/permission-codes/${path}/${text ? `?${text}` : ''}`;
}

async function getMetrics(token, url, messages) {
  const response = await fetch(url, { headers: authHeaders(token) });
  if (!response.ok) await readApiError(response, messages);
  return response.json();
}

/**
 * GET /events/:eventId/permission-codes/metrics/ — organizer only. Cached 10 minutes on the server.
 * groupBy: '' | 'attendee_type'. refresh sends refresh_cache=true to rebuild the cache.
 */
export function getPermissionHolderMetrics(token, eventId, { groupBy = '', refresh = false } = {}) {
  return getMetrics(
    token,
    metricsUrl(eventId, 'metrics', { group_by: groupBy, refresh_cache: refresh ? 'true' : '' }),
    {
      fallback: 'Failed to load permission metrics.',
      forbidden: 'Only an organizer can see permission metrics.',
      notFound: 'Event does not exist.',
    },
  );
}

/**
 * GET /events/:eventId/permission-codes/scan-metrics/ — organizer only. Cached 10 minutes on the server.
 * params: from, to (YYYY-MM-DD), scanned_in ('IN' | 'OUT'), group_by ('' | 'date').
 */
export function getPermissionScanMetrics(token, eventId, { params = {}, refresh = false } = {}) {
  return getMetrics(
    token,
    metricsUrl(eventId, 'scan-metrics', { ...params, refresh_cache: refresh ? 'true' : '' }),
    {
      fallback: 'Failed to load scan metrics.',
      forbidden: 'Only an organizer can see scan metrics.',
      notFound: 'Event does not exist.',
    },
  );
}
