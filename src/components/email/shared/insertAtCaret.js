export function editorDocument(editor) {
  return editor?.editor?.ownerDocument || editor?.iframe?.contentDocument || null;
}

export function persistJoditSelection(editor) {
  try {
    if (!editor?.s) return false;
    if (!editor.s.hasMarkers) editor.s.save();
    return editor.s.hasMarkers;
  } catch {
    return false;
  }
}

export function insertTokenInJodit(editor, token) {
  try {
    if (!editor?.s) return false;
    if (!editor.s.hasMarkers && !editor.s.isFocused()) return false;
    editor.s.insertHTML(token);
    return true;
  } catch {
    return false;
  }
}

export function caretOverlayBox(editor, wrapEl) {
  if (!wrapEl) return null;
  const doc = editorDocument(editor);
  const sel = doc?.getSelection?.();
  if (!sel?.rangeCount) return null;
  try {
    const range = sel.getRangeAt(0).cloneRange();
    range.collapse(true);
    const rect = range.getBoundingClientRect();
    const iframeRect = editor.iframe?.getBoundingClientRect?.();
    const wrapRect = wrapEl.getBoundingClientRect();
    const height = rect.height || 16;
    if (!height && rect.left === 0 && rect.top === 0) return null;
    return {
      left: (iframeRect?.left ?? 0) + rect.left - wrapRect.left,
      top: (iframeRect?.top ?? 0) + rect.top - wrapRect.top,
      height,
    };
  } catch {
    return null;
  }
}

export function bindJoditCaret(editor, wrapEl, setCaretBox) {
  const doc = editorDocument(editor);
  if (!doc || doc.documentElement.dataset.eaCaretBound === '1') return;
  doc.documentElement.dataset.eaCaretBound = '1';

  const persist = () => {
    const box = caretOverlayBox(editor, wrapEl);
    if (box) setCaretBox(box);
    persistJoditSelection(editor);
  };

  const clearOverlay = () => {
    setCaretBox(null);
    try {
      editor.s.removeMarkers();
    } catch {
      /* ignore */
    }
  };

  doc.addEventListener('mouseout', (e) => {
    if (e.relatedTarget && doc.documentElement.contains(e.relatedTarget)) return;
    persist();
  });
  doc.defaultView?.addEventListener('blur', persist);
  doc.addEventListener('mousedown', clearOverlay);
}
