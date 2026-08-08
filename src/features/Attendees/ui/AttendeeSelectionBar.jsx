import { MessageCircle, IdCard } from 'lucide-react';

const AttendeeSelectionBar = ({
    selectionMode,
    selectedAttendeeUuids,
    total,
    allVisibleSelected,
    hasActiveSearchOrFilters,
    onClearSelection,
    onSelectAllMatching,
    onOpenWhatsApp,
    onCreateEBadge,
}) => {
    if (selectionMode === 'none') return null;

    return (
        <div className="mb-6 bg-bg-primary border border-border rounded-lg px-5 py-6 shadow-sm animate-fade-in">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="text-text-primary">
                    <span className="text-sm font-semibold">
                        {selectionMode === 'selected'
                            ? `${selectedAttendeeUuids.length} attendee${selectedAttendeeUuids.length === 1 ? '' : 's'} selected on this page.`
                            : selectionMode === 'filtered'
                              ? `All ${total} attendees matching this search are selected.`
                              : `All ${total} attendees are selected.`}
                    </span>
                    {selectionMode === 'selected' && allVisibleSelected && (
                        <>
                            {' '}
                            <button
                                type="button"
                                className="bg-transparent border-none p-0 text-sm font-semibold text-text-primary underline underline-offset-2 cursor-pointer hover:text-accent"
                                onClick={onSelectAllMatching}
                            >
                                {hasActiveSearchOrFilters
                                    ? 'Select all attendees that match this search'
                                    : `Select all ${total} attendees`}
                            </button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button className="btn btn-secondary" onClick={onClearSelection}>
                        Clear Selection
                    </button>
                    <button className="btn btn-primary" onClick={onOpenWhatsApp}>
                        <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
                        WhatsApp
                    </button>
                    <button
                        className="btn btn-primary flex items-center"
                        onClick={() => onCreateEBadge()}
                    >
                        <IdCard size={16} style={{ marginRight: '0.5rem' }} />
                        Create E-badge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendeeSelectionBar;
