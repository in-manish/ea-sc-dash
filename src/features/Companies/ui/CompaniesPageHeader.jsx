import { useState } from 'react';
import { Star, Upload } from 'lucide-react';
import CreateCompanyButton from './CreateCompanyButton';
import CompaniesReportsMenu from './CompaniesReportsMenu';
import ManageFeaturedCompaniesModal from './ManageFeaturedCompaniesModal';

export default function CompaniesPageHeader({
  activeTab,
  exhView,
  total,
  eventId,
  token,
  companies,
  selectedIds,
  parentExhibitorId,
  onUpload,
  onUpdated,
}) {
  const showListTotal = activeTab === 'exhibitors' && exhView === 'list';
  const [featuredModalOpen, setFeaturedModalOpen] = useState(false);

  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary m-0">Companies</h1>
        {showListTotal && (
          <p className="text-sm text-text-secondary mt-1">Total: {total} exhibitors</p>
        )}
      </div>

      {activeTab === 'exhibitors' && (
        <div className="flex gap-3 items-center flex-wrap justify-end">
          {eventId && <CreateCompanyButton eventId={eventId} />}
          <button type="button" className="btn btn-secondary" onClick={onUpload}>
            <Upload size={16} style={{ marginRight: '0.5rem' }} />
            Upload CSV
          </button>
          {eventId && (
            <button
              type="button"
              className="btn btn-secondary inline-flex items-center gap-1.5"
              onClick={() => setFeaturedModalOpen(true)}
            >
              <Star size={16} />
              Featured companies
            </button>
          )}
          {eventId && (
            <CompaniesReportsMenu
              eventId={eventId}
              token={token}
              companies={companies}
              selectedIds={selectedIds}
              parentExhibitorId={parentExhibitorId}
            />
          )}
        </div>
      )}

      {featuredModalOpen && eventId && (
        <ManageFeaturedCompaniesModal
          eventId={eventId}
          token={token}
          onSaved={() => {
            setFeaturedModalOpen(false);
            onUpdated?.();
          }}
          onCancel={() => setFeaturedModalOpen(false)}
        />
      )}
    </div>
  );
}
