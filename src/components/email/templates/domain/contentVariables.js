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
