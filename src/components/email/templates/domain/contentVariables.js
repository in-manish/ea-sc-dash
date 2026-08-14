const PLACEHOLDER_RE = /\{\{\s*([A-Za-z_][\w]*)\s*\}\}/g;

export function extractPlaceholderNames(...texts) {
  const names = [];
  const seen = new Set();
  texts.forEach((text) => {
    const src = String(text || '');
    PLACEHOLDER_RE.lastIndex = 0;
    let match = PLACEHOLDER_RE.exec(src);
    while (match) {
      const name = match[1];
      if (!seen.has(name)) {
        seen.add(name);
        names.push(name);
      }
      match = PLACEHOLDER_RE.exec(src);
    }
  });
  return names;
}

/** `{ name: "", email: "" }` from `{{name}}` tokens in body/subject. */
export function buildContentVariablesMap(...texts) {
  return Object.fromEntries(extractPlaceholderNames(...texts).map((name) => [name, '']));
}

export function appendPlaceholder(content, name) {
  const token = `{{${name}}}`;
  const html = String(content || '');
  if (!html.trim()) return token;
  return `${html}${token}`;
}

export function parseSupportingVariables(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const out = [];
  value.forEach((item) => {
    if (typeof item === 'string') {
      const name = item.trim();
      if (!name || seen.has(name)) return;
      seen.add(name);
      out.push({ name, description: '' });
      return;
    }
    const name = String(item?.name || '').trim();
    if (!name || seen.has(name)) return;
    seen.add(name);
    out.push({ name, description: String(item?.description || '').trim() });
  });
  return out;
}

export function pickSupportingVariables(...sources) {
  for (const src of sources) {
    const parsed = parseSupportingVariables(src);
    if (parsed.length) return parsed;
  }
  return [];
}
