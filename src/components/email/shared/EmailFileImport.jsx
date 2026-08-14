import { useRef, useState } from 'react';
import { FileUp } from 'lucide-react';
import { mergeImportedHtml, readHtmlFile } from './readHtmlFile';

export default function EmailFileImport({ content, onChange }) {
  const inputRef = useRef(null);
  const [mode, setMode] = useState('append');
  const [error, setError] = useState('');
  const empty = !String(content || '').trim();
  const applyMode = empty ? 'replace' : mode;

  const onPick = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    setError('');
    try {
      const text = await readHtmlFile(file);
      onChange(mergeImportedHtml(content, text, applyMode));
    } catch (err) {
      setError(err?.message || 'Could not read that file.');
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        ref={inputRef}
        type="file"
        accept=".html,.htm,.txt,text/html,text/plain"
        className="hidden"
        onChange={onPick}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center gap-2"
      >
        <FileUp size={14} />
        Browse file
      </button>
      {!empty ? (
        <div className="flex gap-1 p-0.5 rounded-lg bg-white border border-gray-200">
          <ModeChip active={mode === 'append'} onClick={() => setMode('append')}>
            Append
          </ModeChip>
          <ModeChip active={mode === 'replace'} onClick={() => setMode('replace')}>
            Replace
          </ModeChip>
        </div>
      ) : null}
      {error ? <p className="text-xs text-red-600 m-0 w-full">{error}</p> : null}
    </div>
  );
}

function ModeChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border-none cursor-pointer ${
        active ? 'bg-accent text-white' : 'bg-transparent text-gray-500 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );
}
