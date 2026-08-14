import { getApiUrl } from '../../../config';

function headers(token, json = false) {
    return {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Token ${token}`,
        ...(json ? { 'Content-Type': 'application/json' } : {}),
    };
}

export const matchmakingExhibitorApi = {
    getExhibitorMatchmakingQuestions: async (eventId, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/exhibitor/matchmaking/questions/`,
            { headers: headers(token) },
        );
        if (!response.ok) throw new Error(`Failed to fetch exhibitor portal questions: ${response.statusText}`);
        return response.json();
    },

    getExhibitorMatchmakingAnswers: async (eventId, companyId, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/exhibitor/matchmaking/answers/?company_id=${companyId}`,
            { headers: headers(token) },
        );
        if (!response.ok) throw new Error(`Failed to fetch exhibitor matchmaking answers: ${response.statusText}`);
        return response.json();
    },

    saveExhibitorMatchmakingAnswers: async (eventId, payload, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/exhibitor/matchmaking/answers/`,
            { method: 'POST', headers: headers(token, true), body: JSON.stringify(payload) },
        );
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to save exhibitor matchmaking answers: ${response.statusText}`);
        }
        return response.json();
    },

    uploadExhibitorMatchmakingAnswersCsv: async (eventId, companyId, file, token) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('company_id', companyId);
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/exhibitor/matchmaking/answers/upload/`,
            { method: 'POST', headers: headers(token), body: formData },
        );
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/csv')) return { success: false, errorCsv: await response.blob() };
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const detail = errorData.detail || errorData.message;
            const message = typeof detail === 'object'
                ? Object.entries(detail).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join('; ')
                : detail;
            throw new Error(message || `Failed to upload matchmaking answers CSV: ${response.statusText}`);
        }
        return { success: true, data: await response.json() };
    },

    getAttendeeMatchmakingAnswers: async (eventId, badgeUid, token, answerFor) => {
        const params = new URLSearchParams({ badge_uid: badgeUid });
        if (answerFor) params.set('answer_for', answerFor);
        const response = await fetch(
            `${getApiUrl()}/evc/events/${eventId}/matchmaking/admin-match-qa/?${params}`,
            { headers: headers(token) },
        );
        if (!response.ok) throw new Error(`Failed to fetch attendee matchmaking answers: ${response.statusText}`);
        return response.json();
    },
};
