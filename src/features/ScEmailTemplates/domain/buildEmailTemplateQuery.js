export const DEFAULT_EMAIL_TEMPLATE_FILTERS = {
  template_type: '',
  audience: '',
  event_id: '',
  title: '',
  from_sender_name: '',
  is_active: 'true',
  limit: 50,
  offset: 0,
};

/** Query string for GET /evc/admin/email-templates/. Omit empty optionals. */
export function buildEmailTemplateQuery(params = {}) {
  const q = new URLSearchParams();
  const {
    id,
    event_id,
    template_type,
    audience,
    title,
    from_sender_name,
    from_name,
    is_active = 'true',
    limit = 50,
    offset = 0,
  } = params;

  if (id !== '' && id != null) q.set('id', String(id));
  if (event_id !== '' && event_id != null) q.set('event_id', String(event_id));
  if (template_type) q.set('template_type', String(template_type));
  if (audience) q.set('audience', String(audience));
  if (title) q.set('title', String(title));
  const fromName = from_sender_name || from_name;
  if (fromName) q.set('from_sender_name', String(fromName));
  q.set('is_active', is_active === false || is_active === 'false' ? 'false' : 'true');
  q.set('limit', String(limit));
  q.set('offset', String(offset));
  return q.toString();
}
