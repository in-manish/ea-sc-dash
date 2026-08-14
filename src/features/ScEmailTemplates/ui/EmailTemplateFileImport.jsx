import { useRef, useState } from 'react';
import { mergeImportedHtml, readHtmlFile } from '../domain/readHtmlFile';

export default function EmailTemplateFileImport({ content, onChange }) {
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
    <div className="flex flex-wrap items-center gap-2 mb-2">
      <input
        ref={inputRef}
        type="file"
        accept=".html,.htm,.txt,text/html,text/plain"
        className="hidden"
        onChange={onPick}
      />
      <button
        type="button"
        className="btn btn-secondary btn-sm"
        onClick={() => inputRef.current?.click()}
      >
        Insert from file
      </button>
      {!empty ? (
        <div className="flex gap-1 p-0.5 rounded-lg bg-bg-secondary border border-border">
          <ModeChip active={mode === 'append'} onClick={() => setMode('append')}>
            Append
          </ModeChip>
          <ModeChip active={mode === 'replace'} onClick={() => setMode('replace')}>
            Replace
          </ModeChip>
        </div>
      ) : null}
      {error ? <p className="text-xs text-danger w-full m-0">{error}</p> : null}
    </div>
  );
}

function ModeChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`btn btn-sm border-none ${active ? 'btn-primary' : 'btn-secondary'}`}
    >
      {children}
    </button>
  );
}
