const BLOCK_PAIRS = {
  if: 'endif',
  for: 'endfor',
  block: 'endblock',
  with: 'endwith',
  autoescape: 'endautoescape',
  filter: 'endfilter',
  macro: 'endmacro',
  call: 'endcall',
  trans: 'endtrans',
};
const END_TO_START = Object.fromEntries(
  Object.entries(BLOCK_PAIRS).map(([start, end]) => [end, start]),
);

const TAG_RE = /\{%[+-]?\s*([a-zA-Z_]\w*)[\s\S]*?[+-]?%\}/g;
const UNCLOSED_RE =
  /\{\{(?![\s\S]*?\}\})|\{%(?![\s\S]*?%\})|\{#(?![\s\S]*?#\})/g;

/** Flags unmatched {% block %}/{% endblock %} pairs and unterminated {{ }}/{% %}/{# #} tags. Not a full parser. */
export function lintJinja(source) {
  const text = String(source || '');
  const issues = [];
  const stack = [];

  TAG_RE.lastIndex = 0;
  let match = TAG_RE.exec(text);
  while (match) {
    const keyword = match[1];
    const start = match.index;
    const end = match.index + match[0].length;
    if (BLOCK_PAIRS[keyword]) {
      stack.push({ keyword, start, end });
    } else if (END_TO_START[keyword]) {
      const expected = END_TO_START[keyword];
      const top = stack[stack.length - 1];
      if (top && top.keyword === expected) {
        stack.pop();
      } else {
        issues.push({
          start,
          end,
          message: `{% ${keyword} %} has no matching {% ${expected} %}`,
        });
      }
    }
    match = TAG_RE.exec(text);
  }
  stack.forEach(({ keyword, start, end }) => {
    issues.push({
      start,
      end,
      message: `{% ${keyword} %} is never closed with {% ${BLOCK_PAIRS[keyword]} %}`,
    });
  });

  UNCLOSED_RE.lastIndex = 0;
  let unclosed = UNCLOSED_RE.exec(text);
  while (unclosed) {
    const opener = unclosed[0];
    const closer = opener === '{{' ? '}}' : opener === '{%' ? '%}' : '#}';
    issues.push({
      start: unclosed.index,
      end: unclosed.index + opener.length,
      message: `${opener} is missing its closing ${closer}`,
    });
    unclosed = UNCLOSED_RE.exec(text);
  }

  return issues.sort((a, b) => a.start - b.start);
}
