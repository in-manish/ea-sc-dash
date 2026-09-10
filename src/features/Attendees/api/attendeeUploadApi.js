import { getApiUrl } from '../../../config';
import { downloadBlob } from '../../../utils/downloadBlob';

function authHeaders(token) {
    // No Content-Type: the browser must set the multipart boundary itself.
    return { Accept: 'application/json', Authorization: `Token ${token}` };
}

async function parseError(response, fallback) {
    const data = await response.json().catch(() => null);
    const error = new Error(
        (data && (data.detail || data.message || data.msg)) || `${fallback} (status ${response.status})`
    );
    error.data = data;
    error.status = response.status;
    return error;
}

function buildQuery({ strict, exportCsv } = {}) {
    const params = new URLSearchParams();
    if (strict) params.set('strict', 'true');
    if (exportCsv) params.set('export', 'csv');
    const qs = params.toString();
    return qs ? `?${qs}` : '';
}

/** POST /events/:eventId/attendees/upload/ (multipart) */
export async function uploadAttendeesCsv(eventId, token, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/attendees/upload/${buildQuery(options)}`,
        { method: 'POST', headers: authHeaders(token), body: formData }
    );
    if (!response.ok) throw await parseError(response, 'Failed to upload attendees');
    return response.json();
}

/** POST /events/:eventId/attendees/upload/validate/ (multipart, dry-run, no writes) */
export async function validateAttendeesCsv(eventId, token, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/attendees/upload/validate/${buildQuery(options)}`,
        { method: 'POST', headers: authHeaders(token), body: formData }
    );
    if (!response.ok) throw await parseError(response, 'Failed to validate attendees CSV');
    return response.json();
}

/** GET /events/:eventId/attendee/upload/report/ - paginated history of past CSV uploads. */
export async function getAttendeeUploads(eventId, token, {
    page = 1, size = 20, sortBy = 'uploaded_on', sortOrder = 'desc', uploadType = '',
} = {}) {
    const params = new URLSearchParams({
        sort_by: sortBy, sort_order: sortOrder, upload_type: uploadType, page, size,
    });
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/attendee/upload/report/?${params}`,
        { method: 'GET', headers: authHeaders(token) }
    );
    if (!response.ok) throw await parseError(response, 'Failed to load upload history');
    return response.json();
}

/** Same validate endpoint with ?export=csv - triggers a browser download of the report. */
export async function downloadAttendeeUploadValidationReport(eventId, token, file, options = {}) {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/attendees/upload/validate/${buildQuery({ ...options, exportCsv: true })}`,
        { method: 'POST', headers: authHeaders(token), body: formData }
    );
    if (!response.ok) throw await parseError(response, 'Failed to download validation report');

    const blob = await response.blob();
    downloadBlob(blob, `attendee-upload-validation-${eventId}.csv`);
}
