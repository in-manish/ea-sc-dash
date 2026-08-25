import { Search, Filter, X } from 'lucide-react';
import ExhibitorListSortControls from './ExhibitorListSortControls';
import ExhibitorFilterChips from './ExhibitorFilterChips';

/**
 * Prominent find bar for the exhibitor list: search first, then sort and filter.
 * Applied filters render as dismissible chips under the search row.
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
    <div className="mb-2" role="search">
      <div className="rounded-lg border border-border bg-bg-tertiary p-2.5 shadow-sm">
        <div className="flex flex-col gap-2.5 md:flex-row md:items-center">
          <div className="relative min-w-0 flex-1">
            <Search
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-accent"
            />
            <input
              type="search"
              placeholder="Search companies by name, stall, or OBF…"
              aria-label="Search companies"
              className="h-12 w-full rounded-md border border-border-hover bg-bg-primary py-0 pl-11 pr-9 text-sm shadow-sm outline-none transition-colors duration-200 placeholder:text-text-tertiary focus:border-accent focus:ring-2 focus:ring-accent/15"
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

          <div className="flex h-12 shrink-0 flex-wrap items-center gap-2 md:flex-nowrap">
            <ExhibitorListSortControls
              sortBy={sortBy}
              sortOrder={sortOrder}
              onChange={onSortChange}
              overrideMessage={overrideMessage}
            />
            <button
              type="button"
              className={`btn h-12 ${filterCount > 0 ? 'btn-primary' : 'btn-secondary'}`}
              onClick={onOpenFilters}
            >
              <Filter size={16} style={{ marginRight: '0.5rem' }} />
              Filter {filterCount > 0 ? `(${filterCount})` : ''}
            </button>
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
    </div>
  );
}
