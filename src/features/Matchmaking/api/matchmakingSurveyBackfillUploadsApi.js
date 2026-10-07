import { getApiUrl } from '../../../config';
import { filenameFromContentDisposition } from '../../Companies/domain/exhibitorReportDownload';

function authHeaders(token) {
    return {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Token ${token}`,
    };
}

async function readError(response, fallback) {
    const data = await response.json().catch(() => ({}));
    return data.msg || data.detail || data.message || fallback;
}

const uploadsBase = (eventId) =>
    `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-backfill/mapping-uploads`;

export const matchmakingSurveyBackfillUploadsApi = {
    listSurveyBackfillMappingUploads: async (eventId, { page = 1, pageSize = 20 } = {}, token) => {
        const params = new URLSearchParams({
            page: String(page),
            page_size: String(Math.min(100, pageSize)),
        });
        const response = await fetch(`${uploadsBase(eventId)}/?${params}`, {
            headers: authHeaders(token),
        });
        if (!response.ok) {
            throw new Error(await readError(response, `Failed to list mapping uploads: ${response.statusText}`));
        }
        return response.json();
    },

    /** uploadId: number or "latest" */
    getSurveyBackfillMappingUpload: async (eventId, uploadId, token) => {
        const id = uploadId == null || uploadId === '' ? 'latest' : uploadId;
        const response = await fetch(`${uploadsBase(eventId)}/${id}/`, {
            headers: authHeaders(token),
        });
        if (!response.ok) {
            throw new Error(await readError(response, `Failed to load mapping upload: ${response.statusText}`));
        }
        return response.json();
    },

    downloadSurveyBackfillMappingUpload: async (eventId, uploadId, token) => {
        const id = uploadId == null || uploadId === '' ? 'latest' : uploadId;
        const response = await fetch(`${uploadsBase(eventId)}/${id}/?download=true`, {
            headers: authHeaders(token),
        });
        if (!response.ok) {
            throw new Error(await readError(response, `Failed to download mapping CSV: ${response.statusText}`));
        }
        const blob = await response.blob();
        const filename = filenameFromContentDisposition(
            response.headers.get('Content-Disposition'),
            `mapping-upload-${id}.csv`,
        );
        return { blob, filename };
    },
};
