import { getApiUrl } from '../../../config';

const authHeaders = (token) => ({
    Accept: 'application/json, text/plain, */*',
    Authorization: `Token ${token}`,
});

const appendFilterParams = (params, filters = {}) => {
    Object.entries(filters).forEach(([key, value]) => {
        if (value === '' || value === null || value === undefined) return;
        if (Array.isArray(value)) {
            if (value.length === 0) return;
            params.set(key, value.join(','));
            return;
        }
        params.set(key, String(value));
    });
};

/**
 * Registered badge counts per attendee type (+ event total).
 * Default source is Elasticsearch; pass source=db for Postgres.
 */
export async function getAttendeesReport(eventId, token, { source = 'es', filters = {} } = {}) {
    const params = new URLSearchParams();
    if (source === 'db' || source === 'es') {
        params.set('source', source);
    }
    appendFilterParams(params, filters);

    const query = params.toString();
    const url = `${getApiUrl()}/events/${eventId}/attendees/report/${query ? `?${query}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: authHeaders(token),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const message =
            data.error ||
            data.detail ||
            data.message ||
            `Failed to load attendees report (status ${response.status})`;
        const err = new Error(message);
        err.status = response.status;
        err.body = data;
        throw err;
    }

    return data;
}
