import { Loader2, CheckSquare, Square } from 'lucide-react';
import AttendeeTableRow from './AttendeeTableRow';

const AttendeeTable = ({
    attendees,
    loading,
    selectedEvent,
    searchType,
    selectionMode,
    selectedAttendeeUuids,
    isGlobalSelectionMode,
    allVisibleSelected,
    syncingScUuid,
    needsScSync,
    onToggleSelectAll,
    onToggleSelect,
    onOpenDetail,
    onSyncSc,
    onMatchmaking,
    onCreateEBadge,
}) => (
    <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    <th className="bg-bg-secondary py-3 px-4 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border w-12">
                        <button
                            type="button"
                            className="bg-transparent border-none p-0 text-text-secondary hover:text-accent transition-colors"
                            onClick={onToggleSelectAll}
                            aria-label={
                                selectionMode === 'selected' && allVisibleSelected
                                    ? 'Select all matching attendees'
                                    : allVisibleSelected
                                      ? 'Clear attendee selection'
                                      : 'Select visible attendees'
                            }
                        >
                            {allVisibleSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                    </th>
                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Name
                    </th>
                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Contact
                    </th>
                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Company
                    </th>
                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Type
                    </th>
                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Status
                    </th>
                    <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border text-right">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan="7" className="text-center p-12 text-text-secondary">
                            <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                        </td>
                    </tr>
                ) : attendees.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="text-center p-12 text-text-secondary">
                            No attendees found.
                        </td>
                    </tr>
                ) : (
                    attendees.map((attendee) => (
                        <AttendeeTableRow
                            key={attendee.uuid}
                            attendee={attendee}
                            selectedEvent={selectedEvent}
                            isCrossEvent={
                                searchType === 'global' &&
                                String(attendee.event_id) !== String(selectedEvent?.id)
                            }
                            isGlobalSelectionMode={isGlobalSelectionMode}
                            isSelected={
                                isGlobalSelectionMode ||
                                selectedAttendeeUuids.includes(attendee.uuid)
                            }
                            syncingScUuid={syncingScUuid}
                            needsScSync={needsScSync}
                            onToggleSelect={onToggleSelect}
                            onOpenDetail={onOpenDetail}
                            onSyncSc={onSyncSc}
                            onMatchmaking={onMatchmaking}
                            onCreateEBadge={onCreateEBadge}
                        />
                    ))
                )}
            </tbody>
        </table>
    </div>
);

export default AttendeeTable;
