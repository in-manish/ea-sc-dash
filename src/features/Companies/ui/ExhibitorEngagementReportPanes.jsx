import { Download, Loader2 } from 'lucide-react';
import { COMPLETED_FILTER_OPTIONS } from '../domain/exhibitorEngagementQuery';

function ReportSwitch({ name, checked, onChange, disabled }) {
  return (
    <label className={`relative inline-block w-11 h-6 m-0 shrink-0 ${disabled ? 'opacity-50' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="block absolute inset-0 rounded-full bg-slate-300 peer-checked:bg-success transition-colors" />
      <span className="absolute left-[3px] bottom-[3px] bg-white w-[18px] h-[18px] rounded-full shadow-sm transition-transform peer-checked:translate-x-[20px]" />
    </label>
  );
}

function IncludeToggleRow({ name, title, hintOn, hintOff, checked, onChange, disabled, bordered }) {
  return (
    <div className={`flex items-start justify-between gap-4 px-3 py-3 bg-bg-primary ${bordered ? 'border-t border-border' : ''}`}>
      <div className="min-w-0">
        <p className="m-0 text-sm font-medium text-text-primary">{title}</p>
        <p className="m-0 mt-1 text-[11px] leading-snug text-text-tertiary">
          {checked ? hintOn : hintOff}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0 pt-0.5">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-tertiary">
          {checked ? 'On' : 'Off'}
        </span>
        <ReportSwitch name={name} checked={checked} onChange={onChange} disabled={disabled} />
      </div>
    </div>
  );
}

export function ReportOptions({
  includeQuestions,
  onIncludeQuestionsChange,
  includeLoginInfo,
  onIncludeLoginInfoChange,
  completed,
  onCompletedChange,
  disabled,
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="px-3 py-2.5 bg-bg-secondary border-b border-border">
          <p className="m-0 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">
            Always included
          </p>
          <p className="m-0 mt-1 text-xs text-text-secondary">
            Parents and co-exhibitors · contact, email, salesperson · team members and invite counts
          </p>
        </div>
        <IncludeToggleRow
          name="include_matchmaking_questions"
          title="Include matchmaking questions"
          hintOn="Each portal question is a column. Cells list selected option names, or the text answer."
          hintOff="Question columns omitted. Identity and invite counts only."
          checked={includeQuestions}
          onChange={onIncludeQuestionsChange}
          disabled={disabled}
        />
        <IncludeToggleRow
          name="include_login_info"
          title="Include portal login info"
          hintOn="Adds POC Logged In (Yes/No) and POC First Login after Registered Email."
          hintOff="Login columns omitted. Identity and invite counts only."
          checked={includeLoginInfo}
          onChange={onIncludeLoginInfoChange}
          disabled={disabled}
          bordered
        />
      </div>

      <CompletedFilter value={completed} onChange={onCompletedChange} disabled={disabled} />
    </div>
  );
}

export function CompletedFilter({ value, onChange, disabled }) {
  const selected = COMPLETED_FILTER_OPTIONS.find((option) => option.value === value)
    || COMPLETED_FILTER_OPTIONS[0];

  return (
    <fieldset className="m-0 p-0 border-0">
      <legend className="block text-sm font-medium text-text-primary mb-2">
        Matchmaking completion
      </legend>
      <div className="flex rounded-lg border border-border overflow-hidden">
        {COMPLETED_FILTER_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={option.value || 'all'}
              type="button"
              disabled={disabled}
              onClick={() => onChange(option.value)}
              className={`flex-1 py-2 px-2 text-sm font-medium border-0 cursor-pointer transition-colors disabled:opacity-50 ${
                active
                  ? 'bg-accent text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
      <p className="m-0 mt-1.5 text-[11px] text-text-tertiary">{selected.hint}</p>
    </fieldset>
  );
}

export function DownloadPane({ busy, downloading, onDownload }) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary m-0">
        Saves a timestamped CSV (IST). Parents and co-exhibitors are both included.
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
