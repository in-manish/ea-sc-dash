const VARIABLE_RE = /\{\{\s*([\w.]+)\s*\}\}/g;
const TAG_RE = /<(style|script)[\s\S]*?<\/\1>|<[^>]+>/gi;

/** Plain text of an HTML body, cut to `max` characters, for the card snippet. */
export function htmlToSnippet(html, max = 140) {
  const text = (html || '')
    .replace(TAG_RE, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max).trim()}…` : text;
}

/** Wrap {{ variable }} in a coloured chip so the admin can see what gets filled in. */
export function highlightVariables(html) {
  return (html || '').replace(VARIABLE_RE, (match) => `<span class="var">${match}</span>`);
}

export function previewDocument(html) {
  return `<!DOCTYPE html><html><head><style>
    body { font-family: Inter, system-ui, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 16px; word-wrap: break-word; }
    .var { background: #ede9fe; color: #5b21b6; border-radius: 4px; padding: 0 3px; font-family: monospace; font-size: 0.9em; }
    img { max-width: 100%; height: auto; }
  </style></head><body>${highlightVariables(html)}</body></html>`;
}
