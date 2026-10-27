import { useEffect, useRef, useState } from 'react';
import { BadgeCheck, BadgePlus, MoreHorizontal } from 'lucide-react';

function Item({ icon, label, hint, disabled, title, onClick }) {
    return (
        <button
            type="button"
            role="menuitem"
            disabled={disabled}
            title={title}
            onClick={onClick}
            className="w-full flex items-start gap-2.5 px-3 py-2 text-left rounded-md text-text-primary hover:bg-bg-secondary disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
            <span className="mt-0.5 shrink-0 text-text-secondary">{icon}</span>
            <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-text-secondary">{hint}</span>
            </span>
        </button>
    );
}

/** "More" overflow menu for the rarely used active-badge actions on the selection. */
export default function AttendeeSelectionMoreMenu({
    onCheckActiveBadge,
    onSetActiveBadge,
    busy,
    canUseSelection,
    canSet,
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

    if (!onCheckActiveBadge && !onSetActiveBadge) return null;

    const pick = (fn) => {
        setOpen(false);
        fn?.();
    };
    const needsPageRows = 'Use the active badge tools above for the whole event, or select rows on this page.';

    return (
        <div className="relative inline-flex" ref={rootRef}>
            <button
                type="button"
                className="btn btn-secondary gap-2"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                <MoreHorizontal size={16} />
                More
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute z-30 top-full mt-1 right-0 w-72 bg-bg-primary border border-border rounded-lg shadow-lg p-1.5 animate-fade-in"
                >
                    <div className="px-3 pt-1.5 pb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                        Active badge
                    </div>
                    {onCheckActiveBadge && (
                        <Item
                            icon={<BadgeCheck size={16} />}
                            label="Check status"
                            hint="See which selected attendees have an active badge"
                            disabled={busy || !canUseSelection}
                            title={canUseSelection ? 'Check active badge status for selected attendees' : needsPageRows}
                            onClick={() => pick(onCheckActiveBadge)}
                        />
                    )}
                    {onSetActiveBadge && (
                        <Item
                            icon={<BadgePlus size={16} />}
                            label="Set active badge"
                            hint="Create active badges for eligible selected attendees"
                            disabled={busy || !canSet}
                            title={
                                !canUseSelection
                                    ? needsPageRows
                                    : !canSet
                                      ? 'Selected badges already have an active badge'
                                      : 'Create active badges for eligible selected attendees'
                            }
                            onClick={() => pick(onSetActiveBadge)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
