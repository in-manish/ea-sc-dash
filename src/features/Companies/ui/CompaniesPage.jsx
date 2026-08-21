import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import CompanyUploadModal from '../../../components/companies/CompanyUploadModal';
import useExhibitorList from '../hooks/useExhibitorList';
import { useExhibitorListSelection } from '../hooks/useExhibitorListSelection';
import CompaniesPageHeader from './CompaniesPageHeader';
import CompaniesPageTabs from './CompaniesPageTabs';
import CompaniesPagePanels from './CompaniesPagePanels';
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

      <CompaniesPagePanels
        activeTab={activeTab}
        exhView={exhView}
        arView={arView}
        crView={crView}
        eventId={eventId}
        token={token}
        list={list}
        selection={selection}
        uploadRefreshKey={uploadRefreshKey}
        onCrViewChange={(viewName) =>
          setParam((p) => {
            if (viewName === 'list') p.delete('cr_view');
            else p.set('cr_view', viewName);
          })
        }
      />

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
