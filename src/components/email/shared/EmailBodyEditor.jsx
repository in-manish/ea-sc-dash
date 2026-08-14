import { useEffect, useRef, useState } from 'react';
import { Code, Layout } from 'lucide-react';
import EmailFileImport from './EmailFileImport';
import EmailVisualEditor from './EmailVisualEditor';
import EmailCodeEditor from './EmailCodeEditor';
import { stripPlaceholderMarks } from './placeholderHighlight';

export default function EmailBodyEditor({
  value,
  onChange,
  highlightName,
  onHover,
  onLeave,
  onToggle,
  contentRevision = 0,
  insertRef,
}) {
  const [editorMode, setEditorMode] = useState('visual');
  const [editorKey, setEditorKey] = useState(0);
  const visualInsertRef = useRef(null);
  const codeInsertRef = useRef(null);
  const html = value || '';
  const highlight = { highlightName, onHover, onLeave, onToggle };
  const visualKey = `${editorKey}-${contentRevision}`;

  useEffect(() => {
    if (!insertRef) return undefined;
    insertRef.current = (token) => {
      if (editorMode === 'code') return codeInsertRef.current?.(token) ?? false;
      return visualInsertRef.current?.(token) ?? false;
    };
    return () => {
      insertRef.current = null;
    };
  }, [editorMode, insertRef]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-[500px]">
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
          <ModeBtn active={editorMode === 'visual'} onClick={() => setEditorMode('visual')}>
            <Layout size={14} />
            Visual
          </ModeBtn>
          <ModeBtn
            active={editorMode === 'code'}
            onClick={() => {
              if (editorMode === 'visual') onChange(stripPlaceholderMarks(html));
              setEditorMode('code');
            }}
          >
            <Code size={14} />
            Code
          </ModeBtn>
        </div>
        <EmailFileImport
          content={html}
          onChange={(next) => {
            onChange(next);
            setEditorKey((key) => key + 1);
          }}
        />
      </div>
      {editorMode === 'visual' ? (
        <EmailVisualEditor
          key={visualKey}
          editorKey={visualKey}
          value={html}
          onChange={onChange}
          insertRef={insertRef ? visualInsertRef : undefined}
          {...highlight}
        />
      ) : (
        <EmailCodeEditor
          value={html}
          onChange={onChange}
          insertRef={codeInsertRef}
          {...highlight}
        />
      )}
    </div>
  );
}

function ModeBtn({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-none cursor-pointer ${
        active
          ? 'bg-accent text-white shadow-sm'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}
