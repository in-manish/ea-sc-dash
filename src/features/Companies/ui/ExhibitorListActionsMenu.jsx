import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, KeyRound, Lock, Star, Unlock } from 'lucide-react';

function Item({ icon: Icon, label, hint, disabled, title, danger, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={`w-full flex items-start gap-2.5 px-3 py-2 text-left text-sm rounded-md transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-bg-secondary disabled:hover:bg-transparent ${
        danger ? 'text-danger' : 'text-text-primary'
      }`}
    >
      <Icon size={14} className="mt-0.5 shrink-0 text-text-secondary" />
      <span className="min-w-0">
        <span className="block font-medium leading-snug">{label}</span>
        {hint ? (
          <span className="block mt-0.5 text-[11px] text-text-tertiary leading-snug">
            {hint}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function Section({ title, children }) {
  return (
    <>
      <p className="px-2.5 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-text-tertiary m-0">
        {title}
      </p>
      {children}
    </>
  );
}

/**
 * Operational Actions menu: page-level + selection-dependent exhibitor ops.
 */
export default function ExhibitorListActionsMenu({
  selectedCount,
  canRemindSelected,
  canResetPassword,
  canLockSelected,
  coExhibitorTitle,
  reminding,
  submitting,
  onRemindAll,
  onRemindSelected,
  onResetPassword,
  onLockSelected,
  onFeature,
  onLockAll,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const busy = reminding || submitting;
  const selectedHint = coExhibitorTitle
    || (canLockSelected
      ? 'Selected parent exhibitors only'
      : 'Select parent exhibitors');

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

  const pick = (fn) => {
    setOpen(false);
    fn?.();
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="btn btn-secondary btn-sm inline-flex items-center gap-1.5"
        aria-haspopup="menu"
        aria-expanded={open}
        disabled={busy}
        onClick={() => setOpen((v) => !v)}
      >
        Actions
        <ChevronDown
          size={14}
          className={`text-text-tertiary transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-1.5 right-0 w-[280px] bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
        >
          <Section title="Checklist">
            <Item
              icon={Bell}
              label="Remind all incomplete"
              hint="Every incomplete company in this event"
              danger
              onClick={() => pick(onRemindAll)}
            />
            <Item
              icon={Bell}
              label={`Remind selected (${selectedCount})`}
              hint={canRemindSelected ? 'Selected companies only' : 'Select at least one company'}
              disabled={!canRemindSelected}
              onClick={() => pick(onRemindSelected)}
            />
          </Section>
          <div className="my-1.5 mx-2 border-t border-border" />
          <Section title="Selected">
            <Item
              icon={KeyRound}
              label="Reset exhibitor POC password"
              hint={canResetPassword ? 'Selected exhibitor only' : 'Select a single exhibitor'}
              disabled={!canResetPassword}
              onClick={() => pick(onResetPassword)}
            />
            <Item
              icon={Lock}
              label="Lock parent exhibitors"
              hint={selectedHint}
              disabled={!canLockSelected}
              title={coExhibitorTitle}
              onClick={() => pick(() => onLockSelected(true))}
            />
            <Item
              icon={Unlock}
              label="Unlock parent exhibitors"
              hint={selectedHint}
              disabled={!canLockSelected}
              title={coExhibitorTitle}
              onClick={() => pick(() => onLockSelected(false))}
            />
            <Item
              icon={Star}
              label="Feature / rank"
              hint={canLockSelected ? selectedHint : 'Select parent exhibitors'}
              disabled={!canLockSelected}
              title={coExhibitorTitle}
              onClick={() => pick(onFeature)}
            />
          </Section>
          <div className="my-1.5 mx-2 border-t border-border" />
          <Section title="All parent exhibitors">
            <Item
              icon={Lock}
              label="Lock all"
              hint="Every parent exhibitor in this event"
              danger
              onClick={() => pick(() => onLockAll(true))}
            />
            <Item
              icon={Unlock}
              label="Unlock all"
              hint="Every parent exhibitor in this event"
              onClick={() => pick(() => onLockAll(false))}
            />
          </Section>
        </div>
      )}
    </div>
  );
}
