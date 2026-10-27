import { useEffect, useRef, useState } from 'react';
import { Loader2, CheckSquare, Square, X } from 'lucide-react';
import usePermissionCodes from '../../ScanLocations/hooks/usePermissionCodes';
import { PERMISSION_ID_FILTER } from '../domain/attendeePermissionLink';
import { EXTRA_COLUMNS, columnTone, loadTableColumns, saveTableColumns } from '../domain/tableColumns';
import AttendeeColumnPicker from './AttendeeColumnPicker';
import AttendeeTableRow from './AttendeeTableRow';
import TableHeaderFilterDropdown from './TableHeaderFilterDropdown';

const DEFAULT_JUMPS = [
    { key: 'name', label: 'Name' },
    { key: 'contact', label: 'Contact' },
    { key: 'company', label: 'Company' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'attendee_type', label: 'Type' },
    { key: 'status', label: 'Status' },
];

const STATUS_OPTIONS = [
    { value: 'ONLINE', label: 'Online' },
    { value: 'PRE_REG', label: 'Pre-Registration' },
    { value: 'ON_SPOT', label: 'On Spot' },
];

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
    filters = {},
    updateFilter,
    attendeeTypes = [],
    attendeeTypesLoading = false,
    onToggleSelectAll,
    onToggleSelect,
    onOpenDetail,
    onSyncSc,
    onMatchmaking,
    onCreateEBadge,
    token,
}) => {
    const attendeeTypeOptions = attendeeTypes.map((t) => ({ value: t.name, label: t.name }));
    const permissionCodes = usePermissionCodes(selectedEvent?.id, token);
    const permissionOptions = permissionCodes.codes.map((code) => ({
        value: String(code.id),
        label: `${code.code} ${code.name}`.trim(),
    }));
    const rawPermissionIds = filters[PERMISSION_ID_FILTER];
    const selectedPermissionIds = (
        Array.isArray(rawPermissionIds) ? rawPermissionIds : rawPermissionIds ? [rawPermissionIds] : []
    ).map(String);
    const [extraKeys, setExtraKeys] = useState(loadTableColumns);
    const [activeKey, setActiveKey] = useState(null);
    const scrollerRef = useRef(null);
    const pendingScroll = useRef(null);
    const extraColumns = EXTRA_COLUMNS.filter((column) => extraKeys.includes(column.key));
    const columnCount = 8 + extraColumns.length;
    const pinIdentity = extraColumns.length > 0;
    const focusColumn = (key, align = 'center') => {
        pendingScroll.current = { key, align };
        setActiveKey(key);
    };
    const setColumns = (next) => {
        const added = next.find((key) => !extraKeys.includes(key));
        setExtraKeys(next);
        saveTableColumns(next);
        if (added) focusColumn(added);
        else if (activeKey && !next.includes(activeKey)) setActiveKey(null);
    };

    useEffect(() => {
        const pending = pendingScroll.current;
        if (!activeKey || !pending || pending.key !== activeKey) return undefined;
        pendingScroll.current = null;
        const header = scrollerRef.current?.querySelector(`[data-column="${activeKey}"]`);
        header?.scrollIntoView({ behavior: 'smooth', inline: pending.align, block: 'nearest' });
        return undefined;
    }, [activeKey, extraColumns.length]);

    return (
    <div>
    <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 overflow-x-auto">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary shrink-0">Go to</span>
                {DEFAULT_JUMPS.map((column) => (
                    <button
                        key={column.key}
                        type="button"
                        onClick={() => focusColumn(column.key, 'start')}
                        className={`shrink-0 px-2 py-1 rounded-md border text-xs font-medium bg-bg-primary text-text-secondary hover:text-text-primary ${
                            column.key === activeKey ? 'border-accent text-accent ring-2 ring-offset-1 ring-accent' : 'border-border'
                        }`}
                    >
                        {column.label}
                    </button>
                ))}
                {extraColumns.length > 0 && <span className="w-px h-4 bg-border shrink-0" />}
                {extraColumns.map((column, index) => {
                    const tone = columnTone(index);
                    const active = column.key === activeKey;
                    return (
                        <span
                            key={column.key}
                            className={`shrink-0 inline-flex items-center rounded-md border text-xs font-medium ${tone.chip} ${active ? 'ring-2 ring-offset-1 ring-accent' : ''}`}
                        >
                            <button
                                type="button"
                                onClick={() => focusColumn(column.key)}
                                className="inline-flex items-center gap-1.5 pl-2 pr-1 py-1 bg-transparent border-none text-inherit cursor-pointer"
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${tone.mark}`} />
                                {column.label}
                            </button>
                            <button
                                type="button"
                                aria-label={`Remove ${column.label} column`}
                                title={`Remove ${column.label}`}
                                onClick={() => setColumns(extraKeys.filter((key) => key !== column.key))}
                                className="inline-flex items-center justify-center mr-1 w-4 h-4 rounded-sm bg-transparent border-none text-inherit cursor-pointer opacity-70 hover:opacity-100"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    );
                })}
            </div>
            {extraColumns.length > 0 && (
                <button
                    type="button"
                    onClick={() => setColumns([])}
                    className="shrink-0 text-xs font-medium text-text-secondary bg-transparent border-none p-0 cursor-pointer hover:text-text-primary whitespace-nowrap"
                >
                    Clear all
                </button>
            )}
        </div>
        <AttendeeColumnPicker selected={extraKeys} onChange={setColumns} />
    </div>
    <div ref={scrollerRef} className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr>
                    <th className={`bg-bg-secondary py-3 px-4 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border w-12 ${pinIdentity ? 'sticky left-0 z-20' : ''}`}>
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
                    <th data-column="name" className={`bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border ${pinIdentity ? 'sticky left-12 z-20 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.12)]' : ''}`}>
                        Name
                    </th>
                    <th data-column="contact" className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Contact
                    </th>
                    <th data-column="company" className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        Company
                    </th>
                    <th data-column="permissions" className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        <TableHeaderFilterDropdown
                            label="Permissions"
                            options={permissionOptions}
                            selected={selectedPermissionIds}
                            onChange={(next) => updateFilter?.(PERMISSION_ID_FILTER, next)}
                            multiSelect
                            loading={permissionCodes.loading}
                        />
                    </th>
                    <th data-column="attendee_type" className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        <TableHeaderFilterDropdown
                            label="Attendee Type"
                            options={attendeeTypeOptions}
                            selected={filters.attendee_type || []}
                            onChange={(next) => updateFilter?.('attendee_type', next)}
                            multiSelect
                            loading={attendeeTypesLoading}
                        />
                    </th>
                    <th data-column="status" className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
                        <TableHeaderFilterDropdown
                            label="Status"
                            options={STATUS_OPTIONS}
                            selected={filters.reg_type ? [filters.reg_type] : []}
                            onChange={(next) => updateFilter?.('reg_type', next[0] || '')}
                            multiSelect={false}
                        />
                    </th>
                    {extraColumns.map((column, index) => {
                        const tone = columnTone(index);
                        const active = column.key === activeKey;
                        return (
                            <th
                                key={column.key}
                                data-column={column.key}
                                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider border-b border-border whitespace-nowrap border-l-4 ${tone.header} ${tone.edge} ${active ? 'ring-2 ring-inset ring-accent' : ''}`}
                            >
                                <span className={`mr-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${tone.mark}`} />
                                {column.label}
                            </th>
                        );
                    })}
                    <th className="bg-bg-secondary py-3 px-4 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border text-right w-14">
                        Actions
                    </th>
                </tr>
            </thead>
            <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={columnCount} className="text-center p-12 text-text-secondary">
                            <Loader2 className="animate-spin text-accent mx-auto" size={24} />
                        </td>
                    </tr>
                ) : attendees.length === 0 ? (
                    <tr>
                        <td colSpan={columnCount} className="text-center p-12 text-text-secondary">
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
                            extraColumns={extraColumns}
                            activeColumnKey={activeKey}
                            pinIdentity={pinIdentity}
                        />
                    ))
                )}
            </tbody>
        </table>
    </div>
    </div>
    );
};

export default AttendeeTable;
