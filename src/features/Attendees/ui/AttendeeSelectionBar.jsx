import { MessageCircle, IdCard, Mail, Trash2 } from 'lucide-react';
import {
    singleSelectedPocAttendee,
    singleSelectedChangePocCandidate,
} from '../domain/exhibitorPoc';
import { exhibitorPasswordResetPayload } from '../../Companies/domain/exhibitorPasswordResetPayload';
import ExhibitorPasswordResetControl from '../../Companies/ui/ExhibitorPasswordResetControl';
import ChangeExhibitorPocControl from './ChangeExhibitorPocControl';
import ScInviteControl from './ScInviteControl';
import AttendeeExportControl from './AttendeeExportControl';
import MeetingReportControl from './MeetingReportControl';
import AttendeeSelectionSummary from './AttendeeSelectionSummary';
import AttendeeSelectionMoreMenu from './AttendeeSelectionMoreMenu';

const Divider = () => <span className="hidden md:block w-px h-6 bg-border mx-1" aria-hidden="true" />;

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
    onCheckActiveBadge,
    onSetActiveBadge,
    onDelete,
    canDelete = false,
    activeBadgeBusy = false,
    canSetActiveBadge = true,
    canUseActiveBadgeSelection = true,
    eventId,
    token,
    onPocChanged,
    searchContext,
    onScInviteSent,
}) => {
    if (selectionMode === 'none') return null;

    const pocAttendee = singleSelectedPocAttendee(selectedAttendees, selectionMode);
    const changePocCandidate = singleSelectedChangePocCandidate(selectedAttendees, selectionMode);
    const selectedCount = selectionMode === 'selected' ? selectedAttendeeUuids.length : total;
    const hasSession = Boolean(eventId && token);

    return (
        <div className="mb-6 bg-bg-primary border border-border rounded-lg px-4 py-3 shadow-sm animate-fade-in">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <AttendeeSelectionSummary
                    selectionMode={selectionMode}
                    selectedCount={selectedCount}
                    total={total}
                    allVisibleSelected={allVisibleSelected}
                    hasActiveSearchOrFilters={hasActiveSearchOrFilters}
                    onClearSelection={onClearSelection}
                    onSelectAllMatching={onSelectAllMatching}
                />

                <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <button type="button" className="btn btn-primary gap-2" onClick={onOpenEmail}>
                        <Mail size={16} />
                        Email
                    </button>
                    <button type="button" className="btn btn-primary gap-2" onClick={onOpenWhatsApp}>
                        <MessageCircle size={16} />
                        WhatsApp
                    </button>

                    <Divider />

                    {hasSession && (
                        <AttendeeExportControl
                            eventId={eventId}
                            token={token}
                            selection={{
                                selectionMode,
                                selectedAttendeeUuids,
                                ...searchContext,
                                total,
                                hasActiveSearchOrFilters,
                            }}
                        />
                    )}
                    {hasSession && (
                        <MeetingReportControl
                            eventId={eventId}
                            token={token}
                            selection={{ selectionMode, selectedAttendees, total }}
                        />
                    )}
                    {hasSession && (
                        <ScInviteControl
                            eventId={eventId}
                            token={token}
                            selection={{ selectionMode, selectedAttendeeUuids, ...searchContext }}
                            count={selectedCount}
                            onSent={onScInviteSent}
                        />
                    )}
                    <button type="button" className="btn btn-secondary gap-2" onClick={() => onCreateEBadge()}>
                        <IdCard size={16} />
                        Create E-badge
                    </button>
                    {changePocCandidate && hasSession && (
                        <ChangeExhibitorPocControl
                            eventId={eventId}
                            token={token}
                            attendee={changePocCandidate}
                            onChanged={onPocChanged}
                        />
                    )}
                    {pocAttendee && hasSession && (
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
                    <AttendeeSelectionMoreMenu
                        onCheckActiveBadge={onCheckActiveBadge}
                        onSetActiveBadge={onSetActiveBadge}
                        busy={activeBadgeBusy}
                        canUseSelection={canUseActiveBadgeSelection}
                        canSet={canSetActiveBadge}
                    />

                    {onDelete && (
                        <>
                            <Divider />
                            <button
                                type="button"
                                className="btn gap-2 border-status-danger text-status-danger bg-bg-primary hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-bg-primary"
                                onClick={onDelete}
                                disabled={!canDelete}
                                aria-label="Delete selected attendees"
                                title={
                                    canDelete
                                        ? 'Delete the selected attendees'
                                        : 'Delete works on rows selected on this page only'
                                }
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AttendeeSelectionBar;
