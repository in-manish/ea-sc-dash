const fieldClass =
  'w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm text-text-primary outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent';

export default function AiPresetPreviewForm({
  userQuery,
  filtersText,
  loading,
  onUserQueryChange,
  onFiltersChange,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-end">
      <label className="block min-w-0">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          User query
        </span>
        <input
          className={`${fieldClass} mt-1.5`}
          value={userQuery}
          onChange={(e) => onUserQueryChange(e.target.value)}
          placeholder="looking for hotels"
        />
      </label>
      <label className="block min-w-0">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          Filters JSON
        </span>
        <textarea
          className={`${fieldClass} mt-1.5 min-h-[40px] h-[40px] font-mono text-xs resize-y`}
          value={filtersText}
          onChange={(e) => onFiltersChange(e.target.value)}
          placeholder='{"seeking":[{"question_id":52,"option_id":435}]}'
        />
      </label>
      <button type="submit" className="btn btn-primary btn-sm self-end" disabled={loading}>
        {loading ? 'Loading…' : 'Run preview'}
      </button>
    </div>
  );
}
