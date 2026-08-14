import { Loader2 } from 'lucide-react';
import ExhibitorListRow from './ExhibitorListRow';

const COL_SPAN = 6;

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
            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
              Company
            </th>
            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
              Details
            </th>
            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
              Stall
            </th>
            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
              Category
            </th>
            <th className="bg-bg-secondary py-3 px-6 text-xs font-semibold uppercase text-text-secondary tracking-wider border-b border-border">
              Badges
            </th>
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
