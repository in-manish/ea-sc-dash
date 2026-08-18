import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Lock, Unlock } from 'lucide-react';

function MenuItem({ icon: Icon, label, hint, disabled, title, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className="w-full flex items-start gap-2.5 px-3 py-2 text-left text-sm rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-secondary disabled:hover:bg-transparent text-text-primary"
    >
      <Icon size={14} className="mt-0.5 shrink-0 text-text-secondary" />
      <span className="min-w-0">
        <span className="block font-medium leading-snug">{label}</span>
        {hint && (
          <span className="block mt-0.5 text-[11px] text-text-tertiary leading-snug">
            {hint}
          </span>
        )}
      </span>
    </button>
  );
}

/**
 * One Lock control for submit-lock: selected parents vs all parents.
 * Keeps the list bar from growing a button per variant.
 */
export default function ExhibitorLockMenu({
  disabled = false,
  disabledTitle,
  parentCount = 0,
  hasCoExhibitors = false,
  onLockSelected,
  onUnlockSelected,
  onLockAll,
  onUnlockAll,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const canLockSelected = parentCount >= 1 && !hasCoExhibitors;
  const selectedHint = hasCoExhibitors
    ? 'Deselect co-exhibitors. Lock applies to parent exhibitors only.'
    : canLockSelected
      ? `${parentCount} parent exhibitor${parentCount === 1 ? '' : 's'}`
      : 'Select parent exhibitors';
  const selectedTitle = hasCoExhibitors
    ? 'Lock is disabled while co-exhibitors are selected'
    : canLockSelected
      ? 'Lock or unlock submit for selected parents'
      : 'Select parent exhibitors to lock';

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const pick = (fn) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="btn btn-secondary btn-sm inline-flex items-center gap-1.5 disabled:opacity-50"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        title={disabledTitle || 'Lock or unlock parent exhibitors'}
      >
        <Lock size={14} />
        Lock parent exhibitors
        {canLockSelected && (
          <span className="min-w-[1.15rem] h-4 px-1 rounded-full bg-accent/10 text-accent text-[10px] font-semibold leading-4 text-center">
            {parentCount}
          </span>
        )}
        <ChevronDown
          size={14}
          className={`text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-1.5 left-0 w-[280px] bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
        >
          <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary m-0">
            Selected
          </p>
          <MenuItem
            icon={Lock}
            label="Lock submit"
            hint={selectedHint}
            disabled={!canLockSelected}
            title={selectedTitle}
            onClick={() => pick(onLockSelected)}
          />
          <MenuItem
            icon={Unlock}
            label="Unlock submit"
            hint={selectedHint}
            disabled={!canLockSelected}
            title={selectedTitle}
            onClick={() => pick(onUnlockSelected)}
          />

          <div className="my-1.5 mx-2 border-t border-border" />

          <p className="px-2.5 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary m-0">
            All parent exhibitors
          </p>
          <MenuItem
            icon={Lock}
            label="Lock all"
            hint="Every parent exhibitor in this event"
            title="Lock submit for every parent exhibitor"
            onClick={() => pick(onLockAll)}
          />
          <MenuItem
            icon={Unlock}
            label="Unlock all"
            hint="Every parent exhibitor in this event"
            title="Unlock submit for every parent exhibitor"
            onClick={() => pick(onUnlockAll)}
          />
        </div>
      )}
    </div>
  );
}
