import { getApiUrl } from '../../../config';
import { filenameFromContentDisposition } from '../../Companies/domain/exhibitorReportDownload';

const headers = (token) => ({
  Accept: 'application/json, text/csv, application/zip, */*',
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json',
});

/** EA DRF errors: ["msg"] for ValidationError, { detail } for NotFound / 502. */
async function readCardExportError(response) {
  const body = await response.json().catch(() => null);
  if (response.status === 403) return 'You do not have permission to export attendee cards.';
  if (Array.isArray(body)) return body.join(' ');
  return body?.detail || body?.msg || `Request failed (${response.status})`;
}

export const cardExportApi = {
  /**
   * POST /events/:eventId/attendees/cards/export/ → the file (one attendee + one format) or a .zip.
   * Body: { reg_ids, formats, start, end }. Nothing is emailed.
   */
  async download(eventId, token, body) {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/attendees/cards/export/`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await readCardExportError(response));
    const blob = await response.blob();
    const filename = filenameFromContentDisposition(response.headers.get('Content-Disposition'), 'cards.zip');
    return { blob, filename };
  },

  /**
   * POST /events/:eventId/attendees/cards/email/ → { job_id, attendees, send_to_attendee, emails, ... }.
   * Body: download body + { send_to_attendee, emails }. Sent in the background by EA.
   */
  async email(eventId, token, body) {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/attendees/cards/email/`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(await readCardExportError(response));
    return response.json().catch(() => ({}));
  },
};
