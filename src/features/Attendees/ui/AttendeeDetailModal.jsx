import { X, HeartHandshake, IdCard, Loader2, RefreshCw } from 'lucide-react';
import { getGroupedFields, needsScSync } from '../domain/attendeeFieldGroups';

const AttendeeDetailModal = ({
    attendee,
    isMaximized,
    onToggleMaximize,
    onClose,
    scSyncSuccess,
    scSyncError,
    syncingScUuid,
    onSyncSc,
    onMatchmaking,
    onCreateEBadge,
}) => {
    if (!attendee) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-[1000] animate-fade-in"
            onClick={onClose}
        >
            <div
                className={`bg-bg-primary rounded-lg border border-border shadow-xl flex flex-col overflow-hidden transition-all duration-300 ease-out ${isMaximized ? 'w-[95vw] h-[95vh] max-w-[95vw] max-h-[95vh]' : 'w-[90%] max-w-[600px] max-h-[85vh]'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border flex justify-between items-start bg-bg-secondary">
                    <div>
                        <h2 className="text-xl font-bold text-text-primary mb-1">{attendee.name}</h2>
                        <span className="text-sm text-text-secondary">{attendee.company}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                            onClick={onToggleMaximize}
                            title={isMaximized ? 'Restore' : 'Maximize'}
                        >
                            <div
                                className={`w-[14px] h-[14px] rounded-[2px] border-[1.5px] border-current transition-all ${isMaximized ? 'border-t-[3px] border-b-transparent border-l-transparent border-r-transparent h-0 mt-1.5 rounded-none' : ''}`}
                            />
                        </button>
                        <button
                            className="bg-transparent border-none text-text-tertiary cursor-pointer p-1 rounded-sm flex items-center justify-center transition-colors hover:bg-bg-tertiary hover:text-text-primary"
                            onClick={onClose}
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {scSyncSuccess && (
                        <div className="bg-emerald-50 text-emerald-800 p-3 border border-emerald-200 rounded-md mb-4 text-sm">
                            {scSyncSuccess}
                        </div>
                    )}
                    {scSyncError && (
                        <div className="bg-red-50 text-red-800 p-3 border border-red-200 rounded-md mb-4 text-sm">
                            {scSyncError}
                        </div>
                    )}
                    {Object.entries(getGroupedFields(attendee)).map(([group, fields]) => (
                        <div key={group} className="mb-8 last:mb-0">
                            <h4 className="text-xs uppercase tracking-wider text-text-tertiary mb-4 font-bold border-b border-border pb-2">
                                {group}
                            </h4>
                            <div
                                className={`grid gap-y-4 gap-x-6 ${isMaximized ? 'grid-cols-[repeat(auto-fill,minmax(250px,1fr))]' : 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))]'}`}
                            >
                                {fields.map((field, idx) => (
                                    <div key={idx} className="flex flex-col gap-1">
                                        <label className="text-xs text-text-secondary font-medium">
                                            {field.label}
                                        </label>
                                        <div className="text-[0.925rem] text-text-primary break-words">
                                            {field.value !== null &&
                                            field.value !== undefined &&
                                            field.value !== ''
                                                ? field.value
                                                : '-'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-border flex flex-wrap justify-end gap-3 bg-bg-secondary">
                    <button className="btn btn-secondary" onClick={onClose}>
                        Close
                    </button>
                    <button
                        className="btn btn-secondary flex items-center gap-2"
                        onClick={() => onMatchmaking(attendee)}
                    >
                        <HeartHandshake size={16} />
                        View Matchmaking
                    </button>
                    {needsScSync(attendee) && (
                        <button
                            className="btn btn-secondary flex items-center gap-2"
                            onClick={() => onSyncSc(attendee)}
                            disabled={syncingScUuid === attendee.uuid}
                            title="Create/link SnapCard account for this badge"
                        >
                            {syncingScUuid === attendee.uuid ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <RefreshCw size={16} />
                            )}
                            Sync SC
                        </button>
                    )}
                    <button
                        className="btn btn-primary flex items-center gap-2"
                        onClick={() => onCreateEBadge(attendee.uuid)}
                    >
                        <IdCard size={16} />
                        Re-create E-badge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendeeDetailModal;
