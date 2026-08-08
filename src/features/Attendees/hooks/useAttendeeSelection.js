import { useState } from 'react';

export default function useAttendeeSelection({
    attendees,
    total,
    hasActiveSearchOrFilters,
    clearActionMessages,
}) {
    const [selectionMode, setSelectionMode] = useState('none');
    const [selectedAttendeeUuids, setSelectedAttendeeUuids] = useState([]);

    const selectedAttendees = attendees.filter((attendee) =>
        selectedAttendeeUuids.includes(attendee.uuid)
    );
    const isGlobalSelectionMode = selectionMode === 'all' || selectionMode === 'filtered';
    const allVisibleSelected =
        isGlobalSelectionMode ||
        (attendees.length > 0 &&
            attendees.every((attendee) => selectedAttendeeUuids.includes(attendee.uuid)));
    const selectedCount =
        selectionMode === 'selected'
            ? selectedAttendeeUuids.length
            : isGlobalSelectionMode
              ? total
              : 0;

    const clearSelection = () => {
        clearActionMessages?.();
        setSelectionMode('none');
        setSelectedAttendeeUuids([]);
    };

    const toggleAttendeeSelection = (attendeeUuid) => {
        if (isGlobalSelectionMode) return;

        clearActionMessages?.();

        setSelectedAttendeeUuids((prev) => {
            const next = prev.includes(attendeeUuid)
                ? prev.filter((uuid) => uuid !== attendeeUuid)
                : [...prev, attendeeUuid];

            setSelectionMode(next.length > 0 ? 'selected' : 'none');
            return next;
        });
    };

    const selectAllMatchingAttendees = () => {
        clearActionMessages?.();
        setSelectedAttendeeUuids([]);
        setSelectionMode(hasActiveSearchOrFilters ? 'filtered' : 'all');
    };

    const toggleSelectAll = () => {
        if (selectionMode === 'selected' && allVisibleSelected) {
            selectAllMatchingAttendees();
            return;
        }

        if (isGlobalSelectionMode || allVisibleSelected) {
            clearSelection();
            return;
        }

        clearActionMessages?.();
        setSelectionMode('selected');
        setSelectedAttendeeUuids(attendees.map((attendee) => attendee.uuid));
    };

    return {
        selectionMode,
        selectedAttendeeUuids,
        selectedAttendees,
        isGlobalSelectionMode,
        allVisibleSelected,
        selectedCount,
        toggleAttendeeSelection,
        clearSelection,
        selectAllMatchingAttendees,
        toggleSelectAll,
    };
}
