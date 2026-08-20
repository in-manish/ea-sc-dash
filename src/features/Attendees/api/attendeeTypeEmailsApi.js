import { getApiUrl } from '../../../config';
import { parseAttendeeTypeEmailsError } from '../domain/parseAttendeeTypeEmails';

/**
 * GET /events/:eventId/attendee_types/emails/
 * Lists attendee types that have a saved email draft (email is never null).
 * Optional at_id returns a single type's draft (looked up by id, not event-scoped).
 */
export async function listAttendeeTypeEmails(eventId, token, { atId } = {}) {
    const params = new URLSearchParams();
    if (atId != null && atId !== '') params.set('at_id', String(atId));
    const query = params.toString();
    const url = `${getApiUrl()}/events/${eventId}/attendee_types/emails/${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json, text/plain, */*',
            Authorization: `Token ${token}`,
        },
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(parseAttendeeTypeEmailsError(data, response.status));
        error.status = response.status;
        error.body = data;
        throw error;
    }

    return data;
}

/**
 * POST /events/:eventId/attendee_types/send_email/
 * Sends each attendee the draft saved for their type. 204 = success (empty body).
 * Selected badges: { attendee_uuids: [...] }. Filtered/all may use search_queries.
 */
export async function sendAttendeeEmails(eventId, token, payload) {
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/attendee_types/send_email/`,
        {
            method: 'POST',
            headers: {
                Accept: 'application/json, text/plain, */*',
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json;charset=UTF-8',
            },
            body: JSON.stringify(payload),
        },
    );

    if (response.status === 204 || response.status === 205) return {};

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        const error = new Error(
            parseAttendeeTypeEmailsError(data, response.status, `Failed to send email (${response.status}).`),
        );
        error.status = response.status;
        error.body = data;
        throw error;
    }

    return data;
}
