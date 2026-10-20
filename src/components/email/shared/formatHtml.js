import { html as beautifyHtml } from 'js-beautify';

// js-beautify has no concept of Jinja syntax, so {% %}/{{ }}/{# #} tags are
// swapped for opaque placeholders before beautifying and restored verbatim
// after — the beautifier never sees (and so can never mangle) a Jinja tag.
const JINJA_TAG_RE = /\{\{[\s\S]*?\}\}|\{%[\s\S]*?%\}|\{#[\s\S]*?#\}/g;
const PLACEHOLDER_RE = /__JINJA_TAG_(\d+)__/g;

export function formatHtml(source) {
  const tokens = [];
  const protectedHtml = String(source || '').replace(JINJA_TAG_RE, (match) => {
    tokens.push(match);
    return `__JINJA_TAG_${tokens.length - 1}__`;
  });

  const beautified = beautifyHtml(protectedHtml, {
    indent_size: 2,
    wrap_line_length: 0,
    preserve_newlines: false,
    unformatted: ['a', 'span', 'strong', 'em', 'b', 'i', 'u'],
    inline: ['a', 'span', 'strong', 'em', 'b', 'i', 'u'],
  });

  return beautified.replace(PLACEHOLDER_RE, (_, i) => tokens[Number(i)]);
}
