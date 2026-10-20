import { getApiUrl } from '../../../config';
import { parseAttendeeTypeEmailsError } from '../domain/parseAttendeeTypeEmails';

/**
 * POST /events/:eventId/templates/send_email/
 * Sends one email template to the attendee selection (attendee_uuids or search_queries) with template_id.
 * 200 = { campaign_id, recipients }.
 */
export async function sendEmailTemplate(eventId, token, payload) {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/templates/send_email/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(
            parseAttendeeTypeEmailsError(data, response.status, `Failed to send email template (${response.status}).`),
        );
        error.status = response.status;
        error.body = data;
        throw error;
    }
    return data;
}
