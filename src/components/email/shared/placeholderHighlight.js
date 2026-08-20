export const PLACEHOLDER_RE = /\{\{\s*([A-Za-z_][\w]*)\s*\}\}/g;

export const PLACEHOLDER_HIGHLIGHT_CSS = `
.ea-ph {
  cursor: pointer;
  border-radius: 3px;
  padding: 0 1px;
  box-decoration-break: clone;
  -webkit-box-decoration-break: clone;
}
.ea-ph.is-on {
  background: #fde68a;
  box-shadow: 0 0 0 2px #f59e0b;
}
`;

function withG(tokenRe) {
  return new RegExp(tokenRe.source, 'g');
}

function tokenKey(match) {
  return match[1] || match[0];
}

export function stripPlaceholderMarks(html) {
  return String(html || '')
    .replace(/<span[^>]*data-ea-ph="[^"]*"[^>]*>([\s\S]*?)<\/span>/gi, '$1')
    .replace(/<span[^>]*data-ea-caret[^>]*>[\s\S]*?<\/span>/gi, '')
    .replace(/<span[^>]*data-jodit-selection_marker[^>]*>[\s\S]*?<\/span>/gi, '');
}

export function placeholderAtIndex(text, index, tokenRe = PLACEHOLDER_RE) {
  const re = withG(tokenRe);
  const src = String(text || '');
  let match = re.exec(src);
  while (match) {
    if (index >= match.index && index <= match.index + match[0].length) {
      return tokenKey(match);
    }
    match = re.exec(src);
  }
  return null;
}

export function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function highlightEscapedHtml(text, highlightName, tokenRe = PLACEHOLDER_RE) {
  const re = withG(tokenRe);
  return escapeHtml(text).replace(re, (token, name) => {
    const key = name || token;
    const on = highlightName === key ? ' is-on' : '';
    return `<span class="ea-ph${on}" data-ea-ph="${escapeHtml(key)}">${token}</span>`;
  });
}

function wrapTextNode(node, tokenRe) {
  const text = node.nodeValue || '';
  const re = withG(tokenRe);
  if (!re.test(text)) return;
  re.lastIndex = 0;
  const frag = node.ownerDocument.createDocumentFragment();
  let last = 0;
  let match = re.exec(text);
  while (match) {
    if (match.index > last) {
      frag.appendChild(node.ownerDocument.createTextNode(text.slice(last, match.index)));
    }
    const span = node.ownerDocument.createElement('span');
    span.setAttribute('data-ea-ph', tokenKey(match));
    span.className = 'ea-ph';
    span.textContent = match[0];
    frag.appendChild(span);
    last = match.index + match[0].length;
    match = re.exec(text);
  }
  if (last < text.length) {
    frag.appendChild(node.ownerDocument.createTextNode(text.slice(last)));
  }
  node.parentNode?.replaceChild(frag, node);
}

export function decoratePlaceholderRoot(root, highlightName, tokenRe = PLACEHOLDER_RE) {
  if (!root) return;
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest('[data-ea-ph], [data-jodit-selection_marker]')) {
        return NodeFilter.FILTER_REJECT;
      }
      if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') {
        return NodeFilter.FILTER_REJECT;
      }
      if (!node.nodeValue || !withG(tokenRe).test(node.nodeValue)) {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach((node) => wrapTextNode(node, tokenRe));
  applyPlaceholderHighlight(root, highlightName);
}

export function applyPlaceholderHighlight(root, highlightName) {
  if (!root) return;
  root.querySelectorAll('[data-ea-ph]').forEach((el) => {
    const on = Boolean(highlightName) && el.getAttribute('data-ea-ph') === highlightName;
    el.classList.toggle('is-on', on);
  });
}

export function injectPlaceholderStyles(doc) {
  if (!doc?.head || doc.getElementById('ea-ph-style')) return;
  const style = doc.createElement('style');
  style.id = 'ea-ph-style';
  style.textContent = PLACEHOLDER_HIGHLIGHT_CSS;
  doc.head.appendChild(style);
}

export function bindPlaceholderEvents(root, { onHover, onLeave, onToggle } = {}) {
  if (!root || root.dataset.eaPhBound === '1') return;
  root.dataset.eaPhBound = '1';
  root.addEventListener('mouseover', (e) => {
    const el = e.target.closest?.('[data-ea-ph]');
    if (el) onHover?.(el.getAttribute('data-ea-ph'));
  });
  root.addEventListener('mouseout', (e) => {
    const el = e.target.closest?.('[data-ea-ph]');
    if (!el) return;
    const related = e.relatedTarget?.closest?.('[data-ea-ph]');
    if (related?.getAttribute('data-ea-ph') === el.getAttribute('data-ea-ph')) return;
    onLeave?.();
  });
  root.addEventListener('click', (e) => {
    const el = e.target.closest?.('[data-ea-ph]');
    if (el) onToggle?.(el.getAttribute('data-ea-ph'));
  });
}

export function paintPlaceholderRoot(root, highlightName, handlers, tokenRe = PLACEHOLDER_RE) {
  if (!root) return;
  injectPlaceholderStyles(root.ownerDocument);
  decoratePlaceholderRoot(root, highlightName, tokenRe);
  bindPlaceholderEvents(root, handlers);
}
