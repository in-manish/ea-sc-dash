import {
  createStatusLabel,
  statusRowLabel,
} from '../domain/summarizeActiveBadge';

function rowTone(isStatus, item) {
  if (isStatus) {
    if (item.has_active_badge) return 'text-emerald-700';
    if (item.has_contact === false) return 'text-amber-700';
    return 'text-accent';
  }
  if (item.status === 'created') return 'text-emerald-700';
  if (item.status === 'failed') return 'text-red-700';
  if (item.status === 'skipped') return 'text-amber-700';
  return 'text-text-secondary';
}

const ActiveBadgeResultList = ({ isStatus, rows }) => {
  if (!rows.length) {
    return (
      <p className="text-sm text-text-secondary">
        No matching badges for this request.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border">
      {rows.map((item) => (
        <li
          key={item.uuid || item.id}
          className="py-3 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"
        >
          <div className="min-w-0">
            <div className="text-sm font-medium text-text-primary truncate">
              {item.name || `Badge #${item.id}`}
            </div>
            <div className="text-xs text-text-tertiary font-mono">
              #{item.id}
              {item.email ? ` · ${item.email}` : ''}
              {item.phone_number ? ` · ${item.phone_number}` : ''}
            </div>
            {isStatus && item.evc_id == null && item.has_contact !== false && !item.has_active_badge && (
              <div className="text-xs text-sky-700 mt-1">
                No SnapCard id yet — create will sync first
              </div>
            )}
            {!isStatus && item.message && (item.status === 'failed' || item.status === 'skipped') && (
              <div className="text-xs text-text-secondary mt-1">{item.message}</div>
            )}
            {!isStatus && item.message && item.status !== 'failed' && item.status !== 'skipped' && (
              <div className="text-xs text-text-tertiary mt-1">{item.message}</div>
            )}
          </div>
          <span className={`mt-1 sm:mt-0 text-xs font-semibold shrink-0 ${rowTone(isStatus, item)}`}>
            {isStatus ? statusRowLabel(item) : createStatusLabel(item.status)}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default ActiveBadgeResultList;
