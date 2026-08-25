import { X, Loader2 } from 'lucide-react';
import ActiveBadgeCountChips from './ActiveBadgeCountChips';
import ActiveBadgeResultList from './ActiveBadgeResultList';

const ActiveBadgeResultModal = ({
  isOpen,
  kind,
  statusResult,
  createResult,
  canCreateFromPreview = false,
  creating = false,
  onCreateFromPreview,
  onClose,
}) => {
  if (!isOpen) return null;

  const isStatus = kind === 'status';
  const result = isStatus ? statusResult : createResult;
  const rows = result?.data || [];
  const title = isStatus
    ? result?.allWithoutActive
      ? 'Eligible for active badge'
      : 'Active badge status'
    : 'Active badge results';

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
      role="presentation"
    >
      <div
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-badge-result-title"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
          <div className="min-w-0">
            <h2
              id="active-badge-result-title"
              className="text-base font-semibold text-text-primary"
            >
              {title}
            </h2>
            {result?.summary && (
              <p className="mt-1 text-sm text-text-secondary">{result.summary}</p>
            )}
            <ActiveBadgeCountChips kind={kind} result={result} />
          </div>
          <button
            type="button"
            className="btn btn-ghost p-2 shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-auto px-5 py-4">
          <ActiveBadgeResultList isStatus={isStatus} rows={rows} />
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

        <div className="px-5 py-4 border-t border-border flex flex-wrap justify-end gap-2">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            {isStatus ? 'Close' : 'Done'}
          </button>
          {isStatus && canCreateFromPreview && onCreateFromPreview && (
            <button
              type="button"
              className="btn btn-primary inline-flex items-center"
              onClick={onCreateFromPreview}
              disabled={creating}
            >
              {creating && (
                <Loader2 size={16} className="animate-spin mr-2" />
              )}
              Create {statusResult?.eligible?.length || 0} active badge
              {(statusResult?.eligible?.length || 0) === 1 ? '' : 's'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveBadgeResultModal;
