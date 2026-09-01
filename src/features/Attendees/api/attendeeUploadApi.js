import { getApiUrl } from '../../../config';

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
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendee-upload-validation-${eventId}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
