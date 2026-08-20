import { getApiUrl } from '../../../config';
import { parseAttendeeTypeEmailsError } from '../domain/parseAttendeeTypeEmails';

function throwEmailsError(data, status, fallback) {
    const error = new Error(parseAttendeeTypeEmailsError(data, status, fallback));
    error.status = status;
    error.body = data;
    throw error;
}

/**
 * GET /events/:eventId/category_types/emails/
 * Lists category email templates (array or { results }).
 */
export async function listCategoryTypeEmails(eventId, token) {
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/category_types/emails/`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json, text/plain, */*',
                Authorization: `Token ${token}`,
            },
        },
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throwEmailsError(data, response.status, `Failed to load category emails (${response.status}).`);
    }
    return data;
}

/**
 * POST /events/:eventId/category_types/send_email/
 * Sends selected category templates to the attendee selection. 204 = success.
 */
export async function sendCategoryTypeEmails(eventId, token, payload) {
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/category_types/send_email/`,
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
        throwEmailsError(
            data,
            response.status,
            `Failed to send category email (${response.status}).`,
        );
    }
    return data;
}
