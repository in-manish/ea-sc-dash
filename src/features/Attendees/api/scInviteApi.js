import { getApiUrl } from '../../../config';

/** EA errors here look like { success: false, error, details }. */
function scInviteErrorMessage(result, status) {
  if (status === 403) return 'You do not have permission to send SnapCard invites.';
  if (status === 404) return 'None of the selected attendees are linked to SnapCard (or have an email / phone).';
  if (result?.details && result.details !== result.error) {
    return result.error ? `${result.error}: ${result.details}` : String(result.details);
  }
  return result?.error || result?.detail || `Request failed (${status})`;
}

export const scInviteApi = {
  /**
   * POST /evc/events/:eventId/reset-password/ (EA → SnapCard).
   * selectionPayload = { attendee_uuids } or { search_queries } from attendeeSelectionService.
   * resetExisting = is_resend_pw; sendMode ⊆ ['email', 'whatsapp'] (must not be empty).
   */
  async sendInvites(eventId, token, { selectionPayload, resetExisting, sendMode }) {
    const response = await fetch(`${getApiUrl()}/evc/events/${eventId}/reset-password/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...selectionPayload,
        is_resend_pw: Boolean(resetExisting),
        send_mode: sendMode,
      }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok) {
      const error = new Error(scInviteErrorMessage(result, response.status));
      error.status = response.status;
      throw error;
    }
    return result;
  },
};
