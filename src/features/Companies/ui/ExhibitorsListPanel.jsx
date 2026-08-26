import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { nextHeaderSort } from '../domain/companyListSort';
import ExhibitorListActionsBar from './ExhibitorListActionsBar';
import ExhibitorListToolbar from './ExhibitorListToolbar';
import ExhibitorListTable from './ExhibitorListTable';
import ExhibitorRowActionHost from './ExhibitorRowActionHost';

/**
 * Exhibitor list with multi-select + bulk remind / lock / feature.
 * Selection is owned by the parent (CompaniesPage) so the header Reports
 * modal can scope downloads/emails to selected rows.
 */
export default function ExhibitorsListPanel({
  eventId,
  token,
  companies,
  loading,
  error,
  page,
  onPageChange,
  onUpdated,
  search,
  onSearchChange,
  filters,
  onClearFilters,
  onRemoveFilter,
  onOpenFilters,
  sortBy,
  sortOrder,
  onSortChange,
  overrideMessage,
  selectedIds,
  allPageSelected,
  somePageSelected,
  toggle,
  togglePage,
  clear,
}) {
  const navigate = useNavigate();
  const [rowAction, setRowAction] = useState(null);

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">
          {error}
        </div>
      )}

      <ExhibitorListToolbar
        search={search}
        onSearchChange={onSearchChange}
        filters={filters}
        onClearFilters={onClearFilters}
        onRemoveFilter={onRemoveFilter}
        onOpenFilters={onOpenFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={onSortChange}
        overrideMessage={overrideMessage}
      />

      <ExhibitorListActionsBar
        eventId={eventId}
        token={token}
        companies={companies}
        selectedIds={selectedIds}
        onCleared={clear}
        onUpdated={onUpdated}
      />

      <ExhibitorListTable
        companies={companies}
        loading={loading}
        eventId={eventId}
        selectedIds={selectedIds}
        allPageSelected={allPageSelected}
        somePageSelected={somePageSelected}
        onToggle={toggle}
        onTogglePage={togglePage}
        onCompanyClick={(id) => navigate(`/event/${eventId}/companies/${id}`)}
        onNavigate={navigate}
        onRowAction={(type, company) => setRowAction({ type, company })}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onHeaderSort={(column) => {
          const next = nextHeaderSort(column, sortBy, sortOrder);
          onSortChange(next.sortBy, next.sortOrder);
        }}
      />

      <div className="flex justify-end items-center gap-4 mt-6">
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={page === 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>
        <span className="text-sm text-text-secondary">Page {page}</span>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          disabled={companies.length < 20 || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>

      <ExhibitorRowActionHost
        eventId={eventId}
        token={token}
        company={rowAction?.company}
        action={rowAction?.type}
        onClose={() => setRowAction(null)}
        onUpdated={onUpdated}
      />
    </>
  );
}
