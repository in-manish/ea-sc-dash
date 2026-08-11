import AttendeeDetailModal from './AttendeeDetailModal';
import AttendeeFilterDrawer from './AttendeeFilterDrawer';
import WhatsAppSendModal from './WhatsAppSendModal';
import ScSyncErrorModal from './ScSyncErrorModal';
import EBadgeResultModal from './EBadgeResultModal';
import AttendeeMatchmakingAnswers from '../../Matchmaking/ui/AttendeeMatchmakingAnswers';
import CreateAttendeeModal from '../../../components/attendees/CreateAttendeeModal';

const AttendeesModals = ({
    list,
    filtersApi,
    searchApi,
    selection,
    whatsApp,
    eBadge,
    scSync,
    selectedEvent,
    token,
    previewAttendee,
    attendeeTypes = [],
    attendeeTypesLoading = false,
}) => (
    <>
        <AttendeeDetailModal
            attendee={list.selectedAttendee}
            isMaximized={list.isModalMaximized}
            onToggleMaximize={() => list.setIsModalMaximized((v) => !v)}
            onClose={() => {
                list.closeAttendeeDetail();
                scSync.clearScSyncMessages();
            }}
            scSyncSuccess={scSync.scSyncSuccess}
            scSyncError={scSync.scSyncError}
            syncingScUuid={scSync.syncingScUuid}
            onSyncSc={scSync.handleSyncWithSC}
            onMatchmaking={list.setMatchmakingAttendee}
            onCreateEBadge={eBadge.handleCreateEBadge}
        />

        <AttendeeFilterDrawer
            isOpen={filtersApi.isFilterDrawerOpen}
            onClose={() => filtersApi.setIsFilterDrawerOpen(false)}
            filters={filtersApi.filters}
            setFilters={filtersApi.setFilters}
            updateFilter={filtersApi.updateFilter}
            toggleAttendeeType={filtersApi.toggleAttendeeType}
            toggleBooleanFilter={filtersApi.toggleBooleanFilter}
            clearFilters={filtersApi.clearFilters}
            attendeeTypes={attendeeTypes}
            attendeeTypesLoading={attendeeTypesLoading}
        />

        <WhatsAppSendModal
            isOpen={whatsApp.isWhatsAppModalOpen}
            onClose={whatsApp.handleCloseWhatsAppModal}
            selectedCount={selection.selectedCount}
            selectionMode={selection.selectionMode}
            selectedAttendees={selection.selectedAttendees}
            templates={whatsApp.whatsAppTemplates}
            templatesLoading={whatsApp.whatsAppTemplatesLoading}
            templatesError={whatsApp.whatsAppTemplatesError}
            selectedTemplateId={whatsApp.selectedTemplateId}
            setSelectedTemplateId={whatsApp.setSelectedTemplateId}
            templateViewMode={whatsApp.templateViewMode}
            setTemplateViewMode={whatsApp.setTemplateViewMode}
            expandedTemplateId={whatsApp.expandedTemplateId}
            setExpandedTemplateId={whatsApp.setExpandedTemplateId}
            previewContentMode={whatsApp.previewContentMode}
            setPreviewContentMode={whatsApp.setPreviewContentMode}
            previewAttendee={previewAttendee}
            isSending={whatsApp.isSendingWhatsApp}
            onSend={whatsApp.handleSendWhatsApp}
        />

        <ScSyncErrorModal
            isOpen={scSync.isScSyncErrorModalOpen}
            error={scSync.scSyncError}
            onClose={scSync.closeScSyncErrorModal}
        />

        <EBadgeResultModal
            isOpen={eBadge.isEBadgeModalOpen}
            isGenerating={eBadge.isGeneratingEBadge}
            error={eBadge.eBadgeError}
            result={eBadge.eBadgeResult}
            onClose={() => eBadge.setIsEBadgeModalOpen(false)}
            onDismiss={eBadge.closeEBadgeModal}
        />

        {list.matchmakingAttendee && selectedEvent && (
            <AttendeeMatchmakingAnswers
                eventId={selectedEvent.id}
                badgeUid={list.matchmakingAttendee.uuid}
                attendeeName={list.matchmakingAttendee.name}
                token={token}
                onClose={() => list.setMatchmakingAttendee(null)}
            />
        )}

        {list.isCreateModalOpen && selectedEvent && (
            <CreateAttendeeModal
                eventId={selectedEvent.id}
                token={token}
                initialValues={list.createPrefill}
                onClose={() => {
                    list.setIsCreateModalOpen(false);
                    list.setCreatePrefill(null);
                }}
                onCreated={() => {
                    list.handleCreated();
                    searchApi.setSearch('');
                    filtersApi.clearFilters();
                }}
            />
        )}
    </>
);

export default AttendeesModals;
