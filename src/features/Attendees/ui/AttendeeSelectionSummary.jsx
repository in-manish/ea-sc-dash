import { X } from 'lucide-react';

/** Left side of the selection bar: what is selected, the select-all-matching link, and Clear. */
export default function AttendeeSelectionSummary({
    selectionMode,
    selectedCount,
    total,
    allVisibleSelected,
    hasActiveSearchOrFilters,
    onClearSelection,
    onSelectAllMatching,
}) {
    const isGlobal = selectionMode !== 'selected';
    const headline = isGlobal ? `All ${total}` : `${selectedCount}`;
    const scope = isGlobal
        ? hasActiveSearchOrFilters || selectionMode === 'filtered'
            ? 'matching this search'
            : 'attendees'
        : 'on this page';

    return (
        <div className="flex items-center gap-3 min-w-0">
            <span className="inline-flex items-center justify-center min-w-8 h-8 px-2.5 rounded-full bg-accent text-accent-text text-sm font-bold">
                {headline}
            </span>
            <div className="leading-tight">
                <div className="text-sm font-semibold text-text-primary">selected</div>
                <div className="text-xs text-text-secondary">
                    {scope}
                    {selectionMode === 'selected' && allVisibleSelected && (
                        <>
                            {' · '}
                            <button
                                type="button"
                                className="bg-transparent border-none p-0 text-xs font-semibold text-accent underline underline-offset-2 cursor-pointer hover:text-accent-hover"
                                onClick={onSelectAllMatching}
                            >
                                {hasActiveSearchOrFilters ? `Select all ${total} matching` : `Select all ${total}`}
                            </button>
                        </>
                    )}
                </div>
            </div>
            <button
                type="button"
                className="btn btn-ghost gap-1 !px-2 !py-1 text-xs"
                onClick={onClearSelection}
                title="Clear selection"
            >
                <X size={14} />
                Clear
            </button>
        </div>
    );
}
