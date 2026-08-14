import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

const CONFIRM_PHRASE = 'send';

/**
 * AWS console-style type-to-confirm for bulk checklist remind.
 * Closes immediately on confirm; progress continues in the page bar.
 */
export default function ConfirmRemindSendModal({
  mode,
  selectedCount = 0,
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState('');
  const matches = typed === CONFIRM_PHRASE;

  const isAll = mode === 'all';
  const title = isAll
    ? 'Checklist remind all incomplete companies'
    : `Checklist remind ${selectedCount} selected companies`;
  const impact = isAll
    ? 'All companies that are not fully complete'
    : `${selectedCount} selected compan${selectedCount === 1 ? 'y' : 'ies'}`;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter' && matches) onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [matches, onCancel, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50"
      onClick={onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="remind-confirm-title"
        className="bg-white border border-[#d5dbdb] rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.2)] w-full max-w-[520px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#eaeDED] flex justify-between items-center gap-3">
          <h3
            id="remind-confirm-title"
            className="text-[16px] font-bold text-[#16191f] m-0 leading-snug"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#545b64] hover:text-[#16191f] border-none bg-transparent cursor-pointer p-1"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex gap-3 rounded-sm border border-[#fae2b1] bg-[#fdf2d5] px-3 py-3">
            <AlertTriangle
              size={18}
              className="text-[#8d6600] shrink-0 mt-0.5"
              aria-hidden
            />
            <div className="min-w-0">
              <p className="m-0 text-[13px] font-bold text-[#16191f]">
                This action cannot be undone from this screen
              </p>
              <p className="m-0 mt-1 text-[13px] text-[#16191f] leading-snug">
                Setup checklist reminder emails may be sent immediately to
                exhibitor contacts. Make sure you intend to notify{' '}
                <strong>{impact}</strong>.
              </p>
            </div>
          </div>

          <div className="rounded-sm border border-[#d5dbdb] bg-[#fafafa] px-3 py-2.5">
            <p className="m-0 text-[11px] uppercase tracking-wide font-semibold text-[#545b64]">
              Action
            </p>
            <p className="m-0 mt-1 text-[13px] text-[#16191f]">
              {isAll
                ? 'Queue checklist reminders for every incomplete company'
                : `Queue checklist reminders for ${selectedCount} selected companies`}
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="remind-confirm-input"
              className="block text-[13px] text-[#16191f]"
            >
              To confirm this operation, type{' '}
              <span className="font-mono font-semibold bg-[#f2f3f3] border border-[#d5dbdb] px-1.5 py-0.5 rounded-sm">
                {CONFIRM_PHRASE}
              </span>{' '}
              below.
            </label>
            <input
              id="remind-confirm-input"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              className={`w-full h-8 px-2 border rounded-sm text-[13px] font-mono bg-white outline-none focus:border-[#0972d3] focus:shadow-[0_0_0_1px_#0972d3] ${
                typed && !matches ? 'border-[#d91515]' : 'border-[#7d8998]'
              }`}
              placeholder={CONFIRM_PHRASE}
              autoFocus
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        <div className="px-5 py-3 border-t border-[#eaeDED] bg-[#fafafa] flex justify-end gap-2">
          <button
            type="button"
            className="h-8 px-4 text-[13px] font-bold rounded-sm border border-[#545b64] bg-white text-[#16191f] hover:bg-[#f2f3f3] cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="h-8 px-4 text-[13px] font-bold rounded-sm border border-transparent inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[#ec7211] hover:bg-[#eb5f07] text-white"
            disabled={!matches}
            onClick={onConfirm}
          >
            Checklist Remind
          </button>
        </div>
      </div>
    </div>
  );
}
