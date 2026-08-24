export default function MeetingStatsChipGroup({
  label,
  options = [],
  selected = [],
  onToggle,
  loading = false,
  emptyText = 'None available',
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-text-secondary">{label}</span>
      <div className="flex flex-wrap gap-2">
        {loading && <p className="text-xs text-text-tertiary m-0">Loading…</p>}
        {!loading && options.length === 0 && (
          <p className="text-xs text-text-tertiary m-0">{emptyText}</p>
        )}
        {!loading &&
          options.map((option) => {
            const value = option.value;
            const isActive = selected.includes(value);
            return (
              <button
                key={value}
                type="button"
                className={`py-1.5 px-3 border rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-primary border-border text-text-secondary hover:border-accent hover:text-text-primary hover:bg-bg-secondary'
                }`}
                onClick={() => onToggle(value)}
              >
                {option.label}
              </button>
            );
          })}
      </div>
    </div>
  );
}
