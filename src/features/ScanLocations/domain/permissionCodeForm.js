const CODE_RE = /^[A-Z0-9]$/;

export function normalizePermissionCode(value) {
  return String(value || '').trim().toUpperCase();
}

/** Client checks before POST. Server still returns the real 400 text. */
export function validateNewPermissionCode({ code, name }) {
  const fields = {};
  const normalized = normalizePermissionCode(code);
  const trimmed = String(name || '').trim();
  if (!CODE_RE.test(normalized)) fields.code = 'Code must be one letter or digit.';
  if (!trimmed) fields.name = 'Name is required.';
  else if (trimmed.length > 255) fields.name = 'Name must be 255 characters or fewer.';
  return { code: normalized, name: trimmed, fields };
}

export function validatePermissionCodeName(name) {
  const trimmed = String(name || '').trim();
  if (!trimmed) return { name: trimmed, error: 'Name is required.' };
  if (trimmed.length > 255) return { name: trimmed, error: 'Name must be 255 characters or fewer.' };
  return { name: trimmed, error: '' };
}
