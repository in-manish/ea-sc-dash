import { getApiUrl } from '../../../config';

function authHeaders(token, json = false) {
    return {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Token ${token}`,
        ...(json ? { 'Content-Type': 'application/json' } : {}),
    };
}

function errorMessage(errorData, fallback) {
    const detail = errorData?.msg || errorData?.detail || errorData?.message || errorData?.error;
    if (typeof detail === 'string' && detail) return detail;
    if (Array.isArray(detail) && detail[0]) return String(detail[0]);
    return fallback;
}

async function throwHttpError(response, fallback) {
    const errorData = await response.json().catch(() => ({}));
    const err = new Error(errorMessage(errorData, fallback));
    err.status = response.status;
    err.body = errorData;
    throw err;
}

export const matchmakingFormApi = {
    getMatchmakingQuestions: async (eventId, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/questions/matchmaking/`,
            { headers: authHeaders(token) },
        );
        if (!response.ok) {
            await throwHttpError(
                response,
                `Failed to fetch matchmaking questions: ${response.statusText}`,
            );
        }
        return response.json();
    },

    saveMatchmakingQuestions: async (eventId, payload, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/questions/matchmaking/`,
            {
                method: 'POST',
                headers: authHeaders(token, true),
                body: JSON.stringify(payload),
            },
        );
        if (!response.ok) {
            await throwHttpError(
                response,
                `Failed to save matchmaking questions: ${response.statusText}`,
            );
        }
        return response.json();
    },

    copyMatchmaking: async (data, token) => {
        const response = await fetch(`${getApiUrl()}/evc/matchmaking/make_copy/`, {
            method: 'POST',
            headers: authHeaders(token, true),
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            await throwHttpError(response, `Failed to copy matchmaking: ${response.statusText}`);
        }
        return response.json();
    },
};
