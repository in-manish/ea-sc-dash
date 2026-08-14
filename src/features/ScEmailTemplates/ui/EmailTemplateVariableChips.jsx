import { useState } from 'react';
import { X } from 'lucide-react';
import { normalizeContentVariable } from '../domain/contentVariables';

export default function EmailTemplateVariableChips({
  variables,
  error,
  onChange,
  onInsert,
}) {
  const [draft, setDraft] = useState('');

  const add = () => {
    const name = normalizeContentVariable(draft);
    if (!name) return;
    if (!variables.includes(name)) onChange([...variables, name]);
    setDraft('');
  };

  return (
    <div className="input-group">
      <label className="input-label">Content variables</label>
      <div className="flex flex-wrap gap-2 mb-2 min-h-[1.75rem]">
        {variables.map((name) => (
          <VariableChip
            key={name}
            name={name}
            onInsert={onInsert}
            onRemove={() => onChange(variables.filter((item) => item !== name))}
          />
        ))}
        {!variables.length ? (
          <span className="text-xs text-text-tertiary">No variables yet.</span>
        ) : null}
      </div>
      <div className="flex gap-2">
        <input
          className="input-field"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            add();
          }}
          placeholder="Add variable (e.g. name)"
        />
        <button type="button" className="btn btn-primary btn-sm shrink-0" onClick={add}>
          Add
        </button>
      </div>
      {error ? (
        <p className="text-xs text-danger mt-1">{error}</p>
      ) : (
        <p className="text-xs text-text-tertiary mt-1">
          Click a chip to insert {'{{ name }}'} into the HTML. Optional; defaults to empty on the server.
        </p>
      )}
    </div>
  );
}

function VariableChip({ name, onInsert, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 pl-2.5 pr-1 py-1 rounded-full text-xs bg-bg-secondary border border-border text-text-primary">
      <button
        type="button"
        className="bg-transparent border-none p-0 cursor-pointer text-text-primary"
        onClick={() => onInsert?.(name)}
      >
        {name}
      </button>
      <button
        type="button"
        className="p-0.5 rounded-full border-none bg-transparent text-text-tertiary hover:text-text-primary cursor-pointer"
        aria-label={`Remove ${name}`}
        onClick={onRemove}
      >
        <X size={12} />
      </button>
    </span>
  );
}
