import { stripPlaceholderMarks } from '../../shared/placeholderHighlight';
import { buildContentVariablesMap } from './contentVariables';

function blankToNull(value) {
  return value === '' || value === undefined || value === null ? null : Number(value);
}

/** Magic link fields; left out when the form has none (server without the feature). */
function buildMagicLinkPayload(form) {
  if (form.magic_link_enabled === undefined) return {};
  return {
    magic_link_enabled: form.magic_link_enabled === true,
    magic_link_expiry_minutes: blankToNull(form.magic_link_expiry_minutes),
    magic_link_redirect_url: String(form.magic_link_redirect_url || '').trim() || null,
    magic_link_single_use: blankToNull(form.magic_link_single_use),
  };
}

export function buildEmailTemplatePayload(form, eventId) {
  const emailContent = stripPlaceholderMarks(form.email_content || '');
  const subject = String(form.subject || '').trim();
  return {
    event: eventId,
    email_name: String(form.email_name || '').trim(),
    subject,
    description: String(form.description || ''),
    template_type: form.template_type || 'custom',
    is_active: form.is_active !== false,
    email_content: emailContent,
    content_variables: buildContentVariablesMap(emailContent, subject),
    ...buildMagicLinkPayload(form),
  };
}
