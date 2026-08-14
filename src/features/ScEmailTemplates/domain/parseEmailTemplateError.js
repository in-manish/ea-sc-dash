const FIELD_SKIP = new Set(['detail', 'success', 'message', 'msg', 'error']);

export function emailTemplateFieldErrors(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return {};
  const out = {};
  Object.entries(body).forEach(([key, val]) => {
    if (FIELD_SKIP.has(key)) return;
    out[key] = Array.isArray(val) ? val.join(', ') : String(val);
  });
  return out;
}

export function parseEmailTemplateError(status, body = {}, fallback) {
  const fields = emailTemplateFieldErrors(body);
  const fromBody = body.error || body.detail || body.message;
  let message = fromBody;
  if (!message && Object.keys(fields).length) {
    message = Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n');
  }
  if (!message) {
    if (status === 401 || status === 403) {
      message = 'Not authenticated, or user is not admin/staff.';
    } else if (status === 405) {
      message = 'Delete is not allowed. Archive the template instead.';
    } else {
      message = fallback || `Failed to load email templates (${status})`;
    }
  }
  const err = new Error(message);
  err.status = status;
  err.body = body;
  err.fields = fields;
  return err;
}
