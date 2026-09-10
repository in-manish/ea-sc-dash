import { getApiUrl } from '../../../config';
import { parseCompanyError } from '../domain/parseCompanyError';

function authHeaders(token) {
    return { Accept: 'application/json, text/plain, */*', Authorization: `Token ${token}` };
}

async function throwParsed(response, fallback) {
    const result = await response.json().catch(() => ({}));
    const error = new Error(parseCompanyError(result, response.status) || fallback);
    error.status = response.status;
    error.data = result;
    throw error;
}

/**
 * GET /events/:eventId/company/upload/
 * Paginated history of company CSV uploads. Query uses page_size (not size).
 */
export async function getCompanyUploads(eventId, token, {
    page = 1,
    pageSize = 20,
    sortBy = 'uploaded_on',
    sortOrder = 'desc',
    uploadType = '',
} = {}) {
    const params = new URLSearchParams({
        sort_by: sortBy,
        sort_order: sortOrder,
        upload_type: uploadType,
        page,
        page_size: pageSize,
    });
    const response = await fetch(
        `${getApiUrl()}/events/${eventId}/company/upload/?${params}`,
        { method: 'GET', headers: authHeaders(token) },
    );
    if (!response.ok) await throwParsed(response, 'Failed to load company upload history');
    return response.json();
}
