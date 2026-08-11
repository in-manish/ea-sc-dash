import { useMemo, useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { useChecklistReminderList } from '../hooks/useChecklistReminderList';
import ChecklistReminderFilters from './ChecklistReminderFilters';
import ChecklistReminderTable from './ChecklistReminderTable';
import ChecklistReminderSettingsForm from './ChecklistReminderSettingsForm';

const EMPTY_FILTERS = {
  company_ids: '',
  step_id: '',
  trigger: '',
  sent_at: '',
  sent_at_from: '',
  sent_at_to: '',
};

/**
 * Companies tab: reminder log (default) + reminder settings.
 * tab=checklist_reminder&cr_view=list|settings
 */
export default function ChecklistReminderTab({ eventId, token, view, onViewChange }) {
  const [draft, setDraft] = useState(EMPTY_FILTERS);
  const [applied, setApplied] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filters = useMemo(
    () => ({
      ...Object.fromEntries(
        Object.entries(applied).filter(([, v]) => v != null && String(v).trim() !== '')
      ),
      page,
      page_size: pageSize,
    }),
    [applied, page]
  );

  const { results, count, loading, error } = useChecklistReminderList({
    eventId,
    token,
    filters,
    enabled: view === 'list',
  });

  const totalPages = Math.max(1, Math.ceil((count || 0) / pageSize));

  const applyFilters = () => {
    setPage(1);
    setApplied({ ...draft });
  };

  const clearFilters = () => {
    setDraft(EMPTY_FILTERS);
    setApplied(EMPTY_FILTERS);
    setPage(1);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-bg-secondary border border-border rounded-lg inline-flex">
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              view === 'list'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => onViewChange('list')}
          >
            <Bell size={16} />
            Reminder log
          </button>
          <button
            type="button"
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${
              view === 'settings'
                ? 'bg-white text-accent shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
            onClick={() => onViewChange('settings')}
          >
            <Settings size={16} />
            Setup reminder
          </button>
        </div>
        {view === 'list' && (
          <p className="text-sm text-text-secondary m-0">
            {count} reminder{count === 1 ? '' : 's'}
          </p>
        )}
      </div>

      {view === 'settings' ? (
        <ChecklistReminderSettingsForm
          eventId={eventId}
          token={token}
          enabled={view === 'settings'}
        />
      ) : (
        <>
          <ChecklistReminderFilters
            draft={draft}
            onChange={setDraft}
            onApply={applyFilters}
            onClear={clearFilters}
          />
          <ChecklistReminderTable results={results} loading={loading} error={error} />
          {count > pageSize && (
            <div className="flex items-center justify-between mt-4">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
