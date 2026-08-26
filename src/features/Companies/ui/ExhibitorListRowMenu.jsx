import { useEffect, useRef, useState } from 'react';
import { MoreHorizontal, Pencil, Eye, KeyRound, Lock, Star, Unlock } from 'lucide-react';

function Item({ icon: Icon, label, disabled, title, onClick }) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      title={title}
      onClick={onClick}
      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm rounded-md text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
    >
      <Icon size={14} className="shrink-0 text-text-secondary" />
      {label}
    </button>
  );
}

/**
 * Per-row overflow menu. Navigation + high-impact ops (confirmed by the host).
 */
export default function ExhibitorListRowMenu({
  isParent,
  locked,
  onView,
  onEdit,
  onReset,
  onToggleLock,
  onFeature,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const parentOnly = 'Applies to parent exhibitors only';

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
        className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-secondary border-none bg-transparent cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Company actions"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <MoreHorizontal size={16} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-1 right-0 w-[220px] bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <Item icon={Eye} label="View company" onClick={() => pick(onView)} />
          <Item icon={Pencil} label="Edit company" onClick={() => pick(onEdit)} />
          <Item icon={KeyRound} label="Reset POC password" onClick={() => pick(onReset)} />
          <div className="my-1 mx-2 border-t border-border" />
          <Item
            icon={locked ? Unlock : Lock}
            label={locked ? 'Unlock submit' : 'Lock parent exhibitor'}
            disabled={!isParent}
            title={isParent ? undefined : parentOnly}
            onClick={() => pick(onToggleLock)}
          />
          <Item
            icon={Star}
            label="Feature / rank"
            disabled={!isParent}
            title={isParent ? undefined : parentOnly}
            onClick={() => pick(onFeature)}
          />
        </div>
      )}
    </div>
  );
}
