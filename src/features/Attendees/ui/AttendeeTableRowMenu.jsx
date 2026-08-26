import { useEffect, useRef, useState } from 'react';
import {
  HeartHandshake,
  IdCard,
  Loader2,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';

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

/** Per-row overflow menu for matchmaking, e-badge, and optional SC sync. */
export default function AttendeeTableRowMenu({
  attendee,
  syncing,
  showSyncSc,
  onSyncSc,
  onMatchmaking,
  onCreateEBadge,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

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
    <div className="relative inline-flex" ref={rootRef}>
      <button
        type="button"
        className="p-1.5 rounded-md text-text-tertiary hover:text-text-primary hover:bg-bg-secondary border-none bg-transparent cursor-pointer"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Attendee actions"
        aria-busy={syncing}
        disabled={syncing}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        {syncing ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <MoreHorizontal size={16} />
        )}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute z-30 mt-1 right-0 w-[220px] bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <Item
            icon={HeartHandshake}
            label="Matchmaking"
            title="View Matchmaking Answers"
            onClick={() => pick(() => onMatchmaking(attendee))}
          />
          <Item
            icon={IdCard}
            label="Re-create E-badge"
            title="Re-create E-badge"
            onClick={() => pick(() => onCreateEBadge(attendee.uuid))}
          />
          {showSyncSc ? (
            <>
              <div className="my-1 mx-2 border-t border-border" />
              <Item
                icon={RefreshCw}
                label="Sync SC"
                title="Sync badge with SnapCard"
                disabled={syncing}
                onClick={() => pick(() => onSyncSc(attendee))}
              />
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
