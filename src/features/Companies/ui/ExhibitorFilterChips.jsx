import { X } from 'lucide-react';
import { buildExhibitorFilterChips } from '../domain/exhibitorListFilters';

/**
 * Dismissible chips for filters currently applied to the exhibitor list.
 */
export default function ExhibitorFilterChips({
  filters,
  onRemoveFilter,
  onClearFilters,
}) {
  const chips = buildExhibitorFilterChips(filters);
  if (!chips.length) return null;

  return (
    <div className="mt-2.5 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-accent/15 bg-bg-primary py-1 pl-2.5 pr-1.5 text-xs font-medium text-text-primary shadow-sm transition-colors hover:border-accent/40 hover:bg-bg-secondary"
          aria-label={`Remove ${chip.label} filter`}
          onClick={() => onRemoveFilter(chip.key)}
        >
          <span className="truncate">
            <span className="text-text-secondary">{chip.label}:</span> {chip.value}
          </span>
          <X size={12} className="shrink-0 text-text-tertiary" />
        </button>
      ))}
      <button
        type="button"
        className="btn btn-ghost btn-sm text-text-secondary"
        onClick={onClearFilters}
      >
        Clear all
      </button>
    </div>
  );
}
