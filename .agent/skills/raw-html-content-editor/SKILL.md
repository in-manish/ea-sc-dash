---
name: raw-html-content-editor
description: Front-end helper for editing and previewing raw HTML snippets without auto-wrapping, sanitizing, or formatting fixes. Use when building or modifying UI tools that must preserve HTML exactly as authored.
---

## What this skill is for

- **Use this when** building or updating any UI that lets users edit and preview **raw HTML fragments** (CMS blocks, email templates, widget snippets).
- **Goal**: Treat the content as opaque text; the browser renders it, not your code. No "helpful" changes.

## Rules: what to do

- **Preserve input exactly**
  - Store and send HTML as plain strings.
  - Only change content in response to explicit user edits.
- **Render in isolation**
  - Prefer an `iframe` (or clearly separated container) for preview to avoid leaking app CSS/JS into the content.
  - Write directly into the preview document/body without wrapping or transforming the string.
- **Keep behavior explicit**
  - Trigger preview on clear events (e.g. button click, debounced change).
  - Make any sanitization or transformation opt-in and outside this skill (e.g. a separate pipeline or toggle).

## Rules: what NOT to do

- **Do NOT** auto-wrap with `<html>`, `<head>`, or `<body>`.
- **Do NOT** auto-fix HTML (close tags, re-indent, normalize attributes, prettify).
- **Do NOT** inject styles, scripts, or wrappers into the user content.
- **Do NOT** silently sanitize, escape, or restructure the DOM for this editor.

## Reference snippet (vanilla HTML/JS)

Use this pattern as the baseline; adapt UI/styling freely but keep the data flow and "no touch" behavior:

```html
<textarea id="editor" style="width: 100%; height: 200px;"></textarea>
<button id="previewBtn">Preview</button>
<iframe id="previewFrame" style="width: 100%; height: 300px;"></iframe>

<script>
  const editor = document.getElementById('editor');
  const frame = document.getElementById('previewFrame');
  const button = document.getElementById('previewBtn');

  button.addEventListener('click', () => {
    const html = editor.value; // raw, unmodified
    const doc = frame.contentDocument || frame.contentWindow.document;
    doc.open();
    doc.write(html); // no wrapping, no sanitizing, no formatting
    doc.close();
  });
</script>
```

## Quick checklist before you ship

- **Content**: No tags auto-added/removed; stored and sent exactly as typed.
- **Editor**: Accepts partial/invalid HTML; no auto-fixes or blocking validation.
- **Preview**: Shows exactly the string provided; no extra wrappers, CSS, or scripts injected.
- **Flow**: Content only changes on explicit user actions; no background mutation.

