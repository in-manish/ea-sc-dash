import { buildContentVariablesMap } from './contentVariables';

export function buildEmailTemplatePayload(form, eventId) {
  const emailContent = String(form.email_content || '');
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
  };
}
