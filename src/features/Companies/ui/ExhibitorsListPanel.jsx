import { useNavigate } from 'react-router-dom';
import { useExhibitorListSelection } from '../hooks/useExhibitorListSelection';
import ExhibitorRemindBar from './ExhibitorRemindBar';
import ExhibitorBulkActionBar from './ExhibitorBulkActionBar';
import ExhibitorListTable from './ExhibitorListTable';

/**
 * Exhibitor list with multi-select + bulk remind / lock / feature.
 * Step-scoped remind stays on company detail only.
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
}) {
  const navigate = useNavigate();
  const {
    selectedIds,
    allPageSelected,
    somePageSelected,
    toggle,
    togglePage,
    clear,
  } = useExhibitorListSelection(companies);

  return (
    <>
      {error && (
        <div className="bg-red-50 text-red-800 p-4 border border-red-200 rounded-md mb-6">
          {error}
        </div>
      )}

      <ExhibitorRemindBar
        eventId={eventId}
        token={token}
        selectedIds={selectedIds}
        onCleared={clear}
      />

      <ExhibitorBulkActionBar
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
    </>
  );
}
