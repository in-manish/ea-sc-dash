const formatNumber = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return Number(value).toLocaleString();
};

const getProgressPercent = (done, total) => {
  const d = Number(done);
  const t = Number(total);
  if (!t || Number.isNaN(d) || Number.isNaN(t) || t <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((d / t) * 100)));
};

const getProgressBarClass = (percent) => {
  if (percent >= 100) return 'bg-emerald-500';
  if (percent >= 66) return 'bg-emerald-400';
  if (percent >= 33) return 'bg-amber-400';
  return 'bg-rose-400';
};

/** Append a unit only when the formatted value is numeric. */
export function withUnit(value, unit) {
  const formatted = formatNumber(value);
  if (formatted === '—') return formatted;
  return `${formatted} ${unit}`;
}

export function CompanyReportMetricRow({
  label,
  value,
  hint,
  progressDone,
  progressTotal,
}) {
  const showProgress = progressTotal !== undefined && progressTotal !== null;
  const percent = showProgress ? getProgressPercent(progressDone, progressTotal) : 0;
  const barClass = getProgressBarClass(percent);

  return (
    <div className="py-2.5 border-b border-border last:border-b-0">
      <div className="flex items-start justify-between gap-6">
        <span className="text-sm text-text-secondary">{label}</span>
        <div className="text-right shrink-0">
          <span className="text-sm font-semibold text-text-primary tabular-nums">{value}</span>
          {hint ? (
            <p className="text-xs text-text-tertiary m-0 mt-0.5">{hint}</p>
          ) : null}
        </div>
      </div>
      {showProgress ? (
        <div className="mt-2 space-y-1.5">
          <div
            className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden"
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${label} progress`}
          >
            <div
              className={`h-full rounded-full ${barClass}`}
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="m-0 text-[11px] text-text-tertiary tabular-nums">
            Companies completed: {formatNumber(progressDone)} / {formatNumber(progressTotal)} · {percent}%
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function CompanyReportSkeletonRow() {
  return (
    <div className="flex items-center justify-between gap-6 py-2.5 border-b border-border last:border-b-0">
      <div className="animate-pulse h-3.5 w-36 rounded bg-bg-tertiary" />
      <div className="animate-pulse h-3.5 w-12 rounded bg-bg-tertiary" />
    </div>
  );
}
