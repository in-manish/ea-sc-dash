import { getApiUrl } from '../../../config';
import { parseExhibitorReportError } from '../domain/parseExhibitorReportError';
import { buildExhibitorReportQuery } from '../domain/exhibitorReportQuery';
import {
  defaultExhibitorReportFilename,
  filenameFromContentDisposition,
} from '../domain/exhibitorReportDownload';

function reportUrl(eventId, query) {
  const base = `${getApiUrl()}/events/${eventId}/exhibitor/report/`;
  return query ? `${base}?${query}` : base;
}

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  throw parseExhibitorReportError(result, response.status);
}

/**
 * GET /events/:eventId/exhibitor/report/
 * Download CSV (no send_to_emails). Optional company_ids.
 */
export async function downloadExhibitorReport(eventId, token, { companyIds } = {}) {
  const query = buildExhibitorReportQuery({ companyIds });
  const response = await fetch(reportUrl(eventId, query), {
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
    defaultExhibitorReportFilename(eventId),
  );
  return { blob, filename };
}

/**
 * GET with send_to_emails. Returns JSON; email is queued in the background.
 * Optional company_ids. Do not include send_to_emails on download.
 */
export async function emailExhibitorReport(eventId, token, { emails, companyIds } = {}) {
  const query = buildExhibitorReportQuery({ emails, companyIds });
  const response = await fetch(reportUrl(eventId, query), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Token ${token}`,
    },
  });
  await throwIfFailed(response);
  return response.json().catch(() => ({}));
}

export const exhibitorReportApi = {
  downloadExhibitorReport,
  emailExhibitorReport,
};
