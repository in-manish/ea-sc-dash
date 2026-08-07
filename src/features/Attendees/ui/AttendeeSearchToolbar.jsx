import { Search, Filter, Globe, MapPin, X, ChevronDown } from 'lucide-react';
import { ACTION_BTN_STYLE } from '../constants';

const AttendeeSearchToolbar = ({
    search,
    onSearchChange,
    searchType,
    isSearchTypeOpen,
    setIsSearchTypeOpen,
    searchTypeRef,
    onSelectSearchType,
    filters,
    onOpenFilters,
    onClearAll,
}) => (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex flex-1 items-stretch min-w-0">
            <div className="relative flex-1 min-w-0">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
                <input
                    type="text"
                    placeholder="Search by name, email, phone, reg ID…"
                    style={{ height: 48, minHeight: 48, boxSizing: 'border-box' }}
                    className="w-full pl-11 pr-9 border border-border rounded-l-md rounded-r-none text-sm outline-none transition-colors duration-200 bg-bg-primary focus:border-accent focus:ring-2 focus:ring-accent/10"
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {search && (
                    <button
                        type="button"
                        aria-label="Clear search"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-0.5"
                        onClick={() => onSearchChange('')}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            <div className="relative" ref={searchTypeRef}>
                <button
                    type="button"
                    title={searchType === 'global' ? 'Global search' : 'Local search'}
                    aria-label={`Search type: ${searchType}`}
                    aria-expanded={isSearchTypeOpen}
                    onClick={() => setIsSearchTypeOpen((open) => !open)}
                    style={{ height: 48, minHeight: 48, boxSizing: 'border-box' }}
                    className="px-3.5 border border-l-0 border-border rounded-r-md bg-bg-primary text-text-secondary hover:text-accent hover:bg-bg-secondary transition-colors inline-flex items-center gap-1.5"
                >
                    {searchType === 'global' ? <Globe size={18} /> : <MapPin size={18} />}
                    <ChevronDown size={14} className={`transition-transform ${isSearchTypeOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSearchTypeOpen && (
                    <div className="absolute right-0 top-[calc(100%+4px)] z-30 min-w-[44px] bg-bg-primary border border-border rounded-lg shadow-lg overflow-hidden py-1">
                        <button
                            type="button"
                            title="Local search"
                            aria-label="Local search"
                            onClick={() => onSelectSearchType('local')}
                            className={`w-full flex items-center justify-center px-3 py-2.5 transition-colors ${
                                searchType === 'local'
                                    ? 'text-accent bg-accent/5'
                                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                            }`}
                        >
                            <MapPin size={16} />
                        </button>
                        <button
                            type="button"
                            title="Global search"
                            aria-label="Global search"
                            onClick={() => onSelectSearchType('global')}
                            className={`w-full flex items-center justify-center px-3 py-2.5 transition-colors ${
                                searchType === 'global'
                                    ? 'text-accent bg-accent/5'
                                    : 'text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
                            }`}
                        >
                            <Globe size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
            <button
                type="button"
                data-testid="filter-attendees-btn"
                style={ACTION_BTN_STYLE}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-all border ${
                    Object.keys(filters).length > 0
                        ? 'border-transparent bg-accent text-accent-text hover:bg-accent-hover'
                        : 'bg-bg-primary border-border text-text-primary hover:bg-bg-secondary hover:border-border-hover'
                }`}
                onClick={onOpenFilters}
            >
                <Filter size={16} style={{ marginRight: '0.5rem' }} />
                Filter{Object.keys(filters).length > 0 ? ` (${Object.keys(filters).length})` : ''}
            </button>
            {(Object.keys(filters).length > 0 || search) && (
                <button
                    type="button"
                    style={{ height: 48, minHeight: 48, boxSizing: 'border-box' }}
                    className="inline-flex items-center justify-center px-4 rounded-md text-sm font-medium text-text-secondary hover:bg-bg-secondary hover:text-text-primary transition-colors"
                    onClick={onClearAll}
                >
                    Clear
                </button>
            )}
        </div>
    </div>
);

export default AttendeeSearchToolbar;
