import { useState } from 'react';
import { X, Loader2, ArrowRightLeft } from 'lucide-react';

const ActiveBadgeTransferModal = ({
  isOpen,
  transferring = false,
  result,
  onTransfer,
  onClose,
}) => {
  const [sourceRegId, setSourceRegId] = useState('');
  const [targetRegId, setTargetRegId] = useState('');

  if (!isOpen) return null;

  const canSubmit = sourceRegId.trim() && targetRegId.trim() && !transferring;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    onTransfer(sourceRegId.trim(), targetRegId.trim());
  };

  const handleClose = () => {
    setSourceRegId('');
    setTargetRegId('');
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="presentation"
    >
      <div
        className="bg-bg-primary border border-border rounded-xl shadow-xl w-full max-w-md flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="transfer-modal-title"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-border">
          <div className="min-w-0">
            <h2
              id="transfer-modal-title"
              className="text-base font-semibold text-text-primary"
            >
              Transfer Active Badge
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Move an active badge from one attendee to another
            </p>
          </div>
          <button
            type="button"
            className="btn btn-ghost p-2 shrink-0"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="source-reg-id"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Source Reg ID
              </label>
              <input
                id="source-reg-id"
                type="text"
                className="input w-full"
                placeholder="e.g. 1001"
                value={sourceRegId}
                onChange={(e) => setSourceRegId(e.target.value)}
                disabled={transferring}
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Badge to transfer FROM (must have active badge)
              </p>
            </div>

            <div className="flex justify-center">
              <ArrowRightLeft size={20} className="text-text-tertiary" />
            </div>

            <div>
              <label
                htmlFor="target-reg-id"
                className="block text-sm font-medium text-text-primary mb-1"
              >
                Target Reg ID
              </label>
              <input
                id="target-reg-id"
                type="text"
                className="input w-full"
                placeholder="e.g. 1002"
                value={targetRegId}
                onChange={(e) => setTargetRegId(e.target.value)}
                disabled={transferring}
              />
              <p className="mt-1 text-xs text-text-tertiary">
                Badge to transfer TO
              </p>
            </div>
          </div>

          {result && (
            <div
              className={`mt-4 p-3 rounded-lg text-sm ${
                result.success
                  ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}
            >
              {result.success ? (
                <div>
                  <p className="font-medium">Transfer successful</p>
                  <p className="mt-1 text-xs opacity-80">
                    Active badge #{result.active_badge_id} moved from{' '}
                    {result.source_reg_id} to {result.target_reg_id}
                  </p>
                </div>
              ) : (
                <p>{result.error || 'Transfer failed'}</p>
              )}
            </div>
          )}
        </form>

        <div className="px-5 py-4 border-t border-border flex flex-wrap justify-end gap-2">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleClose}
          >
            {result?.success ? 'Done' : 'Cancel'}
          </button>
          {!result?.success && (
            <button
              type="submit"
              className="btn btn-primary inline-flex items-center"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {transferring && (
                <Loader2 size={16} className="animate-spin mr-2" />
              )}
              {transferring ? 'Transferring…' : 'Transfer'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveBadgeTransferModal;
