import { getApiUrl } from '../../../config';
import { parseExhibitorEngagementError } from '../domain/exhibitorEngagement';
import {
  buildExhibitorEngagementQuery,
  defaultEngagementCsvFilename,
} from '../domain/exhibitorEngagementQuery';
import {
  filenameFromContentDisposition,
} from '../domain/exhibitorReportDownload';

function engagementUrl(eventId, params) {
  const base = `${getApiUrl()}/events/${eventId}/exhibitor/engagement/`;
  const query = buildExhibitorEngagementQuery(params);
  return query ? `${base}?${query}` : base;
}

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  throw parseExhibitorEngagementError(result, response.status);
}

/**
 * GET /events/:eventId/exhibitor/engagement/
 * Cached ~5 minutes. Pass refresh=true to recompute and recache.
 */
export async function getExhibitorEngagement(eventId, token, { refresh = false } = {}) {
  const response = await fetch(engagementUrl(eventId, { refresh }), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  await throwIfFailed(response);
  return response.json();
}

/**
 * GET ?format=csv. Optional completed=yes|no.
 * Response is a CSV file, not JSON.
 */
export async function downloadExhibitorEngagementCsv(eventId, token, { completed } = {}) {
  const response = await fetch(engagementUrl(eventId, { format: 'csv', completed }), {
    method: 'GET',
    headers: {
      Accept: 'text/csv',
      Authorization: `Token ${token}`,
    },
  });
  await throwIfFailed(response);

  const blob = await response.blob();
  const filename = filenameFromContentDisposition(
    response.headers.get('Content-Disposition'),
    defaultEngagementCsvFilename(eventId),
  );
  return { blob, filename };
}

/**
 * GET ?send_to_emails=. Always JSON; email is queued asynchronously.
 * Optional completed=yes|no. Do not send format=csv.
 */
export async function emailExhibitorEngagementCsv(eventId, token, { emails, completed } = {}) {
  const response = await fetch(engagementUrl(eventId, { emails, completed }), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  await throwIfFailed(response);
  return response.json().catch(() => ({}));
}

export const exhibitorEngagementApi = {
  getExhibitorEngagement,
  downloadExhibitorEngagementCsv,
  emailExhibitorEngagementCsv,
};
