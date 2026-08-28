function collectMessages(data) {
  if (!data) return [];
  if (typeof data === 'string') return [data];
  if (Array.isArray(data)) return data.flatMap(collectMessages);
  if (typeof data !== 'object') return [String(data)];
  return Object.values(data).flatMap(collectMessages);
}

/** Surface unique (template_type, event) conflicts from EA create/update. */
export function parseEmailTemplateSaveError(error) {
  const chunks = collectMessages(error?.response?.data);
  const text = chunks.join(' ').toLowerCase();
  if (text.includes('unique')) {
    return 'A template of this type already exists for this event. Open the existing one or pick a different type.';
  }
  if (chunks.length) return chunks.join(' ');
  return error?.message || 'Failed to save email template. Please try again.';
}
