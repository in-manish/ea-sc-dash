import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AdditionalRequirementsOrders from '../../../pages/AdditionalRequirementsOrders';
import ARManager from '../../../pages/ARManager';
import CompanyUploadModal from '../../../components/companies/CompanyUploadModal';
import CompanyUploadStatus from '../../../components/companies/CompanyUploadStatus';
import CompanyComprehensiveReportPanel from '../../../components/companies/CompanyComprehensiveReportPanel';
import useExhibitorList from '../hooks/useExhibitorList';
import { useExhibitorListSelection } from '../hooks/useExhibitorListSelection';
import ProductMatchmakingPanel from './ProductMatchmakingPanel';
import ChecklistReminderTab from './ChecklistReminderTab';
import ExhibitorsListPanel from './ExhibitorsListPanel';
import CompaniesPageHeader from './CompaniesPageHeader';
import CompaniesPageTabs from './CompaniesPageTabs';
import ExhibitorFilterDrawer from './ExhibitorFilterDrawer';

export default function CompaniesPage() {
  const { selectedEvent, token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'exhibitors';
  const arView = searchParams.get('ar_view') || 'orders';
  const exhView = searchParams.get('exh_view') || 'list';
  const crView = searchParams.get('cr_view') || 'list';
  const list = useExhibitorList({
    selectedEvent,
    token,
    searchParams,
    setSearchParams,
    activeTab,
  });
  const selection = useExhibitorListSelection(list.companies);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadRefreshKey, setUploadRefreshKey] = useState(0);

  const setParam = (mutate) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const handleExhViewChange = (viewName) => {
    setParam((params) => {
      if (viewName === 'list') params.delete('exh_view');
      else params.set('exh_view', viewName);
      if (viewName !== 'checklist_reminder') params.delete('cr_view');
    });
  };

  const handleTabChange = (tabName) => {
    setParam((params) => {
      params.set('tab', tabName);
      if (tabName !== 'additional_requirements') params.delete('ar_view');
      if (tabName !== 'exhibitors') {
        params.delete('exh_view');
        params.delete('cr_view');
      }
    });
  };

  useEffect(() => {
    if (searchParams.get('tab') !== 'company_products') return;
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'product_matchmaking');
    next.delete('prod_view');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (searchParams.get('tab') !== 'checklist_reminder') return;
    const next = new URLSearchParams(searchParams);
    next.set('tab', 'exhibitors');
    next.set('exh_view', 'checklist_reminder');
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const eventId = selectedEvent?.id;
  const showList = activeTab === 'exhibitors' && exhView === 'list' && eventId;

  return (
    <div className="w-full animate-fade-in">
      <CompaniesPageHeader
        activeTab={activeTab}
        exhView={exhView}
        total={list.total}
        eventId={eventId}
        token={token}
        companies={list.companies}
        selectedIds={selection.selectedIds}
        search={list.search}
        onSearchChange={list.setSearch}
        filters={list.filters}
        onClearFilters={() => list.setFilters({})}
        onOpenFilters={() => setIsFilterDrawerOpen(true)}
        onUpload={() => setIsUploadModalOpen(true)}
        sortBy={list.sortBy}
        sortOrder={list.sortOrder}
        onSortChange={list.setSort}
        overrideMessage={list.overrideMessage}
      />

      <CompaniesPageTabs
        activeTab={activeTab}
        exhView={exhView}
        arView={arView}
        onTabChange={handleTabChange}
        onExhViewChange={handleExhViewChange}
        onArViewChange={(viewName) => setParam((p) => p.set('ar_view', viewName))}
      />

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
          onViewChange={(viewName) =>
            setParam((p) => {
              if (viewName === 'list') p.delete('cr_view');
              else p.set('cr_view', viewName);
            })
          }
        />
      )}

      {activeTab === 'additional_requirements' && arView === 'orders' && eventId && (
        <AdditionalRequirementsOrders eventId={eventId} />
      )}

      {activeTab === 'additional_requirements' && arView === 'setup' && <ARManager eventId={eventId} />}

      {activeTab === 'product_matchmaking' && eventId && (
        <div className="bg-bg-primary border border-border rounded-lg p-6 shadow-sm animate-fade-in">
          <ProductMatchmakingPanel eventId={eventId} token={token} />
        </div>
      )}

      <ExhibitorFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={list.filters}
        setFilters={list.setFilters}
        onReset={() => list.setFilters({})}
        onPageReset={() => list.setPage(1)}
      />

      {isUploadModalOpen && eventId && (
        <CompanyUploadModal
          eventId={eventId}
          token={token}
          onClose={() => setIsUploadModalOpen(false)}
          onUploaded={() => {
            setUploadRefreshKey((k) => k + 1);
            handleExhViewChange('upload_status');
          }}
        />
      )}
    </div>
  );
}
