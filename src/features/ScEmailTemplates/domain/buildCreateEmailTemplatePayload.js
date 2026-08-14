import { DEFAULT_CONTENT_VARIABLES, EMAIL_TEMPLATE_TYPES } from '../constants';
import { parseContentVariables, uniqueContentVariables } from './contentVariables';

export function emptyCreateEmailTemplateForm() {
  return {
    title: '',
    template_type: EMAIL_TEMPLATE_TYPES[0],
    subject: '',
    content: '',
    audience: '',
    event_id: '',
    from_sender_name: '',
    is_active: true,
    content_variables: [...DEFAULT_CONTENT_VARIABLES],
  };
}

/** Map GET-one payload onto the create/edit form. */
export function templateToForm(template = {}) {
  return {
    title: template.title || '',
    template_type: template.template_type || EMAIL_TEMPLATE_TYPES[0],
    subject: template.subject || '',
    content: template.content || '',
    audience: template.audience || '',
    event_id: template.event_id == null ? '' : String(template.event_id),
    from_sender_name: template.from_sender_name || '',
    is_active: template.is_active !== false,
    content_variables: parseContentVariables(template.content_variables),
  };
}

/** Body for POST /evc/admin/email-templates/. Omits empty audience / event_id (null global). */
export function buildCreateEmailTemplatePayload(form) {
  const payload = {
    title: String(form.title || '').trim(),
    template_type: form.template_type || EMAIL_TEMPLATE_TYPES[0],
    subject: String(form.subject || '').trim(),
    content: String(form.content || ''),
    is_active: form.is_active !== false,
  };
  if (form.audience) payload.audience = form.audience;
  const eventId = optionalEventId(form);
  if (eventId != null) payload.event_id = eventId;
  const fromName = String(form.from_sender_name || '').trim();
  if (fromName) payload.from_sender_name = fromName;
  const vars = uniqueContentVariables(form.content_variables);
  if (vars.length) payload.content_variables = vars;
  return payload;
}

function optionalEventId(form) {
  if (form.event_id === '' || form.event_id == null) return null;
  const eventId = Number(form.event_id);
  if (Number.isInteger(eventId) && eventId > 0) return eventId;
  return null;
}

/** Full body for PUT /evc/admin/email-templates/:id/. Empty audience/event_id sent as null. */
export function buildPutEmailTemplatePayload(form) {
  return {
    title: String(form.title || '').trim(),
    template_type: form.template_type || EMAIL_TEMPLATE_TYPES[0],
    subject: String(form.subject || '').trim(),
    content: String(form.content || ''),
    audience: form.audience || null,
    event_id: optionalEventId(form),
    from_sender_name: String(form.from_sender_name || '').trim() || null,
    is_active: form.is_active !== false,
    content_variables: uniqueContentVariables(form.content_variables),
  };
}
