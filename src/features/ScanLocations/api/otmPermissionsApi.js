import { APP_ENVS, getEnv } from '../../../config';

const OTM_API = {
  [APP_ENVS.PROD]: 'https://api-prod.otm.co.in',
  [APP_ENVS.STAGE]: 'https://api-stage.otm.co.in',
  [APP_ENVS.LOCAL]: 'https://api-stage.otm.co.in',
};

function otmUrl(path, eventCode, formValue) {
  const base = OTM_API[getEnv()] || OTM_API[APP_ENVS.STAGE];
  const query = new URLSearchParams({ eventCode, form_value: formValue });
  return `${base}/api/${path}?${query}`;
}

async function otmGet(token, url, fallback) {
  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'Content-Type': 'application/json', Authorization: `Token ${token}` },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.success === false) {
    const error = new Error(body?.message || body?.detail || `${fallback} (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return body;
}

/**
 * GET {SurveyJS}/api/get-form-question — the registration question; each choice may carry a badge_permission
 * {price, title, date, start_time, end_time}. Sends the logged-in EA token.
 */
export function getOtmFormQuestion(token, eventCode, formValue) {
  return otmGet(token, otmUrl('get-form-question', eventCode, formValue), 'Failed to load the options from SurveyJS');
}

/**
 * GET {SurveyJS}/api/badge-permissions — one row per attendee: {uuid, badge_permission | null}.
 * Sends the logged-in EA token.
 */
export function getOtmBadgePermissions(token, eventCode, formValue) {
  return otmGet(token, otmUrl('badge-permissions', eventCode, formValue), 'Failed to load the purchases from SurveyJS');
}
