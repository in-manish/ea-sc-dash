import { getApiUrl } from '../../../config';
import { readApiError } from './readApiError';

/** The source name SurveyJS is stored under in EA. */
export const SERVICE_SOURCE = 'surveyjs';

function authHeaders(token, json) {
  return {
    Accept: 'application/json',
    Authorization: `Token ${token}`,
    ...(json ? { 'Content-Type': 'application/json' } : {}),
  };
}

function sourceUrl(eventId, path, params = {}) {
  const query = new URLSearchParams();
  Object.entries({ source: SERVICE_SOURCE, ...params }).forEach(([key, value]) => {
    if (value !== '' && value != null) query.set(key, String(value));
  });
  return `${getApiUrl()}/events/${eventId}/permission-sources/${path}/?${query}`;
}

async function call(token, url, { method = 'GET', body } = {}, messages = {}) {
  const response = await fetch(url, {
    method,
    headers: authHeaders(token, body !== undefined),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    await readApiError(response, {
      forbidden: 'Only an organizer can map SurveyJS options.',
      notFound: 'Event does not exist.',
      ...messages,
    });
  }
  return response.json();
}

/** GET permission-sources/options/ — options with their mapped permissions and suggestions. Organizer only. */
export function getServiceOptions(token, eventId) {
  return call(token, sourceUrl(eventId, 'options'), {}, { fallback: 'Failed to load the SurveyJS options.' });
}

/** POST permission-sources/options/ — push the SurveyJS options. {saved, errors:[{id, field, message}]} */
export function pushServiceOptions(token, eventId, options) {
  return call(token, sourceUrl(eventId, 'options'), { method: 'POST', body: { source: SERVICE_SOURCE, options } },
    { fallback: 'Failed to save the SurveyJS options.' });
}

/** PUT permission-sources/mapping/ — replaces the permissions of each listed option (ids). */
export function saveServiceMapping(token, eventId, mappings) {
  return call(token, sourceUrl(eventId, 'mapping'), { method: 'PUT', body: { source: SERVICE_SOURCE, mappings } },
    { fallback: 'Failed to save the mapping.' });
}

/** POST permission-sources/backfill/ — records are {uuid, surveyjs_attendee_permission}. At most 500. */
export function runServiceBackfill(token, eventId, { records, dryRun, retryPending }) {
  return call(token, sourceUrl(eventId, 'backfill'), {
    method: 'POST',
    body: { source: SERVICE_SOURCE, dry_run: Boolean(dryRun), retry_pending: Boolean(retryPending), records },
  }, { fallback: 'Failed to run the backfill.' });
}

/** GET permission-sources/ledger/ — filters: badge_uuid, source_option_id, action, via, batch_id, page, page_size. */
export function getServiceLedger(token, eventId, params) {
  return call(token, sourceUrl(eventId, 'ledger', params), {}, { fallback: 'Failed to load the ledger.' });
}
