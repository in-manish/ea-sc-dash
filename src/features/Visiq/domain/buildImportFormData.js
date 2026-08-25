/**
 * Multipart body for POST /visiq/imports/.
 * mapping / tags may be sent as JSON strings (serializer accepts either).
 */
export function buildImportFormData({ file, mapping = {}, tags = [], dryRun = false }) {
  const form = new FormData();
  form.append('file', file);
  form.append('mapping', JSON.stringify(mapping && typeof mapping === 'object' ? mapping : {}));
  form.append('tags', JSON.stringify(Array.isArray(tags) ? tags : []));
  form.append('dry_run', dryRun ? 'true' : 'false');
  return form;
}

export function parseTagInput(raw) {
  return String(raw || '')
    .split(/[,;\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}
