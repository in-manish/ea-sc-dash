import {
  EMAIL_TEMPLATE_TYPE_CUSTOM,
  MEETING_TEMPLATE_TYPE,
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
  const spec = getEmailTemplateType(slug) || (slug.startsWith('meeting_') ? MEETING_TEMPLATE_TYPE : null);
  const placeholders = spec?.placeholders || ['name', 'email', 'event_name'];
  // meeting_exhibitor -> "Meeting requests reminder - Exhibitor", so each type's template is easy to tell apart
  const typeLabel = spec === MEETING_TEMPLATE_TYPE && slug !== MEETING_TEMPLATE_TYPE.value
    ? slug.replace(/^meeting_/, '').replace(/_/g, ' ')
    : '';
  const emailName = typeLabel ? `${MEETING_TEMPLATE_TYPE.email_name} - ${typeLabel}` : (spec?.email_name || '');
  return {
    isNew: true,
    email_name: emailName,
    subject: spec?.subject || '',
    description: spec?.description || '',
    template_type: slug,
    is_active: true,
    email_content: spec?.body || starterBody(placeholders),
  };
}
