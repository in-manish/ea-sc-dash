import { useEffect, useMemo, useRef } from 'react';
import JoditEditor from 'jodit-react';
import { JODIT_EMAIL_CONFIG } from './joditEmailConfig';
import { paintPlaceholderRoot, stripPlaceholderMarks } from './placeholderHighlight';

export default function EmailVisualEditor({
  value,
  onChange,
  editorKey,
  highlightName,
  onHover,
  onLeave,
  onToggle,
}) {
  const editorRef = useRef(null);
  const highlightRef = useRef(highlightName);
  const handlersRef = useRef({ onHover, onLeave, onToggle });
  highlightRef.current = highlightName;
  handlersRef.current = { onHover, onLeave, onToggle };
  const painting = useRef(false);
  const interactive = Boolean(onHover || onToggle);

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

  const config = useMemo(
    () => ({
      ...JODIT_EMAIL_CONFIG,
      events: {
        afterInit(editor) {
          editorRef.current = editor;
          if (!interactive) return;
          paint(editor);
          editor.events.on('change', () => paint(editor));
        },
      },
    }),
    [interactive]
  );

  useEffect(() => {
    if (interactive && editorRef.current) paint(editorRef.current);
  }, [highlightName, interactive]);

  return (
    <JoditEditor
      key={editorKey}
      value={value}
      config={config}
      editorRef={(editor) => {
        editorRef.current = editor;
      }}
      onBlur={(html) => onChange(stripPlaceholderMarks(html))}
      onChange={() => {}}
    />
  );
}
