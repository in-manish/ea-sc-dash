import Prism from 'prismjs';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-django';
import { PLACEHOLDER_RE, escapeHtml } from './placeholderHighlight';
import { lintJinja } from './lintJinja';

export const TEMPLATE_CODE_HIGHLIGHT_CSS = `
.ea-code-pre .token.tag,
.ea-code-pre .token.keyword { color: #1d4ed8; }
.ea-code-pre .token.attr-name { color: #0f766e; }
.ea-code-pre .token.attr-value,
.ea-code-pre .token.string { color: #15803d; }
.ea-code-pre .token.punctuation { color: #6b7280; }
.ea-code-pre .token.comment { color: #6b7280; font-style: italic; }
.ea-code-pre .token.django.language-django { color: #7c3aed; }
.ea-code-pre .token.delimiter { color: #7c3aed; font-weight: 600; }
.ea-code-pre .token.variable { color: #b45309; }
.ea-code-pre .token.filter,
.ea-code-pre .token.operator { color: #be185d; }
.ea-jinja-error {
  text-decoration: underline wavy #dc2626;
  text-decoration-thickness: 2px;
  text-underline-offset: 2px;
  cursor: help;
}
`;

function withG(tokenRe) {
  return new RegExp(tokenRe.source, 'g');
}

/**
 * Colors HTML tags and Jinja ({% %}/{{ }}/{# #}) syntax for display only — the
 * raw textarea value (what actually gets saved) never passes through this.
 * Simple {{name}} placeholders are protected before Prism runs and restored
 * as the existing hoverable `ea-ph` spans afterward, so that feature is
 * untouched; Jinja syntax issues from lintJinja are protected the same way
 * and restored as `ea-jinja-error` spans.
 */
export function highlightTemplateCode(
  value,
  { highlightName, tokenRe = PLACEHOLDER_RE } = {},
) {
  const text = String(value || '');
  const issues = lintJinja(text);

  const ranges = [];
  const phRe = withG(tokenRe);
  let match = phRe.exec(text);
  while (match) {
    ranges.push({
      start: match.index,
      end: match.index + match[0].length,
      kind: 'ph',
      name: match[1] || match[0],
    });
    match = phRe.exec(text);
  }
  issues.forEach((issue) => {
    ranges.push({
      start: issue.start,
      end: issue.end,
      kind: 'err',
      message: issue.message,
    });
  });
  ranges.sort((a, b) => a.start - b.start);

  const accepted = [];
  let cursor = 0;
  ranges.forEach((range) => {
    if (range.start < cursor) return;
    accepted.push({ ...range, text: text.slice(range.start, range.end) });
    cursor = range.end;
  });

  // A pure alphanumeric run: CSS/JS/HTML tokenizers (including nested
  // <style>/<script> grammars Prism embeds) never split a plain word of
  // letters+digits mid-token, unlike markers with symbols (e.g. a leading
  // "@@" was once read as the start of a CSS at-rule inside <style> blocks,
  // splitting the marker across spans and breaking the restore step below).
  let protectedText = '';
  let last = 0;
  accepted.forEach((range, i) => {
    protectedText += text.slice(last, range.start);
    protectedText += `zeacodemark${i}zendmarkz`;
    last = range.end;
  });
  protectedText += text.slice(last);

  const prismHtml = Prism.highlight(
    protectedText,
    Prism.languages.django,
    'django',
  );

  const html = prismHtml.replace(/zeacodemark(\d+)zendmarkz/g, (_, i) => {
    const range = accepted[Number(i)];
    if (range.kind === 'ph') {
      const on = highlightName && highlightName === range.name ? ' is-on' : '';
      return `<span class="ea-ph${on}" data-ea-ph="${escapeHtml(range.name)}">${escapeHtml(range.text)}</span>`;
    }
    const inner = Prism.highlight(range.text, Prism.languages.django, 'django');
    return `<span class="ea-jinja-error" title="${escapeHtml(range.message)}">${inner}</span>`;
  });

  return { html, issues };
}
