import { Search, Filter, Upload } from 'lucide-react';
import CreateCompanyButton from './CreateCompanyButton';
import ExhibitorListSortControls from './ExhibitorListSortControls';

export default function CompaniesPageHeader({
  activeTab,
  exhView,
  total,
  eventId,
  search,
  onSearchChange,
  filters,
  onClearFilters,
  onOpenFilters,
  onUpload,
  sortBy,
  sortOrder,
  onSortChange,
  overrideMessage,
}) {
  const filterCount = Object.keys(filters).length;
  const showListTools = activeTab === 'exhibitors' && exhView === 'list';

  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary m-0">Companies</h1>
        {showListTools && (
          <p className="text-sm text-text-secondary mt-1">Total: {total} exhibitors</p>
        )}
      </div>

      {activeTab === 'exhibitors' && (
        <div className="flex gap-3 items-center flex-wrap justify-end">
          {eventId && <CreateCompanyButton eventId={eventId} />}
          <button type="button" className="btn btn-primary" onClick={onUpload}>
            <Upload size={16} style={{ marginRight: '0.5rem' }} />
            Upload CSV
          </button>
          {showListTools && (
            <>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="text"
                  placeholder="Search companies..."
                  className="w-48 lg:w-60 py-2 pr-4 pl-9 border border-border rounded-md text-sm outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10 focus:bg-white"
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                />
              </div>
              <ExhibitorListSortControls
                sortBy={sortBy}
                sortOrder={sortOrder}
                onChange={onSortChange}
                overrideMessage={overrideMessage}
              />
              <button
                type="button"
                className={`btn ${filterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
                onClick={onOpenFilters}
              >
                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                Filter {filterCount > 0 && `(${filterCount})`}
              </button>
              {filterCount > 0 && (
                <button type="button" className="btn btn-ghost btn-sm" onClick={onClearFilters}>
                  Clear
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
