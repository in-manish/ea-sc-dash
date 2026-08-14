/** Strip spaces and Django braces; empty string means skip. */
export function normalizeContentVariable(raw) {
  return String(raw || '')
    .trim()
    .replace(/[{}\s]/g, '');
}

export function uniqueContentVariables(list) {
  const out = [];
  const seen = new Set();
  (list || []).forEach((raw) => {
    const name = normalizeContentVariable(raw);
    if (!name || seen.has(name)) return;
    seen.add(name);
    out.push(name);
  });
  return out;
}

export function parseContentVariables(value) {
  if (Array.isArray(value)) return uniqueContentVariables(value);
  if (!value || typeof value !== 'string') return [];
  return uniqueContentVariables(value.split(/[\s,]+/));
}

export function appendTemplateVariable(content, name) {
  const token = `{{ ${name} }}`;
  return `${content || ''}${token}`;
}
