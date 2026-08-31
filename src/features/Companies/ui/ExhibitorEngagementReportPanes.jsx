import { Download, Loader2 } from 'lucide-react';
import { COMPLETED_FILTER_OPTIONS } from '../domain/exhibitorEngagementQuery';

export function CompletedFilter({ value, onChange, disabled }) {
  return (
    <fieldset className="m-0 p-0 border-0">
      <legend className="block text-sm font-medium text-text-primary mb-2">
        Matchmaking completion
      </legend>
      <div className="flex flex-col gap-1.5">
        {COMPLETED_FILTER_OPTIONS.map((option) => {
          const id = `eng-completed-${option.value || 'all'}`;
          return (
            <label
              key={id}
              htmlFor={id}
              className={`flex items-start gap-2.5 px-3 py-2 rounded-md border cursor-pointer transition-colors ${
                value === option.value
                  ? 'border-accent bg-accent/5'
                  : 'border-border bg-bg-secondary hover:border-hover'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              <input
                id={id}
                type="radio"
                name="eng-completed"
                value={option.value}
                checked={value === option.value}
                disabled={disabled}
                onChange={() => onChange(option.value)}
                className="mt-0.5 accent-accent"
              />
              <span>
                <span className="block text-sm font-medium text-text-primary">
                  {option.label}
                </span>
                <span className="block text-[11px] text-text-tertiary">{option.hint}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function DownloadPane({ busy, downloading, onDownload }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary m-0">
        Download portal matchmaking answers as a CSV. Each question is a column;
        unanswered cells are empty.
      </p>
      <button
        type="button"
        className="btn btn-primary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
        disabled={busy}
        onClick={onDownload}
      >
        {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        Download CSV
      </button>
    </div>
  );
}
