import { MessageCircle, IdCard, Mail } from 'lucide-react';
import { singleSelectedPocAttendee } from '../domain/exhibitorPoc';
import { exhibitorPasswordResetPayload } from '../../Companies/domain/exhibitorPasswordResetPayload';
import ExhibitorPasswordResetControl from '../../Companies/ui/ExhibitorPasswordResetControl';

const AttendeeSelectionBar = ({
    selectionMode,
    selectedAttendeeUuids,
    selectedAttendees = [],
    total,
    allVisibleSelected,
    hasActiveSearchOrFilters,
    onClearSelection,
    onSelectAllMatching,
    onOpenWhatsApp,
    onOpenEmail,
    onCreateEBadge,
    eventId,
    token,
}) => {
    if (selectionMode === 'none') return null;

    const pocAttendee = singleSelectedPocAttendee(
        selectedAttendees,
        selectionMode,
    );

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

                <div className="flex flex-wrap items-center justify-end gap-3">
                    <button className="btn btn-secondary" onClick={onClearSelection}>
                        Clear Selection
                    </button>
                    <button className="btn btn-primary" onClick={onOpenWhatsApp}>
                        <MessageCircle size={16} style={{ marginRight: '0.5rem' }} />
                        WhatsApp
                    </button>
                    <button className="btn btn-primary" onClick={onOpenEmail}>
                        <Mail size={16} style={{ marginRight: '0.5rem' }} />
                        Email
                    </button>
                    <button
                        className="btn btn-primary flex items-center"
                        onClick={() => onCreateEBadge()}
                    >
                        <IdCard size={16} style={{ marginRight: '0.5rem' }} />
                        Create E-badge
                    </button>
                    {pocAttendee && eventId && token && (
                        <ExhibitorPasswordResetControl
                            eventId={eventId}
                            token={token}
                            payload={exhibitorPasswordResetPayload({
                                badgeId: pocAttendee.id,
                                companyId: pocAttendee.exhibitor_id,
                            })}
                            label="Reset exhibitor portal password"
                            title="Reset exhibitor portal password"
                            description="Resets the exhibitor portal password for this POC."
                            buttonClassName="btn btn-secondary flex items-center gap-2"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendeeSelectionBar;
