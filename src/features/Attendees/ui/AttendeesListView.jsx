import AttendeeSearchToolbar from './AttendeeSearchToolbar';
import ActiveFilterPills from './ActiveFilterPills';
import AttendeeStatusBanners from './AttendeeStatusBanners';
import AttendeeSelectionBar from './AttendeeSelectionBar';
import AttendeeTable from './AttendeeTable';
import ListPagination from './ListPagination';
import AttendeesReportPanel from './AttendeesReportPanel';

const AttendeesListView = ({
    page,
    setPage,
    searchApi,
    filtersApi,
    list,
    selection,
    whatsApp,
    eBadge,
    scSync,
    selectedEvent,
    token,
    hasActiveSearchOrFilters,
}) => (
    <>
        {selectedEvent?.id && token && (
            <AttendeesReportPanel
                eventId={selectedEvent.id}
                token={token}
                filters={filtersApi.filters}
            />
        )}

        <AttendeeSearchToolbar
            search={searchApi.search}
            onSearchChange={searchApi.setSearch}
            searchType={searchApi.searchType}
            isSearchTypeOpen={searchApi.isSearchTypeOpen}
            setIsSearchTypeOpen={searchApi.setIsSearchTypeOpen}
            searchTypeRef={searchApi.searchTypeRef}
            onSelectSearchType={searchApi.selectSearchType}
            filters={filtersApi.filters}
            onOpenFilters={() => filtersApi.setIsFilterDrawerOpen(true)}
            onClearAll={() => {
                filtersApi.clearFilters();
                searchApi.clearSearch();
            }}
        />

        <ActiveFilterPills
            filters={filtersApi.filters}
            onRemoveFilter={filtersApi.removeFilter}
        />

        <AttendeeStatusBanners
            error={list.error}
            whatsAppActionSuccess={whatsApp.whatsAppActionSuccess}
            whatsAppActionError={whatsApp.whatsAppActionError}
            selectedAttendee={list.selectedAttendee}
            scSyncSuccess={scSync.scSyncSuccess}
            scSyncError={scSync.scSyncError}
        />

        <AttendeeSelectionBar
            selectionMode={selection.selectionMode}
            selectedAttendeeUuids={selection.selectedAttendeeUuids}
            selectedAttendees={selection.selectedAttendees}
            total={list.total}
            allVisibleSelected={selection.allVisibleSelected}
            hasActiveSearchOrFilters={hasActiveSearchOrFilters}
            onClearSelection={selection.clearSelection}
            onSelectAllMatching={selection.selectAllMatchingAttendees}
            onOpenWhatsApp={whatsApp.handleOpenWhatsAppModal}
            onCreateEBadge={eBadge.handleCreateEBadge}
            eventId={selectedEvent?.id}
            token={token}
        />

        <AttendeeTable
            attendees={list.attendees}
            loading={list.loading}
            selectedEvent={selectedEvent}
            searchType={searchApi.searchType}
            selectionMode={selection.selectionMode}
            selectedAttendeeUuids={selection.selectedAttendeeUuids}
            isGlobalSelectionMode={selection.isGlobalSelectionMode}
            allVisibleSelected={selection.allVisibleSelected}
            syncingScUuid={scSync.syncingScUuid}
            needsScSync={scSync.needsScSync}
            onToggleSelectAll={selection.toggleSelectAll}
            onToggleSelect={selection.toggleAttendeeSelection}
            onOpenDetail={(attendee) => {
                scSync.clearScSyncMessages();
                list.openAttendeeDetail(attendee);
            }}
            onSyncSc={scSync.handleSyncWithSC}
            onMatchmaking={list.setMatchmakingAttendee}
            onCreateEBadge={eBadge.handleCreateEBadge}
        />

        <ListPagination
            page={page}
            loading={list.loading}
            hasNext={list.attendees.length >= 50}
            onPrev={() => setPage(page - 1)}
            onNext={() => setPage(page + 1)}
        />
    </>
);

export default AttendeesListView;
