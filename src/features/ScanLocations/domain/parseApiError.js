const FIELD_LABELS = {
  code: 'Code',
  name: 'Name',
  from_date: 'From date',
  end_date: 'End date',
  from_time: 'From time',
  end_time: 'End time',
  is_active: 'Active',
  location: 'Location',
  permissions: 'Permissions',
  special_permission: 'Special permission',
  non_field_errors: 'Error',
};

function asText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(' ');
  if (value == null || typeof value === 'object') return '';
  return String(value);
}

function messageFromBody(result) {
  if (!result || typeof result !== 'object' || Array.isArray(result)) return '';
  if (typeof result.detail === 'string') return result.detail;
  return asText(result.message || result.msg || result.error || result.ERROR);
}

function fieldMessages(result) {
  const fields = {};
  const lines = [];
  if (!result || typeof result !== 'object' || Array.isArray(result)) return { fields, lines };
  Object.entries(result).forEach(([key, value]) => {
    if (['message', 'msg', 'error', 'detail', 'ERROR'].includes(key)) return;
    const text = asText(value);
    if (!text) return;
    fields[key] = text;
    lines.push(`${FIELD_LABELS[key] || key}: ${text}`);
  });
  return { fields, lines };
}

/** Banner text plus per-field messages from a JSON error body. */
export function parseApiError(result, status, options = {}) {
  if (status === 401) {
    return { message: 'Authentication required. Please sign in again.', fields: {} };
  }
  const top = messageFromBody(result);
  if (status === 403) {
    return {
      message: top || options.forbidden || 'You do not have access to do that.',
      fields: {},
    };
  }
  if (status === 404) {
    return { message: top || options.notFound || 'Not found.', fields: {} };
  }
  const { fields, lines } = fieldMessages(result);
  const message = [top, ...lines].filter(Boolean).join('\n')
    || options.fallback
    || `Request failed (${status})`;
  return { message, fields };
}
