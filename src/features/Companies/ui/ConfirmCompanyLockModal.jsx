import { useEffect, useState } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

/**
 * AWS console-style confirm for lock/unlock.
 * Type-to-confirm for multiple selected or all parents; single is a click confirm.
 */
export default function ConfirmCompanyLockModal({
  locked,
  all = false,
  parentCount = 0,
  skippedCount = 0,
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  const [typed, setTyped] = useState('');
  const verb = locked ? 'Lock' : 'Unlock';
  const phrase = locked ? 'lock' : 'unlock';
  const requireTyped = all || parentCount > 1;
  const matches = typed === phrase;
  const canSubmit = !loading && (all || parentCount >= 1) && (!requireTyped || matches);

  const title = all
    ? `${verb} all parent exhibitors`
    : `${verb} ${parentCount} selected parent exhibitor${parentCount === 1 ? '' : 's'}`;
  const impact = all
    ? 'every parent exhibitor for this event'
    : `${parentCount} selected parent exhibitor${parentCount === 1 ? '' : 's'}`;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel();
      if (e.key === 'Enter' && canSubmit) onConfirm();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [canSubmit, loading, onCancel, onConfirm]);

  return (
    <div
      className="fixed inset-0 z-[1300] flex items-center justify-center p-4 bg-black/50"
      onClick={loading ? undefined : onCancel}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-lock-title"
        className="bg-white border border-[#d5dbdb] rounded-sm shadow-[0_1px_4px_rgba(0,0,0,0.2)] w-full max-w-[520px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Header title={title} loading={loading} onCancel={onCancel} />
        <div className="px-5 py-4 space-y-4">
          <Warning locked={locked} impact={impact} />
          <div className="rounded-sm border border-[#d5dbdb] bg-[#fafafa] px-3 py-2.5">
            <p className="m-0 text-[11px] uppercase tracking-wide font-semibold text-[#545b64]">
              Action
            </p>
            <p className="m-0 mt-1 text-[13px] text-[#16191f]">
              {all
                ? `${verb} company submit for every parent exhibitor`
                : `${verb} company submit for ${parentCount} selected parent exhibitor${parentCount === 1 ? '' : 's'}`}
            </p>
          </div>
          {skippedCount > 0 && (
            <p className="m-0 text-[13px] text-[#545b64]">
              {skippedCount} selected co-exhibitor{skippedCount === 1 ? '' : 's'} will be skipped.
            </p>
          )}
          {requireTyped && (
            <TypeConfirm
              phrase={phrase}
              typed={typed}
              matches={matches}
              onChange={setTyped}
            />
          )}
          {error && (
            <p className="m-0 text-sm text-red-700 bg-red-50 border border-red-100 rounded-sm px-3 py-2">
              {error}
            </p>
          )}
        </div>
        <Footer
          verb={verb}
          loading={loading}
          canSubmit={canSubmit}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
}

function Header({ title, loading, onCancel }) {
  return (
    <div className="px-5 py-4 border-b border-[#eaeDED] flex justify-between items-center gap-3">
      <h3 id="company-lock-title" className="text-[16px] font-bold text-[#16191f] m-0 leading-snug">
        {title}
      </h3>
      <button
        type="button"
        onClick={onCancel}
        disabled={loading}
        className="text-[#545b64] hover:text-[#16191f] border-none bg-transparent cursor-pointer p-1 disabled:opacity-50"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
}

function Warning({ locked, impact }) {
  return (
    <div className="flex gap-3 rounded-sm border border-[#fae2b1] bg-[#fdf2d5] px-3 py-3">
      <AlertTriangle size={18} className="text-[#8d6600] shrink-0 mt-0.5" aria-hidden />
      <div className="min-w-0">
        <p className="m-0 text-[13px] font-bold text-[#16191f]">
          This action cannot be undone from this screen
        </p>
        <p className="m-0 mt-1 text-[13px] text-[#16191f] leading-snug">
          This {locked ? 'locks' : 'unlocks'} company submit for{' '}
          <strong>{impact}</strong>. Co-exhibitors are not included.
        </p>
      </div>
    </div>
  );
}

function TypeConfirm({ phrase, typed, matches, onChange }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor="company-lock-confirm-input" className="block text-[13px] text-[#16191f]">
        To confirm this operation, type{' '}
        <span className="font-mono font-semibold bg-[#f2f3f3] border border-[#d5dbdb] px-1.5 py-0.5 rounded-sm">
          {phrase}
        </span>{' '}
        below.
      </label>
      <input
        id="company-lock-confirm-input"
        type="text"
        value={typed}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full h-8 px-2 border rounded-sm text-[13px] font-mono bg-white outline-none focus:border-[#0972d3] focus:shadow-[0_0_0_1px_#0972d3] ${
          typed && !matches ? 'border-[#d91515]' : 'border-[#7d8998]'
        }`}
        placeholder={phrase}
        autoFocus
        autoComplete="off"
        spellCheck={false}
      />
    </div>
  );
}

function Footer({ verb, loading, canSubmit, onCancel, onConfirm }) {
  return (
    <div className="px-5 py-3 border-t border-[#eaeDED] bg-[#fafafa] flex justify-end gap-2">
      <button
        type="button"
        className="h-8 px-4 text-[13px] font-bold rounded-sm border border-[#545b64] bg-white text-[#16191f] hover:bg-[#f2f3f3] cursor-pointer disabled:opacity-50"
        onClick={onCancel}
        disabled={loading}
      >
        Cancel
      </button>
      <button
        type="button"
        className="h-8 px-4 text-[13px] font-bold rounded-sm border border-transparent inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-[#ec7211] hover:bg-[#eb5f07] text-white"
        disabled={!canSubmit}
        onClick={onConfirm}
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {verb}
      </button>
    </div>
  );
}
