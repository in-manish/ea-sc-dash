/** OTM SurveyJS form JSON host by dashboard env (not EA/SC getApiUrl). */
const SURVEYJS_API_BASE = {
    PROD: 'https://api-prod.otm.co.in',
    STAGE: 'https://api-stage.otm.co.in',
    LOCAL: 'https://api-stage.otm.co.in',
};

export const SURVEYJS_FORM_JSON_PATH = '/api/get-form-json';

export function getSurveyJsApiBaseUrl(env) {
    return SURVEYJS_API_BASE[env] || SURVEYJS_API_BASE.STAGE;
}

export function getSurveyJsFormJsonUrl(env) {
    return `${getSurveyJsApiBaseUrl(env)}${SURVEYJS_FORM_JSON_PATH}`;
}
