import React from 'react';
import { Loader2, Plus } from 'lucide-react';

const chipBase =
  'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all';

/** Multi-select products from matchmaking question_type=product options. */
const CompanyProductSelectFields = ({
  selected = [],
  options = [],
  loading = false,
  error = '',
  hasProductQuestion = true,
  onSetupProductQuestion,
  onChange,
}) => {
  const selectedSet = new Set(selected.map((p) => p.toLowerCase()));
  const optionKeys = new Set(options.map((o) => o.toLowerCase()));
  const orphans = selected.filter((p) => !optionKeys.has(p.toLowerCase()));

  const toggle = (name) => {
    const key = name.toLowerCase();
    if (selectedSet.has(key)) {
      onChange(selected.filter((p) => p.toLowerCase() !== key));
      return;
    }
    onChange([...selected, name]);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-text-secondary">Products</label>

      {loading ? (
        <div className="flex items-center gap-2 text-sm text-text-tertiary py-2">
          <Loader2 size={14} className="animate-spin" />
          Loading product options…
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : !hasProductQuestion ? (
        <div className="rounded-lg border border-dashed border-border bg-bg-secondary/50 p-4 space-y-3">
          <p className="text-sm text-text-secondary">
            No matchmaking Product question is set for this event. Create one to
            choose products here (exhibitor portal enabled).
          </p>
          {onSetupProductQuestion && (
            <button
              type="button"
              className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
              onClick={onSetupProductQuestion}
            >
              <Plus size={14} />
              Set up Product question
            </button>
          )}
          {orphans.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {orphans.map((name) => (
                <button
                  key={`orphan-${name}`}
                  type="button"
                  onClick={() => toggle(name)}
                  title="Clear existing value"
                  className={`${chipBase} bg-amber-50 text-amber-800 border-amber-200`}
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : options.length === 0 && orphans.length === 0 ? (
        <p className="text-sm text-text-tertiary">
          Product question exists but has no options yet. Add options in Matchmaking.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {options.map((name) => {
            const isOn = selectedSet.has(name.toLowerCase());
            return (
              <button
                key={name}
                type="button"
                onClick={() => toggle(name)}
                className={`${chipBase} ${
                  isOn
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-secondary text-text-secondary border-border hover:border-accent/30'
                }`}
              >
                {name}
              </button>
            );
          })}
          {orphans.map((name) => (
            <button
              key={`orphan-${name}`}
              type="button"
              onClick={() => toggle(name)}
              title="Not in current matchmaking options"
              className={`${chipBase} bg-amber-50 text-amber-800 border-amber-200`}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {selected.length > 0 && hasProductQuestion && (
        <p className="text-xs text-text-tertiary">{selected.length} selected</p>
      )}
    </div>
  );
};

export default CompanyProductSelectFields;
