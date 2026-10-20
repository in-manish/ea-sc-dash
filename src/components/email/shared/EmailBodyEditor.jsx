import { useEffect, useRef, useState } from 'react';
import { Braces, Code, Layout } from 'lucide-react';
import EmailFileImport from './EmailFileImport';
import EmailVisualEditor from './EmailVisualEditor';
import EmailCodeEditor from './EmailCodeEditor';
import { stripPlaceholderMarks } from './placeholderHighlight';
import { formatHtml } from './formatHtml';

// Visual mode parses content through the browser's HTML parser, which mangles
// {% %} Jinja tags sitting inside table structure or tag attribute lists.
const JINJA_TAG_RE = /\{%[\s\S]*?%\}/;

export default function EmailBodyEditor({
  value,
  onChange,
  highlightName,
  onHover,
  onLeave,
  onToggle,
  contentRevision = 0,
  insertRef,
  tokenRe,
}) {
  const [editorMode, setEditorMode] = useState('visual');
  const [editorKey, setEditorKey] = useState(0);
  const visualInsertRef = useRef(null);
  const codeInsertRef = useRef(null);
  const html = value || '';
  const jinjaLocked = JINJA_TAG_RE.test(html);
  // Jinja tags get mangled the moment Visual mode parses them, so force Code
  // mode for as long as they're present, regardless of the last chosen mode.
  const effectiveMode = jinjaLocked ? 'code' : editorMode;
  const highlight = { highlightName, onHover, onLeave, onToggle, tokenRe };
  const visualKey = `${editorKey}-${contentRevision}`;

  useEffect(() => {
    if (!insertRef) return undefined;
    insertRef.current = (token) => {
      if (effectiveMode === 'code')
        return codeInsertRef.current?.(token) ?? false;
      return visualInsertRef.current?.(token) ?? false;
    };
    return () => {
      insertRef.current = null;
    };
  }, [effectiveMode, insertRef]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-[500px]">
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
          <ModeBtn
            active={effectiveMode === 'visual'}
            disabled={jinjaLocked}
            title={
              jinjaLocked
                ? 'Visual mode can corrupt Jinja tags ({% %}) — edit this template in Code mode'
                : undefined
            }
            onClick={() => setEditorMode('visual')}
          >
            <Layout size={14} />
            Visual
          </ModeBtn>
          <ModeBtn
            active={effectiveMode === 'code'}
            onClick={() => {
              if (effectiveMode === 'visual')
                onChange(stripPlaceholderMarks(html));
              setEditorMode('code');
            }}
          >
            <Code size={14} />
            Code
          </ModeBtn>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {effectiveMode === 'code' ? (
            <button
              type="button"
              onClick={() => onChange(formatHtml(html))}
              title="Reformat the HTML for readability — Jinja tags are left untouched"
              className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center gap-2"
            >
              <Braces size={14} />
              Format
            </button>
          ) : null}
          <EmailFileImport
            content={html}
            onChange={(next) => {
              onChange(next);
              setEditorKey((key) => key + 1);
            }}
          />
        </div>
      </div>
      {effectiveMode === 'visual' ? (
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

function ModeBtn({ active, disabled, title, onClick, children }) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      onClick={disabled ? undefined : onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border-none ${
        disabled
          ? 'text-gray-300 cursor-not-allowed'
          : active
            ? 'bg-accent text-white shadow-sm cursor-pointer'
            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer'
      }`}
    >
      {children}
    </button>
  );
}
