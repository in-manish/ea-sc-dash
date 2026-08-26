import { Search, Filter, X } from 'lucide-react';
import ExhibitorListSortControls from './ExhibitorListSortControls';
import ExhibitorFilterChips from './ExhibitorFilterChips';

/**
 * Table FIND chrome: search (primary), then filter, then sort.
 */
export default function ExhibitorListToolbar({
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
}) {
  const filterCount = Object.keys(filters).length;

  return (
    <div className="mb-3" role="search">
      <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            size={18}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary"
          />
          <input
            type="search"
            placeholder="Search companies by name, stall, or OBF…"
            aria-label="Search companies"
            className="h-12 w-full rounded-md border border-border bg-bg-primary py-0 pl-11 pr-9 text-sm outline-none transition-colors duration-200 placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/10"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search ? (
            <button
              type="button"
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-primary"
              onClick={() => onSearchChange('')}
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="flex h-12 shrink-0 items-center gap-2">
          <button
            type="button"
            className={`btn h-12 ${filterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onOpenFilters}
          >
            <Filter size={16} style={{ marginRight: '0.5rem' }} />
            Filter {filterCount > 0 ? `(${filterCount})` : ''}
          </button>
          <ExhibitorListSortControls
            sortBy={sortBy}
            sortOrder={sortOrder}
            onChange={onSortChange}
            overrideMessage={overrideMessage}
          />
        </div>
      </div>
      <ExhibitorFilterChips
        filters={filters}
        onRemoveFilter={onRemoveFilter}
        onClearFilters={onClearFilters}
      />
      {overrideMessage ? (
        <p className="mb-0 mt-2 text-xs text-text-tertiary">{overrideMessage}</p>
      ) : null}
    </div>
  );
}
