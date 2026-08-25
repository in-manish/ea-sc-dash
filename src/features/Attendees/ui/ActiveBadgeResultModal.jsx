import { X } from 'lucide-react';
import {
  createStatusLabel,
  statusRowLabel,
} from '../domain/summarizeActiveBadge';

const ActiveBadgeResultModal = ({
  isOpen,
  kind,
  statusResult,
  createResult,
  onClose,
}) => {
  if (!isOpen) return null;

  const isStatus = kind === 'status';
  const result = isStatus ? statusResult : createResult;
  const rows = result?.data || [];
  const title = isStatus ? 'Active Badge Status' : 'Set Active Badge';

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="presentation"
    >
      <div
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-badge-result-title"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
          <div>
            <h2
              id="active-badge-result-title"
              className="text-base font-semibold text-text-primary"
            >
              {title}
            </h2>
            {result?.summary && (
              <p className="mt-1 text-sm text-text-secondary">{result.summary}</p>
            )}
          </div>
          <button
            type="button"
            className="btn btn-ghost p-2"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto px-5 py-4">
          {rows.length === 0 ? (
            <p className="text-sm text-text-secondary">No matching badges.</p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((item) => (
                <li
                  key={item.uuid || item.id}
                  className="py-3 flex flex-col gap-0.5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-medium text-text-primary">
                      {item.name || `Badge #${item.id}`}
                    </div>
                    <div className="text-xs text-text-tertiary font-mono">
                      #{item.id}
                      {item.uuid ? ` · ${item.uuid}` : ''}
                    </div>
                    {item.message && (
                      <div className="text-xs text-text-secondary mt-1">
                        {item.message}
                      </div>
                    )}
                  </div>
                  <span
                    className={`mt-1 sm:mt-0 text-xs font-semibold shrink-0 ${
                      isStatus
                        ? item.has_active_badge
                          ? 'text-emerald-700'
                          : item.has_contact === false
                            ? 'text-amber-700'
                            : 'text-accent'
                        : item.status === 'created'
                          ? 'text-emerald-700'
                          : item.status === 'failed'
                            ? 'text-red-700'
                            : item.status === 'skipped'
                              ? 'text-amber-700'
                              : 'text-text-secondary'
                    }`}
                  >
                    {isStatus
                      ? statusRowLabel(item)
                      : createStatusLabel(item.status)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {(result?.missingIds?.length > 0 ||
            result?.missingUuids?.length > 0) && (
            <p className="mt-4 text-xs text-text-tertiary">
              Not found:
              {result.missingIds?.length
                ? ` ids ${result.missingIds.join(', ')}`
                : ''}
              {result.missingUuids?.length
                ? ` uuids ${result.missingUuids.join(', ')}`
                : ''}
            </p>
          )}
        </div>

        <div className="px-5 py-4 border-t border-border flex justify-end">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActiveBadgeResultModal;
