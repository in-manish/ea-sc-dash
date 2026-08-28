import {
  EMAIL_TEMPLATE_TYPE_CUSTOM,
  getEmailTemplateType,
  normalizeTemplateType,
} from '../constants/emailTemplateTypes';

function starterBody(placeholders) {
  const tokens = placeholders.map((name) => `<p>{{${name}}}</p>`).join('');
  return `<p>Hello,</p>${tokens}`;
}

/** Prefill a new per-event template from a known EA type (or a custom slug). */
export function buildNewEmailTemplate(typeValue) {
  const slug = normalizeTemplateType(typeValue) || EMAIL_TEMPLATE_TYPE_CUSTOM;
  const spec = getEmailTemplateType(slug);
  const placeholders = spec?.placeholders || ['name', 'email', 'event_name'];
  return {
    isNew: true,
    email_name: spec?.email_name || '',
    subject: spec?.subject || '',
    description: spec?.description || '',
    template_type: slug,
    is_active: true,
    email_content: spec?.body || starterBody(placeholders),
  };
}
