import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { JODIT_EMAIL_CONFIG } from './joditEmailConfig';
import { applyPlaceholderHighlight, paintPlaceholderRoot } from './placeholderHighlight';
import { bindJoditCaret, insertTokenInJodit } from './insertAtCaret';

export default function EmailVisualEditor({
  value,
  onChange,
  editorKey,
  highlightName,
  onHover,
  onLeave,
  onToggle,
  insertRef,
}) {
  const editorRef = useRef(null);
  const wrapRef = useRef(null);
  const highlightRef = useRef(highlightName);
  const handlersRef = useRef({ onHover, onLeave, onToggle });
  highlightRef.current = highlightName;
  handlersRef.current = { onHover, onLeave, onToggle };
  const painting = useRef(false);
  const interactive = Boolean(onHover || onToggle);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [caretBox, setCaretBox] = useState(null);

  const paint = (editor) => {
    const root = editor?.editor;
    if (!root || painting.current) return;
    painting.current = true;
    try {
      paintPlaceholderRoot(root, highlightRef.current, handlersRef.current);
    } finally {
      queueMicrotask(() => {
        painting.current = false;
      });
    }
  };

  const setEditor = useCallback((editor) => {
    editorRef.current = editor;
  }, []);

  const handleBlur = useCallback((html) => {
    onChangeRef.current(html);
  }, []);

  const handleChange = useCallback(() => {}, []);

  const config = useMemo(
    () => ({
      ...JODIT_EMAIL_CONFIG,
      events: {
        afterInit(editor) {
          editorRef.current = editor;
          if (insertRef) bindJoditCaret(editor, wrapRef.current, setCaretBox);
        },
      },
    }),
    [insertRef]
  );

  useEffect(() => {
    if (!interactive) return undefined;
    const id = requestAnimationFrame(() => paint(editorRef.current));
    return () => cancelAnimationFrame(id);
  }, [interactive, editorKey]);

  useEffect(() => {
    const root = editorRef.current?.editor;
    if (interactive && root) applyPlaceholderHighlight(root, highlightName);
  }, [highlightName, interactive]);

  useEffect(() => {
    if (!insertRef) return undefined;
    insertRef.current = (token) => {
      const editor = editorRef.current;
      const inserted = insertTokenInJodit(editor, token);
      if (!inserted) return false;
      setCaretBox(null);
      onChangeRef.current(editor.value || '');
      return true;
    };
    return () => {
      insertRef.current = null;
    };
  }, [insertRef]);

  return (
    <div ref={wrapRef} className="relative flex-1 min-h-[500px]">
      <style>{`
        .ea-caret-overlay { animation: ea-caret-blink 1s step-end infinite; }
        @keyframes ea-caret-blink { 50% { background: transparent; } }
      `}</style>
      <JoditEditor
        key={editorKey}
        value={value}
        config={config}
        editorRef={setEditor}
        onBlur={handleBlur}
        onChange={handleChange}
      />
      {caretBox ? (
        <div
          className="ea-caret-overlay pointer-events-none absolute w-0.5 bg-rose-600"
          style={{ left: caretBox.left, top: caretBox.top, height: caretBox.height }}
        />
      ) : null}
    </div>
  );
}
