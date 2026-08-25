export default function VisiqStatusBadge({ label, tone, size = 'md' }) {
  const pad = size === 'sm' ? 'px-1.5 py-px text-[11px]' : 'px-2 py-0.5 text-xs';
  return (
    <span
      className={`inline-flex items-center rounded font-medium capitalize whitespace-nowrap ${pad} ${tone}`}
    >
      {label}
    </span>
  );
}
