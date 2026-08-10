import { Search, Loader2, Filter, RotateCcw, RefreshCw } from 'lucide-react';

/** SC Manage Users search actions. Reset only when filters/search are active. */
export default function ManageUsersSearchActions({
  showAdvancedFilters,
  onToggleFilters,
  onReset,
  onRefresh,
  isLoading,
  showReset = false,
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        type="button"
        onClick={onToggleFilters}
        className={`btn btn-secondary flex items-center gap-2 ${
          showAdvancedFilters ? 'bg-bg-secondary border-border-hover' : ''
        }`}
      >
        <Filter size={16} />
        Filters
      </button>
      {showReset && (
        <button
          type="button"
          onClick={onReset}
          className="btn btn-secondary flex items-center gap-2"
          disabled={isLoading}
          title="Clear filters"
        >
          <RotateCcw size={16} />
          Reset
        </button>
      )}
      <button
        type="button"
        onClick={onRefresh}
        className="btn btn-secondary flex items-center gap-2"
        disabled={isLoading}
        title="Reload users"
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <RefreshCw size={16} />
        )}
        Refresh
      </button>
      <button
        type="submit"
        className="btn btn-primary flex items-center gap-2 min-w-[120px]"
        disabled={isLoading}
      >
        {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
        Search
      </button>
    </div>
  );
}
