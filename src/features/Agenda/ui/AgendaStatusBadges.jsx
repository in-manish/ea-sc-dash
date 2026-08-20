const chip =
  'inline-flex items-center bg-success/10 text-success border border-success/20 text-[8px] font-black py-0.5 px-2.5 rounded-md uppercase tracking-[0.15em] whitespace-nowrap';

const forceChip =
  'inline-flex items-center bg-accent/10 text-accent border border-accent/20 text-[8px] font-black py-0.5 px-2.5 rounded-md uppercase tracking-[0.15em] whitespace-nowrap';

export default function AgendaStatusBadges({ item, className = '' }) {
  if (!item?.enrollable && !item?.force_attendance) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {item.enrollable && <span className={chip}>Joinable</span>}
      {item.force_attendance && (
        <span className={forceChip} title="Block slot — meetings cannot be set">
          Force attendance
        </span>
      )}
    </div>
  );
}
