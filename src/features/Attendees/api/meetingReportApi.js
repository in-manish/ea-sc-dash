import { getApiUrl } from '../../../config';
import { filenameFromContentDisposition } from '../../Companies/domain/exhibitorReportDownload';

const authHeaders = (token) => ({
  Accept: 'application/json, application/pdf, */*',
  Authorization: `Token ${token}`,
});

/** EA DRF errors: { detail } for NotFound, ["msg"] for ValidationError. */
async function readMeetingReportError(response) {
  const body = await response.json().catch(() => null);
  if (response.status === 403) return 'You do not have permission to download meeting reports.';
  if (response.status === 404) {
    return body?.detail && body.detail !== 'Detail Not Found!'
      ? body.detail
      : 'No meeting report: the attendee has no active badge for this event.';
  }
  if (Array.isArray(body)) return body.join(' ');
  return body?.detail || body?.msg || `Request failed (${response.status})`;
}

export const meetingReportApi = {
  /** POST /events/:eventId/attendees/:regId/meetings/report/export/ → PDF (one attendee). */
  async downloadSingle(eventId, token, regId) {
    const response = await fetch(
      `${getApiUrl()}/events/${eventId}/attendees/${encodeURIComponent(regId)}/meetings/report/export/`,
      { method: 'POST', headers: authHeaders(token) },
    );
    if (!response.ok) throw new Error(await readMeetingReportError(response));
    const blob = await response.blob();
    const filename = filenameFromContentDisposition(
      response.headers.get('Content-Disposition'),
      `Attendee Meetings Report-${regId}.pdf`,
    );
    return { blob, filename };
  },

  /**
   * POST /events/:eventId/attendees/meetings/report/export/ — PDFs are built in the background
   * and emailed to the logged-in organizer. regIds = ['*'] for every active badge in the event.
   * cumulative = one combined PDF; otherwise one PDF per attendee. Over 20 attendees EA sends S3 links.
   */
  async emailMultiple(eventId, token, { regIds, cumulative }) {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/attendees/meetings/report/export/`, {
      method: 'POST',
      headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
      body: JSON.stringify({ reg_ids: regIds, cumulative: Boolean(cumulative) }),
    });
    if (!response.ok) throw new Error(await readMeetingReportError(response));
    return response.json().catch(() => ({}));
  },
};
