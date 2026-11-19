import { getApiUrl } from '../../../config';
import { parseExhibitorReportError } from '../domain/parseExhibitorReportError';
import { filenameFromContentDisposition } from '../domain/exhibitorReportDownload';
import { joinSendToEmails } from '../domain/exhibitorReportQuery';

/**
 * Company reports that had no feature API before the Companies → Reports tab:
 * company data export, invitee report and the additional-requirements order report.
 * The exhibitor and engagement reports keep their own api files.
 */

async function throwIfFailed(response) {
  if (response.ok) return;
  const result = await response.json().catch(() => ({}));
  throw parseExhibitorReportError(result, response.status);
}

async function getJson(url, token) {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', Authorization: `Token ${token}` },
  });
  await throwIfFailed(response);
  return response.json().catch(() => ({}));
}

/**
 * GET /events/:id/company/export/ — CSV of every company (parents + co-exhibitors).
 * Server filename is "{event name}-{event id}.csv".
 */
export async function downloadCompanyExport(eventId, token) {
  const response = await fetch(`${getApiUrl()}/events/${eventId}/company/export/`, {
    method: 'GET',
    headers: { Accept: 'text/csv', Authorization: `Token ${token}` },
  });
  await throwIfFailed(response);
  const blob = await response.blob();
  const filename = filenameFromContentDisposition(
    response.headers.get('Content-Disposition'),
    `Event-${eventId}-Companies.csv`,
  );
  return { blob, filename };
}

/** GET /events/:id/invitee-report/?send_to_emails=a,b — email only; queued in the background. */
export function emailInviteeReport(eventId, token, { emails }) {
  const params = new URLSearchParams({ send_to_emails: joinSendToEmails(emails) });
  return getJson(`${getApiUrl()}/events/${eventId}/invitee-report/?${params}`, token);
}

/**
 * GET /admin/events/:id/additional-requirements/orders/report/?status=paid,pay_later&send_to_emails=…
 * Always send send_to_emails: without it the backend mails the signed-in user instead
 * (and only returns a file when it has no email and there are ≤ 50 orders).
 */
export function emailOrdersReport(eventId, token, { emails, statuses }) {
  const params = new URLSearchParams({ send_to_emails: joinSendToEmails(emails) });
  if (statuses?.length) params.set('status', statuses.join(','));
  return getJson(
    `${getApiUrl()}/admin/events/${eventId}/additional-requirements/orders/report/?${params}`,
    token,
  );
}

export const companyReportsApi = {
  downloadCompanyExport,
  emailInviteeReport,
  emailOrdersReport,
};
