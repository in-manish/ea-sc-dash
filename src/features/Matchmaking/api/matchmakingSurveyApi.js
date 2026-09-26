import { APP_ENVS, getApiUrl, getEnv } from '../../../config';

const OTM_SURVEY_API = {
    [APP_ENVS.PROD]: 'https://api-prod.otm.co.in',
    [APP_ENVS.STAGE]: 'https://api-stage.otm.co.in',
    [APP_ENVS.LOCAL]: 'https://api-stage.otm.co.in',
};

function getOtmSurveyApiUrl() {
    return OTM_SURVEY_API[getEnv()] || OTM_SURVEY_API[APP_ENVS.STAGE];
}

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

    getSurveyFormList: async (eventCode) => {
        const response = await fetch(
            `${getOtmSurveyApiUrl()}/api/get-form-list?eventCode=${encodeURIComponent(eventCode)}`,
            { headers: { accept: 'application/json, text/plain, */*' } },
        );
        if (!response.ok) throw new Error(`Failed to fetch form list: ${response.statusText}`);
        return response.json();
    },

    getSurveyForm: async (formValue, eventCode) => {
        const response = await fetch(`${getOtmSurveyApiUrl()}/api/get-form-json`, {
            method: 'POST',
            headers: { accept: 'application/json, text/plain, */*', 'content-type': 'application/json' },
            body: JSON.stringify({ form_value: formValue, eventCode, matchMakingOnly: true }),
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
