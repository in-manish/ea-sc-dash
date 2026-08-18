import { Loader2 } from 'lucide-react';
import ExhibitorListRow from './ExhibitorListRow';
import { isHeaderSortActive } from '../domain/companyListSort';

const COL_SPAN = 6;
const thClass =
  'bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border';

function SortHeader({ column, label, sortBy, sortOrder, onSortChange }) {
  const active = isHeaderSortActive(column, sortBy);
  return (
    <th className={thClass}>
      <button
        type="button"
        className={`inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer uppercase tracking-wider font-semibold ${
          active ? 'text-accent' : 'text-text-secondary hover:text-text-primary'
        }`}
        onClick={() => onSortChange(column)}
      >
        {label}
        {active && <span aria-hidden="true">{sortOrder === 'asc' ? '↑' : '↓'}</span>}
      </button>
    </th>
  );
}

export default function ExhibitorListTable({
  companies,
  loading,
  eventId,
  selectedIds,
  allPageSelected,
  somePageSelected,
  onToggle,
  onTogglePage,
  onCompanyClick,
  onNavigate,
  sortBy,
  sortOrder,
  onHeaderSort,
}) {
  return (
    <div className="bg-bg-primary border border-border rounded-lg overflow-x-auto shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr>
            <th className="bg-bg-secondary py-3 pl-4 pr-2 border-b border-border w-10">
              <input
                type="checkbox"
                className="w-4 h-4 accent-accent cursor-pointer"
                checked={allPageSelected}
                ref={(el) => {
                  if (el) el.indeterminate = somePageSelected && !allPageSelected;
                }}
                onChange={onTogglePage}
                disabled={loading || companies.length === 0}
                aria-label="Select all on this page"
                title="Select all on this page"
              />
            </th>
            <SortHeader
              column="company"
              label="Company"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onHeaderSort}
            />
            <SortHeader
              column="obf"
              label="Details"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onHeaderSort}
            />
            <SortHeader
              column="stall"
              label="Stall"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={onHeaderSort}
            />
            <th className={thClass}>Category</th>
            <th className={thClass}>Badges</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={COL_SPAN} className="text-center p-12 text-text-secondary">
                <Loader2 className="animate-spin text-accent mx-auto" size={24} />
              </td>
            </tr>
          ) : companies.length === 0 ? (
            <tr>
              <td colSpan={COL_SPAN} className="text-center p-12 text-text-secondary">
                No companies found.
              </td>
            </tr>
          ) : (
            companies.map((company) => (
              <ExhibitorListRow
                key={company.id}
                company={company}
                eventId={eventId}
                selected={selectedIds.has(company.id)}
                onToggle={onToggle}
                onCompanyClick={onCompanyClick}
                onNavigate={onNavigate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
