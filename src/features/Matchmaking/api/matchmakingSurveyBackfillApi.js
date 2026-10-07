import { getApiUrl } from '../../../config';

function authHeaders(token, json = false) {
    return {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Token ${token}`,
        ...(json ? { 'Content-Type': 'application/json' } : {}),
    };
}

async function readError(response, fallback) {
    const data = await response.json().catch(() => ({}));
    return data.msg || data.detail || data.message || fallback;
}

export const matchmakingSurveyBackfillApi = {
    /** POST mapping CSV. dryRun=true checks without saving. */
    uploadSurveyBackfillMappingCsv: async (eventId, file, dryRun, token) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('dry_run', dryRun ? 'true' : 'false');
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-backfill/mapping-csv/`,
            { method: 'POST', headers: authHeaders(token), body: formData },
        );
        if (!response.ok) {
            throw new Error(await readError(response, `Mapping CSV failed: ${response.statusText}`));
        }
        return response.json();
    },

    /** Queue Celery backfill. Returns immediately (202). */
    runSurveyBackfill: async (eventId, { formValue, force = false } = {}, token) => {
        const body = { force: Boolean(force) };
        if (formValue) body.form_value = formValue;
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-backfill/run/`,
            { method: 'POST', headers: authHeaders(token, true), body: JSON.stringify(body) },
        );
        if (!response.ok) {
            throw new Error(await readError(response, `Backfill run failed: ${response.statusText}`));
        }
        return response.json();
    },

    getSurveyBackfillLogs: async (eventId, { status, formValue, page = 1, pageSize = 50 } = {}, token) => {
        const params = new URLSearchParams();
        if (status) params.set('status', status);
        if (formValue) params.set('form_value', formValue);
        params.set('page', String(page));
        params.set('page_size', String(pageSize));
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-backfill/logs/?${params}`,
            { headers: authHeaders(token) },
        );
        if (!response.ok) {
            throw new Error(await readError(response, `Failed to load backfill logs: ${response.statusText}`));
        }
        return response.json();
    },

    /** GET mappings grouped by EA question. forms[] ignores filters (dropdown source). */
    getSurveyBackfillMapping: async (eventId, { formValue, search } = {}, token) => {
        const params = new URLSearchParams();
        if (formValue) params.set('form_value', formValue);
        if (search) params.set('search', search);
        const query = params.toString();
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-backfill/mapping/${query ? `?${query}` : ''}`,
            { headers: authHeaders(token) },
        );
        if (!response.ok) {
            throw new Error(await readError(response, `Failed to load mappings: ${response.statusText}`));
        }
        return response.json();
    },
};
