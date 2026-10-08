import { APP_ENVS, getEnv } from '../../../config';
import { extraQueryEntries } from '../domain/extraQueryParams';

const OTM_API = {
  [APP_ENVS.PROD]: 'https://api-prod.otm.co.in',
  [APP_ENVS.STAGE]: 'https://api-stage.otm.co.in',
  [APP_ENVS.LOCAL]: 'https://api-stage.otm.co.in',
};

function otmUrl(path, eventCode, formValue, extraQuery = '', paging) {
  const base = OTM_API[getEnv()] || OTM_API[APP_ENVS.STAGE];
  const query = new URLSearchParams({ eventCode, form_value: formValue });
  extraQueryEntries(extraQuery).forEach(([key, value]) => {
    if (paging && (key === 'page' || key === 'size')) return;
    query.append(key, value);
  });
  if (paging) {
    query.set('page', String(paging.page));
    query.set('size', String(paging.size));
  }
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
 * extraQuery is appended (`key=value&other=1`); eventCode and form_value are not replaced.
 */
export function getOtmFormQuestion(token, eventCode, formValue, extraQuery = '') {
  return otmGet(token, otmUrl('get-form-question', eventCode, formValue, extraQuery), 'Failed to load the options from SurveyJS');
}

/**
 * GET {SurveyJS}/api/badge-permissions — one page of attendees: {uuid, badge_permission | null}.
 * Query: eventCode, form_value, page, size, plus the extra query. Sends the logged-in EA token.
 */
export function getOtmBadgePermissions(token, eventCode, formValue, extraQuery = '', page = 1, size = 100) {
  const url = otmUrl('badge-permissions', eventCode, formValue, extraQuery, { page, size });
  return otmGet(token, url, 'Failed to load the purchases from SurveyJS');
}
