import { useState } from 'react';
import JoditEditor from 'jodit-react';
import { Code, Layout } from 'lucide-react';
import EmailFileImport from './EmailFileImport';
import { JODIT_EMAIL_CONFIG } from './joditEmailConfig';

export default function EmailBodyEditor({ value, onChange }) {
  const [editorMode, setEditorMode] = useState('visual');
  const [editorKey, setEditorKey] = useState(0);
  const html = value || '';

  const applyImported = (next) => {
    onChange(next);
    setEditorKey((key) => key + 1);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white min-h-[500px]">
      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50/50 flex flex-wrap justify-between items-center gap-2">
        <div className="flex p-1 bg-white border border-gray-200 rounded-lg shadow-sm">
          <ModeBtn active={editorMode === 'visual'} onClick={() => setEditorMode('visual')}>
            <Layout size={14} />
            Visual
          </ModeBtn>
          <ModeBtn active={editorMode === 'code'} onClick={() => setEditorMode('code')}>
            <Code size={14} />
            Code
          </ModeBtn>
        </div>
        <EmailFileImport content={html} onChange={applyImported} />
      </div>
      {editorMode === 'visual' ? (
        <JoditEditor
          key={editorKey}
          value={html}
          config={JODIT_EMAIL_CONFIG}
          onBlur={(next) => onChange(next)}
          onChange={() => {}}
        />
      ) : (
        <div className="flex-1 p-4 bg-gray-50">
          <textarea
            value={html}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full p-6 text-sm font-mono text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none shadow-premium-sm"
            placeholder="Write your email content or HTML, or browse a file..."
            style={{ minHeight: '500px' }}
          />
        </div>
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
