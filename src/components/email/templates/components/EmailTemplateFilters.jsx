import { Search, X } from 'lucide-react';

const EmailTemplateFilters = ({
    searchInput,
    onSearchChange,
    filters,
    onFilterChange,
    filterOptions,
    onClear,
    hasActiveFilters,
}) => {
    const eventOptions = uniqueIds([
        ...(filterOptions.events || []),
        filters.event,
    ]).map((id) => ({
        value: String(id),
        label: `#${id}`,
    }));
    return (
        <div className="bg-bg-primary border border-border rounded-xl p-4 mb-4 shadow-sm space-y-3">
            <label className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                    Search
                </span>
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
                        size={16}
                    />
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search templates..."
                        className="input-field pl-9 w-full text-sm"
                    />
                </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <FilterSelect
                    label="Event"
                    value={filters.event}
                    onChange={(value) => onFilterChange('event', value)}
                    empty="All events"
                    options={eventOptions}
                />
                <FilterSelect
                    label="Name"
                    value={filters.name}
                    onChange={(value) => onFilterChange('name', value)}
                    empty="All names"
                    options={filterOptions.names || []}
                />
                <FilterSelect
                    label="Template Type"
                    value={filters.template_type}
                    onChange={(value) => onFilterChange('template_type', value)}
                    empty="All types"
                    options={filterOptions.template_types || []}
                />
                <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                        Status
                    </span>
                    <div className="flex gap-2">
                        <select
                            value={filters.is_active}
                            onChange={(e) => onFilterChange('is_active', e.target.value)}
                            className="input-field flex-1 text-sm py-2"
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={onClear}
                                className="px-3 rounded-lg border border-border text-text-tertiary hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors"
                                title="Clear filters"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </label>
            </div>
        </div>
    );
};

function FilterSelect({ label, value, onChange, empty, options }) {
    const items = options.map((opt) => (
        typeof opt === 'object' ? opt : { value: opt, label: opt }
    ));
    return (
        <label className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">
                {label}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-field w-full text-sm py-2"
            >
                <option value="">{empty}</option>
                {items.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </label>
    );
}

export default EmailTemplateFilters;

function uniqueIds(values) {
    return [...new Set(values.map((id) => String(id || '')).filter(Boolean))];
}
