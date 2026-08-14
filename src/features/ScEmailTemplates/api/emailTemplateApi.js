import { getApiUrl } from '../../../config';
import { buildEmailTemplateQuery } from '../domain/buildEmailTemplateQuery';
import { parseEmailTemplateError } from '../domain/parseEmailTemplateError';
import { parseEmailTemplateList } from '../domain/parseEmailTemplateList';

const authHeaders = (token) => ({
  Accept: 'application/json',
  Authorization: `Token ${token}`,
});

async function readError(response, fallback) {
  const body = await response.json().catch(() => ({}));
  throw parseEmailTemplateError(response.status, body, fallback);
}

/**
 * GET /evc/admin/email-templates/
 * Auth: Token (IsAdminOrStaff). filters in the body are full dropdown suggestions.
 */
export async function fetchEmailTemplates(token, params = {}) {
  const qs = buildEmailTemplateQuery(params);
  const response = await fetch(
    `${getApiUrl()}/evc/admin/email-templates/?${qs}`,
    { method: 'GET', headers: authHeaders(token) }
  );
  if (!response.ok) await readError(response, `Failed to load email templates (${response.status})`);
  return parseEmailTemplateList(await response.json());
}

/** POST /evc/admin/email-templates/ — 201 created. Clears list filters cache on save. */
export async function createEmailTemplate(token, payload) {
  const response = await fetch(`${getApiUrl()}/evc/admin/email-templates/`, {
    method: 'POST',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await readError(response, `Failed to create email template (${response.status})`);
  return response.json();
}

/** GET /evc/admin/email-templates/:id/ — active or archived. Prefill edit form. */
export async function fetchEmailTemplate(token, templateId) {
  const response = await fetch(
    `${getApiUrl()}/evc/admin/email-templates/${templateId}/`,
    { method: 'GET', headers: authHeaders(token) }
  );
  if (!response.ok) {
    const fallback =
      response.status === 404
        ? 'Email template not found'
        : `Failed to load email template (${response.status})`;
    await readError(response, fallback);
  }
  return response.json();
}

function templateUrl(templateId) {
  return `${getApiUrl()}/evc/admin/email-templates/${templateId}/`;
}

/** PUT /evc/admin/email-templates/:id/ — full object. Required title, template_type, subject, content. */
export async function putEmailTemplate(token, templateId, payload) {
  const response = await fetch(templateUrl(templateId), {
    method: 'PUT',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await readError(response, `Failed to update email template (${response.status})`);
  return response.json();
}

/** PATCH /evc/admin/email-templates/:id/ — only fields to change. Archive with { is_active: false }. */
export async function patchEmailTemplate(token, templateId, payload) {
  const response = await fetch(templateUrl(templateId), {
    method: 'PATCH',
    headers: { ...authHeaders(token), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) await readError(response, `Failed to update email template (${response.status})`);
  return response.json();
}
