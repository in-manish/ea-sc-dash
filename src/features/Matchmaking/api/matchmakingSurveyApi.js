import { getApiUrl } from '../../../config';

function headers(token, json = false) {
    return {
        Accept: 'application/json, text/plain, */*',
        Authorization: `Token ${token}`,
        ...(json ? { 'Content-Type': 'application/json' } : {}),
    };
}

export const matchmakingSurveyApi = {
    saveSurveyMapping: async (eventId, payload, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-question-mapping/`,
            { method: 'POST', headers: headers(token, true), body: JSON.stringify(payload) },
        );
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || errorData.message || `Failed to save mapping: ${response.statusText}`);
        }
        return response.json();
    },

    getSurveyForm: async (formValue, eventCode) => {
        const response = await fetch('https://api-stage.otm.co.in/api/get-form-json', {
            method: 'POST',
            headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json' },
            body: JSON.stringify({ form_value: formValue, eventCode }),
        });
        if (!response.ok) throw new Error(`Failed to fetch survey form: ${response.statusText}`);
        return response.json();
    },

    getSurveyMapping: async (eventId, formValue, token) => {
        const response = await fetch(
            `${getApiUrl()}/events/${eventId}/matchmaking/surveyjs-question-mapping/?form_value=${formValue}`,
            { headers: headers(token) },
        );
        if (!response.ok) throw new Error(`Failed to fetch survey mapping: ${response.statusText}`);
        return response.json();
    },
};
