export default function MetricTile({ label, value, hint, tone = 'default' }) {
  const color = tone === 'danger' ? 'text-danger' : tone === 'success' ? 'text-success' : 'text-text-primary';
  return (
    <div className="rounded-xl border border-border bg-bg-primary px-4 py-3 min-w-0">
      <p className="m-0 text-[10px] font-bold uppercase tracking-wider text-text-tertiary">{label}</p>
      <p className={`m-0 mt-1 text-2xl font-semibold tabular-nums ${color}`}>{value}</p>
      {hint ? <p className="m-0 mt-0.5 text-xs text-text-tertiary">{hint}</p> : null}
    </div>
  );
}
