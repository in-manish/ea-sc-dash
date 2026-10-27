import { getApiUrl } from '../../../config';
import { readApiError } from '../../ScanLocations/api/readApiError';

/**
 * POST /events/:eventId/user/export/ (organizer only).
 * body = { fields, type: 'csv'|'xlsx'|'pdf', uuids } or { fields, type, search_queries }.
 * Resolves { message, download_link? }: EA returns a link for up to 50 rows and emails larger exports.
 */
export async function exportAttendees(eventId, token, body) {
    const response = await fetch(`${getApiUrl()}/events/${eventId}/user/export/`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        await readApiError(response, {
            forbidden: 'Only organizers can export attendees.',
            notFound: 'No attendees matched, so nothing was exported.',
            fallback: `Export failed (status ${response.status})`,
        });
    }
    return response.json().catch(() => ({}));
}
