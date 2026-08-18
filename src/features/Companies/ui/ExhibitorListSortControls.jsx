import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import {
  COMPANY_LIST_SORT_FIELDS,
  defaultOrderForSortBy,
} from '../domain/companyListSort';

const selectClass =
  'py-2 px-3 border border-border rounded-md text-sm bg-bg-primary outline-none transition-colors duration-200 focus:border-accent focus:ring-2 focus:ring-accent/10';

export default function ExhibitorListSortControls({
  sortBy,
  sortOrder,
  onChange,
  overrideMessage,
}) {
  return (
    <div className="flex items-center gap-1.5" title={overrideMessage || 'Sort exhibitors'}>
      <select
        aria-label="Sort companies by"
        className={selectClass}
        value={sortBy}
        onChange={(e) => {
          const nextBy = e.target.value;
          onChange(
            nextBy,
            nextBy === sortBy ? sortOrder : defaultOrderForSortBy(nextBy),
          );
        }}
      >
        {COMPANY_LIST_SORT_FIELDS.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        className="btn btn-secondary"
        aria-label={sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'}
        onClick={() => onChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
      >
        {sortOrder === 'asc' ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />}
      </button>
    </div>
  );
}
