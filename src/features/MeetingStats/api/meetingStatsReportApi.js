import { getApiUrl } from '../../../config';
import { buildMeetingStatsBody, buildMeetingStatsQuery } from '../domain/meetingStatsQuery';
import { parseMeetingStatsError } from '../domain/parseMeetingStatsError';

function reportUrl(query) {
  const base = `${getApiUrl()}/meetings/stats/report/`;
  return query ? `${base}?${query}` : base;
}

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  throw parseMeetingStatsError(result, response.status);
}

/**
 * GET /meetings/stats/report/
 * Organizer token. event_ids required (≥1).
 */
export async function getMeetingStatsReport(token, eventId, filters, { refresh = false } = {}) {
  const query = buildMeetingStatsQuery(eventId, filters, { refresh });
  const response = await fetch(reportUrl(query), {
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
 * POST /meetings/stats/report/
 * Same filters as GET plus emails (≥1). CSV is emailed async, not in the body.
 */
export async function emailMeetingStatsReport(token, eventId, filters, emails) {
  const response = await fetch(reportUrl(''), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`,
    },
    body: JSON.stringify(buildMeetingStatsBody(eventId, filters, emails)),
  });
  await throwIfFailed(response);
  return response.json().catch(() => ({}));
}

export const meetingStatsReportApi = {
  getMeetingStatsReport,
  emailMeetingStatsReport,
};
