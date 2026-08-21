import AdditionalRequirementsOrders from '../../../pages/AdditionalRequirementsOrders';
import ARManager from '../../../pages/ARManager';
import CompanyUploadStatus from '../../../components/companies/CompanyUploadStatus';
import CompanyComprehensiveReportPanel from '../../../components/companies/CompanyComprehensiveReportPanel';
import ProductMatchmakingPanel from './ProductMatchmakingPanel';
import ChecklistReminderTab from './ChecklistReminderTab';
import ExhibitorsListPanel from './ExhibitorsListPanel';
import ExhibitorEngagementTab from './ExhibitorEngagementTab';

export default function CompaniesPagePanels({
  activeTab,
  exhView,
  arView,
  crView,
  eventId,
  token,
  list,
  selection,
  uploadRefreshKey,
  onCrViewChange,
}) {
  const showList = activeTab === 'exhibitors' && exhView === 'list' && eventId;

  return (
    <>
      {showList && (
        <CompanyComprehensiveReportPanel
          eventId={eventId}
          token={token}
          parentExhibitorId={list.filters.parent_exhibitor_id || ''}
        />
      )}

      {activeTab === 'exhibitors' && exhView === 'upload_status' && eventId && (
        <CompanyUploadStatus eventId={eventId} token={token} refreshKey={uploadRefreshKey} />
      )}

      {showList && (
        <ExhibitorsListPanel
          eventId={eventId}
          token={token}
          companies={list.companies}
          loading={list.loading}
          error={list.error}
          page={list.page}
          onPageChange={list.setPage}
          onUpdated={list.refresh}
          sortBy={list.sortBy}
          sortOrder={list.sortOrder}
          onSortChange={list.setSort}
          overrideMessage={list.overrideMessage}
          selectedIds={selection.selectedIds}
          allPageSelected={selection.allPageSelected}
          somePageSelected={selection.somePageSelected}
          toggle={selection.toggle}
          togglePage={selection.togglePage}
          clear={selection.clear}
        />
      )}

      {activeTab === 'exhibitors' && exhView === 'checklist_reminder' && eventId && (
        <ChecklistReminderTab
          eventId={eventId}
          token={token}
          view={crView}
          onViewChange={onCrViewChange}
        />
      )}

      {activeTab === 'additional_requirements' && arView === 'orders' && eventId && (
        <AdditionalRequirementsOrders eventId={eventId} />
      )}

      {activeTab === 'additional_requirements' && arView === 'setup' && (
        <ARManager eventId={eventId} />
      )}

      {activeTab === 'product_matchmaking' && eventId && (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm animate-fade-in">
          <ProductMatchmakingPanel eventId={eventId} token={token} />
        </div>
      )}

      {activeTab === 'exhibitor_engagement' && eventId && (
        <ExhibitorEngagementTab eventId={eventId} token={token} />
      )}
    </>
  );
}
